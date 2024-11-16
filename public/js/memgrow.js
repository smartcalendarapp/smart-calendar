
function getelement(id){
    return document.getElementById(id)
}

MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
    svg: {
      fontCache: 'global'
    }
}


function generateID() {
	let uuid = ''
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

	for (let i = 0; i < 32; i++) {
		const rnd = Math.floor(Math.random() * chars.length)
		uuid += chars[rnd]
	}

	return uuid
}

function displaynumber(num, text){
    if(num == 1){
        return `${num} ${text}`
    }else{
        return `${num} ${text}s`
    }
}


function sleep(time) {
	return new Promise(resolve => {
		setTimeout(resolve, time)
	})
}

class UserData{
    constructor(){
        this.cardsets = []
    }

    addCardSet(cardset){
        if(Array.isArray(cardset)){
            this.cardsets.push(...cardset)
        }else{
            this.cardsets.push(cardset)
        }
    }

    getCardSet(id){
        return this.cardsets.find(d => d.id == id)
    }

    deleteCardSet(id){
        this.cardsets = this.cardsets.filter(d => d.id != id)
    }

    getCard(id){
        return this.cardsets.map(d => d.cards).flat().find(d => d.id == id)
    }

    getReviewSets(){
        return this.cardsets.filter(d => d.getStatus() == 1)
    }
}

class CardSet{
    constructor(title = '', cards = []){
        this.cards = cards
        this.title = title

        this.delayindex = 1
        //0 for long term
        //1 for short term
        //2 for music
        this.id = generateID()
    }

    addCard(card){
        if(Array.isArray(card)){
            this.cards.push(...card)
        }else{
            this.cards.push(card)
        }
    }

    getCard(id){
        return this.cards.find(d => d.id == id)
    }

    deleteCard(id){
        this.cards = this.cards.filter(d => d.id != id)
    }


    getStatus(){
        if(this.getReviewCards().length > 0){
            return 1
        }else if(this.cards.length != 0 && this.cards.filter(d => d.fronttext && d.backtext).length == 0){
            return 2
        }else{
            return 0
        }

        //status 0: review upcoming
        //status 1: ready for review
        //status 2: create a card first
    }

    getStatusText(){
        let status = this.getStatus()
        if(status == 0){
            function timeUntil(date) {
                const now = new Date()
                const diff = date - now
                const seconds = Math.floor(diff / 1000)
                const minutes = Math.floor(seconds / 60)
                const hours = Math.floor(minutes / 60)
                let days = Math.floor(hours / 24)
                const remainingHours = hours % 24
            
                if (remainingHours >= 12) days += 1
            
                const months = Math.floor(days / 30)
                const years = Math.floor(days / 365)
            
                if (years > 0) return [years, 'year']
                if (months > 0) return [months, 'month']
                if (days > 0) return [days, 'day']
                if (hours > 0) return [hours, 'hour']
                if (minutes > 0) return [minutes, 'minute']
                return [seconds, 'second']
            }

            let timeuntil = Math.min(...this.cards.filter(d => d.fronttext && d.backtext).map(d => d.laststudied + DELAYS[this.delayindex][d.laststudiedindex]))
            let timedata = timeUntil(timeuntil)
            return `Review in ${displaynumber(timedata[0], timedata[1])}`
        }else if(status == 1){
            return '<span class="greenreview">Ready for review</span>'
        }else if(status == 2){
            return 'Finish creating'
        }
    }

    getReviewTime(){
        return Math.ceil(this.getReviewCards().length/2)
    }

    getReviewCards(){
        return this.cards.filter(d => Date.now() > d.laststudied + DELAYS[this.delayindex][d.laststudiedindex] && d.fronttext && d.backtext)
    }


    getInnerHTML(){
        if(this.id == dragdivid && hascloned){
            return ''
        }else{
            return `<div class="pointer-none text-16px text-bold">${this.title || 'New Card Set'}</div>
            <div class="pointer-none text-13px text-secondary">${displaynumber(this.cards.length, 'item')} • ${this.getStatusText()}</div>`
        }
    }

    getHTML(){
        if(this.id == dragdivid && hascloned){
            return `<div data-id="${this.id}" class="cardset cardsetblank"></div>`
        }else{
            return `<div data-id="${this.id}" onmousedown="dragcardset(event, '${this.id}')" class="cardset gap-6px flex-column" onclick="opencardset('${this.id}')">${this.getInnerHTML()}</div>`
        }
    }
}

class Card{
    constructor(fronttext = '', backtext = ''){
        this.fronttext = fronttext
        this.backtext = backtext

        this.laststudied = 0
        this.laststudiedindex = 0
        this.id = generateID()
    }
}

const DELAYS = [
    [86400 * 1000, 5 * 86400 * 1000, 14 * 86400 * 1000, 30 * 86400 * 1000, 2 * 30 * 86400 * 1000, 4 * 30 * 86400 * 1000, 12 * 30 * 86400 * 1000],
    [4 * 3600 * 1000, 12 * 3600 * 1000, 86400 * 1000, 2 * 86400 * 1000, 5 * 86400 * 1000, 7 * 86400 * 1000, 14 * 86400 * 1000],
    [14 * 86400 * 1000, 21 * 86400 * 1000, 30 * 86400 * 1000]
]
//index 0 is long term, index 1 is short term, index 2 is music

let signedinuser = false


async function savedata(){
    try{
        if(signedinuser){            
            const response = await fetch('/saveuserdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: userdata,
                    lastedited: lastedited
                })
            })
            if(response.status != 200){
                console.log(response)
            }
        }else{
            localStorage.setItem('userdata', JSON.stringify(userdata))
        }
    }catch(err){
        console.log(err)
    }
}


