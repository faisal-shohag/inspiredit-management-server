import { Router } from "express"
import { admin_login, admin_logout, check_admin_login } from "../Controllers/AuthController.js"
const router = Router()


router.post('/admin_login', admin_login)
router.get('/admin_logout', admin_logout)
router.get('/check_admin_login', check_admin_login)

export default router