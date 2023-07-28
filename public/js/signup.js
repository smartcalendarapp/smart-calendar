function getElement(id){
	return document.getElementById(id)
}

function getcheckbox(boolean, tooltip){
	if(boolean){
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilled">
			<g>
			<path d="M50 0C22.3858 0 0 22.3858 0 50L0 206C0 233.614 22.3858 256 50 256L206 256C233.614 256 256 233.614 256 206L256 50C256 22.3858 233.614 0 206 0L50 0ZM200.688 54.125C204.511 53.7858 208.449 54.9038 211.625 57.5625C217.978 62.8798 218.817 72.3349 213.5 78.6875L114.844 196.562C108.848 203.725 97.8393 203.725 91.8438 196.562L42.5 137.625C37.1827 131.272 38.0224 121.817 44.375 116.5C50.7276 111.183 60.1827 112.022 65.5 118.375L103.344 163.562L190.5 59.4375C193.159 56.2612 196.864 54.4642 200.688 54.125Z" fill-rule="nonzero" opacity="1" stroke="none"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	}else{
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxunfilled">
			<g>
			<path d="M50 10L206 10C228.091 10 246 27.9086 246 50L246 206C246 228.091 228.091 246 206 246L50 246C27.9086 246 10 228.091 10 206L10 50C10 27.9086 27.9086 10 50 10Z" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	}
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

async function logingoogle(event){
	const response = await fetch('/auth/google', { 
		method: 'GET',
		redirect: 'follow',
	})
	if(response.status == 200){
		const data = await response.json()
		window.location.replace(data.url)
	}
}