const riderModel = require('../../model/riderModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function createRider(req, res, next) {

    try {
        const find = await riderModel.findOne({ MobNumber: req.body.MobNumber })

        if (find == null) {

            bcrypt.hash(req.body.Password, 10, async function (err, hash) {
                const data = req.body;
                data.Password = hash;
                const resp = await riderModel.create(data)

                const Token = jwt.sign({ id: resp._id }, process.env.SECERET_KEY)
                res.json({
                    "Message": "Account Created",
                    "token": Token,
                    "Result":true
                })
            }
            )

        }
        else {
            res.json({
                "Message": "User Already Exist",
                "Result":false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({ "Result":false, "Message": "Something went wrong", "error": err })
    }

}


async function loginRider(req, res, next) {

    try {
        const find = await riderModel.findOne({MobNumber:req.body.MobNumber})
        if(find==null){
            res.json({"Message":"User Not found","Result":false})
        }
        else{
        bcrypt.compare(req.body.Password, find.Password).then((result)=>{

            if(result){
                const Token = jwt.sign({ id: find._id }, process.env.SECERET_KEY)
                    res.json({
                    "Message":"You Have Successfully Logged In!",
                    "Result":result,
                    "token":Token,
                    "Name":find.Name,
                    "id":find._id
                })  
            }
            else
                res.json({
                    "Message":"Unable to login, Invalid Password",
                    "Result":result
                })               


        })

        }
    }
    catch (err) {
        console.log(err)
        res.json({
            "Message":"Oops! Error Occured","Result":false,
            "error":err})
    }
}


async function getRiderProfile(req,res,next){
    try{
        const find=await riderModel.findOne({MobNumber:req.body.MobNumber})
        if(find==null){
            res.json({"Message":"User Not found"})
        }
        else{
            res.json({
                "Message":"User Found!",
                "Result":find
            })
        }

    }catch(err){
        res.json({"error":err})
    }
}


async function updateRiderProfile(req, res){
    try{
        const result = await riderModel.findOneAndUpdate(req.body.Filter, req.body.Update)

        if(result){
            res.json({
                "Message":"User Updated!",
                "Result":result
            })
            
        }
        else
        res.json({
            "Message":"User Does Not Exist",
            "Result":result
        })
    }
    catch(error){
        res.json({"error":error})
    }
}

async function verify(req, res){
    try{
        
        const verify = jwt.verify(req.body.Token, process.env.SECERET_KEY)
        if(verify){
            
            res.json({
                "Message":"You Have Successfully Logged In!",
                "Result":true,
                "id":verify.id
            })  
        }
    }
    catch(err){
        console.log(err)
        res.json({"error":err, "message":"Something Went Wrong", "Result":false})
    }
}

module.exports = { createRider, loginRider,getRiderProfile, updateRiderProfile , verify}
