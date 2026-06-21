import express from 'express'
import {userLogin,refreshAccessToken,logOut} from '../controllers/Users/login.controller.js'
import {signUp, signUpAsAdmin} from '../controllers/Users/signUp.controller.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'
//import { verifyJWT } from '../middlewares/authMiddleware.js'
import { approveAdminRegistration,rejectAdminRegistration } from '../controllers/Users/admin.signup.controller.js'
const router = express.Router()

router.route('/register').post(signUp)
router.route('/register-admin').post(signUpAsAdmin)
router.route('/login').post(userLogin)
router.route('/refresh-access-token').post(refreshAccessToken)
router.route('/log-out').post(verifyJWT,logOut)
router.route('/:id/approve-admin-registration').get(approveAdminRegistration)
router.route('/:id/reject-admin-registration').get(rejectAdminRegistration)

export default router