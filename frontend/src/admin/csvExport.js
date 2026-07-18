const csvCell = value => {
  const text = value === null || value === undefined ? '' : String(value)
  const quote = String.fromCharCode(34)
  return quote + text.replaceAll(quote, quote + quote) + quote
}

export function downloadCsv(filename, columns, rows) {
  const header = columns.map(column => csvCell(column.label)).join(',')
  const lines = rows.map(row => columns.map(column => csvCell(row[column.key])).join(','))
  const content = '\uFEFF' + [header, ...lines].join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
