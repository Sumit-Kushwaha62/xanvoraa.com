import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Clock3,
  Eye,
  MousePointerClick,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react'
import { API_ENDPOINTS, getAdminHeaders } from '../config/api'

const DEVICE_COLORS = ['#6c63ff', '#00c9a0', '#38bdf8', '#f59e0b', '#f43f5e']

async function readJson(response) {
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.message || 'Unable to load visitor analytics')
  return result
}

function relativeTime(value) {
  if (!value) return 'Not yet'
  const seconds = Math.max(1, Math.floor((Date.now() - value.getTime()) / 1000))
  if (seconds < 60) return seconds + 's ago'
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
  return Math.floor(seconds / 3600) + 'h ago'
}

function formatDuration(value) {
  const seconds = Math.max(0, Math.round(Number(value) || 0))
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return minutes ? minutes + 'm ' + remainder + 's' : remainder + 's'
}

function formatGaDate(value) {
  if (!/^\d{8}$/.test(value || '')) return value
  const date = new Date(
    Number(value.slice(0, 4)),
    Number(value.slice(4, 6)) - 1,
    Number(value.slice(6, 8)),
  )
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function PageviewsChart({ points }) {
  const width = 760
  const height = 230
  const paddingX = 22
  const paddingY = 22
  const max = Math.max(1, ...points.map(point => point.value))
  const coordinates = points.map((point, index) => ({
    ...point,
    x: paddingX + (index * (width - paddingX * 2)) / Math.max(1, points.length - 1),
    y: height - paddingY - (point.value / max) * (height - paddingY * 2),
  }))
  const line = coordinates.map(point => point.x + ',' + point.y).join(' ')
  const area = paddingX + ',' + (height - paddingY) + ' ' + line + ' ' +
    (width - paddingX) + ',' + (height - paddingY)

  return (
    <div className="admin-chart-shell">
      <svg className="admin-line-chart" viewBox={'0 0 ' + width + ' ' + height} role="img" aria-label="Pageviews over time">
        <defs>
          <linearGradient id="visitorChartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map(level => (
          <line
            key={level}
            x1={paddingX}
            x2={width - paddingX}
            y1={height - paddingY - level * (height - paddingY * 2)}
            y2={height - paddingY - level * (height - paddingY * 2)}
            className="admin-chart-gridline"
          />
        ))}
        <polygon points={area} fill="url(#visitorChartArea)" />
        <polyline points={line} className="admin-chart-line" />
        {coordinates.map(point => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="4" className="admin-chart-point" />
            <title>{formatGaDate(point.date) + ': ' + point.value}</title>
          </g>
        ))}
      </svg>
      <div className="admin-chart-labels">
        {points.map((point, index) => (
          <span key={point.date} className={index % Math.ceil(points.length / 7) === 0 ? '' : 'admin-chart-label--muted'}>
            {formatGaDate(point.date)}
          </span>
        ))}
      </div>
    </div>
  )
}

function RankedList({ items, labelKey, valueKey, emptyMessage }) {
  return (
    <div className="admin-activity-list">
      {items.length === 0 && <div className="admin-state">{emptyMessage}</div>}
      {items.map((item, index) => (
        <div className="admin-activity-item" key={(item[labelKey] || 'unknown') + index}>
          <span className="admin-activity-item__dot" style={{ background: DEVICE_COLORS[index % DEVICE_COLORS.length] }} />
          <div>
            <strong>{item[labelKey] || 'Unknown'}</strong>
            <span>Rank #{index + 1}</span>
          </div>
          <time>{Number(item[valueKey] || 0).toLocaleString()}</time>
        </div>
      ))}
    </div>
  )
}

