function getElement(id){
	return document.getElementById(id)
}

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
	
	const response = await fetch(`/login`, {
	  method: 'POST',
		redirect: 'follow',
	  body: formdata
	})
	if (response.status == 401) {
		const data = await response.json()
		errorwrap.innerHTML = data.error
		errorwrap.classList.remove('display-none')
	}else if(response.status == 200){
		if (response.redirected) {
			window.location.replace(response.url)
		}
	}
}

async function logingoogle(options){
	let errorwrap = getElement('errorwrap')
	errorwrap.classList.add('display-none')
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
	getElement('appleid-signin').classList.remove('display-none')
	AppleID.auth.init({
		clientId: 'us.smartcalendar.web',
		scope: 'email name',
		redirectURI: 'https://smartcalendar.us/auth/apple/callback'
	})
}