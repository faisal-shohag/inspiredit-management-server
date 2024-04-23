import { Router } from "express"
import { admin_login, admin_logout } from "../Controllers/AuthController.js"
const router = Router()


router.post('/admin_login', admin_login)
router.get('/admin_logout', admin_logout)


export default router