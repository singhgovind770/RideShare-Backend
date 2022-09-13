const express = require('express')
const router = express.Router()
const riderController = require('../controller/rides/rideController')
const authMiddleWare =  require('../middlewares/auth')

router.route('/')
    .get(riderController.Ride)

router.route('/Update')
    .put(authMiddleWare, riderController.rideUpdate)


module.exports = router
