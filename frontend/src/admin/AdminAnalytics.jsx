import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  Mail,
  MessageSquareText,
  RefreshCw,
  TrendingUp,
  UserRoundPlus,
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

const SOURCES = [
  { key: 'contacts', label: 'Contact leads', color: '#6c63ff', endpoint: API_ENDPOINTS.admin.contacts },
  { key: 'careers', label: 'Career applications', color: '#00c9a0', endpoint: API_ENDPOINTS.admin.careers },
  { key: 'newsletter', label: 'Newsletter', color: '#38bdf8', endpoint: API_ENDPOINTS.admin.newsletter },
  { key: 'conversations', label: 'Chat sessions', color: '#f59e0b', endpoint: API_ENDPOINTS.admin.conversations },
]

async function readJson(response) {
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.message || 'Unable to load analytics')
  return result
}

function startOfDay(date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function relativeTime(value) {
  if (!value) return 'No timestamp'
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return seconds + 's ago'
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago'
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago'
  return new Date(value).toLocaleDateString()
}

function ActivityChart({ points }) {
  const width = 760
  const height = 230
  const paddingX = 22
  const paddingY = 22
  const max = Math.max(1, ...points.map((point) => point.value))
  const coordinates = points.map((point, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / Math.max(1, points.length - 1)
    const y = height - paddingY - (point.value / max) * (height - paddingY * 2)
    return { ...point, x, y }
  })
  const line = coordinates.map((point) => point.x + ',' + point.y).join(' ')
  const area = paddingX + ',' + (height - paddingY) + ' ' + line + ' ' +
    (width - paddingX) + ',' + (height - paddingY)

  return (
    <div className="admin-chart-shell">
      <svg className="admin-line-chart" viewBox={'0 0 ' + width + ' ' + height} role="img" aria-label="Submission activity chart">
        <defs>
          <linearGradient id="adminChartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <line
            key={level}
            x1={paddingX}
            x2={width - paddingX}
            y1={height - paddingY - level * (height - paddingY * 2)}
            y2={height - paddingY - level * (height - paddingY * 2)}
            className="admin-chart-gridline"
          />
        ))}
        <polygon points={area} fill="url(#adminChartArea)" />
        <polyline points={line} className="admin-chart-line" />
        {coordinates.map((point) => (
          <g key={point.key}>
            <circle cx={point.x} cy={point.y} r="4" className="admin-chart-point" />
            <title>{point.label + ': ' + point.value}</title>
          </g>
        ))}
      </svg>
      <div className="admin-chart-labels">
        {points.map((point, index) => (
          <span key={point.key} className={index % Math.ceil(points.length / 7) === 0 ? '' : 'admin-chart-label--muted'}>
            {point.short}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState(14)
  const [stats, setStats] = useState(null)
  const [records, setRecords] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      const requests = [
        fetch(API_ENDPOINTS.admin.stats, { credentials: 'include' }).then(readJson),
        ...SOURCES.map((source) =>
          fetch(source.endpoint + '?page=1&limit=100', { credentials: 'include' }).then(readJson)
        ),
      ]
      const [statsResult, ...sourceResults] = await Promise.all(requests)
      const nextRecords = {}
      SOURCES.forEach((source, index) => {
        nextRecords[source.key] = sourceResults[index]?.data || []
      })
      setStats(statsResult.data || {})
      setRecords(nextRecords)
      setUpdatedAt(new Date())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const timeline = useMemo(() => {
    const today = startOfDay(new Date())
    return Array.from({ length: period }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (period - index - 1))
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)
      const value = SOURCES.reduce((total, source) => {
        return total + (records[source.key] || []).filter((row) => {
          const timestamp = new Date(row.created_at || row.updated_at || 0)
          return timestamp >= date && timestamp < nextDate
        }).length
      }, 0)
      return {
        key: date.toISOString(),
        label: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        short: date.toLocaleDateString(undefined, { day: 'numeric' }),
        value,
      }
    })
  }, [period, records])

  const totalActivity = timeline.reduce((sum, point) => sum + point.value, 0)
  const sourceCounts = SOURCES.map((source) => ({
    ...source,
    value: (records[source.key] || []).length,
  }))
  const loadedTotal = sourceCounts.reduce((sum, source) => sum + source.value, 0)
  let angle = 0
  const donutStops = sourceCounts.map((source) => {
    const start = angle
    const share = loadedTotal ? (source.value / loadedTotal) * 360 : 0
    angle += share
    return source.color + ' ' + start + 'deg ' + angle + 'deg'
  }).join(', ')

  const recentActivity = SOURCES.flatMap((source) =>
    (records[source.key] || []).map((row) => ({
      id: source.key + '-' + row.id,
      source,
      title: row.name || row.email || row.session_id || source.label,
      detail: row.service || row.position || row.country || 'New record received',
      timestamp: row.created_at || row.updated_at,
    }))
  ).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)).slice(0, 7)

  const cards = [
    { label: 'Contact submissions', value: stats?.totalContacts ?? sourceCounts[0].value, icon: UserRoundPlus, tone: 'violet' },
    { label: 'Career applications', value: stats?.totalCareerApps ?? sourceCounts[1].value, icon: BriefcaseBusiness, tone: 'green' },
    { label: 'Newsletter subscribers', value: stats?.totalNewsletterSubs ?? sourceCounts[2].value, icon: Mail, tone: 'blue' },
    { label: 'Chatbot sessions', value: stats?.totalChatbotSessions ?? sourceCounts[3].value, icon: MessageSquareText, tone: 'amber' },
  ]

  if (loading) return <div className="admin-state admin-state--loading">Preparing analytics dashboard...</div>
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
          <span className="admin-eyebrow">Business intelligence</span>
          <h1>Analytics overview</h1>
          <p>Track leads, applications, subscribers and conversations in one place.</p>
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
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article className={'admin-kpi-card admin-kpi-card--' + card.tone} key={card.label}>
              <div className="admin-kpi-card__top">
                <span className="admin-kpi-card__icon"><Icon size={20} /></span>
                <span className="admin-kpi-card__trend"><TrendingUp size={13} /> Live</span>
              </div>
              <strong>{Number(card.value).toLocaleString()}</strong>
              <span>{card.label}</span>
            </article>
          )
        })}
      </div>

      <div className="admin-analytics-grid">
        <section className="admin-analytics-card admin-analytics-card--wide">
          <header className="admin-analytics-card__header">
            <div>
              <h2>Submission activity</h2>
              <p>{totalActivity} records received in the selected period</p>
            </div>
            <select value={period} onChange={(event) => setPeriod(Number(event.target.value))} aria-label="Chart period">
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </header>
          <ActivityChart points={timeline} />
        </section>

        <section className="admin-analytics-card">
          <header className="admin-analytics-card__header">
            <div>
              <h2>Lead distribution</h2>
              <p>Latest {loadedTotal} loaded records</p>
            </div>
          </header>
          <div className="admin-donut-layout">
            <div className="admin-donut" style={{ background: loadedTotal ? 'conic-gradient(' + donutStops + ')' : 'var(--border)' }}>
              <div><strong>{loadedTotal}</strong><span>Records</span></div>
            </div>
            <div className="admin-chart-legend">
              {sourceCounts.map((source) => (
                <div key={source.key}>
                  <span className="admin-chart-legend__dot" style={{ background: source.color }} />
                  <span>{source.label}</span>
                  <strong>{source.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-analytics-card admin-analytics-card--activity">
          <header className="admin-analytics-card__header">
            <div>
              <h2>Recent activity</h2>
              <p>Newest events across all channels</p>
            </div>
          </header>
          <div className="admin-activity-list">
            {recentActivity.length === 0 && <div className="admin-state">No recent activity.</div>}
            {recentActivity.map((item) => (
              <div className="admin-activity-item" key={item.id}>
                <span className="admin-activity-item__dot" style={{ background: item.source.color }} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.source.label} · {item.detail}</span>
                </div>
                <time title={item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}>
                  {relativeTime(item.timestamp)}
                </time>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}