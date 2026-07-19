import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import formsRoutes from './routes/forms.routes.js'
import healthRouter from './routes/health.routes.js'
import adminRoutes from './routes/admin.routes.js'
import chatRoutes from './routes/chat.routes.js'
import { getEmailTransporter } from './config/email.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const configuredFrontendOrigins =
  process.env.FRONTEND_URLS || process.env.FRONTEND_URL || ''
const allowedOrigins = configuredFrontendOrigins
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  throw new Error('FRONTEND_URL or FRONTEND_URLS must be configured in production')
}

if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:5173')
}

if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
) {
  throw new Error('JWT_SECRET must contain at least 32 characters in production')
}


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

const formsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
})

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Chat limit reached. Please try again later.' },
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
})

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'same-site' },
  }),
)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
        callback(null, true)
        return
      }

      const error = new Error('Origin is not allowed by CORS')
      error.status = 403
      callback(error)
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  }),
)
app.use(globalLimiter)
app.use(cookieParser())
app.use(express.json({ limit: '32kb' }))
app.use(
  express.urlencoded({
    extended: true,
    limit: '32kb',
    parameterLimit: 50,
  }),
)

app.use('/api/health', healthRouter)
app.use('/api/forms', formsLimiter, formsRoutes)
app.use('/api/chat', chatLimiter, chatRoutes)
app.use('/api/admin/login', loginLimiter)
app.use('/api/admin', adminRoutes)

app.use((error, _request, response, _next) => {
  const status =
    error.status ||
    (error.type === 'entity.too.large' ? 413 : 500)

  if (status >= 500) {
    console.error('Request failed:', error)
  }

  response.status(status).json({
    success: false,
    message:
      status === 413
        ? 'Request body is too large'
        : status === 403
          ? 'Request origin is not allowed'
          : 'Something went wrong',
  })
})

const server = app.listen(port, () => {
  console.log('Xanvoraa backend is running on port ' + port)

  try {
    if (process.env.RESEND_API_KEY?.trim()) {
      console.log('Resend email alerts are configured (HTTP API mode)')
    } else {
      const transporter = getEmailTransporter()
      if (transporter) {
        transporter.verify((error, success) => {
          if (error) {
            console.error('SMTP Connection verification failed on startup:', error.message || error)
          } else {
            console.log('SMTP Server is ready to send email alerts')
          }
        })
      } else {
        console.warn('SMTP transporter not initialized. Email configuration is incomplete.')
      }
    }
  } catch (err) {
    console.error('Failed to verify email configuration on startup:', err.message)
  }
})

server.requestTimeout = 20_000
server.headersTimeout = 25_000
server.keepAliveTimeout = 5_000
