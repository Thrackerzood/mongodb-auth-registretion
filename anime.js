const {Router} = require('express')
const router = Router()
const mysql = require("mysql2");

router.get('/:id', (req,res)=>{
   let awaits1 = new Promise ((resolve,reject) => {
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
         connection.query('SELECT * FROM `shows_season` WHERE show_name =' + `'${req.params.id}'`,
         (err, result) => {
            if(err){
               throw new Error
            }else{
               resolve(result)
               connection.end()
            }
      });
   })
   let awaits2 = new Promise ((resolve,reject) => {
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
         connection.query('SELECT * FROM `picture` WHERE name =' + `'${req.params.id}'`,
         (err, result) => {
            if(err){
               throw new Error
            }else{
               resolve(result)
               connection.end()
            }
      });
   })
   let awaits3 = new Promise ((resolve,reject) => {
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
      connection.query('SELECT * FROM `video_file` WHERE show_name_id =' + `'${req.params.id}'`,
      (err, result) => {
         if(err){
            throw new Error
         }else{
            resolve(result)
            connection.end()
         }
      });
   })
   Promise.all([awaits1,awaits2,awaits3]).then( (values) =>{
      res.render('anime',{
         title: `Аниме: ${req.params.id}`,
         anime: values[0],
         img: values[1],
         video: values[2]
      })  
   }).catch(err =>{
      console.log(err)
   }) 
})

module.exports = router