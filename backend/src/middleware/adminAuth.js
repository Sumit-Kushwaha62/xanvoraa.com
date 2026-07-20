import jwt from 'jsonwebtoken'

export const ADMIN_COOKIE_NAME = 'xanvoraa_admin_token'
export const JWT_OPTIONS = {
  issuer: 'xanvoraa-api',
  audience: 'xanvoraa-admin',
}

export function requireAdminAuth(request, response, next) {
  let token = request.cookies?.[ADMIN_COOKIE_NAME]

  // Fallback to Authorization: Bearer <token>
  if (!token && request.headers.authorization) {
    const parts = request.headers.authorization.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1]
    }
  }

  if (!token || !process.env.JWT_SECRET) {
    return response.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  try {
    request.admin = jwt.verify(token, process.env.JWT_SECRET, JWT_OPTIONS)
    next()
  } catch {
    return response.status(401).json({
      success: false,
      message: 'Invalid or expired session',
    })
  }
}