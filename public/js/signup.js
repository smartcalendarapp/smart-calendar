function getElement(id){
	return document.getElementById(id)
}




//background
const canvas = document.getElementById('dynamicbackground')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//let card = document.querySelector("#finalsplash");

window.addEventListener("scroll", () => {
	var top = ((window.scrollY / 20)-10);
	if (window.scrollY<1000){
  //card.style.transform = 'rotate3d(0.5, 0.5, 0.5, ' + top + 'deg)'
};
});

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
		ctx.fillStyle = `rgba(31, 64, 255, ${this.z * 0.25 * 0.5})`
		ctx.fill()
	}

	update(scrollY) {
		this.y -= scrollY * this.z * 0.25
		this.x += this.amplitude * Math.sin(this.angle)
		this.y += this.amplitude * 0.5 * Math.sin(this.angle / 3)
		this.angle += this.frequency
		if (this.y + this.height < 0) this.y += canvas.height + this.height
		if (this.y > canvas.height) this.y -= canvas.height + this.height
	}
}

const numRectangles = 20
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


//THEME
let rootdataset = document.documentElement.dataset;

let themedata = window.matchMedia("(prefers-color-scheme: dark)");
if (themedata.matches) {
  rootdataset.theme = 'dark'
} else {
	rootdataset.theme = ''
}

async function submitform(event){
	event.preventDefault()

	let errorwrap = getElement('errorwrap')
	errorwrap.classList.add('display-none')

	let form = getElement('form')
	const formdata = new FormData(form)
	
	const response = await fetch('/signup', {
	  method: 'POST',
		redirect: 'follow',
	  body: formdata
	})
	if (response.status == 401) {
		const data = await response.json()
		errorwrap.innerHTML = data.error
		errorwrap.classList.remove('display-none')
	}else if (response.status == 200){
		if (response.redirected) {
			window.location.replace(response.url)
		}
	}
}

async function logingoogle(options){
	const response = await fetch('/auth/google', { 
		method: 'POST',
		redirect: 'follow',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ options: options })
	})
	if(response.status == 200){
		const data = await response.json()
		window.location.replace(data.url)
	}
}

//login with apple
if(window.AppleID){
	getElement('appleidwrap').classList.remove('display-none')
	AppleID.auth.init({
		clientId: 'us.smartcalendar.web',
		scope: 'email name',
		redirectURI: 'https://smartcalendar.us/auth/apple/callback',
	})
}else{
	getElement('appleidwrap').classList.add('display-none')
}