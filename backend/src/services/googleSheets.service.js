import { getGoogleSheetsClient } from '../config/googleSheets.js'

const SHEET_RANGES = {
  contact: "'Contact Requests'!A:H",
  career: "'Career Applications'!A:J",
  newsletter: "'Newsletter Subscribers'!A:B",
}

function safeSheetValue(value) {
  if (typeof value !== 'string') return value
  return /^[\s]*[=+\-@]/.test(value) ? "'" + value : value
}

function forceTextValue(value) {
  if (typeof value !== 'string' || value === '') return value
  return "'" + value
}

export async function appendFormRow(formType, values) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = SHEET_RANGES[formType]

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID is not configured')
  }

  if (!range) {
    throw new Error('Unsupported form type: ' + formType)
  }

  const sheets = getGoogleSheetsClient()

  if (!sheets) {
    console.warn('Google Sheets client is not initialized. Skipping append.')
    return {
      success: false,
      skipped: true,
    }
  }

  const processedValues = values.map((val, index) => {
    if ((formType === 'contact' || formType === 'career') && index === 3) {
      return forceTextValue(val)
    }
    return safeSheetValue(val)
  })

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [processedValues],
    },
  }, { timeout: 15_000 })
}