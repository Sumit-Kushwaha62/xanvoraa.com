import { BetaAnalyticsDataClient } from '@google-analytics/data'

let client

export function getGA4Client() {
  if (client) return client

  const propertyId = process.env.GA4_PROPERTY_ID?.trim()
  const clientEmail = process.env.GA4_CLIENT_EMAIL?.trim()
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!propertyId || !clientEmail || !privateKey) {
    throw new Error('GA4 credentials are not configured')
  }

  client = new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  })

  return client
}

export function getGA4Property() {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim()
  if (!/^\d+$/.test(propertyId || '')) {
    const error = new Error('GA4_PROPERTY_ID must be a numeric property ID')
    error.code = 'GA4_CONFIG'
    throw error
  }
  return `properties/${propertyId}`
}