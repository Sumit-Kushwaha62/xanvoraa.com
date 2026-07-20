import { getEmailConfig, getEmailTransporter } from '../config/email.js'

const FORM_CONFIG = {
  contact: {
    subject: 'New Contact Form Submission',
    fields: [
      ['Name', 'name'],
      ['Email', 'email'],
      ['Mobile', 'mobile'],
      ['Country', 'country'],
      ['Service', 'service'],
      ['Budget', 'budget'],
      ['Message', 'message'],
    ],
  },
  career: {
    subject: 'New Career Application',
    fields: [
      ['Name', 'name'],
      ['Email', 'email'],
      ['Mobile', 'mobile'],
      ['Position', 'position'],
      ['Experience', 'experience'],
      ['Location', 'location'],
      ['Portfolio', 'portfolio'],
      ['Resume Link', 'resumeLink'],
      ['Message', 'message'],
    ],
  },
  newsletter: {
    subject: 'New Newsletter Subscriber',
    fields: [['Email', 'email']],
  },
}

function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not provided'
  }

  return String(value)
}

function escapeHtml(value) {
  return displayValue(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export async function sendFormAlert(formType, data) {
  const formConfig = FORM_CONFIG[formType]

  if (!formConfig) {
    throw new Error(`Unsupported email alert form type: ${formType}`)
  }

  const timestamp = data.timestamp || new Date().toISOString()
  const textFields = formConfig.fields.map(
    ([label, key]) => `${label}: ${displayValue(data[key])}`,
  )
  const htmlFields = formConfig.fields.map(
    ([label, key]) =>
      `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th>` +
      `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(data[key])}</td></tr>`,
  )

  const textBody = [
    formConfig.subject,
    `Timestamp: ${timestamp}`,
    '',
    ...textFields,
  ].join('\n')

  const htmlBody = `
    <h2>${escapeHtml(formConfig.subject)}</h2>
    <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
    <table cellspacing="0" cellpadding="0">
      <tbody>${htmlFields.join('')}</tbody>
    </table>
  `

  const resendApiKey = process.env.RESEND_API_KEY?.trim()
  const adminEmail = process.env.ADMIN_ALERT_EMAIL?.trim()

  if (resendApiKey) {
    if (!adminEmail) {
      throw new Error('ADMIN_ALERT_EMAIL is not configured')
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev'

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [adminEmail],
        subject: formConfig.subject,
        text: textBody,
        html: htmlBody,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    return {
      sent: true,
      skipped: false,
      messageId: result.id,
    }
  }

  // Fallback to SMTP
  const emailConfig = getEmailConfig()
  const emailTransporter = getEmailTransporter()

  if (!emailConfig || !emailTransporter) {
    return {
      sent: false,
      skipped: true,
    }
  }

  const info = await emailTransporter.sendMail({
    from: emailConfig.smtpUser,
    to: emailConfig.adminEmail,
    subject: formConfig.subject,
    text: textBody,
    html: htmlBody,
  })

  return {
    sent: true,
    skipped: false,
    messageId: info.messageId,
  }
}

export async function sendTelegramAlert(formType, data) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!telegramBotToken || !telegramChatId) {
    return {
      sent: false,
      skipped: true,
    }
  }

  const formConfig = FORM_CONFIG[formType]
  if (!formConfig) {
    throw new Error(`Unsupported Telegram alert form type: ${formType}`)
  }

  const timestamp = data.timestamp || new Date().toISOString()
  const textFields = formConfig.fields.map(
    ([label, key]) => `${label}: ${displayValue(data[key])}`,
  )

  const textBody = [
    formConfig.subject,
    `Timestamp: ${timestamp}`,
    '',
    ...textFields,
  ].join('\n')

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: textBody,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Telegram API error: ${response.status} - ${errorText}`)
  }

  return {
    sent: true,
    skipped: false,
  }
}
