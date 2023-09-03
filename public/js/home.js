
//background
const canvas = document.getElementById('dynamicbackground')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Rectangle {
	constructor() {
		this.x = Math.random() * canvas.width
		this.y = Math.random() * canvas.height
		this.width = 100 + Math.random() * 100
		this.height = 40 + Math.random() * 30
		this.z = Math.random() * 2
		this.radius = 10
		this.angle = Math.random() * Math.PI * 2
		this.amplitude = Math.random() * 0.5
		this.frequency = 0.01 + Math.random() * 0.01
	}

	draw() {
		const radius = this.radius
		ctx.beginPath()
		ctx.moveTo(this.x + radius, this.y)
		ctx.lineTo(this.x + this.width - radius, this.y)
		ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + radius, radius)
		ctx.lineTo(this.x + this.width, this.y + this.height - radius)
		ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height, radius)
		ctx.lineTo(this.x + radius, this.y + this.height)
		ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - radius, radius)
		ctx.lineTo(this.x, this.y + radius)
		ctx.arcTo(this.x, this.y, this.x + radius, this.y, radius)
		ctx.closePath()

		let showbackgroundeffectdivs = Array.from(document.getElementsByClassName('showbackgroundeffect'))
		let windowheight = (window.innerHeight || document.documentElement.clientHeight)
		let rectfirst = showbackgroundeffectdivs[0].getBoundingClientRect()
		let rectlast = showbackgroundeffectdivs[showbackgroundeffectdivs.length - 1].getBoundingClientRect()
		if(rectlast.top > windowheight){
			ctx.fillStyle = `rgba(31, 64, 255, ${this.z * 0.25 * 0.5})`
		}else{
			ctx.fillStyle = `rgba(255, 98, 31, ${this.z * 0.25 * 0.5})`
		}
		ctx.fill()
	}

	update(scrollY) {
		this.y -= scrollY * this.z * 0.25
		this.x += this.amplitude * Math.sin(this.angle)
		this.angle += this.frequency
		if (this.y + this.height < 0) this.y += canvas.height + this.height
		if (this.y > canvas.height) this.y -= canvas.height + this.height
	}
}

const numRectangles = 30
let rectangles = Array.from({ length: numRectangles }, () => new Rectangle())
let lastScrollY = document.documentElement.scrollTop || document.body.scrollTop

function draw() {
	const currentScrollY = document.documentElement.scrollTop || document.body.scrollTop
	const scrollDelta = currentScrollY - lastScrollY
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	rectangles.forEach(rect => {
		rect.update(scrollDelta)
		rect.draw()
	})
	lastScrollY = currentScrollY
	requestAnimationFrame(draw)
}

draw()


//check for logged in user
let clientinfo;
async function getclientinfo() {
	const response2 = await fetch('/getclientinfo', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			timezoneoffset: new Date().getTimezoneOffset()
		})
	}).catch(e => e)
	if (response2.status == 200) {
		const data = await response2.json()
		clientinfo = data.data
		
		let navbuttonsloggedout = getElement('navbuttonsloggedout')
		let navbuttonsloggedin = getElement('navbuttonsloggedin')
		let navbuttonsloggedout2 = getElement('navbuttonsloggedout2')
		let navbuttonsloggedin2 = getElement('navbuttonsloggedin2')

		navbuttonsloggedin.classList.remove('display-none')
		navbuttonsloggedout.classList.add('display-none')
		navbuttonsloggedin2.classList.remove('display-none')
		navbuttonsloggedout2.classList.add('display-none')

		//close one tap popup
		setInterval(() => {
			if(google) google.accounts.id.cancel()
		}, 100)
	} else if (response2.status == 401) {
	} else {
		return setTimeout(function () {
			getclientinfo()
		}, 3000)
	}
}
getclientinfo()


/*
window.onload = async () => {
	return
  
  const menu = getElement("navbar")
  const intro = getElement("intro")
  const autoSchedule = getElement("auto-schedule")
  const toDo = getElement("to-do-list")
  const syncWithGCalendar = getElement("sync-with-gcalendar")
  const getStarted = getElement("get-started")
  let slides = [intro, autoSchedule, toDo, syncWithGCalendar, getStarted]
  
  await scrollwindow(slides[0].offsetTop - navbar.offsetHeight - 50)

  
  let delay = Date.now();
  

  
  // counter for slides
  let item = 0;
  window.addEventListener("scroll", async (e) => {
    if (item >= slides.length - 1) return;
    
    //event.preventDefault()
    // -1 means that it is scrolling, for the people with potato pc
    if (Date.now() - delay > 100 && delay !== -1) {
      delay = -1;
      // TODO: change wether they scrolled up or down
      item += 1;
      document.body.style.overflow = "hidden"  
      await scrollwindow(slides[item].offsetTop - navbar.offsetHeight - 50) // 100 for padding idk
      delay = Date.now();
      document.body.style.overflow = "scroll"  
    }

  })
}
*/


