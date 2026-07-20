import { createElement, useEffect } from 'react'
import { API_ENDPOINTS, viewResume } from '../config/api'

const show = value =>
  value === null || value === undefined || value === '' ? '—' : String(value)

function DetailField({ field, value }) {
  const type =
    field.type ||
    (field.key === 'email'
      ? 'email'
      : field.key === 'mobile'
        ? 'phone'
        : ['portfolio', 'resume_url'].includes(field.key)
          ? 'link'
          : field.key === 'created_at'
            ? 'date'
            : 'text')

  let content = <strong>{show(value)}</strong>

  if (type === 'date') {
    content = <strong>{value ? new Date(value).toLocaleString() : '—'}</strong>
  }

  if (type === 'link' && value) {
    if (field.key === 'resume_url' && !/^https?:\/\//i.test(value)) {
      content = (
        <button
          type="button"
          onClick={() => viewResume(value)}
          className="admin-link"
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left', textDecoration: 'underline' }}
        >
          Open link
        </button>
      )
    } else {
      content = (
        <a href={value} target="_blank" rel="noreferrer" className="admin-link">
          Open link
        </a>
      )
    }
  }

  if (type === 'email' && value) {
    content = <a href={'mailto:' + value} className="admin-link">{value}</a>
  }

  if (type === 'phone' && value) {
    content = <a href={'tel:' + value} className="admin-link">{value}</a>
  }

  const wide = field.wide || field.key === 'message'

  return (
    <div className={'admin-detail-field ' + (wide ? 'admin-detail-field--wide' : '')}>
      <span>{field.label}</span>
      {content}
    </div>
  )
}

export default function SubmissionDetailModal({ title, row, fields, onClose }) {
  useEffect(() => {
    const escape = event => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [onClose])

  const details = fields.map(field =>
    createElement(DetailField, {
      field,
      value: row[field.key],
      key: field.key,
    }),
  )

  return createElement(
    'div',
    { className: 'admin-modal-backdrop' },
    createElement(
      'section',
      { className: 'admin-modal admin-detail-modal' },
      createElement(
        'header',
        { className: 'admin-modal__header' },
        createElement('h3', null, title),
        createElement(
          'button',
          {
            type: 'button',
            className: 'admin-btn admin-btn--ghost',
            onClick: onClose,
          },
          'Close',
        ),
      ),
      createElement(
        'div',
        { className: 'admin-modal__body admin-detail-grid' },
        details,
      ),
    ),
  )
}