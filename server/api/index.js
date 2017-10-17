import { Router } from 'express'

import users from './userSercurity'

var router = Router()

// Add USERS Routes
router.use(users)

export default router
