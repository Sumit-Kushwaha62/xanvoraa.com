import { getGA4Client, getGA4Property } from '../config/ga4.js'

const allowedDays = new Set([7, 14, 30])

function dateRange(req) {
  const requestedDays = Number.parseInt(req.query.days, 10)
  const days = allowedDays.has(requestedDays) ? requestedDays : 30
  return [{ startDate: `${days - 1}daysAgo`, endDate: 'today' }]
}

function numberValue(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function metric(row, index = 0) {
  return numberValue(row?.metricValues?.[index]?.value)
}

function dimension(row, index = 0) {
  return row?.dimensionValues?.[index]?.value || ''
}

async function run(req, report) {
  const [response] = await getGA4Client().runReport({
    property: getGA4Property(),
    dateRanges: dateRange(req),
    ...report,
  })
  return response
}

function failure(res, label, error) {
  console.error(`${label}:`, error.message)

  if (error.code === 'GA4_CONFIG') {
    return res.status(503).json({
      success: false,
      message: 'GA4 setup is incomplete. Configure a numeric GA4_PROPERTY_ID on the backend.',
    })
  }

  if (Number(error.code) === 7 && /has not been used|disabled/i.test(error.message)) {
    return res.status(503).json({
      success: false,
      message: 'Google Analytics Data API is disabled for this Google Cloud project. Enable it, then refresh.',
    })
  }

  if (Number(error.code) === 7) {
    return res.status(403).json({
      success: false,
      message: 'The GA4 service account does not have access to this Analytics property.',
    })
  }

  if (Number(error.code) === 3) {
    return res.status(503).json({
      success: false,
      message: 'The configured GA4 property ID is invalid.',
    })
  }

  return res.status(500).json({
    success: false,
    message: 'Unable to load visitor analytics',
  })
}

export async function getSummary(req, res) {
  try {
    const response = await run(req, {
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'userEngagementDuration' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
      ],
    })
    const row = response.rows?.[0]
    const activeUsers = metric(row, 0)
    const engagementDuration = metric(row, 3)
    return res.json({
      success: true,
      data: {
        activeUsers,
        newUsers: metric(row, 1),
        sessions: metric(row, 2),
        averageEngagementTime: activeUsers ? engagementDuration / activeUsers : 0,
        screenPageViews: metric(row, 4),
        bounceRate: metric(row, 5),
      },
    })
  } catch (error) {
    return failure(res, 'Unable to load GA4 summary', error)
  }
}

export async function getTimeseries(req, res) {
  try {
    const response = await run(req, {
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    })
    const data = (response.rows || []).map(row => ({
      date: dimension(row),
      value: metric(row),
    }))
    return res.json({ success: true, data })
  } catch (error) {
    return failure(res, 'Unable to load GA4 timeseries', error)
  }
}

export async function getTopPages(req, res) {
  try {
    const response = await run(req, {
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    })
    const data = (response.rows || []).map(row => ({
      pagePath: dimension(row),
      views: metric(row),
    }))
    return res.json({ success: true, data })
  } catch (error) {
    return failure(res, 'Unable to load GA4 top pages', error)
  }
}

export async function getTopReferrers(req, res) {
  try {
    const response = await run(req, {
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    })
    const data = (response.rows || []).map(row => ({
      sessionSource: dimension(row),
      sessions: metric(row),
    }))
    return res.json({ success: true, data })
  } catch (error) {
    return failure(res, 'Unable to load GA4 referrers', error)
  }
}

export async function getDevices(req, res) {
  try {
    const response = await run(req, {
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    })
    const data = (response.rows || []).map(row => ({
      deviceCategory: dimension(row),
      sessions: metric(row),
    }))
    return res.json({ success: true, data })
  } catch (error) {
    return failure(res, 'Unable to load GA4 devices', error)
  }
}

export async function getCountries(req, res) {
  try {
    const response = await run(req, {
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    })
    const data = (response.rows || []).map(row => ({
      country: dimension(row),
      sessions: metric(row),
    }))
    return res.json({ success: true, data })
  } catch (error) {
    return failure(res, 'Unable to load GA4 countries', error)
  }
}