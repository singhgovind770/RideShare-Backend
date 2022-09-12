const bcrypt = require('bcrypt');
const driverModel = require('../../model/driverModel')
const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { findOne } = require('../../model/driverModel');
const rideModel = require('../../model/rideModel')
const { io } = require("socket.io-client");
const globalEmitter = require('../../loaders/eventEmitter');
let date_ob = new Date();


async function getDriver(req, res, next) {


    let search = req.query
    await driverModel.find(search)
        .then(function (Response) {
            globalEmitter.emit('do_something', 'Message');

            res.json({
                Status: 'True',
                Message: 'getDriver is Working Perfectly',
                Drivers: Response
            })
        })
        .catch(function (error) {
            res.send({
                status: 'false',
                Message: "Oops! Error Occured",
                Error: error
            })
        });
}


async function createDriver(req, res, next) {

    await driverModel.findOne({ "MobNumber": req.body.MobNumber })
        .then(async function (Res) {

            if (Res == null) {
                let data = req.body
                const saltRounds = 10;
                await bcrypt.hash(data.Password, saltRounds, async function (err, hash) {
                    if (err) {
                        res.json({ Error: err, "bcrypt": "error" })
                        return
                    }
                    data.Password = hash

                    await driverModel.create(data)
                        .then(function (Res) {
                            const Token = jwt.sign({ id: Res._id }, process.env.SECERET_KEY)

                            res.json({
                                status: 'True',
                                Message: 'Congratulations! Your Account is Created ',
                                token: Token,
                                response: Res
                            })
                        }

                        )
                        .catch(function (error) {
                            res.json({
                                status: 'false',
                                Message: "Oops! Error Occured",
                                Error: error
                            })
                        })
                })
            }
            else
                res.json({
                    Message: 'Your Account is Already Created',
                    response: Res

                })

        }).catch(function (err) {
            res.json({ Error: err })
        })
}



async function signInDriver(req, res, next) {

    try {

        // if(req.body.Token){
        //     const verify = jwt.verify(req.body.Token, process.env.SECERET_KEY)
        //     if(verify){
        //         res.json({
        //                  "Message":"You are Already Logged In!",
        //                  "Details":verify
        //         }) 
        //     }
        // }
        // else{


        const signIn = await driverModel.findOne({ "MobNumber": req.body.MobNumber })

        if (!signIn) {
            res.json({ "Message": "User Not found", "Result": false })
        }
        else {
            await bcrypt.compare(req.body.Password, signIn.Password).then((result) => {

                if (result) {

                    const Token = jwt.sign({ id: signIn._id }, process.env.SECERET_KEY)
                    res.header("Access-Control-Allow-Origin", "*");
                    res.json({
                        "Message": "You Have Successfully Logged In!",
                        "Result": result,
                        "token": Token,
                        "Name": signIn.Name,
                        "id": signIn._id
                    })

                }

                else {
                    res.json({
                        "Message": "Unable to login, Invalid Password",
                        "Result": result
                    })

                }
            })
            //}
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            "Message": "Oops! Error Occured", "Result": false,
            "error": err
        })
    }
}


async function updatedriver(req, res, next) {
    await driverModel.findOneAndUpdate(req.body.Filter, req.body.Update)
        .then(function (response) {

            console.log(`${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}, Location Updated, id:${response._id}`)

            res.json({
                Result: true,
                Message: 'Upadated SuccessFully',
                response: response
            })
        }
        )
        .catch(function (error) {
            res.send({
                status: 'false',
                Message: "Oops! Error Occured",
                Error: error
            })
        }
        )

    // await driverModel.update({}, {$set:{"OnRequest":req.body.onRequest}},{upsert:false, multi:true})
    //     .then(function (response) {
    //         res.json({
    //             status: 'True',
    //             Message: 'Upadated SuccessFully',
    //             response: response
    //         })
    //     }
    //     )
    //     .catch(function (error) {
    //         res.send({
    //             status: 'false',
    //             Message: "Oops! Error Occured",
    //             Error: error
    //         })
    //     }
    //     )
}


async function findDriver(req, res, next) {
    console.log(req.body)
    const location = [req.body.lat, req.body.lng]
    // console.log(location)
    const Origin = `${req.body.lat},${req.body.lng}`;
    const Destination=req.body.Destination;
    const Fare = req.body.Fare;
    const duration = req.body.duration;
    const id = req.body.Customer_id;

    try {
        //Creating Ride in RideModels Collections.

        const rideCreation = await rideModel.create({
            "Origin": Origin,
            "Destination": Destination,
            "Fare": Fare,
            "Customer_id":id,
            "Driver_id": "Not Assigned",
            "Status": "Not Assigned"
        })
        console.log(rideCreation)

        if (rideCreation) {
            console.log("ride created")
            const result = await driverModel.findOneAndUpdate(
                {
                    Location: {
                        $geoWithin: { $centerSphere: [location, 1 / 3963] }
                    },

                    Active: true,
                    Occupied: false,
                    OnRequest: false,
                },

                {
                    OnRequest: true
                }

            )

            if (result == null) {
                res.json({ "Message": "No Cabs are Available", "result": false, "response": result })
            }
            else {

                //Fetching Distance b/w "Pickup location" to "Driver Location" and Arrival Time of Driver For a Ride
                const destination = [req.body.lat, req.body.lng]
                const origin = [result.Location.coordinates]
                const YOUR_API_KEY = process.env.key
                var config = {
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=imperial&key=${YOUR_API_KEY}&region=IN`
                };


                
                
                //Fetching Distance b/w "Pickup location" to "Driver Location" and Arrival Time of Driver for a Ride
                axios(config).then(function (Response) {
                    // console.log(JSON.stringify(Response.data));
                    res.json({
                        "result": true,
                        "Message": 'SuccessFully Working',
                        "response": result,
                        "Distance_and_Time": `Arrving in ${Response.data.rows[0].elements[0].duration.text}, ${Response.data.rows[0].elements[0].distance.text} Away`
                    })

                    
                    console.log(result);
                    //Emiting Ride Found Accepted Notification Event to Customer
                    const trip = {
                        "Origin": Origin,
                        "Destination": Destination,
                        "Fare": Fare,
                        "duration":duration,
                        "pickup_duration":`${Response.data.rows[0].elements[0].distance.text}, ${Response.data.rows[0].elements[0].duration.text}`,
                        "id":result._id.toString(),
                        "rideCreation_id": rideCreation._id.toString()
                    }
    
                    //Sending Request to the driver
                    globalEmitter.emit('do_something', trip);

                })
            }
        }

    }
    catch (error) {
        res.send({
            "Message": "Oops! Error Occured",
            "result": false,
            "Error": error
        })
    }
}


module.exports = { getDriver, createDriver, updatedriver, findDriver, signInDriver }

