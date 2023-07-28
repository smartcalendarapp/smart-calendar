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

//MESSAGE
async function submitmessage(event){
	event.preventDefault()
	
	let feedbackform = getElement('feedbackform')
	let feedbackformemail = getElement('feedbackformemail')
	let feedbackformcontent = getElement('feedbackformcontent')
	
	const response = await fetch(`/sendmessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email: feedbackformemail.value, content: feedbackformcontent.value })
	})

	if (response.status == 200) {
		feedbackform.reset()
		
		let thankyoufeedback = getElement('thankyoufeedback')
		thankyoufeedback.classList.remove('display-none')

		let feedbackgroup = getElement('feedbackgroup')
		feedbackgroup.classList.add('display-none')
	}
}

function clickfeedbackdone(){
	let thankyoufeedback = getElement('thankyoufeedback')
	thankyoufeedback.classList.add('display-none')

	let feedbackgroup = getElement('feedbackgroup')
	feedbackgroup.classList.remove('display-none')
}