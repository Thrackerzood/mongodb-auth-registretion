const {Router, response} = require('express')
const User = require('../models/users')
const {body,validationResult} = require('express-validator/check')
const bcrypt = require('bcryptjs')
const router = Router()
const nodemailer = require('nodemailer')
const regEmail = require('../email/registration')
const resetEmail = require('../email/reset')
const crypto = require('crypto')



router.get('/login', async (req,res)=>{
   res.render('auth/login',{
      title: 'Авторизация',
      isLogin: true,
      error: req.flash('error'),
      good: req.flash('good'),
      registerError: req.flash('registerError')
   })
})

router.get('/logout', async(req,res)=>{
   req.session.destroy(()=>{
      res.redirect('/auth/login')
   })
})

router.post('/login', async(req,res)=>{
   try{
      const {email,password} = req.body
      const candidate = await User.findOne({email})

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


router.post('/register',body('email').isEmail(), async(req,res) =>{
   try{
      const {login,email,password,confirm} = req.body
      const emailC = await User.findOne({email})
      const loginC = await User.findOne({login})

      const errors = validationResult(req)
      if(!errors.isEmpty()){
         req.flash('registerError', errors.array()[0].msg)
         return res.status(422).redirect('/auth/login')
      }
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


router.get('/reset', async(req,res)=>{
   res.render('auth/reset',{
      title: 'Смена пароля',
      error: req.flash('error'),
   })
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


router.get('/password/:token', async(req,res)=>{
   if(!req.params.token){
      return res.redirect('/auth/login')
   }
   try{
   const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
   })
   if(!user){
      return res.redirect('/auth/login')
   }else{
      res.render('auth/password',{
      title: 'Смена пароля',
      error: req.flash('error'),
      userId: user._id.toString(),
      token: req.params.token
   })
   }
   }catch(e){
      console.log(e)
   }
})

router.post('/password', async (req,res)=>{
   try{
      const user = await User.findOne({
         _id: req.body.userId,
         resetToken: req.body.token,
         resetTokenExp: {$gt: Date.now()}
      })
      if(user){
         user.password = await bcrypt.hash(req.body.password, 10)
         user.resetToken = undefined
         user.resetTokenExp = undefined
         await user.save()
         res.redirect('/auth/login')
      }else{
         req.flash('loginError','Время востановления пароля закончилось')
         res.redirect('/auth/login')
      }
   }catch(e){
      console.log(e)
   }
})

module.exports = router