function getelement(id) { return document.getElementById(id) }

const chinesenumbers = [
	'零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八',
	'十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九',
	'四十', '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九'
]

const englishnumbers = [
	'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
	'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine',
	'forty', 'forty-one', 'forty-two', 'forty-three', 'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine'
]

let exportedstats = { rounds: [] }


let DEFAULTEXPORT = {
    positionmode: POSITIONMODE,
    mathmode: MATHMODE,
    audiolang: AUDIOLANG,
    displaylang: DISPLAYLANG,
    nlevel: NLEVEL,
    minspeed: 3000,
    maxspeed: 3000,
    stimuluscount: 10,
    rounds: [
        {
            positionmode: POSITIONMODE,
            mathmode: MATHMODE,
            audiolang: AUDIOLANG,
            displaylang: DISPLAYLANG,
            nlevel: NLEVEL,
            minspeed: 3000,
            maxspeed: 3000,
            stimuluscount: 30
        },
        {
            positionmode: POSITIONMODE,
            mathmode: MATHMODE,
            audiolang: AUDIOLANG,
            displaylang: DISPLAYLANG,
            nlevel: NLEVEL,
            minspeed: 2400,
            maxspeed: 2400,
            stimuluscount: 30
        },
        {
            positionmode: POSITIONMODE,
            mathmode: MATHMODE,
            audiolang: AUDIOLANG,
            displaylang: DISPLAYLANG,
            nlevel: NLEVEL,
            minspeed: 1800,
            maxspeed: 1800,
            stimuluscount: 30
        }
    ]
}


function generateID() {
    let uuid = ''
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  
    for (let i = 0; i < 8; i++) {
      const rnd = Math.floor(Math.random() * chars.length)
      uuid += chars[rnd]
    }
  
    return uuid
}
let researchid;
  

function setup() {
	if (!RESEARCH) {
		getelement('settingswrap').classList.remove('display-none')
		getelement('exitresearchbutton').classList.add('display-none')
	} else {
		getelement('settingswrap').classList.add('display-none')
		getelement('exitresearchbutton').classList.remove('display-none')
	}


	let buttonwrap = getelement('buttonwrap')
	buttonwrap.style.width = buttonwrap.offsetHeight + 'px'

	let tempoutput = ''
	for (let i = 0; i < MAXNUMS; i++) {
		tempoutput += `<div onclick="clickbutton(${i + 1})" class="button" id="button${i + 1}"></div>`
	}
	buttonwrap.innerHTML = tempoutput

	if (POSITIONMODE == 0) {

		let yradius = buttonwrap.offsetHeight
		let xradius = buttonwrap.offsetWidth
		let tempmaxnumpercircle = MAXNUMPERCIRCLE
		let tempi = 0

		for (let i = 0; i < MAXNUMS; i++) {
			let buttondiv = getelement(`button${i + 1}`)

			let dodecreaseit;
			if (tempi >= tempmaxnumpercircle) {
				xradius -= 200
				yradius -= 200
				dodecreaseit = true
				tempi = 0
			}

			buttondiv.style.top = (-Math.cos(tempi * 2 * Math.PI / (Math.min(MAXNUMS, tempmaxnumpercircle))) * yradius / 2 + buttonwrap.offsetHeight / 2) + 'px'
			buttondiv.style.left = (Math.sin(tempi * 2 * Math.PI / (Math.min(MAXNUMS, tempmaxnumpercircle))) * xradius / 2 + buttonwrap.offsetWidth / 2) + 'px'
			buttondiv.innerHTML = [i + 1, englishnumbers[i + 1], chinesenumbers[i + 1]][DISPLAYLANG]

			if (dodecreaseit) {
				tempmaxnumpercircle -= 4
			}

			tempi++
		}

	} else if (POSITIONMODE == 1) {

		let alreadypushed = []

		for (let i = 0; i < MAXNUMS; i++) {
			let buttondiv = getelement(`button${i + 1}`)
			function generatecoord() {
				return { x: Math.random() * buttonwrap.offsetHeight, y: Math.random() * buttonwrap.offsetWidth }
			}

			let iter = 0;
			let coord = generatecoord()
			while (alreadypushed.find(d => Math.sqrt((d.x - coord.x) ** 2 + (d.y - coord.y) ** 2) < 90)) {
				coord = generatecoord()
				iter++
				if (iter > 100) break
			}

			alreadypushed.push(coord)

			buttondiv.style.top = (coord.x) + 'px'
			buttondiv.style.left = (coord.y) + 'px'
			buttondiv.innerHTML = [i + 1, englishnumbers[i + 1], chinesenumbers[i + 1]][DISPLAYLANG]
		}

	} else if (POSITIONMODE == 2) {

		let yradius = buttonwrap.offsetHeight
		let xradius = buttonwrap.offsetWidth
		let tempmaxnumpercircle = MAXNUMPERCIRCLE
		let tempi = 0

		let availablenums = []
		for (let i = 0; i < MAXNUMS; i++) {
			availablenums.push(i + 1)
		}
		availablenums = availablenums.sort(() => Math.random() - 0.5)

		for (let i = 0; i < MAXNUMS; i++) {
			let buttondiv = getelement(`button${availablenums[i]}`)

			let dodecreaseit;
			if (tempi >= tempmaxnumpercircle) {
				xradius -= 200
				yradius -= 200
				dodecreaseit = true
				tempi = 0
			}

			buttondiv.style.top = (-Math.cos(tempi * 2 * Math.PI / (Math.min(MAXNUMS, tempmaxnumpercircle))) * yradius / 2 + buttonwrap.offsetHeight / 2) + 'px'
			buttondiv.style.left = (Math.sin(tempi * 2 * Math.PI / (Math.min(MAXNUMS, tempmaxnumpercircle))) * xradius / 2 + buttonwrap.offsetWidth / 2) + 'px'
			buttondiv.innerHTML = [availablenums[i], englishnumbers[availablenums[i]], chinesenumbers[availablenums[i]]][DISPLAYLANG]

			if (dodecreaseit) {
				tempmaxnumpercircle -= 4
			}

			tempi++
		}

	}
}




