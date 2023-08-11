const express = require('express'); //import express from package express
const PORT = process.env.PORT || 5000; //choosing the port (system or default)
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./authRouter');
const hbs = require('hbs');
const path = require("path");
const app = express(); //make app from express
const authMiddleware = require('./Middleware/authMiddleware')
const roleMiddleware = require('./Middleware/roleMiddleware')
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))//подключение статических файлов
app.use(express.json());//parsing json
app.use("/auth", authRouter);
app.use(bodyParser.json());
app.set( 'view engine' , 'hbs' );//добавили после
/*
app.get('/desk', authMiddleware, (req, res) => {
    res.render('index');
})
app.get('/auth/login', (req, res) => {
    res.render('login'); //тут у нас файл
})
app.get('/auth/registration', (req, res) => {
    res.render('registration'); //тут у нас файл
})
app.get('/auth/createProject', (req, res)=>{

})*/

const start = async () => {
    try{
        await mongoose.connect(`mongodb+srv://FanisNGV:password111@cluster0.yv7s4qc.mongodb.net/?retryWrites=true&w=majority`);
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    }catch(e){
        console.log(e);
    }
}
start();
