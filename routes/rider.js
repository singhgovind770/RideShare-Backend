const express = require('express')
const router = express.Router()
const riderController = require('../controller/rider/riderController')
const authMiddleWare =  require('../middlewares/auth')

router.route('/signup')
      .post(riderController.createRider)

router.route('/signin')
      .post(riderController.loginRider)

router.route('/profile')
      .get(authMiddleWare,riderController.getRiderProfile)

router.route('/update')
      .put(authMiddleWare,riderController.updateRiderProfile)

router.route('/verify')
      .post(riderController.verify)

module.exports = router