//stats
let stats = []
let spokenstarttimestamp;




//vars


let gametimeout;
let currentnumber, chosennumber;
let storednums = []

let tickindex = 0;

let POSITIONMODE = 0
/*
mode 0 is circular
mode 1 is random
mode 2 is random circular
*/

let MATHMODE = 0
/*
mode 0 is addition
mode 1 is multiplcation
*/

let AUDIOLANG = 0
/*
mode 0 is english
mode 1 is chinese
mode 2 is alternating
mode 3 is random
*/

let DISPLAYLANG = 0
/*
mode 0 is numerical
mode 1 is chinese
mode 2 is english
*/

let MAXNUMS;
function initvariables() {
	MAXNUMS = (MATHMODE == 0) ? (9 * NLEVEL) : 49
}
let MAXNUMPERCIRCLE = 18
let SHOWFEEDBACK = true

let MINSPEED = 3000
let MAXSPEED = 1000
let delay = MINSPEED
let NLEVEL = 2
let STIMULUSCOUNT = null
let ROUNDS = []
let roundscompleted = 0


//query
let RESEARCH;
let ISRESEARCHDEMO;

function startresearchdemo() {
	ISRESEARCHDEMO = true
	SHOWFEEDBACK = true

	reset()
}

let queryParams = new URLSearchParams(window.location.search)
function checkquery() {
	if (queryParams.get('research')) {
        let decoded = JSON.parse(hexToString(queryParams.get('research')))
        if(!decoded){
            decoded = DEFAULTEXPORT
        }

        if(decoded){
            if (decoded.positionmode) {
                POSITIONMODE = +decoded.positionmode
            }
        
            if (decoded.mathmode) {
                MATHMODE = +decoded.mathmode
            }
        
            if (decoded.audiolang) {
                AUDIOLANG = +decoded.audiolang
            }
        
            if (decoded.displaylang) {
                DISPLAYLANG = +decoded.displaylang
            }
        
            if (decoded.nlevel) {
                NLEVEL = +decoded.nlevel
            }

            if(decoded.stimuluscount){
                STIMULUSCOUNT = +decoded.stimuluscount
            }

            if(decoded.minspeed){
                MINSPEED = +decoded.minspeed
            }

            if(decoded.maxspeed){
                MAXSPEED = +decoded.maxspeed
            }
        
            if (decoded.rounds) {
                ROUNDS = decoded.rounds
            }

            //some research update
            if(ROUNDS.length > 0){
                RESEARCH = true

                exportedstats.settings = decoded

                getelement('researchinstructions1').classList.remove('display-none')
                researchid = generateID()
        
                let idbutton = getelement('idbutton')
                idbutton.innerHTML = `ID: ${researchid}`
            }


        }
	}
}
checkquery()

function clickid(){
    navigator.clipboard.writeText(researchid)

    let idbutton = getelement('idbutton')
    idbutton.innerHTML = `ID: ${researchid} copied!`

    setTimeout(function(){
        let idbutton = getelement('idbutton')
        idbutton.innerHTML = `ID: ${researchid}`
    },1000)
}