async function loaddata(){
    try{
        const response = await fetch('/getuserdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.status == 200){
            const data = await response.json()
            userdata = data.data

            signedinuser = true
        }

        if(!signedinuser){
            let tempdata = localStorage.getItem('userdata')
            try{
                if(tempdata && JSON.parse(tempdata)){
                    userdata = JSON.parse(tempdata)
                }else{
                    userdata = new UserData()
                }
            }catch(err){
                userdata = new UserData()
            }
        }

        if(userdata){
            userdata = Object.assign(new UserData(), userdata)
            for(let index = 0; index < userdata.cardsets.length; index++){
                userdata.cardsets[index] = Object.assign(new CardSet(), userdata.cardsets[index])
                
                for(let index2 = 0; index2 < userdata.cardsets[index].cards.length; index2++){
                    userdata.cardsets[index].cards[index2] = Object.assign(new Card(), userdata.cardsets[index].cards[index2])
                }
            }
        }

        updatescreen()

        olddata = JSON.stringify(userdata)
        tempolddata = JSON.stringify(userdata)

        let lastcheckedlastedited = Date.now()
        
        lastedited = Date.now()

        let maininterval = setInterval(async function(){
            if(tempolddata != JSON.stringify(userdata)){
                lastedited = Date.now()
                tempolddata = JSON.stringify(userdata)
            }

            if(Date.now() - lastcheckedlastedited > 10000){
                //check if edited by another place
                lastcheckedlastedited = Date.now()
                const response = await fetch('/getuserdatalastedited', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                if(response.status == 200){
                    let data = await response.json()
                    let temp = data.lastedited
                    if(temp > lastedited){
                        //stop all
                        let screencover = getelement('screencover')
                        screencover.classList.remove('display-none')
                        
                        clearInterval(maininterval)
                        return
                    }
                }
            }

            if(olddata != JSON.stringify(userdata)){
                needsave = true
                if(Date.now() - lastsavedata > 10000 && Date.now() - lastcheckedlastedited < 10000){
                    await savedata()
                    olddata = JSON.stringify(userdata)
                }
            }else{
                needsave = false
            }
        
            let temp = userdata.getReviewSets().length
            if(temp > 0){
                if(lasttemp != temp){
                    document.title = `MemGrow (${temp})`
                }
            }else{
                if(lasttemp != temp){
                    document.title = 'MemGrow'
                }
            }
            lasttemp = temp
        }, 1000)
    }catch(err){
        console.log(err)
    }
}


//START

let screenview = 0

let currentcardset;
let currentcardindex;
let displaycardindexes = []
let editcardmode = false
let showanswer = false
let hidecardgroupblur = false
let finishedreview = false

let userdata;


loaddata()

//loops
let lasttemp;
let olddata;
let lastsavedata = 0;
let needsave;
let tempolddata;
let lastedited = 0;


function getneedsave(){
    return needsave
}
window.onbeforeunload = function (e) {
    e = e || window.event;

	if(getneedsave()){
		if (e) {
			e.returnValue = 'Sure?';
		}
		return 'Sure?'
	}
}


setInterval(function(){
    if(document.visibilityState == 'visible'){
        updatescreendynamically()
    }
}, 1000)



function updatescreendynamically(){
    if(screenview == 0){
        let cardsetlistchildren = Array.from(getelement('cardsetlist').children)
        for(let div of cardsetlistchildren){
            let id = div.dataset.id
            let cardset = userdata.getCardSet(id)
            if(!cardset) continue

            div.innerHTML = cardset.getInnerHTML()
        }
    }else if(screenview == 1){
        let cardgroupblur = getelement('cardgroupblur')
        cardgroupblur.innerHTML = getcardgroupblurHTML()
    }
}


function updatescreen(){
    let screenview1 = getelement('screenview1')
    screenview1.classList.add('hidden')

    if(screenview == 0){
        let cardlist = getelement('cardlist')
        cardlist.classList.add('hiddenwidth')

        let cardgroupblur = getelement('cardgroupblur')
        cardgroupblur.classList.remove('hidden')


        //ui
        let cardsetlist = getelement('cardsetlist')

        let output = []
        for(let item of userdata.cardsets){
            output.push(item.getHTML())
        }

        output.push(`<div class="cardset gap-6px flex-column align-center justify-center" onclick="createnewcardset()">
                <div class="pointer-none buttonwhitebackground">
                    <svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonwhite">
                    <g>
                    <g opacity="1">
                    <path d="M128.004 10.0039L128.004 246.004" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
                    <path d="M246.004 128.004L10.0039 128.004" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
                    </g>
                    </g>
                    </svg>
                </div>
            <div class="pointer-none text-16px">Create new</div>
        </div>`)

        cardsetlist.innerHTML = output.join('')
    }else if(screenview == 1){
        let cardlist = getelement('cardlist')
        cardlist.classList.add('hiddenwidth')
        
        let aibuttonwrap = getelement('aibuttonwrap')
        aibuttonwrap.classList.add('hiddenshiftdown')
        if(editcardmode || !currentcardset.mixset){
            aibuttonwrap.classList.remove('hiddenshiftdown')
        }

        let screencardsettitle = getelement('screencardsettitle')
        screencardsettitle.classList.remove('titleinputedit')
        screencardsettitle.disabled = true
        screencardsettitle.value = currentcardset.title

        let screencardfronttext = getelement('screencardfronttext')
        screencardfronttext.classList.remove('textareainputedit')
        screencardfronttext.disabled = true
        screencardfronttext.innerHTML = (currentcardset.cards[currentcardindex].fronttext || '')

        let screencardbacktext = getelement('screencardbacktext')
        screencardbacktext.classList.remove('textareainputedit')
        screencardbacktext.disabled = true
        screencardbacktext.innerHTML = (currentcardset.cards[currentcardindex].backtext || '')



        let cardanswercover = getelement('cardanswercover')
        if(editcardmode || showanswer || !currentcardset.cards[currentcardindex].fronttext || !currentcardset.cards[currentcardindex].backtext){
            cardanswercover.classList.add('hidden')
        }else{
            cardanswercover.classList.remove('hidden')
        }

        let clickbackhomebutton = getelement('clickbackhomebutton')
        clickbackhomebutton.classList.remove('display-none')

        let editcardset = getelement('editcardset')
        editcardset.classList.remove('display-none')

        let doneeditcardset = getelement('doneeditcardset')
        doneeditcardset.classList.add('display-none')

        let editcardactions = getelement('editcardactions')
        editcardactions.classList.add('hidden')

        let remembergroup = getelement('remembergroup')
        remembergroup.classList.add('hidden')

        let remembergroupitems = getelement('remembergroupitems')
        remembergroupitems.style.maxHeight = remembergroupitems.offsetHeight + 'px'
        remembergroupitems.classList.add("hidden")

        let deletecardsetbutton = getelement('deletecardsetbutton')
        deletecardsetbutton.classList.add('hidden')

        if(!editcardmode && hidecardgroupblur && !finishedreview){
            remembergroup.classList.remove('hidden')
            if(showanswer){
                remembergroupitems.classList.remove("hidden")
            }
        }


        let togglecardsetintervalbutton = getelement('togglecardsetintervalbutton')
        togglecardsetintervalbutton.classList.add('hidden')
        togglecardsetintervalbutton.innerHTML = ['Long term', 'Short term', 'Music'][currentcardset.delayindex]


        //edit ui
        if(editcardmode){
            togglecardsetintervalbutton.classList.remove('hidden')

            cardlist.classList.remove('hiddenwidth')

            editcardset.classList.add('display-none')
            doneeditcardset.classList.remove('display-none')

            screencardsettitle.classList.add('titleinputedit')
            screencardsettitle.disabled = false

            screencardfronttext.classList.add('textareainputedit')
            screencardfronttext.disabled = false

            screencardbacktext.classList.add('textareainputedit')
            screencardbacktext.disabled = false
            
            clickbackhomebutton.classList.add('display-none')

            editcardactions.classList.remove('hidden')

            deletecardsetbutton.classList.remove('hidden')
        }

        if(currentcardset.mixset){
            editcardset.classList.add('display-none')
            doneeditcardset.classList.add('display-none')
        }


        let cardgroupdone = getelement('cardgroupdone')
        cardgroupdone.classList.add('hidden')
        if(finishedreview){
            cardgroupdone.classList.remove('hidden')
        }

        //actions
        let previouscardbutton = getelement('previouscardbutton')
        let nextcardbutton = getelement('nextcardbutton')
        previouscardbutton.classList.add('disabled')
        nextcardbutton.classList.add('disabled')
        
        if(currentcardindex > 0){
            previouscardbutton.classList.remove('disabled')
        }
        if(currentcardindex < currentcardset.cards.length - 1){
            nextcardbutton.classList.remove('disabled')
        }

        let displaytxt;
        if(editcardmode){
            displaytxt = `Card ${currentcardindex + 1} of ${currentcardset.cards.length}`
        }else{
            displaytxt = `Card ${displaycardindexes.indexOf(currentcardindex) + 1} of ${displaycardindexes.length}`
        }
        let cardindexdisplay = getelement('cardindexdisplay')
        cardindexdisplay.innerHTML = displaytxt

        let cardindexdisplay2 = getelement('cardindexdisplay2')
        cardindexdisplay2.innerHTML = displaytxt

        //card blur
        let cardgroupblur = getelement('cardgroupblur')
        cardgroupblur.innerHTML = getcardgroupblurHTML()
        if(currentcardset.getStatus() == 1){
            cardgroupblur.classList.add('pointer')
        }else if(currentcardset.getStatus() == 0){
            cardgroupblur.classList.remove('pointer')
        }

        cardgroupblur.classList.remove('hidden')

        if(hidecardgroupblur || editcardmode || currentcardset.getStatus() == 2){
            cardgroupblur.classList.add('hidden')
        }

        screenview1.classList.remove('hidden')

        adjustcardtitleinput()

        //card list
        let cardlistoutput = []
        for(let item of currentcardset.cards){
            cardlistoutput.push(`<div onmousedown="dragcard(event, '${item.id}')" data-id="${item.id}" class="${item.id == currentcardset.cards[currentcardindex].id && !dragdivid2 ? 'selectedcardlistitem' : ''} ${item.id == dragdivid2 ? 'cardblank' : ''} cardlistitem" onclick="clickcardlistitem('${item.id}')">${item.id == dragdivid2 ? '' : `${item.fronttext || '<span class="text-tertiary">Enter a prompt...</span>'}`}</div>`)
        }
        cardlist.innerHTML = cardlistoutput.join('')
        
        const cardheight = 120
        if(!dragdivid2){
            cardlist.scrollTo(0, currentcardindex / currentcardset.cards.length * cardlist.scrollHeight - cardlist.offsetHeight/2 + cardheight/2)
        }

        MathJax.typeset()
    }
}

function clickfronttext(){
    if(editcardmode || (currentcardset.cards[currentcardindex].fronttext && currentcardset.cards[currentcardindex].backtext)) return

    editcardmode = true
    finishedreview = false

    updatescreen()

    let screencardfronttext = getelement('screencardfronttext')
    screencardfronttext.focus()
}
function clickbacktext(){
    if(editcardmode || (currentcardset.cards[currentcardindex].fronttext && currentcardset.cards[currentcardindex].backtext)) return

    editcardmode = true
    finishedreview = false

    updatescreen()

    let screencardbacktext = getelement('screencardbacktext')
    screencardbacktext.focus()
}

function clickaibutton(){
    let aibutton = getelement('aibutton')
    if(aibutton.classList.contains('hiddenaibutton')){
        aibutton.classList.remove('hiddenaibutton')

        let aitextarea = getelement('aitextarea')
        aitextarea.focus()
    }
}

document.addEventListener('mousedown', aibuttonmousedown, true)
function aibuttonmousedown(event){
    let aibutton = getelement('aibutton')
    if(!aibutton.contains(event.target)){
        aibutton.classList.add('hiddenaibutton')
    }

    let recognitionbutton = getelement('recognitionbutton')
    if(!recognitionbutton.contains(event.target)){
        recognitionbutton.classList.add('temphiddenrecognitionbutton')
    }
}

async function submitaifield(event){
    event.stopPropagation()

    let aitextarea = getelement('aitextarea')
    let input = aitextarea.value.trim()
    if(!input) return

    setrecognitionstatus(false, false, true) //silent end
    cancelupload()

    aitextarea.value = ''
    let aibutton = getelement('aibutton')
    aibutton.classList.add('hiddenaibutton')

    try{

        const response = await fetch('/generateaicards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: input,
                existingcards: currentcardset.cards
            })
        })

        if(response.status == 200){
            const data = await response.json()
            const cards = data?.content?.cards
            const title = data?.content?.title


            if(Array.isArray(cards)){
                let len = currentcardset.cards.filter(d => d.fronttext || d.backtext).length

                for(let temp of cards){
                    if(!currentcardset.cards[currentcardindex].fronttext && !currentcardset.cards[currentcardindex].backtext){
                        currentcardset.cards[currentcardindex].fronttext = (temp.card_prompt)
                        currentcardset.cards[currentcardindex].backtext = (temp.card_answer)
                    }else{
                        currentcardset.addCard(new Card(temp.card_prompt, temp.card_answer))
                    }
                }
                if(cards.length > 0){
                    if(!currentcardset.title){
                        currentcardset.title = title
                    }

                    if(editcardmode){
                        currentcardindex = len

                        updatescreen()
                    }else{
                        finishedreview = false
                        showanswer = false
                        hidecardgroupblur = true

                        clickcardblur()
                    }
                }
            }

            updatescreen()

            console.log(data)
        }else{
            console.log(response)
        }

    }catch(err){
        console.log(err)
    }	
}


