
const registration = document.querySelector('.registration')
const login = document.querySelector('.login')

window.addEventListener('load', ()=>{
   login.classList.toggle('target')
   document.querySelector('.registration_tab').style.display = 'none'
   document.querySelector('.login_tab').style.display = 'block'
})

login.addEventListener('click',()=>{
   login.classList.toggle('target')
   registration.classList.toggle('target')
   document.querySelector('.registration_tab').style.display = 'none'
   document.querySelector('.login_tab').style.display = 'block'
})

registration.addEventListener('click',()=>{
   login.classList.toggle('target')
   registration.classList.toggle('target')
   document.querySelector('.login_tab').style.display = 'none'
   document.querySelector('.registration_tab').style.display = 'block'
})