function getElement(id){
	return document.getElementById(id)
}

//THEME

let rootdataset = document.documentElement.dataset

let devicetheme = ''
if ('matchMedia' in window) {
	let themedata = window.matchMedia('(prefers-color-scheme: dark)')
	if (themedata.matches){
	  devicetheme = 'dark'
	} else {
	  devicetheme = ''
	}
	themedata.addEventListener('change', changedevicetheme)
}
settheme(devicetheme)

function changedevicetheme(event){
	if(event.matches){
		devicetheme = 'dark'
	}else{
		devicetheme = ''
	}
	settheme(devicetheme)
}


function settheme(theme){
  rootdataset.theme = theme
}


//SCROLL
function updatescroll(event){
	let navbar = getElement('navbar')
	if(window.scrollY > 0){
		navbar.classList.add('scrolled')
	}else{
		navbar.classList.remove('scrolled')
	}
	
	const transitiondivs = document.getElementsByClassName('fadeslidebefore')
	for(let div of Array.from(transitiondivs)){
		if (inviewport(div)){
			if(!div.classList.contains('fadeslideafter')){
				div.src = div.src
	    		div.classList.add('fadeslideafter')
			}
			
	  }
	}

	const transitiondivs2 = document.getElementsByClassName('fadeslidebeforeslow')
	for(let div of Array.from(transitiondivs2)){
		if (inviewport(div)){
			if(!div.classList.contains('fadeslideafter')){
				div.src = div.src
	    		div.classList.add('fadeslideafter')
			}
			
	  }
	}

	//background effect
	let showbackgroundeffectdivs = Array.from(document.getElementsByClassName('showbackgroundeffect'))
	let windowheight = (window.innerHeight || document.documentElement.clientHeight)
	let rectfirst = showbackgroundeffectdivs[0].getBoundingClientRect()
	let rectlast = showbackgroundeffectdivs[showbackgroundeffectdivs.length - 1].getBoundingClientRect()

	if(rectfirst.bottom < windowheight && rectlast.bottom > windowheight){
		getElement('backgroundeffect').classList.remove('hiddenfadeslow')
	}else{
		getElement('backgroundeffect').classList.add('hiddenfadeslow')
	}
}


updatescroll()
window.addEventListener('scroll', updatescroll)

function inviewport(element){
	let rect = element.getBoundingClientRect()
	let windowheight = (window.innerHeight || document.documentElement.clientHeight)
	return (rect.top <= windowheight) && ((rect.top + rect.height) >= 0)
}

function clicklearnmore(){
	let nextpage = getElement('nextpage')
	scrollwindow(nextpage.offsetTop - window.innerHeight/2 + nextpage.offsetHeight/2)
}

function scrollwindow(destination){
  return new Promise((resolve, reject) => {
  	const duration = 500
    const start = window.pageYOffset
    const end = destination
    const change = end - start
    const increment = 20
    let currentTime = 0
    
    function animateScroll(){
      currentTime += increment
      const val = easeInOutQuad(currentTime, start, change, duration)
      window.scrollTo(0, val)
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll, increment)
      } else {
        resolve()
      }
    }
    animateScroll()
  
  	function easeInOutQuad(t, b, c, d){
  	  t /= d / 2
  	  if (t < 1) return c / 2 * t * t + b
  	  t--
  	  return -c / 2 * (t * (t - 2) - 1) + b
  	}    
  })

}

//MENU
function clickmenu(){
	let menu = getElement('menu')
	menu.style.maxHeight = menu.scrollHeight + 'px'
	menu.classList.toggle('hiddenheight')
	
	updatenavbarbackground()
}


window.addEventListener('touchstart', clickdocument, false)
window.addEventListener('click', clickdocument, false)

function clickdocument(event){
	let popup = getElement('navbar')
	let popupbutton = getElement('menubutton')
	
	if(!popup.contains(event.target) && !popupbutton.contains(event.target)){
		getElement('menu').classList.add('hiddenheight')

		updatenavbarbackground()
	}
}

function updatenavbarbackground(){
	if(getElement('menu').classList.contains('hiddenheight')){
		getElement('navbar').classList.remove('menubackground')
	}else{
		getElement('navbar').classList.add('menubackground')
	}
}