function clickmaintitle(){
    let sets = userdata.getReviewSets()
    if(sets.length > 0){
        if(sets.length == 1){
            opencardset(sets[0].id)
        }else{
            let mixset = new CardSet('Mixed Review', sets.map(d => d.getReviewCards()).flat())
            mixset.mixset = true
            
            opencardset('mix', mixset)
        }
    }
}

function clickcardlistitem(id){
    let item = currentcardset.getCard(id)
    if(!item) return

    currentcardindex = currentcardset.cards.findIndex(d => d.id == id)
    updatescreen()
}

function getcardgroupblurHTML(){
    return `<div class="pointer-none text-primary text-18px">${currentcardset.getStatusText()}</div>
    <div class="pointer-none text-secondary text-13px">${currentcardset.getStatus() == 1 ? `${displaynumber(currentcardset.getReviewCards().length, 'question')} • ${currentcardset.getReviewTime()} min` : `Check back later`}</div>`
}

function clickscreen(index){
    screenview = index

    if(index == 0){
        currentcardset;
        currentcardindex;
        displaycardindexes = []
        editcardmode = false
        showanswer = false
        hidecardgroupblur = false
        finishedreview = false
    }
    
    updatescreen()
}

function clickbackhome(){
    if(!editcardmode){
        setrecognitionstatus(false, false, true) //quiet end
        cancelupload()

        clickscreen(0)
    }
}

