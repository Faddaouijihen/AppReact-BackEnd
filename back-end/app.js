//express pour appeler les fichiers routes//
const express = require('express');
const app = express();
const bodyparser = require('body-parser');


const userrouter = require('./routes/user-route');
const annoncerouter = require('./routes/formation-route');
const condidatrouter = require('./routes/condidat-route');


const httperror = require('./models/http-error');

const mongoose = require('mongoose');

app.use(bodyparser .json());


app.use(function (req, res, next) {
    /*var err = new Error('Not Found');
     err.status = 404;
     next(err);*/
  
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  
  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    // Pass to next layer of middleware
    next();
  });


app.use('/api/user',userrouter);
app.use('/api/formation',annoncerouter);
app.use('/api/condidat',condidatrouter);




app.use((req,res,next)=>{
    const error = new httperror('could not find the page',404);
    throw error;
})

app.use((error,req,res,next) => {
    if(res.headerSent){

        return next(error)
    }
    res.status(error.code || 500);
    res.json({message:error.message ||'an unknown error occurred '})
})
//connecexion du db//
mongoose
.connect('mongodb+srv://jihen:jihen@cluster0.ine9e.mongodb.net/PFA?retryWrites=true&w=majority')
.then(()=>{
    //lancer serveur du port 5000: serveur express//
    app.listen(5000);
})
.catch(err=>{
    Console.log(err)
})


