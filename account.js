const {Router} = require('express')
const router = Router()
const auth = require('../../middleware/auths')

router.get('/', auth, async (req,res)=>{
   res.render('account',{
      title: 'Аккаунт',
      isLogin: true,

   })
})


module.exports = router