function clickeditcardset(){
    editcardmode = true
    finishedreview = false

    updatescreen()

    if(!currentcardset.cards[currentcardindex].fronttext){
        let screencardfronttext = getelement('screencardfronttext')
        screencardfronttext.focus()
    }else if(!currentcardset.cards[currentcardindex].backtext){
        let screencardbacktext = getelement('screencardbacktext')
        screencardbacktext.focus()
    }
}

function clickdoneeditcardset(){
    editcardmode = false
    showanswer = false
    hidecardgroupblur = false

    updatescreen()
}


function opencardset(input, set){
    if(input == 'mix'){
        currentcardset = set

        currentcardindex = 0

        showanswer = false
        hidecardgroupblur = false

        clickscreen(1)
    }else if(userdata.getCardSet(input)){
        currentcardset = userdata.getCardSet(input)

        currentcardindex = 0
        
        if(currentcardset.cards.filter(d => d.fronttext && d.backtext).length == 0){
            //editcardmode = true
        }
        if(currentcardset.cards.length == 0){
            currentcardset.addCard(new Card())
        }

        showanswer = false
        hidecardgroupblur = false

        clickscreen(1)
    }
}

//drag cardset
let dragdiv;
let originaldragdiv;
var dragdivid;
let offsetX, offsetY;
let initialX, initialY;
let hascloned = false;
function dragcardset(e, id){
    if(!userdata.getCardSet(id)) return

    originaldragdiv = e.target
    dragdivid = id

    hascloned = false

    initialX = e.clientX || e.touches[0].clientX
    initialY = e.clientY || e.touches[0].clientY

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onMouseUp)
}
const dragdelta = 10

function onMouseMove(e) {
    const x = e.clientX
    const y = e.clientY

    if((Math.abs(x - initialX) > dragdelta || Math.abs(y - initialY) > dragdelta) || hascloned){
        if(!hascloned){
            //clone
            offsetX = (e.clientX || e.touches[0].clientX) - originaldragdiv.getBoundingClientRect().left
            offsetY = (e.clientY || e.touches[0].clientY) - originaldragdiv.getBoundingClientRect().top

            hascloned = true

            dragdiv = originaldragdiv.cloneNode(true)
            dragdiv.style.position = 'absolute'
            dragdiv.style.width = `${originaldragdiv.offsetWidth}px`
            dragdiv.style.height = `${originaldragdiv.offsetHeight}px`

            dragdiv.style.zIndex = 100
            const rect = originaldragdiv.getBoundingClientRect()
            dragdiv.style.transition = 'none'
            dragdiv.style.transform = `translate(${rect.left + window.scrollX}px, ${rect.top + window.scrollY}px)`

            document.body.appendChild(dragdiv)

            updatescreen()
        }

        dragdiv.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`

        processcardsetdrag()
    }
}
function onTouchMove(e) {
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    if((Math.abs(x - initialX) > dragdelta || Math.abs(y - initialY) > dragdelta) || hascloned){
        if(!hascloned){
            //clone
            offsetX = (e.clientX || e.touches[0].clientX) - originaldragdiv.getBoundingClientRect().left
            offsetY = (e.clientY || e.touches[0].clientY) - originaldragdiv.getBoundingClientRect().top

            hascloned = true

            dragdiv = originaldragdiv.cloneNode(true)
            dragdiv.style.position = 'absolute'
            dragdiv.style.width = `${originaldragdiv.offsetWidth}px`
            dragdiv.style.height = `${originaldragdiv.offsetHeight}px`

            dragdiv.style.zIndex = 100
            const rect = originaldragdiv.getBoundingClientRect()
            dragdiv.style.transition = 'none'
            dragdiv.style.transform = `translate(${rect.left + window.scrollX}px, ${rect.top + window.scrollY}px)`

            document.body.appendChild(dragdiv)

            updatescreen()
        }


        dragdiv.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`
    
        processcardsetdrag()
    }
}
function onMouseUp(e) {
    dragdivid = null

    if(hascloned){
        e.stopPropagation()

        dragdiv.remove()

        updatescreen()
    }

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onMouseUp)
}
function processcardsetdrag(){
    let allcards = Array.from(getelement('cardsetlist').children)

    function getOverlappingCard() {
        const dragRect = dragdiv.getBoundingClientRect()
        const dragCenterX = dragRect.left + dragRect.width / 2
        const dragCenterY = dragRect.top + dragRect.height / 2

        for (const card of allcards) {
            if (card === dragdiv) continue

            const rect = card.getBoundingClientRect()

            if (
                dragCenterX > rect.left &&
                dragCenterX < rect.right &&
                dragCenterY > rect.top &&
                dragCenterY < rect.bottom
            ) {
                return card.dataset?.id
            }
        }

        return null
    }
    
    let overlappingid = getOverlappingCard()

    if (overlappingid && overlappingid !== dragdivid) {
        const dragdivindex = userdata.cardsets.findIndex(d => d.id === dragdivid)
        const overlappingindex = userdata.cardsets.findIndex(d => d.id === overlappingid)
    
        const [item] = userdata.cardsets.splice(dragdivindex, 1)
    
        userdata.cardsets.splice(overlappingindex, 0, item)
    
        updatescreen()
    }
}


