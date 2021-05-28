const express = require("express");
const mongoose = require("mongoose")
const expHBS = require('express-handlebars')
const home = require('./html/routes/home')
const about = require('./html/routes/list')
const anime = require('./html/routes/anime')
const account = require('./html/routes/account')
const app = express()
const session = require('express-session')
const MongoStore = require("connect-mongodb-session")(session)
const auth = require('./html/routes/auth')
const User = require('./html/models/users')
const varMiddleware = require('./middleware/variables');




const hbs = expHBS.create({ // создает новую hbs
   defaultLayout: 'main',// layouts - main - будет главной hbs
   extname: 'hbs' // .hbs рассширение
})

const store = new MongoStore({
   collection: 'sessions',
   uri: urlDB
})


app.engine('hbs', hbs.engine) //организовывает загрузку плагина
app.set('view engine', 'hbs') //использование hbs
app.set('views','html') //настройка папки для шаблонов которые подключаются


app.use(express.urlencoded({extended: true}))
app.use(session({
   secret: 'some secret value',
   resave: false,
   saveUninitialized: false,
   store
}))
app.use(varMiddleware)

app.use(express.static('public')) // подключение js и css 
app.use('/',home) //routing '/' - выбор роутинга
app.use('/list',about)
app.use('/anime',anime)
app.use('/auth', auth)
app.use('/account', account)

const PORT = process.env.PORT || 3000
async function start(){
   try{
      await mongoose.connect(urlDB,{
         useNewUrlParser: true, 
         useUnifiedTopology: true
   })
      app.listen(PORT)
   }catch(e){
      console.log(e)
   }
}
start(urlDB)