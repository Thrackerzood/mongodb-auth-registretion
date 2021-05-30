const {Router} = require('express')
const router = Router()

router.get('/',(req,res)=>{
   res.render('list',{ //рендеринг страницы
      title: 'Информация',

   })
})

module.exports = router // экспорт