//drag card
let dragdiv2;
let originaldragdiv2;
var dragdivid2;
let offsetX2, offsetY2;
let initialX2, initialY2;
let hascloned2 = false;
function dragcard(e, id){
    let item = currentcardset.getCard(id)
    if(!item) return

    dragdivid2 = id
    originaldragdiv2 = e.target
    hascloned2 = false

    initialX2 = e.clientX || e.touches[0].clientX
    initialY2 = e.clientY || e.touches[0].clientY

    document.addEventListener('mousemove', onMouseMove2)
    document.addEventListener('mouseup', onMouseUp2)
    document.addEventListener('touchmove', onTouchMove2)
    document.addEventListener('touchend', onMouseUp2)
}
const scrollthreshold = 200
const scrollspeed = 2.5
const scrollintervaldelay = 5;
let scrollinterval;
let mouseY;

function scrollcardlistinterval(){
    let cardlist = getelement('cardlist')

    if(mouseY > cardlist.getBoundingClientRect().bottom - scrollthreshold){
        let modscrollspeed = Math.abs(mouseY - (cardlist.getBoundingClientRect().bottom - scrollthreshold))/scrollthreshold*scrollspeed
        cardlist.scrollTo(0, cardlist.scrollTop + modscrollspeed)
    }else if(mouseY < cardlist.getBoundingClientRect().top + scrollthreshold){
        let modscrollspeed = Math.abs(mouseY - (cardlist.getBoundingClientRect().top + scrollthreshold))/scrollthreshold*scrollspeed
        cardlist.scrollTo(0, cardlist.scrollTop - modscrollspeed)
    }
}

function onMouseMove2(e) {
    const x = e.clientX
    const y = e.clientY

    mouseY = y

    if((Math.abs(y - initialY2) > dragdelta || Math.abs(x - initialX2) > dragdelta) || hascloned2){
        if(!hascloned2){
            //clone
            offsetX2 = (e.clientX || e.touches[0].clientX) - originaldragdiv2.getBoundingClientRect().left
            offsetY2 = (e.clientY || e.touches[0].clientY) - originaldragdiv2.getBoundingClientRect().top

            hascloned2 = true

            dragdiv2 = originaldragdiv2.cloneNode(true)
            dragdiv2.style.position = 'absolute'
            dragdiv2.style.width = `${originaldragdiv2.offsetWidth}px`
            dragdiv2.style.height = `${originaldragdiv2.offsetHeight}px`

            dragdiv2.style.zIndex = 100
            const rect = originaldragdiv2.getBoundingClientRect()
            dragdiv2.style.transition = 'none'
            dragdiv2.style.transform = `translate(${rect.left + window.scrollX}px, ${rect.top + window.scrollY}px)`
            dragdiv2.classList.add('selectedcardlistitem')

            document.body.appendChild(dragdiv2)

            updatescreen()

            //scroll
            let cardlist = getelement('cardlist')
            cardlist.classList.remove('smoothscroll')
            
            clearInterval(scrollinterval)
            scrollinterval = setInterval(scrollcardlistinterval, scrollintervaldelay)
        }

        dragdiv2.style.transform = `translate(${x - offsetX2}px, ${y - offsetY2}px)`

        processcarddrag()
    }
}
function onTouchMove2(e) {
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    mouseY = y

    if((Math.abs(y - initialY2) > dragdelta || Math.abs(x - initialX2) > dragdelta) || hascloned2){
        if(!hascloned2){
            //clone
            offsetX2 = (e.clientX || e.touches[0].clientX) - originaldragdiv2.getBoundingClientRect().left
            offsetY2 = (e.clientY || e.touches[0].clientY) - originaldragdiv2.getBoundingClientRect().top

            hascloned2 = true

            dragdiv2 = originaldragdiv2.cloneNode(true)
            dragdiv2.style.position = 'absolute'
            dragdiv2.style.width = `${originaldragdiv2.offsetWidth}px`
            dragdiv2.style.height = `${originaldragdiv2.offsetHeight}px`

            dragdiv2.style.zIndex = 100
            const rect = originaldragdiv2.getBoundingClientRect()
            dragdiv2.style.transition = 'none'
            dragdiv2.style.transform = `translate(${rect.left + window.scrollX}px, ${rect.top + window.scrollY}px)`
            dragdiv2.classList.add('selectedcardlistitem')

            document.body.appendChild(dragdiv2)

            updatescreen()

            //scroll
            let cardlist = getelement('cardlist')
            cardlist.classList.remove('smoothscroll')

            clearInterval(scrollinterval)
            scrollinterval = setInterval(scrollcardlistinterval, scrollintervaldelay)
        }


        dragdiv2.style.transform = `translate(${x - offsetX2}px, ${y - offsetY2}px)`
    
        processcarddrag()
    }
}

