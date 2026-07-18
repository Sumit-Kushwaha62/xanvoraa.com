import 'dotenv/config'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { google } from 'googleapis'

const targetName = 'Pixel lab Software Solutions Data Collections'
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
const resolvedCredentialsPath = credentialsPath
  ? path.resolve(process.cwd(), credentialsPath)
  : ''

if (!resolvedCredentialsPath || !existsSync(resolvedCredentialsPath)) {
  throw new Error('Google service account credential file does not exist')
}

const credentials = JSON.parse(readFileSync(resolvedCredentialsPath, 'utf8'))

console.log('client_email:', credentials.client_email || '')
console.log('Searching Google Drive for:', targetName)

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
})

const drive = google.drive({
  version: 'v3',
  auth,
})

try {
  const response = await drive.files.list({
    q: `name = '${targetName.replaceAll("'", "\\'")}' and trashed = false`,
    spaces: 'drive',
    fields: 'files(id,name,mimeType,webViewLink)',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  })

  const files = response.data.files || []

  console.log('Matched files:', files.length)

  for (const file of files) {
    console.log({
      id: file.id || '',
      name: file.name || '',
      mimeType: file.mimeType || '',
      webViewLink: file.webViewLink || '',
    })
  }
} catch (error) {
  const googleError = error.response?.data?.error

  console.error('Google Drive search failed')
  console.error('HTTP status:', error.response?.status || error.status || '')
  console.error('Code:', googleError?.code || error.code || '')
  console.error('Message:', googleError?.message || error.message || '')
  console.error('Status:', googleError?.status || '')
  console.error('Details:', JSON.stringify(googleError?.details || [], null, 2))
  process.exitCode = 1
}
