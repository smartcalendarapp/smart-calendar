

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
if(typeof window.AppleID !== 'undefined' && typeof window.AppleID.auth.init === 'function'){
	getElement('appleidwrap').classList.remove('display-none')
	AppleID.auth.init({
		clientId: 'us.smartcalendar.web',
		scope: 'email name',
		redirectURI: 'https://smartcalendar.us/auth/apple/callback',
	})
}else{
	getElement('appleidwrap').classList.add('display-none')
}


//invite stuff
async function checkinvitecode(submit){
	const url = new URL(window.location.href)
    const pathSegments = url.pathname.split('/')

	let inviteerror = getElement('inviteerror')

	inviteerror.classList.add('display-none')
	
	let invitecodeinput = getElement('invitecodeinput')

	let invitecode = pathSegments[2] || (invitecodeinput && invitecodeinput.value)
	invitecode = invitecode && invitecode.replace('https://smartcalendar.us/invite/', '').trim()


	let invitecontainer = getElement('invitecontainer')
	let formcontainer = getElement('formcontainer')
	let invitecontainerloaded = getElement('invitecontainerloaded')

    if(!invitecode){
		if(submit && !invitecontainer.classList.contains('display-none')){
			let errtext = `Please enter a code!`

			inviteerror.classList.remove('display-none')

			inviteerror.innerHTML = errtext
		}else{
			invitecontainer.classList.remove('display-none')
		}
		return
    }

	try{
		let checkinvitesubmitbutton = getElement('checkinvitesubmitbutton')
		checkinvitesubmitbutton.innerHTML = 'Loading...'

		const response = await fetch('/submitreferafriendinvitelink', { 
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ invitecode: invitecode })
		})

		if(response.status == 200){
			invitecontainerloaded.classList.remove('display-none')
			invitecontainer.classList.add('display-none')

			let data = await response.json()

			let invitecontainerloadedavatar = getElement('invitecontainerloadedavatar')
			invitecontainerloadedavatar.innerHTML = getAvatar(data.data.googleprofilepicture, data.data.name)

			let invitecontainerloadedtext = getElement('invitecontainerloadedtext')
			invitecontainerloadedtext.innerHTML = `${data.data.name} invited you to sign up with`
		}else if(response.status == 401){
			invitecontainer.classList.remove('display-none')

			let data = await response.json()
			
			let errtext = `${data.error}`
			inviteerror.innerHTML = errtext

			inviteerror.classList.remove('display-none')
		}
	}catch(err){
		invitecontainer.classList.remove('display-none')

		let errtext = `An unexpected error ocurred, please try again.`
		inviteerror.innerHTML = errtext

		inviteerror.classList.remove('display-none')

		console.log(err)
	}

	checkinvitesubmitbutton.innerHTML = 'Submit'

}
checkinvitecode()

function clickback(){
	let invitecontainer = getElement('invitecontainer')
	let formcontainer = getElement('formcontainer')
	let invitecontainerloaded = getElement('invitecontainerloaded')

	invitecontainerloaded.classList.add('display-none')
	invitecontainer.classList.remove('display-none')
	formcontainer.classList.add('display-none')
}

function letsdothis(){
	let invitecontainer = getElement('invitecontainer')
	let formcontainer = getElement('formcontainer')
	let invitecontainerloaded = getElement('invitecontainerloaded')

	invitecontainerloaded.classList.add('display-none')
	invitecontainer.classList.add('display-none')
	formcontainer.classList.remove('display-none')
	
	let inviteerror = getElement('inviteerror')

	inviteerror.classList.add('display-none')

	google.accounts.id.prompt()
}

function getAvatar(googleprofilepicture, name){
    const DEFAULTCOLORS = ['#ff2e2e', '#ff932e', '#ffe32e', '#b4f22e', '#2ad143', '#18f595', '#18f5ea', '#18a4f5', '#185bf5', '#4724f2', '#8138ff', '#b232fc', '#f022d8', '#e62971', '#000000']

	function nameToColor(name) {
		let sum = 0;
		for (let i = 0; i < name.length; i++) {
			sum += name.charCodeAt(i);
		}
		return DEFAULTCOLORS[sum % DEFAULTCOLORS.length]
	}

	const avataricon = `<div style="background-color: ${nameToColor(name)}" class="border-round avatarimage pointer display-flex flex-row align-center justify-center"><div class="text-20px text-white text-bold">${name.slice(0, 1).toUpperCase()}</div>`
	
	let avatar = googleprofilepicture ? `<img class="border-round avatarimage" src="${googleprofilepicture}" alt="Profile picture"></img>` : avataricon
	
    return avatar
}