async function clickresearchexport() {
    let exportinput = getelement('exportinput')
    
	let str2 = window.location.protocol + '//' + window.location.host + window.location.pathname + `?research=${stringToHex(exportinput.value)}`
	navigator.clipboard.writeText(str2)
}

async function clickresearchvalexport() {
    let str2 = JSON.stringify(DEFAULTEXPORT)

    let exportinput = getelement('exportinput')
    exportinput.value = str2
}


function stringToHex(str) {
    let hexStr = '';
    for (let i = 0; i < str.length; i++) {
        hexStr += str.charCodeAt(i).toString(16);
    }
    return hexStr;
}

function hexToString(hexStr) {
    let str = '';
    for (let i = 0; i < hexStr.length; i += 2) {
        str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
    }
    return str;
}


//reset


reset()

function reset() {
	clearTimeout(gametimeout)

	initvariables()

	currentnumber = null
	storednums = []
	chosennumber = null


	delay = MINSPEED


    //stats
	if (stats.length > 0) {
		exportedstats.rounds.push(stats)
	}
	stats = []

	tickindex = 0


	updatesettings()


	setup()

	getelement('start').classList.remove('display-none')

	if (RESEARCH) {
		if (ISRESEARCHDEMO) {
			getelement('start').innerHTML = 'Click to start demo<br><span style="font-size:14px">Make sure your volume is turned up</span>'
		} else {
            if(roundscompleted == 0){
			    getelement('start').innerHTML =  `Click to start experiment<br><span style="font-size:14px">Feedback will not be shown</span><br><span style="font-size:12px">Takes ~4 min. Please find a quiet space without distractions.</span>`
            }else if(ROUNDS.length > 0){
                getelement('start').innerHTML = `Click to continue`
            }else{
                getelement('start').classList.add('display-none')
            }

		}
	}

}


async function exportdata() {
    let googleformurl = getelement('googleformurl')
    googleformurl.href = `https://docs.google.com/forms/d/e/1FAIpQLSdv8iYA3gmcknyFZb4z6Th6I1gQH7So_Ev-Niadk0l408puSg/viewform?usp=pp_url&entry.597758209=${researchid}`

	const response = await fetch('/saveresearchdata', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			exportedstats: exportedstats,
            id: researchid,
		})
	})
	if (response.status == 200) {

		getelement('donemessage').classList.remove('display-none')

		exportedstats = { rounds: [] }
	} else {
		getelement('errormessage').classList.remove('display-none')
		setTimeout(function() {
			getelement('errormessage').classList.add('display-none')
		}, 4000)

		setTimeout(function() {
			//retry
			exportdata()
		}, 3000)
	}
}


//game


let numindex = 0;

function rng(max) { //between 1 and max, inclusive
	return Math.floor(Math.random() * (max)) + 1
}


function clickbutton(num) {
	const buffertime = 400 //if click from previous runs into next stimulus, cancel it

	if (chosennumber != null || storednums.length == 0) return

	if (Date.now() - spokenstarttimestamp < buffertime && !ischosencorrect()) {
		return
	}

	getelement('tapaudio').play()
	chosennumber = num

	answeredtimestamp = Date.now()
}


function ischosencorrect() {
	return ((MATHMODE == 0 && chosennumber == currentnumber + storednums.reduce((s, a) => s + a, 0)) || (MATHMODE == 1 && chosennumber == currentnumber * storednums.reduce((s, a) => s * a, 1)))
}
function getanswer(){
    if(MATHMODE == 0){
        return currentnumber + storednums.reduce((s, a) => s + a, 0)
    }else if(MATHMODE == 1){
        return currentnumber * storednums.reduce((s, a) => s * a, 1)
    }
}

