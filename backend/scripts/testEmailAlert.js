import 'dotenv/config'
import { sendFormAlert } from '../src/services/email.service.js'

try {
  const result = await sendFormAlert('contact', {
    timestamp: new Date().toISOString(),
    name: 'Pixel Labs Email Test',
    email: 'test@example.com',
    mobile: '+91 99999 00000',
    country: 'India',
    service: 'Website Development',
    budget: 'Test submission',
    message: 'This is a backend SMTP alert test.',
  })

  if (result.skipped) {
    console.log('Email alert skipped because SMTP configuration is incomplete.')
  } else {
    console.log('Test email alert sent successfully.')
    console.log('Message ID:', result.messageId)
  }
} catch (error) {
  console.error('Test email alert failed:', error.message)
  process.exitCode = 1
}
