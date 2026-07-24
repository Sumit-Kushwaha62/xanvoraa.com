import { Router } from 'express'
import {
  getCountries,
  getDevices,
  getSummary,
  getTimeseries,
  getTopPages,
  getTopReferrers,
} from '../controllers/analytics.controller.js'
import { requireAdminAuth } from '../middleware/adminAuth.js'

const router = Router()

router.use(requireAdminAuth)
router.get('/summary', getSummary)
router.get('/timeseries', getTimeseries)
router.get('/top-pages', getTopPages)
router.get('/top-referrers', getTopReferrers)
router.get('/devices', getDevices)
router.get('/countries', getCountries)

export default router