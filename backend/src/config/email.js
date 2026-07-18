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
  const missingVariables = requiredEmailEnv.filter(name => !process.env[name])

  if (missingVariables.length > 0) {
    if (!warningLogged) {
      console.warn(
        `Email alerts disabled. Missing environment variables: ${missingVariables.join(', ')}`,
      )
      warningLogged = true
    }

    return null
  }

  return {
    adminEmail: process.env.ADMIN_ALERT_EMAIL,
    smtpUser: process.env.SMTP_USER,
    transport: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
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
