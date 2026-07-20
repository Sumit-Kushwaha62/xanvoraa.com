import 'dotenv/config'
import { sendTelegramAlert } from '../src/services/email.service.js'

try {
  const result = await sendTelegramAlert('contact', {
    timestamp: new Date().toISOString(),
    name: 'Xanvoraa Telegram Test',
    email: 'test@example.com',
    mobile: '+91 99999 00000',
    country: 'India',
    service: 'Website Development',
    budget: 'Test submission',
    message: 'This is a backend Telegram alert test.',
  })

  if (result.skipped) {
    console.log('Telegram alert skipped because TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured.')
  } else {
    console.log('Test Telegram alert sent successfully.')
  }
} catch (error) {
  console.error('Test Telegram alert failed:', error.message)
  process.exitCode = 1
}
