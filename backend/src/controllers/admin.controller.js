import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getSupabaseClient } from '../config/supabase.js'
import { ADMIN_COOKIE_NAME, JWT_OPTIONS } from '../middleware/adminAuth.js'
function cookieOptions(includeMaxAge = true) {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    ...(includeMaxAge ? { maxAge: 28800000 } : {}),
    path: '/',
    priority: 'high',
  }
}
const emailOf = value => typeof value === 'string' ? value.trim().toLowerCase() : ''

function strongPassword(value) {
  return (
    value.length >= 12 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  )
}
export async function login(req, res) {
  const email = emailOf(req.body.email)
  const password = typeof req.body.password === 'string' ? req.body.password : ''
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' })
  try {
    const db = getSupabaseClient()
    const { data: admin, error } = await db.from('admin_users').select('id,email,password_hash,role').eq('email', email).maybeSingle()
    if (error) throw error
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) return res.status(401).json({ success: false, message: 'Invalid email or password' })
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { ...JWT_OPTIONS, expiresIn: '8h' },
    )
    res.cookie(ADMIN_COOKIE_NAME, token, cookieOptions())
    return res.json({ success: true, admin: { id: admin.id, email: admin.email, role: admin.role } })
  } catch (error) { console.error('Admin login failed:', error.message); return res.status(500).json({ success: false, message: 'Something went wrong' }) }
}
export function logout(_req, res) {
  res.clearCookie(ADMIN_COOKIE_NAME, cookieOptions(false))
  return res.json({ success: true })
}
export function getCurrentAdmin(req, res) {
  return res.json({ email: req.admin.email, role: req.admin.role })
}
export async function changePassword(req, res) {
  const current = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : ''
  const next = typeof req.body.newPassword === 'string' ? req.body.newPassword : ''
  if (!current || !strongPassword(next)) return res.status(400).json({ success: false, message: 'New password must be at least 12 characters and include uppercase, lowercase, number and symbol' })
  try {
    const db = getSupabaseClient()
    const { data, error } = await db.from('admin_users').select('id,password_hash').eq('id', req.admin.sub).single()
    if (error) throw error
    if (!(await bcrypt.compare(current, data.password_hash))) return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    const password_hash = await bcrypt.hash(next, 12)
    const { error: updateError } = await db.from('admin_users').update({ password_hash }).eq('id', data.id)
    if (updateError) throw updateError
    res.clearCookie(ADMIN_COOKIE_NAME, cookieOptions(false))
    return res.json({ success: true, message: 'Password changed. Please sign in again.' })
  } catch (error) { console.error('Password change failed:', error.message); return res.status(500).json({ success: false, message: 'Something went wrong' }) }
}
function pagination(req) {
  const p = Number.parseInt(req.query.page, 10), l = Number.parseInt(req.query.limit, 10)
  const page = p > 0 ? p : 1, limit = l > 0 ? Math.min(l, 100) : 20
  return { page, limit, start: (page - 1) * limit }
}
function dates(query, req) {
  if (req.query.from) query = query.gte('created_at', req.query.from)
  if (req.query.to) query = query.lte('created_at', req.query.to)
  return query
}
function search(query, req, columns) {
  const term = typeof req.query.search === 'string'
    ? req.query.search.trim().replaceAll(/[%,()]/g, '')
    : ''
  if (!term || columns.length === 0) return query
  return query.or(columns.map(column => `${column}.ilike.%${term}%`).join(','))
}
const list = (table, searchColumns = []) => async (req, res) => {
  try {
    const { page, limit, start } = pagination(req)
    let query = getSupabaseClient().from(table).select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(start, start + limit - 1)
    query = dates(query, req)
    query = search(query, req, searchColumns)
    const { data, count, error } = await query
    if (error) throw error
    return res.json({ success: true, data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) } })
  } catch (error) { console.error(`Unable to list ${table}:`, error.message); return res.status(500).json({ success: false, message: 'Unable to load data' }) }
}
export const listContacts = list('contact_submissions', ['name', 'email', 'mobile', 'country', 'service', 'budget', 'message'])
export const listCareers = list('career_submissions', ['name', 'email', 'mobile', 'position', 'experience', 'location', 'portfolio', 'message'])
export const listNewsletter = list('newsletter_subs', ['email'])
export const listConversations = list('chatbot_conversations', ['session_id'])
export async function getConversation(req, res) {
  try {
    const { data, error } = await getSupabaseClient().from('chatbot_conversations').select('*').eq('session_id', req.params.sessionId).maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ success: false, message: 'Conversation not found' })
    return res.json({ success: true, data })
  } catch (error) { console.error('Unable to load conversation:', error.message); return res.status(500).json({ success: false, message: 'Unable to load data' }) }
}
export async function getStats(_req, res) {
  try {
    const db = getSupabaseClient()
    const tables = ['contact_submissions', 'career_submissions', 'newsletter_subs', 'chatbot_conversations']
    const results = await Promise.all(tables.map(table => db.from(table).select('*', { count: 'exact', head: true })))
    const failed = results.find(result => result.error); if (failed) throw failed.error
    return res.json({ success: true, data: { totalContacts: results[0].count || 0, totalCareerApps: results[1].count || 0, totalNewsletterSubs: results[2].count || 0, totalChatbotSessions: results[3].count || 0 } })
  } catch (error) { console.error('Unable to load stats:', error.message); return res.status(500).json({ success: false, message: 'Unable to load stats' }) }
}

export async function downloadResume(req, res) {
  const filename =
    typeof req.params.filename === 'string' ? req.params.filename : ''

  if (!/^[0-9a-f-]{36}\.pdf$/i.test(filename)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid resume reference',
    })
  }

  try {
    const { data, error } = await getSupabaseClient()
      .storage
      .from('career-resumes')
      .download(filename)

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      })
    }

    const bytes = Buffer.from(await data.arrayBuffer())
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="candidate-resume.pdf"')
    res.setHeader('Cache-Control', 'private, no-store')
    return res.send(bytes)
  } catch (error) {
    console.error('Unable to download resume:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to download resume',
    })
  }
}