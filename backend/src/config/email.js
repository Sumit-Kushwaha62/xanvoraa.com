import nodemailer from 'nodemailer'

const requiredEmailEnv = [
  'ADMIN_ALERT_EMAIL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
]

let transporter
let warningLogged = false

export function getEmailConfig() {
  const missingVariables = requiredEmailEnv.filter(name => !process.env[name] || !process.env[name].trim())

  if (missingVariables.length > 0) {
    if (!warningLogged) {
      console.warn(
        `Email alerts disabled. Missing environment variables: ${missingVariables.join(', ')}`,
      )
      warningLogged = true
    }

    return null
  }

  const host = process.env.SMTP_HOST.trim()
  let pass = process.env.SMTP_PASS.trim()

  // Automatically remove spaces from Gmail App Passwords (e.g. "zrao lxpg ezyr toic" -> "zraolxpgezyrtoic")
  if (host === 'smtp.gmail.com') {
    pass = pass.replace(/\s+/g, '')
  }

  return {
    adminEmail: process.env.ADMIN_ALERT_EMAIL.trim(),
    smtpUser: process.env.SMTP_USER.trim(),
    transport: {
      host,
      port: Number(process.env.SMTP_PORT.trim()),
      secure: process.env.SMTP_SECURE.trim() === 'true',
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    },
  }
}

export function getEmailTransporter() {
  const emailConfig = getEmailConfig()

  if (!emailConfig) {
    return null
  }

  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig.transport)
  }

  return transporter
}