function onMouseUp2(e) {
    dragdivid2 = null

    if(hascloned2){
        e.stopPropagation()

        clearInterval(scrollinterval)
        let cardlist = getelement('cardlist')
        cardlist.classList.add('smoothscroll')

        dragdiv2.remove()

        updatescreen()
    }

    document.removeEventListener('mousemove', onMouseMove2)
    document.removeEventListener('mouseup', onMouseUp2)
    document.removeEventListener('touchmove', onTouchMove2)
    document.removeEventListener('touchend', onMouseUp2)
}
function processcarddrag(){
    let allcards = Array.from(getelement('cardlist').children)

    function getOverlappingCard() {
        const dragRect = dragdiv2.getBoundingClientRect()
        const dragCenterY = dragRect.top + dragRect.height / 2

        for (const card of allcards) {
            if (card === dragdiv2) continue

            const rect = card.getBoundingClientRect()

            if (
                dragCenterY > rect.top &&
                dragCenterY < rect.bottom
            ) {
                return card.dataset?.id
            }
        }

        return null
    }
    
    let overlappingid = getOverlappingCard()

    if (overlappingid && overlappingid !== dragdivid2) {
        const dragdivindex = currentcardset.cards.findIndex(d => d.id === dragdivid2)
        const overlappingindex = currentcardset.cards.findIndex(d => d.id === overlappingid)
    
        const [item] = currentcardset.cards.splice(dragdivindex, 1)
    
        currentcardset.cards.splice(overlappingindex, 0, item)
    
        currentcardindex = overlappingindex
        
        updatescreen()
    }
}



//new cardset
function createnewcardset(){
    let newcardset = new CardSet()
    currentcardset = newcardset

    currentcardset.addCard(new Card())
    
    userdata.addCardSet(newcardset)

    //editcardmode = true
    showanswer = false
    hidecardgroupblur = false

    currentcardindex = 0
    
    clickscreen(1)    
}


function submitscreencardtitle(){
    currentcardset.title = getelement('screencardsettitle').value
    updatescreen()
}

function submitscreencardfronttext(){
    currentcardset.cards[currentcardindex].fronttext = getelement('screencardfronttext').value.trim()
    if(!dragdivid2){
        updatescreen()
    }
}

function submitscreencardbacktext(){
    currentcardset.cards[currentcardindex].backtext = getelement('screencardbacktext').value.trim()
    if(!dragdivid2){
        updatescreen()
    }
}


function adjustcardtitleinput(){
    let screencardsettitle = getelement('screencardsettitle')

    let hiddenwidthhelper = getelement('hiddenwidthhelper')

    const inputStyle = getComputedStyle(screencardsettitle)
    const paddingLeft = parseFloat(inputStyle.paddingLeft)
    const paddingRight = parseFloat(inputStyle.paddingRight)
    const totalPadding = paddingLeft + paddingRight

    hiddenwidthhelper.textContent = screencardsettitle.value || screencardsettitle.placeholder
    screencardsettitle.style.width = (hiddenwidthhelper.offsetWidth + totalPadding) + 'px'
}

function clicktoreveal(){
    if(!showanswer){
        showanswer = true
        updatescreen()
    }
}


async function previouscard(newindex){
    if(newindex >= 0){
        if(isanimating) return
        isanimating = true

        //transition
        let cardgroupdiv = getelement('cardgroupdiv')

        const backchild = cardgroupdiv.children[0]
        const middlechild = cardgroupdiv.children[1]
        const frontchild = cardgroupdiv.children[2]
        
        backchild.classList.add('shiftcard')
        
        frontchild.classList.remove('frontcard')
        frontchild.classList.add('middlecard')

        middlechild.classList.remove('middlecard')
        middlechild.classList.add('backcard')

        backchild.classList.remove('backcard')
        backchild.classList.add('frontcard')

        await sleep(150)

        frontchild.insertAdjacentElement('afterend', backchild)

        backchild.innerHTML = frontchild.innerHTML
        frontchild.innerHTML = ''


        currentcardindex = newindex
        updatescreen()

        backchild.classList.remove('shiftcard')

        isanimating = false


        if(!currentcardset.cards[currentcardindex].fronttext){
            let screencardfronttext = getelement('screencardfronttext')
            screencardfronttext.focus()
        }else if(!currentcardset.cards[currentcardindex].backtext){
            let screencardbacktext = getelement('screencardbacktext')
            screencardbacktext.focus()
        }
    }
}

let isanimating;
async function nextcard(newindex){
    if(newindex < currentcardset.cards.length){
        if(isanimating) return
        isanimating = true

        //transition
        let cardgroupdiv = getelement('cardgroupdiv')

        const backchild = cardgroupdiv.children[0]
        const middlechild = cardgroupdiv.children[1]
        const frontchild = cardgroupdiv.children[2]
        
        frontchild.classList.add('shiftcard')

        await sleep(150)

        middlechild.classList.remove('middlecard')
        middlechild.classList.add('frontcard')

        backchild.classList.remove('backcard')
        backchild.classList.add('middlecard')

        frontchild.classList.remove('frontcard')
        frontchild.classList.add('backcard')

        cardgroupdiv.insertBefore(frontchild, backchild)

        middlechild.innerHTML = frontchild.innerHTML
        frontchild.innerHTML = ''

        currentcardindex = newindex
        updatescreen()
        
        frontchild.classList.remove('shiftcard')

        isanimating = false


        if(!currentcardset.cards[currentcardindex].fronttext){
            let screencardfronttext = getelement('screencardfronttext')
            screencardfronttext.focus()
        }else if(!currentcardset.cards[currentcardindex].backtext){
            let screencardbacktext = getelement('screencardbacktext')
            screencardbacktext.focus()
        }
    }
}

function newcard(){
    currentcardset.addCard(new Card())
    editcardmode = true
    nextcard(currentcardset.cards.length - 1)
}

function deletecard(){
    currentcardset.deleteCard(currentcardset.cards[currentcardindex].id)
    if(currentcardset.cards.length == 0){
        newcard()
    }else{
        if(currentcardindex == currentcardset.cards.length){
            previouscard(currentcardset.cards.length - 1)
        }else{
            previouscard(currentcardindex)
        }
    }
}

function deletecardset(){
    userdata.deleteCardSet(currentcardset.id)
   
    setrecognitionstatus(false, false, true) //quiet end
    cancelupload()

    clickscreen(0)
}