let answeredtimestamp;
function tickgame() {
	if (AUDIOLANG == 0) {
		const utterance = new SpeechSynthesisUtterance(currentnumber)
		const voices = speechSynthesis.getVoices()
		utterance.voice = voices[0]
		window.speechSynthesis.speak(utterance)
	} else if (AUDIOLANG == 1) {
		let numberaudio = getelement(`numberaudio${currentnumber}`)
		numberaudio.playbackRate = 1.3
		numberaudio.play()
	} else if (AUDIOLANG == 2) {
		if (tickindex % 2 == 0) {
			const utterance = new SpeechSynthesisUtterance(currentnumber)
			const voices = speechSynthesis.getVoices()
			utterance.voice = voices[0]
			window.speechSynthesis.speak(utterance)
		} else {
			let numberaudio = getelement(`numberaudio${currentnumber}`)
			numberaudio.playbackRate = 1.3
			numberaudio.play()
		}
	} else if (AUDIOLANG == 3) {
		if (Math.random() < 0.5) {
			const utterance = new SpeechSynthesisUtterance(currentnumber)
			const voices = speechSynthesis.getVoices()
			utterance.voice = voices[0]
			window.speechSynthesis.speak(utterance)
		} else {
			let numberaudio = getelement(`numberaudio${currentnumber}`)
			numberaudio.playbackRate = 1.3
			numberaudio.play()
		}
	}
	tickindex++

	let feedback = getelement('feedback')


	spokenstarttimestamp = Date.now()

	gametimeout = setTimeout(function() {
		//vars
		let responsetime;
		if (answeredtimestamp) {
			responsetime = answeredtimestamp - spokenstarttimestamp
		}

		let questionright;

		let answercounts;

		let operatednums = []
		let answernum = chosennumber


		if (storednums.length >= NLEVEL - 1) {

			operatednums.push(...[currentnumber, ...storednums].reverse())

			answercounts = true


			if (chosennumber != null && ischosencorrect()) {
				questionright = true

				//right
				delay -= (MINSPEED - MAXSPEED) / 30
				if (delay < MAXSPEED) {
					delay = MAXSPEED
				}

				if (SHOWFEEDBACK) {
					//feedback
					feedback.style.color = 'green'
					feedback.innerHTML = 'correct'
					feedback.classList.remove('display-none')
					setTimeout(function() {
						feedback.classList.add('display-none')
					}, 500)
				}

			} else {
				questionright = false

				//wrong
				delay += (MINSPEED - MAXSPEED) / 40
				if (delay > MINSPEED) {
					delay = MINSPEED
				}

				if (SHOWFEEDBACK) {
					//feedback
					feedback.style.color = 'red'
					feedback.innerHTML = 'incorrect'
					feedback.classList.remove('display-none')
					setTimeout(function() {
						feedback.classList.add('display-none')
					}, 500)
				}
			}
		}

		//vars
		storednums.unshift(currentnumber)
		if (storednums.length >= NLEVEL) {
			storednums.pop()
		}


        if(!RESEARCH){
		    currentnumber = MATHMODE == 0 ? Math.min(rng(MAXNUMS - storednums.reduce((s, a) => s + a, 0)), 9) : rng(Math.min(Math.floor(MAXNUMS / storednums.reduce((s, a) => s * a, 1)), 9))
        }else{
            const rng = [1,6,2,1,8,9,7,3,6,9,5,1,1,6,1,1,8,3,2,6,1,4,6,1,9,9,9,1,7,2,9,2,3,7,9,1,4,8,4,8,1,6,8,5,5,5,1,7,5,3,3,5,9,9,9,4,1,7,7,3,1,3,9,2,3,3,8,1,3,7,5,3,5,9,7,3,5,2,1,7,4,9,7,5,3,5,7,7,4,5,2,7,5,1,8,4,4,3,6,7,2,9,6,6,2,4,4,3,2,9,5,3,1,8,3,1,7,7,9,4,2,9,3,5,1,7,6,2,4,9,8,2,6,5,3,1,4,5,7,2,6,1,9,6,2,8,5,8,9,7,7,8,8,7,5,3,5,9,6,3,8,2,4,2,7,7,5,7,8,1,1,6,4,2,4,3,8,7,8,9,6,4,5,5,6,8,1,3,3,9,1,9,2,5,1,5,5,8,1,8,1,9,3,3,4,5,1,8,6,5,8,2,5,5,2,3,7,3,5,1,4,1,5,8,3,5,4,1,6,1,4,8,5,8,4,2,2,6,9,2,1,6,2,6,8,6,8,9,2,9,5,2,2,4,5,4,4,4,9,5,8,4,2,1,9,5,9,3,2,9,5,1,6,7,2,8,8,9,7,2,4,9,5,5,4,7,8,4,6,8,2,2,1,6,5,2,3,1,5,6]

            currentnumber = rng[numindex]

            numindex++
        }

		chosennumber = null
		answeredtimestamp = null

		//stats
		if (answercounts && !ISRESEARCHDEMO) {
			stats.push({ responsetime: responsetime, delay: delay, clickedanswer: answernum, correctanswer: getanswer(), isanswercorrect: questionright, operation: ['Addition', 'Multiplication'][MATHMODE], operationvalues: operatednums.join(', ') })
		}
		updatestats()

		if (!STIMULUSCOUNT || tickindex < STIMULUSCOUNT) {
			tickgame()
		} else {
			if (ISRESEARCHDEMO || ROUNDS.length > 0) {
                if(ISRESEARCHDEMO){
                    //transition to real test
                    ISRESEARCHDEMO = false
                    SHOWFEEDBACK = false
                }else{
                    roundscompleted++
                }
                
                //load the round
                if(ROUNDS[0].maxspeed != null) MAXSPEED = ROUNDS[0].maxspeed
                if(ROUNDS[0].minspeed != null) MINSPEED = ROUNDS[0].minspeed
                if(ROUNDS[0].stimuluscount != null) STIMULUSCOUNT = ROUNDS[0].stimuluscount
                if(ROUNDS[0].positionmode != null) POSITIONMODE = ROUNDS[0].positionmode
                if(ROUNDS[0].mathmode != null) MATHMODE = ROUNDS[0].mathmode
                if(ROUNDS[0].audiolang != null) AUDIOLANG = ROUNDS[0].audiolang
                if(ROUNDS[0].displaylang != null) DISPLAYLANG = ROUNDS[0].displaylang
                if(ROUNDS[0].nlevel != null) NLEVEL = ROUNDS[0].nlevel
                ROUNDS.shift()
			}else{
				exportdata()
			}

			setTimeout(function() {
				reset()
			}, 1000)

		}

	}, delay)
}

