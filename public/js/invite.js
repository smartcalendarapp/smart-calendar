

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

	let invitetitle = getElement('invitetitle')
	
	let invitecodeinput = getElement('invitecodeinput')

	const inviteCode = pathSegments[pathSegments.length - 1] || (invitecodeinput && invitecodeinput.value)

    if(inviteCode == 'invite'){
		invitetitle.innerHTML = `
		<div class="text-24px text-primary text-bold">Welcome to Smart Calendar</div>
		<div class="padding-top-24px"></div>
		<div class="text-18px text-primary text-bold">Paste your invite link here:</div>
		<div class="forminputwrap width-full">
			<input id="invitecodeinput" placeholder="Code or link" type="text" onkeydown="if(event.key == 'Enter'){ checkinvitecode() }" class="infoinput width-full"><span class="inputline"></span></input>
		</div>
		<div class="background-green width-full padding-top-12px padding-bottom-12px padding-left-16px padding-right-16px text-bold transition-duration-100 hover:background-green-hover text-14px pointer border-8px text-white" onclick="checkinvitecode()" id="referafriendgeneratelinkbutton">Submit</div>`

		return
    }

	try{
		if(invitecodeinput){
			invitecodeinput.value = ''
		}
		
		const response = await fetch('/getreferafriendinviteinfo', { 
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ invitelink: inviteCode })
		})

		if(response.status == 200){
			let data = await response.json()

			invitetitle.innerHTML = `
			<div class="display-flex flex-row gap-6px align-center">
				${getAvatar(data.data.googleprofilepicture, data.data.name)}
				<div class="text-18px text-quaternary text-primary">${data.data.name} invited you to sign up with</div>
			</div>
			<div class="text-24px text-primary text-bold">Smart Calendar!</div>
			<div class="padding-top-24px"></div>
			<div class="text-18px text-primary text-bold">Sign up to accept your friend's invite</div>`

			setStorage('referafriendinvitecode', inviteCode)

		}else if(response.status == 401){
			let data = await response.json()
			
			invitetitle.innerHTML = `
			<div class="errorwrap">${data.error}</div>`
		}
	}catch(err){
		invitetitle.innerHTML = `
		<div class="errorwrap">An unexpected error ocurred, please try again.</div>`

		console.log(err)
	}

}
checkinvitecode()

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