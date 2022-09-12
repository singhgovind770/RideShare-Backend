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


module.exports  ={Ride}