export default function AdminVisitors() {
  const [period, setPeriod] = useState(30)
  const [data, setData] = useState({
    summary: {},
    timeseries: [],
    topPages: [],
    topReferrers: [],
    devices: [],
    countries: [],
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      const query = '?days=' + period
      const endpoints = API_ENDPOINTS.admin.analytics
      const request = endpoint => fetch(endpoint + query, {
        credentials: 'include',
        headers: { ...getAdminHeaders() },
      }).then(readJson)
      const results = await Promise.all([
        request(endpoints.summary),
        request(endpoints.timeseries),
        request(endpoints.topPages),
        request(endpoints.topReferrers),
        request(endpoints.devices),
        request(endpoints.countries),
      ])
      setData({
        summary: results[0].data || {},
        timeseries: results[1].data || [],
        topPages: results[2].data || [],
        topReferrers: results[3].data || [],
        devices: results[4].data || [],
        countries: results[5].data || [],
      })
      setUpdatedAt(new Date())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [period])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const devices = useMemo(() => data.devices.map((device, index) => ({
    ...device,
    color: DEVICE_COLORS[index % DEVICE_COLORS.length],
  })), [data.devices])
  const totalDeviceSessions = devices.reduce((sum, device) => sum + device.sessions, 0)
  let angle = 0
  const donutStops = devices.map(device => {
    const start = angle
    angle += totalDeviceSessions ? (device.sessions / totalDeviceSessions) * 360 : 0
    return device.color + ' ' + start + 'deg ' + angle + 'deg'
  }).join(', ')

  const cards = [
    { label: 'Active users', value: data.summary.activeUsers, icon: Users, tone: 'violet' },
    { label: 'Sessions', value: data.summary.sessions, icon: MousePointerClick, tone: 'green' },
    { label: 'Pageviews', value: data.summary.screenPageViews, icon: Eye, tone: 'blue' },
    { label: 'Avg. engagement', value: formatDuration(data.summary.averageEngagementTime), icon: Clock3, tone: 'amber', formatted: true },
    { label: 'Bounce rate', value: ((Number(data.summary.bounceRate) || 0) * 100).toFixed(1) + '%', icon: TrendingUp, tone: 'violet', formatted: true },
  ]

  if (loading) return <div className="admin-state admin-state--loading">Preparing visitor analytics...</div>
  if (error) return (
    <div className="admin-state admin-state--error">
      <p>{error}</p>
      <button className="admin-btn admin-btn--primary" onClick={() => load()}>Try again</button>
    </div>
  )

  return (
    <div className="admin-overview">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Google Analytics 4</span>
          <h1>Visitor analytics</h1>
          <p>Understand traffic, engagement and audience composition.</p>
        </div>
        <div className="admin-page-heading__actions">
          <span className="admin-last-sync">Updated {relativeTime(updatedAt)}</span>
          <button className="admin-btn admin-btn--refresh" onClick={() => load(true)} disabled={refreshing}>
            <RefreshCw size={15} className={refreshing ? 'admin-spin' : ''} />
            {refreshing ? 'Refreshing' : 'Refresh data'}
          </button>
        </div>
      </div>

      <div className="admin-kpi-grid">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <article className={'admin-kpi-card admin-kpi-card--' + card.tone} key={card.label}>
              <div className="admin-kpi-card__top">
                <span className="admin-kpi-card__icon"><Icon size={20} /></span>
                <span className="admin-kpi-card__trend"><TrendingUp size={13} /> GA4</span>
              </div>
              <strong>{card.formatted ? card.value : Number(card.value || 0).toLocaleString()}</strong>
              <span>{card.label}</span>
            </article>
          )
        })}
      </div>

      <div className="admin-analytics-grid">
        <section className="admin-analytics-card admin-analytics-card--wide">
          <header className="admin-analytics-card__header">
            <div><h2>Pageviews over time</h2><p>Daily website views from Google Analytics</p></div>
            <select value={period} onChange={event => setPeriod(Number(event.target.value))} aria-label="Visitor analytics period">
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </header>
          <PageviewsChart points={data.timeseries} />
        </section>

        <section className="admin-analytics-card">
          <header className="admin-analytics-card__header">
            <div><h2>Devices</h2><p>Sessions by device category</p></div>
          </header>
          <div className="admin-donut-layout">
            <div className="admin-donut" style={{ background: totalDeviceSessions ? 'conic-gradient(' + donutStops + ')' : 'var(--border)' }}>
              <div><strong>{totalDeviceSessions.toLocaleString()}</strong><span>Sessions</span></div>
            </div>
            <div className="admin-chart-legend">
              {devices.map(device => (
                <div key={device.deviceCategory}>
                  <span className="admin-chart-legend__dot" style={{ background: device.color }} />
                  <span>{device.deviceCategory || 'Unknown'}</span>
                  <strong>{device.sessions.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-analytics-card admin-analytics-card--activity">
          <header className="admin-analytics-card__header"><div><h2>Top pages</h2><p>Most viewed paths</p></div></header>
          <RankedList items={data.topPages} labelKey="pagePath" valueKey="views" emptyMessage="No page data yet." />
        </section>

        <section className="admin-analytics-card admin-analytics-card--activity">
          <header className="admin-analytics-card__header"><div><h2>Top referrers</h2><p>Sessions by traffic source</p></div></header>
          <RankedList items={data.topReferrers} labelKey="sessionSource" valueKey="sessions" emptyMessage="No referral data yet." />
        </section>

        <section className="admin-analytics-card admin-analytics-card--activity">
          <header className="admin-analytics-card__header"><div><h2>Top countries</h2><p>Sessions by visitor location</p></div></header>
          <RankedList items={data.countries} labelKey="country" valueKey="sessions" emptyMessage="No country data yet." />
        </section>
      </div>
    </div>
  )
}