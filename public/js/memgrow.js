
function getelement(id){
    return document.getElementById(id)
}


function memfunction(x){
    if(x < 0) x = 0
    return (1 - Math.pow(Math.E, -0.4 * x))
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
        this.importcardsets = []
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

    getMemoryScore(){
       return this.cardsets.map(d => d.cards).flat().map(d => memfunction(d.laststudiedindex)).reduce((s,a)=>s+a,0).toFixed(0)
    }
}

class CardSet{
    constructor(title = '', cards = []){
        this.cards = cards
        this.title = title

        this.delayindex = 0
        //0 for short term
        //1 for long term
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
            
                const months = Math.floor(days / 30)
                const years = Math.floor(days / 365)
            
                if (years > 0) return [years, 'year']
                if (months > 0) return [months, 'month']
                if (days > 0) return [days, 'day']
                if (hours > 0) return [hours, 'hour']
                if (minutes > 0) return [minutes, 'minute']
                return [seconds, 'second']
            }

            let timeuntil = Math.min(...this.cards.filter(d => d.fronttext && d.backtext).map(d => d.laststudied + DELAYS[this.delayindex][Math.min(Math.max(d.laststudiedindex, 0), DELAYS[this.delayindex].length - 1)]))
            let timedata = timeUntil(timeuntil)
            return `Review in ${displaynumber(timedata[0], timedata[1])}`
        }else if(status == 1){
            return `<span class="greenreview">Ready for review</span>`
        }else if(status == 2){
            return 'Finish creating'
        }
    }

    getReviewTime(){
        return Math.ceil(this.getReviewCards().length * 10/60)
    }

    getReviewCards(){
        return this.cards.filter(d => Date.now() > d.laststudied + DELAYS[this.delayindex][Math.min(Math.max(d.laststudiedindex, 0), DELAYS[this.delayindex].length - 1)] && d.fronttext && d.backtext)
    }

    isNewlineSet(){
        return this.title.endsWith('\\n')
    }

    getMemoryScore(){
        let tempcards = this.cards.filter(d => d.fronttext && d.backtext)
        if(tempcards.length == 0) return 0
        return (tempcards.map(d => 100 * memfunction(d.laststudiedindex)).reduce((s, a) => s + a, 0)/tempcards.length).toFixed(0)
    }

    getInnerHTML(){
        if(this.id == dragdivid && hascloned){
            return ''
        }
        if(this.isNewlineSet()){
            return `${this.title.replace('\\n', '')}`
        }

        return `<div class="pointer-none text-16px text-bold">${this.title || 'New Card Set'}</div>
        <div class="pointer-none text-13px text-secondary">${displaynumber(this.cards.length, 'card')} • ${this.getStatusText()}</div>
        <div class="absolute cardsetinside top-0 right-0 margin-12px">
            <svg width="22" height="22" viewBox="0 0 22 22" class="cardsetinside circular-progress display-flex align-center justify-center right-0" style="--progress: ${this.getMemoryScore()}">
                <circle class="bg"></circle>
                <circle class="fg"></circle>
                <div class="absolute centerminitext nowrap">${this.getMemoryScore()}</div>
            </svg>
        </div>`
    }

    getHTML(){
        if(this.isNewlineSet()){
            if(this.id == dragdivid && hascloned){
                return `<div data-id="${this.id}" onmousedown="dragcardset(event, '${this.id}')" class="cardsetbreakdrag cardsetnewlineindicator" onclick="opencardset('${this.id}')">${this.getInnerHTML()}</div>`
            }else{
                return `<div data-id="${this.id}" onmousedown="dragcardset(event, '${this.id}')" class="cardsetbreak text-primary text-16px flex-column text-center justify-center" onclick="opencardset('${this.id}')">${this.getInnerHTML()}</div>`
            }
        }else{
            if(this.id == dragdivid && hascloned){
                return `<div data-id="${this.id}" class="cardset cardsetblank"></div>`
            }else{
                return `<div data-id="${this.id}" onmousedown="dragcardset(event, '${this.id}')" class="cardset gap-6px flex-column relative" onclick="opencardset('${this.id}')">${this.getInnerHTML()}</div>`
            }
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
    [3 * 3600 * 1000, 12 * 3600 * 1000, 86400 * 1000, 2 * 86400 * 1000, 5 * 86400 * 1000, 7 * 86400 * 1000, 14 * 86400 * 1000, 30 * 86400 * 1000], //short term
    [3 * 3600 * 1000, 86400 * 1000, 4 * 86400 * 1000, 10 * 86400 * 1000, 24 * 86400 * 1000, 60 * 86400 * 1000, 150 * 86400 * 1000, 360 * 86400 * 1000], //long term
]
//[3 * 3600 * 1000, 86400 * 1000, 5 * 86400 * 1000, 12 * 86400 * 1000, 30 * 86400 * 1000, 70 * 86400 * 1000, 180 * 86400 * 1000]


function restoreUserData(raw) {
    const ud = new UserData();
  
    // If there are no cardsets, bail early
    if (!Array.isArray(raw.cardsets)) return ud;
  
    raw.cardsets.forEach(rawSet => {
      // Create a real CardSet, then copy over every own‑property
      const cs = Object.assign(new CardSet(), rawSet);
  
      // Now rebuild its `cards` array with real Card instances
      cs.cards = Array.isArray(rawSet.cards)
        ? rawSet.cards.map(rawCard => Object.assign(new Card(), rawCard))
        : [];
  
      ud.cardsets.push(cs);
    });
  
    return ud;
}


let userdata = new UserData();
let oldData = ''
let oldDataObj = null;
let lastEdited = Date.now();
let signedInUser = false;

async function saveData() {
    try {
      if (!signedInUser) {
        localStorage.setItem('userdata', JSON.stringify(userdata));
        oldData    = JSON.stringify(userdata);
        oldDataObj = JSON.parse(oldData);
        return;
      }
  
      if (oldDataObj === null) {
        oldDataObj = JSON.parse(JSON.stringify(userdata));
        oldData    = JSON.stringify(userdata);
      }
  
      const newDataObj = JSON.parse(JSON.stringify(userdata));
      const patch = jsonpatch.compare(oldDataObj, newDataObj);
      if (patch.length === 0) return;
  
      needsave = true;
  
      const patchStr = JSON.stringify(patch);
      const fullStr  = JSON.stringify(newDataObj);
  
      let body;
      if (patchStr.length > fullStr.length) {
      
        body = { full: true, data: newDataObj, lastedited: (lastEdited = Date.now()) };
      } else {
       
        body = { patch, lastedited: (lastEdited = Date.now()) };
      }
  
      const response = await fetch('/saveuserdata', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
  
      if (response.ok) {
        console.log("Delta saved successfully.");
        oldDataObj = newDataObj;
        oldData    = fullStr;
        needsave   = false;
      } else {
        console.error("Error saving data:", response);
      }
  
    } catch (err) {
      console.error("Error saving data:", err);
    }
  }
  

/*
async function saveData() {
    try {
        if (signedInUser) {
            const response = await fetch('/saveuserdata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: userdata,
                    lastedited: lastEdited,
                }),
            });

            if (response.status !== 200) {
                console.error("Error saving data:", response);
            } else {
                console.log("Data saved successfully.");
            }
        } else {
            localStorage.setItem('userdata', JSON.stringify(userdata));
        }
    } catch (err) {
        console.error("Error saving data:", err);
    }
}
*/


let firstloaddata = true
async function loadData() {
    try {
      let raw; 
  
      const res = await fetch('/getuserdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (res.ok) {
        const { data } = await res.json();
        raw = data;
        if (firstloaddata) {
          signedInUser = true;
          firstloaddata = false;
        }
        lastEdited = Date.now();
      } else {
        const fromLS = localStorage.getItem('userdata');
        raw = fromLS ? JSON.parse(fromLS) : {};
      }
  
      userdata = restoreUserData(raw);
  
      oldData    = JSON.stringify(raw);
      oldDataObj = JSON.parse(oldData);
  
      console.log("Data loaded successfully.");
      updatescreen();


      importjson()
  
    } catch (err) {
      console.error("Error loading data:", err);
    }
}
  


async function syncData() {
    try {
      // fetch server timestamp
      const response = await fetch('/getuserdatalastedited', { method:'POST', headers:{ 'Content-Type':'application/json' } });
      if (response.status === 200) {
        const { lastedited: serverLastEdited } = await response.json();
        if (serverLastEdited > lastEdited) {
          await loadData();
          return;
        }
      }
  
      // now only patch if needed
      if (JSON.stringify(userdata) !== oldData) {
        await saveData();
      }
    } catch (err) {
      console.error("Error syncing data:", err);
    }
  }
  
/*
async function syncData() {
    try {
        const response = await fetch('/getuserdatalastedited', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            const { lastedited: serverLastEdited } = await response.json();

            if (serverLastEdited > lastEdited) {
                await loadData();
                return;
            }
        }

        if (JSON.stringify(userdata) !== oldData) {
            lastEdited = Date.now();
            oldData = JSON.stringify(userdata);
            await saveData();
        }
    } catch (err) {
        console.error("Error syncing data:", err);
    }
}
*/

function monitorChanges() {
    setInterval(syncData, 5000);

    let oldtitle;
    setInterval(() => {
        const reviewSets = userdata.getReviewSets ? userdata.getReviewSets().length : 0;
        const title = reviewSets > 0 ? `MemGrow (${reviewSets})` : "MemGrow";
        if (oldtitle !== title) {
            document.title = title;
            oldtitle = title
        }
    }, 5000);
}

(async function initializeApp() {
    await loadData(); 
    monitorChanges();
})();



//START

let screenview = 0

let currentcardset;
let currentcardindex;
let displaycardindexes = []
let editcardmode = false
let showanswer = false
let hidecardgroupblur = false
let finishedreview = false



//loops
let needsave = false;


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

            if(userdata.importcardsets.length > 0){
                div.classList.add('hoverblueline')
            }else{
                div.classList.remove('hoverblueline')
            }
        }
    }else if(screenview == 1){
        let cardgroupblur = getelement('cardgroupblur')
        cardgroupblur.innerHTML = getcardgroupblurHTML()
    }
}

