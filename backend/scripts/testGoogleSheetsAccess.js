import 'dotenv/config'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { google } from 'googleapis'

const spreadsheetId = process.env.GOOGLE_SHEET_ID
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
const resolvedCredentialsPath = credentialsPath
  ? path.resolve(process.cwd(), credentialsPath)
  : ''
const credentialsExist = Boolean(
  resolvedCredentialsPath && existsSync(resolvedCredentialsPath),
)

console.log('process.cwd():', process.cwd())
console.log('GOOGLE_SHEET_ID:', spreadsheetId || '')
console.log('GOOGLE_SHEET_ID length:', spreadsheetId?.length || 0)
console.log('GOOGLE_APPLICATION_CREDENTIALS:', resolvedCredentialsPath)
console.log('Credential file exists:', credentialsExist)

if (!spreadsheetId) {
  throw new Error('GOOGLE_SHEET_ID is not configured')
}

if (!credentialsExist) {
  throw new Error('Google service account credential file does not exist')
}

const credentials = JSON.parse(readFileSync(resolvedCredentialsPath, 'utf8'))

console.log('client_email:', credentials.client_email || '')

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({
  version: 'v4',
  auth,
})

try {
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  })

  console.log('Spreadsheet title:', response.data.properties?.title || '')
  console.log(
    'Sheet tabs:',
    response.data.sheets?.map(sheet => sheet.properties?.title) || [],
  )
} catch (error) {
  const googleError = error.response?.data?.error

  console.error('Google Sheets access failed')
  console.error('HTTP status:', error.response?.status || error.status || '')
  console.error('Code:', googleError?.code || error.code || '')
  console.error('Message:', googleError?.message || error.message || '')
  console.error('Status:', googleError?.status || '')
  console.error('Details:', JSON.stringify(googleError?.details || [], null, 2))
  process.exitCode = 1
}
