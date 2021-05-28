const {Router} = require('express')
const router = Router()
const mysql = require("mysql2");

let results
const connection = mysql.createConnection({
   host: "localhost",
   user: "root",
   database: "anime",
   password: ""
 });
 connection.connect(err =>{
    if(err){
      throw new Error
    }else{
       console.log('sql work')
    }
 })
 connection.query("SELECT * FROM `serials` LIMIT 16",
    (err, result) => {
       if(err){
          throw new Error
       }else{
          results = result
       }
 });
 connection.end();



router.get('/',(req,res)=>{
   res.render('home',{ //рендеринг страницы
      title: 'Главная',
      Array: results
   })
})

module.exports = router // экспорт