function clickcardblur(){
    if(currentcardset.getStatus() == 1){
        displaycardindexes = currentcardset.getReviewCards().sort((a, b) => b.laststudiedindex - a.laststudiedindex).map(d => currentcardset.cards.findIndex(f => f.id == d.id))

        currentcardindex = displaycardindexes[0]

        hidecardgroupblur = true
        updatescreen()
    }
}

function togglecardsetinterval(){
    currentcardset.delayindex = (currentcardset.delayindex + 1) % 3
    updatescreen()
}


//remember
function clickremembered(){
    currentcardset.cards[currentcardindex].laststudied = Date.now()
    if(currentcardset.cards[currentcardindex].laststudiedindex < DELAYS[currentcardset.delayindex].length - 1){
        currentcardset.cards[currentcardindex].laststudiedindex++
    }

    processnextcard()
}

function clickdidntremember(){
    currentcardset.cards[currentcardindex].laststudied = Date.now()
    if(currentcardset.cards[currentcardindex].laststudiedindex > 0){
        currentcardset.cards[currentcardindex].laststudiedindex = 0 //reset
    }

    processnextcard()
}

function clickskip(){
    processnextcard()
}

function processnextcard(){
    if(displaycardindexes.findIndex(d => d == currentcardindex) < displaycardindexes.length - 1){
        nextcard(displaycardindexes[displaycardindexes.findIndex(d => d == currentcardindex) + 1])

        showanswer = false
    }else{
        finishedreview = true

        updatescreen()
    }
}

function clickcardgroupdone(){
    finishedreview = false

    currentcardset = null
    
    clickscreen(0)
}


//upload
function clickupload(){
    getelement('fileinput').click()
}

function cancelupload(event){
    if(event) event.stopPropagation()
    getelement('fileinput').value = ''
    myuploads = []
    updatefileuploader()   
}

function removefileitem(event, id){
    event.stopPropagation()

    myuploads = myuploads.filter(d => d.id != id)
    updatefileuploader()
}

async function submitfileuploader(){
    let temp = Array.from(getelement('fileinput').files).filter(d => !myuploads.find(e => e.name == d.name))
    for(let item of temp){
        if(item.type.startsWith('image/')){
            let data = await getBase64fromimage(item)
            myuploads.push({ type: 'image', data: data, id: generateID() })
        }else if(item.type.startsWith('text/')){
            let data = await readFileAsText(item)
            myuploads.push({ type: 'text', data: data, id: generateID() })
        }
    }

    updatefileuploader()
}

let myuploads = []
async function updatefileuploader(){
    let uploadbutton = getelement('uploadbutton')

    if(myuploads.length == 0){
        uploadbutton.classList.add('hiddenuploadbutton')
    }else{
        uploadbutton.classList.remove('hiddenuploadbutton')
    }

    let tempoutput = []
    for(let item of myuploads){
        if(item.type == 'image'){
            tempoutput.push(`<img src="${item.data}" class="fileimg" onclick="removefileitem(event, '${item.id}')"></img>`)
        }else if(item.type == 'text'){
            tempoutput.push(`<div class="fileimg fileimgbg text-10px" onclick="removefileitem(event, '${item.id}')">${item.data}</div>`)
        }
    }

    let uploadbuttontext = getelement('uploadbuttontext')
    uploadbuttontext.innerHTML = tempoutput.join('')
    uploadbuttontext.scrollTo(0, uploadbuttontext.scrollHeight)
}

async function getBase64fromimage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
        reader.readAsDataURL(file)
    })
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
  
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
  
      reader.readAsText(file)
    })
}

async function submituploadfile(event){
    event.stopPropagation()
    
    let fileoutput = [...myuploads]

    cancelupload()

    try{
        const response = await fetch('/generateaicards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: '',
                files: fileoutput,
                existingcards: currentcardset.cards
            })
        })

        if(response.status == 200){
            const data = await response.json()
            const cards = data?.content?.cards
            const title = data?.content?.title

            if(Array.isArray(cards)){
                let len = currentcardset.cards.filter(d => d.fronttext || d.backtext).length

                for(let temp of cards){
                    if(!currentcardset.cards[currentcardindex].fronttext && !currentcardset.cards[currentcardindex].backtext){
                        currentcardset.cards[currentcardindex].fronttext = (temp.card_prompt)
                        currentcardset.cards[currentcardindex].backtext = (temp.card_answer)
                    }else{
                        currentcardset.addCard(new Card(temp.card_prompt, temp.card_answer))
                    }
                }
                if(cards.length > 0){
                    if(!currentcardset.title){
                        currentcardset.title = title
                    }
                    
                    if(editcardmode){
                        currentcardindex = len

                        updatescreen()

                    }else{
                        finishedreview = false
                        showanswer = false
                        hidecardgroupblur = true

                        clickcardblur()
                    }
                    
                }
            }

            console.log(data)
        }else{
            console.log(response)
        }

    }catch(err){
        console.log(err)
    }	

}


//recognition

function clickrecognition(){    
    if(isrecognizing){
    }else{
        setrecognitionstatus(true, true, false)
    }

    let recognitionbutton = getelement('recognitionbutton')
    recognitionbutton.classList.remove('temphiddenrecognitionbutton')
}

async function playsound(name){
	let sounddiv = getelement('soundeffectaudio')
	sounddiv.src = `../sounds/${name}.mp3`
	
	try{
		await sounddiv.play()
	}catch(e){}
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
recognition.continuous = true
recognition.interimResults = true
recognition.lang = 'en-US'

let finalTranscript = ''
let totalTranscript = ''

let isrecognizing;
let recognitionerror;


recognition.addEventListener('result', event => {
    let interimTranscript = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
            finalTranscript += transcriptPart.trim() + ' '
        } else {
            interimTranscript += transcriptPart
        }
    }

    totalTranscript = (finalTranscript.trim() + ' ' + interimTranscript.trim()).trim()

    updaterecognitionui(true)
})

recognition.addEventListener('start', () => {
    isrecognizing = true

    recognitionerror = null

    updaterecognitionui()

    console.log("Recognition started")
})

recognition.addEventListener('error', (event) => {
    isrecognizing = false

    recognitionerror = ['service-not-allowed', 'not-allowed'].includes(event.error)

    updaterecognitionui()
    
    setrecognitionstatus(true, false, false)

    console.log("Recognition error occurred: " + event.error)
})

