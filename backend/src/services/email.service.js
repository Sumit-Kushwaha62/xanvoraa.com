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

  const emailConfig = getEmailConfig()
  const emailTransporter = getEmailTransporter()

  if (!emailConfig || !emailTransporter) {
    return {
      sent: false,
      skipped: true,
    }
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

  const info = await emailTransporter.sendMail({
    from: emailConfig.smtpUser,
    to: emailConfig.adminEmail,
    subject: formConfig.subject,
    text: [
      formConfig.subject,
      `Timestamp: ${timestamp}`,
      '',
      ...textFields,
    ].join('\n'),
    html: `
      <h2>${escapeHtml(formConfig.subject)}</h2>
      <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
      <table cellspacing="0" cellpadding="0">
        <tbody>${htmlFields.join('')}</tbody>
      </table>
    `,
  })

  return {
    sent: true,
    skipped: false,
    messageId: info.messageId,
  }
}
