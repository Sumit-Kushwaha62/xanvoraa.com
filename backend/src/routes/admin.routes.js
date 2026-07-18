import { Router } from 'express'
import { changePassword, downloadResume, getConversation, getCurrentAdmin, getStats, listCareers, listContacts, listConversations, listNewsletter, login, logout } from '../controllers/admin.controller.js'
import { requireAdminAuth } from '../middleware/adminAuth.js'
import { requireTrustedOrigin } from '../middleware/trustedOrigin.js'
const router = Router()
router.post('/login', requireTrustedOrigin, login)
router.post('/logout', requireTrustedOrigin, logout)
router.post('/change-password', requireTrustedOrigin, requireAdminAuth, changePassword)
router.get('/me', requireAdminAuth, getCurrentAdmin)
router.use(requireAdminAuth)
router.get('/contacts', listContacts)
router.get('/careers', listCareers)
router.get('/resumes/:filename', downloadResume)
router.get('/newsletter', listNewsletter)
router.get('/conversations', listConversations)
router.get('/conversations/:sessionId', getConversation)
router.get('/stats', getStats)
export default router
