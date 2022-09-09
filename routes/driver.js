const express = require('express')
const router = express.Router()
const {Client} = require("@googlemaps/google-maps-services-js");
const driverController = require('../controller/driver/driverController')
const authMiddleWare =  require('../middlewares/auth')



require('dotenv').config();

router.route('/')
    .get(driverController.getDriver)

    router.route('/Signup')
    .post(driverController.createDriver)
    
    router.route('/Signin')
    .post(driverController.signInDriver)
    
    
    router.route('/finddriver')
    .post(authMiddleWare,driverController.findDriver)
    
    router.route('/Update')
        .put(authMiddleWare, driverController.updatedriver)

module.exports = router







