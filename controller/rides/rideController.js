const rideModel =  require('../../model/rideModel')



async function Ride(req, res, next) {
    let search = req.query
    await rideModel.find(search)
        .then(function (Response) {
                res.json({
                Status: 'True',
                Message: 'RIDE is Working Perfectly',
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


async function rideUpdate(req, res, next) {
    await rideModel.findOneAndUpdate(req.body.Filter, req.body.Update)
        .then(function (response) {

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
}


module.exports  ={Ride, rideUpdate}