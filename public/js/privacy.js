function getelement(id){
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