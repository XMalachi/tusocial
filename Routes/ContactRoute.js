import express from 'express'
const router = express.Router();
import {contactAdmin} from '../Controllers/ContactController.js'

router.route('/contact-admin').post(contactAdmin)

export default router