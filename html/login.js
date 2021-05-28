
//index.js
const express = require("express");
const mongoose = require("mongoose")
const expHBS = require('express-handlebars')
const auth = require('./html/routes/auth')
const app = express()
const session = require('express-session')
const User = require('./html/models/users')
const varMiddleware = require('./middleware/variables')

const hbs = expHBS.create({ // создает новую hbs
   defaultLayout: 'main',// layouts - main - будет главной hbs
   extname: 'hbs' // .hbs рассширение
})


app.engine('hbs', hbs.engine) //организовывает загрузку плагина
app.set('view engine', 'hbs') //использование hbs
app.set('views','html') //настройка папки для шаблонов которые подключаются


app.use(express.urlencoded({extended: true}))
app.use(session({
   secret: 'some secret value',
   resave: false,
   saveUninitialized: false
}))
app.use(varMiddleware)

app.use(express.static('public')) // подключение js и css 
app.use('/',home) //routing '/' - выбор роутинга
app.use('/list',about)
app.use('/anime',anime)
app.use('/auth', auth)

const PORT = process.env.PORT || 3000
async function start(){
   try{
      const password = 'TDNADn7x2drfIl28'
      const urlDB = `mongodb+srv://Thrackerzod:${password}@cluster0.dmtbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
      await mongoose.connect(urlDB,{
         useNewUrlParser: true, 
         useUnifiedTopology: true
   })
      app.listen(PORT)
   }catch(e){
      console.log(e)
   }
}
start()

//auth.js

const {Router} = require('express')
const User = require('../models/users')
const router = Router()

router.get('/login', async (req,res)=>{
   res.render('auth/login',{
      title: 'Авторизация',
      isLogin: true
   })
})

router.get('/logout', async(req,res)=>{
   req.session.destroy(()=>{
      res.redirect('/auth/login')
   })
})

router.post('/login', async(req,res)=>{
   const user = await User.findById('60b113bb67650025e8f2beb5')
   req.session.user = user
   req.session.isAuthenticated = true
   req.session.save(err =>{
      if(err){
         throw err
      }
       res.redirect('/')
   }) 
})

module.exports = router

//user.js

const {Schema, model} = require('mongoose')

const userSchema = new Schema({
   email:{
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   
})

module.exports = model('User', userSchema)


//variables

module.exports = function(req, res , next){
   res.locals.isAuth = req.session.isAuthenticated
   next()
}