import { google } from 'googleapis'

const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

let sheetsClient

export function getGoogleSheetsClient() {
  if (sheetsClient) {
    return sheetsClient
  }

  const authOptions = {
    scopes: [GOOGLE_SHEETS_SCOPE],
  }

  const serviceAccountKeys = process.env.GOOGLE_SERVICE_ACCOUNT_KEYS?.trim()
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()

  if (serviceAccountKeys) {
    try {
      authOptions.credentials = JSON.parse(serviceAccountKeys)
    } catch (error) {
      console.error('Invalid GOOGLE_SERVICE_ACCOUNT_KEYS JSON string:', error.message)
      return null
    }
  } else if (credentialsPath) {
    authOptions.keyFile = credentialsPath
  } else {
    // If not configured, fail gracefully instead of crashing
    return null
  }

  try {
    const auth = new google.auth.GoogleAuth(authOptions)
    sheetsClient = google.sheets({
      version: 'v4',
      auth,
    })
    return sheetsClient
  } catch (error) {
    console.error('Failed to create Google Sheets auth client:', error.message)
    return null
  }
}
