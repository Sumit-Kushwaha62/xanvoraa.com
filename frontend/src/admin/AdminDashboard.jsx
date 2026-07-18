import { createElement, useCallback, useEffect, useState } from 'react'
import xanvoraaLogo from '../assets/xanvoraa-x-mark.png'
import { API_ENDPOINTS } from '../config/api'
import { useAdminAuth } from './AdminAuthContext'
import ConversationPanel from './ConversationPanel'
import SubmissionDetailModal from './SubmissionDetailModal'
import { downloadCsv } from './csvExport'
import AdminAnalytics from './AdminAnalytics'
import { Download, Search, SlidersHorizontal, X } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'careers', label: 'Careers' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'conversations', label: 'Conversations' },
  { id: 'settings', label: 'Settings' },
]

async function parseJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header__brand"><img src={xanvoraaLogo} alt="Xanvoraa Technologies" /><span><strong>Xanvoraa</strong><small>Admin Dashboard</small></span></div>
        <div className="admin-header__right">
          <span className="admin-header__email">{admin?.email}</span>
          <button className="admin-btn admin-btn--ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="admin-content">
          {activeTab === 'overview' && <AdminAnalytics />}
          {activeTab === 'contacts' && (
            <DataTable
              title="Contact Submissions"
              endpoint={API_ENDPOINTS.admin.contacts}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'mobile', label: 'Mobile' },
                { key: 'country', label: 'Country' },
                { key: 'service', label: 'Service' },
                { key: 'budget', label: 'Budget' },
                { key: 'message', label: 'Message' },
                { key: 'created_at', label: 'Submitted', render: fmtDate },
              ]}
            />
          )}
          {activeTab === 'careers' && (
            <DataTable
              title="Career Applications"
              endpoint={API_ENDPOINTS.admin.careers}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'mobile', label: 'Mobile' },
                { key: 'position', label: 'Position' },
                { key: 'experience', label: 'Experience' },
                { key: 'location', label: 'Location' },
                { key: 'portfolio', label: 'Portfolio' },
                {
                  key: 'resume_url',
                  label: 'Resume',
                  render: (value) =>
                    value ? (
                      <a href={value.startsWith('http://') || value.startsWith('https://') ? value : API_ENDPOINTS.admin.resume(value)} target="_blank" rel="noreferrer" className="admin-link">
                        View
                      </a>
                    ) : (
                      '—'
                    ),
                },
                { key: 'created_at', label: 'Submitted', render: fmtDate },
              ]}
            />
          )}
          {activeTab === 'newsletter' && (
            <DataTable
              title="Newsletter Subscribers"
              endpoint={API_ENDPOINTS.admin.newsletter}
              columns={[
                { key: 'email', label: 'Email' },
                { key: 'created_at', label: 'Subscribed', render: fmtDate },
              ]}
            />
          )}
          {activeTab === 'conversations' && <ConversationsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}

function fmtDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function DataTable({ title, endpoint, columns }) {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      if (search) params.set('search', search)
      const res = await fetch(`${endpoint}?${params.toString()}`, { credentials: 'include' })
      const data = await parseJson(res)
      setRows(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint, page, from, to, search])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const applyFilters = (e) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const exportAll = async () => {
    setExporting(true)
    setError('')
    try {
      const allRows = []
      let exportPage = 1
      let totalExportPages = 1
      do {
        const params = new URLSearchParams({ page: String(exportPage), limit: '100' })
        if (from) params.set('from', from)
        if (to) params.set('to', to)
        if (search) params.set('search', search)
        const response = await fetch(endpoint + '?' + params.toString(), { credentials: 'include' })
        const result = await parseJson(response)
        allRows.push(...(result.data || []))
        totalExportPages = result.pagination?.totalPages || 1
        exportPage += 1
      } while (exportPage <= totalExportPages)
      const filename = title.toLowerCase().replaceAll(' ', '-') + '.csv'
      downloadCsv(filename, columns, allRows)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  const searchControl = createElement('input', {
    'aria-label': 'Search records',
    type: 'search',
    value: searchInput,
    onChange: event => setSearchInput(event.target.value),
    placeholder: 'Search records...',
  })
  const exportControl = createElement('button', {
    type: 'button',
    className: 'admin-btn admin-btn--ghost',
    onClick: exportAll,
    disabled: exporting,
  }, createElement(Download, { size: 15 }), exporting ? 'Preparing CSV...' : 'Export CSV')
  const searchWrap = createElement('div', { className: 'admin-search-box' }, createElement(Search, { size: 16 }), searchControl)
  const headerControls = createElement('div', { className: 'admin-table-tools' }, searchWrap, exportControl)
  const detailModal = selectedRow ? createElement(SubmissionDetailModal, {
    title,
    row: selectedRow,
    fields: columns,
    onClose: () => setSelectedRow(null),
  }) : null

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div className="admin-panel__title"><span className="admin-eyebrow">Records</span><h2>{title}</h2></div>{headerControls}{detailModal}
        <form className="admin-filters" onSubmit={applyFilters}><span className="admin-filter-label"><SlidersHorizontal size={14} /> Filters</span>
          <label>
            From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            To
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">Apply filters</button>
          <button type="button" className="admin-btn admin-btn--clear" onClick={() => { setFrom(''); setTo(''); setSearchInput(''); setSearch(''); setPage(1) }}><X size={14} /> Clear</button>
        </form>
      </div>

      {loading && <div className="admin-state">Loading...</div>}
      {!loading && error && <div className="admin-state admin-state--error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="admin-table__empty">
                      No records found.
                    </td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id} onClick={() => setSelectedRow(row)} className={'admin-table__clickable'}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key]) : (row[col.key] || '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button
              className="admin-btn admin-btn--ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="admin-btn admin-btn--ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ConversationsTab() {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeSession, setActiveSession] = useState(null)
  const [conversationSearchInput, setConversationSearchInput] = useState('')
  const [conversationSearch, setConversationSearch] = useState('')
  const [conversationFrom, setConversationFrom] = useState('')
  const [conversationTo, setConversationTo] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (conversationSearch) params.set('search', conversationSearch)
      if (conversationFrom) params.set('from', conversationFrom)
      if (conversationTo) params.set('to', conversationTo)
      const res = await fetch(`${API_ENDPOINTS.admin.conversations}?${params.toString()}`, {
        credentials: 'include',
      })
      const data = await parseJson(res)
      setRows(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, conversationSearch, conversationFrom, conversationTo])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div className="admin-panel__title">
          <span className="admin-eyebrow">Engagement</span>
          <h2>Chatbot Conversations</h2>
        </div>
        <form
          className="admin-conversation-tools"
          onSubmit={(event) => {
            event.preventDefault()
            setPage(1)
            setConversationSearch(conversationSearchInput.trim())
          }}
        >
          <div className="admin-search-box">
            <Search size={16} />
            <input
              type="search"
              value={conversationSearchInput}
              onChange={(event) => setConversationSearchInput(event.target.value)}
              placeholder="Search session..."
              aria-label="Search conversations"
            />
          </div>
          <input type="date" value={conversationFrom} onChange={(event) => { setPage(1); setConversationFrom(event.target.value) }} aria-label="Conversations from date" />
          <input type="date" value={conversationTo} onChange={(event) => { setPage(1); setConversationTo(event.target.value) }} aria-label="Conversations to date" />
          <button className="admin-btn admin-btn--primary" type="submit">Search</button>
          <button
            className="admin-btn admin-btn--clear"
            type="button"
            onClick={() => {
              setConversationSearchInput('')
              setConversationSearch('')
              setConversationFrom('')
              setConversationTo('')
              setPage(1)
            }}
          >
            <X size={14} /> Clear
          </button>
        </form>
      </div>

      {loading && <div className="admin-state">Loading...</div>}
      {!loading && error && <div className="admin-state admin-state--error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Messages</th>
                  <th>Started</th>
                  <th>Last Update</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-table__empty">No conversations yet.</td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="admin-table__mono">{row.session_id}</td>
                    <td>{Array.isArray(row.messages) ? row.messages.length : 0}</td>
                    <td>{fmtDate(row.created_at)}</td>
                    <td>{fmtDate(row.updated_at)}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn--ghost"
                        onClick={() => setActiveSession(row.session_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button
              className="admin-btn admin-btn--ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="admin-btn admin-btn--ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}

      {activeSession && (
        <ConversationPanel sessionId={activeSession} onClose={() => setActiveSession(null)} />
      )}
    </div>
  )
}

function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const strongPassword =
      newPassword.length >= 12 &&
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /\d/.test(newPassword) &&
      /[^A-Za-z0-9]/.test(newPassword)

    if (!strongPassword) {
      setError('Use at least 12 characters with uppercase, lowercase, number and symbol.')
      return
    }    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(API_ENDPOINTS.admin.changePassword, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await parseJson(res)
      setMessage(data.message || 'Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h2>Change Password</h2>
      </div>

      <form className="admin-settings-form" onSubmit={handleSubmit}>
        {message && <div className="admin-alert admin-alert--success">{message}</div>}
        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        <label className="admin-field">
          <span>Current Password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span>New Password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={12}
          />
        </label>

        <label className="admin-field">
          <span>Confirm New Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={12}
          />
        </label>

        <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
