import { readFile, unlink } from 'node:fs/promises'
import { sendFormAlert, sendTelegramAlert } from '../services/email.service.js'
import { appendFormRow } from '../services/googleSheets.service.js'
import { getSupabaseClient } from '../config/supabase.js'

function formatSheetTimestamp(isoString) {
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return isoString
  }
}

const SUCCESS_RESPONSE = {
  success: true,
  message: 'Form submitted successfully',
}

const LIMITS = {
  name: 100,
  email: 254,
  mobile: 20,
  country: 80,
  service: 100,
  budget: 80,
  position: 120,
  experience: 80,
  location: 120,
  portfolio: 500,
  resumeLink: 500,
  message: 3000,
}

function withTimeout(operation, timeoutMs, label) {
  let timeout
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeout = setTimeout(
      () => reject(new Error(`${label} timed out`)),
      timeoutMs,
    )
  })

  return Promise.race([Promise.resolve(operation), timeoutPromise])
    .finally(() => clearTimeout(timeout))
}

function runPostSubmissionTasks(tasks) {
  void Promise.allSettled(tasks).then(results => {
    results.forEach(result => {
      if (result.status === 'rejected') {
        console.error('Post-submission integration failed:', result.reason?.message || result.reason)
      }
    })
  })
}
function clean(value, maxLength = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function value(request, field) {
  return clean(request.body[field], LIMITS[field] || 1000)
}

function validEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(input)
}

function validMobile(input) {
  const digits = input.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}

