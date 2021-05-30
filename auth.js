const {Router, response} = require('express')
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const router = Router()
const nodemailer = require('nodemailer')
const regEmail = require('../email/registration')
const resetEmail = require('../email/reset')
const crypto = require('crypto')
const transport = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'lrulcthulhu@gmail.com',
     pass: 'ershoxbthuthqdba',
   },
})

router.get('/login', async (req,res)=>{
   res.render('auth/login',{
      title: 'Авторизация',
      isLogin: true,
      error: req.flash('error'),
      good: req.flash('good'),
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
         const areSame = await bcrypt.compare(password, candidate.password)
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
            req.flash('error','Логин или пароль не совпадают')
            res.redirect('/auth/login')
         }
      }else{
         req.flash('error','Логин или пароль не совпадают')
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
         req.flash('error','Пользователь с таким email или login существует')
         res.redirect('/auth/login')
      }else if(loginC){
         req.flash('error','Пользователь с таким email или login существует')
         res.redirect('/auth/login')
      }
      else{
         const hashPassword = await bcrypt.hash(password, 10)
         const user = new User({
         login,email,password: hashPassword,confirm,Date_registration: new Date(),age: 0
      })
      await user.save()
      req.flash('good','Регистрация прошла успешно!')
      res.redirect('/auth/login')
      await transport.sendMail(regEmail(email,login))
      }
   }catch(e){
      throw e
   }
})


router.get('/reset', (req,res)=>{
   res.render('auth/reset'),{
      title: 'Смена пароля',
      error: req.flash('error')
   }
})

router.post('/reset', (req,res)=>{
   try{
      crypto.randomBytes(32, async(err,buffer)=>{
         if(err){
            req.flash('error', 'Что-то пошло не так, повторите попытку')
            return   res.redirect('/auth/reset')
         }
         const token = buffer.toString('hex')
         const candidate = await User.findOne({email: req.body.email})
         if(candidate){
            candidate.resetToken = token
            candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
            await candidate.save()
            await transport.sendMail(resetEmail(candidate.email, token, candidate.login))
            res.redirect('/auth/login')
         }else{
            req.flash('error','Пользователь не существует')
            res.redirect('/auth/reset')
         }
      })
   }catch(err){
      console.log(err)
   }
})

module.exports = router