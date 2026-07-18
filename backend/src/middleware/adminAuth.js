import jwt from 'jsonwebtoken'

export const ADMIN_COOKIE_NAME = 'xanvoraa_admin_token'
export const JWT_OPTIONS = {
  issuer: 'xanvoraa-api',
  audience: 'xanvoraa-admin',
}

export function requireAdminAuth(request, response, next) {
  const token = request.cookies?.[ADMIN_COOKIE_NAME]

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