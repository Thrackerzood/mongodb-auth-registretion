//VideoPlayer
let srcVideo = document.querySelector('.select')
let video = document.querySelector('#video')
window.addEventListener('load', ()=>{
   video.src = srcVideo.value
   video.setAttribute('poster', `${srcVideo.options[srcVideo.selectedIndex]?.dataset.img}`) 
})
srcVideo.addEventListener('change',()=>{
   video.src = srcVideo.value
   video.setAttribute('poster', `${srcVideo.options[srcVideo.selectedIndex]?.dataset.img}`) 
})
document.querySelector('.play').onclick = play
function play(){
   video.play()
}


//slider animation

let sub_elem = document.querySelector('.sub-sub-slider')
let slider = new Array (...sub_elem.children)
setInterval(() => {
   first = slider[0]
   slider.push(first)
   slider[slider.length-1] = first
   slider[0] = slider[slider.length-1]
   console.log(first)
   sub_elem.appendChild(slider[slider.length-1])
   sub_elem.firstChild.remove()
   slider.shift()
}, 1500)