function normalizeHttpUrl(input) {
  return /^www\./i.test(input) ? `https://${input}` : input
}
function validHttpUrl(input) {
  if (!input) return true

  try {
    const url = new URL(input)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validationError(response, fields, message = 'Please check the highlighted fields') {
  return response.status(400).json({
    success: false,
    message,
    fields: [...new Set(fields)],
  })
}

function validateRequired(data, requiredFields) {
  return requiredFields.filter(field => !data[field])
}

async function removeUploadedFile(file) {
  if (!file) return

  try {
    await unlink(file.path)
  } catch (error) {
    console.error('Unable to remove uploaded resume:', error.message)
  }
}

async function storeResume(file) {
  if (!file) return ''

  try {
    const bytes = await readFile(file.path)
    const { error } = await withTimeout(
      getSupabaseClient()
        .storage
        .from('career-resumes')
        .upload(file.filename, bytes, {
          contentType: 'application/pdf',
          upsert: false,
        }),
      20_000,
      'Resume storage',
    )

    if (error) throw error
    return file.filename
  } finally {
    await removeUploadedFile(file)
  }
}

async function removeStoredResume(filename) {
  if (!filename || /^https?:\/\//i.test(filename)) return

  try {
    const { error } = await getSupabaseClient()
      .storage
      .from('career-resumes')
      .remove([filename])

    if (error) throw error
  } catch (error) {
    console.error('Unable to remove stored resume:', error.message)
  }
}

async function sendAlertSafely(formType, data) {
  const emailAlert = sendFormAlert(formType, data)
    .then(result => {
      if (result.sent) console.log(formType + ' email alert sent successfully')
    })
    .catch(error => {
      console.error(formType + ' email alert failed:', error.message)
    })

  const telegramAlert = sendTelegramAlert(formType, data)
    .then(result => {
      if (result.sent) console.log(formType + ' Telegram alert sent successfully')
    })
    .catch(error => {
      console.error(formType + ' Telegram alert failed:', error.message)
    })

  await Promise.allSettled([emailAlert, telegramAlert])
}

async function insertSafely(table, data) {
  try {
    const { error } = await withTimeout(
      getSupabaseClient().from(table).insert(data),
      15_000,
      `${table} database insert`,
    )
    if (error) throw error
    return true
  } catch (error) {
    console.error(table + ' database insert failed:', error.message)
    return false
  }
}

export async function submitContactForm(request, response) {
  const contactData = {
    timestamp: new Date().toISOString(),
    name: value(request, 'name'),
    email: value(request, 'email').toLowerCase(),
    mobile: value(request, 'mobile'),
    country: value(request, 'country'),
    service: value(request, 'service'),
    budget: value(request, 'budget'),
    message: value(request, 'message'),
  }

  const invalid = validateRequired(contactData, [
    'name',
    'email',
    'mobile',
    'country',
    'service',
    'budget',
  ])

  if (contactData.email && !validEmail(contactData.email)) invalid.push('email')
  if (contactData.mobile && !validMobile(contactData.mobile)) invalid.push('mobile')
  if (invalid.length > 0) return validationError(response, invalid)

  const databaseSaved = await insertSafely('contact_submissions', {
    name: contactData.name,
    email: contactData.email,
    mobile: contactData.mobile,
    country: contactData.country,
    service: contactData.service,
    budget: contactData.budget,
    message: contactData.message,
    created_at: contactData.timestamp,
  })

  if (!databaseSaved) {
    return response.status(503).json({
      success: false,
      message: 'Unable to save your request. Please try again.',
    })
  }

  runPostSubmissionTasks([
    appendFormRow('contact', [
      formatSheetTimestamp(contactData.timestamp),
      contactData.name,
      contactData.email,
      contactData.mobile,
      contactData.country,
      contactData.service,
      contactData.budget,
      contactData.message,
    ]),
    sendAlertSafely('contact', contactData),
  ])

  return response.status(201).json(SUCCESS_RESPONSE)
}

export async function submitCareerForm(request, response) {
  const careerData = {
    timestamp: new Date().toISOString(),
    name: value(request, 'name'),
    email: value(request, 'email').toLowerCase(),
    mobile: value(request, 'mobile'),
    position: value(request, 'position'),
    experience: value(request, 'experience'),
    location: value(request, 'location'),
    portfolio: normalizeHttpUrl(value(request, 'portfolio')),
    externalResumeLink: normalizeHttpUrl(value(request, 'resumeLink')),
    message: value(request, 'message'),
  }

  const invalid = validateRequired(careerData, [
    'name',
    'email',
    'mobile',
    'position',
    'experience',
  ])

  if (careerData.email && !validEmail(careerData.email)) invalid.push('email')
  if (careerData.mobile && !validMobile(careerData.mobile)) invalid.push('mobile')
  if (!validHttpUrl(careerData.portfolio)) invalid.push('portfolio')
  if (!validHttpUrl(careerData.externalResumeLink)) invalid.push('resumeLink')

  if (invalid.length > 0) {
    await removeUploadedFile(request.file)
    return validationError(response, invalid)
  }

  let storedResumeReference = careerData.externalResumeLink

  if (request.file) {
    try {
      storedResumeReference = await storeResume(request.file)
    } catch (error) {
      console.error('Resume storage failed:', error.message)
      return response.status(503).json({
        success: false,
        message: 'Unable to store the resume. Please try again.',
      })
    }
  }

  const alertData = {
    ...careerData,
    resumeLink: storedResumeReference && !/^https?:\/\//i.test(storedResumeReference)
      ? 'Stored securely. Open the application in the admin dashboard.'
      : storedResumeReference,
  }

  const databaseSaved = await insertSafely('career_submissions', {
    name: careerData.name,
    email: careerData.email,
    mobile: careerData.mobile,
    position: careerData.position,
    experience: careerData.experience,
    location: careerData.location,
    portfolio: careerData.portfolio,
    resume_url: storedResumeReference,
    message: careerData.message,
    created_at: careerData.timestamp,
  })

  if (!databaseSaved) {
    await removeStoredResume(storedResumeReference)
    return response.status(503).json({
      success: false,
      message: 'Unable to save your application. Please try again.',
    })
  }

  runPostSubmissionTasks([
    appendFormRow('career', [
      formatSheetTimestamp(careerData.timestamp),
      careerData.name,
      careerData.email,
      careerData.mobile,
      careerData.position,
      careerData.experience,
      careerData.location,
      careerData.portfolio,
      alertData.resumeLink,
      careerData.message,
    ]),
    sendAlertSafely('career', alertData),
  ])

  return response.status(201).json(SUCCESS_RESPONSE)
}

export async function submitNewsletterForm(request, response) {
  const email = value(request, 'email').toLowerCase()

  if (!email || !validEmail(email)) {
    return validationError(response, ['email'], 'Please enter a valid email address')
  }

  const timestamp = new Date().toISOString()
  const databaseSaved = await insertSafely('newsletter_subs', {
    email,
    created_at: timestamp,
  })

  if (!databaseSaved) {
    return response.status(503).json({
      success: false,
      message: 'Unable to subscribe right now. Please try again.',
    })
  }

  runPostSubmissionTasks([
    appendFormRow('newsletter', [formatSheetTimestamp(timestamp), email]),
    sendAlertSafely('newsletter', { timestamp, email }),
  ])

  return response.status(201).json(SUCCESS_RESPONSE)
}