let oldscreenview;
let oldmemoryscore;

let usegesture = false;

let lastcardsetid;
async function updatescreen(){
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

        output.push(`<div class="text-14px text-secondary align-self-flex-end statshover" onclick="showpredictreviews()">Stats</div>`)

        cardsetlist.innerHTML = output.join('')

        if(oldscreenview == 1){
            turnoffgesture()

            if(+userdata.getMemoryScore() > oldmemoryscore){
                updatepointstext(`+${(+userdata.getMemoryScore()) - oldmemoryscore} pts`, true)
                setTimeout(function(){
                    updatepointstext(+userdata.getMemoryScore())
                }, 2000)
            }else if(+userdata.getMemoryScore() < oldmemoryscore){
                updatepointstext(`-${oldmemoryscore - (+userdata.getMemoryScore())} pts`, true)
                setTimeout(function(){
                    updatepointstext(userdata.getMemoryScore())
                }, 2000)
            }else{
                updatepointstext(userdata.getMemoryScore())
            }
        }else{
            updatepointstext(userdata.getMemoryScore())
        }


        if(userdata.importcardsets.length > 0){
            getelement('maintitle').innerHTML = `Choose a card set to import into <span class="text-secondary text-14px">${displaynumber(userdata.importcardsets[0].cards?.length, 'card')}</span>`
            getelement('maintitle').classList.add('bluetext')
        }else{
            getelement('maintitle').innerHTML = `Welcome to MemGrow`
            getelement('maintitle').classList.remove('bluetext')
        }
    }else if(screenview == 1){
        if(editcardmode){
            turnoffgesture()
        }else{
            if(usegesture){
                turnongesture()
            }
        }

        if(oldscreenview == 0){
            oldmemoryscore = +userdata.getMemoryScore()
        }

        let cardlist = getelement('cardlist')
        cardlist.classList.add('hiddenwidth')
        
        let aibuttonwrap = getelement('aibuttonwrap')
        aibuttonwrap.classList.add('hiddenshiftdown')
        if(editcardmode || !currentcardset.mixset){
            aibuttonwrap.classList.remove('hiddenshiftdown')
        }

        let gesturebutton = getelement('gesturebutton')
        if(editcardmode){
            gesturebutton.classList.add('display-none')
        }else{
            gesturebutton.classList.remove('display-none')
        }

        let screencardsettitle = getelement('screencardsettitle')
        screencardsettitle.classList.remove('titleinputedit')
        screencardsettitle.value = currentcardset.title

        let screencardfronttext = getelement('screencardfronttext')
        screencardfronttext.classList.remove('textareainputedit')
        screencardfronttext.value = (currentcardset.cards[currentcardindex].fronttext || '')

        let screencardbacktext = getelement('screencardbacktext')
        screencardbacktext.classList.remove('textareainputedit')
        screencardbacktext.value = (currentcardset.cards[currentcardindex].backtext || '')

        let screencardfronttextview = getelement('screencardfronttextview')
        screencardfronttextview.classList.remove('textareainputedit')
        screencardfronttextview.innerHTML = ((currentcardset.cards[currentcardindex].fronttext) || '<span class="text-tertiary">Enter a prompt...</span>')

        let screencardbacktextview = getelement('screencardbacktextview')
        screencardbacktextview.classList.remove('textareainputedit')
        screencardbacktextview.innerHTML = ((currentcardset.cards[currentcardindex].backtext) || '<span class="text-tertiary">Enter an answer...</span>')

        function containsChinese(word) {
            const chineseRegex = /[\u4e00-\u9fff]/;
            return chineseRegex.test(word);
        }
        if(containsChinese(currentcardset.cards[currentcardindex].fronttext || '')){
            screencardfronttextview.classList.add('bigfronttext')
        }else{
            screencardfronttextview.classList.remove('bigfronttext')
        }

        if(containsChinese(currentcardset.cards[currentcardindex].backtext || '')){
            screencardbacktextview.classList.add('bigfronttext')
        }else{
            screencardbacktextview.classList.remove('bigfronttext')
        }


        //let speakcardtextbutton0 = getelement('speakcardtextbutton0')
        //let speakcardtextbutton1 = getelement('speakcardtextbutton1')

        if(editcardmode){
            //speakcardtextbutton0.classList.add('display-none')
            //speakcardtextbutton1.classList.add('display-none')

            screencardfronttext.classList.remove('display-none')
            screencardbacktext.classList.remove('display-none')

            screencardfronttextview.classList.add('display-none')
            screencardbacktextview.classList.add('display-none')
        }else{
            //speakcardtextbutton0.classList.remove('display-none')
            //speakcardtextbutton1.classList.remove('display-none')

            screencardfronttext.classList.add('display-none')
            screencardbacktext.classList.add('display-none')

            screencardfronttextview.classList.remove('display-none')
            screencardbacktextview.classList.remove('display-none')
        }

        let cardanswercover = getelement('cardanswercover')
        if(editcardmode || showanswer || !currentcardset.cards[currentcardindex].fronttext || !currentcardset.cards[currentcardindex].backtext){
            cardanswercover.classList.add('hidden')
        }else{
            cardanswercover.classList.remove('hidden')
        }

        let cardinsideprogress = getelement('cardinsideprogress')
        cardinsideprogress.innerHTML = `${currentcardset.cards[currentcardindex].laststudiedindex}`
        if(editcardmode){
            cardinsideprogress.classList.add('display-none')
        }else{
            cardinsideprogress.classList.remove('display-none')
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
        togglecardsetintervalbutton.innerHTML = ['Short term', 'Long term'][currentcardset.delayindex]


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
        }else{
            screencardsettitle.disabled = true
            screencardfronttext.disabled = true
            screencardbacktext.disabled = true
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

    oldscreenview = screenview
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

    let hintpopup = getelement('hintpopup')
    if(!hintpopup.contains(event.target)){
        hintpopup.classList.add('hidden')
    }

    let confirmdeletepopup = getelement('confirmdeletepopup')
    if(!confirmdeletepopup.contains(event.target)){
        confirmdeletepopup.classList.add('hidden')
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

                        currentcardindex = len
                        updatescreen()
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
    if(sets.length > 0){//here2
        let lastcardset = userdata.getCardSet(lastcardsetid)
        if(lastcardset){
            let nextcardsetindex = userdata.cardsets.findIndex(d => d.id == lastcardset.id) + 1
            if(nextcardsetindex >= userdata.cardsets.length){
                opencardset(sets[0].id)
            }else{
                let nextsets = userdata.cardsets.slice(nextcardsetindex).filter(d => d.getReviewCards().length != 0)
                if(nextsets.length > 0){
                    opencardset(nextsets[0].id)
                }else{
                    opencardset(sets[0].id)
                }
            }
        }else{
            opencardset(sets[0].id)
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
    <div class="pointer-none text-secondary text-13px">${currentcardset.getStatus() == 1 ? `${displaynumber(currentcardset.getReviewCards().length, 'question')} • ${currentcardset.getReviewTime()} min` : `Check back later`}</div>
    ${currentcardset.getStatus() == 1 ? `` : 
        `<div class="rememberbutton justify-center align-center flex-row gap-12px nowrap padding-8px-16px pointer border-8px-12px border-8px" onclick="clickreviewnow()">
            <div class="pointer-none text-14px text-white">Review now</div>
        </div>`
    }`
}


function clickreviewnow(){
    if(!currentcardset){
        return
    }
    currentcardset.cards.forEach(d => d.laststudied = 0)
    updatescreen()
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


function opencardset(input){
    if(userdata.getCardSet(input)){
        currentcardset = userdata.getCardSet(input)

        currentcardindex = 0
        
        if(currentcardset.cards.length == 0){
            currentcardset.addCard(new Card())
        }

        showanswer = false
        hidecardgroupblur = false

        if(userdata.importcardsets.length > 0){
            try{
                let temp = userdata.importcardsets[0].cards
                if(Array.isArray(temp)){
                    let setindex = false
                    for(let item of temp){
                        let ft = item.fronttext || item.frontText || item.front || ''
                        let bt = item.backtext || item.backText || item.back || ''
                        let id = item.id

                        if(ft || bt){
                                let foundcard;
                                if(id){
                                    foundcard = currentcardset.cards.find(r => r.id == id)
                                }

                                if(foundcard){
                                    foundcard.fronttext = ft || foundcard.fronttext
                                    foundcard.backtext = bt || foundcard.backtext

                                    if(!setindex){
                                        currentcardindex = currentcardset.cards.findIndex(r => r.id == id)
                                        setindex = true
                                    }
                                }else{
                                    if(currentcardset.cards.length == 1 && !currentcardset.cards[0].fronttext && !currentcardset.cards[0].backtext){
                                        currentcardset.cards[0].fronttext = ft
                                        currentcardset.cards[0].backtext = bt
                                        
                                        currentcardindex = 0
                                        setindex = true
                                    }else{
                                        currentcardset.cards.push(new Card(ft, bt))

                                        if(!setindex){
                                            currentcardindex = currentcardset.cards.length - 1
                                            setindex = true
                                        }
                                    }
                                }
                            }

                    }

                    userdata.importcardsets.shift()
                    return
                }
            }catch(e){}
        }

        clickscreen(1)

        lastcardsetid = currentcardset.id
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

            if(userdata.getCardSet(dragdivid)?.isNewlineSet()){
                dragdiv.style.opacity = '0'
            }

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

            if(userdata.getCardSet(dragdivid)?.isNewlineSet()){
                dragdiv.style.opacity = '0'
            }

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
    userdata.cardsets.push(newcardset)
    opencardset(newcardset.id)
}


function submitscreencardtitle(){
    currentcardset.title = getelement('screencardsettitle').value
    updatescreen()
}

function submitscreencardfronttext(){
    currentcardset.cards[currentcardindex].fronttext = getelement('screencardfronttext').value
    if(!dragdivid2){
        updatescreen()
    }
}

function submitscreencardbacktext(){
    currentcardset.cards[currentcardindex].backtext = getelement('screencardbacktext').value
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


async function previouscard(newindex, checkdisplaycard){
    if((checkdisplaycard && displaycardindexes.findIndex(d => d == newindex) != -1) || newindex >= 0){
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


        if(!currentcardset.cards[currentcardindex]?.fronttext){
            let screencardfronttext = getelement('screencardfronttext')
            screencardfronttext.focus()
        }else if(!currentcardset.cards[currentcardindex]?.backtext){
            let screencardbacktext = getelement('screencardbacktext')
            screencardbacktext.focus()
        }
    }
}

let isanimating;
async function nextcard(newindex, checkdisplaycard){
    if((checkdisplaycard && displaycardindexes.findIndex(d => d == newindex) != -1) || (newindex < currentcardset.cards.length)){
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


        if(!currentcardset.cards[currentcardindex]?.fronttext){
            let screencardfronttext = getelement('screencardfronttext')
            screencardfronttext.focus()
        }else if(!currentcardset.cards[currentcardindex]?.backtext){
            let screencardbacktext = getelement('screencardbacktext')
            screencardbacktext.focus()
        }
    }
}

function newcard(event){
    editcardmode = true
    if(event?.shiftKey){
        currentcardset.cards.splice(currentcardindex + 1, 0, new Card())
        nextcard(currentcardindex + 1)
    }else{
        currentcardset.addCard(new Card())
        nextcard(currentcardset.cards.length - 1)
    }
}

function deletecard(){
    if(!currentcardset.cards[currentcardindex]) return
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

function opendeletecardsetpopup(){
    let deletecardsetbutton = getelement('deletecardsetbutton')
    let rect = deletecardsetbutton.getBoundingClientRect()
    
    let confirmdeletepopup = getelement('confirmdeletepopup')
    confirmdeletepopup.style.top = (rect.top + rect.height) + 'px'
    confirmdeletepopup.style.left = (rect.left + rect.width/2 - confirmdeletepopup.offsetWidth/2) + 'px'
    confirmdeletepopup.classList.toggle('hidden')
}
function canceldelete(){
    let confirmdeletepopup = getelement('confirmdeletepopup')
    confirmdeletepopup.classList.add('hidden')
}

function deletecardset(){
    let confirmdeletepopup = getelement('confirmdeletepopup')
    confirmdeletepopup.classList.add('hidden')

    userdata.deleteCardSet(currentcardset.id)
   
    setrecognitionstatus(false, false, true) //quiet end
    cancelupload()

    clickscreen(0)
}

function clickcardblur(){
    if(currentcardset.getStatus() == 1){
        displaycardindexes = currentcardset.getReviewCards().sort((a, b) => (a.laststudied + DELAYS[currentcardset.delayindex][Math.min(a.laststudiedindex, DELAYS[currentcardset.delayindex].length - 1)]) - (b.laststudied + DELAYS[currentcardset.delayindex][Math.min(b.laststudiedindex, DELAYS[currentcardset.delayindex].length - 1)])).map(d => currentcardset.cards.findIndex(f => f.id == d.id)) //sort here

        currentcardindex = displaycardindexes[0]

        hidecardgroupblur = true
        updatescreen()
    }
}

function togglecardsetinterval(){
    currentcardset.delayindex = (currentcardset.delayindex + 1) % DELAYS.length
    updatescreen()
}


//remember
function clickremembered(){
    currentcardset.cards[currentcardindex].laststudied = Date.now()
    currentcardset.cards[currentcardindex].laststudiedindex++

    processnextcard()
}

function clickdidntremember(){
    currentcardset.cards[currentcardindex].laststudied = Date.now()
    if(currentcardset.cards[currentcardindex].laststudiedindex <= 0){
        currentcardset.cards[currentcardindex].laststudiedindex-- //penalty

        if(currentcardset.cards[currentcardindex].laststudiedindex < 0){ //technically can put at -1
            currentcardset.cards[currentcardindex].laststudiedindex = 0
        }
        

        //add to missed collection
        if(false && currentcardset.cards[currentcardindex].laststudiedindex < 0){
            if(!currentcardset.title?.endsWith(' – Missed')){
                const title2 = `${currentcardset.title || 'New Card Set'} – Missed`
                let temp3 = userdata.cardsets.find(d => d.title == title2)
                if(!temp3){
                    temp3 = new CardSet(title2)
                    userdata.cardsets.splice(userdata.cardsets.findIndex(d => d.id == currentcardset.id) + 1, 0, temp3)
                }

                let myfront = currentcardset.cards[currentcardindex].fronttext
                let myback = currentcardset.cards[currentcardindex].backtext
                let myid = currentcardset.cards[currentcardindex].id

                let temp4 = temp3.cards.find(d => d.id == myid)
                if(!temp4){
                    let gee = new Card(myfront, myback)
                    gee.id = myid
                    temp3.addCard(gee)
                }
            }

        }

        
    }else if(currentcardset.cards[currentcardindex].laststudiedindex > 0){
        currentcardset.cards[currentcardindex].laststudiedindex = 0 //reset
    }

    processnextcard()
}

function clickskip(){
    processnextcard()
}

function processnextcard(){
    getelement('hintpopup').classList.add('hidden')
    
    if(displaycardindexes.findIndex(d => d == currentcardindex) < displaycardindexes.length - 1){
        nextcard(displaycardindexes[displaycardindexes.findIndex(d => d == currentcardindex) + 1], true)

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

                        currentcardindex = len
                        updatescreen()
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
    setrecognitionstatus(false, false, true) //silent end
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

                        //save the transcript as a card
                        let tempcard = currentcardset.cards.find(g => g.fronttext.includes('[transcript]'))
                        if(tempcard){
                            tempcard.backtext = entiretranscript
                        }else{
                            currentcardset.cards.unshift(new Card('[transcript]', entiretranscript))
                        }

                        if(editcardmode){
                            currentcardindex = len

                            updatescreen()

                        }else{
                            finishedreview = false
                            showanswer = false
                            hidecardgroupblur = true

                            clickcardblur()

                            currentcardindex = len
                            updatescreen()
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
        
        if(isusertriggered || userwantstostop){
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
document.addEventListener('paste', async (event) => {
    if(document.activeElement && document.activeElement !== document.body) return
    if(screenview != 1) return

    event.preventDefault()

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

                //check if text is json format already
                try{
                    let temp = JSON.parse(data)
                    if(Array.isArray(temp)){
                        let setindex = false
                        for(let item of temp){
                            let ft = item.fronttext || item.frontText || item.front || ''
                            let bt = item.backtext || item.backText || item.back || ''
                            let id = item.id

                            if(ft || bt){
                                let foundcard;
                                if(id){
                                    foundcard = currentcardset.cards.find(r => r.id == id)
                                }

                                if(foundcard){
                                    foundcard.fronttext = ft || foundcard.fronttext
                                    foundcard.backtext = bt || foundcard.backtext

                                    if(!setindex){
                                        currentcardindex = currentcardset.cards.findIndex(r => r.id == id)
                                        setindex = true
                                    }
                                }else{
                                    if(currentcardset.cards.length == 1 && !currentcardset.cards[0].fronttext && !currentcardset.cards[0].backtext){
                                        currentcardset.cards[0].fronttext = ft
                                        currentcardset.cards[0].backtext = bt
                                        
                                        currentcardindex = 0
                                        setindex = true
                                    }else{
                                        currentcardset.cards.push(new Card(ft, bt))

                                        if(!setindex){
                                            currentcardindex = currentcardset.cards.length - 1
                                            setindex = true
                                        }
                                    }
                                }
                            }

                        }
                        return
                    }
                }catch(e){}

                myuploads.push({ type: 'text', data: data, id: generateID() })
                updatefileuploader()
            }
        }

    } catch (error) {
        console.log(error)
    }
})
document.addEventListener('keydown', async (event) => {
    if(document.activeElement && document.activeElement !== document.body) return

    if(event.key == 'Escape'){
        if(screenview == 1){
            clickscreen(0)
        }
        let chartpopup = getelement('chartpopup')
        if(!chartpopup.classList.contains('display-none')){
            chartpopup.classList.add('display-none')
        }
    }

    if(event.key == 'ArrowDown'){
        event.preventDefault()
        event.stopPropagation()

        if(currentcardset){
            showanswer = false
            if(editcardmode){
                nextcard(currentcardindex + 1)
            }else if(hidecardgroupblur && !finishedreview){
                if(displaycardindexes){
                    nextcard(displaycardindexes[displaycardindexes.findIndex(d => d == currentcardindex) + 1], true)
                }
            }
        }
    }
    
    if(event.key == 'ArrowUp'){
        event.preventDefault()
        event.stopPropagation()

        if(currentcardset){
            showanswer = false
            if(editcardmode){
                previouscard(currentcardindex - 1)
            }else if(hidecardgroupblur && !finishedreview){
                if(displaycardindexes){
                    previouscard(displaycardindexes[displaycardindexes.findIndex(d => d == currentcardindex) - 1], true)
                }
            }
        }
    }
    
    if(event.key == ' '){
        event.preventDefault()
        event.stopPropagation()

        if(screenview == 1 && currentcardset && !editcardmode){
            processspacekey()
        }else if(screenview == 0){
            if(userdata.getReviewSets().length > 0){
                clickmaintitle()
            }
        }
    }
    
    if(screenview == 1 && currentcardset && !editcardmode){
        if(event.key == 'e'){ //explain
            if(hidecardgroupblur && !finishedreview){
                clickhint(0)
            }
        }
        if(event.key == 'g'){ //google
            if(hidecardgroupblur && !finishedreview){
                clickhint(1)
            }
        }

        if(event.key == 'h'){ //hand gestures
            togglegesture()
        }
    
        if(event.key == 'd'){ //didnt remember
            if(hidecardgroupblur && !finishedreview){
                clickdidntremember()
            }
        }
        if(event.key == 's'){ //speak
            processSkey()
        }
    }

})


function processspacekey(){
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
function processSkey(){
    let hintpopup = getelement('hintpopup')
    if(!hintpopup.classList.contains('hidden')){
        let hinttext = getelement('hinttext')
        speaktext(hinttext.textContent)
    }else{
        speakcardtext(0)
    }
}


//save backup
let qCount = 0;

document.addEventListener('keydown', function (e) {
  if (document.activeElement !== document.body) return;

  if (e.key === 'q') {
    qCount++;
    if (qCount === 3) {
      localStorage.setItem('backup', JSON.stringify(userdata));
      alert('Backup saved to local storage.');
      qCount = 0;
    }
  } else {
    qCount = 0;
  }
}, false)


let idx = 0;
const seq = ['e', 'x', 'p'];

document.addEventListener('keydown', function (e) {
  if (document.activeElement !== document.body) return;
  
  if (e.key === seq[idx]) {
    idx++;
    if (idx === seq.length) {
      exportjson()
      idx = 0;
    }
  } else {
    idx = e.key === seq[0] ? 1 : 0;
  }
}, false);



function clickimg(url){
    if(currentcardset?.cards[currentcardindex]){
        //currentcardset.cards[currentcardindex].imgurl = url
        let hinttext = getelement('hinttext')
        hinttext.innerHTML = `<img src="${url}" onclick="clickremoveimg()" class="fade-in" style="cursor: pointer; height: auto; width: 100%"></img>`
    }
}
function clickremoveimg(){
    if(currentcardset?.cards[currentcardindex]){
        //currentcardset.cards[currentcardindex].imgurl = null
        let hintpopup = getelement('hintpopup')
        hintpopup.classList.add('hidden')
    }
}


function isMobile() {
    return window.matchMedia("(max-width: 600px)").matches;
}


let isgettinghint;
async function clickhint(hinttype){
    try {
        if(!currentcardset || !currentcardset.cards[currentcardindex]?.backtext || !currentcardset.cards[currentcardindex]?.fronttext) return

        if(true){

            if(isgettinghint) return
            isgettinghint = true

            const response = await fetch('/getcardhint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    card: currentcardset.cards[currentcardindex],
                    showanswer: showanswer,
                    hinttype: hinttype,
                    metadata: currentcardset.metadata
                })
            })

            isgettinghint = false

            if (response.status == 200) {
                const data = await response.json()
                if(data.content){
                    let hinttext = getelement('hinttext')
                    let hintpopup = getelement('hintpopup')

                    if(hinttype == 1){
                        hintpopup.classList.add('hintpopupexpanded')

                        let col1 = []
                        let col2 = []
                        let height1 = 0
                        let height2 = 0
                        for(let item of data.content){
                            if(height1 <= height2){
                                col1.push(`<img height="${item.height}" width="${item.width}" loading="lazy" decoding="async" onerror="this.remove()" src="${item.url}" onclick="clickimg('${item.url}')" style="cursor: pointer; height: auto; width: 100%; opacity: 0; transition: opacity 0.5s ease-in-out;" onload="this.style.opacity = '1';">
                                </img>`)
                                height1 += item.height || 0
                            }else{
                                col2.push(`<img height="${item.height}" width="${item.width}"  loading="lazy" decoding="async"  onerror="this.remove()" src="${item.url}" onclick="clickimg('${item.url}')" style="cursor: pointer; height: auto; width: 100%; opacity: 0; transition: opacity 0.5s ease-in-out;" onload="this.style.opacity = '1';">
                                </img>`)
                                height2 += item.height || 0
                            }
                            
                        }

                        let myhtml = `<div class="flex-row gap-12px">
                            <div class="flex-column flex-1 gap-12px">${col1.join('')}</div>
                            <div class="flex-column flex-1 gap-12px">${col2.join('')}</div>
                        </div>`
                       
                        hinttext.innerHTML = myhtml

                    }else{
                        let displaycontent = data?.content || ''
                        function containsChinese(word) {
                            const chineseRegex = /[\u4e00-\u9fff]/;
                            return chineseRegex.test(word);
                        }
                        if(containsChinese(displaycontent)){
                            const frontLines = currentcardset.cards[currentcardindex].fronttext.split('\n');
                            const firstLine = frontLines[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const lastLine = frontLines.slice(-1)[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                            const regex = new RegExp(`${firstLine}|${lastLine}`, 'gm');
                            const regex2 = new RegExp(`[\u4e00-\u9fff][\u4e00-\u9fff，。！？、：；“”‘’（）【】《》\\.,!?]*[\u4e00-\u9fff]`, 'gm')

                            displaycontent = displaycontent.replace(regex2, (match) => {
                                return `<span class="text-24px">${match}</span>`
                            }).replace(regex, (match) => {
                                return `<span class="highlighttext">${match}</span>`;
                            })
                        }
                        hinttext.innerHTML = displaycontent
                        hintpopup.classList.remove('hintpopupexpanded')
                    }

                    let hintpopuptitle = getelement('hintpopuptitle')
                    hintpopuptitle.innerHTML = currentcardset.cards[currentcardindex].fronttext

                    MathJax.typeset()
                    
                    await sleep(10)

                    let maincardcontent = getelement('maincardcontent')

                    if(isMobile()){
                        hintpopup.style.top = (window.innerHeight - hintpopup.offsetHeight - 24) + 'px'
                        hintpopup.style.left = (window.innerWidth/2 - hintpopup.offsetWidth/2) + 'px'
                    }else{
                        let rect = maincardcontent.getBoundingClientRect()
                        hintpopup.style.top = (window.innerHeight/2 - hintpopup.offsetHeight/2) + 'px'
                        hintpopup.style.left = (rect.left + rect.width + 30) + 'px'
                    }

                    hinttext.scrollTop = 0
                    hintpopup.classList.remove('hidden')
                }
                console.log(data)
            }
        }

    } catch (err) {
        console.error("Error saving data:", err);
        isgettinghint = false
    }
}

function speakcardtext(ind){
    if(!currentcardset.cards[currentcardindex]) return
    if(ind == 0){
        speaktext(currentcardset.cards[currentcardindex].fronttext)
    }else if(ind == 1){
        speaktext(currentcardset.cards[currentcardindex].backtext)
    }
}

async function speaktext(text){
    try{
        text = text.trim()
        if(!text) return

        const response = await fetch('/speaktext', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                metadata: currentcardset.metadata
            })
        })

        if(response.status == 200){
            const data = await response.json()

            const binary = atob(data.data)
            const len = binary.length
            const bytes = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              bytes[i] = binary.charCodeAt(i)
            }
    
            const blob = new Blob([bytes], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob)

            const audio = new Audio(url)
            audio.play()
        }
    }catch(err){
        console.log(err)
    }
}


//hover
function getcardinsideprogress(card, cardset){
    if(!card) return
    if(!cardset) return
    function timeShort(ms) {
        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        let days = Math.floor(hours / 24)
        
        const months = Math.floor(days / 30)
        const years = Math.floor(days / 365)
    
        if (years > 0) return [years, 'y']
        if (months > 0) return [months, 'mo']
        if (days > 0) return [days, 'd']
        if (hours > 0) return [hours, 'h']
        if (minutes > 0) return [minutes, 'm']
        return [seconds, 's']
    }
    return timeShort(DELAYS[cardset.delayindex][didntremembervalue ? 0 : Math.min(Math.max(card.laststudiedindex + 1, 0), DELAYS[cardset.delayindex].length - 1)]).join('')
}
let didntremembervalue = 0
function enterdidntremember(){
    didntremembervalue = 1
    let cardinsideprogress = getelement('cardinsideprogress')
    //cardinsideprogress.classList.remove('hidden')
    //cardinsideprogress.innerHTML = getcardinsideprogress(currentcardset?.cards[currentcardindex], currentcardset)
}
function leavedidntremember(){
    let cardinsideprogress = getelement('cardinsideprogress')
    //cardinsideprogress.classList.add('hidden')
    //cardinsideprogress.innerHTML = getcardinsideprogress(currentcardset?.cards[currentcardindex], currentcardset)
}

function enterremembered(){
    didntremembervalue = 0
    let cardinsideprogress = getelement('cardinsideprogress')
    //cardinsideprogress.classList.remove('hidden')
    //cardinsideprogress.innerHTML = getcardinsideprogress(currentcardset?.cards[currentcardindex], currentcardset)
}
function leaveremembered(){
    let cardinsideprogress = getelement('cardinsideprogress')
    //cardinsideprogress.classList.add('hidden')
    //cardinsideprogress.innerHTML = getcardinsideprogress(currentcardset?.cards[currentcardindex], currentcardset)
}


//points indicator
async function updatepointstext(text, force){
    let pointstext = getelement('pointstext')
    pointstext.innerHTML = text
    if(force){
        pointstext.classList.add('forceunhidden')
        await sleep(4000)
        pointstext.classList.remove('forceunhidden')
    }
}



//sim

/**
 * Predict the number of reviews (per day) that will occur in the next few days.
 *
 * @param {Object}   options
 * @param {number}   [options.daysInAdvance=7]           – The number of days to simulate (starting tomorrow).
 * @param {number}   [options.successProbability=0.9]      – The chance that a review is successful.
 * @param {number}   [options.simulationRuns=100]         – How many Monte Carlo iterations to average over.
 * @param {Array}    [options.cardSets=userdata.cardsets]  – The list of card sets to simulate (default: global userdata.cardsets).
 * @returns {Object} An object mapping dates (YYYY-MM-DD) to the predicted average review count.
 */


function predictReviews({
    daysInAdvance = 30,
    successProbability = 0.9,
    simulationRuns = 100,
    cardSets = userdata.cardsets
  } = {}) {
    let now = new Date()
    let simulationStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let simulationStart = simulationStartDate.getTime()
    let simulationEnd = simulationStart + daysInAdvance * 24 * 3600 * 1000
    let aggregatedCounts = new Array(daysInAdvance).fill(0)
    let perCardsetTodayCards = new Map()
    for (let run = 0; run < simulationRuns; run++) {
      let runCounts = new Array(daysInAdvance).fill(0)
      cardSets.forEach(cardset => {
        let delaySchedule = (cardset.delayindex !== undefined && DELAYS[cardset.delayindex]) ? DELAYS[cardset.delayindex] : DELAYS[0]
        let todayCards = new Set()
        cardset.cards.forEach(card => {
          if (card.laststudied === 0) return
          let simIndex = (typeof card.laststudiedindex === "number") ? Math.min(Math.max(0, card.laststudiedindex), delaySchedule.length - 1) : 0
          let simTime = card.laststudied
          let iterations = 0
          const maxIterations = 1000
          while (iterations < maxIterations) {
            iterations++
            let delayIdx = (simIndex < delaySchedule.length) ? simIndex : (delaySchedule.length - 1)
            let delayDuration = delaySchedule[delayIdx]
            if (typeof delayDuration !== "number" || delayDuration <= 0) break
            let nextReviewTime = simTime + delayDuration
            if (nextReviewTime < simulationStart) nextReviewTime = simulationStart
            if (nextReviewTime > simulationEnd) break
            let dayOffset = Math.floor((nextReviewTime - simulationStart) / (24 * 3600 * 1000))
            runCounts[dayOffset] += 1
            if (dayOffset === 0) {
              todayCards.add(card.id || JSON.stringify(card))
            }
            if (Math.random() < successProbability) {
              simIndex++
            } else {
              simIndex = 0
            }
            simTime = nextReviewTime
          }
        })
        let label = cardset.title|| "Unnamed Set"
        if (!perCardsetTodayCards.has(label)) {
          perCardsetTodayCards.set(label, new Set())
        }
        todayCards.forEach(cardId => perCardsetTodayCards.get(label).add(cardId))
      })
      for (let i = 0; i < daysInAdvance; i++) {
        aggregatedCounts[i] += runCounts[i]
      }
    }
    let averageCounts = aggregatedCounts.map(count => count / simulationRuns);
    console.log("Unique Cards Due for Review Today (sorted):");
        [...perCardsetTodayCards.entries()].map(([label, cardIdSet]) => [label, cardIdSet.size]).sort((a, b) => b[1] - a[1]).forEach(([label, count]) => {
            if(count == 0)return
      console.log(`  ${label}: ${count} cards`)
    });
    let result = {}
    for (let i = 0; i < daysInAdvance; i++) {
      let date = new Date(simulationStart + i * 24 * 3600 * 1000)
      let dateStr = date.toISOString().split("T")[0]
      result[dateStr] = averageCounts[i]
    }
    return result
  }
  
  

let myChart;

function showpredictreviews(){
    let predictionData = Object.entries(predictReviews({ daysInAdvance: 100, successProbability: 0.9 }))

    const labels = predictionData.map(item => item[0]);
    const values = predictionData.map(item => Math.floor(item[1]));

    if(myChart) myChart.destroy()

    const ctx = document.getElementById("predictionChart").getContext("2d");

    // Create the chart:
    myChart = new Chart(ctx, {
      type: "line",  // or 'bar', 'line', 'radar', 'pie', etc.
      data: {
        labels: labels,
        datasets: [
          {
            label: "Predicted Reviews",
            data: values,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Reviews"
            }
          },
          x: {
            title: {
              display: true,
              text: "Date"
            }
          }
        }
      }
    });

    chartpopup.classList.remove('display-none')
}



function hidecanvaspopup(){
    chartpopup.classList.add('display-none')
}


//HAND & FACE GESTURE

let handlinggesture = false
let handlingsupplementarygesture = false

let currentgesture;

let notpointgesture = true
let notanysupplementarygesture = true

document.addEventListener('HandGestureReady', function() {
    if (GESTURE_METHOD !== 'hand') return;

    window.HandGesture.setGestureCallback(function(gesture) {
        currentgesture = gesture

        if(gesture.handedness == 'Left'){ //right hand, with mirrored camera
            //console.log("Gesture received in main:", gesture);

            //main actions
            if(handlinggesture) return

            if(gesture.categoryName == 'Pointing_Up'){
                //equivalent of space key

                if(!notpointgesture) return

                console.log('left hand pointing up')
    
                handlinggesture = true
    
                if(showanswer){
                    showgestureremembered()
                }
    
                setTimeout(function(){
                    handlinggesture = false
                    hidegestureremembered()

                    if(currentgesture.categoryName == 'Pointing_Up'){
                        processspacekey()
    
                        notpointgesture = false
                    }
                }, 100)
            }else if(gesture.categoryName == 'Open_Palm'){
                //equivalent of D key
                notpointgesture = true
    
                if(!showanswer) return

                console.log('left hand open palm')
    
                showgesturedidntremember()
    
                handlinggesture = true
    
                setTimeout(function(){
                    handlinggesture = false
                    hidegesturedidntremember()

                    if(currentgesture.categoryName == 'Open_Palm'){
                        if(showanswer){
                            clickdidntremember()
                        }
                    }
                }, 100)
            }else{
                notpointgesture = true
            }

        }else if(gesture.handedness == 'Right'){
            //console.log("Gesture received in main:", gesture);

            //supplementary actions, e.g. hint, speak
            if(handlingsupplementarygesture) return

            if(!hidecardgroupblur || finishedreview) return

            console.log('right hand gesture')


            if(gesture.categoryName == 'Pointing_Up'){   
                //equivalent of E key 
                if(!notanysupplementarygesture) return

                handlingsupplementarygesture = true
    
                setTimeout(function(){
                    handlingsupplementarygesture = false

                    if(currentgesture.categoryName == 'Pointing_Up'){
                        clickhint(0)
                        
                        notanysupplementarygesture = false
                    }
                }, 100)
            }else if(gesture.categoryName == 'Open_Palm'){
                //equivalent of S key

                if(!notanysupplementarygesture) return

                console.log('right hand open palm')
        
                handlingsupplementarygesture = true
    
                setTimeout(function(){
                    handlingsupplementarygesture = false

                    if(currentgesture.categoryName == 'Open_Palm'){
                        processSkey()

                        notanysupplementarygesture = false
                    }
                }, 100)
            }else{
                notanysupplementarygesture = true
            }

        }

    });
  
    window.HandGesture.setToggleStateCallback(function(isRunning, isforce) {
      const btn = getelement('gesturebutton')
      if (btn) {
        if (isRunning) {
          btn.classList.add('gesturebuttonactive')
          if(isforce){
            usegesture = true
          }
        } else {
          btn.classList.remove('gesturebuttonactive')
          if(isforce){
            usegesture = false
          }
        }
      }
    });
});



/* ------------------------------------------------------------------ *
 *  Face-Blink → single-eye gesture mapping (no hold, 0.5 s cooldown)
 * ------------------------------------------------------------------ */
document.addEventListener('FaceBlinkReady', () => {
  if (GESTURE_METHOD !== 'face') return;

  /* thresholds */
  const HIGH = 0.55, LOW = 0.30, GAP = 0.15, COOLDOWN = 500;

  /* runtime flags */
  let needQuiet = false;
  let lastAction = 0;

  const getType = cats=>{
    const s=n=>cats.find(c=>c.categoryName===n)?.score||0;
    const r = .5*s('eyeBlinkRight') + .5*s('eyeSquintRight');
    const l = .5*s('eyeBlinkLeft')  + .5*s('eyeSquintLeft');
    if(r<LOW && l<LOW)              return 'quiet';
    if(r>=HIGH && l>=HIGH)          return 'both';
    if(r>=HIGH && r-l>=GAP)         return 'right';
    if(l>=HIGH && l-r>=GAP)         return 'left';
    return 'none';
  };
  const cool = ()=> Date.now()-lastAction < COOLDOWN;

  const uiClear = ()=>{
    hidegestureremembered();
    hidegesturedidntremember();
  };

  const doRight = ()=>{
    if(handlinggesture || !notpointgesture) return;
    handlinggesture=true;
    showgestureremembered();
    processspacekey();
    notpointgesture=false;
    setTimeout(()=>{handlinggesture=false; uiClear();},200);
  };

  const doLeft = ()=>{
    if(handlinggesture || !notpointgesture) return;
    if(!showanswer) return;
    handlinggesture=true;
    showgesturedidntremember();
    clickdidntremember();
    notpointgesture=false;
    setTimeout(()=>{handlinggesture=false; uiClear();},200);
  };

  window.FaceBlink.setBlinkCallback(cats=>{
    const t = getType(cats);

    if(t==='quiet'){
      needQuiet=false;
      notpointgesture = true
      return;
    }
    if(needQuiet || cool()) return;

    if(t==='right'){ doRight();  needQuiet=true; lastAction=Date.now(); }
    if(t==='left' ){ doLeft();   needQuiet=true; lastAction=Date.now(); }
  });

  window.FaceBlink.setToggleStateCallback((on,force)=>{
    getelement('gesturebutton')?.classList.toggle('gesturebuttonactive',on);
    if(force) usegesture = on;
    needQuiet=false; notpointgesture=true;
  });
});



function showgesturedidntremember(){
    let didntrememberbutton = getelement('didntrememberbutton')
    didntrememberbutton.classList.add('rememberbuttongesturehover')
}
function showgestureremembered(){
    let rememberedbutton = getelement('rememberedbutton')
    rememberedbutton.classList.add('rememberbuttongesturehover')
}

function hidegesturedidntremember(){
    let didntrememberbutton = getelement('didntrememberbutton')
    didntrememberbutton.classList.remove('rememberbuttongesturehover')
}
function hidegestureremembered(){
    let rememberedbutton = getelement('rememberedbutton')
    rememberedbutton.classList.remove('rememberbuttongesturehover')
}

const GESTURE_METHOD = 'face' // or 'hand'

function togglegesture(){
    if(GESTURE_METHOD == 'hand'){
        window.HandGesture.toggleGestureRecognition()
    }else if(GESTURE_METHOD == 'face'){
        window.FaceBlink.toggleBlinkRecognition()
    }
}

function turnoffgesture() {
  if (GESTURE_METHOD === 'hand') {
    window.HandGesture.turnOffRecognition();
  } else if (GESTURE_METHOD === 'face') {
    window.FaceBlink.turnOffBlinkRecognition();
  }
}

function turnongesture() {
  if (GESTURE_METHOD === 'hand') {
    window.HandGesture.turnOnRecognition();
  } else if (GESTURE_METHOD === 'face') {
    window.FaceBlink.turnOnBlinkRecognition();
  }
}



//export and import

function exportjson() {
    if (!currentcardset) return;
    // Deep-clone the cardset so we don't mutate original
    const rawClone = JSON.parse(JSON.stringify(currentcardset));
    // Reset card data except fronttext/backtext/id
    rawClone.cards.forEach(card => {
        // Preserve fronttext, backtext, id
        const { fronttext, backtext } = card;
        // Reset and remove any other props
        card.laststudied = 0;
        card.laststudiedindex = 0;
        // If there are any other custom props, strip them
        Object.keys(card).forEach(key => {
            if (!['fronttext', 'backtext'].includes(key)) {
                delete card[key];
            }
        });
        // Reassign preserved
        card.fronttext = fronttext;
        card.backtext = backtext;
    });

    // Serialize and encode
    const dataStr = JSON.stringify(rawClone);
    const encoded = encodeURIComponent(dataStr);
    // Construct shareable URL without reloading
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}#${encoded}`;
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Shareable URL copied to clipboard'))
        .catch(err => console.error('Clipboard write failed:', err));
}

// Import CardSet(s) from URL fragment
function importjson() {
    const fragment = window.location.hash.slice(1);
    if (!fragment) return;
    try {
        const dataStr = decodeURIComponent(fragment);
        const raw = JSON.parse(dataStr);
        const sets = Array.isArray(raw) ? raw : [raw];
        sets.forEach(rawSet => {
            // Rebuild CardSet instance
            const cs = Object.assign(new CardSet(), rawSet);
            cs.cards = Array.isArray(rawSet.cards)
                ? rawSet.cards.map(rawCard => Object.assign(new Card(), rawCard))
                : [];
            // Add to user data
            userdata.addCardSet(cs);
        });
        // Clear hash to prevent re-import on reload
        window.history.replaceState(null, '', window.location.pathname);
        updatescreen();
    } catch (err) {
        console.error('Import failed:', err);
        alert('Failed to import JSON from URL');
    }
}


//CREDITS to:

//https://andymatuschak.org/prompts/

//https://michaelnielsen.org/

//https://andymatuschak.org/

//https://codepen.io/mediapipe-preview/pen/zYamdVd

//https://mediapipe-studio.webapps.google.com/home

//https://codepen.io/mediapipe-preview/pen/OJBVQJm
