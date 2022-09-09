const express = require('express')
const app = express()
const cors = require('cors')
var corsOptions = {
  origin: ['http://192.168.5.88','http://192.168.5.88:3000'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
const port = process.env.PORT || 4000;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const driver = require('./routes/driver')
const mongoose =  require('mongoose')
const driverModel = require('./model/driverModel')
const riderModel = require('./model/riderModel')
const rider = require('./routes/rider')
require('dotenv').config();
const password = process.env.db_Password;
const ip = require('ip')
const bodyParser = require('body-parser')
const axios = require('axios').default;
const  globalEmitter =require('./loaders/eventEmitter');


// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(
  `mongodb+srv://singhgovind770:${password}@rideshare.rofbtva.mongodb.net/?retryWrites=true&w=majority`
  );
  
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error, Maybe Your Internet is Turned OFF, "));
  db.once("open", function () {
    console.log("Connected successfully");
});


const server = app.listen(port, ()=>{
  console.log(`Server is listening on Port ${port}`);
})




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/driver',driver)
app.use('/rider',rider)

app.get('/', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.json({
    "Status":"true",
    "Message":'it is working'});
  });

app.get('*', function(req, res){
  res.status(404).json({
    "Status":"404. That’s an error.",
    "Message":'Unfortunately the page you are looking for has been moved or deleted or never existed'});
  });
  

//  Sockets
const io = require("socket.io")(server,{
  cors: {
    origin: 'http://localhost:3000',
  }
})


io.on('connection', (socket)=>{

    socket.on('join', function(room) {
      socket.join(room);
      console.log("connection establised to "+room)
    })
    
    
    // socket.emit("ride")
  })
  
globalEmitter.on('do_something', (data)=>{
    console.log("Customer Request Sent to Driver")
    io.in('630cc5a10a7369dc39f40792').emit('new_msg', {msg: 'hello'})

  });


  // const small = new driverModel({ Location : {type:'Point' ,coordinates:[28.540859541752734, 77.38695519212665]}, Name: 'GOVIND SINGH', MobNumber:9015025959, Vehicle_info:'Audi R8 UP16 GV1999'});
  // small.save()
  
  
  
  // async function getall(){
    
    //   await driverModel.find({}).then(resolve=>console.log(resolve)).catch(error=>console.log(error));
    // }
    
// getall()

console.log(ip.address());