function updatestats() {
	let settingsstats = getelement('settingsstats')
	settingsstats.innerHTML = `Right: ${stats.length == 0 ? `` : `${stats.filter(d => d.questionright).length} 
 (${Math.floor(stats.filter(d => d.questionright).length / stats.length * 100)}%)`}<br>Avg response time: ${stats.length == 0 ? '' : `${Math.floor(stats.filter(d => d.responsetime).map(d => d.responsetime).reduce((s, a) => s + a, 0) / stats.filter(d => d.responsetime).length)} ms`}`
}



function clickexitresearch(event) {

	RESEARCH = false

	reset()

	let newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname
	history.pushState({ path: newUrl }, '', newUrl)
}

function start() {
	getelement('start').classList.add('display-none')

	currentnumber = rng(9)
	tickgame()
}


function clicksettings(event) {
	getelement('settingscontent').classList.toggle('display-none')
	updatesettings()
}

function updatesettings() {
	updatestats()

	let settingsoption1 = getelement('settingsoption1')
	let settingsoption2 = getelement('settingsoption2')
	let settingsoption3 = getelement('settingsoption3')
	let settingsoption4 = getelement('settingsoption4')

	for (let [index, div] of Object.entries(settingsoption1.children)) {
		if (index == POSITIONMODE) {
			div.classList.add('selectedsetting')
		} else {
			div.classList.remove('selectedsetting')
		}
	}

	for (let [index, div] of Object.entries(settingsoption2.children)) {
		if (index == MATHMODE) {
			div.classList.add('selectedsetting')
		} else {
			div.classList.remove('selectedsetting')
		}
	}

	for (let [index, div] of Object.entries(settingsoption3.children)) {
		if (index == AUDIOLANG) {
			div.classList.add('selectedsetting')
		} else {
			div.classList.remove('selectedsetting')
		}
	}

	for (let [index, div] of Object.entries(settingsoption4.children)) {
		if (index == DISPLAYLANG) {
			div.classList.add('selectedsetting')
		} else {
			div.classList.remove('selectedsetting')
		}
	}


	let delayslider = getelement('delayslider')
	delayslider.value = MINSPEED
	let startingdelaytext = getelement('startingdelaytext')
	startingdelaytext.innerHTML = `Starting speed: ${MINSPEED / 1000}s`

	let nlevelslider = getelement('nlevelslider')
	nlevelslider.value = NLEVEL
	let nleveltext = getelement('nleveltext')
	nleveltext.innerHTML = `N level: ${NLEVEL}`
}

function inputnlevel(event) {
	NLEVEL = event.target.value

	reset()
}

function inputstartingdelay(event) {
	MINSPEED = event.target.value
	delay = MINSPEED

	updatesettings()
}




function clicksettingsaudiolang(mode) {
	AUDIOLANG = mode

	reset()
}

function clicksettingsdisplaylang(mode) {
	DISPLAYLANG = mode

	reset()
}

function clicksettingspositionmode(mode) {
	POSITIONMODE = mode

	reset()
}
function clicksettingsmathmode(mode) {
	MATHMODE = mode

	reset()
}