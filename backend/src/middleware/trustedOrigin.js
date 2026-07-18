function configuredOrigins() {
  return (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean)
}

export function requireTrustedOrigin(request, response, next) {
  const origin = request.get('origin')

  if (!origin && process.env.NODE_ENV !== 'production') {
    next()
    return
  }

  if (!origin || !configuredOrigins().includes(origin.replace(/\/+$/, ''))) {
    response.status(403).json({
      success: false,
      message: 'Request origin is not allowed',
    })
    return
  }

  next()
}