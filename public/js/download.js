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

function updatescroll(event){
	let navbar = getElement('navbar')
	if(window.scrollY > 0){
		navbar.classList.add('scrolled')
	}else{
		navbar.classList.remove('scrolled')
	}
}
updatescroll()

window.addEventListener('scroll', updatescroll)