recognition.addEventListener('end', () => {
    isrecognizing = false

    updaterecognitionui()

    setrecognitionstatus(true, false, false)

    console.log("Recognition ended")
})

function clearrecognition(event){
    event.stopPropagation()
    setrecognitionstatus(false, true, true)
}

function submitrecognition(event){
    event.stopPropagation()
    setrecognitionstatus(false, true, true)
}

let lastdidrecognitionai;
let entiretranscript = ''
async function updaterecognitionui(processresult, tempuserwantstostop){
    let recognitiontranscriptdiv = getelement('recognitiontranscriptdiv')

    recognitiontranscriptdiv.innerHTML = `<div class="padding-top-12px"><div class="text-white text-14px">${(entiretranscript + totalTranscript) || 'Listening...'}</div><div class="padding-top-12px">`
    recognitiontranscriptdiv.scrollTo(0, recognitiontranscriptdiv.scrollHeight)


    const timedur = 60000*4
    const minlength = 50
    
    if((isrecognizing && lastdidrecognitionai && processresult && Date.now() - lastdidrecognitionai > timedur && finalTranscript?.length > minlength) || tempuserwantstostop){
        if(!finalTranscript) return

        lastdidrecognitionai = Date.now()

        try{
            const response = await fetch('/generateaicards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input: finalTranscript,
                    istranscript: true,
                    existingcards: currentcardset.cards
                })
            })
    
            if(response.status == 200){
                const data = await response.json()
                const cards = data?.content?.cards
                const title = data?.content?.title
    
                if(Array.isArray(cards)){
                    let len = currentcardset.cards.filter(d => d.fronttext || d.backtext).length

                    for(let temp of cards){
                        if(!currentcardset.cards[currentcardindex].fronttext && !currentcardset.cards[currentcardindex].backtext){
                            currentcardset.cards[currentcardindex].fronttext = (temp.card_prompt)
                            currentcardset.cards[currentcardindex].backtext = (temp.card_answer)
                        }else{
                            currentcardset.addCard(new Card(temp.card_prompt, temp.card_answer))
                        }
                    }
                    if(cards.length > 0){
                        if(!currentcardset.title){
                            currentcardset.title = title
                        }
                        
                        entiretranscript += finalTranscript
                        finalTranscript = ''

                        if(editcardmode){
                            currentcardindex = len

                            updatescreen()

                        }else{
                            finishedreview = false
                            showanswer = false
                            hidecardgroupblur = true

                            clickcardblur()
                        }
                        
                    }
                }
    
                console.log(data)
            }else{
                console.log(response)
            }
    
        }catch(err){
            console.log(err)
        }	

    }
}

let userwantstostop;
function setrecognitionstatus(status, isusertriggered, tempuserwantstostop){
    if(tempuserwantstostop) userwantstostop = true

    if(status == false && isrecognizing){
        recognition.stop()
        isrecognizing = false
        
        if(isusertriggered){
            //playsound('dictationend')
            let recognitionbutton = getelement('recognitionbutton')
            recognitionbutton.classList.add('hiddenrecognitionbutton')
        }
    }else if(status == true && !isrecognizing){
        if(isusertriggered){
            finalTranscript = ''
            totalTranscript = ''
            entiretranscript = ''
        }else{
            if(recognitionerror){
                return
            }
        }

        if(!userwantstostop){
            recognition.start()
            isrecognizing = true

            if(isusertriggered){
                lastdidrecognitionai = Date.now()
                //playsound('dictation')
                let recognitionbutton = getelement('recognitionbutton')
                recognitionbutton.classList.remove('hiddenrecognitionbutton')
            }
        }else{
            userwantstostop = false
        }
    }

    updaterecognitionui(false, isusertriggered && userwantstostop)
}



//paste to upload
document.addEventListener('keydown', async (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        if(document.activeElement && document.activeElement !== document.body) return
        try {
            const clipboardItems = await navigator.clipboard.read()

            for (const item of clipboardItems) {

                if (item.types.find(type => type.startsWith('image/'))) {
                    const blob = await item.getType(item.types.find(type => type.startsWith('image/')))
                    const data = await getBase64fromimage(blob)

                    myuploads.push({ type: 'image', data: data, id: generateID() })
                    updatefileuploader()

                } else if (item.types.includes('text/plain')) {
                    const text = await item.getType('text/plain')
                    const data = await text.text()

                    myuploads.push({ type: 'text', data: data, id: generateID() })
                    updatefileuploader()
                }
            }

        } catch (error) {
            console.log(error)
        }
    }else if(event.key == 'ArrowDown'){
        if(document.activeElement && document.activeElement !== document.body) return

        if(currentcardset && editcardmode){
            nextcard(currentcardindex + 1)
        }
    }else if(event.key == 'ArrowUp'){
        if(document.activeElement && document.activeElement !== document.body) return

        if(currentcardset && editcardmode){
            previouscard(currentcardindex - 1)
        }
    }else if(event.key == ' '){
        if(document.activeElement && document.activeElement !== document.body) return

        if(currentcardset && !editcardmode){
            if(!hidecardgroupblur){
                clickcardblur()
            }else if(finishedreview){
                clickcardgroupdone()
            }else if(!showanswer){
                clicktoreveal()
            }else{
                clickremembered()
            }
        }
    }
})



//save backup
document.addEventListener('keydown', press1, false)
function press1(event){
    if(document.activeElement && document.activeElement !== document.body) return
	if(event.key == 's'){
		document.addEventListener('keydown', press2, false)
	}
}
function press2(event){
	if(event.key == 'a'){
		document.removeEventListener('keydown', press2, false)
		document.addEventListener('keydown', press3, false)
	}else{
		document.removeEventListener('keydown', press2, false)
	}
}
function press3(event){
	if(event.key == 'v'){
		document.removeEventListener('keydown', press3, false)
		document.addEventListener('keydown', press4, false)
	}else{
		document.removeEventListener('keydown', press3, false)
	}
}
function press4(event){
	if(event.key == 'e'){
		document.removeEventListener('keydown', press4, false)

        localStorage.setItem('backup', JSON.stringify(userdata))
	}else{
		document.removeEventListener('keydown', press4, false)
	}
}




//CREDITS to:

//https://andymatuschak.org/prompts/

//https://michaelnielsen.org/

//https://andymatuschak.org/
