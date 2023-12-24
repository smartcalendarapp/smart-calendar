

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


async function checkinvitecode(){
	const url = new URL(window.location.href)
    const pathSegments = url.pathname.split('/')

	let inviteerror = getElement('inviteerror')
	let inviteerror2 = getElement('inviteerror2')
	
	let invitecodeinput = getElement('invitecodeinput')

	let invitecode = pathSegments[2] || (invitecodeinput && invitecodeinput.value)
	invitecode = invitecode && invitecode.replace('https://smartcalendar.us/invite/', '')


	let invitecontainer = getElement('invitecontainer')
	let formcontainer = getElement('formcontainer')
	let invitecontainerloaded = getElement('invitecontainerloaded')

	formcontainer.classList.add('display-none')
	invitecontainerloaded.classList.add('display-none')
	invitecontainer.classList.add('display-none')

    if(!invitecode){
		invitecontainer.classList.remove('display-none')
		return
    }

	try{
		if(invitecodeinput){
			invitecodeinput.value = ''
		}

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
			
			let errtext = `
			<div class="errorwrap">${data.error}</div>`
			inviteerror.innerHTML = errtext
			inviteerror2.innerHTML = errtext
		}
	}catch(err){
		invitecontainer.classList.remove('display-none')

		let errtext = `
		<div class="errorwrap">An unexpected error ocurred, please try again.</div>`
		inviteerror.innerHTML = errtext
		inviteerror2.innerHTML = errtext

		console.log(err)
	}

}
checkinvitecode()

function letsdothis(){
	let invitecontainer = getElement('invitecontainer')
	let formcontainer = getElement('formcontainer')
	let invitecontainerloaded = getElement('invitecontainerloaded')

	invitecontainerloaded.classList.add('display-none')
	invitecontainer.classList.add('display-none')
	formcontainer.classList.remove('display-none')
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

	const avataricon = `<div style="background-color: ${nameToColor(name)}" class="border-round avatarimage pointer display-flex flex-row align-center justify-center"><div class="text-20px text-white text-bold">${name.slice(0, 1)}</div>`
	
	let avatar = googleprofilepicture ? `<img class="border-round avatarimage" src="${googleprofilepicture}" alt="Profile picture"></img>` : avataricon
	
    return avatar
}