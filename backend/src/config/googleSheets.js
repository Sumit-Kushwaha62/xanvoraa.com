import { google } from 'googleapis'

const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

let sheetsClient

export function getGoogleSheetsClient() {
  if (sheetsClient) {
    return sheetsClient
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (!credentialsPath) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not configured')
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: [GOOGLE_SHEETS_SCOPE],
  })

  sheetsClient = google.sheets({
    version: 'v4',
    auth,
  })

  return sheetsClient
}
