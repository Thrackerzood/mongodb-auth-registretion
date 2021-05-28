const {Router} = require('express')
const User = require('../models/users')
const bcrypt = require('bcryptjs')
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
   try{
      const {login,password} = req.body
      const candidate = await User.findOne({login})

      if(candidate){
         const areSame = password === candidate.password
         if(areSame){
            req.session.user = candidate
            req.session.isAuthenticated = true
            req.session.save(err=>{
               if(err){
                  throw err
               }
               res.redirect('/')
            })
         }else{
            res.redirect('/auth/login')
         }
      }else{
         res.redirect('/auth/login')
      }
   }catch(e){
      console.log(e)
   }
})


router.post('/register', async(req,res) =>{
   try{
      const {login,email,password,confirm} = req.body
      const emailC = await User.findOne({email})
      const loginC = await User.findOne({login})
      if(emailC){
         res.redirect('/auth/login')
      }else if(loginC){
         res.redirect('/auth/login')
      }
      else{
         const user = new User({
            login,email,password,confirm
         })
      await user.save()
      res.redirect('/auth/login#good!')
      }
   }catch(e){
      throw e
   }
})
module.exports = router