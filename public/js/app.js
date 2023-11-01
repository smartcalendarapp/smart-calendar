//CONSTANTS
const MONTHLIST = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const SHORTMONTHLIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYLIST = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SHORTDAYLIST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SHORTESTDAYLIST = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const DEFAULTCOLORS = ['#f54842', '#faa614', '#2bc451', '#2693ff', '#916bfa']

const REMINDER_PRESETS = [0, 300000, 900000, 3600000, 3600000*6, 86400000]

const TODO_DURATION_PRESETS = [5, 10, 15, 30, 60, 120, 240, 600, 1200]

const REPEAT_OPTION_DATA = [
	{ interval: null, frequency: null, byday: [], text: 'No repeat' },
	{ interval: 1, frequency: 0, byday: [], text: 'Daily' },
	{ interval: 1, frequency: 1, byday: [], text: 'Weekly' },
	{ interval: 1, frequency: 2, byday: [], text: 'Monthly' },
	{ interval: 1, frequency: 3, byday: [], text: 'Yearly' },
	{ interval: 1, frequency: 1, byday: [1, 2, 3, 4, 5], text: 'Weekdays' },
	{ interval: 1, frequency: 1, byday: [0, 6], text: 'Weekends' },
	{ interval: 1, frequency: 1, byday: [0], text: 'Weekly' },
	{ interval: 1, frequency: 1, byday: [1], text: 'Weekly' },
	{ interval: 1, frequency: 1, byday: [2], text: 'Weekly' },
	{ interval: 1, frequency: 1, byday: [3], text: 'Weekly' },
	{ interval: 1, frequency: 1, byday: [4], text: 'Weekly' },
	{ interval: 1, frequency: 1, byday: [5], text: 'Weekly' },
	{ interval: 1, frequency: 1, byday: [6], text: 'Weekly' },
]

const DAY_TIMEWINDOW_OPTION_DATA = [
	{ byday: [], text: 'Any day' },
	{ byday: [1, 2, 3, 4, 5], text: 'Weekdays' },
	{ byday: [0, 6], text: 'Weekends' },
]

const TIME_TIMEWINDOW_OPTION_DATA = [
	{ startminute: null, endminute: null, text: 'Any time' },
	{ startminute: 420, endminute: 720, text: 'Morning' },
	{ startminute: 720, endminute: 1020, text: 'Afternoon' },
	{ startminute: 1020, endminute: 1320, text: 'Evening' },
	{ startminute: 540, endminute: 1020, text: 'Work hours' },
]

const TIMEWINDOW_PRESETS = [
	{ day: { byday: [] }, time: { startminute: null, endminute: null }, text: 'Any time' },
	{ day: { byday: [1, 2, 3, 4, 5] }, time: { startminute: 9*60, endminute: 17*60 }, text: 'Work hours', fulltext: 'Work hours (M-F 9am-5pm)' },
	{ day: { byday: [1, 2, 3, 4, 5] }, time: { startminute: 8*60, endminute: 15*60 }, text: 'School hours', fulltext: 'School hours (M-F 8am-3pm)' },
	{ day: { byday: [1, 2, 3, 4, 5] }, time: { startminute: 15*60, endminute: 22*60 }, text: 'After school', fulltext: 'After school (M-F 3pm-10pm)' },
	{ day: { byday: [1, 2, 3, 4, 5] }, time: { startminute: null, endminute: null }, text: 'Weekdays' },
	{ day: { byday: [0, 6] }, time: { startminute: null, endminute: null }, text: 'Weekends' },
	{ day: { byday: [] }, time: { startminute: 5*60, endminute: 9*60 }, text: 'Early morning', fulltext: 'Early morning (5am-9am)' },
]


//FUNCTIONS

function generateID() {
	let uuid = ''
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

	for (let i = 0; i < 32; i++) {
		const rnd = Math.floor(Math.random() * chars.length)
		uuid += chars[rnd]
	}

	return uuid
}

function formatURL(text) {
	let regex = /((?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)+[\w]{2,}(?:\/[\w-_.~%\/#?&=!$()'*+,;:@]+)?)/gi
	return text.replace(regex, function (url) {
		return `<a href="${url}" class="text-blue text-decoration-none hover:text-decoration-underline" target="_blank" rel="noopener noreferrer">${url}</a>`
	})
}

function cleanInput(text) {
	let map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function (m) {
		return map[m]
	})
}

function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj))
}

function ceil(number, increment) {
	return Math.ceil(number / increment) * increment;
}

function floor(number, increment) {
	return Math.floor(number / increment) * increment;
}

function round(number, increment) {
	return Math.round(number / increment) * increment;
}

function getHMText(input, hidetext) {
	let hours = Math.floor(input / 60)
	let minutes = input % 60
	if (calendar.settings.militarytime) {
		return `${hours % 24}:${minutes.toString().padStart(2, '0')}`
	} else {
		return `${hours % 12 || 12}${minutes ? `:${minutes.toString().padStart(2, '0')}` : ''}${hidetext == true ? '' : ` ${hours >= 12 ? 'PM' : 'AM'}`}`
	}
}

function getDHMText(input) {
	let temp = input
	let days = Math.floor(temp / 1440)
	temp -= days * 1440

	let hours = Math.floor(temp / 60)
	temp -= hours * 60

	let minutes = temp

	if (days) days += 'd'
	if (hours) hours += 'h'
	if (minutes || (hours == 0 && days == 0)) minutes += 'm'

	return [days, hours, minutes].filter(f => f).join(' ')
}

function getRelativeDHMText(input) {
	let temp = Math.abs(input)
	let days = Math.floor(temp / 1440)
	temp -= days * 1440

	let hours = Math.floor(temp / 60)
	temp -= hours * 60

	let minutes = temp

	if (days) days += 'd'
	if (hours) hours += 'h'
	if (minutes) minutes += 'm'

	if (days == 0 && hours == 0 && minutes == 0) {
		return 'now'
	}

	if (input < 0) {
		return `in ${[days, hours, minutes].filter(v => v)[0]}`
	} else {
		return `${[days, hours, minutes].filter(v => v)[0]} ago`
	}
}

function getRelativeYMWDText(input) {
    let temp = Math.abs(input)
    let days = Math.floor(temp / 1440)
    let weeks = Math.floor(days / 7)
    let months = Math.floor(days / 30.44)
    let years = Math.floor(days / 365.25)

    let output = ''

    if (years >= 1) {
        output = `${years} year${years === 1 ? '' : 's'}`
    } else if (months >= 1 && months < 12) {
        output = `${months} month${months === 1 ? '' : 's'}`
    } else if (weeks >= 1 && weeks < 4) {
        output = `${weeks} week${weeks === 1 ? '' : 's'}`
    } else if (days >= 1) {
        output = `${days} day${days === 1 ? '' : 's'}`
    } else {
        return ''
    }

    return input < 0 ? `in ${output}` : `${output} ago`
}

function getFullRelativeDHMText(input) {
	let temp = Math.abs(input)
	let days = Math.floor(temp / 1440)
	temp -= days * 1440

	let hours = Math.floor(temp / 60)
	temp -= hours * 60

	let minutes = temp

	if (days) days += 'd'
	if (hours) hours += 'h'
	if (minutes) minutes += 'm'

	if (days == 0 && hours == 0 && minutes == 0) {
		return 'now'
	}

	if (input < 0) {
		return `in ${[days, hours, minutes].filter(v => v).join(' ')}`
	} else {
		return `${[days, hours, minutes].filter(v => v).join(' ')} ago`
	}
}

function getShortDMDText(date) {
	return `${SHORTDAYLIST[date.getDay()]}, ${MONTHLIST[date.getMonth()]} ${date.getDate()}`
}

function getDMDYText(date) {
	let today = new Date()
	today.setHours(0,0,0,0)
	let tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	let yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	if (date.getMonth() == today.getMonth() && date.getDate() == today.getDate() && date.getFullYear() == today.getFullYear()) return 'Today'
	if (date.getMonth() == tomorrow.getMonth() && date.getDate() == tomorrow.getDate() && date.getFullYear() == tomorrow.getFullYear()) return 'Tomorrow'
	if (date.getMonth() == yesterday.getMonth() && date.getDate() == yesterday.getDate() && date.getFullYear() == yesterday.getFullYear()) return 'Yesterday'

	return `${SHORTDAYLIST[date.getDay()]}, ${SHORTMONTHLIST[date.getMonth()]} ${date.getDate()}${date.getFullYear() != today.getFullYear() ? `, ${date.getFullYear()}` : ''}`
}


function getOrdinal(n) {
	let ordinals = ["th", "st", "nd", "rd"]
	let lastDigit = n % 10
	let lastTwoDigits = n % 100
	if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
		return n + 'th'
	} else {
		return n + ordinals[lastDigit > 3 ? 0 : lastDigit]
	}
}


function getRepeatText(item, lowercase) {
	let repeattext = REPEAT_OPTION_DATA.find(f => f.interval == item.repeat.interval && f.frequency == item.repeat.frequency && isEqualArray(item.repeat.byday, f.byday))
	repeattext = ((repeattext && (lowercase ? repeattext.text.toLowerCase() : repeattext.text)) || `${lowercase ? 'every' : 'Every'}${item.repeat.interval == 1 ? '' : ` ${getOrdinal(item.repeat.interval)}`} ${['day', item.repeat.byday.length == 0 ? 'week' : `${item.repeat.byday.sort((a, b) => a - b).map(d => DAYLIST[d]).join(', ')}`, 'month', 'year'][item.repeat.frequency]}`) + `${item.repeat.until ? ` until ${getDMDYText(new Date(item.repeat.until))}` : ''}${item.repeat.count ? ` for ${item.repeat.count} times` : ''}`
	return repeattext
}

function isEqualArray(array1, array2) {
	let temparray1 = array1.sort()
	let temparray2 = array2.sort()
	return temparray1.length === temparray2.length && temparray1.every((value, index) => value === temparray2[index])
}

function getElement(id) {
	return document.getElementById(id)
}


//get exclamation
function getpriorityicon(value) {
	if (value == 0) {
		return ''
	} else if (value == 1) {
		return `<span class="text-white priorityiconpadding border-round background-orange text-12px">Medium</span>`
	} else if (value == 2) {
		return `<span class="text-white priorityiconpadding border-round background-red text-12px">High</span>`
	}
}

//get star
function getstar(boolean, tooltip) {
	if (boolean) {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="starbox starboxfilled">
		<g>
		<path d="M128 3.1875C124.031 3.1875 120.065 5.44038 118.531 9.96875L92.1562 87.9062L9.875 88.9062C0.313795 89.0244-3.63448 101.191 4.03125 106.906L70 156.125L45.5312 234.656C42.689 243.786 53.0391 251.306 60.8438 245.781L127.938 198.312L195.188 250.719C202.915 256.74 213.787 249.197 210.875 239.844L185.031 156.844L251.969 106.906C259.634 101.191 255.686 89.0244 246.125 88.9062L163.844 87.9062L137.469 9.96875C135.935 5.44038 131.969 3.1875 128 3.1875Z" fill-rule="nonzero" opacity="1" ></path>
		</g>
		</svg>
		${tooltip || ''}`
	} else {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="starbox">
		<g>
		<path d="M174.37 152.312L246 98.9047L246 98.9047L156.658 97.8007L156.658 97.8007L128 13.1727L128 13.1727L99.3419 97.8007L99.3419 97.8007L10 98.9047L10 98.9047L81.6302 152.312L81.6302 152.312L55.072 237.622L55.072 237.622L128 186.001L128.401 186.001L201.329 242.827L201.329 242.827L174.771 157.517" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
		</g>
		</svg>
		${tooltip || ''}`
	}
}

//get color checkbox
function getcolorcheckbox(boolean, color, tooltip) {
	if (boolean) {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;fill:${color}" viewBox="0 0 256 256" width="100%" class="checkboxbutton">
			<g>
			<path d="M50 0C22.3858 0 0 22.3858 0 50L0 206C0 233.614 22.3858 256 50 256L206 256C233.614 256 256 233.614 256 206L256 50C256 22.3858 233.614 0 206 0L50 0ZM200.688 54.125C204.511 53.7858 208.449 54.9038 211.625 57.5625C217.978 62.8798 218.817 72.3349 213.5 78.6875L114.844 196.562C108.848 203.725 97.8393 203.725 91.8438 196.562L42.5 137.625C37.1827 131.272 38.0224 121.817 44.375 116.5C50.7276 111.183 60.1827 112.022 65.5 118.375L103.344 163.562L190.5 59.4375C193.159 56.2612 196.864 54.4642 200.688 54.125Z" fill-rule="nonzero" opacity="1" stroke="none"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	} else {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxunfilled">
			<g>
			<path d="M50 10L206 10C228.091 10 246 27.9086 246 50L246 206C246 228.091 228.091 246 206 246L50 246C27.9086 246 10 228.091 10 206L10 50C10 27.9086 27.9086 10 50 10Z" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	}
}

//get checkbox
function getcheckbox(boolean, tooltip) {
	if (boolean) {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilled">
			<g>
			<path d="M50 0C22.3858 0 0 22.3858 0 50L0 206C0 233.614 22.3858 256 50 256L206 256C233.614 256 256 233.614 256 206L256 50C256 22.3858 233.614 0 206 0L50 0ZM200.688 54.125C204.511 53.7858 208.449 54.9038 211.625 57.5625C217.978 62.8798 218.817 72.3349 213.5 78.6875L114.844 196.562C108.848 203.725 97.8393 203.725 91.8438 196.562L42.5 137.625C37.1827 131.272 38.0224 121.817 44.375 116.5C50.7276 111.183 60.1827 112.022 65.5 118.375L103.344 163.562L190.5 59.4375C193.159 56.2612 196.864 54.4642 200.688 54.125Z" fill-rule="nonzero" opacity="1" stroke="none"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	} else {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxunfilled">
			<g>
			<path d="M50 10L206 10C228.091 10 246 27.9086 246 50L246 206C246 228.091 228.091 246 206 246L50 246C27.9086 246 10 228.091 10 206L10 50C10 27.9086 27.9086 10 50 10Z" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	}
}


//get big checkbox
function getbigcheckbox(boolean, tooltip) {
	if (boolean) {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninlinelarge checkboxfilled">
			<g>
			<path d="M50 0C22.3858 0 0 22.3858 0 50L0 206C0 233.614 22.3858 256 50 256L206 256C233.614 256 256 233.614 256 206L256 50C256 22.3858 233.614 0 206 0L50 0ZM200.688 54.125C204.511 53.7858 208.449 54.9038 211.625 57.5625C217.978 62.8798 218.817 72.3349 213.5 78.6875L114.844 196.562C108.848 203.725 97.8393 203.725 91.8438 196.562L42.5 137.625C37.1827 131.272 38.0224 121.817 44.375 116.5C50.7276 111.183 60.1827 112.022 65.5 118.375L103.344 163.562L190.5 59.4375C193.159 56.2612 196.864 54.4642 200.688 54.125Z" fill-rule="nonzero" opacity="1" stroke="none"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	} else {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninlinelarge checkboxunfilled">
			<g>
			<path d="M50 10L206 10C228.091 10 246 27.9086 246 50L246 206C246 228.091 228.091 246 206 246L50 246C27.9086 246 10 228.091 10 206L10 50C10 27.9086 27.9086 10 50 10Z" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"/>
			</g>
			</svg>
	 		${tooltip || ''}`
	}
}

//get check circle
function getcheckcircle(boolean, tooltip) {
	if (boolean) {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilled">
			<g>
			<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1" ></path>
			<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1" ></path>
			</g>
			</svg>
	 		${tooltip || ''}`
	} else {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxunfilled">
			<g>
			<path d="M128 10L128 10C193.17 10 246 62.8304 246 128L246 128C246 193.17 193.17 246 128 246L128 246C62.8304 246 10 193.17 10 128L10 128C10 62.8304 62.8304 10 128 10Z" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
			</g>
			</svg>
	 		${tooltip || ''}`
	}
}

//get white check circle
function getwhitecheckcircle(boolean, tooltip) {
	if (boolean) {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallinline checkboxfilledprimary">
			<g>
			<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1" ></path>
			<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1" ></path>
			</g>
			</svg>
	 		${tooltip || ''}`
	} else {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallinline checkboxunfilled">
			<g>
			<path d="M128 10L128 10C193.17 10 246 62.8304 246 128L246 128C246 193.17 193.17 246 128 246L128 246C62.8304 246 10 193.17 10 128L10 128C10 62.8304 62.8304 10 128 10Z" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
			</g>
			</svg>
	 		${tooltip || ''}`
	}
}

//get small white check circle
function getwhitecheckcirclesmall(boolean, tooltip) {
	if (boolean) {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallerinline checkboxfilledprimary">
			<g>
			<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1" ></path>
			<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1" ></path>
			</g>
			</svg>
	 		${tooltip || ''}`
	} else {
		return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallerinline checkboxunfilled">
			<g>
			<path d="M128 10L128 10C193.17 10 246 62.8304 246 128L246 128C246 193.17 193.17 246 128 246L128 246C62.8304 246 10 193.17 10 128L10 128C10 62.8304 62.8304 10 128 10Z" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
			</g>
			</svg>
	 		${tooltip || ''}`
	}
}


//get check
function getcheck(boolean) {
	if (boolean) {
		return `
		<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline">
		<g>
		<path d="M93.2369 211.648L10 120.493" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
		<path d="M93.2369 211.648L246 44.3518" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
		</g>
		</svg>`
	} else {
		return `
		<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline">
		</svg>`
	}
}

//get check small
function getchecksmall(boolean) {
	if (boolean) {
		return `
		<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallinline">
		<g>
		<path d="M93.2369 211.648L10 120.493" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
		<path d="M93.2369 211.648L246 44.3518" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
		</g>
		</svg>`
	} else {
		return `
		<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallinline">
		</svg>`
	}
}


//REGEX functions
function getDuration(string) {
	string = string.toLowerCase()
	let myduration;
	let match;

	const numwords = {
		'one': 1, 'an': 1,
		'two': 2,
		'three': 3,
		'four': 4,
		'five': 5,
		'six': 6,
		'seven': 7,
		'eight': 8,
		'nine': 9,
		'ten': 10,
		'eleven': 11,
		'twelve': 12,
		'thirteen': 13,
		'fourteen': 14,
		'fifteen': 15,
		'sixteen': 16,
		'seventeen': 17,
		'eighteen': 18,
		'nineteen': 19,
		'twenty': 20,
		'thirty': 30,
		'forty': 40,
		'fifty': 50,
		'sixty': 60,
		'seventy': 70,
		'eighty': 80,
		'ninety': 90,
		'hundred': 100, 'a hundred': 100, 'one hundred': 100
	}

	let allmatch = string.match(/\b(((\d+(\.\d+)?\s*(days|day|d))\s*(\d+(\.\d+)?\s*(hours|hour|hrs|hr|h))\s*(\d+(\.\d+)?\s*(minutes|minute|mins|min|m)))|((\d+(\.\d+)?\s*(days|day|d))\s*(\d+(\.\d+)?\s*(hours|hour|hrs|hr|h)))|((\d+(\.\d+)?\s*(days|day|d))\s*(\d+(\.\d+)?\s*(minutes|minute|mins|min|m)))|((\d+(\.\d+)?\s*(hours|hour|hrs|hr|h))\s*(\d+(\.\d+)?\s*(minutes|minute|mins|min|m)))|(\d+(\.\d+)?\s*(days|day|d))|(\d+(\.\d+)?\s*(hours|hour|hrs|hr|h))|(\d+(\.\d+)?\s*(minutes|minute|mins|min|m)))\b/)
	if (allmatch && allmatch[0]) {
		match = allmatch[0]

		let tempday = allmatch[0].match(/\d+(\.\d+)?\s*(d|day|days)/)
		if (tempday) {
			let tempday2 = tempday[0].match(/\d+(\.\d+)?/)
			myduration = (myduration || 0) + +tempday2[0] * 1440
		}

		let temphour = allmatch[0].match(/\d+(\.\d+)?\s*(h|hr|hrs|hour|hours)/)
		if (temphour) {
			let temphour2 = temphour[0].match(/\d+(\.\d+)?/)
			myduration = (myduration || 0) + +temphour2[0] * 60
		}

		let tempminute = allmatch[0].match(/\d+(\.\d+)?\s*(m|min|mins|minutes)/)
		if (tempminute) {
			let tempminute2 = tempminute[0].match(/\d+(\.\d+)?/)
			myduration = (myduration || 0) + +tempminute2[0]
		}

	}

	let allmatch2 = string.match(new RegExp(`\\b((((${Object.keys(numwords).join('|')})\\s+(days|day|d))\\s+((${Object.keys(numwords).join('|')})\\s+(hours|hour|hrs|hr|h))\\s+((${Object.keys(numwords).join('|')})\\s+(minutes|minute|mins|min|m)))|(((${Object.keys(numwords).join('|')})\\s+(days|day|d))\\s+((${Object.keys(numwords).join('|')})\\s+(hours|hour|hrs|hr|h)))|(((${Object.keys(numwords).join('|')})\\s+(days|day|d))\\s+((${Object.keys(numwords).join('|')})\\s+(minutes|minute|mins|min|m)))|(((${Object.keys(numwords).join('|')})\\s+(hours|hour|hrs|hr|h))\\s+((${Object.keys(numwords).join('|')})\\s+(minutes|minute|mins|min|m)))|((${Object.keys(numwords).join('|')})\\s+(days|day|d))|((${Object.keys(numwords).join('|')})\\s+(hours|hour|hrs|hr|h))|((${Object.keys(numwords).join('|')})\\s+(minutes|minute|mins|min|m)))\\b`))
	if (allmatch2 && allmatch2[0]) {
		match = allmatch2[0]

		let tempday = allmatch2[0].match(new RegExp(`(${Object.keys(numwords).join('|')})\\s*(d|day|days)`))
		if (tempday) {
			let tempday2 = tempday[0].match(new RegExp(`${Object.keys(numwords).join('|')}`))
			if(numwords[tempday2]){
				myduration = (myduration || 0) + (numwords[tempday2] * 1440)
			}
		}

		let temphour = allmatch2[0].match(new RegExp(`(${Object.keys(numwords).join('|')})\\s*(h|hr|hrs|hour|hours)`))
		if (temphour) {
			let temphour2 = temphour[0].match(new RegExp(`${Object.keys(numwords).join('|')}`))
			if(numwords[temphour2]){
				myduration = (myduration || 0) + (numwords[temphour2] * 60)
			}
		}

		let tempminute = allmatch2[0].match(new RegExp(`(${Object.keys(numwords).join('|')})\\s*(m|min|mins|minutes)`))
		if (tempminute) {
			let tempminute2 = tempminute[0].match(new RegExp(`${Object.keys(numwords).join('|')}`))
			if(numwords[tempminute2]){
				myduration = (myduration || 0) + (numwords[tempminute2])
			}
		}

	}

	if(myduration != null){
		myduration = Math.floor(myduration)
	}

	return { value: myduration, match: match }
}

function getMinute(string, lax, fullstring) { //lax is for when getting time from input that is solely for time, e.g. event start, where AM/PM or :MM is not mandatory
	string = string.toLowerCase()
	fullstring = fullstring && fullstring.toLowerCase()
	let myminute;
	let match;

	let currentdate = new Date()

	let firstmatchindex;
	let temptime;

	if(true){
		temptime = string.match(/\b(((0?[0-9]|1[0-2])(:[0-5][0-9])?\s*(am|pm))|((0?[0-9]|1[0-9]|2[0-4])(:[0-5][0-9])))\b/)
		if (temptime) {
			firstmatchindex = temptime.index

			match = temptime[0]

			let temptime2 = temptime[0].match(/\d+(:\d+)?/)
			let temptime3 = temptime2[0].split(':')
			let temptime4;
			if (temptime[0].match(/am|pm/)) {
				temptime4 = ((+temptime3[0] || 0) % 12 + !!temptime[0].match(/pm/) * 12) * 60 + (+temptime3[1] || 0)
			}else{
				temptime4 = (+temptime3[0] || 0) * 60 + (+temptime3[1] || 0)
			}

			myminute = temptime4
		}
	}

	if(true){
		let datematch = getDate(fullstring || string).match

		let regex = new RegExp(`\\b(((1[0-9]|2[0-4]|0?[0-9])(\\s+(at|on|by|from|to|until|through|start|starts|starting|end|ends|ending|due${datematch ? `|${datematch}` : ''})\\b|-))|((\\b(at|on|by|from|to|until|through|start|starts|starting|end|ends|ending|due${datematch ? `|${datematch}` : ''})\\s+|-)(1[0-9]|2[0-4]|0?[0-9])))\\b`)

		temptime = (fullstring || string).match(regex)
		if(temptime){
			const dateMatchIndex = datematch && temptime[0].indexOf(datematch)
			const dateMatchEnd = datematch && (dateMatchIndex + datematch.length)

			const matches = [...temptime[0].matchAll(/\d+/g)].filter(match => {
				const matchStart = match.index
				const matchEnd = match.index + match[0].length
				return !(matchStart >= dateMatchIndex && matchEnd <= dateMatchEnd)
			})

			let temptime2 = matches[0]
			if(temptime2){
				if(firstmatchindex == null || (temptime.index + temptime2.index < firstmatchindex)){
					match = temptime2[0]
		
					let temptime4;
					let temp = (+temptime2[0] || 0) * 60
					if(temp < calendar.settings.sleep.endminute){//FIX THIS HERE4
						temptime4 = temp + 12 * 60
					}else if(temp > calendar.settings.sleep.startminute){
						temptime4 = temp - 12 * 60
					}else{
						temptime4 = temp
					}
		
					myminute = temptime4
				}
			}
		}
	}

	if(myminute == null && lax){
		temptime = string.match(/\b(1[0-9]|2[0-4]|0?[0-9])\b/)
		if (temptime) {
			match = temptime[0]

			let temptime2 = temptime[0].match(/\d+/)

			let temptime4;
			let temp = (+temptime2[0] || 0) * 60
			if(temp < calendar.settings.sleep.endminute){//FIX THIS HERE4
				temptime4 = temp + 12 * 60
			}else if(temp > calendar.settings.sleep.startminute){
				temptime4 = temp - 12 * 60
			}else{
				temptime4 = temp
			}

			myminute = temptime4
		}
	}

	let tempmatch = string.match(/\bnow\b/)
	if (tempmatch) {
		match = tempmatch[0]

		myminute = currentdate.getHours() * 60 + currentdate.getMinutes()
	}

	let tempmatch2 = string.match(/\b(morning|sunrise)\b/)
	if (tempmatch2) {
		match = tempmatch2[0]

		myminute = 8 * 60
	}

	let tempmatch3 = string.match(/\b(noon|lunchtime|lunch|midday)\b/)
	if (tempmatch3) {
		match = tempmatch3[0]

		myminute = 12 * 60
	}

	let tempmatch4 = string.match(/\b(evening|sunset|sundown)\b/)
	if (tempmatch4) {
		match = tempmatch4[0]

		myminute = 18 * 60
	}

	let tempmatch5 = string.match(/\bafternoon\b/)
	if (tempmatch5) {
		match = tempmatch5[0]

		myminute = 14 * 60
	}

	let tempmatch6 = string.match(/\bmidnight\b/)
	if (tempmatch6) {
		match = tempmatch6[0]

		myminute = 24 * 60
	}

	let tempmatch7 = string.match(/\b(tonight|night|nighttime)\b/)
	if (tempmatch7) {
		match = tempmatch7[0]

		myminute = 21 * 60
	}

	return { value: myminute, match: match }
}

function getDate(string) {
	string = string.toLowerCase()
	let myyear, mymonth, myday;
	let match;

	let currentdate = new Date()

	let tempday2 = string.match(new RegExp(`\\b(((this|next|last)\\s+)?(${SHORTDAYLIST.map(d => d.toLowerCase()).join('|')}|${DAYLIST.map(d => d.toLowerCase()).join('|')}))\\b`))
	if (tempday2) {
		match = tempday2[0]

		let tempmatch = tempday2[0].match(new RegExp(`\\b((${SHORTDAYLIST.map(d => d.toLowerCase()).join('|')}|${DAYLIST.map(d => d.toLowerCase()).join('|')}))\\b`))

		let temp;
		if (SHORTDAYLIST.map(d => d.toLowerCase()).includes(tempmatch[0])) {
			temp = currentdate.getDate() + (SHORTDAYLIST.map(d => d.toLowerCase()).indexOf(tempmatch[0]) + (7 - currentdate.getDay())) % 7
		} else if (DAYLIST.map(d => d.toLowerCase()).includes(tempmatch[0])) {
			temp = currentdate.getDate() + (DAYLIST.map(d => d.toLowerCase()).indexOf(tempmatch[0]) + (7 - currentdate.getDay())) % 7
		}

		if (tempday2[0].match(/\bnext\b/)) {
			temp += 7
		}
		if (tempday2[0].match(/\blast\b/)) {
			temp -= 7
		}

		let tempdate = new Date(currentdate.getTime())
		tempdate.setDate(temp)

		myday = tempdate.getDate()
		mymonth = tempdate.getMonth()
		myyear = tempdate.getFullYear()
	}

	let tempdatestring = string.match(new RegExp(`(?<=^|\\s)((${SHORTMONTHLIST.map(d => d.toLowerCase()).join('|')}|${MONTHLIST.map(d => d.toLowerCase()).join('|')}|sept)\\s+(0?[1-9]|1[0-9]|2[0-9]|3[0-1])(st|nd|rd|th)?(,?\\s+\\d{4})?)(?:$|\\s)`))
	if (tempdatestring) {
		match = tempdatestring[0].trim()

		let tempdatelist = tempdatestring[0].trim().split(/\s+/)
		if (tempdatelist[0].toLowerCase() == 'sept') {
			tempdatelist[0] = 'sep'
		}

		let temp;
		if (SHORTMONTHLIST.map(d => d.toLowerCase()).includes(tempdatelist[0])) {
			temp = SHORTMONTHLIST.map(d => d.toLowerCase()).indexOf(tempdatelist[0])
		} else if (MONTHLIST.map(d => d.toLowerCase()).includes(tempdatelist[0])) {
			temp = MONTHLIST.map(d => d.toLowerCase()).indexOf(tempdatelist[0])
		}

		let tempdatedate = tempdatelist[1].match(/\d+/)

		mymonth = temp
		myday = +tempdatedate[0]
		myyear = +tempdatelist[2] || (new Date(currentdate.getFullYear(), mymonth).getTime() < new Date(currentdate.getFullYear(), currentdate.getMonth()) ? currentdate.getFullYear() + 1 : currentdate.getFullYear())
	}

	let tempdatestring2 = string.match(new RegExp(`(?<=^|\\s)((0?[1-9]|1[0-9]|2[0-9]|3[0-1])(st|nd|rd|th)?\\s+(${SHORTMONTHLIST.map(d => d.toLowerCase()).join('|')}|${MONTHLIST.map(d => d.toLowerCase()).join('|')})(\\s+\\d{4})?)(?:$|\\s)`))
	if (tempdatestring2) {
		match = tempdatestring2[0].trim()

		let tempdatelist = tempdatestring2[0].trim().split(/\s+/)
		if (tempdatelist[1].toLowerCase() == 'sept') {
			tempdatelist[1] = 'sep'
		}

		let temp;
		if (SHORTMONTHLIST.map(d => d.toLowerCase()).includes(tempdatelist[1])) {
			temp = SHORTMONTHLIST.map(d => d.toLowerCase()).indexOf(tempdatelist[1])
		} else if (MONTHLIST.map(d => d.toLowerCase()).includes(tempdatelist[1])) {
			temp = MONTHLIST.map(d => d.toLowerCase()).indexOf(tempdatelist[1])
		}

		let tempdatedate = tempdatelist[0].match(/\d+/)

		mymonth = temp
		myday = +tempdatedate[0]
		myyear = +tempdatelist[2] || (new Date(currentdate.getFullYear(), mymonth).getTime() < new Date(currentdate.getFullYear(), currentdate.getMonth()) ? currentdate.getFullYear() + 1 : currentdate.getFullYear())
	}

	let tempdate2 = string.match(/\b((0?[1-9]|1[0-2])(\/|-)([1-9]|1[0-9]|2[0-9]|3[0-1])((\/|-)(\d{2}(\d{2})?))?)\b/)
	if (tempdate2) {
		match = tempdate2[0]

		let tempdate3 = tempdate2[0].split(/\/|-/)
		mymonth = +tempdate3[0] - 1
		myday = +tempdate3[1]
		myyear = (+tempdate3[2] && (!tempdate3[2].match(/\d{4}/) ? (floor(currentdate.getFullYear(), 100) + +tempdate3[2]) : (+tempdate3[2]))) || (new Date(currentdate.getFullYear(), mymonth).getTime() < new Date(currentdate.getFullYear(), currentdate.getMonth()) ? currentdate.getFullYear() + 1 : currentdate.getFullYear())
	}

	let tempdate12 = string.match(/\b((\d{4})(\/|-)(0?[1-9]|1[0-2])(\/|-)([1-9]|1[0-9]|2[0-9]|3[0-1]))\b/)
	if (tempdate12) {
		match = tempdate12[0]

		let tempdate13 = tempdate12[0].split(/\/|-/)
		mymonth = +tempdate13[1] - 1
		myday = +tempdate13[2]
		myyear = +tempdate13[0] || (new Date(currentdate.getFullYear(), mymonth).getTime() < new Date(currentdate.getFullYear(), currentdate.getMonth()) ? currentdate.getFullYear() + 1 : currentdate.getFullYear())
	}

	let tempdate8 = string.match(/\btoday\b/)
	if (tempdate8) {
		match = tempdate8[0]

		myyear = currentdate.getFullYear()
		mymonth = currentdate.getMonth()
		myday = currentdate.getDate()
	}

	let tempdate9 = string.match(/\btomorrow|tmrw|tmr|tmw\b/)
	if (tempdate9) {
		match = tempdate9[0]

		let tempdate4 = new Date(currentdate.getTime())
		tempdate4.setDate(tempdate4.getDate() + 1)

		myyear = tempdate4.getFullYear()
		mymonth = tempdate4.getMonth()
		myday = tempdate4.getDate()
	}

	let tempdate10 = string.match(/\byesterday\b/)
	if (tempdate10) {
		match = tempdate10[0]

		let tempdate4 = new Date(currentdate.getTime())
		tempdate4.setDate(tempdate4.getDate() - 1)

		myyear = tempdate4.getFullYear()
		mymonth = tempdate4.getMonth()
		myday = tempdate4.getDate()
	}

	return { value: [myyear, mymonth, myday], match: match }
}



//CALENDAR

class Calendar {
	constructor() {
	}

	static Calendar = class {
		constructor(title = '', notes = '', readonly, subscriptionurl, isprimary) {
			this.title = title
			this.notes = notes
			this.readonly = readonly
			this.subscriptionurl = subscriptionurl
			this.isprimary = isprimary
			this.hidden = false
			this.hexcolor = '#2693ff'
			this.id = generateID()
			this.googleid = null
			this.lastmodified = 0
		}

		static getTitle(item){
			if(!item) return
			if(item.title) return cleanInput(item.title)
			return `New Calendar`
		}
	}


	static Event = class {
		constructor(startyear, startmonth, startday, startminute, endyear, endmonth, endday, endminute, title = '', notes = '', type = 0) {

			this.start = {
				year: startyear,
				month: startmonth,
				day: startday,
				minute: startminute,
			}

			this.end = {
				year: endyear,
				month: endmonth,
				day: endday,
				minute: endminute,
			}

			this.endbefore = {
				year: endyear,
				month: endmonth,
				day: endday,
				minute: endminute,
			}

			this.id = generateID()
			this.calendarid = null
			this.googleeventid = null
			this.googlecalendarid = null
			this.googleclassroomid = null
			this.title = title
			this.type = type
			this.notes = notes
			this.priority = 0
			this.hexcolor = '#2693ff'
			this.repeat = {
				frequency: null,
				interval: null,
				byday: [],
				until: null,
				count: null,
			}
			this.timewindow = {
				day: {
					byday: []
				},
				time: {
					startminute: null,
					endminute: null
				}
			}
			this.lastmodified = 0
			this.parentid = null

			this.reminder = []
			let tempstart = new Date(this.start.year, this.start.month, this.start.day, 0, this.start.minute).getTime()
			if(tempstart - Date.now() > 86400000 * 7 && !Calendar.Event.isAllDay(this)){
				this.reminder.push({ timebefore: 86400000 })
				this.reminder.push({ timebefore: 3600000 })
			}else if(floor(tempstart, 86400000) != floor(Date.now(), 86400000) && !Calendar.Event.isAllDay(this)){
				this.reminder.push({ timebefore: 900000 })
			}else{
				this.reminder.push({ timebefore: 0 })
			}
		}

		static getTitle(item){
			if(!item) return
			if(item.title) return cleanInput(item.title)
			if(this.isSubtask(item)){
				return `${cleanInput(this.getTitle(this.getMainTask(item)))} (part ${this.getSubtaskIndex(item) + 1})`
			}
			return `New Event`
		}

		static getMainTask(item){
			let parent = [...calendar.events, ...calendar.todos].find(d => d.id == item.parentid)
			return parent
		}

		static getSubtasks(item){
			return [...calendar.events, ...calendar.todos].filter(d => d.parentid == item.id)
		}

		static getSubtaskIndex(item){
			return this.getSubtasks(this.getMainTask(item)).findIndex(f => f.id == item.id)
		}

		static isMainTask(item){
			return this.getSubtasks(item).length > 0
		}

		static isSubtask(item){
			return !!this.getMainTask(item)
		}

		static isEvent(item){
			return calendar.events.find(d => d.id == item.id)
		}

		static getCalendar(item) {
			if (item.calendarid == null) {
				let calendaritem = calendar.calendars.find(f => f.isprimary)
				if (calendaritem) {
					return calendaritem
				}
			} else {
				let calendaritem = calendar.calendars.find(f => f.id == item.calendarid)
				if (calendaritem) {
					return calendaritem
				}
			}
			return null
		}

		static isAllDay(item) {
			return !item.start.minute && !item.end.minute
		}

		static isReadOnly(item) {
			if (item.calendarid) {
				let calendaritem = calendar.calendars.find(f => f.id == item.calendarid)
				if (calendaritem) {
					return calendaritem.readonly
				}
			}
			return false
		}

		static isHidden(item) {
			if (item.calendarid == null) {
				let calendaritem = calendar.calendars.find(f => f.isprimary)
				if (calendaritem) {
					return calendaritem.hidden
				}
			} else {
				let calendaritem = calendar.calendars.find(f => f.id == item.calendarid)
				if (calendaritem) {
					return calendaritem.hidden
				}
			}
		}

		static isSchedulable(item) {
			return item.type == 1 && !item.completed
		}

		static getDueText(item) {
			let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
			return `${getDMDYText(endbeforedate)} ${getHMText(endbeforedate.getHours() * 60 + endbeforedate.getMinutes())}`
		}

		static getStartText(item) {
			let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			return `${getDMDYText(startdate)} ${getHMText(startdate.getHours() * 60 + startdate.getMinutes())}`
		}

		static getShortStartEndText(item) {
			function sametext(minutes1, minutes2) {
				return (minutes1 >= 0 && minutes1 < 720 && minutes2 >= 0 && minutes2 < 720) || (minutes1 >= 720 && minutes1 <= 1439 && minutes2 >= 720 && minutes2 <= 1439);
			}

			let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			let enddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

			let isshort = enddate.getTime() - startdate.getTime() < 2700000
				
			if (Calendar.Event.isAllDay(item)) {
				return 'All day'
			} else {
				return `${getHMText(item.start.minute, sametext(item.start.minute, item.end.minute) && !isshort)}${isshort ? '' : ` – ${getHMText(item.end.minute)}`}`
			}
		}

		static getFullStartEndText(item) {
			let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			let enddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

			let timelist = []
			if (Calendar.Event.isAllDay(item)) {
				enddate.setDate(enddate.getDate() - 1)
				timelist.push(getDMDYText(startdate))

				if (enddate.getDate() != startdate.getDate() || enddate.getMonth() != startdate.getMonth() || enddate.getFullYear() != startdate.getFullYear()) {
					timelist.push('–')
					timelist.push(getDMDYText(enddate))
				}
			} else {
				timelist.push(getDMDYText(startdate))
				timelist.push(getHMText(startdate.getHours() * 60 + startdate.getMinutes()))

				timelist.push('–')
				if (enddate.getDate() != startdate.getDate() || enddate.getMonth() != startdate.getMonth() || enddate.getFullYear() != startdate.getFullYear()) {
					timelist.push(getDMDYText(enddate))
				}
				timelist.push(getHMText(enddate.getHours() * 60 + enddate.getMinutes()))
			}
			return timelist.join(' ')
		}
	}

	static Todo = class {
		constructor(endbeforeyear, endbeforemonth, endbeforeday, endbeforeminute, duration, title = '', notes = '') {
			this.endbefore = {
				year: endbeforeyear,
				month: endbeforemonth,
				day: endbeforeday,
				minute: endbeforeminute,
			}
			this.notes = notes
			this.priority = 0
			this.duration = duration
			this.title = title
			this.id = generateID()
			this.googleclassroomid = null
			this.googleclassroomlink = null
			this.completed = false
			this.reminder = [{ timebefore: 6*3600*1000, timebefore: 0 }]
			this.lastmodified = 0
			this.parentid = null
			this.repeat = {
				frequency: null,
				interval: null,
				byday: [],
				until: null,
				count: null,
			}
			this.repeatid = null
			this.timewindow = {
				day: {
					byday: []
				},
				time: {
					startminute: null,
					endminute: null
				}
			}
			this.subtasksuggestions = []
		}

		static getTitle(item){
			if(!item) return
			if(item.title) return cleanInput(item.title)
			if(this.isSubtask(item)){
				return `${cleanInput(this.getTitle(this.getMainTask(item)))} (part ${this.getSubtaskIndex(item) + 1})`
			}
			return `New Task`
		}

		static getMainTask(item){
			let parent = [...calendar.events, ...calendar.todos].find(d => d.id == item.parentid)
			return parent
		}

		static getSubtasks(item){
			return [...calendar.events, ...calendar.todos].filter(d => d.parentid == item.id)
		}

		static getSubtaskIndex(item){
			return this.getSubtasks(this.getMainTask(item)).findIndex(f => f.id == item.id)
		}

		static isMainTask(item){
			return this.getSubtasks(item).length > 0
		}

		static isSubtask(item){
			return !!this.getMainTask(item)
		}

		static isSchedulable(item) {
			return !item.completed
		}

		static isTodo(item){
			return calendar.todos.find(d => d.id == item.id)
		}

		static isReadOnly(item){
			return !!item.googleclassroomid
		}
	}



	getDate() {
		return new Date(calendaryear, calendarmonth, calendarday)
	}

	getJSON() {
		return JSON.stringify(this)
	}

	getChangedJSON() {
		let tempthis = deepCopy(this)
		delete tempthis.lastmodified
		return JSON.stringify(tempthis)
	}

	//main
	updateTabs() {
		//tabs
		let summarywrap = getElement('summarywrap')
		let calendarwrap = getElement('calendarwrap')
		let todowrap = getElement('todowrap')
		let settingswrap = getElement('settingswrap')

		summarywrap.classList.add('display-none')
		todowrap.classList.add('display-none')
		calendarwrap.classList.add('display-none')
		settingswrap.classList.add('display-none')

		let paneldivider = getElement('paneldivider')

		//buttons
		let hometab = getElement('hometab')
		let summarytab = getElement('summarytab')
		let settingstab = getElement('settingstab')

		let calendartab2 = getElement('calendartab2')
		let todolisttab2 = getElement('todolisttab2')
		let summarytab2 = getElement('summarytab2')
		let settingstab2 = getElement('settingstab2')

		hometab.classList.remove('selectedbuttonunderline')
		summarytab.classList.remove('selectedbuttonunderline')
		settingstab.classList.remove('selectedbuttonunderline')

		calendartab2.classList.remove('selectedbutton2')
		todolisttab2.classList.remove('selectedbutton2')
		summarytab2.classList.remove('selectedbutton2')
		settingstab2.classList.remove('selectedbutton2')

		paneldivider.classList.add('display-none')

		if (calendartabs.includes(1)) {
			resetcreatetodo()
			updatecreatetodo()
			
			this.updateTodo()
			todowrap.classList.remove('display-none')
			todowrap.style.flex = '1'

			hometab.classList.add('selectedbuttonunderline')
			todolisttab2.classList.add('selectedbutton2')

			paneldivider.classList.remove('display-none')
		}

		if (calendartabs.includes(0)) {
			
			this.updateCalendar()
			calendarwrap.classList.remove('display-none')
			calendarwrap.style.flex = '2'

			hometab.classList.add('selectedbuttonunderline')
			calendartab2.classList.add('selectedbutton2')

			paneldivider.classList.remove('display-none')
		}

		if (calendartabs.includes(2)) {
			this.updateSummary()
			summarywrap.classList.remove('display-none')

			summarytab.classList.add('selectedbuttonunderline')
			summarytab2.classList.add('selectedbutton2')
		}

		if (calendartabs.includes(3)) {
			this.updateSettings()
			settingswrap.classList.remove('display-none')

			settingstab.classList.add('selectedbuttonunderline')
			settingstab2.classList.add('selectedbutton2')
		}

	}


	updateHistory(syncgoogle, smartschedule, setlastmodified) {
		let newjson = JSON.stringify({ events: this.events, todos: this.todos, calendars: this.calendars })
		if (newjson != historydata[historydata.length - 1]) {
			if (historydata.length > 0) {
				let neweventsdata = this.events
				let oldeventsdata = JSON.parse(historydata[historydata.length - 1]).events
				let oldcalendarsdata = JSON.parse(historydata[historydata.length - 1]).calendars
				let oldtodosdata = JSON.parse(historydata[historydata.length - 1]).todos


				//auto schedule
				if (smartschedule != false) {
					if (JSON.stringify(neweventsdata) != JSON.stringify(oldeventsdata)) {
						needtoautoschedule = true
					}
				}

				//last modified
				if(setlastmodified != false){
					if(JSON.stringify(this.events) != JSON.stringify(oldeventsdata) || JSON.stringify(oldtodosdata) != JSON.stringify(this.todos) || JSON.stringify(this.calendars) != JSON.stringify(oldcalendarsdata)){
						this.lastmodified = Date.now()
					}
				}

				//last modified changes
				/*
				for (let item of calendar.events) {
					let olditem = oldeventsdata.find(d => d.id == item.id)
					if (!olditem) { //create event
						item.lastmodified = Date.now()
					} else if (JSON.stringify(olditem) != JSON.stringify(item)) { //edit event
						item.lastmodified = Date.now()
					}
				}

				for (let item of calendar.todos) {
					let olditem = oldtodosdata.find(d => d.id == item.id)
					if (!olditem) { //create todo
						item.lastmodified = Date.now()
					} else if (JSON.stringify(olditem) != JSON.stringify(item)) { //edit todo
						item.lastmodified = Date.now()
					}
				}

				for (let item of calendar.calendars) {
					let olditem = oldcalendarsdata.find(d => d.id == item.id)
					if (!olditem) { //create calendar
						item.lastmodified = Date.now()
					} else if (JSON.stringify(olditem) != JSON.stringify(item)) { //edit calendar
						item.lastmodified = Date.now()
					}
				}
				*/



				//google calendar changes
				if (syncgoogle != false && calendar.settings.issyncingtogooglecalendar) {
					let requestchanges = []
					for (let item of calendar.events) {
						let olditem = oldeventsdata.find(d => d.id == item.id)
						if (!olditem) { //create event
							requestchanges.push({ type: 'createevent', item: item, requestid: generateID() })
						} else if (JSON.stringify(olditem) != JSON.stringify(item)) { //edit event
							//check for change
							if (new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime() != new Date(olditem.start.year, olditem.start.month, olditem.start.day, 0, olditem.start.minute).getTime() || new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() != new Date(olditem.end.year, olditem.end.month, olditem.end.day, 0, olditem.end.minute).getTime() || item.title != olditem.title || item.notes != olditem.notes || getRecurrenceString(item) != getRecurrenceString(olditem) || Calendar.Event.getCalendar(item)?.googleid != olditem.googlecalendarid) {
								requestchanges.push({ type: 'editevent', item: item, oldgooglecalendarid: olditem.googlecalendarid, newgooglecalendarid: Calendar.Event.getCalendar(item)?.googleid, requestid: generateID() })
							}
						}
					}
					for (let item of oldeventsdata) {
						if (!calendar.events.find(d => d.id == item.id)) { //delete event
							requestchanges.push({ type: 'deleteevent', googleeventid: item.googleeventid, googlecalendarid: item.googlecalendarid, requestid: generateID() })
						}
					}

					for (let item of calendar.calendars) {
						let olditem = oldcalendarsdata.find(d => d.id == item.id)
						if (!olditem) { //create calendar
							requestchanges.push({ type: 'createcalendar', item: item, requestid: generateID() })
						} else if (JSON.stringify(olditem) != JSON.stringify(item)) { //edit calendar
							//check for change
							if (olditem.title != item.title || olditem.notes != item.notes) {
								requestchanges.push({ type: 'editcalendar', item: item, requestid: generateID() })
							}
						}
					}
					for (let item of oldcalendarsdata) {
						if (!calendar.calendars.find(d => d.id == item.id)) { //delete calendar
							requestchanges.push({ type: 'deletecalendar', googleid: item.googleid, requestid: generateID() })
						}
					}

					setclientgooglecalendar(requestchanges)
				}

			}

			setHistory(newjson)
		}
	}

	//calendar
	updateCalendar() {
		this.updateStructure()
		this.updateBarColumnGroup()
		this.updateTopBarChildren()
		this.updateTopBarInfoDate()
		this.updateEvents()
		this.updateEventTime()
		this.updateTopBarMiddle()
		this.updateInfo()

		setStorage('calendarmode', calendarmode)
	}



	updateStructure() {
		let barcolumncontainer = getElement('barcolumncontainer')

		if (calendarmode == 0 || calendarmode == 1) {

			let output = `
	 		<div class="barcolumnwrap" id="barcolumnwrap">
				<div class="timecolumn">
					<div class="realtimebox">
						<div id="realtimedisplay" class="realtimedisplay"></div>
					</div>
					<div class="timeboxcolumn" id="timeboxcolumn"></div>
				</div>
			
				<div class="barcolumnall">
					<div class="realbarbox">
						<div id="realbardisplay" class="realbardisplay"></div>
					</div>
					
					<div class="barcolumngroup" id="barcolumngroup" onscroll="scrollincalendar(event)"></div>
				</div>
			</div>`

			barcolumncontainer.innerHTML = output

			requestAnimationFrame(function () {
				let barcolumngroup = getElement('barcolumngroup')
				barcolumngroup.scrollLeft = barcolumngroup.offsetWidth
			})

		} else if (calendarmode == 2) {
			let output = `
	 		<div class="monthscreens border-box" id="monthscreens" onscroll="scrollincalendar(event)"></div>`

			barcolumncontainer.innerHTML = output

			requestAnimationFrame(function () {
				let monthscreens = getElement('monthscreens')
				monthscreens.scrollTop = monthscreens.offsetHeight

				let barcolumncontainer = getElement('barcolumncontainer')
				barcolumncontainer.scrollTop = 0
			})
		}
	}

	updateTopBarInfoDate() {
		let str = `${MONTHLIST[this.getDate().getMonth()]} ${this.getDate().getFullYear()}`
		let topbarinfodate2 = getElement('topbarinfodate2')
		topbarinfodate2.innerHTML = calendarmode != 2 ? `
		<div class="transition-duration-100 border-8px flex-row gap-6px align-center padding-top-6px padding-bottom-6px pointer pointer-auto" onclick="setcalendarmode(2)">
			<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmall">
			<g>
			<path d="M186 10L70 128" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
			<path d="M186 246L70 128" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
			</g>
			</svg>
			${str}
		</div>` : str
		let topbarinfodate = getElement('topbarinfodate')
		topbarinfodate.innerHTML = str
	}

	updateBarColumnGroup() {
		if (calendarmode == 0) {
			let currentdate = new Date()
			let data = []
			for (let i = 0; i < 3; i++) {
				let tempdate = new Date(calendar.getDate())
				tempdate.setDate(tempdate.getDate() + i - 1)

				let data2 = []
				for (let i = 0; i < 25; i++) {
					let tempdate2 = new Date(tempdate)
					tempdate2.setHours(i)
					data2.push(`<div class="barbox"><div class="bardisplay"></div></div>`)
				}

				data.push(
					`<div class="barcolumn width-full">
					<div id="eventbox${i}" class="eventbox"></div>
		 			<div id="animateeventbox${i}" class="eventbox"></div>
					<div class="barboxcolumn" onmousedown="clickboxcolumn(event, ${tempdate.getTime()})" ondblclick="dblclickboxcolumn(event, ${tempdate.getTime()})">
			 			${data2.join('')}
					</div>

			 	</div>`)
			}

			let barcolumngroup = getElement('barcolumngroup')
			barcolumngroup.innerHTML = data.join('')

		} else if (calendarmode == 1) {
			let data = []
			let c = 0

			let currentdate = new Date()

			for (let j = 0; j < 3; j++) {
				let tempdata = []
				for (let i = 0; i < 7; i++) {
					let tempdate = new Date(calendar.getDate())
					tempdate.setDate(tempdate.getDate() + c - 7 - tempdate.getDay())

					let data2 = []
					for (let i = 0; i < 25; i++) {
						let tempdate2 = new Date(tempdate)
						tempdate2.setHours(i)
						data2.push(`<div class="barbox"><div class="bardisplay"></div></div>`)
					}

					tempdata.push(
						`<div class="barcolumn" data-timestamp="${tempdate.getTime()}">
						<div id="eventbox${c}" class="eventbox"></div>
						<div id="animateeventbox${c}" class="eventbox"></div>
						<div class="barboxcolumn" onmousedown="clickboxcolumn(event, ${tempdate.getTime()})" ondblclick="dblclickboxcolumn(event, ${tempdate.getTime()})">
				 			${data2.join('')}
						</div>
				 	</div>`)
					c++
				}
				data.push(`<div class="barcolumngroupgroup">${tempdata.join('')}</div>`)
			}

			let barcolumngroup = getElement('barcolumngroup')
			barcolumngroup.innerHTML = data.join('')
		} else if (calendarmode == 2) {

			function getdaysinmonth(year, month) {
				return new Date(year, month + 1, 0).getDate()
			}

			let calendardate = this.getDate()

			let startdate = new Date(calendaryear, calendarmonth, 1)
			startdate.setDate(startdate.getDate() - startdate.getDay() - 35)

			let daycounter = 0

			let screendata = []
			for (let screen = 0; screen < 3; screen++) {
				let rowdata = []

				for (let row = 0; row < 5; row++) {
					let daydata = []

					for (let day = 0; day < 7; day++) {
						let currentdate = new Date(startdate.getTime())
						currentdate.setDate(currentdate.getDate() + daycounter)

						let nowdate = new Date()

						let today = nowdate.getFullYear() == currentdate.getFullYear() && nowdate.getMonth() == currentdate.getMonth() && nowdate.getDate() == currentdate.getDate()

						daydata.push(`
						<div class="monthcontainer" onmousedown="clickmontharea(event)" ondblclick="dblclickmontharea(event, ${currentdate.getTime()})" data-timestamp="${currentdate.getTime()}">
								<div class="display-flex flex-column small:width-full small:height-full">
									<div class="padding-6px flex-1 border-8px display-flex flex-row align-center justify-center pointer monthdate ${today ? `small:background-blue` : ''} text-18px nowrap text-primary ${currentdate.getMonth() == calendardate.getMonth() && currentdate.getFullYear() == calendardate.getFullYear() ? '' : 'text-secondary'}" onclick="clickmonthdate(event, ${currentdate.getTime()})">
										${today ? '<span class="small:text-white">' : ''}${currentdate.getDate() == 1 ? `<span class="pre">${SHORTMONTHLIST[currentdate.getMonth()]} </span>` : ''}${today ? '</span>' : ''}${today ? '<span class="highlightdate small:background-transparent small:padding-0">' : ''}${currentdate.getDate()}${today ? '</span>' : ''}
									</div>
								</div>

							<div class="monthcontaineritems small:display-none" id="monthcontaineritems${daycounter}"></div>
						</div>`)

						daycounter++

					}

					rowdata.push(`<div class="monthrow">${daydata.join('')}</div>`)
				}

				screendata.push(`<div class="monthscreen">${rowdata.join('')}</div>`)
			}


			let monthscreens = getElement('monthscreens')
			monthscreens.innerHTML = screendata.join('')

		}
	}

	updateTopBarChildren() {
		if (calendarmode == 0) {
			let currentdate = new Date()

			let daydata = []
			let tempdata = []

			for (let i = 0; i < 3; i++) {
				let tempdate = new Date(this.getDate())
				tempdate.setDate(tempdate.getDate() - 1 + i)

				let today = currentdate.getFullYear() == tempdate.getFullYear() && currentdate.getMonth() == tempdate.getMonth() && currentdate.getDate() == tempdate.getDate()

				tempdata.push(`<div class="topbarchild width-full"><div class="topbarchildtext">${SHORTDAYLIST[tempdate.getDay()]} ${today ? '<span class="highlightdate">' : ''}${tempdate.getDate()}${today ? '</span>' : ''}</div></div>`)

				daydata.push(`<div class="dayeventbox overflow-y-auto flex-basis-auto flex-shrink-0 dayeventlist display-flex flex-column gap-2px width-full" id="dayeventbox${i}" data-timestamp="${tempdate.getTime()}" ondblclick="dblclickdayeventbox(event, ${tempdate.getTime()})" onmousedown="clickdayeventbox(event)"></div>`)
			}

			let data = `
			<div class="topbarspace"></div>
				<div class="topbarchildren overflow-hidden" id="topbarchildren">
					<div class="display-flex flex-row padding-bottom-12px">${tempdata.join('')}</div>
					<div class="display-flex flex-row dayeventheight" id="dayeventrow">${daydata.join('')}</div>
				</div>`

			let topbardays = getElement('topbardays')
			topbardays.innerHTML = data


			requestAnimationFrame(function () {
				let barcolumngroup = getElement('barcolumngroup')
				let topbarchildren = getElement('topbarchildren')
				topbarchildren.scrollLeft = barcolumngroup.scrollLeft
			})
		} else if (calendarmode == 1) {
			let currentdate = new Date()

			let daydata = []
			let tempdata = []

			let c = 0
			for (let j = 0; j < 3; j++) {
				let daydata2 = []
				let tempdata2 = []

				for (let i = 0; i < 7; i++) {
					//day display
					let tempdate = new Date(this.getDate())
					tempdate.setDate(tempdate.getDate() - 7 + c - tempdate.getDay())

					let today = currentdate.getFullYear() == tempdate.getFullYear() && currentdate.getMonth() == tempdate.getMonth() && currentdate.getDate() == tempdate.getDate()

					tempdata2.push(`<div class="topbarchild"><div class="topbarchildtext hovertopbarchild" onclick="clickweek(${tempdate.getTime()})">${SHORTDAYLIST[tempdate.getDay()]} ${today ? '<span class="highlightdate">' : ''}${tempdate.getDate()}${today ? '</span>' : ''}</div></div>`)

					//all day event
					daydata2.push(`<div class="overflow-y-auto dayeventlist flex-1 display-flex flex-column gap-2px dayeventbox" id="dayeventbox${c}" data-timestamp="${tempdate.getTime()}" ondblclick="dblclickdayeventbox(event, ${tempdate.getTime()})" onmousedown="clickdayeventbox(event)"></div>`)

					c++
				}

				daydata.push(`<div class="topbarchildrengroup">${daydata2.join('')}</div>`)
				tempdata.push(`<div class="topbarchildrengroup">${tempdata2.join('')}</div>`)
			}
			let data = `
				<div class="topbarspace"></div>
				<div class="topbarchildren overflow-hidden" id="topbarchildren">
					<div class="display-flex flex-row padding-bottom-12px">${tempdata.join('')}</div>
		 			<div class="display-flex flex-row dayeventheight" id="dayeventrow">${daydata.join('')}</div>
				</div>`

			let topbardays = getElement('topbardays')
			topbardays.innerHTML = data


			requestAnimationFrame(function () {
				let barcolumngroup = getElement('barcolumngroup')
				let topbarchildren = getElement('topbarchildren')
				topbarchildren.scrollLeft = barcolumngroup.scrollLeft
			})
		} else if (calendarmode == 2) {
			let data2 = []
			for (let i = 0; i < 7; i++) {
				data2.push(`<div class="topbarchild centertext"><div class="topbarchildtext">${SHORTDAYLIST[i]}</div></div>`)
			}

			let data = `
				<div class="topbarchildren overflow-hidden padding-bottom-12px" id="topbarchildren">
					<div class="display-flex flex-row">${data2.join('')}</div>
				</div>`

			getElement('calendarmonth').classList.remove('padding-left-42px')

			let topbardays = getElement('topbardays')
			topbardays.innerHTML = data
		}
	}


	updateAnimatedEvents() {
		if (calendarmode == 0 || calendarmode == 1) {
			for (let i = 0; i < [3, 21][calendarmode]; i++) {
				let currentdate = new Date(calendar.getDate())
				if (calendarmode == 1) {
					currentdate.setDate(currentdate.getDate() - currentdate.getDay() + i - 7)
				} else if (calendarmode == 0) {
					currentdate.setDate(currentdate.getDate() + i - 1)
				}

				let nextdate = new Date(currentdate)
				nextdate.setDate(nextdate.getDate() + 1)

				let templist = [...autoscheduleeventslist]
				if (!templist.find(d => d.id == editeventid)) {
					templist.push({ id: editeventid })
				}
				let tempevents = getevents(currentdate, nextdate, templist)

				let output = []
				for (let item of tempevents) {
					if (editeventid == item.id) {
						output.push(getdayeventdata(item, currentdate, currentdate.getTime(), 0, 1))
					} else {
						let olditem = oldautoscheduleeventslist.find(f => f.id == item.id)
						let newitem = newautoscheduleeventslist.find(d => d.id == item.id)

						if (!olditem || !newitem) continue

						let autoscheduleitem = autoscheduleeventslist.find(f => f.id == item.id)
						let percentage = autoscheduleitem.percentage
						let addedtodo = autoscheduleitem.addedtodo
						output.push(getanimateddayeventdata(item, olditem, newitem, currentdate, currentdate.getTime(), percentage, addedtodo))
					}
				}
				let animateeventbox = getElement(`animateeventbox${i}`)
				if (!animateeventbox) continue
				if (animateeventbox.innerHTML != output.join('')) {
					animateeventbox.innerHTML = output.join('')
				}
			}

		}
	}


	updateEvents() {
		this.updateAnimatedEvents()

		if (calendarmode == 0 || calendarmode == 1) {
			function getConflictingData(temp1, data, strict) {
				let item1 = temp1.item;
				let leftindent1 = temp1.leftindent;

				return data.filter(temp2 => {
					let item2 = temp2.item;
					let leftindent2 = temp2.leftindent;

					if (item1.id === item2.id) return false;

					let tempstartdate1 = new Date(item1.start.year, item1.start.month, item1.start.day, 0, item1.start.minute);
					let tempenddate1 = new Date(item1.end.year, item1.end.month, item1.end.day, 0, item1.end.minute);

					let tempstartdate2 = new Date(item2.start.year, item2.start.month, item2.start.day, 0, item2.start.minute);
					let tempenddate2 = new Date(item2.end.year, item2.end.month, item2.end.day, 0, item2.end.minute);

					let condition = (tempstartdate1.getTime() >= tempstartdate2.getTime() && tempstartdate1.getTime() < tempenddate2.getTime()) || (tempenddate1.getTime() > tempstartdate2.getTime() && tempenddate1.getTime() <= tempenddate2.getTime()) || (tempstartdate1.getTime() < tempstartdate2.getTime() && tempenddate1.getTime() > tempenddate2.getTime());

					return strict ? condition && leftindent1 === leftindent2 : condition
				})
			}


			let rangestartdate = new Date(calendar.getDate())
			let rangeenddate = new Date(calendar.getDate())
			if (calendarmode == 1) {
				rangestartdate.setDate(rangestartdate.getDate() - rangestartdate.getDay() - 7)
				rangeenddate.setDate(rangeenddate.getDate() - rangeenddate.getDay() + 21 - 7)
			} else if (calendarmode == 0) {
				rangestartdate.setDate(rangestartdate.getDate() - 1)
				rangeenddate.setDate(rangeenddate.getDate() + 3 - 1)
			}
			let alltempevents = getevents(rangestartdate, rangeenddate)


			for (let i = 0; i < [3, 21][calendarmode]; i++) {
				let currentdate = new Date(calendar.getDate())
				if (calendarmode == 1) {
					currentdate.setDate(currentdate.getDate() - currentdate.getDay() + i - 7)
				} else if (calendarmode == 0) {
					currentdate.setDate(currentdate.getDate() + i - 1)
				}

				let nextdate = new Date(currentdate);
				nextdate.setDate(nextdate.getDate() + 1);

				let output = [];
				let displayoutput = [];

				let dayoutput = [];
				let daydisplayoutput = [];

				let tempevents = geteventslite(currentdate, nextdate, alltempevents).filter(d => !autoscheduleeventslist.find(f => f.id == d.id) && d.id != editeventid)
				let tempborders = getborders(currentdate, nextdate)

				for (let item of tempevents) {
					Calendar.Event.isAllDay(item) ? dayoutput.push(item) : output.push({ item: item, leftindent: 0, columnwidth: 1 });
				}

				for (let item of tempborders) {
					displayoutput.push(getborderdata(item, currentdate, currentdate.getTime()));
				}

				for (let temp of output) {
					while (getConflictingData(temp, output, true).length > 0) {
						temp.leftindent++;
					}
				}

				for (let temp of output) {
					let templist = getConflictingData(temp, output).map(d => {
						let templist2 = getConflictingData(d, output).map(b => b.leftindent);
						templist2.push(d.leftindent);
						return templist2.length > 0 ? Math.max(...templist2) + 1 : 1;
					});
					temp.columnwidth = templist.length > 0 ? Math.max(...templist) : 1;
				}

				for (let temp of output) {
					displayoutput.push(getdayeventdata(temp.item, currentdate, currentdate.getTime(), temp.leftindent, temp.columnwidth))
				}

				displayoutput.push(getsleepdata());

				let eventbox = getElement(`eventbox${i}`)
				if (!eventbox) continue
				if (eventbox.innerHTML != displayoutput.join('')) {
					eventbox.innerHTML = displayoutput.join('')
				}

				for (let item of dayoutput) {
					daydisplayoutput.push(getalldayeventdata(item, currentdate, currentdate.getTime()));
				}

				let dayeventbox = getElement(`dayeventbox${i}`)
				if (!dayeventbox) continue
				if (dayeventbox.innerHTML != daydisplayoutput.join('')) {
					dayeventbox.innerHTML = daydisplayoutput.join('');
				}
			}
		} else if (calendarmode == 2) {
			let rangestartdate = new Date(calendar.getDate())
			let rangeenddate = new Date(calendar.getDate())
			rangestartdate.setDate(rangestartdate.getDate() - 35)
			rangeenddate.setDate(rangeenddate.getDate() + 35*2)
			let alltempevents = getevents(rangestartdate, rangeenddate)


			let startdate = new Date(calendaryear, calendarmonth, 1)
			startdate.setDate(startdate.getDate() - startdate.getDay() - 35)

			let currentdate2 = new Date()

			let counter1 = 0
			for (let index = 0; index < 3 * 5 * 7; index++) {
				let eventoutput = []

				let currentdate = new Date(startdate)
				currentdate.setDate(currentdate.getDate() + counter1)

				let nextdate = new Date(currentdate)
				nextdate.setDate(nextdate.getDate() + 1)

				let timeindex;

				let myevents = geteventslite(currentdate, nextdate, alltempevents).sort((h, j) => {
					let tempstartdate1 = new Date(h.start.year, h.start.month, h.start.day, 0, h.start.minute)
					let tempstartdate2 = new Date(j.start.year, j.start.month, j.start.day, 0, j.start.minute)
					return (tempstartdate1.getTime() - tempstartdate2.getTime())
				})

				for (let item of myevents) {
					let tempenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
					eventoutput.push(getmontheventdata(item, currentdate, currentdate.getTime()))

					if (currentdate2.getTime() >= tempenddate.getTime()) {
						timeindex = eventoutput.length
					}
				}

				if (eventoutput.length > 0 && currentdate2.getTime() < nextdate.getTime() && currentdate2.getTime() > currentdate.getTime()) {
					eventoutput.splice(timeindex, 0, '<div class="listtimebar"></div>')
				}

				let monthcontaineritems = getElement(`monthcontaineritems${index}`)
				if (!monthcontaineritems) continue
				if (monthcontaineritems.innerHTML != eventoutput.join('')) {
					monthcontaineritems.innerHTML = eventoutput.join('')
				}
				counter1++
			}

		}

	}

	updateEventTime() {
		if(!calendartabs.includes(0)) return
		if (calendarmode == 0 || calendarmode == 1) {
			let timeboxcolumn = getElement('timeboxcolumn')

			let currentdate = new Date()
			let tempdate = new Date(currentdate)
			tempdate.setHours(0, 0, 0, 0)

			let time = []
			for (let i = 0; i < 25; i++) {
				let difference = Math.abs((currentdate.getHours() * 60 + currentdate.getMinutes()) - (i * 60))
				time.push(`<div class="timebox"><div class="timedisplay">${difference >= 10 ? `${getHMText(tempdate.getHours() * 60 + tempdate.getMinutes())}` : ''}</div></div>`)
				tempdate.setHours(tempdate.getHours() + 1)
			}
			timeboxcolumn.innerHTML = time.join('')


			let realtimedisplay = getElement('realtimedisplay')
			realtimedisplay.classList.remove('display-none')
			realtimedisplay.style.top = (currentdate.getHours() * 60 + currentdate.getMinutes()) + 'px'
			realtimedisplay.innerHTML = getHMText(currentdate.getHours() * 60 + currentdate.getMinutes())

			let realbardisplay = getElement('realbardisplay')
			realbardisplay.classList.remove('display-none')
			realbardisplay.style.top = (currentdate.getHours() * 60 + currentdate.getMinutes()) + 'px'
		}
	}

	updateTopBarMiddle() {
		let topbarmiddle = getElement('topbarmiddle')
		for (let [index, div] of Object.entries(topbarmiddle.children)) {
			if (index == calendarmode) {
				div.classList.add('selectedbuttongrey')
			} else {
				div.classList.remove('selectedbuttongrey')
			}
		}
	}

	updateInfo(updateStructure, showinfo) {
		updateitemreminders()

		requestAnimationFrame(function () {
			let eventinfo = getElement('eventinfo')
			let item = calendar.events.find(c => c.id == selectedeventid)

			if (item) {
				if(Calendar.Event.isReadOnly(item)){
					editinfo = false
				}

				if (showinfo) {
					eventinfo.classList.remove('hiddenpopup')
					return
				}

				let info = getElement('info')

				let eventinfoedit = getElement('eventinfoedit')
				let eventinfodelete = getElement('eventinfodelete')

				//cannot edit or delete event
				if (Calendar.Event.isReadOnly(item)) {
					eventinfoedit.classList.add('display-none')
					eventinfodelete.classList.add('display-none')
				} else {
					eventinfoedit.classList.remove('display-none')
					eventinfodelete.classList.remove('display-none')
				}



				if (editinfo) {
					//EDIT EVENT

					eventinfoedit.innerHTML = `
						<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
						<g>
						<path d="M93.2369 211.648L10 120.493" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
						<path d="M93.2369 211.648L246 44.3518" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
						</g>
						</svg>
	
						<span class="tooltiptextcenter">Done</span>`

					if (updateStructure) {
						//UPDATE EDIT EVENT HTML

						let infodata = []

						//important and completed
						infodata.push(`<div class="infogroup">
							<div class="display-flex flex-row align-center gap-12px width-full">
				 				<div class="infotitle" id="eventinfotitle"></div>
								${item.type == 1 ? `<div class="display-flex flex-row" id="infopriority"></div>` : ''}
							</div>
						</div>`)

						infodata.push(`
				 			<div class="infogroup">
								<div class="inputgroup">
				 					<div class="text-14px text-primary width90px">Title</div>
				 					<div class="inputgroupitem flex-1">
										<input onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventtitle(event, '${item.id}')" id="infotitle" class="infoinput" placeholder="Add title" type="text" maxlength="2000"></input>
										<span class="inputline"></span>
					 				</div>
								</div>
							</div>
			 
							<div class="infogroup">
			 					<div class="inputgroup">
								 	<div class="text-14px text-primary width90px">Type</div>
									<div class="display-flex" id="eventinfoeventtype"></div>
				 				</div>
							</div>
							
							<div class="horizontalbar"></div>`)

						if (item.type == 0) {
							infodata.push(`
				 
								<div class="infogroup">
									<div class="inputgroup">
				 						<div class="text-14px text-primary width90px">Starts</div>
										<div class="inputgroupitem flex-1">
											<input  onclick="this.select()" onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventstartdate(event, '${item.id}')" id="infostartdate" class="infoinput inputdatepicker" type="text" placeholder="Add date"></input>
											<span class="inputline"></span>
					 					</div>
	
										${!Calendar.Event.isAllDay(item) ?
									`<div class="inputgroupitem flex-1">
												<input  onclick="this.select()" onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventstartminute(event, '${item.id}')" id="infostarttime" class="infoinput inputtimepicker" type="text" placeholder="Add time"></input>
												<span class="inputline"></span>
											</div>` : ''
								}
									</div>
								</div>`)

							infodata.push(`
								<div class="infogroup">
									<div class="inputgroup">
										<div class="text-14px text-primary width90px">Ends</div>
										<div class="inputgroupitem flex-1">
											<input onclick="this.select()"  onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventenddate(event, '${item.id}')" id="infoenddate" class="infoinput inputdatepicker" type="text" placeholder="Add date"></input>
											<span class="inputline"></span>
					 					</div>
										${!Calendar.Event.isAllDay(item) ?
									`<div class="inputgroupitem flex-1">
											<input onclick="this.select()"  onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventendminute(event, '${item.id}')" id="infoendtime" class="infoinput inputtimepicker" type="text" placeholder="Add time"></input>
											<span class="inputline"></span>
					 					</div>` : ''}
									</div>
								</div>`)

							infodata.push(`
								<div class="display-flex flex-row gap-12px align-center">
				 					<div class="text-14px text-primary width90px">All day</div>
					 				<div class="todoitemcheckbox tooltip display-flex" onclick="eventallday()" id="infoallday"></div>
				 				</div>`)

							infodata.push(`
								<div class="infogroup">
									<div class="inputgroup">
										<div class="text-14px text-primary width90px">Repeat</div>
										<div class="flex-1 border-8px transition-duration-100 pointer background-tint-1 hover:background-tint-2 text-14px text-primary padding-8px-12px popupbutton display-flex flex-row justify-space-between" id="repeatoptionbutton" onclick="clickrepeatoption()"></div>
									</div>
								</div>`)

							infodata.push(`<div class="horizontalbar"></div>`)
						}

						if (item.type == 1) {
							//due date
							//time needed
							//preferred day
							//preferred time
							infodata.push(`
				
							<div class="infogroup">
								<div class="inputgroup">
									<div class="text-14px text-primary width90px">Due date</div>
									<div class="inputgroupitem flex-1">
										<input onclick="this.select()"  onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventduedate(event, '${item.id}')" id="infoendbeforedate" class="infoinput inputdatepicker" type="text" placeholder="Add date"></input>
										<span class="inputline"></span>
									</div>
									<div class="inputgroupitem flex-1">
										<input onclick="this.select()"  onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventduetime(event, '${item.id}')" id="infoendbeforetime" class="infoinput inputtimepicker" type="text" placeholder="Add time"></input>
										<span class="inputline"></span>
									</div>
								</div>
							</div>
			 
							<div class="infogroup">
								<div class="inputgroup">
									<div class="text-14px text-primary width90px">Time needed</div>
									<div class="inputgroupitem flex-1">
										<input onclick="this.select()"  onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputeventduration(event, '${item.id}')" id="infoduration" class="infoinput inputdurationpicker" type="text" placeholder="Add duration"></input>
										<span class="inputline"></span>
								 </div>
								</div>
							</div>
	
							<div class="infogroup">
								<div class="inputgroup">
									<div class="text-14px text-primary width90px">Priority</div>
									<div class="inputeventtype width-fit flex-1" id="inputeventpriority">
										<div class="inputeventtypechild" onclick="clickeventpriority(0)">Low</div>
										<div class="inputeventtypechild" onclick="clickeventpriority(1)">Medium</div>
										<div class="inputeventtypechild" onclick="clickeventpriority(2)">High</div>
									</div>
								</div>
							</div>

							<div class="infogroup">
								<div class="inputgroup">
				 					<div class="text-14px text-primary width90px">Time slot</div>
					 				<div class="inputeventtype" id="inputTIMEWINDOW_PRESETS">
									 	<div class="inputeventtypechild" onclick="clickeventtimewindowpreset(0)">Any time</div>
										<div class="inputeventtypechild" onclick="clickeventtimewindowpreset(1)">Work hours</div>
										<div class="inputeventtypechild" onclick="clickeventtimewindowpreset(2)">School hours</div>
					 					<div class="inputeventtypechild" onclick="clickeventtimewindowpreset(3)">After school</div>
										<div class="inputeventtypechild" onclick="clickeventtimewindowpreset(4)">Early morning</div>
									</div>
				 				</div>
							</div>
						
				 
							<div class="infogroup display-none">
								<div class="inputgroup">
				 					<div class="text-14px text-primary width90px">Preferred day</div>
					 				<div class="inputeventtype" id="inputtimewindowday">
										<div class="inputeventtypechild" onclick="clickeventtimewindowday(0)">Any day</div>
										<div class="inputeventtypechild" onclick="clickeventtimewindowday(1)">Weekdays</div>
					 					<div class="inputeventtypechild" onclick="clickeventtimewindowday(2)">Weekends</div>
									</div>
				 				</div>
							</div>
				
							<div class="infogroup display-none">
								<div class="inputgroup">
				 					<div class="text-14px text-primary width90px">Preferred time</div>
					 				<div class="inputeventtype" id="inputtimewindowtime">
										<div class="inputeventtypechild" onclick="clickeventtimewindowtime(0)">Any time</div>
										<div class="inputeventtypechild" onclick="clickeventtimewindowtime(1)">Morning</div>
					 					<div class="inputeventtypechild" onclick="clickeventtimewindowtime(2)">Afternoon</div>
										<div class="inputeventtypechild" onclick="clickeventtimewindowtime(3)">Evening</div>
					 					<div class="inputeventtypechild" onclick="clickeventtimewindowtime(4)">Work hours</div>
									</div>
				 				</div>
							</div>
							`)

							infodata.push(`<div class="horizontalbar"></div>`)
						}

						infodata.push(`
				 			<div class="infogroup">
				 				<div class="inputgroup">
									<div class="text-14px text-primary width90px">Notes</div>
									<div class="inputgroupitem flex-1">
										<textarea onblur="inputeventnotes(event, '${item.id}')" id="infonotes" class="infoinput infonotes" placeholder="Add notes"  maxlength="2000"></textarea>
										<span class="inputlinewrap">
											<span class="inputline"></span>
										</span>
									</div>
								</div>
							</div>`)

						infodata.push(`
							<div class="infogroup">
								<div class="inputgroup">
						 			<div class="text-14px text-primary width90px">Color</div>
									<div class="display-flex flex-row gap-6px">
										<div class="eventcolorgroup">
											${DEFAULTCOLORS.map(d => `<div class="eventcolor" style="background-color:${d}" onclick="eventcolor('${d}')">${getchecksmall(d == item.hexcolor)}</div>`).join('')}
										</div>
										${!DEFAULTCOLORS.find(d => d == item.hexcolor) ? 
											`<div class="eventcolor eventcolorinputwrap padding-0 overflow-hidden relative" style="background-color:${item.hexcolor}">
												<div class="padding-6px display-flex">
													${getchecksmall(true)}
												</div>
												<input type="color" value="${item.hexcolor}" class="eventcolorinput" onchange="eventcolor(event.target.value)"/>
											</div>`
											:
											`<div class="relative eventcolorinputwrap border-round text-14px text-primary background-tint-1 pointer transition-duration-100 hover:background-tint-2">
												<div class="padding-6px display-flex">
													<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallfill">
														<g>
														<path d="M128 6.1875C121.925 6.1875 117 11.1124 117 17.1875L117 117L17.1875 117C11.1124 117 6.1875 121.925 6.1875 128C6.1875 134.075 11.1124 139 17.1875 139L117 139L117 238.812C117 244.888 121.925 249.813 128 249.812C134.075 249.812 139 244.888 139 238.812L139 139L238.812 139C244.888 139 249.813 134.075 249.812 128C249.812 121.925 244.888 117 238.812 117L139 117L139 17.1875C139 11.1124 134.075 6.1875 128 6.1875Z" fill-rule="nonzero" opacity="1" ></path>
														</g>
													</svg>
												</div>
												<input type="color" class="eventcolorinput" onchange="eventcolor(event.target.value)"/>
											</div>`}
											
										</div>
									</div>
								</div>
							</div>`)

						infodata.push(`
						<div class="infogroup">
							<div class="inputgroup">
								<div class="text-14px text-primary width90px">Calendar</div>
								<div class="flex-1 border-8px transition-duration-100 pointer background-tint-1 hover:background-tint-2 text-14px text-primary padding-8px-12px popupbutton display-flex flex-row justify-space-between" id="calendaroptionbutton" onclick="clickcalendaroption()"></div>
							</div>
						</div>`)

						if(infodata.join('') != info.innerHTML){
							info.innerHTML = infodata.join('')
						}
					}


					//UPDATE EDIT EVENT VALUES

					//title
					let eventinfotitle = getElement('eventinfotitle')
					eventinfotitle.innerHTML = `Edit ${Calendar.Event.getTitle(item)}`

					//inputs
					let tempdate3 = new Date(item.start.year, item.start.month, item.start.day)
					tempdate3.setMinutes(tempdate3.getMinutes() + item.end.minute - item.start.minute)

					let infotitle = getElement('infotitle')
					let infonotes = getElement('infonotes')

					infotitle.value = item.title
					infonotes.value = item.notes

					if (item.type == 0) {
						let infostartdate = getElement('infostartdate')
						let infoenddate = getElement('infoenddate')

						infostartdate.value = getDMDYText(new Date(item.start.year, item.start.month, item.start.day))
						if (Calendar.Event.isAllDay(item)) {
							infoenddate.value = getDMDYText(new Date(item.end.year, item.end.month, item.end.day - 1))
						} else {
							infoenddate.value = getDMDYText(new Date(item.end.year, item.end.month, item.end.day))
						}

						if (!Calendar.Event.isAllDay(item)) {
							let infostarttime = getElement('infostarttime')
							let infoendtime = getElement('infoendtime')
							infostarttime.value = getHMText(item.start.minute)
							infoendtime.value = getHMText(item.end.minute)
						}
					} else if (item.type == 1) {
						let infoduration = getElement('infoduration')
						let infoendbeforedate = getElement('infoendbeforedate')
						let infoendbeforetime = getElement('infoendbeforetime')

						infoduration.value = getDHMText(Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000))
						infoendbeforedate.value = getDMDYText(new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day))
						infoendbeforetime.value = getHMText(item.endbefore.minute)
					}


					if (item.type == 1) {
						//priority
						let inputeventpriority = getElement('inputeventpriority')
						for (let [index, div] of Object.entries(inputeventpriority.children)) {
							if (index == item.priority) {
								div.classList.add('selectedbutton')
							} else {
								div.classList.remove('selectedbutton')
							}
						}

						//time window presets
						let inputTIMEWINDOW_PRESETS = getElement('inputTIMEWINDOW_PRESETS')
						for (let [index, div] of Object.entries(inputTIMEWINDOW_PRESETS.children)) {
							let itemvalue = item.timewindow.day
							let itemvalue2 = item.timewindow.time
							let modelvalue = TIMEWINDOW_PRESETS[+index]

							if (isEqualArray(modelvalue.day.byday, itemvalue.byday) && itemvalue2.startminute == modelvalue.time.startminute && itemvalue2.endminute == modelvalue.time.endminute) {
								div.classList.add('selectedbutton')
							} else {
								div.classList.remove('selectedbutton')
							}
						}

						//time window
						let inputtimewindowday = getElement('inputtimewindowday')
						for (let [index, div] of Object.entries(inputtimewindowday.children)) {
							let itemvalue = item.timewindow.day
							let modelvalue = DAY_TIMEWINDOW_OPTION_DATA[+index]

							if (isEqualArray(modelvalue.byday, itemvalue.byday)) {
								div.classList.add('selectedbutton')
							} else {
								div.classList.remove('selectedbutton')
							}
						}

						let inputtimewindowtime = getElement('inputtimewindowtime')
						for (let [index, div] of Object.entries(inputtimewindowtime.children)) {
							let itemvalue = item.timewindow.time
							let modelvalue = TIME_TIMEWINDOW_OPTION_DATA[+index]
							if (itemvalue.startminute == modelvalue.startminute && itemvalue.endminute == modelvalue.endminute) {
								div.classList.add('selectedbutton')
							} else {
								div.classList.remove('selectedbutton')
							}
						}
					}

					if (item.type == 0) {
						//all day
						let infoallday = getElement('infoallday')
						infoallday.innerHTML = getcheckbox(Calendar.Event.isAllDay(item))
					}


					//event type
					let eventinfoeventtype = getElement('eventinfoeventtype')
					eventinfoeventtype.innerHTML = `
					<div class="display-flex flex-row background-tint-1 border-8px overflow-auto">
						<div class="pointer text-center pointer-auto border-8px hover:background-tint-2 text-14px text-primary padding-8px-12px   ${item.type == 0 ? `selectedbutton` : ``} transition-duration-100 width90px" onclick="eventtype(0)">Event</div>
						<div class="pointer text-center pointer-auto border-8px hover:background-tint-2 text-14px text-primary padding-8px-12px   ${item.type == 1 ? `selectedbutton` : ``} transition-duration-100 width90px" onclick="eventtype(1)">Task</div>
					</div>`

					if (item.type == 1) {
						//priority
						let infopriority = getElement('infopriority')
						infopriority.innerHTML = `
							${item.priority != 0 ?
								`${item.priority != 0 ?
									`<div class="text-14px badgepadding border-round nowrap transition-duration-100 pointer-none transition-duration-100 ${['background-tint-1 text-primary hover:background-tint-2 visibility-hidden hoverpriority small:visibility-visible', 'background-orange hover:background-orange-hover text-white', 'background-red hover:background-red-hover text-white'][item.priority]}">
										${['Low', 'Medium', 'High'][item.priority]} priority
									</div>`
									:
									''
								}`
								:
								''
							}`
					}

					if(item.type == 0){
						//repeat
						let repeatoptionbutton = getElement('repeatoptionbutton')

						let repeattext = getRepeatText(item)
						repeattext += `<span><svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline rotate90">
						<g>
						<path d="M88.6229 47.8879L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
						<path d="M88.6229 208.112L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
						</g>
						</svg></span>`

						repeatoptionbutton.innerHTML = repeattext
					}


					//calendar
					let calendaroptionbutton = getElement('calendaroptionbutton')
					let calendaritem = Calendar.Event.getCalendar(item)
					let calendartext = Calendar.Calendar.getTitle(calendaritem)
					calendartext += `<span><svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline rotate90">
					<g>
					<path d="M88.6229 47.8879L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					<path d="M88.6229 208.112L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					</g>
					</svg></span>`
					calendaroptionbutton.innerHTML = calendartext


				} else {
					//VIEW EVENT

					eventinfoedit.innerHTML = `
						<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
						<g>
						<path d="M178.389 21.6002L31.105 168.884M234.4 77.6109L87.1156 224.895M178.389 21.6002C193.856 6.13327 218.933 6.13327 234.4 21.6002C249.867 37.0671 249.867 62.1439 234.4 77.6109M10 245.998L31.105 168.884M10.0017 246L87.1156 224.895" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
						</g>
						</svg>
	
						<span class="tooltiptextcenter">Edit</span>`


					let output = []

					output.push(`<div class="infogroup">
						<div class="display-flex flex-row align-center gap-12px width-full">

							<div class="infotitle min-width-0 selecttext">${Calendar.Event.getTitle(item)}</div>
							${item.type == 1 ?
								`${item.priority != 0 ?
									`<div class="text-14px badgepadding border-round nowrap transition-duration-100 pointer-none transition-duration-100 ${['background-tint-1 text-primary hover:background-tint-2 visibility-hidden hoverpriority small:visibility-visible', 'background-orange hover:background-orange-hover text-white', 'background-red hover:background-red-hover text-white'][item.priority]}">
										${['Low', 'Medium', 'High'][item.priority]} priority
									</div>`
									:
									''
								}`
								:
								''
							}

							${!Calendar.Event.isReadOnly(item) && item.type == 1 ? 
								`<span class="text-primary display-inline-flex flex-row align-center gap-6px text-14px padding-8px-12px tooltip infotopright background-tint-1 hover:background-tint-2 pointer-auto transition-duration-100 border-round pointer" onclick="todocompleted(event, selectedeventid)">
									<div class="pointer-none nowrap text-primary text-14px">${item.completed ? `Mark uncomplete` : 'Mark complete'}</div>
								</span>` : ''
							}
						</div>
					</div>`)

					output.push(`
					<div class="infogroup">
						<div class="infotext selecttext nowrap">${Calendar.Event.getFullStartEndText(item)}</div>
					</div>`)

					//type
					if(!Calendar.Event.isReadOnly(item) && !Calendar.Event.isAllDay(item)){
						output.push(`<div class="infogroup">
							<div class="inputgroup">
								
								<div class="display-flex" id="eventinfoeventtype"></div></div>
							</div>
						</div>`)
					}

					//due and takes
					if (item.type == 1) {
						output.push(`
							<div class="infotext selecttext infotext ${new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute) < Date.now() && !item.completed ? 'text-red' : 'text-blue'}">Due ${Calendar.Event.getDueText(item)}</div>`)
						output.push(`
							<div class="infotext selecttext infotext text-green">Takes ${getDHMText(Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())/60000))}</div>`)
					}

					//repeats
					if (item.repeat.frequency != null && item.repeat.interval != null) {
						output.push(`
							<div class="infotext selecttext text-14px">Repeats ${getRepeatText(item, true)}</div>`)
					}

					//google classroom
					if(item.googleclassroomid){
						output.push(`<a href="${item.googleclassroomlink}" class="text-blue text-decoration-none text-14px hover:text-decoration-underline" target="_blank" rel="noopener noreferrer">Open Google Classroom assignment</a>`)
					}

					if (item.notes) {
						output.push(`<div class="horizontalbar"></div>`)

						output.push(`
						<div class="infogroup">
							<div class="infotext text-bold">Notes</div>
							<div class="infotext selecttext">${formatURL(cleanInput(item.notes))}</div>
						</div>`)
					}


						output.push('<div class="horizontalbar"></div>')
						
						output.push(`
						<div class="display-flex flex-row flex-wrap-wrap gap-12px">

							${!Calendar.Event.isReadOnly(item) && item.type == 1 ? 
							`
							<div class="text-14px display-flex flex-row align-center gap-6px padding-8px-12px  infotopright background-tint-1 tooltip hover:background-tint-2 text-primary pointer-auto transition-duration-100 border-8px pointer popupbutton" onclick="unscheduleevent('${item.id}')">
							
							<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonfillwhite">
<g>
								<g opacity="1">
								<path d="M116.007 236.883C120.045 236.883 123.369 235.577 125.981 232.965C128.594 230.353 129.9 227.028 129.9 222.991L129.9 177.633L133.343 177.633C148.7 177.633 162.276 179.137 174.071 182.145C185.865 185.153 196.275 190.318 205.299 197.64C214.323 204.962 222.278 215.114 229.165 228.096C231.223 231.896 233.539 234.31 236.111 235.34C238.684 236.369 241.237 236.883 243.77 236.883C246.936 236.883 249.766 235.518 252.26 232.787C254.753 230.056 256 226.118 256 220.972C256 199.045 253.605 179.315 248.816 161.781C244.027 144.247 236.665 129.267 226.731 116.839C216.797 104.411 204.092 94.9116 188.616 88.3414C173.14 81.7712 154.716 78.4861 133.343 78.4861L129.9 78.4861L129.9 33.603C129.9 29.645 128.594 26.2412 125.981 23.3915C123.369 20.5417 119.965 19.1169 115.77 19.1169C112.841 19.1169 110.229 19.7699 107.933 21.0761C105.638 22.3822 102.907 24.5393 99.7403 27.5473L6.05566 115.176C3.76005 117.314 2.17687 119.49 1.30612 121.707C0.435374 123.923 0 126.021 0 128C0 129.9 0.435374 131.958 1.30612 134.174C2.17687 136.391 3.76005 138.568 6.05566 140.705L99.7403 229.165C102.59 231.857 105.281 233.816 107.814 235.043C110.348 236.27 113.079 236.883 116.007 236.883ZM109.239 211.354C108.527 211.354 107.854 210.998 107.221 210.286L22.5603 130.256C22.0853 129.781 21.7489 129.365 21.551 129.009C21.3531 128.653 21.2542 128.317 21.2542 128C21.2542 127.288 21.6895 126.536 22.5603 125.744L107.102 44.6456C107.419 44.4082 107.735 44.1905 108.052 43.9926C108.369 43.7947 108.725 43.6957 109.121 43.6957C110.229 43.6957 110.783 44.2498 110.783 45.3581L110.783 92.4972C110.783 95.1095 112.129 96.4156 114.82 96.4156L130.731 96.4156C147.038 96.4156 161.168 98.4935 173.121 102.649C185.074 106.805 195.166 112.544 203.399 119.866C211.631 127.189 218.281 135.639 223.347 145.217C228.413 154.795 232.193 165.027 234.686 175.911C237.18 186.795 238.664 197.818 239.139 208.98C239.139 209.85 238.823 210.286 238.189 210.286C237.952 210.286 237.754 210.187 237.596 209.989C237.437 209.791 237.279 209.494 237.121 209.098C232.45 199.203 225.365 190.536 215.866 183.095C206.367 175.654 194.513 169.895 180.304 165.818C166.095 161.741 149.571 159.703 130.731 159.703L114.82 159.703C112.129 159.703 110.783 161.009 110.783 163.622L110.783 209.573C110.783 210.761 110.268 211.354 109.239 211.354Z" fill-rule="nonzero" opacity="1" ></path>
								</g>
								</g>
								</svg>


								<div class="pointer-none nowrap text-primary text-14px">Undo schedule</div>
							</div>

							<div class="text-white display-flex flex-row align-center gap-6px text-14px padding-8px-12px tooltip infotopright background-green hover:background-green-hover pointer-auto transition-duration-100 border-8px pointer display-none" onclick="startnow(selectedeventid);if(gtag){gtag('event', 'button_click', { useraction: 'Start now - event info' })}">
								<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonwhite">
									<g>
									<path d="M45.6353 28.72L45.6353 227.28" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
									<path d="M210.365 128L45.6353 227.28" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
									<path d="M210.365 128L45.6353 28.72" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
									</g>
								</svg>
								<div class="pointer-none nowrap text-white text-14px">Start now</div>
							</div>` : ''}
							
						
							<div class="text-14px display-flex flex-row align-center gap-6px padding-8px-12px tooltip infotopright background-blue hover:background-blue-hover text-white pointer-auto transition-duration-100 border-8px pointer popupbutton" id="remindmebutton" onclick="clickeventremindme('${item.id}')">
								<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 246 256" width="100%" class="buttonwhite">
									<g>
									<path d="M10 192.42L236 192.42" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
									<path d="M123 10.0582C130.922 9.7034 166.037 9.56067 191.111 54.719C202.976 76.0876 197.404 109.904 203.553 129.081C210.425 150.514 216.819 155.444 226.874 168.604C236.928 181.764 235.77 192.42 235.77 192.42" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
									<path d="M123 10.0582C115.078 9.7034 79.9633 9.56067 54.8887 54.719C43.0237 76.0876 48.5959 109.904 42.4474 129.081C35.5753 150.514 29.1808 155.444 19.1262 168.604C9.07153 181.764 10.23 192.42 10.23 192.42" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
									<path d="M78.4636 192.42C78.4636 192.42 81.2653 246 123.554 246C165.843 246 170.823 192.42 170.823 192.42" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
									</g>
								</svg>


								<div class="pointer-none nowrap text-white text-14px">${item.reminder.length == 0 ? 'Remind me' : `Remind me (${item.reminder.length})`}</div>
							</div>
						</div>
						`)

						if(output.join('') != info.innerHTML){
							info.innerHTML = output.join('')
						}
				}


				if(!Calendar.Event.isReadOnly(item) && !Calendar.Event.isAllDay(item)){
					//event type
					let eventinfoeventtype = getElement('eventinfoeventtype')
					eventinfoeventtype.innerHTML = `
					<div class="display-flex flex-row background-tint-1 border-8px overflow-auto">
						<div class="pointer text-center pointer-auto border-8px hover:background-tint-2 text-14px text-primary padding-8px-12px   ${item.type == 0 ? `selectedbutton` : ``} transition-duration-100 width90px" onclick="eventtype(0)">Event</div>
						<div class="pointer text-center pointer-auto border-8px hover:background-tint-2 text-14px text-primary padding-8px-12px   ${item.type == 1 ? `selectedbutton` : ``} transition-duration-100 width90px" onclick="eventtype(1)">Task</div>
					</div>`
				}


				if (movingevent) {
					eventinfo.classList.add('hiddenpopup')
					return
				}

				eventinfo.classList.remove('hiddenpopup')

				//fix eventinfo position
				eventinfo.style.top = fixtop(eventinfo.offsetTop, eventinfo) + 'px'
			} else {
				eventinfo.classList.add('hiddenpopup')
				editinfo = false
			}

		})
	}

	//todo
	updateTodo() {
		this.updateTodoList()
		this.updateEditTodo()
		this.updateTodoButtons()
		updateonboardingscreen()
		updateprompttodotoday()
	}

	updateEditTodo() {
		let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
		if(!item) return
		
		//priority
		let todoeditpriority = getElement('todoeditpriority')
		for (let [index, div] of Object.entries(todoeditpriority.children)) {
			if (index == item.priority) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}

		//time window presets
		let inputtodotimewindow = getElement('inputtodotimewindow')
		for (let [index, div] of Object.entries(inputtodotimewindow.children)) {
			let itemvalue = item.timewindow.day
			let itemvalue2 = item.timewindow.time
			let modelvalue = TIMEWINDOW_PRESETS[+index]

			if (isEqualArray(modelvalue.day.byday, itemvalue.byday) && itemvalue2.startminute == modelvalue.time.startminute && itemvalue2.endminute == modelvalue.time.endminute) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}

		//time window
		let todoedittimewindowday = getElement('todoedittimewindowday')
		for (let [index, div] of Object.entries(todoedittimewindowday.children)) {
			let itemvalue = item.timewindow.day
			let modelvalue = DAY_TIMEWINDOW_OPTION_DATA[+index]

			if (isEqualArray(modelvalue.byday, itemvalue.byday)) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}

		let todoedittimewindowtime = getElement('todoedittimewindowtime')
		for (let [index, div] of Object.entries(todoedittimewindowtime.children)) {
			let itemvalue = item.timewindow.time
			let modelvalue = TIME_TIMEWINDOW_OPTION_DATA[+index]
			if (itemvalue.startminute == modelvalue.startminute && itemvalue.endminute == modelvalue.endminute) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}
	}


	updateTodoButtons() {

		//schedule button
		let scheduleoncalendar = getElement('scheduleoncalendar')
		if (calendar.todos.filter(d => !d.completed).length > 0 && !schedulemytasksenabled) {
			scheduleoncalendar.classList.remove('display-none')
		} else {
			scheduleoncalendar.classList.add('display-none')
		}

		let schedulemytasksactivepopup = getElement('schedulemytasksactivepopup')
		let schedulemytasksactive = getElement('schedulemytasksactive')
		if (schedulemytasksenabled) {
			schedulemytasksactivepopup.classList.remove('hiddenfade')
			schedulemytasksactive.classList.remove('display-none')
		} else {
			schedulemytasksactivepopup.classList.add('hiddenfade')
			schedulemytasksactive.classList.add('display-none')
		}

		let plantasksselectall = getElement('plantasksselectall')
		if(schedulemytaskslist.length > 0){
			plantasksselectall.innerHTML = 'Deselect all'
		}else{
			plantasksselectall.innerHTML = 'Select all'
		}

		let plantaskssubmit = getElement('plantaskssubmit')

		schedulemytaskslist = schedulemytaskslist.filter(d => calendar.todos.find(g => g.id == d))

		plantaskssubmit.innerHTML = `<div class="display-flex flex-row gap-6px align-center background-blue hover:background-blue-hover padding-8px-12px border-round transition-duration-100 pointer ${schedulemytaskslist.length > 0 ? '' : 'greyedoutevent'}" ${schedulemytaskslist.length > 0 ? `onclick="submitschedulemytasks()"` : ''}>
			<div class="pointer-none text-16px text-white nowrap">Continue (${schedulemytaskslist.length})</div>
			<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonwhite">
				<g>
				<path d="M245.127 128L11.2962 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M157.392 204.44L245.127 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M157.392 51.5604L245.127 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
			</svg>
		</div>`
	}


	updateTodoList() {
		let output = []

		//old code with schedule vs unscheduled categories
		/*
		if(true){
			let mytodos = calendar.events.filter(d => d.type == 1 && !d.completed && Calendar.Event.getSubtasks(d).length == 0)
			let sortedtodos = sortstartdate(mytodos)


			let laststartdate;
			let tempoutput = []
			let tempoutput2 = []
			for (let i = 0; i < sortedtodos.length; i++) {
				if(i == 0){
					tempoutput.push(`<div class="flex-row gap-12px justify-center align-center display-flex">
						<div class="horizontalbar flex-1"></div>
						<div class="text-quaternary all-small-caps text-18px text-bold">Scheduled</div>
						<div class="horizontalbar flex-1"></div>
					</div>`)
				}

				let item = sortedtodos[i]
				let tempstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
				if (!laststartdate || tempstartdate.getDate() != laststartdate.getDate() || laststartdate.getMonth() != tempstartdate.getMonth() || laststartdate.getFullYear() != tempstartdate.getFullYear()) {
					tempoutput.push(`<div class="text-16px text-bold text-primary">Scheduled for ${getDMDYText(tempstartdate)}</div>`)
				}

				tempoutput2.push(gettododata(item))

				let nextitem = sortedtodos[i + 1]
				let nextstartdate = nextitem ? new Date(nextitem.start.year, nextitem.start.month, nextitem.start.day, 0, nextitem.start.minute) : null
				if (!nextstartdate || nextstartdate.getDate() != tempstartdate.getDate() || nextstartdate.getMonth() != tempstartdate.getMonth() || nextstartdate.getFullYear() != tempstartdate.getFullYear()) {
					output.push(`<div class="display-flex flex-column gap-12px">
						${tempoutput.join('')}
				
						<div class="display-flex flex-column bordertertiary border-8px">${tempoutput2.join('')}</div>
					</div>`)
					tempoutput = []
					tempoutput2 = []
				}

				laststartdate = tempstartdate
			}
		}


		if(true){
			let mytodos = calendar.todos.filter(d => !d.completed && !Calendar.Todo.isSubtask(d))

			let duetodos = sortduedate(mytodos.filter(d => d.endbefore.year != null && d.endbefore.month != null && d.endbefore.day != null && d.endbefore.minute != null))
			let notduetodos = mytodos.filter(d => d.endbefore.year == null || d.endbefore.month == null || d.endbefore.day == null || d.endbefore.minute == null)

			let lastduedate;
			let tempoutput = []
			let tempoutput2 = []
			for (let i = 0; i < duetodos.length; i++) {
				if(i == 0){
					tempoutput.push(`<div class="flex-row gap-12px justify-center align-center display-flex">
						<div class="horizontalbar flex-1"></div>
						<div class="text-quaternary all-small-caps text-18px text-bold">Unscheduled</div>
						<div class="horizontalbar flex-1"></div>
					</div>`)
				}

				let item = duetodos[i]
				let tempduedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
				if (!lastduedate || tempduedate.getDate() != lastduedate.getDate() || lastduedate.getMonth() != tempduedate.getMonth() || lastduedate.getFullYear() != tempduedate.getFullYear()) {
					let today = new Date()
					today.setHours(0,0,0,0)
					let tomorrow = new Date(today)
					tomorrow.setDate(tomorrow.getDate() + 1)
					let yesterday = new Date(today)
					yesterday.setDate(yesterday.getDate() - 1)

					let tempduedate2 = new Date(tempduedate)
					tempduedate2.setHours(0,0,0,0)
					let difference = Math.floor((today.getTime() - tempduedate2)/60000)

					let showrelative = true
					if ((tempduedate2.getMonth() == today.getMonth() && tempduedate2.getDate() == today.getDate() && tempduedate2.getFullYear() == today.getFullYear()) || (tempduedate2.getMonth() == tomorrow.getMonth() && tempduedate2.getDate() == tomorrow.getDate() && tempduedate2.getFullYear() == tomorrow.getFullYear()) || (tempduedate2.getMonth() == yesterday.getMonth() && tempduedate2.getDate() == yesterday.getDate() && tempduedate2.getFullYear() == yesterday.getFullYear())){
						showrelative = false
					}
					
					tempoutput.push(`<div class="text-16px text-bold text-primary">Due ${getDMDYText(tempduedate)} ${showrelative ? `<span class="text-secondary">${getRelativeYMWDText(difference)}</span>` : ''}</div>`)
				}

				tempoutput2.push(gettododata(item))

				let nextitem = duetodos[i + 1]
				let nextduedate = nextitem ? new Date(nextitem.endbefore.year, nextitem.endbefore.month, nextitem.endbefore.day, 0, nextitem.endbefore.minute) : null
				if (!nextduedate || nextduedate.getDate() != tempduedate.getDate() || nextduedate.getMonth() != tempduedate.getMonth() || nextduedate.getFullYear() != tempduedate.getFullYear()) {
					output.push(`<div class="display-flex flex-column gap-12px">
						${tempoutput.join('')}
				
						<div class="display-flex flex-column bordertertiary border-8px">${tempoutput2.join('')}</div>
					</div>`)
					tempoutput = []
					tempoutput2 = []
				}

				lastduedate = tempduedate
			}

			for (let i = 0; i < notduetodos.length; i++) {
				if(i == 0 && duetodos.length == 0){
					tempoutput.push(`<div class="flex-row gap-12px justify-center align-center display-flex">
						<div class="horizontalbar flex-1"></div>
						<div class="text-quaternary all-small-caps text-18px text-bold">Unscheduled</div>
						<div class="horizontalbar flex-1"></div>
					</div>`)
				}

				let item = notduetodos[i]
				if (i == 0) {
					tempoutput.push(`<div class="text-16px text-primary text-bold">No due date</div>`)
				}
				tempoutput2.push(gettododata(item))
				if (i == notduetodos.length - 1) {
					output.push(`
					<div class="display-flex flex-column gap-12px">
						${tempoutput.join('')}
						<div class="display-flex flex-column bordertertiary border-8px">${tempoutput2.join('')}</div>
					</div>`)
					tempoutput = []
					tempoutput2 = []
				}
			}
			
		}


		if(true){
			let mytodos = [...calendar.todos.filter(d => d.completed && !Calendar.Todo.isSubtask(d)), ...calendar.events.filter(d => d.type == 1 && d.completed)]


			let tempoutput = []
			let tempoutput2 = []

			for (let i = 0; i < mytodos.length; i++) {
				let item = mytodos[i]
				if (i == 0) {
					tempoutput.push(`<div class="display-flex flex-row justify-space-between align-center">
						<div class="text-16px text-bold text-primary">Completed</div>

						<div class="popupbutton tooltip infotopright hover:background-tint-1 pointer-auto transition-duration-100 border-8px pointer" onclick="deletecompletedtodos()">
								<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
								<g>
								<path d="M207.414 223.445L207.414 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M71.3433 246L184.657 246" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M207.414 223.445C207.414 235.902 197.226 246 184.657 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M238 57.6433L18 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M48.5864 223.445L48.5864 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M48.5864 223.445C48.5864 235.902 58.775 246 71.3433 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M96.1228 10L159.881 10" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M173.737 23.7283C173.737 16.1464 167.534 10 159.881 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M82.2668 23.7283C82.2668 16.1464 88.4703 10 96.1228 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M82.2668 23.7283L82.2668 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M173.737 23.7283L173.737 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M165.379 101.49L165.379 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								<path d="M90.6212 101.49L90.6212 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								<path d="M128 101.49L128 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								</g>
								</svg>
		
								<span class="tooltiptextleft">Delete completed tasks</span>
							</div>
					</div>`)
				}
				tempoutput2.push(gettododata(item))
				if (i == mytodos.length - 1) {
					output.push(`
					<div class="display-flex flex-column gap-12px">
						${tempoutput.join('')}
						<div class="display-flex flex-column bordertertiary border-8px">${tempoutput2.join('')}</div>
					</div>`)
					tempoutput = []
					tempoutput2 = []
				}
			}
			
		}
		*/



		if(true){
			let mytodos = [...calendar.todos.filter(d => !d.completed && !Calendar.Todo.isSubtask(d)), ...calendar.events.filter(d => d.type == 1 && !d.completed && !Calendar.Todo.isSubtask(d))]

			let duetodos = sortduedate(mytodos.filter(d => d.endbefore.year != null && d.endbefore.month != null && d.endbefore.day != null && d.endbefore.minute != null))
			let notduetodos = mytodos.filter(d => d.endbefore.year == null || d.endbefore.month == null || d.endbefore.day == null || d.endbefore.minute == null)

			let lastduedate;
			let tempoutput = []
			let tempoutput2 = []
			for (let i = 0; i < duetodos.length; i++) {
				let item = duetodos[i]
				let tempduedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
				if (!lastduedate || tempduedate.getDate() != lastduedate.getDate() || lastduedate.getMonth() != tempduedate.getMonth() || lastduedate.getFullYear() != tempduedate.getFullYear()) {
					let today = new Date()
					today.setHours(0,0,0,0)
					let tomorrow = new Date(today)
					tomorrow.setDate(tomorrow.getDate() + 1)
					let yesterday = new Date(today)
					yesterday.setDate(yesterday.getDate() - 1)

					let tempduedate2 = new Date(tempduedate)
					tempduedate2.setHours(0,0,0,0)
					let difference = Math.floor((today.getTime() - tempduedate2)/60000)

					let showrelative = true
					if ((tempduedate2.getMonth() == today.getMonth() && tempduedate2.getDate() == today.getDate() && tempduedate2.getFullYear() == today.getFullYear()) || (tempduedate2.getMonth() == tomorrow.getMonth() && tempduedate2.getDate() == tomorrow.getDate() && tempduedate2.getFullYear() == tomorrow.getFullYear()) || (tempduedate2.getMonth() == yesterday.getMonth() && tempduedate2.getDate() == yesterday.getDate() && tempduedate2.getFullYear() == yesterday.getFullYear())){
						showrelative = false
					}
					
					tempoutput.push(`<div class="text-16px text-bold text-primary">Due ${getDMDYText(tempduedate)} ${showrelative ? `<span class="text-secondary">${getRelativeYMWDText(difference)}</span>` : ''}</div>`)
				}

				tempoutput2.push(gettododata(item))

				let nextitem = duetodos[i + 1]
				let nextduedate = nextitem ? new Date(nextitem.endbefore.year, nextitem.endbefore.month, nextitem.endbefore.day, 0, nextitem.endbefore.minute) : null
				if (!nextduedate || nextduedate.getDate() != tempduedate.getDate() || nextduedate.getMonth() != tempduedate.getMonth() || nextduedate.getFullYear() != tempduedate.getFullYear()) {
					output.push(`<div class="display-flex flex-column gap-12px">
						${tempoutput.join('')}
				
						<div class="display-flex flex-column bordertertiary border-8px">${tempoutput2.join('')}</div>
					</div>`)
					tempoutput = []
					tempoutput2 = []
				}

				lastduedate = tempduedate
			}

			for (let i = 0; i < notduetodos.length; i++) {
				let item = notduetodos[i]
				if (i == 0) {
					tempoutput.push(`<div class="text-16px text-primary text-bold">No due date</div>`)
				}
				tempoutput2.push(gettododata(item))
				if (i == notduetodos.length - 1) {
					output.push(`
					<div class="display-flex flex-column gap-12px">
						${tempoutput.join('')}
						<div class="display-flex flex-column bordertertiary border-8px">${tempoutput2.join('')}</div>
					</div>`)
					tempoutput = []
					tempoutput2 = []
				}
			}
			
		}


		if(true){
			let mytodos = [ ...calendar.events.filter(d => d.type == 1 && d.completed && !Calendar.Todo.isSubtask(d)), ...calendar.todos.filter(d => d.completed && !Calendar.Todo.isSubtask(d))]


			let tempoutput = []
			let tempoutput2 = []

			for (let i = 0; i < mytodos.length; i++) {
				let item = mytodos[i]
				if (i == 0) {
					tempoutput.push(`<div class="display-flex flex-row justify-space-between align-center">
						<div class="text-16px text-bold text-primary">Completed</div>

						<div class="popupbutton tooltip infotopright hover:background-tint-1 pointer-auto transition-duration-100 border-8px pointer" onclick="deletecompletedtodos()">
								<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
								<g>
								<path d="M207.414 223.445L207.414 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M71.3433 246L184.657 246" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M207.414 223.445C207.414 235.902 197.226 246 184.657 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M238 57.6433L18 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M48.5864 223.445L48.5864 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M48.5864 223.445C48.5864 235.902 58.775 246 71.3433 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M96.1228 10L159.881 10" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M173.737 23.7283C173.737 16.1464 167.534 10 159.881 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M82.2668 23.7283C82.2668 16.1464 88.4703 10 96.1228 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M82.2668 23.7283L82.2668 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M173.737 23.7283L173.737 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M165.379 101.49L165.379 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								<path d="M90.6212 101.49L90.6212 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								<path d="M128 101.49L128 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								</g>
								</svg>
		
								<span class="tooltiptextleft">Delete completed tasks</span>
							</div>
					</div>`)
				}
				tempoutput2.push(gettododata(item))
				if (i == mytodos.length - 1) {
					output.push(`
					<div class="display-flex flex-column gap-12px">
						${tempoutput.join('')}
						<div class="display-flex flex-column bordertertiary border-8px">${tempoutput2.join('')}</div>
					</div>`)
					tempoutput = []
					tempoutput2 = []
				}
			}
			
		}

		

		if(output.length == 0){
			output.push(`<div class="absolute top-0 left-0 right-0 bottom-0 flex-1 display-flex flex-column align-center justify-center">
<div class="text-18px text-secondary">No tasks yet. <span class="text-blue hover:text-decoration-underline pointer pointer-auto" onclick="clickaddonetask()">Add one</span>.</div>
</div>`)
		}

		let alltodolist = getElement('alltodolist')
		if(alltodolist.innerHTML != output.join('')){
			alltodolist.innerHTML = output.join('')
		}

	}



	//summary
	updateSummary() {
		let currentdate = new Date()
		let startdate = new Date(currentdate)
		startdate.setHours(0, 0, 0, 0)
		let enddate = new Date(startdate)
		enddate.setDate(enddate.getDate() + 1)

		//progress
		let progressoutput = []

		let currentevents = getevents(currentdate, currentdate).filter(d => !Calendar.Event.isAllDay(d)).sort((h, j) => {
			let tempstartdate1 = new Date(h.end.year, h.end.month, h.end.day, 0, h.end.minute)
			let tempstartdate2 = new Date(j.end.year, j.end.month, j.end.day, 0, j.end.minute)
			return (tempstartdate1.getTime() - tempstartdate2.getTime())
		})

		let output = []
		for (let item of currentevents) {
			let tempstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			let tempenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
			let difference = Math.floor((currentdate.getTime() - tempenddate.getTime()) / 60000)

			output.push(`
	 			<div class="display-flex flex-column gap-6px">
		 			<div class="display-flex flex-row justify-space-between flex-wrap-wrap">
						<div class="text-16px text-bold text-primary break-word overflow-hidden">${Calendar.Event.getTitle(item)}</div>
						<div class="text-16px text-quaternary nowrap">Ends at ${getHMText(tempenddate.getHours() * 60 + tempenddate.getMinutes())} (${getDHMText(Math.abs(difference))} left)</div>
					</div>
		 			${getlineprogressbar(currentdate.getTime() - tempstartdate.getTime(), tempenddate.getTime() - tempstartdate.getTime())}
		 		</div>
			`)
		}
		if (output.length > 0) {
			progressoutput.push(`
	 		<div class="summarycolumnitem">
				<div class="text-18px text-primary">Now</div>
				<div class="horizontalbar"></div>
				<div class="summarylineprogressbars">${output.join('')}</div>
			</div>`)
		}

		let currentevents2 = getevents(currentdate, enddate).filter(d => !Calendar.Event.isAllDay(d)).sort((h, j) => {
			let tempstartdate1 = new Date(h.start.year, h.start.month, h.start.day, 0, h.start.minute)
			let tempstartdate2 = new Date(j.start.year, j.start.month, j.start.day, 0, j.start.minute)
			return (tempstartdate1.getTime() - tempstartdate2.getTime())
		})
		let output2 = []
		for (let item of currentevents2) {
			let tempstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			let tempenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
			let difference = Math.floor((currentdate.getTime() - tempstartdate.getTime()) / 60000)

			if (tempstartdate.getTime() > currentdate.getTime()) {
				output2.push(`
			 		<div class="summarycolumnprogressbargroup">
			 			<div class="summarytextrow flex-wrap-wrap">
			 				<div class="text-16px text-bold text-primary break-word overflow-hidden">${Calendar.Event.getTitle(item)}</div>
				 			<div class="text-16px text-quaternary nowrap">Starts at ${getHMText(tempstartdate.getHours() * 60 + tempstartdate.getMinutes())} (${getFullRelativeDHMText(difference)})</div>
						</div>
					</div>`)
			}
		}
		if (output2.length > 0) {
			progressoutput.push(`
			<div class="summarycolumnitem">
				<div class="text-18px text-primary">Up next</div>
				<div class="horizontalbar"></div>
				<div class="summarylineprogressbars">${output2.join('')}</div>
			</div>`)
		}

		if (progressoutput.length == 0) {
			progressoutput.push(`
			<div class="width-full gap-12px border-box display-flex flex-column">
				<div class="text-18px text-primary">All done</div>
				<div class="horizontalbar"></div>
				<div class="text-16px text-quaternary">No more events today</div>
			</div>`)
		}

		let progressevents = getElement('progressevents')
		progressevents.innerHTML = progressoutput.join('')


		//todos
		let summarytodocompleted = getElement('summarytodocompleted')
		let summarytodounfinished = getElement('summarytodounfinished')
		let summarytodooverdue = getElement('summarytodooverdue')

		let completedtodos = gettodos(startdate, enddate).filter(d => d.completed)
		let unfinishedtodos = gettodos(currentdate, enddate).filter(d => !d.completed)
		let passedtodos = gettodos(null, currentdate).filter(d => !d.completed)

		let totaltodos = completedtodos.length + unfinishedtodos.length + passedtodos.length

		summarytodocompleted.innerHTML = getcircleprogressbar(completedtodos.length, totaltodos, completedtodos.length, 'var(--green)')
		summarytodounfinished.innerHTML = getcircleprogressbar(unfinishedtodos.length, totaltodos, unfinishedtodos.length, 'var(--blue)')
		summarytodooverdue.innerHTML = getcircleprogressbar(passedtodos.length, totaltodos, passedtodos.length, 'var(--red)')

		//today's events
		let summaryeventtimebusy = getElement('summaryeventtimebusy')
		let summaryeventtimefree = getElement('summaryeventtimefree')
		let summaryeventtimesleep = getElement('summaryeventtimesleep')

		let timebusy = 0;
		let timefree = calendar.settings.sleep.startminute - calendar.settings.sleep.endminute;

		let nextdate = new Date(startdate)
		nextdate.setDate(nextdate.getDate() + 1)
		let tempevents = getevents(startdate, nextdate).filter(d => !Calendar.Event.isAllDay(d))

		for (let min = 0; min < 1440; min++) {
			let tempstartdate = new Date(startdate)
			tempstartdate.setMinutes(min)
			let tempenddate = new Date(tempstartdate)
			tempenddate.setMinutes(tempenddate.getMinutes() + 1)

			if (tempevents.find(d => {
				let dstartdate = new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute)
				let denddate = new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute)

				return dstartdate.getTime() < tempenddate.getTime() && denddate.getTime() > tempstartdate.getTime()
			})) {
				timebusy++
				if (min < calendar.settings.sleep.startminute && min >= calendar.settings.sleep.endminute) {
					timefree--
				}
			}
		}

		let timesleep = 1440 - (timebusy + timefree)

		summaryeventtimefree.innerHTML = getcircleprogressbar(timefree, 1440, getDHMText(timefree), 'var(--blue)')
		summaryeventtimebusy.innerHTML = getcircleprogressbar(timebusy, 1440, getDHMText(timebusy), 'var(--orange)')
		summaryeventtimesleep.innerHTML = getcircleprogressbar(timesleep, 1440, getDHMText(timesleep), 'var(--purple)')

		//past week's events
		let eventgraph = getElement('eventgraph')
		let output3 = []
		let daysoutput = []
		for (let i = 0; i < 7; i++) {
			let tempstartdate = new Date()
			tempstartdate.setDate(tempstartdate.getDate() - 6 + i)
			tempstartdate.setHours(0, 0, 0, 0)

			daysoutput.push(`<div class="text-14px text-secondary flex-1 text-center">${SHORTDAYLIST[tempstartdate.getDay()]} ${tempstartdate.getDate()}</div>`)


			let temptimebusy = 0;
			let temptimefree = calendar.settings.sleep.startminute - calendar.settings.sleep.endminute

			let tempnextdate = new Date(tempstartdate)
			tempnextdate.setDate(tempnextdate.getDate() + 1)
			let temptempevents = getevents(tempstartdate, tempnextdate).filter(d => !Calendar.Event.isAllDay(d))

			for (let min = 0; min < 1440; min++) {
				let temptempstartdate = new Date(tempstartdate)
				temptempstartdate.setMinutes(min)
				let temptempenddate = new Date(temptempstartdate)
				temptempenddate.setMinutes(temptempenddate.getMinutes() + 1)

				if (temptempevents.find(d => {
					let dstartdate = new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute)
					let denddate = new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute)

					return dstartdate.getTime() < temptempenddate.getTime() && denddate.getTime() > temptempstartdate.getTime()
				})) {
					temptimebusy++
					if (min < calendar.settings.sleep.startminute && min >= calendar.settings.sleep.endminute) {
						temptimefree--
					}
				}
			}

			let temptimesleep = 1440 - (temptimebusy + temptimefree)

			let tempclass = i == 0 ? 'tooltiptextright' : (i == 6 ? 'tooltiptextleft' : 'tooltiptextcenter')
			output3.push(`
	 		<div class="display-flex flex-column align-center flex-1 border-box">
				<div class="widthhalf display-flex flex-column flex-1 flex-basis-auto">
		 			<div class="pointer background-purple border-8px tooltip" style="flex:${temptimesleep / 1440}">
						<span class="${tempclass}">Time for sleep: ${getDHMText(temptimesleep)}</span>
					</div>
			 		<div class="pointer background-blue border-8px tooltip" style="flex:${temptimefree / 1440}">
						<span class="${tempclass}">Time free: ${getDHMText(temptimefree)}</span>
					</div>
			 		<div class="pointer background-orange border-8px tooltip" style="flex:${temptimebusy / 1440}">
						<span class="${tempclass}">Time busy: ${getDHMText(temptimebusy)}</span>
					</div>
		 		</div>
			</div>`)
		}
		eventgraph.innerHTML = output3.join('')

		let eventgraphdays = getElement('eventgraphdays')
		eventgraphdays.innerHTML = daysoutput.join('')
	}


	//settings
	updateSettings() {
		updatecalendarlist()
		updateAvatar()
		updateuserinfo()

		//mode
		let autoschedulemodes2 = getElement('autoschedulemodes2')
		for (let [index, div] of Object.entries(autoschedulemodes2.children)) {
			if (index == calendar.smartschedule.mode) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}

		//inputs
		let settingssleepstart = getElement('settingssleepstart')
		let settingssleepend = getElement('settingssleepend')
		let settingssleepstart2 = getElement('settingssleepstart2')
		let settingssleepend2 = getElement('settingssleepend2')

		if(settingssleepstart) settingssleepstart.value = getHMText(calendar.settings.sleep.startminute)
		if(settingssleepend) settingssleepend.value = getHMText(calendar.settings.sleep.endminute)
		settingssleepstart2.value = getHMText(calendar.settings.sleep.startminute)
		settingssleepend2.value = getHMText(calendar.settings.sleep.endminute)


		let settingseventspacing = getElement('settingseventspacing')
		settingseventspacing.value = getDHMText(calendar.settings.eventspacing)


		//tabs
		let settingscontentwrap = getElement('settingscontentwrap')
		for (let [index, div] of Object.entries(settingscontentwrap.children)) {
			if (index == settingstab) {
				div.classList.remove('display-none')
			} else {
				div.classList.add('display-none')
			}
		}

		let settingstablist1 = getElement('settingstablist1')
		for (let [index, div] of Object.entries(settingstablist1.children)) {
			if (index == settingstab) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}

		let settingstablist2 = getElement('settingstablist2')
		for (let [index, div] of Object.entries(settingstablist2.children)) {
			if (index == settingstab) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}


		//theme
		let settingsthemes = getElement('settingsthemes')
		for (let [index, div] of Object.entries(settingsthemes.children)) {
			if (calendar.settings.theme == index) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}

		//time format
		let settingstimeformat12 = getElement('settingstimeformat12')
		let settingstimeformat24 = getElement('settingstimeformat24')
		settingstimeformat12.classList.remove('selectedbutton')
		settingstimeformat24.classList.remove('selectedbutton')
		if (calendar.settings.militarytime) {
			settingstimeformat24.classList.add('selectedbutton')
		} else {
			settingstimeformat12.classList.add('selectedbutton')
		}

		//calendars
		let settingscalendarlist = getElement('settingscalendarlist')

		let tempoutput = []


		function getcalendaritemdata(item) {
			return `
			<div class="display-flex gap-12px flex-row background-tint-1 padding-8px-12px border-8px align-center">
				<div class="todoitemcheckbox tooltip" onclick="toggleshowcalendar(event, '${item.id}')">
					${getcolorcheckbox(!item.hidden, item.hexcolor, item.hidden ? '<span class="tooltiptextright">Show calendar</span>' : '<span class="tooltiptextright">Hide calendar</span>')}
				</div>
		 
				<div class="display-flex flex-column flex-1">
					<div class="text-primary calendaritemtext text-bold text-14px">${Calendar.Calendar.getTitle(item)}</div>
			 		<div class="text-quaternary calendaritemtext text-14px">${item.notes ? cleanInput(item.notes) : ''}</div>
				</div>
	
				<div class="infotopright pointer tooltip popupbutton" onclick="togglecalendaritempopup('${item.id}', this)">
					<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
					<g>
					<path d="M118.061 128C118.061 122.511 122.511 118.061 128 118.061C133.489 118.061 137.939 122.511 137.939 128C137.939 133.489 133.489 137.939 128 137.939C122.511 137.939 118.061 133.489 118.061 128Z" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
					<path d="M208.695 128C208.695 122.511 213.144 118.061 218.634 118.061C224.123 118.061 228.573 122.511 228.573 128C228.573 133.489 224.123 137.939 218.634 137.939C213.144 137.939 208.695 133.489 208.695 128Z" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
					<path d="M27.4272 128C27.4272 122.511 31.8771 118.061 37.3663 118.061C42.8555 118.061 47.3054 122.511 47.3054 128C47.3054 133.489 42.8555 137.939 37.3663 137.939C31.8771 137.939 27.4272 133.489 27.4272 128Z" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
					</g>
					</svg>
					<span class="tooltiptextcenter">Options</span>
				</div>
			
		 	</div>`
		}

		let sortedcalendars = calendar.calendars.sort((a, b) => {
			if (a.isprimary != b.isprimary) return a.isprimary ? -1 : 1
			if (!!a.googleid != !!b.googleid) return !!a.googleid ? -1 : 1
			if (a.subscriptionurl != b.subscriptionurl) {
				if (!a.subscriptionurl) return 1
				if (!b.subscriptionurl) return -1
			}
			return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
		})
		for (let item of sortedcalendars) {
			tempoutput.push(getcalendaritemdata(item))
		}


		settingscalendarlist.innerHTML = tempoutput.join('')


		//syncing with google calendar
		let lastsyncedgooglecalendar = getElement('lastsyncedgooglecalendar')
		let lastsyncedgooglecalendar2 = getElement('lastsyncedgooglecalendar2')
		let syncgooglecalendartoggle = getElement('syncgooglecalendartoggle')
		let syncgooglecalendartoggle2 = getElement('syncgooglecalendartoggle2')

		lastsyncedgooglecalendar.classList.add('display-none')
		lastsyncedgooglecalendar2.classList.add('display-none')

		if (calendar.settings.issyncingtogooglecalendar) {
			syncgooglecalendartoggle.checked = true
			syncgooglecalendartoggle2.checked = true

			lastsyncedgooglecalendar.classList.remove('display-none')
			lastsyncedgooglecalendar2.classList.remove('display-none')

			let currentdate = new Date()

			let issynced = calendar.lastsyncedgooglecalendardate && Math.floor((currentdate.getTime() - calendar.lastsyncedgooglecalendardate) / 60000) <= 1


			let difference;
			if(calendar.lastsyncedgooglecalendardate){
				difference = Math.floor((currentdate.getTime() - calendar.lastsyncedgooglecalendardate) / 60000)
			}

			let text = `
			<div class="display-flex flex-row align-center gap-6px tooltip">
				${issynced ? 
					`
					<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilledgreen">
						<g>
						<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1"></path>
						<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1"></path>
						</g>
					</svg>
					<div class="text-14px text-green">In sync</div>`
				:
				`<div class="text-14px text-red">Not synced</div>
				<span class="tooltiptextright">${difference ? `Last synced ${getRelativeDHMText(difference)}` : `Never synced`}</span>`}
			</div>`
			lastsyncedgooglecalendar.innerHTML = text
			lastsyncedgooglecalendar2.innerHTML = text
		} else {
			syncgooglecalendartoggle.checked = false
			syncgooglecalendartoggle2.checked = false
		}


		//sync with google classroom
		let syncgoogleclassroomtoggle = getElement('syncgoogleclassroomtoggle')
		syncgoogleclassroomtoggle.checked = calendar.settings.issyncingtogoogleclassroom

		let lastsyncedgoogleclassroom = getElement('lastsyncedgoogleclassroom')

		lastsyncedgoogleclassroom.classList.add('display-none')

		if(calendar.settings.issyncingtogoogleclassroom){

			lastsyncedgoogleclassroom.classList.remove('display-none')

			let currentdate = new Date()

			let issynced = calendar.lastsyncedgoogleclassroomdate && Math.floor((currentdate.getTime() - calendar.lastsyncedgoogleclassroomdate) / 60000) <= 1

			let difference;
			if(calendar.lastsyncedgoogleclassroomdate){
				difference = Math.floor((currentdate.getTime() - calendar.lastsyncedgoogleclassroomdate) / 60000)
			}

			let text = `
			<div class="display-flex flex-row align-center gap-6px tooltip">
				${issynced ? 
					`<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilledgreen">
						<g>
						<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1"></path>
						<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1"></path>
						</g>
					</svg>
					<div class="text-14px text-green">In sync</div>`
				:
				`<div class="text-14px text-red">Not synced</div>
				<span class="tooltiptextright">${difference ? `Last synced ${getRelativeDHMText(difference)}` : `Never synced`}</span>`}
			</div>`
			lastsyncedgoogleclassroom.innerHTML = text
		}


		//google login
		let googleemail = getElement('googleemail')
		let connectgoogle = getElement('connectgoogle')
		let disconnectgoogle = getElement('disconnectgoogle')
		disconnectgoogle.classList.add('display-none')
		connectgoogle.classList.add('display-none')
		googleemail.classList.add('display-none')
		if (clientinfo.google_email) {
			disconnectgoogle.classList.remove('display-none')
			googleemail.classList.remove('display-none')
			googleemail.innerHTML = cleanInput(clientinfo.google_email)
		} else {
			connectgoogle.classList.remove('display-none')
		}


		//password
		let changepassword = getElement('changepassword')
		let setpassword = getElement('setpassword')

		setpassword.classList.add('display-none')
		changepassword.classList.add('display-none')
		if (clientinfo.password) {
			changepassword.classList.remove('display-none')
		} else {
			setpassword.classList.remove('display-none')
		}

		accountpassword.innerHTML = clientinfo.password ? '•'.repeat(10) : 'No password'

		//username
		let loginemail = (clientinfo.google_email && `${clientinfo.google_email} (from Google)`) || clientinfo.username
		let accountusername = getElement('accountusername')
		accountusername.innerHTML = loginemail ? cleanInput(loginemail) : 'No email'

		let changeusername = getElement('changeusername')
		let setusername = getElement('setusername')

		changeusername.classList.add('display-none')
		setusername.classList.add('display-none')
		if (loginemail) {
			changeusername.classList.remove('display-none')
		} else {
			setusername.classList.remove('display-none')
		}



		//browser notif
		let enablepushnotif = getElement('enablepushnotif')
		let enablepushnotif2 = getElement('enablepushnotif2')
		enablepushnotif.checked = calendar.pushSubscriptionEnabled
		enablepushnotif2.checked = calendar.pushSubscriptionEnabled


		//ios app notif
		let iosappnotif = getElement('iosappnotif')
		iosappnotif.checked = calendar.iosnotificationenabled
		let iosappnotif2 = getElement('iosappnotif2')
		iosappnotif2.checked = calendar.iosnotificationenabled

		let iosnotificaitonswrap2 = getElement('iosnotificaitonswrap2')
		let iosnotificaitonswrap = getElement('iosnotificaitonswrap')
		if(clientinfo.iosdevicetoken){
			iosnotificaitonswrap2.classList.remove('display-none')
			iosnotificaitonswrap.classList.remove('display-none')
		}else{
			iosnotificaitonswrap2.classList.add('display-none')
			iosnotificaitonswrap.classList.add('display-none')
		}


		//email notif		
		let enableemailnotif = getElement('enableemailnotif')
		let enableemailnotif2 = getElement('enableemailnotif2')
		enableemailnotif.checked = calendar.emailreminderenabled
		enableemailnotif2.checked = calendar.emailreminderenabled

		let sendtoemail = getUserEmail()
		if(!isEmail(sendtoemail)){
			sendtoemail = null
		}

		let emailnotificationsstatus = getElement('emailnotificationsstatus')
		let emailnotificationsstatus2 = getElement('emailnotificationsstatus2')
		if(calendar.emailreminderenabled){
			emailnotificationsstatus.classList.remove('display-none')
			emailnotificationsstatus2.classList.remove('display-none')

			let emailtext = `
			<div class="display-flex flex-row gap-6px align-center">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilledgreen">
					<g>
					<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1"></path>
					<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1"></path>
					</g>
				</svg>
				<div class="text-14px text-green">${sendtoemail ? `Sending to ${sendtoemail}` : 'No email'}</div>
			</div>`

			emailnotificationsstatus.innerHTML = emailtext
			emailnotificationsstatus2.innerHTML = emailtext
		}else{
			emailnotificationsstatus.classList.add('display-none')
			emailnotificationsstatus2.classList.add('display-none')
		}


		//discord notif
		let enablediscordnotif = getElement('enablediscordnotif')
		let enablediscordnotif2 = getElement('enablediscordnotif2')
		enablediscordnotif.checked = calendar.discordreminderenabled
		enablediscordnotif2.checked = calendar.discordreminderenabled


		let connectdiscordstatus2 = getElement('connectdiscordstatus2')
		let connectdiscordstatus = getElement('connectdiscordstatus')

		let discordtext;
		if(clientinfo.discord.id){
			discordtext = `
			<div class="display-flex flex-row gap-6px">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilledgreen">
					<g>
					<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1"></path>
					<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1"></path>
					</g>
				</svg>
				<div class="text-14px text-green">Connected ${clientinfo.discord.username ? `to ${cleanInput(clientinfo.discord.username)}` : ''}</div>
			</div>
			
			<div class="width-fit text-14px text-primary background-tint-1 padding-8px-12px hover:background-tint-2 border-8px transition-duration-100 pointer" onclick="disconnectdiscord()">Disconnect</div>
			`
		}else{
			discordtext = `<div class="width-fit display-flex flex-row gap-6px align-center border-8px nowrap flex-1 discordbutton text-center text-14px padding-8px-12px pointer transition-duration-100" onclick="logindiscord()">
				<svg width="16" height="16" class="fillbuttonwhite" viewBox="0 0 16 16">
					<path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"></path>
				</svg>
				Connect to Discord
			</div>`
		}

		if(calendar.discordreminderenabled){
			connectdiscordstatus.classList.remove('display-none')
			connectdiscordstatus2.classList.remove('display-none')
		}else{
			connectdiscordstatus.classList.add('display-none')
			connectdiscordstatus2.classList.add('display-none')
		}

		connectdiscordstatus.innerHTML = discordtext
		connectdiscordstatus2.innerHTML = discordtext


		//apple 
		let connectapple = getElement('connectapple')
		let disconnectapple = getElement('disconnectapple')
		disconnectapple.classList.add('display-none')
		connectapple.classList.add('display-none')
		if(clientinfo.appleid){
			disconnectapple.classList.remove('display-none')
		}else{
			connectapple.classList.remove('display-none')
		}

		let appleloginmethod = getElement('appleloginmethod')
		if(window.AppleID){
			appleloginmethod.classList.remove('display-none')
		}else{
			appleloginmethod.classList.add('display-none')
		}

		let appleemail = getElement('appleemail')
		appleemail.classList.add('display-none')
		if(clientinfo.appleid){
			appleemail.classList.remove('display-none')
		}
		appleemail.innerHTML = clientinfo.apple.email || 'Could not load email'


		//task suggestions
		let tasksuggestionscheckbox = getElement('tasksuggestionscheckbox')
		tasksuggestionscheckbox.checked = calendar.settings.gettasksuggestions
	}


	//focus
	updateFocus() {
		let currentdate = new Date()

		let focustime = getElement('focustime')
		focustime.innerHTML = getHMText(currentdate.getHours() * 60 + currentdate.getMinutes())

		let focusdate = getElement('focusdate')
		focusdate.innerHTML = `${getShortDMDText(currentdate)}`


		let currentevents = getevents(currentdate, currentdate).filter(d => !Calendar.Event.isAllDay(d)).sort((h, j) => {
			let tempstartdate1 = new Date(h.end.year, h.end.month, h.end.day, 0, h.end.minute)
			let tempstartdate2 = new Date(j.end.year, j.end.month, j.end.day, 0, j.end.minute)
			return (tempstartdate1.getTime() - tempstartdate2.getTime())
		})

		let output = []
		if (currentevents.length > 0) {
			let tempoutput = []
			for (let tempitem of currentevents.slice(0, 1)) {

				let enddate = new Date(tempitem.end.year, tempitem.end.month, tempitem.end.day, 0, tempitem.end.minute)
				let difference = Math.floor((currentdate.getTime() - enddate.getTime()) / 60000)

				tempoutput.push(`
				<div class="display-flex flex-column flex-wrap-wrap">		
					<div class="text-24px text-bold text-center text-primary overflow-hidden break-word">${Calendar.Event.getTitle(tempitem)}</div>
					<div class="text-24px text-center text-quaternary nowrap">Ends at ${getHMText(enddate.getHours() * 60 + enddate.getMinutes())} (${getDHMText(Math.abs(difference))} left)</div>
				</div>`)
			}
			output.push(`
			<div class="gap-12px border-box display-flex flex-column">
				<div class="text-24px text-center text-primary">Now</div>
				<div class="horizontalbar width-full"></div>
				${tempoutput.join('')}
			</div>`)
		}

		let nextdate = new Date(currentdate)
		nextdate.setHours(0, 0, 0, 0)
		nextdate.setDate(nextdate.getDate() + 1)
		let nextevents = getevents(currentdate, nextdate).filter(d => !Calendar.Event.isAllDay(d) && new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute).getTime() > currentdate.getTime()).sort((h, j) => {
			let tempstartdate1 = new Date(h.start.year, h.start.month, h.start.day, 0, h.start.minute)
			let tempstartdate2 = new Date(j.start.year, j.start.month, j.start.day, 0, j.start.minute)
			return (tempstartdate1.getTime() - tempstartdate2.getTime())
		})

		if (nextevents.length > 0 && currentevents.length == 0) {
			let tempoutput = []
			for (let tempitem of nextevents.slice(0, 1)) {

				let startdate = new Date(tempitem.start.year, tempitem.start.month, tempitem.start.day, 0, tempitem.start.minute)
				let difference = Math.floor((currentdate.getTime() - startdate.getTime()) / 60000)

				tempoutput.push(`
				<div class="display-flex flex-column">		
					<div class="text-24px text-center text-bold text-primary text-bold overflow-hidden break-word">${Calendar.Event.getTitle(tempitem)}</div>
					<div class="text-24px text-center text-quaternary nowrap">Starts at ${getHMText(startdate.getHours() * 60 + startdate.getMinutes())} (${getFullRelativeDHMText(difference)})</div>
				</div>`)
			}
			output.push(`
			<div class="border-box display-flex gap-12px flex-column">
				<div class="text-24px text-center text-primary">Up next</div>
				<div class="horizontalbar width-full"></div>
				${tempoutput.join('')}
			</div>`)
		}

		if (output.length == 0) {
			output.push(`
			<div class="width-full gap-12px border-box display-flex flex-column">
				<div class="text-24px text-center text-primary">All done</div>
				<div class="horizontalbar width-full"></div>
				<div class="text-24px text-quaternary text-center">No more events today</div>
			</div>`)
		}


		let focusprogress = getElement('focusprogress')
		focusprogress.innerHTML = output.join('')

	}

}


//storage
function setStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

function getStorage(key) {
	return JSON.parse(localStorage.getItem(key))
}

//history
function undohistory() {
	if (historyindex > 0) {
		historyindex--
	}
}
function redohistory() {
	if (historyindex < historydata.length - 1) {
		historyindex++
	}
}
function getHistory() {
	return JSON.parse(historydata[historyindex])
}
function setHistory(json) {
	if (historyindex < historydata.length - 1) {
		historydata = historydata.slice(0, historyindex + 1)
	}
	historydata.push(json)
	historyindex = historydata.length - 1
}


//mobile device
let mobilescreen = false
if ('matchMedia' in window) {
	let smallscreen = window.matchMedia('(max-width: 600px)')
	if (smallscreen.matches) {
		mobilescreen = true
	}

	smallscreen.addEventListener('change', changedevicescreen)
}

function changedevicescreen(event){
	if(event.matches){
		smallscreen = true

		if (calendarmode == 1) {
			calendarmode = 0
		}
		if(calendartabs.includes(0) && calendartabs.includes(1)){
			calendartabs = [1]
		}
	}else{
		smallscreen = false

		if(calendartabs.includes(0) || calendartabs.includes(1)){
			calendartabs = [0, 1]
		}
	}
	calendar.updateTabs()
}

//remove hover for mobile
if (mobilescreen) {
	try{
		Array.from(document.styleSheets).forEach(sheet => {
			if (sheet.href && new URL(sheet.href).origin !== window.location.origin) {
				return
			}
		Array.from(sheet.cssRules || []).forEach(rule => {
				if (rule.selectorText && rule.selectorText.includes(':hover')) {
					const newSelector = rule.selectorText.replace(/:hover/g, ':active');
					const newRule = `${newSelector} { ${rule.style.cssText} }`;
					sheet.insertRule(newRule, sheet.cssRules.length);
					sheet.deleteRule(Array.from(sheet.cssRules).indexOf(rule));
				}
			})
		})
	}catch(err){
	}
}
  

//initialize
let historydata = []
let historyindex = 0
let selectedeventid, selectedeventinitialy, selectedeventdate, selectedeventdatetime, selectedeventfromdate, editeventid;
let selectedeventbyday = []
let autoscheduleeventid;
let copiedevent;
let editinfo = false;
let movingevent = false;
let selectededittodoid;
let autoscheduleeventslist = []
let oldautoscheduleeventslist = []
let newautoscheduleeventslist = []

//new calendar
let calendarmode = 1
let calendarmodestorage = getStorage('calendarmode')
if (calendarmodestorage != null) {
	calendarmode = calendarmodestorage
}
if(mobilescreen){
	if (calendarmode == 1) {
		calendarmode = 0
	}
}

let calendartabs = [0, 1]
if(mobilescreen){
	calendartabs = [1]
}


let calendaryear = new Date().getFullYear()
let calendarmonth = new Date().getMonth()
let calendarday = new Date().getDate()

let calendar = new Calendar()


//load data
getclient()


//timing functions
function beziercurve(t){
	return t * t * (3 - 2 * t)
}

function easeoutcubic(t) {
	return 1 - Math.pow(1 - t, 3)
}


//scroll calendar Y
let scrollYAnimationFrameId;
function scrollcalendarY(targetminute) {
	cancelAnimationFrame(scrollYAnimationFrameId)

	let barcolumncontainer = getElement('barcolumncontainer')
	let target = targetminute - 60*2

	let duration = 500
	let start = barcolumncontainer.scrollTop
	let end = target
	let change = end - start
	let increment = 20
	let currentTime = 0

	function animateScroll() {
		function easeinoutquad(t, b, c, d) {
			t /= d / 2
			if (t < 1) return c / 2 * t * t + b
			t--
			return -c / 2 * (t * (t - 2) - 1) + b
		}

		currentTime += increment
		const val = easeinoutquad(currentTime, start, change, duration)
		barcolumncontainer.scrollTo(0, val)
		if (currentTime < duration) {
			scrollYAnimationFrameId = requestAnimationFrame(animateScroll, increment)
		}
	}
	scrollYAnimationFrameId = requestAnimationFrame(animateScroll, increment)
}

//scroll calendar X
let scrollXAnimationFrameId;
function scrollcalendarX(targetdate) {
	cancelAnimationFrame(scrollXAnimationFrameId)

	let barcolumngroup = getElement('barcolumngroup')

	let currentdayindex = Math.round(barcolumngroup.scrollLeft / barcolumngroup.offsetWidth * 7)
	let currentdaydate = calendar.getDate()
	currentdaydate.setDate(currentdaydate.getDate() - currentdaydate.getDay() - 7 + currentdayindex)

	let targetdaydate = new Date(targetdate.getFullYear(), targetdate.getMonth(), targetdate.getDate())

	let daydifference = Math.floor((targetdaydate.getTime() - currentdaydate.getTime()) / 86400000)

	let target = round(barcolumngroup.scrollLeft + (barcolumngroup.offsetWidth / 7 * (daydifference)) - barcolumngroup.offsetWidth / 2 + (0.5 * barcolumngroup.offsetWidth / 7), barcolumngroup.offsetWidth / 7)

	let duration = 500
	let start = barcolumngroup.scrollLeft
	let end = target
	let change = end - start
	let increment = 20
	let currentTime = 0

	function animateScroll() {
		currentTime += increment;
		let val = easeinoutquad(currentTime, start, change, duration);

		barcolumngroup.style.scrollSnapType = 'none'
		barcolumngroup.scrollTo(val, 0)

		if (currentTime < duration) {
			scrollXAnimationFrameId = requestAnimationFrame(animateScroll, increment);
		} else {
			barcolumngroup.style.scrollSnapType = 'x mandatory';
		}
	}
	scrollXAnimationFrameId = requestAnimationFrame(animateScroll, increment);

}



//scroll todo Y
let scrolltodoYAnimationFrameId;
function scrolltodoY(targetminute) {
	cancelAnimationFrame(scrolltodoYAnimationFrameId)

	let todocontainer;
	if(!calendar.onboarding.addtask){
		todocontainer = getElement('onboardingaddtasktodolist')
	}else if(isprompttodotoday){
		todocontainer = getElement('prompttodotodayaddtasktodolist')
	}else{
		todocontainer = getElement('todocontainer')
	}

	let target = targetminute - 60*2

	let duration = 500
	let start = todocontainer.scrollTop
	let end = target
	let change = end - start
	let increment = 20
	let currentTime = 0

	function animateScroll() {
		function easeinoutquad(t, b, c, d) {
			t /= d / 2
			if (t < 1) return c / 2 * t * t + b
			t--
			return -c / 2 * (t * (t - 2) - 1) + b
		}

		currentTime += increment
		const val = easeinoutquad(currentTime, start, change, duration)
		todocontainer.scrollTo(0, val)
		if (currentTime < duration) {
			scrolltodoYAnimationFrameId = requestAnimationFrame(animateScroll, increment)
		}
	}
	scrolltodoYAnimationFrameId = requestAnimationFrame(animateScroll, increment)
}


//load data
let clientinfo = {}

function isEmail(str) {
	let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return pattern.test(str)
}

function getUserEmail(){
	return clientinfo?.google_email || clientinfo?.apple?.email || clientinfo?.username
}

function getUserName(){
	return (clientinfo?.google?.firstname || clientinfo?.google?.name || clientinfo?.google_email) || clientinfo?.apple?.email || clientinfo?.username
}

let isgettingclientdata = false;

async function getclientdata() {
	isgettingclientdata = true
	try{
		const response = await fetch('/getclientdata', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		}).catch(e => e)
		if (response.status == 200) {
			const data = await response.json()
			const userdata = data.data

			//load data
			Object.assign(calendar, userdata)

			//default data
			if (!calendar.calendars.find(d => d.isprimary)) {
				let tempcalendar = new Calendar.Calendar('Primary', '', false, null, true)
				calendar.calendars.unshift(tempcalendar)
			}

			run()
		} else if (response.status == 401) {
			showloginpopup()
		} else {
			return setTimeout(function () {
				getclientdata()
			}, 3000)
		}
	}catch(error){
		console.log(error)
	}

	isgettingclientdata = false
}

async function getclientinfo() {
	const response2 = await fetch('/getclientinfo', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			timezoneoffset: new Date().getTimezoneOffset()
		})
	}).catch(e => e)
	if (response2.status == 200) {
		const data = await response2.json()
		clientinfo = data.data

		if (clientinfo.google_email == 'james.tsaggaris@gmail.com') {
			setStorage('noanalytics', true)
		}
	} else if (response2.status == 401) {
		showloginpopup()
	} else {
		return setTimeout(function () {
			getclientinfo()
		}, 3000)
	}
}

async function getclient() {
	await getclientinfo()
	await getclientdata()
	await getextraclientinfo()
}

async function getextraclientinfo(){
	if(!clientinfo.discord.id) return
	
	const response = await fetch('/getdiscordusername', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id: clientinfo.discord.id })
	}).catch(e => e)
	if (response.status == 200) {
		const data = await response.json()
		if(data.data){
			clientinfo.discord.username = data.data
		}
	}
}


//save data
let lastbodydata;
let lastsavedate = 0;
async function setclientdata() {
	let tempbodydata = calendar.getChangedJSON()

	let currenttime = Date.now()
	if (lastbodydata != tempbodydata && !movingevent && !isautoscheduling) {
		updatestatus(1)

		if (currenttime - lastsavedate > 3000) {
			const response = await fetch('/setclientdata', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					calendardata: JSON.parse(calendar.getJSON()),
				})
			}).catch(e => e)

			if (response.status == 200) {
				lastbodydata = tempbodydata

				updatestatus(0)
				hideloginpopup()
			}else if (response.status == 401) {
				updatestatus(2)

				showloginpopup()
				return
			} else {
				updatestatus(2)
			}

			lastsavedate = Date.now()
		}

	} else {
		updatestatus(0)
	}

	setTimeout(function () {
		setclientdata()
	}, 1000)
}

//update time
let lastupdateminute = new Date().getMinutes()
let lastupdatedate = new Date().getDate()
let needtoautoschedule = false
function updatetime() {
	let currentdate = new Date()

	if (currentdate.getHours() * 60 + currentdate.getMinutes() != lastupdateminute) {
		calendar.updateEventTime()
		calendar.updateSummary()
		if(!selectededittodoid){
			calendar.updateTodo()
		}
		calendar.updateFocus()

		lastupdateminute = currentdate.getHours() * 60 + currentdate.getMinutes()

		needtoautoschedule = true
	}

	if (currentdate.getDate() != lastupdatedate) {
		calendaryear = currentdate.getFullYear()
		calendarmonth = currentdate.getMonth()
		calendarday = currentdate.getDate()

		let barcolumncontainer = getElement('barcolumncontainer')
		let target = currentdate.getHours() * 60 + currentdate.getMinutes() - 60*2
		barcolumncontainer.scrollTo(0, target)


		calendar.updateTabs()
		calendar.updateFocus()
		resetcreatetodo()
		updatecreatetodo()

		lastupdatedate = currentdate.getDate()
	}

	let createddate = new Date(clientinfo.createddate)
	let lastprompttodotodaydate = new Date(calendar.lastprompttodotodaydate)
	let sleependdate = new Date(currentdate)
	sleependdate.setHours(0, calendar.settings.sleep.endminute, 0, 0)
	let sleependdatelater = new Date(sleependdate)
	sleependdatelater.setHours(sleependdatelater.getHours() + 3) //only prompt within first 3 hours after wake up

	if(Math.floor(currentdate.getTime()/86400000) > Math.floor(createddate.getTime()/86400000) && lastprompttodotodaydate.getTime() < sleependdate.getTime() && currentdate.getTime() >= sleependdate.getTime() && currentdate.getTime() < sleependdatelater.getTime()){
		if(document.visibilityState == 'visible'){
			prompttodotoday()
		}
	}else{
		closeprompttodotoday()
	}
}

let lastgettasksuggestionsdate;
async function gettasksuggestions(inputitem){
	function getcalculatedweight(tempitem){
		let currentdate = new Date()
		let timedifference = new Date(tempitem.endbefore.year, tempitem.endbefore.month, tempitem.endbefore.day, 0, tempitem.endbefore.minute).getTime() - currentdate.getTime()
		return currentdate.getTime() * (tempitem.priority + 1) / Math.max(timedifference, 1) * tempitem.duration
	}

	let suggesttodo;
	if(inputitem){
		suggesttodo = inputitem
	}else{
		//select eligible todos to get suggestion

		let suggestabletodos = calendar.todos.filter(d => 
			calendar.settings.gettasksuggestions == true
			&&
			!d.completed && d.duration >= 60 && d.title.length > 3
			&&
			!d.gotsubtasksuggestions && d.subtasksuggestions.length == 0 
			&&
			new Date(d.endbefore.year, d.endbefore.month, d.endbefore.day, 0, d.endbefore.minute) - Date.now() < 86400*1000*7
			&&
			!Calendar.Todo.isSubtask(d)
			&&
			d.repeat.frequency == null && d.repeat.interval == null
		).sort((a, b) => getcalculatedweight(b) - getcalculatedweight(a))
		if(suggestabletodos.length == 0) return

		suggesttodo = suggestabletodos[0]
	}

	try{
		const response = await fetch('/gettasksuggestions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				item: suggesttodo
			})
		})
		if(response.status == 200){
			let data = await response.json()

			//parse and import subtasks
			
			let rawtext = data.data.split(/,|\n/g).map(d => d.trim()).filter(d => d)

			let newitems = []
			for(let temptext of rawtext){
				let myduration;
				
				let duration = getDuration(temptext)
				if(duration.value != null){
					myduration = duration.value
					temptext = temptext.replace(duration.match, '').replace(/^(\d+\.|-)/, '').trim()
				}

				if(myduration == null){
					myduration = 60
				}

				if(temptext){
					newitems.push({ title: temptext, duration: myduration, id: generateID() })
				}
			}

			suggesttodo.subtasksuggestions = newitems
			suggesttodo.gotsubtasksuggestions = true

			calendar.updateTodo()
		}
	}catch(err){
		console.log(err)
	}
}


function run() {
	//ONCE

	//theme
	updatetheme()

	//calendar
	calendar.updateTabs()
	calendar.updateHistory()

	//input pickers
	updatetimepicker()
	updatedurationpicker()
	updatetodotimepickeronce()
	updatecreatetodotimepickeronce()

	//check for onboarding
	updateonboardingscreen()

	//avatar and userinfo
	updateAvatar()
	updateuserinfo()

	//set initial save data
	lastbodydata = calendar.getChangedJSON()
	
	//hide loading screen
	hideloadingscreen()

	//scroll Y
	let currentdate = new Date()
	scrollcalendarY(currentdate.getHours() * 60 + currentdate.getMinutes())


	//LOOP

	setclientdata()


	//tick
	setInterval(async function(){
		if (document.visibilityState === 'visible') {
			if (needtoautoschedule) {
				needtoautoschedule = false
				startAutoSchedule({scheduletodos: []})
			}
		}

		if(document.visibilityState === 'visible'){
			updatetime()
		}

		if (document.visibilityState === 'visible') {
			updateinteractivetour()
		}
	}, 100)

	lastgettasksuggestionsdate = Date.now()
	setInterval(async function(){
		if(document.visibilityState === 'visible' && Date.now() - lastgettasksuggestionsdate > 10000){
			lastgettasksuggestionsdate = Date.now()
			gettasksuggestions()
		}
	}, 1000)


	//tick
	async function runtick(){
		let lasttriedsyncgoogleclassroomdate = Date.now()
		let lasttriedsyncgooglecalendardate = Date.now()
		let lastgetclientdatadate = Date.now()

		getclientgooglecalendar()
		getclientgoogleclassroom()

		setInterval(async function () {
			//get client data
			if (document.visibilityState === 'visible' && Date.now() - lastgetclientdatadate > 1000*10) {
				lastgetclientdatadate = Date.now()
				getclientdata()
			}

			//get google calendar
			if (!isgettingclientdata && !isautoscheduling && document.visibilityState === 'visible' && Date.now() - calendar.lastsyncedgooglecalendardate > 60000 && issettingclientgooglecalendar == false && Date.now() - lasttriedsyncgooglecalendardate > 60000) {
				lasttriedsyncgooglecalendardate = Date.now()
				getclientgooglecalendar()
			}

			//get google classroom
			if (document.visibilityState === 'visible' && Date.now() - calendar.lastsyncedgoogleclassroomdate > 60000 && Date.now() - lasttriedsyncgoogleclassroomdate > 60000) {
				lasttriedsyncgoogleclassroomdate = Date.now()
				getclientgoogleclassroom()
			}
		}, 100)
	}
	runtick()


	setTimeout(function(){
		needtoautoschedule = true
	}, 3000)


	async function getclientdata() {
		isgettingclientdata = true

		try{
			const response = await fetch('/getclientdata', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					lastmodified: calendar.lastmodified
				})
			})
			if (response.status == 200) {
				const data = await response.json()

				if(!data.nochange){
					const userdata = data.data
					Object.assign(calendar, userdata)

					calendar.updateEvents()
					calendar.updateTodo()
					calendar.updateSettings()
					calendar.updateHistory(false, false, false)
				}
			}
		}catch(error){
			console.log(error)
		}

		isgettingclientdata = false
	}


	//push notif
	window.addEventListener('mousedown', clickforpushnotif, false)
	window.addEventListener('touchstart', clickforpushnotif, false)

	function clickforpushnotif(event){
		if (calendar.pushSubscriptionEnabled) {
			enablePushNotifs()
		} else {
			removePushNotifs()
		}
		
		window.removeEventListener('mousedown', clickforpushnotif, false)
		window.removeEventListener('touchstart', clickforpushnotif, false)
	}

}

//update status indicator
let savestatus;
function updatestatus(newstatus) {
	if (newstatus == savestatus) return
	savestatus = newstatus

	let statusdisplay = getElement('statusdisplay')
	if (savestatus == 0) {
		//saved
		statusdisplay.classList.add('display-none')
		statusdisplay.classList.remove('loaderred')
	} else {
		statusdisplay.classList.remove('display-none')
		if (savestatus == 1) {
			//saving
		} else if (savestatus == 2) {
			//error
			statusdisplay.classList.add('loaderred')
		}
	}
}



function clicktab(index) {
	let currentdate = new Date()

	selectedeventid = null

	let gototoday;
	if (index.includes(0) && !calendartabs.includes(0)) {
		gototoday = true
	}

	calendartabs = index

	if (gototoday) {
		calendaryear = currentdate.getFullYear()
		calendarmonth = currentdate.getMonth()
		calendarday = currentdate.getDate()
	}

	calendar.updateTabs()

	if (gototoday) {
		let barcolumncontainer = getElement('barcolumncontainer')

		let target = currentdate.getHours() * 60 + currentdate.getMinutes() - 60*2
		barcolumncontainer.scrollTo(0, target)
	}
}


function todaycalendar() {
	let tempdate = new Date()
	calendaryear = tempdate.getFullYear()
	calendarmonth = tempdate.getMonth()
	calendarday = tempdate.getDate()

	selectedeventid = null

	calendar.updateCalendar()

	let currentdate = new Date()
	scrollcalendarY(currentdate.getHours() * 60 + currentdate.getMinutes())
}

function prevcalendar() {
	if (calendarmode == 0) {
		let tempdate = new Date(calendaryear, calendarmonth, calendarday - 1)
		calendaryear = tempdate.getFullYear()
		calendarmonth = tempdate.getMonth()
		calendarday = tempdate.getDate()

		selectedeventid = null

		calendar.updateCalendar()
	} else if (calendarmode == 1) {
		let tempdate = new Date(calendaryear, calendarmonth, calendarday - 7)
		calendaryear = tempdate.getFullYear()
		calendarmonth = tempdate.getMonth()
		calendarday = tempdate.getDate()

		selectedeventid = null

		calendar.updateCalendar()
	} else if (calendarmode == 2) {
		let tempdate = new Date(calendaryear, calendarmonth - 1, calendarday)
		calendaryear = tempdate.getFullYear()
		calendarmonth = tempdate.getMonth()
		calendarday = tempdate.getDate()

		selectedeventid = null

		calendar.updateCalendar()
	}
}

function nextcalendar() {
	if (calendarmode == 0) {
		let tempdate = new Date(calendaryear, calendarmonth, calendarday + 1)
		calendaryear = tempdate.getFullYear()
		calendarmonth = tempdate.getMonth()
		calendarday = tempdate.getDate()

		selectedeventid = null

		calendar.updateCalendar()
	} else if (calendarmode == 1) {
		let tempdate = new Date(calendaryear, calendarmonth, calendarday + 7)
		calendaryear = tempdate.getFullYear()
		calendarmonth = tempdate.getMonth()
		calendarday = tempdate.getDate()

		selectedeventid = null

		calendar.updateCalendar()
	} else if (calendarmode == 2) {
		let tempdate = new Date(calendaryear, calendarmonth + 1, calendarday)
		calendaryear = tempdate.getFullYear()
		calendarmonth = tempdate.getMonth()
		calendarday = tempdate.getDate()

		selectedeventid = null

		calendar.updateCalendar()
	}
}



//scroll in calendar horizontally or vertically
function scrollincalendar(event) {
	if (calendarmode == 0) {
		let barcolumngroup = getElement("barcolumngroup")

		const itemwidth = barcolumngroup.offsetWidth
		const scrollleft = barcolumngroup.scrollLeft


		if (scrollleft >= itemwidth * 2) {
			calendarday++
			calendar.updateCalendar()
		}
		if (scrollleft <= 0) {
			calendarday--
			calendar.updateCalendar()
		}

		//scroll
		let topbarchildren = getElement('topbarchildren')
		topbarchildren.scrollLeft = barcolumngroup.scrollLeft
	} else if (calendarmode == 1) {
		let barcolumngroup = getElement("barcolumngroup")

		const itemwidth = barcolumngroup.offsetWidth
		const scrollleft = barcolumngroup.scrollLeft

		if (scrollleft >= itemwidth * 2) {
			calendarday += 7
			calendar.updateCalendar()
		}
		if (scrollleft <= 0) {
			calendarday -= 7
			calendar.updateCalendar()
		}

		//scroll
		let topbarchildren = getElement('topbarchildren')
		topbarchildren.scrollLeft = barcolumngroup.scrollLeft
	} else if (calendarmode == 2) {
		let monthscreens = getElement('monthscreens')

		let scrolltop = monthscreens.scrollTop
		let itemheight = monthscreens.offsetHeight

		//find scroll
		let allchildren = []
		for (let child of Array.from(monthscreens.children)) {
			for (let childchild of Array.from(child.children)) {
				for (let childchildchild of Array.from(childchild.children)) {
					allchildren.push(childchildchild)
				}
			}
		}

		let previouschild = allchildren.find(f => {
			let childdate = new Date(+f.dataset.timestamp)
			let wanteddate = new Date(calendar.getDate())
			wanteddate.setMonth(wanteddate.getMonth() - 1)
			wanteddate.setDate(1)
			return (wanteddate.getMonth() == childdate.getMonth() && wanteddate.getDate() == childdate.getDate() && wanteddate.getFullYear() == childdate.getFullYear())
		})

		if (previouschild) {
			let previoustop = previouschild.offsetTop

			if (scrolltop <= previoustop) {
				calendarmonth--
				calendar.updateCalendar()
				return
			}
		}

		let nextchild = allchildren.find(f => {
			let childdate = new Date(+f.dataset.timestamp)
			let wanteddate = new Date(calendar.getDate())
			wanteddate.setMonth(wanteddate.getMonth() + 1)
			wanteddate.setDate(1)
			return (wanteddate.getMonth() == childdate.getMonth() && wanteddate.getDate() == childdate.getDate() && wanteddate.getFullYear() == childdate.getFullYear())
		})
		if (nextchild) {
			let nexttop = nextchild.offsetTop

			if (scrolltop >= nexttop) {
				calendarmonth++
				calendar.updateCalendar()
				return
			}
		}

	}
}



function setcalendarmode(mode) {
	selectedeventid = null
	calendarmode = mode
	calendar.updateCalendar()
}

function clickweek(timestamp) {
	let tempdate = new Date(timestamp)

	selectedeventid = null

	calendarmode = 0
	calendaryear = tempdate.getFullYear()
	calendarmonth = tempdate.getMonth()
	calendarday = tempdate.getDate()

	calendar.updateCalendar()

	let currentdate = new Date()
	scrollcalendarY(currentdate.getHours() * 60 + currentdate.getMinutes())
}

function clickmonthdate(event, timestamp) {
	event.stopPropagation()
	event.preventDefault()

	let tempdate = new Date(timestamp)

	selectedeventid = null

	calendarmode = 0
	calendaryear = tempdate.getFullYear()
	calendarmonth = tempdate.getMonth()
	calendarday = tempdate.getDate()

	calendar.updateCalendar()

	let currentdate = new Date()
	scrollcalendarY(currentdate.getHours() * 60 + currentdate.getMinutes())
}



//PROMPT TODO TODAY
let isprompttodotoday = false
let prompttodotodayadded = []
function prompttodotoday(){
	if(isprompttodotoday) return
	
	isprompttodotoday = true

	let currentdate = new Date()
	let startdate = new Date(currentdate)
	startdate.setHours(0, 0, 0, 0)
	let enddate = new Date(startdate)
	enddate.setDate(enddate.getDate() + 1)
	let todosduetoday = [...gettodos(null, enddate), ...calendar.events.filter(d => d.type == 1 && new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute).getTime() < enddate.getTime())].filter(d => !d.completed)

	prompttodotodayadded = todosduetoday.map(d => d.id)
	
	updateprompttodotoday()

	let prompttodotodaywrap = getElement('prompttodotodaywrap')
	prompttodotodaywrap.classList.remove('hiddenfadeslow')
}

function hidepropmpttodotoday(){
	let prompttodotodaywrap = getElement('prompttodotodaywrap')
	prompttodotodaywrap.classList.add('hiddenfadeslow')

	let prompttodotodayaddtasktodolist = getElement('prompttodotodayaddtasktodolist')
	prompttodotodayaddtasktodolist.innerHTML = ''
}

function closeprompttodotoday(){
	isprompttodotoday = false

	hidepropmpttodotoday()
}

function setprompttodotodaydate(){
	calendar.lastprompttodotodaydate = Date.now()
}

function clickcloseprompttodotoday(){
	setprompttodotodaydate()
	closeprompttodotoday()
}
function clickconfirmprompttodotoday(){
	let length = [...calendar.todos, ...calendar.events].filter(d => prompttodotodayadded.find(g => g == d.id)).length
	if(length >= 3){
		setprompttodotodaydate()
		closeprompttodotoday()
	}
}

function updateprompttodotoday(){
	if(!isprompttodotoday) {
		return
	}
	
	let output = []
	let tempdata = [...sortstartdate(calendar.events.filter(d => prompttodotodayadded.find(g => g == d.id))), ...sortduedate(calendar.todos.filter(d => prompttodotodayadded.find(g => g == d.id)))].filter(d => !Calendar.Todo.isSubtask(d))
	for(let item of tempdata){
		output.push(gettododata(item))
	}

	let prompttodotodayaddtasktodolist = getElement('prompttodotodayaddtasktodolist')
	prompttodotodayaddtasktodolist.innerHTML = output.join('')

	let prompttodotodaysubmit = getElement('prompttodotodaysubmit')
	if(output.length < 3){
		prompttodotodaysubmit.classList.add('greyedoutevent')
	}else{
		prompttodotodaysubmit.classList.remove('greyedoutevent')
	}
}


//ONBOARDING

let onboardingaddtasktodolist = []
let isonboardingaddtask = false

function updateonboardingscreen(){
	let onboardingscreen = getElement('onboardingscreen')

	let currentonboarding;
	if(!calendar.onboarding.start){
		currentonboarding = 'start'
	}else if(!calendar.onboarding.quickguide){
		currentonboarding = 'quickguide'
	}else if(!calendar.onboarding.connectcalendars){
		currentonboarding = 'connectcalendars'
	}else if(!calendar.onboarding.connecttodolists){
		currentonboarding = 'connecttodolists'
	}else if(!calendar.onboarding.eventreminders){
		currentonboarding = 'eventreminders'
	}else if(!calendar.onboarding.sleeptime){
		currentonboarding = 'sleeptime'
	}else if(!calendar.onboarding.addtask){
		currentonboarding = 'addtask'
	}

	if(currentonboarding){
		if(onboardingscreen.classList.contains('hiddenfadeslow')){
			onboardingscreen.classList.remove('hiddenfadeslow')
		}
	}else{
		if(!onboardingscreen.classList.contains('hiddenfadeslow')){
			onboardingscreen.classList.add('hiddenfadeslow')
		}
	}


	//update transition pages

	let onboardingPages = getElement('onboardingpages')
	let childrenArray = Array.from(onboardingPages.children)

	let currentindex = (currentonboarding && childrenArray.findIndex(d => d.id === `onboarding${currentonboarding}`)) || 0

	for (let [key, value] of Object.entries(calendar.onboarding)) {
		let tempindex = childrenArray.findIndex(d => d.id === `onboarding${key}`)
		let tempdiv = getElement(`onboarding${key}`)

		if(key == currentonboarding){
			tempdiv.classList.add('slidetransform')

			tempdiv.classList.remove('hiddenslideleftfull')
			tempdiv.classList.remove('hiddensliderightfull')

			tempdiv.classList.remove('hiddenfadeslide')
		}else{
			tempdiv.classList.add('hiddenfadeslide')

			if(Math.abs(tempindex - currentindex) == 1){
				tempdiv.classList.add('slidetransform')
			}else{
				tempdiv.classList.remove('slidetransform')
			}
			if(tempindex > currentindex){
				tempdiv.classList.add('hiddensliderightfull')
			}else if(tempindex < currentindex){
				tempdiv.classList.add('hiddenslideleftfull')
			}
		}

	}



	//individual pages

	getElement('createtodoitemduedate').classList.remove('z-index-10001')
	getElement('createtodoitemduration').classList.remove('z-index-10001')
	getElement('createtodoitempriority').classList.remove('z-index-10001')
	getElement('createtodoitemavailability').classList.remove('z-index-10001')
	getElement('createtodoitemrepeat').classList.remove('z-index-10001')
	getElement('todoitempriority').classList.remove('z-index-10001')
	getElement('todoitemduedate').classList.remove('z-index-10001')
	getElement('todoitemduration').classList.remove('z-index-10001')
	getElement('timepicker').classList.remove('z-index-10001')


	if(currentonboarding == 'addtask'){
		if(!isonboardingaddtask){
			isonboardingaddtask = true

			onboardingaddtasktodolist = []
		}
	}else{
		isonboardingaddtask = false
	}


	if(currentonboarding == 'start'){
		let welcometosmartcalendartext = getElement('welcometosmartcalendartext')
		welcometosmartcalendartext.innerHTML = `Welcome to Smart Calendar${getUserName() ? `, ${cleanInput(getUserName())}` : ''}`
	}else if(currentonboarding == 'connectcalendars'){
		let onboardingconnectcalendarsgooglecalendar = getElement('onboardingconnectcalendarsgooglecalendar')

		let currentdate = new Date()
		let issynced = calendar.settings.issyncingtogooglecalendar && calendar.lastsyncedgooglecalendardate && Math.floor((currentdate.getTime() - calendar.lastsyncedgooglecalendardate) / 60000) <= 1

		onboardingconnectcalendarsgooglecalendar.innerHTML = issynced ? 
			`
			<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilledgreen">
				<g>
				<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1"></path>
				<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1"></path>
				</g>
			</svg>
			<div class="text-14px text-green">Connected</div>` 
			: `<div class="text-14px text-quaternary">Not connected</div>`

		let onboardingconnectcalendarsoutlookcalendar = getElement('onboardingconnectcalendarsoutlookcalendar')
		onboardingconnectcalendarsoutlookcalendar.innerHTML = ``
	}else if(currentonboarding == 'connecttodolists'){
		let onboardingconnecttodolistsgoogleclassroom = getElement('onboardingconnecttodolistsgoogleclassroom')

		let currentdate = new Date()
		let issynced = calendar.settings.issyncingtogoogleclassroom && calendar.lastsyncedgoogleclassroomdate && Math.floor((currentdate.getTime() - calendar.lastsyncedgoogleclassroomdate) / 60000) <= 1

		onboardingconnecttodolistsgoogleclassroom.innerHTML = issynced ? 
			`
			<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline checkboxfilledgreen">
				<g>
				<path d="M128 7.19484C61.2812 7.19484 7.19484 61.2812 7.19484 128C7.19484 194.719 61.2812 248.805 128 248.805C194.719 248.805 248.805 194.719 248.805 128C248.805 61.2812 194.719 7.19484 128 7.19484ZM190.851 66.0048C194.206 65.7071 197.649 66.7098 200.436 69.0426C206.01 73.7082 206.753 81.9906 202.088 87.5645L115.524 190.969C110.264 197.253 100.582 197.253 95.3213 190.969L52.0249 139.266C47.3593 133.693 48.1026 125.41 53.6765 120.745C59.2504 116.079 67.5623 116.822 72.2279 122.396L105.408 162.035L181.885 70.6942C184.217 67.9073 187.495 66.3024 190.851 66.0048Z" fill-rule="nonzero" opacity="1"></path>
				<path d="M128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 0 128 0ZM128 7.75758C194.408 7.75758 248.242 61.5919 248.242 128C248.242 194.408 194.408 248.242 128 248.242C61.5919 248.242 7.75758 194.408 7.75758 128C7.75758 61.5919 61.5919 7.75758 128 7.75758Z" fill-rule="nonzero" opacity="1"></path>
				</g>
			</svg>
			<div class="text-14px text-green">Connected</div>` 
			: `<div class="text-14px text-quaternary">Not connected</div>`
	}else if(currentonboarding == 'sleeptime'){
		getElement('timepicker').classList.add('z-index-10001')

		calendar.updateSettings()
	}else if(currentonboarding == 'addtask'){
		let output = []
		let tempdata = sortduedate(calendar.todos.filter(d => onboardingaddtasktodolist.find(g => g == d.id) && !Calendar.Todo.isSubtask(d)))
		for(let item of tempdata){
			output.push(gettododata(item))
		}

		let onboardingaddtasktodolistdiv = getElement('onboardingaddtasktodolist')
		onboardingaddtasktodolistdiv.innerHTML = output.join('')


		getElement('createtodoitemduedate').classList.add('z-index-10001')
		getElement('createtodoitemduration').classList.add('z-index-10001')
		getElement('createtodoitempriority').classList.add('z-index-10001')
		getElement('createtodoitemavailability').classList.add('z-index-10001')
		getElement('createtodoitemrepeat').classList.add('z-index-10001')
		getElement('todoitempriority').classList.add('z-index-10001')
		getElement('todoitemduedate').classList.add('z-index-10001')
		getElement('todoitemduration').classList.add('z-index-10001')
	}else if(currentonboarding == 'eventreminders'){
		calendar.emailreminderenabled = true
		calendar.pushSubscriptionEnabled = true
		calendar.discordreminderenabled = true
		calendar.iosnotificationenabled = true
		calendar.updateSettings()
	}


}


function continueonboarding(key){
	if(calendar.onboarding[key] != null) calendar.onboarding[key] = true
	updateonboardingscreen()
}
function backonboarding(key){
	if(calendar.onboarding[key] != null) calendar.onboarding[key] = false
	updateonboardingscreen()
}


//ACCOUNT CONNECTIONS

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

async function disconnectdiscord(){
	let discorderrorwrap = getElement('discorderrorwrap')
	discorderrorwrap.classList.add('display-none')

	const response = await fetch('/disconnectdiscord', {
		method: 'POST'
	})

	if (response.status == 200) {
		await getclientinfo()

		calendar.updateSettings()
	} else if (response.status == 401) {
		const data = await response.json()
		discorderrorwrap.innerHTML = data.error
		discorderrorwrap.classList.remove('display-none')
	}
}

async function logindiscord(options){
	const response = await fetch('/auth/discord', { 
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


async function disconnectapple(){
	let appleerrorwrap = getElement('appleerrorwrap')
	appleerrorwrap.classList.add('display-none')

	const response = await fetch('/disconnectapple', {
		method: 'POST'
	})

	if (response.status == 200) {
		await getclientinfo()

		calendar.updateSettings()
	} else if (response.status == 401) {
		const data = await response.json()
		appleerrorwrap.innerHTML = data.error
		appleerrorwrap.classList.remove('display-none')
	}
}



async function connectapple(){
	if(window.AppleID){
		AppleID.auth.init({
			clientId: 'us.smartcalendar.web',
			scope: 'email name',
			redirectURI: 'https://smartcalendar.us/auth/apple/callback'
		})

		AppleID.auth.signIn()
	}
}

//INTERACTIVE TOUR
function updateinteractivetour() {
	function movepopup(tempdiv, top, left) {
		const scrollLeft = document.documentElement.scrollLeft || window.pageXOffset
		const scrollTop = document.documentElement.scrollTop || window.pageYOffset

		if (!tempdiv) return
		tempdiv.style.left = fixleft(left + scrollLeft, tempdiv) + 'px'
		tempdiv.style.top = fixtop(top + scrollTop, tempdiv) + 'px'
	}

	function movebeacon(tempdiv, top, left) {
		const scrollLeft = document.documentElement.scrollLeft || window.pageXOffset
		const scrollTop = document.documentElement.scrollTop || window.pageYOffset

		if (!tempdiv) return
		tempdiv.style.left = (left + scrollLeft) + 'px'
		tempdiv.style.top = (top + scrollTop) + 'px'
	}

	function showbeacon(tempdiv) {
		if (!tempdiv) return
		tempdiv.classList.remove('display-none')
	}
	function hidebeacon(tempdiv) {
		if (!tempdiv) return
		tempdiv.classList.add('display-none')
	}

	function showpopup(tempdiv) {
		if (!tempdiv) return
		tempdiv.classList.remove('hiddenpopup')
	}
	function hidepopup(tempdiv) {
		if (!tempdiv) return
		tempdiv.classList.add('hiddenpopup')
	}

	function isviewable(element) {
		if (!element) return false

		let style = window.getComputedStyle(element)

		if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
			return false
		}

		let positionedAncestor = element.offsetParent
		if (positionedAncestor) {
			let ancestorStyle = window.getComputedStyle(positionedAncestor)
			if (ancestorStyle.display === 'none' || ancestorStyle.visibility === 'hidden' || ancestorStyle.opacity === '0') {
				return false
			}
		} else return false

		if(element.offsetHeight == 0 && element.offsetWidth == 0) return false

		return true
	}

	for (let [key, value] of Object.entries(calendar.interactivetour)) {
		let mybeacon = getElement(`interactivetourbeacon${key}`)
		let mypopup = getElement(`interactivetourpopup${key}`)

		if (key == 'clickaddtask') {

			let tourbutton = getElement('todoinputtitle')
			if (isviewable(tourbutton)) {
				let rect = tourbutton.getBoundingClientRect()

				if (value == false && key != selectedinteractivetourpopupindex) {
					showbeacon(mybeacon)
					movebeacon(mybeacon, rect.top, rect.right)
				} else {
					hidebeacon(mybeacon)
				}

				if (key == selectedinteractivetourpopupindex) {
					showpopup(mypopup)
				} else {
					hidepopup(mypopup)
				}

				movepopup(mypopup, rect.top + rect.height, rect.left + rect.width / 2 - mypopup.offsetWidth / 2)
			} else {
				hidebeacon(mybeacon)
				hidepopup(mypopup)
			}

		}  else if (key == 'clickscheduleoncalendar') {

			let tourbutton = getElement('scheduleoncalendar')
			if (isviewable(tourbutton)) {
				let rect = tourbutton.getBoundingClientRect()

				if (value == false && key != selectedinteractivetourpopupindex) {
					showbeacon(mybeacon)
					movebeacon(mybeacon, rect.top, rect.right)
				} else {
					hidebeacon(mybeacon)
				}

				if (key == selectedinteractivetourpopupindex) {
					showpopup(mypopup)
				} else {
					hidepopup(mypopup)
				}

				movepopup(mypopup, rect.top + rect.height, rect.left + rect.width / 2 - mypopup.offsetWidth / 2)
			} else {
				hidebeacon(mybeacon)
				hidepopup(mypopup)
			}

		} else if (key == 'autoschedule') {

			let tourbutton = getElement('eventinfoeventtype')
			if (isviewable(tourbutton)) {
				let rect = tourbutton.getBoundingClientRect()

				if (value == false && key != selectedinteractivetourpopupindex) {
					showbeacon(mybeacon)
					movebeacon(mybeacon, rect.top, rect.left + rect.width)
				} else {
					hidebeacon(mybeacon)
				}

				if (key == selectedinteractivetourpopupindex) {
					showpopup(mypopup)
				} else {
					hidepopup(mypopup)
				}

				movepopup(mypopup, rect.top + rect.height, rect.left + rect.width / 2 - mypopup.offsetWidth / 2)
			} else {
				hidebeacon(mybeacon)
				hidepopup(mypopup)
			}

		}else if (key == 'timeslot') {

			let tourbutton = getElement('createtodoavailability')
			if (isviewable(tourbutton)) {
				let rect = tourbutton.getBoundingClientRect()

				if (value == false && key != selectedinteractivetourpopupindex) {
					showbeacon(mybeacon)
					movebeacon(mybeacon, rect.top, rect.left + rect.width)
				} else {
					hidebeacon(mybeacon)
				}

				if (key == selectedinteractivetourpopupindex) {
					showpopup(mypopup)
				} else {
					hidepopup(mypopup)
				}

				movepopup(mypopup, rect.top + rect.height, rect.left + rect.width / 2 - mypopup.offsetWidth / 2)
			} else {
				hidebeacon(mybeacon)
				hidepopup(mypopup)
			}

		}else if (key == 'subtask') {

			let tourbutton = getElement('clickaddsubtaskbutton')
			if (isviewable(tourbutton)) {
				let rect = tourbutton.getBoundingClientRect()

				if (value == false && key != selectedinteractivetourpopupindex) {
					showbeacon(mybeacon)
					movebeacon(mybeacon, rect.top, rect.left + rect.width)
				} else {
					hidebeacon(mybeacon)
				}

				if (key == selectedinteractivetourpopupindex) {
					showpopup(mypopup)
				} else {
					hidepopup(mypopup)
				}

				movepopup(mypopup, rect.top + rect.height, rect.left + rect.width / 2 - mypopup.offsetWidth / 2)
			} else {
				hidebeacon(mybeacon)
				hidepopup(mypopup)
			}

		}


	}

}

//open popup
let selectedinteractivetourpopupindex = null

function openinteractivetourpopup(index) {
	selectedinteractivetourpopupindex = index
	updateinteractivetour()
}

//close popup
function readinteractivetourpopup(index) {
	if (calendar.interactivetour[index] != null) calendar.interactivetour[index] = true
	selectedinteractivetourpopupindex = null
	updateinteractivetour()
}

//skip all tips
function skipinteractivetour() {
	let interactivetourpopuplist = getElement('interactivetourpopuplist')
	for (let [index, div] of Object.entries(interactivetourpopuplist.children)) {
		div.classList.add('hiddenpopup')
	}

	selectedinteractivetourpopupindex = null
	for (let key of Object.keys(calendar.interactivetour)) {
		calendar.interactivetour[key] = true
	}
	updateinteractivetour()
}

//restart tour
function restartinteractivetour() {
	selectedinteractivetourpopupindex = null
	for (let key of Object.keys(calendar.interactivetour)) {
		calendar.interactivetour[key] = false
	}
	updateinteractivetour()
}

function clicktakeinteractivetour() {
	closehelp()
	restartinteractivetour()
	calendartabs = [0,1]
	if(mobilescreen){
		calendartabs = [0]
	}
	calendar.updateTabs()
}



//TABS
function clickpaneldivider(event) {
	let todowrap = getElement('todowrap')
	let calendarwrap = getElement('calendarwrap')
	todowrap.classList.add('movingpanel')
	calendarwrap.classList.add('movingpanel')

	document.addEventListener("mousemove", movepaneldivider, false)
	document.addEventListener("mouseup", finishfunction, false);
	function finishfunction() {
		let todowrap = getElement('todowrap')
		let calendarwrap = getElement('calendarwrap')
		todowrap.classList.remove('movingpanel')
		calendarwrap.classList.remove('movingpanel')

		document.removeEventListener("mousemove", movepaneldivider, false);
		document.removeEventListener("mouseup", finishfunction, false);
	}
}

function movepaneldivider(event) {
	let panelwrap = getElement('panelwrap')
	let todowrap = getElement('todowrap')
	let calendarwrap = getElement('calendarwrap')

	let maxwidth = panelwrap.offsetWidth
	let relativex = event.clientX - panelwrap.offsetLeft

	if (relativex < 15) {
		relativex = 0
	}
	if (relativex > maxwidth - 15) {
		relativex = maxwidth
	}

	todowrap.style.flex = relativex / maxwidth + ''
	calendarwrap.style.flex = 1 - (relativex / maxwidth) + ''
}


function openleftmenu(event) {
	let leftmenubutton = getElement('leftmenubutton')
	let leftmenuwrap = getElement('leftmenuwrap')
	leftmenuwrap.classList.toggle('hiddenpopup')

	leftmenuwrap.style.top = (leftmenubutton.offsetTop + leftmenubutton.offsetHeight) + 'px'
	leftmenuwrap.style.left = fixleft(leftmenubutton.offsetLeft + leftmenubutton.offsetWidth/2 - leftmenuwrap.offsetWidth/2, leftmenuwrap) + 'px'
}


function openleftmenu2(event) {
	let leftmenubutton2 = getElement('leftmenubutton2')
	let leftmenuwrap = getElement('leftmenuwrap')
	leftmenuwrap.classList.toggle('hiddenpopup')

	leftmenuwrap.style.top = (leftmenubutton2.offsetTop + leftmenubutton2.offsetHeight) + 'px'
	leftmenuwrap.style.left = fixleft(leftmenubutton2.offsetLeft + leftmenubutton2.offsetWidth/2 - leftmenuwrap.offsetWidth/2, leftmenuwrap) + 'px'
}

function updateuserinfo(){
	let userinfodisplay = getElement('userinfodisplay')
	userinfodisplay.innerHTML = `
	<div class="text-16px text-primary text-bold">${getUserName() ? cleanInput(getUserName()) : ''}${clientinfo?.betatester ? `<span class="text-14px margin-left-6px badgepadding background-green border-8px text-white">Beta tester</span>` : ''}</div>
	<div class="text-14px text-primary">${getUserEmail() && isEmail(getUserEmail()) && getUserEmail()  != getUserName() ? getUserEmail() : ''}</div>`
}
function updateAvatar(){
	const avataricon = `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="avatarsvg">
		<g>
		<path d="M64.352 74.7305C64.352 39.5787 92.8482 11.0825 128 11.0825C163.152 11.0825 191.648 39.5787 191.648 74.7305C191.648 109.882 163.152 138.378 128 138.378C92.8482 138.378 64.352 109.882 64.352 74.7305Z" opacity="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-width="20"></path>
		<path d="M13.0743 245.846C20.1727 188.688 68.9202 144.451 128 144.451C187.063 144.451 235.8 188.664 242.92 245.798" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
		</g>
	</svg>`
	
	let avatar = clientinfo.google_email ? `${clientinfo.google.profilepicture ? `<img class="border-round avatarimage" src="${clientinfo.google.profilepicture}" alt="Profile picture"></img>` : avataricon}` : avataricon
	
	let leftmenubutton = getElement('leftmenubutton')
	leftmenubutton.innerHTML = avatar

	let leftmenubutton2 = getElement('leftmenubutton2')
	leftmenubutton2.innerHTML = avatar
}



function fixleft(newx, div) {
	let width = window.innerWidth || document.body.clientWidth

	let styles = window.getComputedStyle(div)
	let realwidth = div.offsetWidth + parseInt(styles.marginLeft) + parseInt(styles.marginRight)
	if (newx > width - realwidth) {
		newx = width - realwidth
	}
	if (newx < 0) {
		newx = 0
	}
	return newx
}
function fixtop(newy, div) {
	let height = window.innerHeight || document.body.clientHeight

	let styles = window.getComputedStyle(div)
	let realheight = div.offsetHeight + parseInt(styles.marginTop) + parseInt(styles.marginBottom)
	if (newy > height - realheight) {
		newy = height - realheight
	}
	if (newy < 0) {
		newy = 0
	}
	return newy
}


//THEME

let rootdataset = document.documentElement.dataset

let devicetheme = ''
if ('matchMedia' in window) {
	let themedata = window.matchMedia('(prefers-color-scheme: dark)')
	if (themedata.matches) {
		devicetheme = 'dark'
	} else {
		devicetheme = ''
	}
	themedata.addEventListener('change', changedevicetheme)
}

settheme(getStorage('theme') || devicetheme)


function changedevicetheme(event) {
	if (event.matches) {
		devicetheme = 'dark'
	} else {
		devicetheme = ''
	}
	updatetheme()
}


function updatetheme() {
	let theme = calendar.settings.theme
	if (theme == 0) {
		settheme(devicetheme)
	} else if (theme == 2) {
		settheme('dark')
	} else {
		settheme('')
	}
}

function toggletheme() {
	settheme(gettheme() == 'dark' ? '' : 'dark')
	updatetoggletheme()
	calendar.settings.theme = gettheme() == devicetheme ? 0 : (gettheme() == 'dark' ? 2 : 1)

	closehelp()
}

function settheme(theme) {
	rootdataset.theme = theme
	setStorage('theme', theme)
	updatetoggletheme()
}

function gettheme() {
	return rootdataset.theme
}

function updatetoggletheme() {
	let toggletheme = getElement('toggletheme')
	let output
	if (rootdataset.theme == 'dark') {
		output =
			`<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge pointer-none">
		<g>
		<path d="M75.9346 128C75.9346 99.2451 99.2451 75.9346 128 75.9346C156.755 75.9346 180.065 99.2451 180.065 128C180.065 156.755 156.755 180.065 128 180.065C99.2451 180.065 75.9346 156.755 75.9346 128Z" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"/>
		<path d="M128 38L128 10" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		<path d="M128 246L128 218" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		<path d="M218 128L246 128" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		<path d="M10 128L38 128" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		<path d="M64.3604 64.3604L44.5614 44.5614" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		<path d="M211.439 211.439L191.64 191.64" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		<path d="M191.64 64.3604L211.439 44.5614" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		<path d="M44.5614 211.439L64.3604 191.64" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
		</g>
		</svg> 
		<div class="text-14px text-primary pointer-none">Light theme</div>`
	} else {
		output =
			`<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge pointer-none">
		<g>
		<path d="M117.893 10.0435C117.788 10.0531 117.372 9.99119 117.267 10.0011C56.9508 15.6633 10 66.2417 10 127.76C10 193.071 63.2396 246 128.853 246C188.096 246 237.021 202.769 246 146.313C236.736 151.74 226.732 156.259 215.286 158.725C163.603 169.859 112.672 137.201 101.486 85.756C95.4972 58.2118 102.455 31.1379 117.893 10.0435Z" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"/>
		</g>
		</svg>
		<div class="text-14px text-primary pointer-none">Dark theme</div>`
	}
	toggletheme.innerHTML = output
}



//FOCUS

function closefocus() {
	let focuswrap = getElement('focuswrap')
	focuswrap.classList.add('hiddenfade')
}
function openfocus() {
	let focuswrap = getElement('focuswrap')
	focuswrap.classList.remove('hiddenfade')

	calendar.updateFocus()
}


//DOCUMENT
window.addEventListener('keydown', keydowndocument, false)
function keydowndocument(event) {
	if (!document.activeElement || document.activeElement === document.body) {
		if (event.key.toLowerCase() == 'd' && calendartabs.includes(0)) { //D
			selectedeventid = null
			calendarmode = 0
			calendar.updateCalendar()
		} else if (event.key.toLowerCase() == 'w' && calendartabs.includes(0)) { //W
			selectedeventid = null
			calendarmode = 1
			calendar.updateCalendar()
		} else if (event.key.toLowerCase() == 'm' && calendartabs.includes(0)) { //M
			selectedeventid = null
			calendarmode = 2
			calendar.updateCalendar()
		} else if ((event.key == 'Backspace' || event.key == 'Delete') && calendartabs.includes(0)) { //backspace or delete
			let item = calendar.events.find(d => d.id == selectedeventid)
			if (!item) return

			if (Calendar.Event.isReadOnly(item)) return

			calendar.events = calendar.events.filter(d => d.id != item.id)
			fixrecurringtodo(item)

			selectedeventid = null
			if(item.type == 1){
				calendar.updateTodo()
			}
			calendar.updateInfo()
			calendar.updateTodo()
			calendar.updateEvents()
			calendar.updateHistory()
		} else if (event.key.toLowerCase() == 'c' && (event.ctrlKey || event.metaKey) && calendartabs.includes(0)) { //ctrl C
			event.stopPropagation()
			event.preventDefault()

			let item = calendar.events.find(d => d.id == selectedeventid)
			if (!item) return

			if (Calendar.Event.isReadOnly(item)) return

			copiedevent = JSON.stringify(item)
		} else if (event.key.toLowerCase() == 'v' && (event.ctrlKey || event.metaKey) && calendartabs.includes(0)) { //ctrl V
			event.stopPropagation()
			event.preventDefault()

			if (copiedevent) {
				let item = JSON.parse(copiedevent)

				if (Calendar.Event.isReadOnly(item)) return

				item.id = generateID()
				calendar.events.push(item)
				selectedeventid = item.id

				calendar.updateInfo()
				calendar.updateEvents()
				calendar.updateHistory()
			}
		} else if (event.key.toLowerCase() == 'z' && !event.shiftKey && (event.ctrlKey || event.metaKey)) { //ctrl Z
			event.stopPropagation()
			event.preventDefault()

			undohistory()

			let entry = getHistory()
			calendar.events = entry.events
			calendar.todos = entry.todos
			calendar.calendars = entry.calendars

			selectedeventid = null
			calendar.updateEvents()
			calendar.updateTodo()
			calendar.updateInfo()
		} else if (((event.key.toLowerCase() == 'z' && event.shiftKey) || event.key.toLowerCase() == 'y') && (event.ctrlKey || event.metaKey)) { //ctrl shift Z or ctrl Y
			event.stopPropagation()
			event.preventDefault()

			redohistory()

			let entry = getHistory()
			calendar.events = entry.events
			calendar.todos = entry.todos
			calendar.calendars = entry.calendars

			selectedeventid = null
			calendar.updateEvents()
			calendar.updateTodo()
			calendar.updateInfo()
		} else if (event.key == 'ArrowLeft' && calendartabs.includes(0)) { //left arrow
			prevcalendar()
		} else if (event.key == 'ArrowRight' && calendartabs.includes(0)) { //right arrow
			nextcalendar()
		} else if (event.key.toLowerCase() == 't' && calendartabs.includes(0)) { //T
			todaycalendar()
		}

	}
}

//window mouse up
window.addEventListener('touchend', mouseupdocument, false)
window.addEventListener('mouseup', mouseupdocument, false)
function mouseupdocument(event) {
	if (selectedeventid) {
		calendar.updateHistory()
	}
}

//window mouse down
window.addEventListener('mousedown', mousedowndocument, false)
window.addEventListener('touchstart', mousedowndocument, false)
function mousedowndocument(event) {
	let eventinfo = getElement('eventinfo')
	let eventinfoshown = !eventinfo.classList.contains('hiddenpopup')

	let popuplist = Array.from(document.getElementsByClassName('popup'))
	let popupbuttonlist = [...Array.from(document.getElementsByClassName('popupbutton')), ...Array.from(document.getElementsByClassName('inputtimepicker')), ...Array.from(document.getElementsByClassName('inputdatepicker')), ...Array.from(document.getElementsByClassName('inputdurationpicker'))]

	//close all popups
	if (![...popuplist, ...popupbuttonlist].find(d => d.contains(event.target))) {
		for (const popup of popuplist) {
			if (!popup.classList.contains('hiddenpopup')) {
				popup.classList.add('hiddenpopup')
			}
		}
	}

	//close front popups
	if (popuplist.find(d => d.contains(event.target)) && !popupbuttonlist.find(d => d.contains(event.target))) {
		let clickedzindex = +window.getComputedStyle(popuplist.find(d => d.contains(event.target))).getPropertyValue('z-index')

		for (const popup of popuplist) {
			let tempzindex = +window.getComputedStyle(popup).getPropertyValue('z-index')
			if (tempzindex > clickedzindex && !popup.classList.contains('hiddenpopup')) {
				popup.classList.add('hiddenpopup')
			}
		}
	}

	//unselect event
	if (eventinfoshown == true && eventinfo.classList.contains('hiddenpopup')) {
		selectedeventid = null
		calendar.updateEvents()
		calendar.updateInfo(true)
	}
}

//dev
window.addEventListener('keydown', press1, false)
function press1(event){
	if(event.key == 'd'){
		window.addEventListener('keydown', press2, false)
	}
}
function press2(event){
	if(event.key == 'e'){
		window.removeEventListener('keydown', press2, false)
		window.addEventListener('keydown', press3, false)
	}else{
		window.removeEventListener('keydown', press2, false)
	}
}
function press3(event){
	if(event.key == 'v'){
		window.removeEventListener('keydown', press3, false)

		if(clientinfo.google_email == 'james.tsaggaris@gmail.com'){
			getElement('devpopup').classList.remove('hiddenpopup')
		}
	}else{
		window.removeEventListener('keydown', press3, false)
	}
}


//EVENT INFO

let infooffsetx;
let infooffsety;

//close event editor
function closeeventinfo(event) {
	selectedeventid = null

	calendar.updateInfo(true)
	calendar.updateEvents()
}

//delete event
function clickeventinfodelete(event) {
	let item = calendar.events.find(x => x.id == selectedeventid)
	if (!item) return

	calendar.events = calendar.events.filter(x => x.id != item.id)
	fixrecurringtodo(item)

	selectedeventid = null

	if(item.type == 1){
		calendar.updateTodo()
	}
	calendar.updateInfo(true)
	calendar.updateEvents()
	calendar.updateHistory()
}

//edit or view event
function clickeventinfoedit(event) {
	let item = calendar.events.find(x => x.id == selectedeventid)
	if (!item) return

	editinfo = !editinfo

	calendar.updateInfo(true)

	//analytics
	if (editinfo) {
		if(gtag){gtag('event', 'button_click', { useraction: 'Edit - event info' })}
	} else {
		if(gtag){gtag('event', 'button_click', { useraction: 'Done - event info' })}
	}
}

function clickeventinfo(event) {
	let drageventinfo = getElement('drageventinfo')
	if (event.target === drageventinfo) {
		let eventinfo = getElement('eventinfo')

		infooffsetx = event.clientX - eventinfo.offsetLeft
		infooffsety = event.clientY - eventinfo.offsetTop

		document.addEventListener("mousemove", moveeventinfo, false)
		document.addEventListener("mouseup", finishfunction, false)
		function finishfunction() {
			document.removeEventListener("mousemove", moveeventinfo, false);
			document.removeEventListener("mouseup", finishfunction, false);
		}
	}
}

function moveeventinfo(event) {
	if (!selectedeventid) return

	let eventinfo = getElement('eventinfo')

	let newx = event.clientX - infooffsetx
	let newy = event.clientY - infooffsety

	eventinfo.style.left = fixleft(newx, eventinfo) + 'px'
	eventinfo.style.top = fixtop(newy, eventinfo) + 'px'
}

//input duration
function inputeventduration(event) {
	if (selectedeventid) {
		let string = event.target.value

		let item = calendar.events.find(c => c.id == selectedeventid)
		if (!item) return

		let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)

		let myduration = getDuration(string).value

		let enddate = new Date(startdate.getTime() + (myduration * 60000))

		if (!isNaN(enddate.getTime()) && myduration != null) {
			item.end.year = enddate.getFullYear()
			item.end.month = enddate.getMonth()
			item.end.day = enddate.getDate()
			item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
		}

		calendar.updateEvents()
		calendar.updateInfo()
		calendar.updateHistory()
	}
}

//input title
function inputeventtitle(event, id) {
	let item = calendar.events.find(c => c.id == id)
	if (!item) return
	item.title = event.target.value

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()
}

//input start date
function inputeventstartdate(event, id) {
	let item = calendar.events.find(c => c.id == id)
	if (!item) return
	let string = event.target.value.toLowerCase()

	let [mystartyear, mystartmonth, mystartday] = getDate(string).value

	let tempdate = new Date(mystartyear, mystartmonth, mystartday)

	let oldstartdate = new Date(item.start.year, item.start.month, item.start.day)

	if (!isNaN(tempdate.getTime())) {
		let duration = (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())

		item.start.year = tempdate.getFullYear()
		item.start.month = tempdate.getMonth()
		item.start.day = tempdate.getDate()

		fixeventend(item, duration)
	}

	if(oldstartdate.getTime() != new Date(item.start.year, item.start.month, item.start.day).getTime() && (item.repeat.frequency == null && item.repeat.interval == null)){
		calendarday = item.start.day
		calendarmonth = item.start.month
		calendaryear = item.start.year
		calendar.updateCalendar()
	}else{
		calendar.updateEvents()
		calendar.updateInfo()
	}

	calendar.updateHistory()
}

//input start minute
function inputeventstartminute(event, id) {
	let string = event.target.value.toLowerCase()

	let mystartminute = getMinute(string, true).value

	let item = calendar.events.find(c => c.id == id)
	if (!item) return
	
	let oldminute = item.start.minute
	
	if (mystartminute != null) {
		let duration = (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())

		item.start.minute = mystartminute

		fixeventend(item, duration)
	}

	calendar.updateHistory()

	if(oldminute != item.start.minute){
		scrollcalendarY(item.start.minute)
	}
}


//input end date
function inputeventenddate(event, id) {
	let string = event.target.value.toLowerCase()
	let item = calendar.events.find(c => c.id == id)
	if (!item) return

	let [myendyear, myendmonth, myendday] = getDate(string).value

	let tempdate = new Date(myendyear, myendmonth, myendday)
	if (Calendar.Event.isAllDay(item)) {
		tempdate.setDate(tempdate.getDate() + 1)
	}

	let oldenddate = new Date(item.end.year, item.end.month, item.end.day)

	if (!isNaN(tempdate.getTime())) {
		let duration = (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())

		item.end.year = tempdate.getFullYear()
		item.end.month = tempdate.getMonth()
		item.end.day = tempdate.getDate()

		fixeventstart(item, duration)
	}
	
	if(oldenddate.getTime() != new Date(item.end.year, item.end.month, item.end.day).getTime() && (item.repeat.frequency == null && item.repeat.interval == null)){
		calendarday = item.end.day
		calendarmonth = item.end.month
		calendaryear = item.end.year
		calendar.updateCalendar()
	}else{
		calendar.updateEvents()
		calendar.updateInfo()
	}

	calendar.updateHistory()
}

//input end minute
function inputeventendminute(event, id) {
	let myendminute;

	let string = event.target.value.toLowerCase()

	myendminute = getMinute(string, true).value

	let item = calendar.events.find(c => c.id == id)
	if (!item) return

	let oldminute = item.start.minute

	if (myendminute != null) {
		let duration = (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())

		item.end.minute = myendminute

		fixeventstart(item, duration)
	}

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()

	if(oldminute != item.end.minute){
		scrollcalendarY(item.end.minute)
	}
}

//input end before date
function inputeventduedate(event, id) {
	let string = event.target.value.toLowerCase()
	let item = calendar.events.find(c => c.id == id)
	if (!item) return

	let [myendbeforeyear, myendbeforemonth, myendbeforeday] = getDate(string).value

	let tempdate = new Date(myendbeforeyear, myendbeforemonth, myendbeforeday)

	if (!isNaN(tempdate.getTime())) {
		item.endbefore.year = tempdate.getFullYear()
		item.endbefore.month = tempdate.getMonth()
		item.endbefore.day = tempdate.getDate()

		fixsubandparenttask(item)
	}

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()
}

//input end before minute
function inputeventduetime(event, id) {
	let string = event.target.value.toLowerCase()

	let myendbeforeminute = getMinute(string, true).value

	let item = calendar.events.find(c => c.id == id)
	if (!item) return

	if (myendbeforeminute != null) {
		item.endbefore.minute = myendbeforeminute

		fixsubandparenttask(item)
	}

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()
}

//input notes
function inputeventnotes(event, id) {
	let item = calendar.events.find(c => c.id == id)
	if (!item) return
	item.notes = event.target.value

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()
}


//DAY EVENT

//get day event data
function getalldayeventdata(item, currentdate, timestamp) {
	let nextdate = new Date(currentdate.getTime())
	nextdate.setDate(nextdate.getDate() + 1)

	let itemclasses = []
	let itemclasses2 = []


	if (selectedeventid == item.id) {
		itemclasses.push('selectedevent')
		itemclasses2.push('selectedtext')
	}

	if (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() < Date.now()) {
		itemclasses.push('greyedoutevent')
	}

	let output = ''
	output = `<div style="background-color:${selectedeventid == item.id ? `${item.hexcolor}` : `${item.hexcolor + '80'}`}" class="popupbutton monthcontainerwrap ${itemclasses.join(' ')}" id="${item.id}" onmousedown="clickdayevent(event, ${timestamp})">
		<div class="monthcontainerwraptextgroup">

			<div class="monthcontainerwraptext">
				<div class="monthcontainerwraptextdisplay text-bold ${itemclasses2.join(' ')}">
					${item.type == 1 && item.priority != 0 ?
			`<span class="todoitemcheckbox tooltip">
							${getpriorityicon(item.priority)}
						</span>`
			:
			''
		}
					${Calendar.Event.getTitle(item)}
				</div>
			</div>
	 
		</div>
	</div>`

	return output
}

//double click day event box
function dblclickdayeventbox(event, timestamp) {
	let tempdate = new Date(timestamp)
	let nextdate = new Date(tempdate)
	nextdate.setDate(nextdate.getDate() + 1)

	let item = new Calendar.Event(tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate(), 0, nextdate.getFullYear(), nextdate.getMonth(), nextdate.getDate(), 0)
	calendar.events.push(item)

	selectedeventid = item.id

	editinfo = true

	calendar.updateInfo(true)
	calendar.updateHistory()
	calendar.updateEvents()
}

//click day event box
function clickdayeventbox(event) {
	if (selectedeventid) {
		selectedeventid = null

		calendar.updateEvents()
		calendar.updateInfo(true)
	}
}


//click day event
function clickdayevent(event, timestamp) {
	event.preventDefault()
	event.stopPropagation()

	selectedeventid = event.target.id

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	selectedeventdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	selectedeventfromdate = new Date(timestamp)

	calendar.updateEvents()
	movingevent = true
	calendar.updateInfo(true)

	document.addEventListener("mousemove", movedayevent, false)
	document.addEventListener("mouseup", finishfunction, false);
	function finishfunction() {
		document.removeEventListener("mousemove", movedayevent, false)
		document.removeEventListener("mouseup", finishfunction, false)
		movingevent = false
		calendar.updateInfo(false, true)
	}
}

//move day event
function movedayevent(event) {
	movingevent = true
	let dayeventrow = getElement('dayeventrow')
	let relativey = event.clientY - dayeventrow.offsetTop
	let relativex = event.clientX - dayeventrow.offsetLeft

	let selectedeventdate2 = new Date(selectedeventdate.getTime())

	//move to other day
	if (calendarmode == 1) {
		let allchildren = []
		for (let child of Array.from(dayeventrow.children)) {
			for (let childchild of Array.from(child.children)) {
				allchildren.push(childchild)
			}
		}
		for (let div of allchildren) {
			let rect = div.getBoundingClientRect()
			if (relativex >= rect.left - dayeventrow.offsetLeft && relativex < rect.left - dayeventrow.offsetLeft + rect.width) {
				let tempselectedeventdate = new Date(selectedeventdate.getTime())
				tempselectedeventdate.setHours(0, 0, 0, 0)

				let index = Math.round((selectedeventfromdate.getTime() - tempselectedeventdate.getTime()) / (1000 * 24 * 3600))
				let timestamp = div.dataset.timestamp
				selectedeventdate2.setTime(timestamp)
				selectedeventdate2.setMinutes(selectedeventdate.getHours() * 60 + selectedeventdate.getMinutes())
				selectedeventdate2.setDate(selectedeventdate2.getDate() - index)
			}
		}

	}

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	if (Calendar.Event.isReadOnly(item)) return

	let difference = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)

	let tempdate1 = new Date(selectedeventdate2.getTime())

	let tempdate2 = new Date(selectedeventdate2.getTime())
	tempdate2.setMinutes(tempdate2.getMinutes() + difference)

	item.start.minute = tempdate1.getHours() * 60 + tempdate1.getMinutes()
	item.start.day = tempdate1.getDate()
	item.start.month = tempdate1.getMonth()
	item.start.year = tempdate1.getFullYear()

	item.end.minute = tempdate2.getHours() * 60 + tempdate2.getMinutes()
	item.end.day = tempdate2.getDate()
	item.end.month = tempdate2.getMonth()
	item.end.year = tempdate2.getFullYear()

	calendar.updateEvents()
	calendar.updateHistory()
	calendar.updateInfo()
}


//MONTH EVENT

//get month event data
function getmontheventdata(item, currentdate, timestamp) {
	let nextdate = new Date(currentdate.getTime())
	nextdate.setDate(nextdate.getDate() + 1)

	let itemclasses = []
	let itemclasses2 = []

	if (selectedeventid == item.id) {
		itemclasses.push('selectedevent')
		itemclasses2.push('selectedtext')
	}

	if (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() < Date.now()) {
		itemclasses.push('greyedoutevent')
	}


	let output = ''
	output = `
	<div style="background-color:${selectedeventid == item.id ? `${item.hexcolor}` : `${item.hexcolor + '80'}`}" class="popupbutton monthcontainerwrap ${itemclasses.join(' ')}" id="${item.id}" onmousedown="clickmonthcontainer(event, ${timestamp})">
		<div class="monthcontainerwraptextgroup">
			<div class="monthcontainerwraptext">
				<div class="monthcontainerwraptextdisplay ${itemclasses2.join(' ')}">
					<span class="text-bold">${Calendar.Event.getTitle(item)}</span>
					${item.type == 1 && item.priority != 0 ?
						`<span class="todoitemcheckbox tooltip">
							${getpriorityicon(item.priority)}
						</span>`
						:
						''
					}

				</div>
			</div>
			<div class="monthcontainerwraptexttime">
				<div class="monthcontainerwraptextdisplay text-12px text-quaternary ${itemclasses2.join(' ')}">
					${Calendar.Event.isAllDay(item) ? 'All day' : getHMText(item.start.minute)}
				</div>
			</div>
		</div>
	</div>`

	return output
}

//double click month area
function dblclickmontharea(event, timestamp) {
	let currentdate = new Date()
	let minutes = ceil(currentdate.getHours() * 60 + currentdate.getMinutes(), 5)

	let tempdate = new Date(timestamp)

	let item = new Calendar.Event(tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate(), minutes, tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate(), minutes + 60)
	calendar.events.push(item)

	selectedeventid = item.id

	editinfo = true

	calendar.updateInfo(true)
	calendar.updateHistory()
	calendar.updateEvents()
}

//click month area
function clickmontharea(event) {
	if (selectedeventid) {
		selectedeventid = null

		calendar.updateEvents()
		calendar.updateInfo(true)
	}
}

//click month event
function clickmonthcontainer(event, timestamp) {
	event.stopPropagation()
	selectedeventid = event.target.id

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	selectedeventdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	selectedeventfromdate = new Date(timestamp)

	calendar.updateEvents()
	movingevent = true
	calendar.updateInfo(true)

	document.addEventListener("mousemove", movemonthcontainer, false)
	document.addEventListener("mouseup", finishfunction, false);
	function finishfunction() {
		document.removeEventListener("mousemove", movemonthcontainer, false);
		document.removeEventListener("mouseup", finishfunction, false);
		movingevent = false
		calendar.updateInfo(false, true)
	}
}

//move month event
function movemonthcontainer(event) {
	movingevent = true
	let monthscreens = getElement('monthscreens')
	let relativey = event.clientY - monthscreens.offsetTop
	let relativex = event.clientX - monthscreens.offsetLeft

	let selectedeventdate2 = new Date(selectedeventdate.getTime())

	//move to other day
	if (calendarmode == 2) {
		let allchildren = []
		for (let child of Array.from(monthscreens.children)) {
			for (let childchild of Array.from(child.children)) {
				for (let childchildchild of Array.from(childchild.children)) {
					allchildren.push(childchildchild)
				}
			}
		}
		for (let div of allchildren) {
			let rect = div.getBoundingClientRect()
			if (relativex >= rect.left - monthscreens.offsetLeft && relativex < rect.left - monthscreens.offsetLeft + rect.width && relativey >= rect.top - monthscreens.offsetTop && relativey < rect.top - monthscreens.offsetTop + rect.height) {
				let tempselectedeventdate = new Date(selectedeventdate.getTime())
				tempselectedeventdate.setHours(0, 0, 0, 0)

				let index = Math.round((selectedeventfromdate.getTime() - tempselectedeventdate.getTime()) / (1000 * 24 * 3600))
				let timestamp = div.dataset.timestamp
				selectedeventdate2.setTime(timestamp)
				selectedeventdate2.setMinutes(selectedeventdate.getHours() * 60 + selectedeventdate.getMinutes())
				selectedeventdate2.setDate(selectedeventdate2.getDate() - index)
			}
		}

	}

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	if (Calendar.Event.isReadOnly(item)) return

	let difference = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)

	let tempdate1 = new Date(selectedeventdate2.getTime())

	let tempdate2 = new Date(selectedeventdate2.getTime())
	tempdate2.setMinutes(tempdate2.getMinutes() + difference)

	item.start.minute = tempdate1.getHours() * 60 + tempdate1.getMinutes()
	item.start.day = tempdate1.getDate()
	item.start.month = tempdate1.getMonth()
	item.start.year = tempdate1.getFullYear()

	item.end.minute = tempdate2.getHours() * 60 + tempdate2.getMinutes()
	item.end.day = tempdate2.getDate()
	item.end.month = tempdate2.getMonth()
	item.end.year = tempdate2.getFullYear()

	calendar.updateEvents()
	calendar.updateHistory()
	calendar.updateInfo()
}

//ACCOUNT
async function logout() {
	const response = await fetch('/logout', {
		method: 'POST',
		redirect: 'follow'
	})
	if (response.redirected) {
		window.location.replace(response.url)
	}
}

function openchangeusername() {
	let changeusername = getElement('changeusername')
	let changeusernamemenu = getElement('changeusernamemenu')
	changeusernamemenu.classList.toggle('hiddenpopup')

	changeusernamemenu.style.top = (changeusername.getBoundingClientRect().top + changeusername.offsetHeight) + 'px'
	changeusernamemenu.style.left = fixleft(changeusername.getBoundingClientRect().left, changeusernamemenu) + 'px'

	let form = getElement('changeusernameform')
	form.reset()
}

function opensetusername() {
	let setusername = getElement('setusername')
	let setusernamemenu = getElement('setusernamemenu')
	setusernamemenu.classList.toggle('hiddenpopup')

	setusernamemenu.style.top = (setusername.getBoundingClientRect().top + setusername.offsetHeight) + 'px'
	setusernamemenu.style.left = fixleft(setusername.getBoundingClientRect().left, setusernamemenu) + 'px'

	let form = getElement('setusernameform')
	form.reset()
}


function openchangepassword() {
	let changepassword = getElement('changepassword')
	let changepasswordmenu = getElement('changepasswordmenu')
	changepasswordmenu.classList.toggle('hiddenpopup')

	changepasswordmenu.style.top = (changepassword.getBoundingClientRect().top + changepassword.offsetHeight) + 'px'
	changepasswordmenu.style.left = fixleft(changepassword.getBoundingClientRect().left, changepasswordmenu) + 'px'

	let form = getElement('changepasswordform')
	form.reset()
}

function opensetpassword() {
	let setpassword = getElement('setpassword')
	let setpasswordmenu = getElement('setpasswordmenu')
	setpasswordmenu.classList.toggle('hiddenpopup')

	setpasswordmenu.style.top = (setpassword.getBoundingClientRect().top + setpassword.offsetHeight) + 'px'
	setpasswordmenu.style.left = fixleft(setpassword.getBoundingClientRect().left, setpasswordmenu) + 'px'

	let form = getElement('setpasswordform')
	form.reset()
}


function opendeleteaccount(event) {
	let button = event.target
	let deleteaccountmenu = getElement('deleteaccountmenu')
	deleteaccountmenu.classList.toggle('hiddenpopup')

	deleteaccountmenu.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, deleteaccountmenu) + 'px'
	deleteaccountmenu.style.left = fixleft(button.getBoundingClientRect().left, deleteaccountmenu) + 'px'

	let form = getElement('deleteaccountform')
	form.reset()
}

async function submitdeleteaccount(event) {
	event.preventDefault()

	let deleteaccountmenu = getElement('deleteaccountmenu')
	let deleteaccounterrorwrap = getElement('deleteaccounterrorwrap')
	deleteaccounterrorwrap.classList.add('display-none')

	let deleteaccountform = getElement('deleteaccountform')
	const formdata = new FormData(deleteaccountform)

	const response = await fetch(`/deleteaccount`, {
		method: 'POST',
		body: formdata,
		redirect: 'follow'
	})
	if (response.status == 401) {
		const data = await response.json()
		deleteaccounterrorwrap.innerHTML = data.error
		deleteaccounterrorwrap.classList.remove('display-none')
	} else if (response.status == 200) {
		if (response.redirected) {
			window.location.replace(response.url)
		}
	}
}


async function dev(input){
	getElement('devinput').value = ''

	input = input.trim()
	if(!input){
		return
	}

	if(input.toLowerCase() == 'clear'){
		getElement('devtext').innerHTML = ''
		return
	}
	
	function formatoutput(temp){
		if(typeof temp === 'Object' && temp !== null){
			return JSON.stringify(temp)
		}
		return temp
	}
	
	let devtext = getElement('devtext')
	devtext.innerHTML += `<div class="selecttext padding-6px text-14px text-primary break-word pre-wrap">${input}</div>`

	devtext.scrollTop = devtext.scrollHeight

	let bodydata = { input: input }
	const response = await fetch(`/dev`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bodydata)
	})
	if (response.status == 200) {
		const responsedata = await response.json()

		if(responsedata.error || responsedata.output){
			devtext.innerHTML += `<div class="selecttext padding-6px text-14px text-primary break-word pre-wrap">${[responsedata.error, responsedata.output].map(d => formatoutput(d)).filter(d => d != '').join('<br>')}</div>`

			devtext.scrollTop = devtext.scrollHeight
		}
	}
}



async function submitchangeusername(event) {
	event.preventDefault()

	let changeusernamemenu = getElement('changeusernamemenu')
	let usernameerrorwrap = getElement('usernameerrorwrap')
	usernameerrorwrap.classList.add('display-none')

	let changeusernameform = getElement('changeusernameform')
	const formdata = new FormData(changeusernameform)

	const response = await fetch(`/changeusername`, {
		method: 'POST',
		body: formdata
	})
	if (response.status == 401) {
		const data = await response.json()
		usernameerrorwrap.innerHTML = data.error
		usernameerrorwrap.classList.remove('display-none')
	} else if (response.status == 200) {
		changeusernamemenu.classList.add('hiddenpopup')
		changeusernameform.reset()

		await getclientinfo()
		calendar.updateSettings()
	}
}

async function submitsetusername(event) {
	event.preventDefault()

	let setusernamemenu = getElement('setusernamemenu')
	let usernameerrorwrap2 = getElement('usernameerrorwrap2')
	usernameerrorwrap2.classList.add('display-none')

	let setusernameform = getElement('setusernameform')
	const formdata = new FormData(setusernameform)

	const response = await fetch(`/changeusername`, {
		method: 'POST',
		body: formdata
	})
	if (response.status == 401) {
		const data = await response.json()
		usernameerrorwrap2.innerHTML = data.error
		usernameerrorwrap2.classList.remove('display-none')
	} else if (response.status == 200) {
		setusernamemenu.classList.add('hiddenpopup')
		setusernameform.reset()

		await getclientinfo()
		calendar.updateSettings()
	}
}



async function submitchangepassword(event) {
	event.preventDefault()

	let changepasswordmenu = getElement('changepasswordmenu')
	let passworderrorwrap = getElement('passworderrorwrap')
	passworderrorwrap.classList.add('display-none')

	let changepasswordform = getElement('changepasswordform')
	const formdata = new FormData(changepasswordform)

	const response = await fetch(`/changepassword`, {
		method: 'POST',
		body: formdata
	})
	if (response.status == 401) {
		const data = await response.json()
		passworderrorwrap.innerHTML = data.error
		passworderrorwrap.classList.remove('display-none')
	} else if (response.status == 200) {
		changepasswordmenu.classList.add('hiddenpopup')
		changepasswordform.reset()

		await getclientinfo()
		calendar.updateSettings()
	}
}


async function submitsetpassword(event) {
	event.preventDefault()

	let setpasswordmenu = getElement('setpasswordmenu')
	let passworderrorwrap2 = getElement('passworderrorwrap2')
	passworderrorwrap2.classList.add('display-none')

	let setpasswordform = getElement('setpasswordform')
	const formdata = new FormData(setpasswordform)

	const response = await fetch(`/setpassword`, {
		method: 'POST',
		body: formdata
	})
	if (response.status == 401) {
		const data = await response.json()
		passworderrorwrap2.innerHTML = data.error
		passworderrorwrap2.classList.remove('display-none')
	} else if (response.status == 200) {
		setpasswordmenu.classList.add('hiddenpopup')
		setpasswordform.reset()

		await getclientinfo()
		calendar.updateSettings()
	}
}


function showloadingscreen() {
	let loadingscreen = getElement('loadingscreen')
	loadingscreen.classList.remove('hiddenfade')
}
function hideloadingscreen() {
	let loadingscreen = getElement('loadingscreen')
	loadingscreen.classList.add('hiddenfade')
}
function showloginpopup() {
	let loginpopup = getElement('loginpopup')
	loginpopup.classList.remove('hiddenfade')
}
function hideloginpopup() {
	let loginpopup = getElement('loginpopup')
	loginpopup.classList.add('hiddenfade')
	
}


//disconnect google
async function disconnectgoogle() {
	let googleerrorwrap = getElement('googleerrorwrap')
	googleerrorwrap.classList.add('display-none')

	const response = await fetch('/disconnectgoogle', {
		method: 'POST'
	})

	if (response.status == 200) {
		await getclientinfo()

		calendar.settings.issyncingtogooglecalendar = false
		calendar.settings.issyncingtogoogleclassroom = false
		calendar.updateSettings()
	} else if (response.status == 401) {
		const data = await response.json()
		googleerrorwrap.innerHTML = data.error
		googleerrorwrap.classList.remove('display-none')
	}
}


//ALERTS
function displayalert(title) {
	let allalerts = getElement('allalerts')

	let newalert = document.createElement('div')
	newalert.innerHTML = `
	<div class="alertbox">
 		<div class="backdrop-blur border-8px text-white padding-12px pointer-auto alerttext">${title}</div>
	</div>`
	allalerts.appendChild(newalert)

	requestAnimationFrame(function () {
		newalert.children[0].classList.add('shownalert')

		setTimeout(function () {
			newalert.children[0].classList.remove('shownalert')
			setTimeout(function () {
				newalert.parentNode.removeChild(newalert)
			}, 500)
		}, 5000)
	})
}



//SETTINGS

function toggletasksuggestions(event){
	calendar.settings.gettasksuggestions = event.target.checked
	calendar.updateSettings()
}

function toggleemailnotifs(event){
	calendar.emailreminderenabled = event.target.checked
	calendar.updateSettings()
}

function toggleiosappnotifs(event){
	calendar.iosnotificationenabled = event.target.checked
	calendar.updateSettings()
}

function togglediscordnotifs(event){
	calendar.discordreminderenabled = event.target.checked
	calendar.updateSettings()
}


//break per hour
function inputsettingseventspacing(event){
	let string = event.target.value.toLowerCase()
	let myduration = getDuration(string).value
  
	if(myduration < 0){
		myduration = 0
	}

	if(myduration > 60){
		myduration = 60
	}

	if (myduration != null){
	  calendar.settings.eventspacing = myduration
	}
	calendar.updateSettings()
	calendar.updateHistory()
  }
  
  function clicksettingstheme(theme){
	  calendar.settings.theme = theme
	calendar.updateSettings()
	  updatetheme()
  }

  

//google classroom code

function togglesyncgoogleclassroom(event){
	if(event.target.checked){
		enablesyncgoogleclassroom()
	}else{
		disablesyncgoogleclassroom()
	}
}

function enablesyncgoogleclassroom(){
	calendar.settings.issyncingtogoogleclassroom = true
	calendar.updateSettings()
	getclientgoogleclassroom()
}

function disablesyncgoogleclassroom(){
	let importgoogleclassroomerror = getElement('importgoogleclassroomerror')
	importgoogleclassroomerror.classList.add('display-none')

	let loginwithgoogleclassroomscreen = getElement('loginwithgoogleclassroomscreen')
	loginwithgoogleclassroomscreen.classList.add('hiddenfade')

	calendar.settings.issyncingtogoogleclassroom = false
	calendar.updateSettings()
}



function syncnowgoogleclassroom() {
	displayalert('Syncing with Google Classroom...')
	getclientgoogleclassroom()
}

//get data
let isgettingclientgoogleclassroom = false
let hidegoogleclassroomloginpopup = false
async function getclientgoogleclassroom(){
	if (!calendar.settings.issyncingtogoogleclassroom) return
	if (isgettingclientgoogleclassroom) return

	isgettingclientgoogleclassroom = true

	try {
		//request
		const response = await fetch('/getclientgoogleclassroom', {
			method: 'POST'
		})

		if (response.status == 401) {
			const data = await response.json()
			importgoogleclassroomerror.innerHTML = data.error
			importgoogleclassroomerror.classList.remove('display-none')

			if(!hidegoogleclassroomloginpopup){
				let loginwithgoogleclassroomscreen = getElement('loginwithgoogleclassroomscreen')
				loginwithgoogleclassroomscreen.classList.remove('hiddenfade')
			}
		}else if(response.status == 200){
			calendar.lastsyncedgoogleclassroomdate = Date.now()

			const data = await response.json()

			for(let googleitem of data.data){
				let mytodo = [...calendar.events, ...calendar.todos].find(d => d.googleclassroomid == googleitem.id)
				if(!mytodo){
					let endbeforeyear, endbeforemonth, endbeforeday, endbeforeminute = null;
					if(googleitem.dueDate){
						endbeforeyear = googleitem.dueDate.year
						endbeforemonth = googleitem.dueDate.month - 1
						endbeforeday = googleitem.dueDate.day
					}
					if(googleitem.dueTime){
						endbeforeminute = googleitem.dueTime.hours * 60 + googleitem.dueTime.minutes
					}

					//utc due date
					if(endbeforeyear && endbeforemonth && endbeforeday && endbeforeminute){
						let utcduedate = new Date(Date.UTC(endbeforeyear, endbeforemonth, endbeforeday, 0, endbeforeminute))

						endbeforeyear = utcduedate.getFullYear()
						endbeforemonth = utcduedate.getMonth()
						endbeforeday = utcduedate.getDate()
						endbeforeminute = utcduedate.getHours() * 60 + utcduedate.getMinutes()
					}

					let newtodo = new Calendar.Todo(endbeforeyear, endbeforemonth, endbeforeday, endbeforeminute, 60, googleitem.title, googleitem.description)
					newtodo.googleclassroomid = googleitem.id
					newtodo.googleclassroomlink = googleitem.alternateLink

					calendar.todos.push(newtodo)
				}else{
					let endbeforeyear, endbeforemonth, endbeforeday, endbeforeminute = null;
					if(googleitem.dueDate){
						endbeforeyear = googleitem.dueDate.year
						endbeforemonth = googleitem.dueDate.month - 1
						endbeforeday = googleitem.dueDate.day
					}
					if(googleitem.dueTime){
						endbeforeminute = googleitem.dueTime.hours * 60 + googleitem.dueTime.minutes
					}

					//utc due date
					if(endbeforeyear && endbeforemonth && endbeforeday && endbeforeminute){
						let utcduedate = new Date(Date.UTC(endbeforeyear, endbeforemonth, endbeforeday, 0, endbeforeminute))

						endbeforeyear = utcduedate.getFullYear()
						endbeforemonth = utcduedate.getMonth()
						endbeforeday = utcduedate.getDate()
						endbeforeminute = utcduedate.getHours() * 60 + utcduedate.getMinutes()
					}

					mytodo.endbefore.year = endbeforeyear
					mytodo.endbefore.month = endbeforemonth
					mytodo.endbefore.day = endbeforeday
					mytodo.endbefore.minute = endbeforeminute

					mytodo.title = googleitem.title
					mytodo.notes = googleitem.description
					mytodo.googleclassroomlink = googleitem.alternateLink
				}

			}

			
			calendar.updateEvents()
			calendar.updateTodo()
			calendar.updateHistory()

			calendar.updateSettings()
			updateonboardingscreen()
		}
	}catch(err){
		console.log(err)
	}

	isgettingclientgoogleclassroom = false
}


function closeloginwithgoogleclassroompopup(){
	hideloginwithgooglepopup = true
	hidegoogleclassroomloginpopup = true
	let loginwithgoogleclassroomscreen = getElement('loginwithgoogleclassroomscreen')
	loginwithgoogleclassroomscreen.classList.add('hiddenfade')
}



//icalendar file code

function getdatafromicalendar(text, subscriptionurl) {
	function getFrequencyNumber(rrule) {
		if (!rrule || !rrule.freq) {
			return null
		}
		const freq = rrule.freq
		const freqs = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']
		const index = freqs.findIndex(f => f === freq)
		return index
	}

	function getBYDAYNumbers(rrule) {
		if (!rrule || !rrule.parts || !rrule.parts.BYDAY) {
			return []
		}
		const byday = rrule.parts.BYDAY
		const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]
		const bydayNumbers = []
		byday.forEach(day => {
			const index = daysOfWeek.findIndex(d => d === day)
			bydayNumbers.push(index)
		})
		return bydayNumbers
	}

	let outputevents = []
	let outputcalendars = []

	const parseddata = ICAL.parse(text)
	const allcalendars = new ICAL.Component(parseddata)
	const calendarevents = allcalendars.getAllSubcomponents('vevent')

	//calendar
	let calendarname = allcalendars.getFirstPropertyValue('x-wr-calname')
	let calendardescription = allcalendars.getFirstPropertyValue('x-wr-caldesc')
	let method = allcalendars.getFirstPropertyValue('method')
	let calendaritem;
	if (subscriptionurl && method == 'PUBLISH') {
		calendaritem = new Calendar.Calendar(calendarname, calendardescription, true, subscriptionurl)

		let existingcalendar = calendar.calendars.find(r => r.subscriptionurl == calendaritem.subscriptionurl)
		if (existingcalendar) {
			//load some existing properties
			calendaritem.hexcolor = existingcalendar.hexcolor
			calendaritem.title = existingcalendar.title
			calendaritem.notes = existingcalendar.notes
			calendaritem.hidden = existingcalendar.hidden
		}

		outputcalendars.push(calendaritem)
	}

	for (const event of calendarevents) {
		//get properties
		let summary = event.getFirstPropertyValue('summary')
		let description = event.getFirstPropertyValue('description')

		let start = event.getFirstPropertyValue('dtstart')
		let end = event.getFirstPropertyValue('dtend')

		let startdate = start.toJSDate()
		let enddate = end.toJSDate()

		if (!startdate || !enddate) continue

		let frequency, interval, until, count;
		let byday = []
		let rrule = event.getFirstPropertyValue('rrule')
		if (rrule) {
			frequency = getFrequencyNumber(rrule)
			interval = rrule.interval
			byday = getBYDAYNumbers(rrule)
			count = rrule.count
			if (rrule.until) {
				until = rrule.until.toJSDate().getTime()
			}
		}

		//create item
		let newevent = new Calendar.Event(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), startdate.getHours() * 60 + startdate.getMinutes(), enddate.getFullYear(), enddate.getMonth(), enddate.getDate(), enddate.getHours() * 60 + enddate.getMinutes(), summary, description)
		newevent.repeat.frequency = frequency
		newevent.repeat.interval = interval
		newevent.repeat.byday = byday
		newevent.repeat.until = until
		newevent.repeat.count = count
		fixrepeat(newevent)

		if (calendaritem) {
			newevent.calendarid = calendaritem.id
			newevent.hexcolor = calendaritem.hexcolor
		}

		outputevents.push(newevent)
	}

	return { newevents: outputevents, newcalendars: outputcalendars }
}

//upload calendar file
function clickuploadfile() {
	let importcalendar = getElement('importcalendar')
	importcalendar.click()
}
function inputcalendarfile(event) {
	const selectedfile = event.target.files[0]
	if (!selectedfile) return

	let importcalendar = getElement('importcalendar')
	importcalendar.value = ''

	const reader = new FileReader()

	reader.onload = function (event) {
		const calendardata = reader.result

		try {
			//add data
			const { newevents, newcalendars } = getdatafromicalendar(calendardata)
			calendar.events = calendar.events.filter(g => !newevents.find(h => h.id == g.id))
			calendar.events.push(...newevents)
			calendar.calendars = calendar.calendars.filter(g => !newcalendars.find(h => h.id == g.id))
			calendar.calendars.push(...newcalendars)

			calendar.updateEvents()
			calendar.updateHistory()

			displayalert('Successfully imported calendar')
			closesettings()
		} catch (error) {
			console.log(error)
			displayalert('Error, could not import calendar')
		}

	}

	reader.readAsText(selectedfile)
}

//input subscribe to calendar
function inputsubscribecalendar() {
	let inputsubscribecalendar = getElement('inputsubscribecalendar')
	let url = inputsubscribecalendar.value

	inputsubscribecalendar.value = ''
	inputsubscribecalendar.blur()

	subscribecalendar(url)
}

//subscribe to calendar
async function subscribecalendar(url) {
	try {
		const response = await fetch('/subscribecalendar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: url })
		})

		if (response.status == 200) {
			const data = await response.json()
			const calendardata = data.data

			//add data
			const { newevents, newcalendars } = getdatafromicalendar(calendardata, url)
			let existingcalendars = calendar.calendars.filter(d => newcalendars.find(g => g.subscriptionurl == d.subscriptionurl))
			calendar.events = calendar.events.filter(g => !existingcalendars.find(h => h.id == g.calendarid))
			calendar.events.push(...newevents)
			calendar.calendars = calendar.calendars.filter(g => !existingcalendars.find(h => h.id == g.id))
			calendar.calendars.push(...newcalendars)

			calendar.updateEvents()
			calendar.updateHistory()

			displayalert('Successfully subscribed to calendar')
			calendar.updateSettings()
		} else {
			displayalert('Error, could not subscribe to calendar')
		}
	} catch (error) {
		console.log(error)
		displayalert('Error, could not subscribe to calendar')
	}
}



//google calendar code

function togglesyncgooglecalendar(event) {
	let isenabled = event.target.checked
	if (isenabled) {
		enablesyncgooglecalendar()
	} else {
		disablesyncgooglecalendar()
	}
}

function syncnowgooglecalendar() {
	displayalert('Syncing with Google Calendar...')
	getclientgooglecalendar()
}

function enablesyncgooglecalendar() {
	calendar.settings.issyncingtogooglecalendar = true
	calendar.updateSettings()
	getclientgooglecalendar()
}


function disablesyncgooglecalendar() {
	let importgooglecalendarerror = getElement('importgooglecalendarerror')
	importgooglecalendarerror.classList.add('display-none')
	let importgooglecalendarerror2 = getElement('importgooglecalendarerror2')
	importgooglecalendarerror2.classList.add('display-none')

	let loginwithgooglescreen = getElement('loginwithgooglescreen')
	loginwithgooglescreen.classList.add('hiddenfade')

	calendar.settings.issyncingtogooglecalendar = false
	calendar.updateSettings()
}


//close login with google popup
let hideloginwithgooglepopup = false
function closeloginwithgooglepopup(){
	hideloginwithgooglepopup = true
	hidegoogleclassroomloginpopup = true
	let loginwithgooglescreen = getElement('loginwithgooglescreen')
	loginwithgooglescreen.classList.add('hiddenfade')
}

//set google calendar
let issettingclientgooglecalendar = false
async function setclientgooglecalendar(requestchanges) {
	let importgooglecalendarerror = getElement('importgooglecalendarerror')
	importgooglecalendarerror.classList.add('display-none')
	let importgooglecalendarerror2 = getElement('importgooglecalendarerror2')
	importgooglecalendarerror2.classList.add('display-none')

	let loginwithgooglescreen = getElement('loginwithgooglescreen')
	loginwithgooglescreen.classList.add('hiddenfade')

	if (!calendar.settings.issyncingtogooglecalendar) return
	if (requestchanges.length == 0) return

	issettingclientgooglecalendar = true

	try {
		//request
		const response = await fetch('/setclientgooglecalendar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				calendar: calendar,
				requestchanges: requestchanges,
				timezonename: Intl.DateTimeFormat().resolvedOptions().timeZone,
				timezoneoffset: new Date().getTimezoneOffset()
			})
		})

		if (response.status == 401) {
			const data = await response.json()
			importgooglecalendarerror.innerHTML = data.error
			importgooglecalendarerror.classList.remove('display-none')
			importgooglecalendarerror2.innerHTML = data.error
			importgooglecalendarerror2.classList.remove('display-none')

			if(!hideloginwithgooglepopup){
				let loginwithgooglescreen = getElement('loginwithgooglescreen')
				loginwithgooglescreen.classList.remove('hiddenfade')
			}
		} else if (response.status == 200) {
			const data = await response.json()

			//make changes
			let responsechanges = data.data
			for (let responsechange of responsechanges) {
				if (responsechange.type == 'createevent') {
					let item = calendar.events.find(d => d.id == responsechange.id)
					if (!item) continue

					item.googleeventid = responsechange.googleeventid
				} else if (responsechange.type == 'createcalendar') {
					let item = calendar.calendars.find(d => d.id == responsechange.id)
					if (!item) continue

					item.googleid = responsechange.googleid
				}else if(responsechange.type == 'editevent'){
					let item = calendar.events.find(d => d.id == responsechange.id)
					if (!item) continue

					item.googlecalendarid = responsechange.googlecalendarid
				}
			}


			calendar.updateEvents()
			calendar.updateHistory(false)

			calendar.updateSettings()
			updatecalendarlist()
		}
	} catch (err) {
		console.log(err)
	}

	issettingclientgooglecalendar = false
}


//get google calendar
let isgettingclientgooglecalendar = false
async function getclientgooglecalendar() {
	let importgooglecalendarerror = getElement('importgooglecalendarerror')
	importgooglecalendarerror.classList.add('display-none')
	let importgooglecalendarerror2 = getElement('importgooglecalendarerror2')
	importgooglecalendarerror2.classList.add('display-none')

	let loginwithgooglescreen = getElement('loginwithgooglescreen')
	loginwithgooglescreen.classList.add('hiddenfade')

	if (!calendar.settings.issyncingtogooglecalendar) return
	if (isgettingclientgooglecalendar) return

	isgettingclientgooglecalendar = true

	let tempstartgetclientgooglecalendardate = Date.now()
	
	try {
		//request
		const response = await fetch('/getclientgooglecalendar', {
			method: 'POST'
		})

		if (response.status == 401) {
			const data = await response.json()
			importgooglecalendarerror.innerHTML = data.error
			importgooglecalendarerror.classList.remove('display-none')
			importgooglecalendarerror2.innerHTML = data.error
			importgooglecalendarerror2.classList.remove('display-none')

			if(!hideloginwithgooglepopup){
				let loginwithgooglescreen = getElement('loginwithgooglescreen')
				loginwithgooglescreen.classList.remove('hiddenfade')
			}
		} else if (response.status == 200) {
			const data = await response.json()

			if(calendar.lastmodified > tempstartgetclientgooglecalendardate || isautoscheduling){
				isgettingclientgooglecalendar = false
				return
			}

			calendar.lastsyncedgooglecalendardate = Date.now()

			//add data
			const { newevents, newcalendars } = getdatafromgooglecalendar(data.data)
			let existingcalendars = calendar.calendars.filter(d => !!d.googleid)
			calendar.events = calendar.events.filter(g => !existingcalendars.find(h => h.googleid == g.googlecalendarid))
			calendar.events.push(...newevents)
			calendar.calendars = calendar.calendars.filter(g => !existingcalendars.find(h => h.googleid == g.googleid))
			calendar.calendars.push(...newcalendars)

			calendar.updateEvents()
			calendar.updateHistory(false)

			calendar.updateSettings()
			updatecalendarlist()
			updateonboardingscreen()

		}
	} catch (err) {
		console.log(err)
	}

	isgettingclientgooglecalendar = false
}





function getRecurrenceString(item) {
	let frequency = item.repeat.frequency
	let interval = item.repeat.interval
	let byday = item.repeat.byday
	let count = item.repeat.count
	let until = item.repeat.until

	const options = {}

	if (frequency != null && frequency < 4) {
		options.freq = 3 - frequency
	}
	if (byday && byday.length > 0) {
		options.byweekday = byday.map((d) => (d + 6) % 7)
	}
	if (interval != null) {
		options.interval = interval
	}
	if (count != null) {
		options.count = count
	}
	if (until != null) {
		options.until = new Date(until)
	}

	return new RRule(options).toString()
}

function getRecurrenceData(item) {
	let frequency, interval, count, until;
	let byday = []
	if (item.recurrence && item.recurrence.length > 0) {
		try {
			const parsedrecurrence = new RRule.fromString(item.recurrence[0])

			frequency = parsedrecurrence.options.freq < 4 ? 3 - parsedrecurrence.options.freq : null
			interval = parsedrecurrence.options.interval
			byday = parsedrecurrence.options.byweekday ? parsedrecurrence.options.byweekday.map((d) => (d + 1) % 7) : []
			count = parsedrecurrence.options.count
			if (parsedrecurrence.options.until) {
				until = new Date(parsedrecurrence.options.until).getTime()
			}
		} catch (error) { }
	}
	return { frequency: frequency, interval: interval, byday: byday, count: count, until: until }
}

const RRule = rrule.RRule
function getdatafromgooglecalendar(listdata) {
	let outputevents = []
	let outputcalendars = []

	for (let tempitem of listdata) {
		let calendardata = tempitem.calendar
		let eventdata = tempitem.events


		//modify existing calendar or create new calendar
		let mycalendar = calendar.calendars.find(r => r.googleid == calendardata.id || (r.isprimary && calendardata.primary))
		if (mycalendar) {
			mycalendar.title = calendardata.summary
			mycalendar.notes = calendardata.description
			mycalendar.readonly = calendardata.accessRole == 'reader' || calendardata.accessRole == 'freeBusyReader'
		} else {
			mycalendar = new Calendar.Calendar(calendardata.summary, calendardata.description, calendardata.accessRole == 'reader' || calendardata.accessRole == 'freeBusyReader', null)
			mycalendar.hexcolor = calendardata.backgroundColor
		}

		mycalendar.googleid = calendardata.id

		outputcalendars.push(mycalendar)


		//events
		for (const event of eventdata) {
			//get properties
			const id = event.id
			const summary = event.summary
			const description = event.description
			const start = event.start
			const end = event.end

			if (!start || !end || !id) continue

			let startdate, enddate;
			if (start.dateTime) {
				startdate = new Date(start.dateTime)
			} else if (start.date) {
				startdate = new Date(`${start.date}T00:00:00`)
				startdate.setHours(0, 0, 0, 0)
			}
			if (end.dateTime) {
				enddate = new Date(end.dateTime)
			} else if (end.date) {
				enddate = new Date(`${end.date}T00:00:00`)
				enddate.setHours(0, 0, 0, 0)
			}

			if (isNaN(startdate.getTime()) || isNaN(enddate.getTime())) continue

			let { frequency, interval, byday, count, until } = getRecurrenceData(event)


			//modify existing event or create new event
			let myevent = calendar.events.find(d => d.googleeventid == id)
			if (myevent) {
				myevent.start.year = startdate.getFullYear()
				myevent.start.month = startdate.getMonth()
				myevent.start.day = startdate.getDate()
				myevent.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

				myevent.end.year = enddate.getFullYear()
				myevent.end.month = enddate.getMonth()
				myevent.end.day = enddate.getDate()
				myevent.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
			} else {
				myevent = new Calendar.Event(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), startdate.getHours() * 60 + startdate.getMinutes(), enddate.getFullYear(), enddate.getMonth(), enddate.getDate(), enddate.getHours() * 60 + enddate.getMinutes(), summary, description)
				myevent.googleeventid = id

				if (mycalendar) {
					myevent.hexcolor = mycalendar.hexcolor
				}
			}

			if (mycalendar) {
				myevent.calendarid = mycalendar.id
				myevent.googlecalendarid = mycalendar.googleid
			}

			myevent.repeat.frequency = frequency
			myevent.repeat.interval = interval
			myevent.repeat.byday = byday
			myevent.repeat.until = until
			myevent.repeat.count = count
			fixrepeat(myevent)

			outputevents.push(myevent)
		}

	}

	return { newevents: outputevents, newcalendars: outputcalendars }
}


let settingstab = 0
function clicksettingstab(index) {
	settingstab = index
	calendar.updateSettings()
}



function hidecalendaritempopup() {
	let calendaritempopup = getElement('calendaritempopup')
	calendaritempopup.classList.add('hiddenpopup')
}

function togglecalendaritempopup(id, button) {
	let calendaritempopup = getElement('calendaritempopup')
	calendaritempopup.classList.toggle('hiddenpopup')

	if (!calendaritempopup.classList.contains('hiddenpopup')) {
		updatecalendaritempopup(id)
	}

	calendaritempopup.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, calendaritempopup) + 'px'
	calendaritempopup.style.left = fixleft(button.getBoundingClientRect().left - calendaritempopup.offsetWidth + button.offsetWidth, calendaritempopup) + 'px'
}

let lastcalendaritempopupid;
function togglecalendaritempopup2(id, button) {
	let calendaritempopup = getElement('calendaritempopup')

	if (id != lastcalendaritempopupid) {
		calendaritempopup.classList.remove('hiddenpopup')
	} else {
		calendaritempopup.classList.toggle('hiddenpopup')
	}
	lastcalendaritempopupid = id

	if (!calendaritempopup.classList.contains('hiddenpopup')) {
		updatecalendaritempopup(id)
	}

	calendaritempopup.style.top = fixtop(button.getBoundingClientRect().top, calendaritempopup) + 'px'
	calendaritempopup.style.left = fixleft(button.getBoundingClientRect().left + button.offsetWidth, calendaritempopup) + 'px'
}

function updatecalendaritempopup(id) {
	let item = calendar.calendars.find(f => f.id == id)
	if (!item) return
	let calendaritempopup = getElement('calendaritempopup')
	calendaritempopup.innerHTML = `
		<div class="infotop justify-space-between">
			<div class="infotitle">Edit calendar</div>
			<div class="infotoprightgroup">
				<div class="infotopright pointer" onclick="closecalendaritempopup(event)">
					<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
					<g>
					<g opacity="1">
					<path d="M211.65 44.35L44.35 211.65" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
					<path d="M211.65 211.65L44.35 44.35" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
					</g>
					</g>
					</svg>
				</div>
				
			</div>
		</div>

		<div class="info">
			<div class="inputgroup">
				<div class="infotext width90px">Title</div>
				<div class="inputgroupitem flex-1">
					<input placeholder="Add title" onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="renamecalendar(event, '${item.id}')" id="calendaritemtitle" class="infoinput" value="${item.title ? cleanInput(item.title) : ''}">
						<span class="inputline"></span>
					</input>
				</div>
			</div>
	 
			<div class="inputgroup">
				<div class="infotext width90px">Description</div>
				<div class="inputgroupitem flex-1">
					<input placeholder="Add description" onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="editdescriptioncalendar(event, '${item.id}')" id="calendaritemdescription" class="infoinput" value="${item.notes ? cleanInput(item.notes) : ''}">
						<span class="inputline"></span>
					</input>
				</div>
			</div>
	
			<div class="inputgroup">
				<div class="infotext width90px">Color</div>
				<div class="display-flex flex-row gap-6px">
					<div class="eventcolorgroup">
						${DEFAULTCOLORS.map(d => `<div class="eventcolor" style="background-color:${d}" onclick="calendarcolor(event, '${d}', '${item.id}')">${getchecksmall(d == item.hexcolor)}</div>`).join('')}
					</div>
					${!DEFAULTCOLORS.find(d => d == item.hexcolor) ? 
						`<div class="eventcolor eventcolorinputwrap padding-0 overflow-hidden relative" style="background-color:${item.hexcolor}">
							<div class="padding-6px display-flex">
								${getchecksmall(true)}
							</div>
							<input type="color" value="${item.hexcolor}" class="eventcolorinput" onchange="calendarcolor(event, event.target.value, '${item.id}')"/>
						</div>`
						:
						`<div class="relative eventcolorinputwrap border-round text-14px text-primary background-tint-1 pointer transition-duration-100 hover:background-tint-2">
							<div class="padding-6px display-flex">
								<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallfill">
									<g>
									<path d="M128 6.1875C121.925 6.1875 117 11.1124 117 17.1875L117 117L17.1875 117C11.1124 117 6.1875 121.925 6.1875 128C6.1875 134.075 11.1124 139 17.1875 139L117 139L117 238.812C117 244.888 121.925 249.813 128 249.812C134.075 249.812 139 244.888 139 238.812L139 139L238.812 139C244.888 139 249.813 134.075 249.812 128C249.812 121.925 244.888 117 238.812 117L139 117L139 17.1875C139 11.1124 134.075 6.1875 128 6.1875Z" fill-rule="nonzero" opacity="1" ></path>
									</g>
								</svg>
							</div>
							<input type="color" class="eventcolorinput" onchange="calendarcolor(event, event.target.value, '${item.id}')"/>
						</div>`}
				</div>
			</div>

			${item.subscriptionurl ? `<div class="text-blue text-14px break-word overflow-hidden width-full">Subscribed to ${item.subscriptionurl}</div>` : ''}

	 		${!item.isprimary ? `<div class="pointer text-14px width-fit background-red hover:background-red-hover padding-8px-12px border-8px text-white transition-duration-100" onclick="deletecalendar('${item.id}')">Delete calendar</div>` : ''}
		</div>`

}

function closecalendaritempopup() {
	let calendaritempopup = getElement('calendaritempopup')
	calendaritempopup.classList.add('hiddenpopup')
}

function renamecalendar(event, id) {
	let item = calendar.calendars.find(f => f.id == id)
	if (!item) return

	let calendaritemtitle = getElement('calendaritemtitle')
	item.title = calendaritemtitle.value

	calendar.updateSettings()
	calendar.updateHistory()
}

function editdescriptioncalendar(event, id) {
	let item = calendar.calendars.find(f => f.id == id)
	if (!item) return

	let calendaritemdescription = getElement('calendaritemdescription')
	item.notes = calendaritemdescription.value

	calendar.updateSettings()
	calendar.updateHistory()
}


function calendarcolor(event, index, id) {
	event.stopPropagation()

	let item = calendar.calendars.find(f => f.id == id)
	if (!item) return
	item.hexcolor = index

	if (item.id == null) {
		let calendarevents = calendar.events.filter(f => f.calendarid == null)
		for (let event of calendarevents) {
			event.hexcolor = item.hexcolor
		}
	} else {
		let calendarevents = calendar.events.filter(f => f.calendarid == item.id)
		for (let event of calendarevents) {
			event.hexcolor = item.hexcolor
		}
	}

	calendar.updateSettings()
	calendar.updateEvents()
	calendar.updateHistory()
	updatecalendaritempopup(id)
}

function toggleshowcalendar(event, id) {
	event.stopPropagation()

	let item = calendar.calendars.find(f => f.id == id)
	if (!item) return
	item.hidden = !item.hidden

	calendar.updateEvents()
	selectedeventid = null
	calendar.updateInfo(true)
	calendar.updateSettings()
	calendar.updateHistory()
}

function createcalendar() {
	let calendaritem = new Calendar.Calendar()
	calendar.calendars.push(calendaritem)

	calendar.updateSettings()
	calendar.updateHistory()
}

function deletecalendar(id) {
	calendar.calendars = calendar.calendars.filter(f => f.id != id)
	calendar.events = calendar.events.filter(f => f.calendarid != id)

	calendar.updateEvents()
	selectedeventid = null
	calendar.updateInfo(true)
	calendar.updateHistory()
	calendar.updateSettings()
	hidecalendaritempopup()
}



function opensettingssleep() {
	calendartabs = [3]
	settingstab = 1
	calendar.updateTabs()
	closehelp()
}

function opencreatecalendarbutton() {
	calendartabs = [3]
	settingstab = 2
	calendar.updateTabs()

	closecalendaroptionmenu()
	closehelp()
}


function inputsettingssleepstart(event) {
	let string = event.target.value.toLowerCase()
	let mystartminute = getMinute(string, true).value

	if (mystartminute != null) {
		calendar.settings.sleep.startminute = mystartminute
	}
	calendar.updateSettings()
	calendar.updateHistory()
}

function inputsettingssleepend(event) {
	let string = event.target.value.toLowerCase()
	let myendminute = getMinute(string, true).value

	if (myendminute != null) {
		calendar.settings.sleep.endminute = myendminute
	}
	calendar.updateSettings()
	calendar.updateHistory()
}


function clicksettingstheme(theme) {
	calendar.settings.theme = theme
	calendar.updateSettings()
	updatetheme()
}

function clicksettingstimeformat(militarytime) {
	calendar.settings.militarytime = militarytime
	calendar.updateSettings()

	//update ui
	calendar.updateTabs()
	updatetimepicker()
	updatetodotimepickeronce()
	updatecreatetodotimepickeronce()
}


//HELP

function openbottomhelpmenu(event){
	let helpbutton = event.target
	let bottomhelpmenu = getElement('bottomhelpmenu')
	bottomhelpmenu.classList.toggle('hiddenpopup')

	bottomhelpmenu.style.top = (helpbutton.getBoundingClientRect().top - bottomhelpmenu.offsetHeight) + 'px'
	bottomhelpmenu.style.left = fixleft(helpbutton.getBoundingClientRect().left - bottomhelpmenu.offsetWidth  + helpbutton.offsetWidth, bottomhelpmenu) + 'px'
}

function closehelp() {
	let leftmenuwrap = getElement('leftmenuwrap')
	leftmenuwrap.classList.add('hiddenpopup')

	let bottomhelpmenu = getElement('bottomhelpmenu')
	bottomhelpmenu.classList.add('hiddenpopup')
}


//demo
function opendemo(){
	let videoframe = getElement('videoframe')
	let videopopup = getElement('videopopup')

	videoframe.src = "https://www.youtube.com/embed/d35YefScCwk"
    videopopup.classList.remove('display-none')
}
function closedemovideo(){
	let videoframe = getElement('videoframe')
	let videopopup = getElement('videopopup')

	videoframe.src = ""
    videopopup.classList.add('display-none')
}



//SCHEDULE
function sortduedate(val) {
	return val.sort((a, b) => {
		return new Date(a.endbefore.year, a.endbefore.month, a.endbefore.day, 0, a.endbefore.minute).getTime() - new Date(b.endbefore.year, b.endbefore.month, b.endbefore.day, 0, b.endbefore.minute).getTime()
	})
}
function sortstartdate(val) {
	return val.sort((a, b) => {
		return new Date(a.start.year, a.start.month, a.start.day, 0, a.start.minute).getTime() - new Date(b.start.year, b.start.month, b.start.day, 0, b.start.minute).getTime()
	})
}


//close menu
function clickscheduleframeclose() {
	let autoscheduleframemenu = getElement('autoscheduleframemenu')
	autoscheduleframemenu.classList.add('hiddenfade')
}

//priority
function clickeventpriority(index) {
	let item = calendar.events.find(x => x.id == selectedeventid)
	if (!item) return

	item.priority = index

	fixsubandparenttask(item)

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()
	if(item.type == 1){
		calendar.updateTodo()
	}
}



//time windows

//preset
function clickeventtimewindowpreset(index){
	let item = calendar.events.find(x => x.id == selectedeventid)
	if (!item) return

	let option = TIMEWINDOW_PRESETS[index]
	if (option) {
		item.timewindow.time.startminute = option.time.startminute
		item.timewindow.time.endminute = option.time.endminute
		item.timewindow.day.byday = option.day.byday
	}
	
	calendar.updateEvents()
	calendar.updateTodo()
	calendar.updateInfo()
	calendar.updateHistory()
}

function clickeventtimewindowday(index) {
	let item = calendar.events.find(x => x.id == selectedeventid)
	if (!item) return

	let option = DAY_TIMEWINDOW_OPTION_DATA[index]
	if (!option) return

	item.timewindow.day.byday = option.byday

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()
}

function clickeventtimewindowtime(index) {
	let item = calendar.events.find(x => x.id == selectedeventid)
	if (!item) return

	let option = TIME_TIMEWINDOW_OPTION_DATA[index]
	if (!option) return

	item.timewindow.time.startminute = option.startminute
	item.timewindow.time.endminute = option.endminute

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()
}




function undoschedulesummary() {
	undohistory()
	selectedeventid = null
	calendar.events = getHistory()
	calendar.updateEvents()
	calendar.updateInfo()

	closeschedulesummary()
}

function closeschedulesummary() {
	let schedulesummarymenu = getElement('schedulesummarymenu')
	schedulesummarymenu.classList.add('hiddenpopup')
}

function clickschedulemode(mode) {
	calendar.smartschedule.mode = mode
	calendar.updateSettings()
}



let schedulemytaskslist = []
let schedulemytasksenabled = false
function clickschedulemytasks(event) {
	schedulemytaskslist = [...calendar.todos.filter(item => Calendar.Todo.isSchedulable(item) && (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null) && !Calendar.Todo.isMainTask(item)).map(d => d.id)]
	selectededittodoid = null
	schedulemytasksenabled = true
	calendar.updateTodo()
}

function closeschedulemytasks() {
	schedulemytasksenabled = false
	calendar.updateTodo()
}

function selectallschedulemytasks(){
	if(schedulemytaskslist.length > 0){
		schedulemytaskslist = []
	}else{
		schedulemytaskslist = [...calendar.todos.filter(item => Calendar.Todo.isSchedulable(item) && (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null && !Calendar.Todo.isMainTask(item))).map(d => d.id)]
	}
	calendar.updateTodo()
}


//select all subtasks
function toggleschedulesubtasks(event, id){
	let item = calendar.todos.find(g => g.id == id)
	if (!item) return

	let children = Calendar.Todo.getSubtasks(item)
	if(children.filter(d => Calendar.Todo.isTodo(d)).every(d => schedulemytaskslist.find(g => g == d.id))){
		for(let tempitem of children){
			schedulemytaskslist = schedulemytaskslist.filter(d => d != tempitem.id)
		}
	}else{
		for(let tempitem of children.filter(d => Calendar.Todo.isSchedulable(d))){
			if(!schedulemytaskslist.includes(tempitem.id)){
				schedulemytaskslist.push(tempitem.id)
			}
		}
	}

	calendar.updateTodo()
}

//select task
function toggleschedulemytask(event, id) {
	let item = calendar.todos.find(g => g.id == id)
	if (!item) return
	if (!Calendar.Todo.isSchedulable(item)) {
		return
	}

	if (schedulemytaskslist.find(g => g == item.id)) {
		schedulemytaskslist = schedulemytaskslist.filter(d => d != item.id)
	} else {
		schedulemytaskslist.push(item.id)
	}

	calendar.updateTodo()
}


//confirm schedule tasks
function submitschedulemytasks() {
	let mytodos = calendar.todos.filter(d => schedulemytaskslist.find(f => f == d.id))

	if (mytodos.length > 0) {
		closeschedulemytasks()
		startAutoSchedule({scheduletodos: mytodos})
	}
}



function startAutoSchedule({scheduletodos}) {
	if (isautoscheduling == true) return

	let oldcalendartabs = [...calendartabs]


	let finalscheduleevents = calendar.events.filter(d => Calendar.Event.isSchedulable(d))
	let finalscheduletodos = calendar.todos.filter(d => Calendar.Todo.isSchedulable(d) && scheduletodos.find(g => g.id == d.id) && Calendar.Todo.getSubtasks(d).length == 0)

	let addedtodos = []
	for (let item of finalscheduletodos) {
		addedtodos.push(geteventfromtodo(item))
	}
	if (addedtodos.length > 0) {
		calendar.todos = calendar.todos.filter(d => !addedtodos.find(f => f.id == d.id))
		calendar.events = calendar.events.filter(d => !addedtodos.find(f => f.id == d.id))
		calendar.events.push(...addedtodos)
	}


	if(addedtodos.length > 0){
		if(mobilescreen){
			calendartabs = [0]
		}
	}


	let scheduleitems = calendar.events.filter(d => finalscheduletodos.find(f => f.id == d.id) || finalscheduleevents.find(g => g.id == d.id))

	if (scheduleitems.length == 0) return

	//update
	if (!isEqualArray(calendartabs, oldcalendartabs)) {
		calendar.updateTabs()
	} else  {
		calendar.updateEvents()
	}

	if(addedtodos.length > 0){
		calendar.updateTodo()
	}

	//start
	autoScheduleV2({smartevents: scheduleitems, addedtodos: addedtodos})
}



//FEEDBACK
async function submitfeedback(event) {
	event.preventDefault()

	let feedbackform = getElement('feedbackform')
	let feedbackformquestion1 = getElement('feedbackformquestion1')
	let feedbackformquestion2 = getElement('feedbackformquestion2')
	let feedbackformquestion3 = getElement('feedbackformquestion3')

	let content = `Question 1: ${feedbackformquestion1.value}\nQuestion 2: ${feedbackformquestion2.value}\nQuestion 3: ${feedbackformquestion3.value}`

	const response = await fetch(`/sendmessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ content: content })
	})
	if (response.status == 200) {
		feedbackform.reset()

		let thankyoufeedback = getElement('thankyoufeedback')
		thankyoufeedback.classList.remove('display-none')

		let feedbackgroup = getElement('feedbackgroup')
		feedbackgroup.classList.add('display-none')
	}
}

function clickfeedbackdone() {
	let thankyoufeedback = getElement('thankyoufeedback')
	thankyoufeedback.classList.add('display-none')

	let feedbackgroup = getElement('feedbackgroup')
	feedbackgroup.classList.remove('display-none')
}

//SUMMARY

function getlineprogressbar(value, max) {
	let percent = value / max * 100
	return `<div class="lineprogressbar">
	 	<div class="lineprogressbarchild" style="width:${percent}%"></div>
	</div>`
}


function getcircleprogressbar(value, max, text, color) {
	let degrees = value / max * 360
	if (max == 0) {
		degrees = 0
	}
	let rotation1 = Math.min(-135 + degrees, 45)
	let rotation2 = Math.max(-135 + degrees, 45)

	return `
		<div class="circleprogressbarwrap">
			<div class="circleprogressbarbackground"></div>
			<div class="circleprogressbarright">
				<div class="circleprogressbarfillright" style="border-color: ${color} ${color} transparent transparent; transform: rotate(${rotation1}deg);"></div>
			</div>
			<div class="circleprogressbarleft">
				<div class="circleprogressbarfillleft" style="border-color: ${color} ${color} transparent transparent; transform: rotate(${rotation2}deg);"></div>
			</div>
			<div class="circleprogressbartext">${text}</div>
		</div>`
}

//TODOS



function fixsubandparenttask(item){
	let parent;
	if(Calendar.Todo.isSubtask(item)){
		parent = Calendar.Todo.getMainTask(item)
	}else if(Calendar.Todo.isMainTask(item)){
		parent = item
	}
	if(!parent) return

	let children = Calendar.Todo.getSubtasks(parent)
	if(children.length == 0) return

	//update parent based on children
	if(Calendar.Todo.isSubtask(item)){
		parent.completed = children.every(d => d.completed)

		parent.endbefore = deepCopy(item.endbefore)
		parent.priority = item.priority

		for(let childitem of children){
			childitem.endbefore = deepCopy(item.endbefore)
			childitem.priority = item.priority
		}
	}

	//sync child to parent
	if(Calendar.Todo.isMainTask(item)){
		let setcompleted = (children.every(d => d.completed) && !item.completed) || (item.completed)
		for(let childitem of children){
			if(setcompleted){
				childitem.completed = item.completed
			}
			childitem.endbefore = deepCopy(item.endbefore)
			childitem.priority = item.priority
		}
	}
}


//fix and update recurring todos
function fixrecurringtodo(item){
	if(item.repeat.frequency != null && item.repeat.interval != null){
		let relatedtodos = sortduedate([item, ...[...calendar.todos, ...calendar.events].filter(d => d.repeatid == item.id || d.repeatid == item.repeatid)])

		let originaltodo = [...calendar.todos, ...calendar.events].find(d => item.repeatid ? d.id == item.repeatid : d.id == item.id)

		let lasttodo = relatedtodos[relatedtodos.length - 1]
		
		//complete past todos
		if(item.completed){
			for(let tempitem of relatedtodos){
				if(tempitem.id == item.id) break
				tempitem.completed = true
			}
		}

		//if deleted todo, adjust repeatids
		if(![...calendar.todos, ...calendar.events].find(d => d.id == item.id)){
			let filteredtodos = relatedtodos.filter(d => d.id != item.id)
			if(filteredtodos[0]){
				for(let tempitem of relatedtodos){
					tempitem.repeatid = filteredtodos[0].id
				}
				item.repeatid = null
			}
		}

		if(!originaltodo) return

		if(item.id != lasttodo.id) return

		if(lasttodo.completed){
			let lasttododuedate = new Date(lasttodo.endbefore.year, lasttodo.endbefore.month, lasttodo.endbefore.day, 0, lasttodo.endbefore.minute)

			let newtododuedate = new Date(lasttododuedate)
			
			if (item.repeat.frequency == 1) {
				let oldday = lasttododuedate.getDay()
				if(item.repeat.byday.length > 0){
					let oldbydayindex = item.repeat.byday.findIndex(d => d == oldday)
					if(oldbydayindex == -1){
						let mindayindex = Math.min(...item.repeat.byday)
						oldbydayindex = item.repeat.byday.findIndex(d => d == mindayindex)
						lasttododuedate.setDate(lasttododuedate.getDate() + (oldbydayindex - lasttododuedate.getDay() + 7) % 7)

						let newbyday = item.repeat.byday[(oldbydayindex) % item.repeat.byday.length]
						newtododuedate.setDate(newtododuedate.getDate() + newbyday - newtododuedate.getDay())
					}else{
						let newbyday = item.repeat.byday[(oldbydayindex + 1) % item.repeat.byday.length]
						newtododuedate.setDate(newtododuedate.getDate() + newbyday - newtododuedate.getDay())
					}
				}
			}
			
			if(newtododuedate.getTime() <= lasttododuedate.getTime()){
				for(let i = 0; i < item.repeat.interval; i++){
					if (item.repeat.frequency == 0) {
						newtododuedate.setDate(newtododuedate.getDate() + 1)
					} else if (item.repeat.frequency == 1) {
						newtododuedate.setDate(newtododuedate.getDate() + 7)
					} else if (item.repeat.frequency == 2) {
						newtododuedate.setMonth(newtododuedate.getMonth() + 1)
					} else if (item.repeat.frequency == 3) {
						newtododuedate.setFullYear(newtododuedate.getFullYear() + 1)
					}
				}
			}

			//until
			if(lasttodo.repeat.until && newtododuedate.getTime() > new Date(lasttodo.repeat.until).getTime()){
				return
			}
			//count
			if(lasttodo.repeat.count && relatedtodos.length >= lasttodo.repeat.count){
				return
			}

			let newitem = deepCopy(lasttodo)

			newitem.endbefore.year = newtododuedate.getFullYear()
			newitem.endbefore.month = newtododuedate.getMonth()
			newitem.endbefore.day = newtododuedate.getDate()
			newitem.endbefore.minute = newtododuedate.getHours() * 60 + newtododuedate.getMinutes()
			
			newitem.completed = false
			newitem.id = generateID()
			newitem.repeatid = originaltodo.id


			if(Calendar.Event.isEvent(lasttodo)){
				//schedule event
				let newitemtodo = gettodofromevent(newitem)
				calendar.todos.push(newitemtodo)

				startAutoSchedule({scheduletodos: [newitemtodo]})
			}else{
				calendar.todos.push(newitem)
			}
			
		}
	}
}


//get todos
function gettodos(option1, option2) {
	let output = []
	let data = calendar.todos

	for (let item of data) {
		if (option1 == null && option2 == null) {
			//all todos
			output.push(item)
		} else {
			if (item.endbefore.year == null || item.endbefore.month == null || item.endbefore.day == null || item.endbefore.minute == null) continue
			let itemendbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)

			if (option1 == null || option2 == null) {
				//(null, date) is all todos before date
				//(date, null) is all todos after or on date

				if (option2 == null) {
					if (itemendbeforedate.getTime() >= option1.getTime()) {
						output.push(item)
					}
				} else if (option1 == null) {
					if (itemendbeforedate.getTime() < option2.getTime()) {
						output.push(item)
					}
				}
			} else {
				//between start and end of range
				if (itemendbeforedate.getTime() >= option1.getTime() && itemendbeforedate.getTime() < option2.getTime()) {
					output.push(item)
				}
			}
		}
	}
	return output
}



//create event
function opencreateevent(event) {
	let createeventpopup = getElement('createeventpopup')
	createeventpopup.classList.toggle('hiddenpopup')

	let button = event.target

	createeventpopup.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createeventpopup) + 'px'
	createeventpopup.style.left = fixleft(button.getBoundingClientRect().left - createeventpopup.offsetWidth * 0.5 + button.offsetWidth * 0.5, createeventpopup) + 'px'

	resetcreateevent()

	if (!createeventpopup.classList.contains('hiddenpopup')) {
		let createeventtitle = getElement('createeventtitle')
		createeventtitle.focus()
	}
}
function closecreateevent() {
	let createeventpopup = getElement('createeventpopup')
	createeventpopup.classList.add('hiddenpopup')

	let createeventtitle = getElement('createeventtitle')
	createeventtitle.blur()
}

function resetcreateevent() {
	let createeventtitle = getElement('createeventtitle')
	createeventtitle.value = ''

	createeventstartvalue = {
		year: null,
		month: null,
		day: null,
		minute: null
	}
	createeventendvalue = {
		year: null,
		month: null,
		day: null,
		minute: null
	}
	createeventdurationvalue = null

	typeaddevent()
}


function typeaddevent(event, submit) {
	let createeventtitle = getElement('createeventtitle')
	let finalstring = createeventtitle.value

	let currentdate = new Date()

	let finalstartyear, finalstartmonth, finalstartday, finalstartminute, finalendyear, finalendmonth, finalendday, finalendminute, finalduration;

	let tempmatch1 = getDate(finalstring)

	let temptext = tempmatch1.match ? finalstring.replace(tempmatch1.match, '') : finalstring
	let tempmatch5 = getMinute(temptext, false, finalstring)
	if (tempmatch1.match || tempmatch5.match) {
		let regex = new RegExp(`\\b((from|(start|starts|starting)(\\s+(on|at|from))?)\\s+)?((${tempmatch1.match}\\s+((at|on|by)\\s+)?${tempmatch5.match})|(${tempmatch5.match}\\s+((at|on|by)\\s+)?${tempmatch1.match})|(${tempmatch1.match})|(${tempmatch5.match}))\\b`, 'i')

		let tempmatch2 = finalstring.match(regex)
		if (tempmatch2) {			
			let tempmatch6 = getDate(tempmatch2[0])
			if (tempmatch6) {
				[finalstartyear, finalstartmonth, finalstartday] = tempmatch6.value
			}

			let temptext4 = tempmatch2[0].replace(tempmatch6.match, '')
			let tempmatch7 = getMinute(temptext4, true, finalstring)
			if (tempmatch7) {
				finalstartminute = tempmatch7.value
			}
		}

		finalstring = finalstring.replace(regex, '')
	}


	let tempmatch9 = getDate(finalstring)

	let temptext2 = tempmatch9.match ? finalstring.replace(tempmatch9.match, '') : finalstring
	let tempmatch3 = getMinute(temptext2, false, finalstring)
	if (tempmatch9.match || tempmatch3.match) {
		let regex = new RegExp(`((\\b(until|to|through|(end|ends|ending)(\\s+(on|at))?)\\s+)|-)?((${tempmatch9.match}\\s+${tempmatch3.match})|(${tempmatch3.match}\\s+${tempmatch9.match})|(${tempmatch3.match})|(${tempmatch3.match}))\\b`, 'i')

		let tempmatch4 = finalstring.match(regex)
		if (tempmatch4) {
			let tempmatch7 = getDate(tempmatch4[0])
			if (tempmatch7) {
				[finalendyear, finalendmonth, finalendday] = tempmatch7.value
			}

			let temptext3 = tempmatch4[0].replace(tempmatch7.match, '')
			let tempmatch8 = getMinute(temptext3, true, finalstring)
			if (tempmatch8) {
				finalendminute = tempmatch8.value
			}
		}

		finalstring = finalstring.replace(regex, '')
	}

	let tempmatch13 = getDuration(finalstring)
	if (tempmatch13.match) {
		let regex = new RegExp(`\\b(((takes|needs|requires|takes\\s+me|lasts)\\s+)?${tempmatch13.match})\\b`)
		let tempmatch14 = finalstring.match(regex)
		if (tempmatch14) {
			finalduration = tempmatch13.value
		}

		finalstring = finalstring.replace(regex, '')
	}


	//modify values

	//duration
	if (finalduration == null) {
		finalduration = 60
	}

	//start

	if ((finalstartyear == null || finalstartmonth == null || finalstartday == null) && finalstartminute == null) {
		finalstartyear = currentdate.getFullYear()
		finalstartmonth = currentdate.getMonth()
		finalstartday = currentdate.getDate()
		finalstartminute = ceil(currentdate.getHours() * 60 + currentdate.getMinutes(), 5)
	}
	if (finalstartyear == null || finalstartmonth == null || finalstartday == null) {
		finalstartyear = currentdate.getFullYear()
		finalstartmonth = currentdate.getMonth()
		finalstartday = currentdate.getDate()
	}
	if (finalstartminute == null) {
		finalstartminute = 0
	}

	//end
	if ((finalendyear == null || finalendmonth == null || finalendday == null) && finalendminute == null) {
		finalendyear = finalstartyear
		finalendmonth = finalstartmonth
		finalendday = finalstartday
		finalendminute = finalstartminute + finalduration
	}
	if (finalendyear == null || finalendmonth == null || finalendday == null) {
		finalendyear = finalstartyear
		finalendmonth = finalstartmonth
		finalendday = finalstartday
	}
	if (finalendminute == null) {
		finalendminute = finalstartminute + finalduration
	}


	if (new Date(finalstartyear, finalstartmonth, finalstartday, 0, finalstartminute).getTime() > new Date(finalendyear, finalendmonth, finalendday, 0, finalendminute).getTime()) {
		[finalstartyear, finalstartmonth, finalstartday, finalstartminute, finalendyear, finalendmonth, finalendday, finalendminute] = [finalendyear, finalendmonth, finalendday, finalendminute, finalstartyear, finalstartmonth, finalstartday, finalstartminute]
	}


	//set values

	createeventstartvalue.year = finalstartyear
	createeventstartvalue.month = finalstartmonth
	createeventstartvalue.day = finalstartday
	createeventstartvalue.minute = finalstartminute

	createeventendvalue.year = finalendyear
	createeventendvalue.month = finalendmonth
	createeventendvalue.day = finalendday
	createeventendvalue.minute = finalendminute


	finalstring = finalstring.trim()

	if (submit) {
		return finalstring
	}
}


let createeventstartvalue = {
	year: null,
	month: null,
	day: null,
	minute: null
}
let createeventendvalue = {
	year: null,
	month: null,
	day: null,
	minute: null
}
let createeventdurationvalue;



function submitcreateevent(event) {
	stoprecognition()

	let title = typeaddevent(event, true)

	let myduration = createeventdurationvalue

	let tempstartdate = new Date(createeventstartvalue.year, createeventstartvalue.month, createeventstartvalue.day, 0, createeventstartvalue.minute)
	let tempenddate = new Date(createeventendvalue.year, createeventendvalue.month, createeventendvalue.day, 0, createeventendvalue.minute)

	if (!isNaN(tempstartdate.getTime()) && !isNaN(tempenddate.getTime())) {
		let item = new Calendar.Event(tempstartdate.getFullYear(), tempstartdate.getMonth(), tempstartdate.getDate(), tempstartdate.getHours() * 60 + tempstartdate.getMinutes(), tempenddate.getFullYear(), tempenddate.getMonth(), tempenddate.getDate(), tempenddate.getHours() * 60 + tempenddate.getMinutes(), title)
		calendar.events.push(item)

		calendaryear = tempstartdate.getFullYear()
		calendarmonth = tempstartdate.getMonth()
		calendarday = tempstartdate.getDate()

		calendar.updateCalendar()
		calendar.updateHistory()

		closecreateevent()

		scrollcalendarY(tempstartdate.getHours() * 60 + tempstartdate.getMinutes())
	}
}





function resetcreatetodo() {
	let nextdate = new Date()
	nextdate.setHours(0, 0, 0, 0)
	nextdate.setDate(nextdate.getDate() + 1)
	nextdate.setMinutes(-1)

	let todoinputnotes = getElement('todoinputnotes')
	todoinputnotes.value = ''
	let todoinputtitle = getElement('todoinputtitle')
	todoinputtitle.value = ''

	let todoinputtitleonboarding = getElement('todoinputtitleonboarding')
	todoinputtitleonboarding.value = ''
	let todoinputnotesonboarding = getElement('todoinputnotesonboarding')
	todoinputnotesonboarding.value = ''

	let todoinputtitleprompttodotoday = getElement('todoinputtitleprompttodotoday')
	todoinputtitleprompttodotoday.value = ''
	let todoinputnotesprompttodotoday = getElement('todoinputnotesprompttodotoday')
	todoinputnotesprompttodotoday.value = ''

	createtododurationvalue = 30
	createtododuedatevalue = {
		year: nextdate.getFullYear(),
		month: nextdate.getMonth(),
		day: nextdate.getDate(),
		minute: nextdate.getHours() * 60 + nextdate.getMinutes()
	}
	createtodopriorityvalue = 0
	createtodoavailabilityvalue = 0
	createtodorepeatvalue = {
		frequency: null,
		interval: null,
		byday: [],
		count: null,
		until: null
	}

	createtodosubtasks = []

	createtodoshowsubtask = false


	resetcreatetodocreatesubtask()
	
	typeaddtask()
}


//create todo
let createtodosubtasks = []
let createtododurationvalue;
let createtodoavailabilityvalue = 0
let createtododuedatevalue = {
	year: null,
	month: null,
	day: null,
	minute: null
}
let createtodopriorityvalue;
let createtodorepeatvalue = {
	frequency: null,
	interval: null,
	byday: [],
	count: null,
	until: null
}

function updatecreatetodo() {
	let createtododuration = getElement('createtododuration')
	let createtododuedate = getElement('createtododuedate')
	let createtodopriority = getElement('createtodopriority')
	let createtodoavailability = getElement('createtodoavailability')
	let createtodorepeat = getElement('createtodorepeat')

	let createtododurationonboarding = getElement('createtododurationonboarding')
	let createtododuedateonboarding = getElement('createtododuedateonboarding')
	let createtodopriorityonboarding = getElement('createtodopriorityonboarding')
	let createtodoavailabilityonboarding = getElement('createtodoavailabilityonboarding')
	let createtodorepeatonboarding = getElement('createtodorepeatonboarding')

	let createtododurationprompttodotoday = getElement('createtododurationprompttodotoday')
	let createtododuedateprompttodotoday = getElement('createtododuedateprompttodotoday')
	let createtodopriorityprompttodotoday = getElement('createtodopriorityprompttodotoday')
	let createtodoavailabilityprompttodotoday = getElement('createtodoavailabilityprompttodotoday')
	let createtodorepeatprompttodotoday = getElement('createtodorepeatprompttodotoday')

	let currentdate = new Date()

	let duedate;
	if (createtododuedatevalue.year != null && createtododuedatevalue.month != null && createtododuedatevalue.day != null && createtododuedatevalue.minute != null) {
		duedate = new Date(createtododuedatevalue.year, createtododuedatevalue.month, createtododuedatevalue.day, 0, createtododuedatevalue.minute)
	}

	//duration
	let tempdurationvalue = `Takes ${getDHMText(createtododurationvalue)}`
	createtododuration.innerHTML = tempdurationvalue
	createtododurationonboarding.innerHTML = tempdurationvalue
	createtododurationprompttodotoday.innerHTML = tempdurationvalue


	//time slot
	let tempavailabilityvalue = `Time slot: ${TIMEWINDOW_PRESETS[createtodoavailabilityvalue].text}`
	createtodoavailability.innerHTML = tempavailabilityvalue
	createtodoavailabilityprompttodotoday.innerHTML = tempavailabilityvalue
	createtodoavailabilityonboarding.innerHTML = tempavailabilityvalue

	//due date
	let tempduedatevalue = duedate ? `
	<div class="display-flex pointer-none flex-row align-center gap-6px">
		<div class="${duedate.getTime() < currentdate.getTime() ? 'text-red ' : 'text-blue'} text-14px padding-top-6px padding-bottom-6px">Due ${getDMDYText(duedate)} ${getHMText(duedate.getHours() * 60 + duedate.getMinutes())}</div>
   
		<div class="tooltip pointer display-flex pointer-auto padding-6px hover:background-tint-1 transition-duration-100 border-8px" onclick="inputcreatetodoitemnotdue(event)">
		   <svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsmallquaternary">
		   <g>
		   <g opacity="1">
		   <path d="M211.65 44.35L44.35 211.65" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
		   <path d="M211.65 211.65L44.35 44.35" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="miter" stroke-width="20"></path>
		   </g>
		   </g>
		   </svg>
			<span class="tooltiptextcenter">Remove due date</span>
		</div>
   </div>` : '<div class="pointer-none text-quaternary padding-top-6px padding-bottom-6px">No due date</div>'
	createtododuedate.innerHTML = tempduedatevalue
	createtododuedateonboarding.innerHTML = tempduedatevalue
	createtododuedateprompttodotoday.innerHTML = tempduedatevalue

	//priority
	let temppriorityvalue = `<span class="pointer-none ${['text-quaternary', 'text-orange', 'text-red'][createtodopriorityvalue]}">${['Low', 'Medium', ' High'][createtodopriorityvalue]} priority</span>`
	createtodopriority.innerHTML = temppriorityvalue
	createtodopriorityonboarding.innerHTML = temppriorityvalue
	createtodopriorityprompttodotoday.innerHTML = temppriorityvalue


	//repeat
	let temprepeatvalue = createtodorepeatvalue.frequency == null && createtodorepeatvalue.interval == null ? '<span class="text-quaternary pointer-none">No repeat</span>' : `<span class="pointer-none text-green">Repeats ${getRepeatText({ repeat: createtodorepeatvalue }, true)}</span>`
	createtodorepeat.innerHTML = temprepeatvalue
	createtodorepeatprompttodotoday.innerHTML = temprepeatvalue
	createtodorepeatonboarding.innerHTML = temprepeatvalue

	//add button # of tasks
	let finalstring = todoinputtitle.value || todoinputtitleonboarding.value || todoinputtitleprompttodotoday.value
	finalstring = finalstring.split('\n').filter(d => d != '')
	let length = Math.max(finalstring.length, 1)

	let string = `Add ${length == 1 ? `` : `<span class="text-black whitebackgroundbutton text-14px border-round circlehighlight">${length}</span>`}`

	let submitcreatetodoaddnumber = getElement('submitcreatetodoaddnumber')
	submitcreatetodoaddnumber.innerHTML = string

	let submitcreatetodoaddnumberonboarding = getElement('submitcreatetodoaddnumberonboarding')
	submitcreatetodoaddnumberonboarding.innerHTML = string

	let submitcreatetodoaddnumberprompttodotoday = getElement('submitcreatetodoaddnumberprompttodotoday')
	submitcreatetodoaddnumberprompttodotoday.innerHTML = string


	//create todo tab
	let createtodoprojectwrap = getElement('createtodoprojectwrap')
	let clickaddsubtaskbutton = getElement('clickaddsubtaskbutton')

	if(createtodoshowsubtask){
		clickaddsubtaskbutton.classList.add('display-none')
		createtodoprojectwrap.classList.remove('display-none')
	}else{
		clickaddsubtaskbutton.classList.remove('display-none')
		createtodoprojectwrap.classList.add('display-none')
	}

	//subtasks
	let createtodosubtasklist = getElement('createtodosubtasklist')
	let output = []
	for(let item of createtodosubtasks){
	
		output.push(`<div class="relative todoitem todoitemwrap">

		<div class="todoitemcontainer padding-top-12px padding-bottom-12px margin-left-12px margin-right-12px relative">

			   <div class="display-flex flex-row gap-12px">
			   
				<div class="scalebutton todoitemcheckbox tooltip display-flex">
					${getcheckcircle(false)}
				</div>

			   <div class="justify-flex-end flex-1 display-flex flex-row small:flex-column gap-12px">

				   <div class="flex-1 display-flex flex-column gap-6px">
					   <div class="align-flex-start width-full display-flex flex-column">
		
						   <div class="white-space-normal break-word todoitemtext text-16px">
							   ${Calendar.Todo.getTitle(item)}
						   </div>

					   </div>
	   
					   <div class="display-flex flex-wrap-wrap flex-row align-center column-gap-12px row-gap-6px">

							<div class="width-fit background-green transition-duration-100 hover:background-green-hover badgepadding border-round todoitemtext nowrap text-14px pointer-auto pointer transition-duration-100 text-white transition-duration-100 popupbutton">
								Takes ${getDHMText(item.duration)}
							</div>

					   </div>

				   </div>
		   

			   </div>

			   
			   <div class="gap-6px todoitembuttongroup z-index-1 height-fit justify-flex-end flex-row small:visibility-visible">						
	   
				   <div class="backdrop-blur popupbutton tooltip infotopright hover:background-tint-1 pointer-auto transition-duration-100 border-8px pointer" onclick="deletecreatetodosubtask('${item.id}')">
					   <svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
					   <g>
					   <path d="M207.414 223.445L207.414 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M71.3433 246L184.657 246" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M207.414 223.445C207.414 235.902 197.226 246 184.657 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M238 57.6433L18 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M48.5864 223.445L48.5864 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M48.5864 223.445C48.5864 235.902 58.775 246 71.3433 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M96.1228 10L159.881 10" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M173.737 23.7283C173.737 16.1464 167.534 10 159.881 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M82.2668 23.7283C82.2668 16.1464 88.4703 10 96.1228 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M82.2668 23.7283L82.2668 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M173.737 23.7283L173.737 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
					   <path d="M165.379 101.49L165.379 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
					   <path d="M90.6212 101.49L90.6212 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
					   <path d="M128 101.49L128 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
					   </g>
					   </svg>

				   </div>

			   </div>
	
		   </div>

	   </div>


	</div>`)
	}
	
	createtodosubtasklist.innerHTML = output.join('')

	if(output.length == 0){
		createtodosubtasklist.classList.add('display-none')
	}else{
		createtodosubtasklist.classList.remove('display-none')
	}
}


let createtodoshowsubtask = false
function clickaddsubtask(){
	createtodoshowsubtask = true

	updatecreatetodo()

	let createtodosubtaskinput = getElement('createtodosubtaskinput')
	createtodosubtaskinput.focus()
}


//add sub task button
function togglecreatetodosubtaskpopup(event){
	let button = event.target
	
	let createtodosubtasksuggestions = getElement('createtodosubtasksuggestions')
	createtodosubtasksuggestions.classList.toggle('hiddenpopup')

	createtodosubtasksuggestions.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createtodosubtasksuggestions) + 'px'
	createtodosubtasksuggestions.style.left = fixleft(button.getBoundingClientRect().left + button.offsetWidth - createtodosubtasksuggestions.offsetWidth, createtodosubtasksuggestions) + 'px'
}
function autocreatesubtask(eachduration){
	let createtodosubtaskinput = getElement('createtodosubtaskinput')
	let string = createtodosubtaskinput.value

	let createtodosubtasksuggestions = getElement('createtodosubtasksuggestions')
	createtodosubtasksuggestions.classList.add('hiddenpopup')


	let timeleft = createtododurationvalue - createtodosubtasks.reduce((sum, obj) => sum + obj.duration, 0)
	while(timeleft > 0){
		createtodosubtasks.push({ title: null, duration: Math.min(eachduration, timeleft), id: generateID() })
		timeleft -= eachduration
	}

	updatecreatetodo()
}
function closeautofillsubtasks(){
	let createtodosubtasksuggestions = getElement('createtodosubtasksuggestions')
	createtodosubtasksuggestions.classList.add('hiddenpopup')
}


//custom subtask
function submitcreatetodosubtask(event){
	let createtodosubtaskinput = getElement('createtodosubtaskinput')
	let string = createtodosubtaskinput.value

	let createtodosubtaskduration = getElement('createtodosubtaskduration')
	let string2 = createtodosubtaskduration.value
	
	let myduration;

	let duration = getDuration(string2).value
	if(duration != null && duration != 0){
		myduration = duration

	}

	if(myduration == null){
		myduration = 60
	}

	createtodosubtasks.push({ title: string, duration: myduration, id: generateID() })

	updatecreatetodo()
	
	resetcreatetodocreatesubtask()

	let createtodosubtasklist = getElement('createtodosubtasklist')
	createtodosubtasklist.scrollTo(0, createtodosubtasklist.scrollHeight)
}
function resetcreatetodocreatesubtask(){
	let createtodosubtaskinput = getElement('createtodosubtaskinput')
	createtodosubtaskinput.value = ''

	let createtodosubtaskduration = getElement('createtodosubtaskduration')
	createtodosubtaskduration.value = '1h'
}

function deletecreatetodosubtask(id){
	createtodosubtasks = createtodosubtasks.filter(d => d.id != id)

	updatecreatetodo()
}



function closetodoitemduration() {
	let createtododuration = getElement('createtododuration')
	createtododuration.classList.add('hiddenpopup')

	let createtododurationonboarding = getElement('createtododurationonboarding')
	createtododurationonboarding.classList.add('hiddenpopup')

	let createtododurationprompttodotoday = getElement('createtododurationprompttodotoday')
	createtododurationprompttodotoday.classList.add('hiddenpopup')
}
function closetodoitemduedate() {
	let createtododuedate = getElement('createtododuedate')
	createtododuedate.classList.add('hiddenpopup')

	let createtododuedateonboarding = getElement('createtododuedateonboarding')
	createtododuedateonboarding.classList.add('hiddenpopup')

	let createtododuedateprompttodotoday = getElement('createtododuedateprompttodotoday')
	createtododuedateprompttodotoday.classList.add('hiddenpopup')
}


/*
	QUICK REFERENCE:

	clickcreatetododuration()
	clickcreatetododuedate()
	clickcreatetodopriority()
	clickcreatetodoavailability()
	clickcreatetodorepeat()
*/


//click on repeat
function clickcreatetodorepeat(event, id) {
	//ui
	let button = event.target
	let createtodoitemrepeat = getElement('createtodoitemrepeat')
	createtodoitemrepeat.classList.toggle('hiddenpopup')

	createtodoitemrepeat.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createtodoitemrepeat) + 'px'
	createtodoitemrepeat.style.left = fixleft(button.getBoundingClientRect().left - createtodoitemrepeat.offsetWidth * 0.5 + button.offsetWidth * 0.5, createtodoitemrepeat) + 'px'


	closecreatetodoitemduedate()
	closecreatetodoitempriority()
	closecreatetodoitemduration()
	closecreatetodoitemavailability()
}


function closecreatetodoitemrepeat() {
	let createtodoitemrepeat = getElement('createtodoitemrepeat')
	createtodoitemrepeat.classList.add('hiddenpopup')
}

function inputcreatetodoitemrepeat(index){
	if(index != null){
		//preset

		let option = REPEAT_OPTION_DATA[index]
		if (!option) return

		createtodorepeatvalue.frequency = option.frequency
		createtodorepeatvalue.interval = option.interval
		createtodorepeatvalue.byday = option.byday

		closecreatetodoitemrepeat()
		updatecreatetodo()

	}
}


//click on due date
function clickcreatetododuedate(event) {
	//ui
	let button = event.target
	let createtodoitemduedate = getElement('createtodoitemduedate')
	createtodoitemduedate.classList.toggle('hiddenpopup')

	createtodoitemduedate.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createtodoitemduedate) + 'px'
	createtodoitemduedate.style.left = fixleft(button.getBoundingClientRect().left - createtodoitemduedate.offsetWidth * 0.5 + button.offsetWidth * 0.5, createtodoitemduedate) + 'px'

	updatecreatetododateinput()
	updatecreatetodotimeinput()

	let duedate;
	if (createtododuedatevalue.year != null && createtododuedatevalue.month != null && createtododuedatevalue.day != null && createtododuedatevalue.minute != null) {
		duedate = new Date(createtododuedatevalue.year, createtododuedatevalue.month, createtododuedatevalue.day, 0, createtododuedatevalue.minute)
	}

	let currentdate = new Date()
	let [year, month, day] = getDate(getDMDYText(duedate ? duedate : new Date())).value
	if (year == null) {
		year = currentdate.getFullYear()
	}
	if (month == null) {
		month = currentdate.getMonth()
	}
	createtododatepickerdate = new Date(year, month, 1)

	updatecreatetodotimepicker()
	updatecreatetododatepicker()

	closecreatetodoitemduration()
	closecreatetodoitempriority()
	closecreatetodoitemavailability()
	closecreatetodoitemrepeat()
}


//click on duration
function clickcreatetododuration(event, id) {
	//ui
	let button = event.target
	let createtodoitemduration = getElement('createtodoitemduration')
	createtodoitemduration.classList.toggle('hiddenpopup')

	createtodoitemduration.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createtodoitemduration) + 'px'
	createtodoitemduration.style.left = fixleft(button.getBoundingClientRect().left - createtodoitemduration.offsetWidth * 0.5 + button.offsetWidth * 0.5, createtodoitemduration) + 'px'

	//input	
	let createtodoitemdurationinput = getElement('createtodoitemdurationinput')
	createtodoitemdurationinput.value = getDHMText(createtododurationvalue)

	closecreatetodoitemduedate()
	closecreatetodoitempriority()
	closecreatetodoitemavailability()
	closecreatetodoitemrepeat()

	updatecreatetodoitemdurationlist()
}


function closecreatetodoitemduration() {
	let createtodoitemduration = getElement('createtodoitemduration')
	createtodoitemduration.classList.add('hiddenpopup')
}
function updatecreatetodoitemdurationlist() {
	let createtodoitemdurationlist = getElement('createtodoitemdurationlist')

	let durations = TODO_DURATION_PRESETS
	let output = []
	for (let item of durations) {
		output.push(`<div class="helpitem" onclick="inputcreatetodoitemduration(event, ${item})">${getDHMText(item)}</div>`)
	}

	createtodoitemdurationlist.innerHTML = output.join('')

	//title
	let createtodoitemdurationtitle = getElement('createtodoitemdurationtitle')
}
updatecreatetodoitemdurationlist()

//input duration
function inputcreatetodoitemduration(event, duration) {

	let myduration;
	if (duration != null) {
		myduration = duration
	} else {
		let createtodoitemdurationinput = getElement('createtodoitemdurationinput')
		let string = createtodoitemdurationinput.value
		myduration = getDuration(string).value
	}

	if (myduration == null) {
		myduration = createtododurationvalue
	}

	if (myduration != null && myduration != 0) {
		createtododurationvalue = myduration

		//close
		closecreatetodoitemduration()
	}

	updatecreatetodo()
}


//click on due date
function clickcreatetododuedate(event) {
	//ui
	let button = event.target
	let createtodoitemduedate = getElement('createtodoitemduedate')
	createtodoitemduedate.classList.toggle('hiddenpopup')

	createtodoitemduedate.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createtodoitemduedate) + 'px'
	createtodoitemduedate.style.left = fixleft(button.getBoundingClientRect().left - createtodoitemduedate.offsetWidth * 0.5 + button.offsetWidth * 0.5, createtodoitemduedate) + 'px'

	updatecreatetododateinput()
	updatecreatetodotimeinput()

	let duedate;
	if (createtododuedatevalue.year != null && createtododuedatevalue.month != null && createtododuedatevalue.day != null && createtododuedatevalue.minute != null) {
		duedate = new Date(createtododuedatevalue.year, createtododuedatevalue.month, createtododuedatevalue.day, 0, createtododuedatevalue.minute)
	}

	let currentdate = new Date()
	let [year, month, day] = getDate(getDMDYText(duedate ? duedate : new Date())).value
	if (year == null) {
		year = currentdate.getFullYear()
	}
	if (month == null) {
		month = currentdate.getMonth()
	}
	createtododatepickerdate = new Date(year, month, 1)

	updatecreatetodotimepicker()
	updatecreatetododatepicker()

	closecreatetodoitemduration()
	closecreatetodoitempriority()
	closecreatetodoitemavailability()
	closecreatetodoitemrepeat()
}

//update input value
function updatecreatetododateinput() {
	let duedate;
	if (createtododuedatevalue.year != null && createtododuedatevalue.month != null && createtododuedatevalue.day != null) {
		duedate = new Date(createtododuedatevalue.year, createtododuedatevalue.month, createtododuedatevalue.day)
	}

	let createtodoitemduedateinput = getElement('createtodoitemduedateinput')
	createtodoitemduedateinput.value = duedate ? getDMDYText(duedate) : 'None'
}
//update input value
function updatecreatetodotimeinput() {
	let createtodoitemduetimeinput = getElement('createtodoitemduetimeinput')
	createtodoitemduetimeinput.value = createtododuedatevalue.minute != null ? getHMText(createtododuedatevalue.minute) : 'None'
}

//close
function closecreatetodoitemduedate() {
	let createtodoitemduedate = getElement('createtodoitemduedate')
	createtodoitemduedate.classList.add('hiddenpopup')
}


//create input ui
function updatecreatetodotimepickeronce() {
	let output = []
	let times = []
	for (let min = 0; min < 1440; min += 60) {
		times.push(min)
	}
	times.push(1440-1)
	for(let min of times){
		output.push(`<div class="helpitem" onclick="inputcreatetodoitemduetime(event, ${min})">${getHMText(min)}</div>`)
	}
	let createtodoitemduetimelist = getElement('createtodoitemduetimelist')
	createtodoitemduetimelist.innerHTML = output.join('')
}
//update input ui
function updatecreatetodotimepicker() {
	let duedate;
	if (createtododuedatevalue.year != null && createtododuedatevalue.month != null && createtododuedatevalue.day != null && createtododuedatevalue.minute != null) {
		duedate = new Date(createtododuedatevalue.year, createtododuedatevalue.month, createtododuedatevalue.day, 0, createtododuedatevalue.minute)
	}

	if (duedate) {
		let minute = (duedate.getHours() * 60 + duedate.getMinutes()) || 0
		let children = Array.from(createtodoitemduetimelist.children)
		let difference = children.filter(g => getMinute(g.innerHTML).value != null).map(d => Math.abs(getMinute(d.innerHTML).value - minute))
		let closestindex = difference.indexOf(Math.min(...difference))
		let closestchild = children[closestindex]
		if (closestchild) {
			closestchild.scrollIntoView()
		}
	}
}


//update input ui
let createtododatepickerdate;
function prevcreatetododatepicker(event) {
	event.stopPropagation()
	createtododatepickerdate.setMonth(createtododatepickerdate.getMonth() - 1)
	updatecreatetododatepicker()
}
function nextcreatetododatepicker(event) {
	event.stopPropagation()
	createtododatepickerdate.setMonth(createtododatepickerdate.getMonth() + 1)
	updatecreatetododatepicker()
}
function updatecreatetododatepicker() {
	function getdaysinmonth(year, month) {
		return new Date(year, month + 1, 0).getDate()
	}

	let duedate;
	if (createtododuedatevalue.year != null && createtododuedatevalue.month != null && createtododuedatevalue.day != null && createtododuedatevalue.minute != null) {
		duedate = new Date(createtododuedatevalue.year, createtododuedatevalue.month, createtododuedatevalue.day, 0, createtododuedatevalue.minute)
	}

	let rows = []

	rows.push(`
	<div class="display-flex flex-row justify-space-between align-center">
		<div class="text-14px text-primary">${MONTHLIST[createtododatepickerdate.getMonth()]} ${createtododatepickerdate.getFullYear()}</div>
		<div class="display-flex flex-row gap-6px">
	
			<div class="topbarbutton" onclick="prevcreatetododatepicker(event)">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge rotate180">
				<g>
				<path d="M79.7318 29.7992L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M79.7318 226.201L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
				</svg>
			</div>
	
			<div class="topbarbutton" onclick="nextcreatetododatepicker(event)">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
				<g>
				<path d="M79.7318 29.7992L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M79.7318 226.201L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
				</svg>
			</div>
	
		</div>
	</div>`)

	let startdate = new Date(createtododatepickerdate.getFullYear(), createtododatepickerdate.getMonth(), 1)
	let enddate = new Date(createtododatepickerdate.getFullYear(), createtododatepickerdate.getMonth() + 1, 0)

	let startdate2 = new Date(createtododatepickerdate.getFullYear(), createtododatepickerdate.getMonth(), 1)
	startdate2.setDate(startdate2.getDate() - startdate2.getDay())

	let counter1 = 0
	let column = []

	//days of week
	let topcolumn = []
	for (let i = 0; i < 7; i++) {
		topcolumn.push(`
		<div class="flex-1 padding-4px">
			<div class="text-14px text-secondary text-center pointer-none">${SHORTESTDAYLIST[i]}</div>
		</div>`)
	}
	rows.push(`<div class="display-flex flex-row gap-4px">${topcolumn.join('')}</div>`)

	//days
	let loop = startdate.getDay() + getdaysinmonth(createtododatepickerdate.getFullYear(), createtododatepickerdate.getMonth()) + (6 - enddate.getDay())

	for (let index = 0; index < loop; index++) {
		let currentdate = new Date(startdate2.getTime())
		currentdate.setDate(currentdate.getDate() + counter1)

		let nowdate = new Date()

		let today = nowdate.getFullYear() == currentdate.getFullYear() && nowdate.getMonth() == currentdate.getMonth() && nowdate.getDate() == currentdate.getDate()

		let selected = duedate && currentdate.getFullYear() == duedate.getFullYear() && currentdate.getMonth() == duedate.getMonth() && currentdate.getDate() == duedate.getDate()

		column.push(`
		<div class="flex-1 border-round hover:background-tint-1 padding-4px transition-duration-100 pointer ${today ? 'todaydayhighlight' : ''} ${selected ? 'selecteddatehighlight' : ''}" onclick="inputcreatetodoitemduedate(event, ${currentdate.getFullYear()}, ${currentdate.getMonth()}, ${currentdate.getDate()})">
			<div class="text-14px text-primary text-center pointer-none  ${currentdate.getMonth() == createtododatepickerdate.getMonth() && currentdate.getFullYear() == createtododatepickerdate.getFullYear() ? '' : 'text-secondary'}">${currentdate.getDate()}</div>
		</div>`)

		counter1++
		if (counter1 % 7 == 0) {
			rows.push(`<div class="display-flex flex-row gap-4px">${column.join('')}</div>`)
			column = []
		}
	}

	let createtodoitemduedatelist = getElement('createtodoitemduedatelist')
	createtodoitemduedatelist.innerHTML = rows.join('')
}


//input not due
function inputcreatetodoitemnotdue(event) {
	event.stopPropagation()

	createtododuedatevalue.year = null
	createtododuedatevalue.month = null
	createtododuedatevalue.day = null
	createtododuedatevalue.minute = null

	updatecreatetodo()

	closecreatetodoitemduedate()
}


//input due date
function inputcreatetodoitemduedate(event, dueyear, duemonth, duedate) {
	event.stopPropagation()

	let mydate;
	if (dueyear != null && duemonth != null && duedate != null) {
		mydate = new Date(dueyear, duemonth, duedate)
	} else {
		let createtodoitemduedateinput = getElement('createtodoitemduedateinput')
		let string = createtodoitemduedateinput.value
		let [myyear, mymonth, myday] = getDate(string).value
		mydate = new Date(myyear, mymonth, myday)
	}

	if (!isNaN(mydate.getTime())) {
		createtododuedatevalue.year = mydate.getFullYear()
		createtododuedatevalue.month = mydate.getMonth()
		createtododuedatevalue.day = mydate.getDate()
	}

	updatecreatetododatepicker()
	updatecreatetododateinput()
	updatecreatetodo()
}
//input due time
function inputcreatetodoitemduetime(event, duetime) {
	let myminute;
	if (duetime != null) {
		myminute = duetime
	} else {
		let createtodoitemduetimeinput = getElement('createtodoitemduetimeinput')
		let string = createtodoitemduetimeinput.value
		myminute = getMinute(string, true).value
	}

	if (myminute != null) {
		createtododuedatevalue.minute = myminute
	}

	updatecreatetodotimepicker()
	updatecreatetodotimeinput()
	updatecreatetodo()

	closecreatetodoitemduedate()
}


//click on priority
function clickcreatetodopriority(event, id) {
	//ui
	let button = event.target
	let createtodoitempriority = getElement('createtodoitempriority')
	createtodoitempriority.classList.toggle('hiddenpopup')

	createtodoitempriority.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createtodoitempriority) + 'px'
	createtodoitempriority.style.left = fixleft(button.getBoundingClientRect().left - createtodoitempriority.offsetWidth * 0.5 + button.offsetWidth * 0.5, createtodoitempriority) + 'px'

	closecreatetodoitemduedate()
	closecreatetodoitemduration()
	closecreatetodoitemavailability()
	closecreatetodoitemrepeat()
}

function updatecreatetodoitemprioritylist() {
	let createtodoitemprioritylist = getElement('createtodoitemprioritylist')

	let output = []
	let list = ['Low', 'Medium', 'High']
	for (let i = 0; i < list.length; i++) {
		output.push(`<div class="helpitem" onclick="inputcreatetodoitempriority(event, ${i})">${list[i]}</div>`)
	}
	createtodoitemprioritylist.innerHTML = output.join('')
}
updatecreatetodoitemprioritylist()

function inputcreatetodoitempriority(event, index) {
	if (index != null) {
		createtodopriorityvalue = index

		//close
		closecreatetodoitempriority()
	}
	updatecreatetodo()
}
function closecreatetodoitempriority() {
	let createtodoitempriority = getElement('createtodoitempriority')
	createtodoitempriority.classList.add('hiddenpopup')
}




//click on availability
function clickcreatetodoavailability(event, id) {
	//ui
	let button = event.target
	let createtodoitemavailability = getElement('createtodoitemavailability')
	createtodoitemavailability.classList.toggle('hiddenpopup')

	createtodoitemavailability.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, createtodoitemavailability) + 'px'
	createtodoitemavailability.style.left = fixleft(button.getBoundingClientRect().left - createtodoitemavailability.offsetWidth * 0.5 + button.offsetWidth * 0.5, createtodoitemavailability) + 'px'

	closecreatetodoitemduedate()
	closecreatetodoitemduration()
	closecreatetodoitempriority()
	closecreatetodoitemrepeat()
}

function updatecreatetodoitemavailabilitylist() {
	let createtodoitemavailabilitylist = getElement('createtodoitemavailabilitylist')

	let output = []
	let list = TIMEWINDOW_PRESETS.map(d => d.fulltext || d.text)
	for (let i = 0; i < list.length; i++) {
		output.push(`<div class="helpitem" onclick="inputcreatetodoitemavailability(event, ${i})">${list[i]}</div>`)
	}
	createtodoitemavailabilitylist.innerHTML = output.join('')
}
updatecreatetodoitemavailabilitylist()

function inputcreatetodoitemavailability(event, index) {
	if (index != null) {
		createtodoavailabilityvalue = index

		//close
		closecreatetodoitemavailability()
	}
	updatecreatetodo()
}
function closecreatetodoitemavailability() {
	let createtodoitemavailability = getElement('createtodoitemavailability')
	createtodoitemavailability.classList.add('hiddenpopup')
}






function clicktypeaddtask(event){
	if(!calendar.onboarding.addtask){
		let addtodooptionspopuponboarding = getElement('addtodooptionspopuponboarding')
		addtodooptionspopuponboarding.classList.remove('hiddenpopup')
	}else if(isprompttodotoday){
		let addtodooptionspopupprompttodotoday = getElement('addtodooptionspopupprompttodotoday')
		addtodooptionspopupprompttodotoday.classList.remove('hiddenpopup')
	}else{
		let addtodooptionspopup = getElement('addtodooptionspopup')
		addtodooptionspopup.classList.remove('hiddenpopup')
	}
}

function clickaddonetask(){
	if(!calendar.onboarding.addtask){
		getElement('todoinputtitleonboarding').focus()
	}else if(isprompttodotoday){
		getElement('todoinputtitleprompttodotoday').focus()
	}else {
		getElement('todoinputtitle').focus()
	}
}


function resizeaddtask(event){
	let element = getElement('todoinputtitle')
	element.style.height = '0'
	element.style.height = Math.min(element.scrollHeight, parseInt(getComputedStyle(element).maxHeight)) + 'px'

	let element2 = getElement('todoinputtitleonboarding')
	element2.style.height = '0'
	element2.style.height = Math.min(element2.scrollHeight, parseInt(getComputedStyle(element2).maxHeight)) + 'px'

	let element3 = getElement('todoinputtitleprompttodotoday')
	element3.style.height = '0'
	element3.style.height = Math.min(element3.scrollHeight, parseInt(getComputedStyle(element3).maxHeight)) + 'px'
}



//OCR to add task
async function uploadtaskpicture(event) {
	const input = event.target
	const file = input.files[0]
	if (file) {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = async () => {
			const imageDataURL = reader.result
			const worker = await Tesseract.createWorker('eng')
			const data = await worker.recognize(imageDataURL)
			await worker.terminate()
			
			let resultstring = data.data.text
			if(resultstring){ 
				resultstring = resultstring.replace(/\n/g,' ')

				let todoinputtitle = getElement('todoinputtitle')
				todoinputtitle.value = resultstring
				typeaddtask()
				resizeaddtask()
			}
		}
	}
}


//speech recognition to add task
let isspeaking = false
let ispaused = false
let recognition;
let recognitionoutputtype;
let recognitionerror;
let totalTranscriptCopy;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
	recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
	recognition.continuous = true
	recognition.interimResults = true
	recognition.lang = 'en-US'


	let finalTranscript = ''
	let interimTranscript = ''
	totalTranscriptCopy = ''

	recognition.addEventListener('result', event => {
		interimTranscript = ''
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			const transcriptPart = event.results[i][0].transcript
			if (event.results[i].isFinal) {
				finalTranscript += transcriptPart + ' '
			} else {
				interimTranscript += transcriptPart
			}
		}

		let totalTranscript = (finalTranscript.trim() + ' ' + interimTranscript.trim()).trim()

		totalTranscriptCopy = totalTranscript
		updaterecognitionui()
	})

	recognition.addEventListener('start', () => {
		isspeaking = true

		updaterecognitionui()

		console.log("Recognition started")
	})
	  
	recognition.addEventListener('error', (event) => {
		finalTranscript = ''
		interimTranscript = ''
		totalTranscriptCopy = ''

		isspeaking = false

		recognitionerror = event.error
		updaterecognitionui()

		console.log("Recognition error occurred: " + event.error)
	})
	
	recognition.addEventListener('end', () => {
		finalTranscript = ''
		interimTranscript = ''
		totalTranscriptCopy = ''

		isspeaking = false

		updaterecognitionui()

		console.log("Recognition ended")
	})
}else{
	getElement('todorecognitionwrap').classList.add('display-none')
	getElement('eventrecognitionwrap').classList.add('display-none')
}

function updaterecognitionui(){
	let addtododictationpopup = getElement('addtododictationpopup')
	let addeventdictationpopup = getElement('addeventdictationpopup')
	let addtododictationtext = getElement('addtododictationtext')
	let addeventdictationtext = getElement('addeventdictationtext')
	let addtododictationbutton = getElement('addtododictationbutton')
	let addeventdictationbutton = getElement('addeventdictationbutton')

	addtododictationpopup.classList.add('hiddenpopup')
	addeventdictationpopup.classList.add('hiddenpopup')
	addeventdictationbutton.classList.remove('recognitionredanimation')
	addtododictationbutton.classList.remove('recognitionredanimation')

	let addeventdictationtext2 = getElement('addeventdictationtext2')
	let addtododictationtext2 = getElement('addtododictationtext2')

	addtododictationtext2.classList.add('display-none')
	addeventdictationtext2.classList.add('display-none')

	let eventrecognitionbutton = getElement('eventrecognitionbutton')
	let todorecognitionbutton = getElement('todorecognitionbutton')

	eventrecognitionbutton.classList.remove('display-none')
	todorecognitionbutton.classList.remove('display-none')

	//display ui
	if(isspeaking){
		if(recognitionoutputtype == 'task'){
			todorecognitionbutton.classList.add('display-none')

			addtododictationpopup.classList.remove('hiddenpopup')
			addtododictationbutton.classList.add('recognitionredanimation')

			if(totalTranscriptCopy){
				addtododictationtext.innerHTML =  `<span class="text-primary">${totalTranscriptCopy}</span>`
			}else{
				addtododictationtext.innerHTML = `<span class="text-quaternary">Listening...</span>`
			}
		}else if(recognitionoutputtype == 'event'){
			eventrecognitionbutton.classList.add('display-none')

			addeventdictationpopup.classList.remove('hiddenpopup')
			addeventdictationbutton.classList.add('recognitionredanimation')

			if(totalTranscriptCopy){
				addeventdictationtext.innerHTML =  `<span class="text-primary">${totalTranscriptCopy}</span>`
			}else{
				addeventdictationtext.innerHTML = `<span class="text-quaternary">Listening...</span>`
			}
		}
	}else{

		if(ispaused){
			if(recognitionoutputtype == 'task'){
				todorecognitionbutton.classList.add('display-none')

				addtododictationpopup.classList.remove('hiddenpopup')
				addtododictationtext2.classList.remove('display-none')

				addtododictationtext.innerHTML = ''
			}else if(recognitionoutputtype == 'event'){
				eventrecognitionbutton.classList.add('display-none')

				addeventdictationpopup.classList.remove('hiddenpopup')
				addeventdictationtext2.classList.remove('display-none')

				addeventdictationtext.innerHTML = ''
			}
		}
	}

	//error
	const permanentrecognitionerrors = ['service-not-allowed', 'not-allowed']
	if(recognitionerror && permanentrecognitionerrors.includes(recognitionerror)){
		let errorhtml = `<span class="text-red">No permission to use dictation, please check your browser/device settings.</span>`
		if(recognitionoutputtype == 'task'){
			addtododictationtext.innerHTML = errorhtml
		}else if(recognitionoutputtype == 'event'){
			addeventdictationtext.innerHTML = errorhtml
		}
	}
}

function togglerecognition(type){
	if(recognition){
		if(!isspeaking){
			recognitionoutputtype = type

			let addtododictationpopup = getElement('addtododictationpopup')
			let addeventdictationpopup = getElement('addeventdictationpopup')
			if(recognitionoutputtype == 'task'){
				addtododictationpopup.classList.remove('hiddenpopup')
			}else if(recognitionoutputtype == 'event'){
				addeventdictationpopup.classList.remove('hiddenpopup')
			}

			recognition.start()
		}else{
			recognition.stop()
		}
	}
}
function stoprecognition(){
	if(isspeaking){
		recognition.stop()
	}
}

function closerecognitionpopup(){
	stoprecognition()
	ispaused = false

	updaterecognitionui()
}
function submitdictation(){
	if(totalTranscriptCopy){
		ispaused = false

		if(recognitionoutputtype == 'task'){
			let todoinputtitle = getElement('todoinputtitle')
			todoinputtitle.value = totalTranscriptCopy

			typeaddtask()
			clickaddonetask()
			resizeaddtask()
		}else if(recognitionoutputtype == 'event'){
			let createeventtitle = getElement('createeventtitle')
			createeventtitle.value = totalTranscriptCopy

			typeaddevent()
			createeventtitle.focus()
		}

		stoprecognition()
	}else{
		ispaused = true

		togglerecognition(recognitionoutputtype)

		updaterecognitionui()
	}
}


function typeaddtask(event, submit, index) {
	let todoinputtitle = getElement('todoinputtitle')
	let todoinputtitleonboarding = getElement('todoinputtitleonboarding')
	let todoinputtitleprompttodotoday = getElement('todoinputtitleprompttodotoday')
	let finalstring = todoinputtitle.value || todoinputtitleonboarding.value || todoinputtitleprompttodotoday.value
	finalstring = finalstring.split('\n').filter(d => d != '')[index || 0] || ''

	let currentdate = new Date()

	let finalyear, finalmonth, finalday, finalminute, finalduration, finalpriority;


	//due date
	let tempmatch1 = getDate(finalstring)

	let temptext = tempmatch1.match ? finalstring.replace(tempmatch1.match, '') : finalstring
	let tempmatch5 = getMinute(temptext, false, finalstring)
	if (tempmatch1.match || tempmatch5.match) {
		let regex = new RegExp(`\\b(((due|by|due\\s+at|due\\s+on|deadline|deadline\\s+at|deadline\\s+on|due\\s+by|finish\\s+by|done\\s+by|complete\\s+by)\\s+)((${tempmatch1.match}\\s+((at|on|by)\\s+)?${tempmatch5.match})|(${tempmatch5.match}\\s+((at|on|by)\\s+)?${tempmatch1.match})|(${tempmatch1.match})|(${tempmatch5.match})))\\b`, 'i')
		let tempmatch2 = finalstring.match(regex)
		if (tempmatch2) {
			let tempmatch6 = getDate(tempmatch2[0])
			if (tempmatch6) {
				[finalyear, finalmonth, finalday] = tempmatch6.value
			}

			let temptext2 = tempmatch2[0].replace(tempmatch6.match, '')
			let tempmatch7 = getMinute(temptext2, true, finalstring)
			if (tempmatch7) {
				finalminute = tempmatch7.value
			}
		}

		finalstring = finalstring.replace(regex, '')
	}


	//duration
	let tempmatch3 = getDuration(finalstring)
	if (tempmatch3.match) {
		let regex = new RegExp(`\\b(((takes|needs|requires|takes\\s+me|lasts)\\s+)?${tempmatch3.match})\\b`)
		let tempmatch4 = finalstring.match(regex)
		if (tempmatch4) {
			finalduration = tempmatch3.value
		}

		finalstring = finalstring.replace(regex, '')
	}

	//priority
	let tempregex = /\b((low\s+priority|medium\s+priority|med\s+priority|high\s+priority|low\s+p|medium\s+p|med\s+p|high\s+p|p1|p2|p3|very\s+important|important|not\s+important|medium\s+importance|high\s+importance))\b/i
	let tempmatch8 = finalstring.match(tempregex)
	if (tempmatch8) {
		if (tempmatch8[0].match(/(low\s+priority|low\s+p|p1|not\s+important)/)) {
			finalpriority = 0
		} else if (tempmatch8[0].match(/(high\s+priority|high\s+p|p3|very\s+important|high\s+importance)/)) {
			finalpriority = 2
		} else if (tempmatch8[0].match(/(medium\s+priority|med\s+priority|med\s+p|medium\s+p|p2|important|medium\s+importance)/)) {
			finalpriority = 1
		}

		finalstring = finalstring.replace(tempregex, '')
	}


	//modify values

	//due date
	if (finalyear != null || finalmonth != null || finalday != null || finalminute != null) {
		if ((finalyear == null || finalmonth == null || finalday == null) && finalminute == null) {
			finalyear = currentdate.getFullYear()
			finalmonth = currentdate.getMonth()
			finalday = currentdate.getDate()
			finalminute = 1440 - 1
		}
		if (finalyear == null || finalmonth == null || finalday == null) {
			finalyear = currentdate.getFullYear()
			finalmonth = currentdate.getMonth()
			finalday = currentdate.getDate()
		}
		if (finalminute == null) {
			finalminute = 0
		}
	}


	//set values

	if (!isNaN(new Date(finalyear, finalmonth, finalday, 0, finalminute).getTime())) {
		createtododuedatevalue.year = finalyear
		createtododuedatevalue.month = finalmonth
		createtododuedatevalue.day = finalday
		createtododuedatevalue.minute = finalminute
	}

	if (finalduration != null && finalduration != 0) {
		createtododurationvalue = finalduration
	}

	if (finalpriority != null) {
		createtodopriorityvalue = finalpriority
	}

	finalstring = finalstring.trim()


	updatecreatetodo()

	if (submit) {
		return finalstring
	}
}



function submitcreatetodo(event) {
	stoprecognition()

	let addtodooptionspopup = getElement('addtodooptionspopup')
	addtodooptionspopup.classList.add('hiddenpopup')

	let todoinputtitle = getElement('todoinputtitle')
	let todoinputtitleonboarding = getElement('todoinputtitleonboarding')
	let todoinputtitleprompttodotoday = getElement('todoinputtitleprompttodotoday')
	let finalstring = todoinputtitle.value || todoinputtitleonboarding.value || todoinputtitleprompttodotoday.value
	finalstring = finalstring.split('\n').filter(d => d != '')

	let length = Math.max(finalstring.length, 1)
	
	for(let i = 0; i < length; i++){
		let title = typeaddtask(event, true, i)

		let todoinputnotes = getElement('todoinputnotes')
		let todoinputnotesonboarding = getElement('todoinputnotesonboarding')
		let todoinputnotesprompttodotoday = getElement('todoinputnotesprompttodotoday')

		let duedate = new Date(createtododuedatevalue.year, createtododuedatevalue.month, createtododuedatevalue.day, 0, createtododuedatevalue.minute)

		let myduration = createtododurationvalue

		let notes = todoinputnotes.value || todoinputnotesonboarding.value || todoinputnotesprompttodotoday.value

		
		//CREATE ITEM
		let item = new Calendar.Todo(duedate.getFullYear(), duedate.getMonth(), duedate.getDate(), duedate.getHours() * 60 + duedate.getMinutes(), myduration, title, notes)
		if (createtododuedatevalue.year == null || createtododuedatevalue.month == null || createtododuedatevalue.day == null || createtododuedatevalue.minute == null) {
			item.endbefore.year = null
			item.endbefore.month = null
			item.endbefore.day = null
			item.endbefore.minute = null
		}
		item.priority = createtodopriorityvalue

		//time slot
		if(createtodoavailabilityvalue != null){
			let timeslotitem = TIMEWINDOW_PRESETS[createtodoavailabilityvalue]
			if(timeslotitem){
				item.timewindow.day = timeslotitem.day
				item.timewindow.time.startminute = timeslotitem.time.startminute
				item.timewindow.time.endminute = timeslotitem.time.endminute
			}
		}

		//repeat
		if(createtodorepeatvalue.interval != null && createtodorepeatvalue.frequency != null){
			item.repeat.frequency = createtodorepeatvalue.frequency
			item.repeat.interval = createtodorepeatvalue.interval
			item.repeat.byday = deepCopy(createtodorepeatvalue.byday)
			item.repeat.until = createtodorepeatvalue.until
			item.repeat.count = createtodorepeatvalue.count
			fixrepeat(item)
		}

		
		calendar.todos.push(item)
	

		if(createtodorepeatvalue.interval == null && createtodorepeatvalue.frequency == null){
			//sub tasks
			if(createtodosubtasks.length > 0){
				for(let subtaskitem of createtodosubtasks){
					let childitem = new Calendar.Todo(duedate.getFullYear(), duedate.getMonth(), duedate.getDate(), duedate.getHours() * 60 + duedate.getMinutes(), subtaskitem.duration, `${subtaskitem.title || item.title}`)

					childitem.parentid = item.id

					childitem.timewindow.day = item.timewindow.day
					childitem.timewindow.time.startminute = item.timewindow.time.startminute
					childitem.timewindow.time.endminute = item.timewindow.time.endminute

					calendar.todos.push(childitem)
				}
			}
		}


		//fix sub task
		fixsubandparenttask(item)


		if(isprompttodotoday){
			prompttodotodayadded.push(item.id)
		}
		if(isonboardingaddtask){
			onboardingaddtasktodolist.push(item.id)
		}

		if(i == length - 1){
			setTimeout(function(){
				scrolltodoY(getElement(`todo-${item.id}`).offsetTop)
			}, 300)
		}
	}

	calendar.updateTodo()
	calendar.updateHistory()

	resetcreatetodo()

	resizeaddtask()
}




//get todo data
function gettododata(item) {
	let itemclasses = []

	if (item.completed) {
		itemclasses.push('completedtext')
	}


	let myduration;
	if(Calendar.Todo.isTodo(item)){
		myduration = item.duration
	}else{
		myduration = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)
	}


	let endbeforedate;
	if (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null) {
		endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	}
	let currentdate = new Date()

	let isoverdue = endbeforedate && currentdate.getTime() > endbeforedate.getTime() && !item.completed


	let childrenoutput = ''
	let children = Calendar.Todo.getSubtasks(item)
	if(children.length > 0){
		childrenoutput = `
		<div class="border-8px subtaskgroup bordertertiary display-flex flex-column border-box">
			${children.map(d => gettododata(d)).join('')}
		</div>`
	}



	let subtasksuggestionsoutput = ''
	if(calendar.settings.gettasksuggestions == true && Calendar.Todo.isTodo(item) && item.subtasksuggestions.length > 0){
		let tempoutput = []
		let tempoutput2 = []
		for(let i = 0; i < item.subtasksuggestions.length; i++){
			let d = item.subtasksuggestions[i]

			tempoutput.push(`<div class="min-width-160px flex-1 white-space-normal break-word suggestionborder display-flex gap-4px border-box transition-duration-100 flex-column padding-8px-12px pointer hover:background-tint-1 border-8px" onclick="clicksubtasksuggestion('${item.id}', '${d.id}')">
				<span class="text-12px text-purple">AI suggestion:</span>
				<span class="text-bold text-bold text-14px text-primary">${d.title} <span class="text-quaternary">- ${getDHMText(d.duration)}</span></span>
			</div>`)

			if(i % 2 == 1 || i == item.subtasksuggestions.length - 1){
				if(i % 2 == 0){
					tempoutput.push(`<div class="min-width-160px padding-left-12px padding-right-12px flex-1"></div>`)
				}

				tempoutput2.push(`<div class="gap-12px display-flex flex-row flex-1 flex-wrap-wrap">${tempoutput.join('')}</div>`)
				tempoutput = []
			}
		}
		subtasksuggestionsoutput = `
		<div class="todosuggestionwrap padding-right-12px padding-top-12px display-flex flex-column gap-6px subtaskgroup">
			<div class="display-flex flex-column gap-12px">
				${tempoutput2.join('')}
			</div>
			<div class="visibility-hidden hovertodosuggestiongroup small:visibility-visible display-flex flex-row gap-12px justify-flex-end">
				<div class="text-blue pointer width-fit hover:text-decoration-underline text-14px" onclick="regeneratesubtasksuggestions('${item.id}')">Regenerate</div>
				<div class="text-quaternary pointer width-fit hover:text-decoration-underline text-14px" onclick="hidesubtasksuggestions('${item.id}')">Hide</div>
				<div class="text-quaternary pointer width-fit hover:text-decoration-underline text-14px" onclick="turnoffsubtasksuggestions()">Turn off</div>
			</div>
		</div>` 
	}

	let output = ''
	if (selectededittodoid == item.id) {

		//edit
		output = `<div class="todoitem todoedititemwrap box-shadow-2 bordertertiary border-8px margin-left-12px margin-right-12px border-box" id="todo-${item.id}">
		<div class="todoitemcontainer padding-12px">
			<div class="text-16px text-primary text-bold white-space-normal break-word">Edit ${Calendar.Todo.getTitle(item)}</div>
			<div class="display-flex flex-column gap-12px">
				<div class="inputgroup">
					<div class="text-14px text-primary width90px">Title</div>
					<div class="inputgroupitem flex-1 width-full">
						<input class="infoinput" onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputtodotitle(event)" placeholder="Add title" id="edittodoinputtitle" value="${cleanInput(item.title)}" maxlength="2000"></input>
						<span class="inputline"></span>
					</div>
		 		</div>
		 		<div class="inputgroup">
		 			<div class="text-14px text-primary width90px">Notes</div>
					<div class="width-full flex-1 inputgroupitem">
						<textarea class="infonotes infoinput" placeholder="Add notes" id="edittodoinputnotes" onblur="inputtodonotes(event)" placeholder="Add date"  maxlength="2000">${cleanInput(item.notes)}</textarea>
						<span class="inputlinewrap">
							<span class="inputline"></span>
						</span>
					</div>
		 		</div>

				<div class="inputgroup ${Calendar.Todo.isSubtask(item) ? 'display-none' : ''}">
					<div class="text-14px text-primary width90px">Due date</div>
					<div class="inputgroupitem">
						<input class="infoinput inputdatepicker width-192px" onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputtododuedate(event)" placeholder="Add date" onclick="this.select()" id="edittodoinputduedate" value="${endbeforedate ? getDMDYText(endbeforedate) : 'None'}"></input>
						<span class="inputline"></span>
					</div>
					<div class="inputgroupitem">
						<input class="infoinput inputtimepicker width-192px" onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputtododuetime(event)" placeholder="Add time"  onclick="this.select()" id="edittodoinputduetime" value="${endbeforedate ? getHMText(endbeforedate.getHours() * 60 + endbeforedate.getMinutes()) : 'None'}"></input>
						<span class="inputline"></span>
					</div>
				</div>

				<div class="inputgroup">
					<div class="text-14px text-primary width90px">Time needed</div>
			 		<div class="inputgroupitem">
						<input onclick="this.select()" class="infoinput inputdurationpicker width-192px"  onkeydown="if(event.key == 'Enter'){ this.blur() }" onblur="inputtododuration(event)" placeholder="Add duration" id="edittodoinputduration" value="${getDHMText(myduration)}"></input>
						<span class="inputline"></span>
					</div>
				</div>

				<div class="infogroup ${Calendar.Todo.isSubtask(item) ? 'display-none' : ''}">
					<div class="inputgroup">
						<div class="text-14px text-primary width90px">Priority</div>
						<div class="inputeventtype width-fit flex-grow-0 flex-basis-auto" id="todoeditpriority">
							<div class="inputeventtypechild" onclick="clickedittodopriority(0)">Low</div>
							<div class="inputeventtypechild" onclick="clickedittodopriority(1)">Medium</div>
							<div class="inputeventtypechild" onclick="clickedittodopriority(2)">High</div>
						</div>
					</div>
				</div>

				<div class="infogroup">
					<div class="inputgroup">
						<div class="text-14px text-primary width90px">Time slot</div>
						<div class="inputeventtype width-fit flex-grow-0 flex-basis-auto" id="inputtodotimewindow">
							<div class="inputeventtypechild" onclick="clicktodotimewindowpreset(0)">Any time</div>
							<div class="inputeventtypechild" onclick="clicktodotimewindowpreset(1)">Work hours</div>
							<div class="inputeventtypechild" onclick="clicktodotimewindowpreset(2)">School hours</div>
							<div class="inputeventtypechild" onclick="clicktodotimewindowpreset(3)">After school</div>
							<div class="inputeventtypechild" onclick="clicktodotimewindowpreset(4)">Early morning</div>
						</div>
					</div>
				</div>

				<div class="infogroup display-none">
					<div class="inputgroup">
						<div class="text-14px text-primary width90px">Preferred day</div>
						<div class="inputeventtype width-fit flex-grow-0 flex-basis-auto" id="todoedittimewindowday">
							<div class="inputeventtypechild" onclick="clickedittodotimewindowday(0)">Any day</div>
							<div class="inputeventtypechild" onclick="clickedittodotimewindowday(1)">Weekdays</div>
							<div class="inputeventtypechild" onclick="clickedittodotimewindowday(2)">Weekends</div>
						</div>
					</div>
				</div>
	
				<div class="infogroup display-none">
					<div class="inputgroup">
						<div class="text-14px text-primary width90px">Preferred time</div>
						<div class="inputeventtype width-fit flex-grow-0 flex-basis-auto" id="todoedittimewindowtime">
							<div class="inputeventtypechild" onclick="clickedittodotimewindowtime(0)">Any time</div>
							<div class="inputeventtypechild" onclick="clickedittodotimewindowtime(1)">Morning</div>
							<div class="inputeventtypechild" onclick="clickedittodotimewindowtime(2)">Afternoon</div>
							<div class="inputeventtypechild" onclick="clickedittodotimewindowtime(3)">Evening</div>
							<div class="inputeventtypechild" onclick="clickedittodotimewindowtime(4)">Work hours</div>
						</div>
					</div>
				</div>


				<div class="infogroup">
					<div class="inputgroup">
						<div class="text-14px text-primary width90px">Repeat</div>
						<div class="flex-1 border-8px transition-duration-100 pointer background-tint-1 hover:background-tint-2 text-14px text-primary padding-8px-12px popupbutton display-flex flex-row justify-space-between" onclick="clicktodorepeatoption()" id="todorepeatoptionbutton">
							${getRepeatText(item)}
							<span><svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline rotate90">
							<g>
							<path d="M88.6229 47.8879L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
							<path d="M88.6229 208.112L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
							</g>
							</svg></span>
						</div>
					</div>
				</div>
				 
				<div class="todoitembuttongroupstay justify-flex-end">
					<div class="todoitembutton bluebutton" onclick="closeedittodo()">Done</div>
				</div>
			</div>
		</div>
		</div>
		
		${childrenoutput}`
	} else {
		//view

		output = `<div class="relative todoitem todoitemwrap" ${!schedulemytasksenabled ? `${Calendar.Todo.isSchedulable(item) ? `draggable="true" ondragstart="dragtodo(event, '${item.id}')"` : ''}` : ''} id="todo-${item.id}">

		 		<div class="todoitemcontainer padding-top-12px padding-bottom-12px margin-left-12px margin-right-12px relative">
		 
						<div class="display-flex flex-row gap-12px">
						
						${!schedulemytasksenabled ? `
							<div class="scalebutton todoitemcheckbox tooltip display-flex" onclick="todocompleted(event, '${item.id}');if(gtag){gtag('event', 'button_click', { useraction: '${item.completed ? 'Mark uncomplete - task' : 'Mark complete - task'}' })}">
								${getcheckcircle(item.completed, item.completed ? '<span class="tooltiptextright">Mark uncomplete</span>' : '<span class="tooltiptextright">Mark complete</span>')}
							</div>` : ''}
		
						<div class="justify-flex-end flex-1 display-flex flex-row small:flex-column gap-12px">

							<div class="flex-1 display-flex flex-column gap-6px">
								<div class="width-full display-flex flex-column">
				 
									<div class="todoitemtext text-16px ${itemclasses.join(' ')}">
										${Calendar.Event.isEvent(item) ? 
											`<span class="margin-right-6px text-12px hover:text-red-hover pointer-auto tooltip gap-6px text-red todoscheduleddate pointer transition-duration-100 badgepadding border-8px display-inline-flex flex-row align-center width-fit todoitemtext nowrap ${itemclasses.join(' ')}" onclick="gototaskincalendar('${item.id}')">
												${getDMDYText(new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute))} ${getHMText(item.start.minute)}
												<span class="tooltiptextcenter">Show calendar event</span>
											</span>`
											:
											``
										}

										${Calendar.Todo.getTitle(item)}

										${item.repeat.frequency != null && item.repeat.interval != null ? `
										<span class="margin-left-6px height-fit display-inline-flex pointer pointer-auto tooltip vertical-align-middle">
											<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="repeatbutton">
											<g>
											<g opacity="1">
											<path d="M0 119.447C0 123.04 1.24973 126.086 3.7492 128.586C6.24867 131.085 9.29489 132.335 12.8879 132.335C16.4809 132.335 19.5271 131.085 22.0265 128.586C24.526 126.086 25.7757 123.04 25.7757 119.447L25.7757 111.714C25.7757 102.42 28.7243 94.9407 34.6215 89.2778C40.5187 83.615 48.2709 80.7835 57.8783 80.7835L155.592 80.7835L155.592 55.3593L60.3387 55.3593C48.0757 55.3593 37.4139 57.5854 28.3533 62.0375C19.2928 66.4897 12.3021 72.7969 7.38124 80.9593C2.46041 89.1216 0 98.7484 0 109.84L0 119.447ZM146.219 105.27C146.219 108.473 147.176 110.992 149.089 112.827C151.003 114.663 153.561 115.581 156.763 115.581C158.169 115.581 159.575 115.327 160.981 114.819C162.387 114.312 163.637 113.589 164.73 112.652L209.018 76.097C211.674 73.9881 212.982 71.391 212.943 68.3057C212.904 65.2204 211.595 62.5843 209.018 60.3973L164.73 23.6082C163.637 22.749 162.387 22.0461 160.981 21.4993C159.575 20.9526 158.169 20.6792 156.763 20.6792C153.561 20.6792 151.003 21.6165 149.089 23.4911C147.176 25.3657 146.219 27.9042 146.219 31.1066L146.219 105.27ZM109.781 150.847C109.781 147.644 108.844 145.125 106.969 143.29C105.095 141.454 102.517 140.536 99.2366 140.536C97.8307 140.536 96.4442 140.79 95.0773 141.298C93.7104 141.806 92.4802 142.489 91.3867 143.348L47.0993 179.903C44.4436 182.09 43.1158 184.707 43.1158 187.753C43.1158 190.799 44.4436 193.416 47.0993 195.603L91.3867 232.392C92.4802 233.329 93.7104 234.052 95.0773 234.559C96.4442 235.067 97.8307 235.321 99.2366 235.321C102.517 235.321 105.095 234.403 106.969 232.568C108.844 230.732 109.781 228.213 109.781 225.011L109.781 150.847ZM256 136.436C256 132.843 254.75 129.777 252.251 127.238C249.751 124.7 246.705 123.431 243.112 123.431C239.519 123.431 236.473 124.7 233.973 127.238C231.474 129.777 230.224 132.843 230.224 136.436L230.224 144.168C230.224 153.463 227.276 160.942 221.378 166.605C215.481 172.268 207.729 175.099 198.122 175.099L100.408 175.099L100.408 200.524L195.661 200.524C208.002 200.524 218.684 198.278 227.705 193.787C236.727 189.295 243.698 182.969 248.619 174.806C253.54 166.644 256 157.056 256 146.043L256 136.436Z" fill-rule="nonzero" opacity="1" ></path>
											</g>
											</g>
											</svg>

											<span class="tooltiptextcenter">Repeats ${getRepeatText(item, true)}</span>
										</span>` : ''}
									</div>

									${item.googleclassroomid ? `<a href="${item.googleclassroomlink}" class="text-blue text-decoration-none text-14px hover:text-decoration-underline" target="_blank" rel="noopener noreferrer">Open Google Classroom assignment</a>` : ``}

									${item.notes && !item.completed ?
									`<div class="pointer-auto pre-wrap break-word todoitemtext text-quaternary text-14px overflow-hidden ${itemclasses.join(' ')}">${formatURL(cleanInput(item.notes))}</div>` : ''}
	
								</div>
				
								<div class="display-flex flex-wrap-wrap flex-row align-center column-gap-12px row-gap-6px">
				
									${!Calendar.Todo.isSubtask(item) ? 
										`<div class="gap-6px pointer-auto pointer display-flex transition-duration-100 flex-row text-14px align-center width-fit todoitemtext badgepadding ${!endbeforedate ? ` background-tint-1 text-primary hover:background-tint-2` : (isoverdue ? ` background-red text-white hover:background-red-hover` : ` background-blue text-white hover:background-blue-hover`)} border-round nowrap popupbutton ${itemclasses.join(' ')}" onclick="clicktodoitemduedate(event, '${item.id}')">
											${endbeforedate ? `Due ${getHMText(item.endbefore.minute)}` : 'No due date'}
										</div>`
										:
										''
									}
									
		
									${Calendar.Event.isEvent(item) ? `` : 
										`<div class="width-fit background-green transition-duration-100 hover:background-green-hover badgepadding border-round todoitemtext nowrap text-14px pointer-auto pointer transition-duration-100 text-white transition-duration-100 popupbutton ${itemclasses.join(' ')}" onclick="clicktodoitemduration(event, '${item.id}')">
											Takes ${getDHMText(myduration)}
										</div>`
									}
	
									${!Calendar.Todo.isSubtask(item) ? `
										<div class="text-14px badgepadding border-round nowrap pointer-auto transition-duration-100 pointer popupbutton transition-duration-100 ${['background-tint-1 text-primary hover:background-tint-2 visibility-hidden hoverpriority small:visibility-visible', 'background-orange hover:background-orange-hover text-white', 'background-red hover:background-red-hover text-white'][item.priority]} ${itemclasses.join(' ')}" onclick="clicktodoitempriority(event, '${item.id}')">
											${['Low', 'Medium', 'High'][item.priority]} priority
										</div>` : ''}
	
								</div>

							</div>
					
	
						</div>
	
						
						<div class="gap-6px todoitembuttongroup z-index-1 height-fit justify-flex-end flex-row small:visibility-visible">						
							<div class="backdrop-blur popupbutton tooltip infotopright hover:background-tint-1 pointer-auto transition-duration-100 border-8px pointer" onclick="edittodo('${item.id}');if(gtag){gtag('event', 'button_click', { useraction: 'Edit - task' })}">
								<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
								<g>
								<path d="M178.389 21.6002L31.105 168.884M234.4 77.6109L87.1156 224.895M178.389 21.6002C193.856 6.13327 218.933 6.13327 234.4 21.6002C249.867 37.0671 249.867 62.1439 234.4 77.6109M10 245.998L31.105 168.884M10.0017 246L87.1156 224.895" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								</g>
								</svg>
			
								<span class="tooltiptextcenter">Edit</span>
							</div>
				
							<div class="backdrop-blur popupbutton tooltip infotopright hover:background-tint-1 pointer-auto transition-duration-100 border-8px pointer" onclick="deletetodo('${item.id}');if(gtag){gtag('event', 'button_click', { useraction: 'Delete - task' })}">
								<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
								<g>
								<path d="M207.414 223.445L207.414 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M71.3433 246L184.657 246" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M207.414 223.445C207.414 235.902 197.226 246 184.657 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M238 57.6433L18 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M48.5864 223.445L48.5864 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M48.5864 223.445C48.5864 235.902 58.775 246 71.3433 246" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M96.1228 10L159.881 10" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M173.737 23.7283C173.737 16.1464 167.534 10 159.881 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M82.2668 23.7283C82.2668 16.1464 88.4703 10 96.1228 10" fill="none" opacity="1" stroke-linecap="butt" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M82.2668 23.7283L82.2668 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M173.737 23.7283L173.737 57.6433" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
								<path d="M165.379 101.49L165.379 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								<path d="M90.6212 101.49L90.6212 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								<path d="M128 101.49L128 204.22" fill="none" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="18"></path>
								</g>
								</svg>
		
								<span class="tooltiptextcenter">Delete</span>
							</div>
		
						</div>
			 
					</div>

					${schedulemytasksenabled ? 
						Calendar.Todo.isMainTask(item) ? 
						`<div class="absolute box-shadow display-flex todoitemselectcheck background-secondary border-8px box-shadow pointer pointer-auto" onclick="toggleschedulesubtasks(event, '${item.id}')">
							${getbigcheckbox(Calendar.Todo.getSubtasks(item).filter(r => Calendar.Todo.isTodo(r)).every(g => schedulemytaskslist.find(f => f == g.id)))}
						</div>`
						: 
						Calendar.Todo.isSchedulable(item) && Calendar.Todo.isTodo(item) ? 
						`<div class="absolute box-shadow display-flex todoitemselectcheck background-secondary border-8px box-shadow pointer pointer-auto" onclick="toggleschedulemytask(event, '${item.id}')">
							${getbigcheckbox(schedulemytaskslist.find(g => g == item.id))}
						</div>`
						:
						''
					:
					''}

				</div>


				${!schedulemytasksenabled && !Calendar.Todo.isSubtask(item) ? 
					`<div class="small:visibility-visible scalebutton absolute bottom-0 left-0 margin-12px todoitemcheckbox visibility-hidden  addsubtask tooltip display-flex" onclick="addsubtask(event, '${item.id}')">
						<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonsecondary">
						<g>
						<path d="M128 6.1875C121.925 6.1875 117 11.1124 117 17.1875L117 117L17.1875 117C11.1124 117 6.1875 121.925 6.1875 128C6.1875 134.075 11.1124 139 17.1875 139L117 139L117 238.812C117 244.888 121.925 249.813 128 249.812C134.075 249.812 139 244.888 139 238.812L139 139L238.812 139C244.888 139 249.813 134.075 249.812 128C249.812 121.925 244.888 117 238.812 117L139 117L139 17.1875C139 11.1124 134.075 6.1875 128 6.1875Z" fill-rule="nonzero" opacity="1" ></path>
						</g>
						</svg>
	
						<span class="tooltiptextright">Add subtask</span>
					</div>` : ''}

				${childrenoutput}

				${subtasksuggestionsoutput}

		 	</div>`
	}

	return output
}


//AI suggestion
function clicksubtasksuggestion(id, suggestionid){
	let item = [...calendar.todos, ...calendar.events].find(f => f.id == id)
	if (!item) return

	let suggestionitem = item.subtasksuggestions.find(g => g.id == suggestionid)
	if(!suggestionitem) return

	item.subtasksuggestions = item.subtasksuggestions.filter(d => d.id != suggestionitem.id)

	let subtaskitem = new Calendar.Todo(item.endbefore.year, item.endbefore.month, item.endbefore.day, item.endbefore.minute, suggestionitem.duration, suggestionitem.title)
	subtaskitem.parentid = item.id

	calendar.todos.push(subtaskitem)

	fixsubandparenttask(subtaskitem)

	calendar.updateTodo()
	calendar.updateHistory()
}
function regeneratesubtasksuggestions(id){
	let item = [...calendar.todos, ...calendar.events].find(f => f.id == id)
	if (!item) return

	item.subtasksuggestions = []
	item.gotsubtasksuggestions = false

	//send request
	lastgettasksuggestionsdate = Date.now()
	gettasksuggestions(item)

	calendar.updateTodo()
	calendar.updateHistory()
}
function hidesubtasksuggestions(id){
	let item = [...calendar.todos, ...calendar.events].find(f => f.id == id)
	if (!item) return

	item.subtasksuggestions = []

	calendar.updateTodo()
	calendar.updateHistory()
}
function turnoffsubtasksuggestions(){
	calendartabs = [3]
	settingstab = 1
	calendar.updateTabs()
}


//todo repeat
function clicktodorepeatoption() {
	let todorepeatoptionmenu = getElement('todorepeatoptionmenu')
	let todorepeatoptionbutton = getElement('todorepeatoptionbutton')
	todorepeatoptionmenu.classList.toggle('hiddenpopup')

	todorepeatoptionmenu.style.top = fixtop(todorepeatoptionbutton.getBoundingClientRect().top + todorepeatoptionbutton.offsetHeight, todorepeatoptionmenu) + 'px'
	todorepeatoptionmenu.style.left = fixleft(todorepeatoptionbutton.getBoundingClientRect().left, repeatoptionmenu) + 'px'
	todorepeatoptionmenu.style.width = todorepeatoptionbutton.offsetWidth + 'px'

	updatetodorepeatoptionmenu()
}


function updatetodorepeatoptionmenu() {
	function isnotrepeat() {
		return !REPEAT_OPTION_DATA.find(f => f.interval == item.repeat.interval && f.frequency == item.repeat.frequency && isEqualArray(item.repeat.byday, f.byday))
	}
	function isselectedrepeat(myindex) {
		let f = REPEAT_OPTION_DATA[myindex]
		return f.interval == item.repeat.interval && f.frequency == item.repeat.frequency && isEqualArray(item.repeat.byday, f.byday)
	}

	let item = [...calendar.todos, ...calendar.events].find(f => f.id == selectededittodoid)
	if (!item) return

	let repeatoption0 = getElement('todorepeatoption0')
	let repeatoption1 = getElement('todorepeatoption1')
	let repeatoption2 = getElement('todorepeatoption2')
	let repeatoption3 = getElement('todorepeatoption3')
	let repeatoption4 = getElement('todorepeatoption4')
	let repeatoption5 = getElement('todorepeatoption5')

	repeatoption0.innerHTML = getcheck(isselectedrepeat(0))
	repeatoption1.innerHTML = getcheck(isselectedrepeat(1))
	repeatoption2.innerHTML = getcheck([2, 7, 8, 9, 10, 11, 12, 13].find(d => isselectedrepeat(d)))
	repeatoption3.innerHTML = getcheck(isselectedrepeat(3))
	repeatoption4.innerHTML = getcheck(isselectedrepeat(4))
	repeatoption5.innerHTML = getcheck(isselectedrepeat(5))
}

//select repeat preset
function selecttodorepeatoption(index) {
	let item = [...calendar.todos, ...calendar.events].find(f => f.id == selectededittodoid)
	if (!item) return
	if (index != null) {
		let option = REPEAT_OPTION_DATA[index]
		if (!option) return

		item.repeat.frequency = option.frequency
		item.repeat.interval = option.interval
		item.repeat.byday = option.byday
		fixrepeat(item)

		updatetodorepeatoptionmenu()
		calendar.updateTodo()
		calendar.updateHistory()
	}

	let todorepeatoptionmenu = getElement('todorepeatoptionmenu')
	todorepeatoptionmenu.classList.add('hiddenpopup')
}


/*
	functions for opening popup:
 
	clicktodoitemduedate()
	clicktodoitempriority()
	clicktodoitemduration()
*/



function closetodoitemduration() {
	let todoitemduration = getElement('todoitemduration')
	todoitemduration.classList.add('hiddenpopup')
}
function closetodoitemduedate() {
	let todoitemduedate = getElement('todoitemduedate')
	todoitemduedate.classList.add('hiddenpopup')
}
function closetodoitempriority() {
	let todoitempriority = getElement('todoitempriority')
	todoitempriority.classList.add('hiddenpopup')
}

let inputtodoid;

//click on due date
function clicktodoitemduedate(event, id) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	//ui
	let button = event.target
	let todoitemduedate = getElement('todoitemduedate')
	todoitemduedate.classList.toggle('hiddenpopup')

	todoitemduedate.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, todoitemduedate) + 'px'
	todoitemduedate.style.left = fixleft(button.getBoundingClientRect().left - todoitemduedate.offsetWidth * 0.5 + button.offsetWidth * 0.5, todoitemduedate) + 'px'

	//input
	inputtodoid = id

	let duedate;
	if (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null) {
		duedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	}

	updatetododateinput(id)
	updatetodotimeinput(id)


	let currentdate = new Date()
	let [year, month, day] = getDate(getDMDYText(duedate ? duedate : new Date())).value
	if (year == null) {
		year = currentdate.getFullYear()
	}
	if (month == null) {
		month = currentdate.getMonth()
	}
	tododatepickerdate = new Date(year, month, 1)

	updatetodotimepicker()
	updatetododatepicker()

	closetodoitemduration()
	closetodoitempriority()
}

//update input value
function updatetododateinput(id) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	let duedate;
	if (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null) {
		duedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day)
	}

	let todoitemduedateinput = getElement('todoitemduedateinput')
	todoitemduedateinput.value = duedate ? getDMDYText(duedate) : 'None'
}
//update input value
function updatetodotimeinput(id) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	let todoitemduetimeinput = getElement('todoitemduetimeinput')
	todoitemduetimeinput.value = item.endbefore.minute != null ? getHMText(item.endbefore.minute) : 'None'
}


//create input ui
function updatetodotimepickeronce() {
	let output = []
	let times = []
	for (let min = 0; min < 1440; min += 60) {
		times.push(min)
	}
	times.push(1440-1)
	for(let min of times){
		output.push(`<div class="helpitem" onclick="inputtodoitemduetime(event, ${min})">${getHMText(min)}</div>`)
	}
	let todoitemduetimelist = getElement('todoitemduetimelist')
	todoitemduetimelist.innerHTML = output.join('')
}
//update input ui
function updatetodotimepicker() {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == inputtodoid)
	if (!item) return
	let duedate;
	if (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null) {
		duedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	}

	if (duedate) {
		let minute = (duedate.getHours() * 60 + duedate.getMinutes()) || 0
		let children = Array.from(todoitemduetimelist.children)
		let difference = children.filter(g => getMinute(g.innerHTML).value != null).map(d => Math.abs(getMinute(d.innerHTML).value - minute))
		let closestindex = difference.indexOf(Math.min(...difference))
		let closestchild = children[closestindex]
		if (closestchild) {
			closestchild.scrollIntoView()
		}
	}
}


//update input ui
let tododatepickerdate;
function prevtododatepicker(event) {
	event.stopPropagation()
	tododatepickerdate.setMonth(tododatepickerdate.getMonth() - 1)
	updatetododatepicker()
}
function nexttododatepicker(event) {
	event.stopPropagation()
	tododatepickerdate.setMonth(tododatepickerdate.getMonth() + 1)
	updatetododatepicker()
}
function updatetododatepicker() {
	function getdaysinmonth(year, month) {
		return new Date(year, month + 1, 0).getDate()
	}

	let item = [...calendar.events, ...calendar.todos].find(x => x.id == inputtodoid)
	if (!item) return
	let duedate;
	if (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null) {
		duedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	}

	let rows = []

	rows.push(`
	<div class="display-flex flex-row justify-space-between align-center">
		<div class="text-14px text-primary">${MONTHLIST[tododatepickerdate.getMonth()]} ${tododatepickerdate.getFullYear()}</div>
		<div class="display-flex flex-row gap-6px">
	
			<div class="topbarbutton" onclick="prevtododatepicker(event)">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge rotate180">
				<g>
				<path d="M79.7318 29.7992L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M79.7318 226.201L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
				</svg>
			</div>
	
			<div class="topbarbutton" onclick="nexttododatepicker(event)">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
				<g>
				<path d="M79.7318 29.7992L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M79.7318 226.201L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
				</svg>
			</div>
	
		</div>
	</div>`)

	let startdate = new Date(tododatepickerdate.getFullYear(), tododatepickerdate.getMonth(), 1)
	let enddate = new Date(tododatepickerdate.getFullYear(), tododatepickerdate.getMonth() + 1, 0)

	let startdate2 = new Date(tododatepickerdate.getFullYear(), tododatepickerdate.getMonth(), 1)
	startdate2.setDate(startdate2.getDate() - startdate2.getDay())

	let counter1 = 0
	let column = []

	//days of week
	let topcolumn = []
	for (let i = 0; i < 7; i++) {
		topcolumn.push(`
		<div class="flex-1 padding-4px">
			<div class="text-14px text-secondary text-center pointer-none">${SHORTESTDAYLIST[i]}</div>
		</div>`)
	}
	rows.push(`<div class="display-flex flex-row gap-4px">${topcolumn.join('')}</div>`)

	//days
	let loop = startdate.getDay() + getdaysinmonth(tododatepickerdate.getFullYear(), tododatepickerdate.getMonth()) + (6 - enddate.getDay())

	for (let index = 0; index < loop; index++) {
		let currentdate = new Date(startdate2.getTime())
		currentdate.setDate(currentdate.getDate() + counter1)

		let nowdate = new Date()

		let today = nowdate.getFullYear() == currentdate.getFullYear() && nowdate.getMonth() == currentdate.getMonth() && nowdate.getDate() == currentdate.getDate()

		let selected = duedate && currentdate.getFullYear() == duedate.getFullYear() && currentdate.getMonth() == duedate.getMonth() && currentdate.getDate() == duedate.getDate()

		column.push(`
		<div class="flex-1 border-round hover:background-tint-1 padding-4px transition-duration-100 pointer ${today ? 'todaydayhighlight' : ''} ${selected ? 'selecteddatehighlight' : ''}" onclick="inputtodoitemduedate(event, ${currentdate.getFullYear()}, ${currentdate.getMonth()}, ${currentdate.getDate()})">
			<div class="text-14px text-primary text-center pointer-none  ${currentdate.getMonth() == tododatepickerdate.getMonth() && currentdate.getFullYear() == tododatepickerdate.getFullYear() ? '' : 'text-secondary'}">${currentdate.getDate()}</div>
		</div>`)

		counter1++
		if (counter1 % 7 == 0) {
			rows.push(`<div class="display-flex flex-row gap-4px">${column.join('')}</div>`)
			column = []
		}
	}

	let todoitemduedatelist = getElement('todoitemduedatelist')
	todoitemduedatelist.innerHTML = rows.join('')
}



//input due
function inputtodoitemnotdue(event, id) {
	event.stopPropagation()

	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	item.endbefore.year = null
	item.endbefore.month = null
	item.endbefore.day = null
	item.endbefore.minute = null

	calendar.updateTodo()
	calendar.updateHistory()

	closetodoitemduedate()

	setTimeout(function(){
		scrolltodoY(getElement(`todo-${item.id}`).offsetTop)
	}, 300)
}

//input due date
function inputtodoitemduedate(event, dueyear, duemonth, duedate) {
	event.stopPropagation()

	let item = [...calendar.events, ...calendar.todos].find(x => x.id == inputtodoid)
	if (!item) return

	let mydate;
	if (dueyear != null && duemonth != null && duedate != null) {
		mydate = new Date(dueyear, duemonth, duedate)
	} else {
		let todoitemduedateinput = getElement('todoitemduedateinput')
		let string = todoitemduedateinput.value
		let [myyear, mymonth, myday] = getDate(string).value
		mydate = new Date(myyear, mymonth, myday)
	}

	if (!isNaN(mydate.getTime())) {
		item.endbefore.year = mydate.getFullYear()
		item.endbefore.month = mydate.getMonth()
		item.endbefore.day = mydate.getDate()

		
		fixsubandparenttask(item)


		calendar.updateTodo()
		if(Calendar.Event.isEvent(item)){
			calendar.updateEvents()
		}
		calendar.updateHistory()
		calendar.updateInfo()

		//blur
		let todoitemduedateinput = getElement('todoitemduedateinput')
		todoitemduedateinput.blur()
	}

	updatetododatepicker()
	updatetododateinput(inputtodoid)

	setTimeout(function(){
		scrolltodoY(getElement(`todo-${item.id}`).offsetTop)
	}, 300)
}
//input due time
function inputtodoitemduetime(event, duetime) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == inputtodoid)
	if (!item) return

	let myminute;
	if (duetime != null) {
		myminute = duetime
	} else {
		let todoitemduetimeinput = getElement('todoitemduetimeinput')
		let string = todoitemduetimeinput.value
		myminute = getMinute(string, true).value
	}

	if (myminute != null) {
		item.endbefore.minute = myminute

		
		fixsubandparenttask(item)


		calendar.updateTodo()
		if(Calendar.Event.isEvent(item)){
			calendar.updateEvents()
		}
		calendar.updateHistory()

		//blur
		let todoitemduetimeinput = getElement('todoitemduetimeinput')
		todoitemduetimeinput.blur()
	}

	updatetodotimepicker()
	updatetodotimeinput(inputtodoid)

	closetodoitemduedate()
	
	setTimeout(function(){
		scrolltodoY(getElement(`todo-${item.id}`).offsetTop)
	}, 300)
}



//click on priority
function clicktodoitempriority(event, id) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	//ui
	let button = event.target
	let todoitempriority = getElement('todoitempriority')
	todoitempriority.classList.toggle('hiddenpopup')

	todoitempriority.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, todoitempriority) + 'px'
	todoitempriority.style.left = fixleft(button.getBoundingClientRect().left - todoitempriority.offsetWidth * 0.5 + button.offsetWidth * 0.5, todoitempriority) + 'px'

	inputtodoid = id

	closetodoitemduedate()
	closetodoitemduration()
}

function updatetodoitemprioritylist() {
	let todoitemprioritylist = getElement('todoitemprioritylist')

	let output = []
	let list = ['Low', 'Medium', 'High']
	for (let i = 0; i < list.length; i++) {
		output.push(`<div class="helpitem" onclick="inputtodoitempriority(event, ${i})">${list[i]}</div>`)
	}
	todoitemprioritylist.innerHTML = output.join('')
}
updatetodoitemprioritylist()

function inputtodoitempriority(event, index) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == inputtodoid)
	if (!item) return

	if (index != null) {
		item.priority = index

		fixsubandparenttask(item)

		inputtodoid = null
		calendar.updateTodo()
		if(Calendar.Event.isEvent(item)){
			calendar.updateEvents()
		}
		calendar.updateHistory()

		//close
		let todoitempriority = getElement('todoitempriority')
		todoitempriority.classList.add('hiddenpopup')
	}
}



//click on duration
function clicktodoitemduration(event, id) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	//ui
	let button = event.target
	let todoitemduration = getElement('todoitemduration')
	todoitemduration.classList.toggle('hiddenpopup')

	todoitemduration.style.top = fixtop(button.getBoundingClientRect().top + button.offsetHeight, todoitemduration) + 'px'
	todoitemduration.style.left = fixleft(button.getBoundingClientRect().left - todoitemduration.offsetWidth * 0.5 + button.offsetWidth * 0.5, todoitemduration) + 'px'

	//input
	let myduration;
	if(Calendar.Todo.isTodo(item)){
		myduration = item.duration
	}else{
		myduration = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)
	}

	let todoitemdurationinput = getElement('todoitemdurationinput')
	todoitemdurationinput.value = getDHMText(myduration)

	inputtodoid = id

	closetodoitemduedate()
	closetodoitempriority()

	updatetodoitemdurationlist()
}

function updatetodoitemdurationlist() {
	let item;
	if(inputtodoid){
		item = [...calendar.events, ...calendar.todos].find(x => x.id == inputtodoid)
	}

	let todoitemdurationlist = getElement('todoitemdurationlist')

	let durations = TODO_DURATION_PRESETS

	let output = []
	for (let item of durations) {
		output.push(`<div class="helpitem" onclick="inputtodoitemduration(event, ${item})">${getDHMText(item)}</div>`)
	}

	todoitemdurationlist.innerHTML = output.join('')

}
updatetodoitemdurationlist()

//input duration
function inputtodoitemduration(event, duration) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == inputtodoid)
	if (!item) return


	let myduration;
	if (duration != null) {
		myduration = duration
	} else {
		let todoitemdurationinput = getElement('todoitemdurationinput')
		let string = todoitemdurationinput.value
		myduration = getDuration(string).value
	}

	if (myduration == null) {
		if(Calendar.Todo.isTodo(item)){
			myduration = item.duration
		}else{
			myduration = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)
		}
	}

	if (myduration != null && myduration != 0) {
		if(Calendar.Todo.isTodo(item)){
			item.duration = myduration
		}else{
			let tempenddate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			tempenddate.setMinutes(tempenddate.getMinutes() + myduration)
			
			item.end.year = tempenddate.getFullYear()
			item.end.month = tempenddate.getMonth()
			item.end.day = tempenddate.getDate()
			item.end.minute = tempenddate.getHours() * 60 + tempenddate.getMinutes()
		}

		
		fixsubandparenttask(item)


		calendar.updateTodo()
		if(Calendar.Event.isEvent(item)){
			calendar.updateEvents()
		}
		calendar.updateHistory()

		//blur
		let todoitemdurationinput = getElement('todoitemdurationinput')
		todoitemdurationinput.blur()

		//close
		inputtodoid = null

		let todoitemduration = getElement('todoitemduration')
		todoitemduration.classList.add('hiddenpopup')
	}
}


let initialdragtodox, initialdragtodoy;
function dragtodo(event, id) {
	event.preventDefault()
	event.stopPropagation()

	if(mobilescreen){
		return
	}

	let item = [...calendar.todos].find(x => x.id == id)
	if (!item) return

	let children = Calendar.Todo.getSubtasks(item)
	if(children.length > 0){
		if(children.every(d => Calendar.Event.isEvent(d))){
			return
		}
	}

	let todoelement = getElement(`todo-${id}`)

	let dragtododiv = getElement('dragtododiv')
	dragtododiv.classList.remove('display-none')
	dragtododiv.innerHTML = todoelement.innerHTML

	let rect = todoelement.getBoundingClientRect()

	dragtododiv.style.width = rect.width + 'px'
	dragtododiv.style.height = rect.height + 'px'

	initialdragtodox = event.clientX - rect.left
	initialdragtodoy = event.clientY - rect.top

	movedragtodo(event)

	let dragtodohighlight = getElement('dragtodohighlight')
	dragtodohighlight.classList.remove('hiddenfade')

	document.addEventListener('mousemove', movedragtodo, false)
	document.addEventListener('mouseup', finishfunction, false)

	function finishfunction(event) {
		document.removeEventListener('mousemove', movedragtodo, false)
		document.removeEventListener('mouseup', finishfunction, false)

		dragtododiv.classList.add('display-none')
		dragtododiv.innerHTML = ''

		dragtodohighlight.classList.add('hiddenfade')
		dragtododiv.classList.remove('dragtododivtransform')


		//drop
		let rect2 = dragtodohighlight.getBoundingClientRect()

		let x = event.clientX
		let y = event.clientY
		if (x >= rect2.left && x < rect2.right && y >= rect2.top && y < rect2.bottom) {
			if (item.endbefore.year == null || item.endbefore.month == null || item.endbefore.day == null || item.endbefore.minute == null) {
				let tempdate = new Date()
				tempdate.setHours(0, 0, 0, 0)
				tempdate.setDate(tempdate.getDate() + 1)

				item.endbefore.year = tempdate.getFullYear()
				item.endbefore.month = tempdate.getMonth()
				item.endbefore.day = tempdate.getDate()
				item.endbefore.minute = tempdate.getHours() * 60 + tempdate.getMinutes()
			}

			fixsubandparenttask(item)


			startAutoSchedule({scheduletodos: [item, ...Calendar.Todo.getSubtasks(item)]})

			if(gtag){gtag('event', 'button_click', { useraction: 'Drop task - calendar' })}
		}

	}
}

function movedragtodo(event) {
	let dragtododiv = getElement('dragtododiv')
	dragtododiv.classList.remove('display-none')

	dragtododiv.classList.add('dragtododivtransform')
	dragtododiv.style.left = event.clientX - initialdragtodox + 'px'
	dragtododiv.style.top = event.clientY - initialdragtodoy + 'px'
}




//delete all completed
function deletecompletedtodos(){
	let deletedones = [...calendar.todos.filter(d => d.completed), ...calendar.events.filter(d => d.type == 1 && d.completed)]

	calendar.todos = calendar.todos.filter(d => !d.completed)
	calendar.events = calendar.events.filter(d => d.type != 1 || !d.completed)

	for(let item of deletedones){
		fixrecurringtodo(item)
	}

	calendar.updateTodo()
	calendar.updateInfo()
	calendar.updateHistory()
}

//add subtask
function addsubtask(event, id){
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	let newendbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	let newduration = 60
	
	let newtask = new Calendar.Todo(newendbeforedate.getFullYear(), newendbeforedate.getMonth(), newendbeforedate.getDate(), newendbeforedate.getHours() * 60 + newendbeforedate.getMinutes(), newduration)
	newtask.parentid = item.id

	calendar.todos.push(newtask)

	
	fixsubandparenttask(newtask)

	calendar.updateTodo()
	calendar.updateHistory()
}


//go to scheduled task in calendar
function gototaskincalendar(id){
	let item = calendar.events.find(x => x.id == id)
	if (!item) return

	calendaryear = item.start.year
	calendarmonth = item.start.month
	calendarday = item.start.day

	if(mobilescreen){
		calendartabs = [0]
		calendar.updateTabs()
	}else{
		selectedeventid = item.id
		calendar.updateCalendar()
	}

	scrollcalendarY(item.start.minute)
}

//check completed
async function todocompleted(event, id) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return
	item.completed = !item.completed

	if(item.completed){
		if(Calendar.Event.isEvent(item)){
			let currentdate = new Date()

			if(new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() > currentdate.getTime()){
				let oldstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
				let oldenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
				let duration = oldenddate.getTime() - oldstartdate.getTime()


				//set event to end at now
				let enddate = new Date(currentdate)
				enddate.setMinutes(floor(enddate.getMinutes(), 5))

				let startdate = new Date(enddate)
				startdate.setTime(startdate.getTime() - duration)
			
				item.start.year = startdate.getFullYear()
				item.start.month = startdate.getMonth()
				item.start.day = startdate.getDate()
				item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()
			
				item.end.year = enddate.getFullYear()
				item.end.month = enddate.getMonth()
				item.end.day = enddate.getDate()
				item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
			}
		}
	}


	fixrecurringtodo(item)
	
	fixsubandparenttask(item)

	calendar.updateTodo()
	if(Calendar.Event.isEvent(item)){
		calendar.updateEvents()
	}
	calendar.updateHistory()
	calendar.updateInfo()

	if (item.completed) {
		let confetticanvas = getElement('confetticanvas')
		let myconfetti = confetti.create(confetticanvas, {
			resize: true,
			useWorker: true
		})

		await myconfetti({
			particleCount: 20,
			gravity: 0.75,
			startVelocity: 15,
			decay: 0.94,
			ticks: 100,
			origin: {
				x: (event.clientX) / (window.innerWidth || document.body.clientWidth),
				y: (event.clientY) / (window.innerHeight || document.body.clientHeight)
			}
		})

		try{
			myconfetti.reset()
		}catch(e){}

	}
}



function unscheduleevent(id){
	let item = calendar.events.find(d => d.id == id)
	if(!item) return

	let todoitem = gettodofromevent(item)

	calendar.todos.push(todoitem)
	calendar.events = calendar.events.filter(d => d.id != item.id)

	selectedeventid = null

	calendar.updateInfo()
	calendar.updateTodo()
	calendar.updateEvents()
	calendar.updateHistory()
	
	setTimeout(function(){
		scrolltodoY(getElement(`todo-${todoitem.id}`).getBoundingClientRect().top)
	}, 300)
}


//start task now - adds task to calendar at current time, becomes fixed event
function startnow(id){
	let tempitem = [...calendar.events, ...calendar.todos].find(d => d.id == id)
	if(!tempitem) return

	if(Calendar.Todo.isTodo(tempitem)){
		let item = geteventfromtodo(tempitem)
	
		let startdate = new Date()
		startdate.setMinutes(ceil(startdate.getMinutes(), 5))
	
		let enddate = new Date(startdate)
		enddate.setMinutes(enddate.getMinutes() + tempitem.duration)
	
		item.start.year = startdate.getFullYear()
		item.start.month = startdate.getMonth()
		item.start.day = startdate.getDate()
		item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()
	
		item.end.year = enddate.getFullYear()
		item.end.month = enddate.getMonth()
		item.end.day = enddate.getDate()
		item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
	
		item.type = 0
	
		calendar.events.push(item)
		calendar.todos = calendar.todos.filter(d => d.id != tempitem.id)

		//scroll
		let barcolumncontainer = getElement('barcolumncontainer')
		let target = startdate.getHours() * 60 + startdate.getMinutes() - 60*2
		barcolumncontainer.scrollTo(0, target)
	}else{
		let duration = new Date(tempitem.end.year, tempitem.end.month, tempitem.end.day, 0, tempitem.end.minute).getTime() - new Date(tempitem.start.year, tempitem.start.month, tempitem.start.day, 0, tempitem.start.minute).getTime()

		let startdate = new Date()
		startdate.setMinutes(ceil(startdate.getMinutes(), 5))
	
		let enddate = new Date(startdate)
		enddate.setTime(enddate.getTime() + duration)
	
		tempitem.start.year = startdate.getFullYear()
		tempitem.start.month = startdate.getMonth()
		tempitem.start.day = startdate.getDate()
		tempitem.start.minute = startdate.getHours() * 60 + startdate.getMinutes()
	
		tempitem.end.year = enddate.getFullYear()
		tempitem.end.month = enddate.getMonth()
		tempitem.end.day = enddate.getDate()
		tempitem.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
	
		tempitem.type = 0

		//scroll
		let barcolumncontainer = getElement('barcolumncontainer')
		let target = startdate.getHours() * 60 + startdate.getMinutes() - 60*2
		barcolumncontainer.scrollTo(0, target)
	}

	if(mobilescreen){
		calendartabs = [0]
		calendar.updateTabs()
	}

	calendar.updateTodo()
	calendar.updateEvents()
	calendar.updateHistory()
	calendar.updateInfo()
}

function deletetodo(id) {
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == id)
	if(!item) return

	//get children
	let children = [...calendar.todos, ...calendar.events].filter(d => d.parentid == item.id)

	let totaldelete = [item, ...children]

	let includesevent = totaldelete.find(d => Calendar.Event.isEvent(d))

	calendar.todos = calendar.todos.filter(d => !totaldelete.find(f => f.id == d.id))
	calendar.events = calendar.events.filter(d => !totaldelete.find(f => f.id == d.id))


	fixrecurringtodo(item)

	fixsubandparenttask(item)
	
	calendar.updateTodo()
	if(includesevent){
		calendar.updateEvents()
	}
	calendar.updateHistory()
	calendar.updateInfo()
}

function edittodo(id) {
	let item = [...calendar.events, ...calendar.todos].find(x => x.id == id)
	if (!item) return

	selectededittodoid = id

	let selectedoption = DAY_TIMEWINDOW_OPTION_DATA.findIndex(d => isEqualArray(d.byday, item.timewindow.day.byday))
	if (selectedoption != -1) {
		edittodopreferredday = selectedoption
	}

	let selectedoption2 = TIME_TIMEWINDOW_OPTION_DATA.findIndex(d => d.startminute == item.timewindow.time.startminute && d.endminute == item.timewindow.time.endminute)
	if (selectedoption2 != -1) {
		edittodopreferredtime = selectedoption2
	}
	edittodopriority = item.priority

	calendar.updateTodo()

	let edittodoinputtitle = getElement('edittodoinputtitle')
	edittodoinputtitle.focus()
}



//preset
function clicktodotimewindowpreset(index){
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
	if (!item) return

	let option = TIMEWINDOW_PRESETS[index]
	if (option) {
		item.timewindow.time.startminute = option.time.startminute
		item.timewindow.time.endminute = option.time.endminute
		item.timewindow.day.byday = option.day.byday
	}
	
	calendar.updateEvents()
	calendar.updateEditTodo()
	calendar.updateInfo()
	calendar.updateHistory()
}

function clickedittodopriority(index) {
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
	if (!item) return

	item.priority = index
	calendar.updateEditTodo()
	calendar.updateHistory()
}


function inputtodotitle(event){
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
	if (!item) return

	item.title = event.target.value

	let edittodoinputtitle = getElement('edittodoinputtitle')
	edittodoinputtitle.value = item.title

	calendar.updateHistory()
}

function inputtodonotes(event){
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
	if (!item) return

	item.notes = event.target.value

	let edittodoinputnotes = getElement('edittodoinputnotes')
	edittodoinputnotes.value = item.notes

	calendar.updateHistory()
}


function inputtododuedate(event){
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
	if (!item) return

	let string = event.target.value

	let [myendbeforeyear, myendbeforemonth, myendbeforeday] = getDate(string).value

	let tempdate = new Date(myendbeforeyear, myendbeforemonth, myendbeforeday)

	if (!isNaN(tempdate.getTime())) {
		item.endbefore.year = tempdate.getFullYear()
		item.endbefore.month = tempdate.getMonth()
		item.endbefore.day = tempdate.getDate()

		
		fixsubandparenttask(item)
	}


	let endbeforedate;
	if (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null) {
		endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	}
	let edittodoinputduedate = getElement('edittodoinputduedate')
	edittodoinputduedate.value = endbeforedate ? getDMDYText(endbeforedate) : 'None'

	calendar.updateHistory()
}

function inputtododuetime(event){
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
	if (!item) return

	let string = event.target.value

	let myendbeforeminute = getMinute(string, true).value

	if (myendbeforeminute != null) {
		item.endbefore.minute = myendbeforeminute

		
		fixsubandparenttask(item.id)
	}

	let endbeforedate;
	if (item.endbefore.year != null && item.endbefore.month != null && item.endbefore.day != null && item.endbefore.minute != null) {
		endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	}
	let edittodoinputduetime = getElement('edittodoinputduetime')
	edittodoinputduetime.value = endbeforedate ? getHMText(endbeforedate.getHours() * 60 + endbeforedate.getMinutes()) : 'None'

	calendar.updateHistory()
}


function inputtododuration(event){
	let item = [...calendar.events, ...calendar.todos].find(d => d.id == selectededittodoid)
	if (!item) return

	let string = event.target.value

	if(Calendar.Todo.isTodo(item)){
		let myduration = getDuration(string).value


		if(myduration != null && myduration != 0){
			item.duration = myduration
		}
	}else{
		let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		let myduration = getDuration(string).value

		let enddate = new Date(startdate.getTime() + (myduration * 60000))

		if (!isNaN(enddate.getTime()) && myduration != null) {
			item.end.year = enddate.getFullYear()
			item.end.month = enddate.getMonth()
			item.end.day = enddate.getDate()
			item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
		}
	}


	
	fixsubandparenttask(item)


	let myduration;
	if(Calendar.Todo.isTodo(item)){
		myduration = item.duration
	}else{
		myduration = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)
	}

	let edittodoinputduration = getElement('edittodoinputduration')
	edittodoinputduration.value = getDHMText(myduration)

	calendar.updateHistory()
}


function closeedittodo() {
	selectededittodoid = null
	calendar.updateTodo()
}

//get event from todo
function geteventfromtodo(item) {
	let currentdate = new Date()

	let endbeforeyear, endbeforemonth, endbeforeday, endbeforeminute;

	endbeforeyear = item.endbefore.year
	endbeforemonth = item.endbefore.month
	endbeforeday = item.endbefore.day
	endbeforeminute = item.endbefore.minute

	if (endbeforeyear == null || endbeforemonth == null || endbeforeday == null || endbeforeminute == null) {
		let tempduedate = new Date()
		tempduedate.setHours(0, 0, 0, 0)
		tempduedate.setDate(tempduedate.getDate() + 1)
		tempduedate.setMinutes(-1)

		endbeforeyear = tempduedate.getFullYear()
		endbeforemonth = tempduedate.getMonth()
		endbeforeday = tempduedate.getDate()
		endbeforeminute = tempduedate.getHours() * 60 + tempduedate.getMinutes()
	}


	let startdate = new Date(currentdate.getTime())
	startdate.setMinutes(ceil(startdate.getMinutes(), 5), 0, 0)
	let enddate = new Date(startdate.getTime())
	enddate.setMinutes(enddate.getMinutes() + item.duration)

	let newitem = new Calendar.Event(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), startdate.getHours() * 60 + startdate.getMinutes(), enddate.getFullYear(), enddate.getMonth(), enddate.getDate(), enddate.getHours() * 60 + enddate.getMinutes(), item.title, item.notes, 1)
	newitem.endbefore.year = endbeforeyear
	newitem.endbefore.month = endbeforemonth
	newitem.endbefore.day = endbeforeday
	newitem.endbefore.minute = endbeforeminute


	newitem.priority = item.priority
	newitem.completed = item.completed
	newitem.id = item.id
	newitem.googleclassroomid = item.googleclassroomid
	newitem.googleclassroomlink = item.googleclassroomlink
	newitem.parentid = item.parentid

	newitem.repeat = deepCopy(item.repeat)
	newitem.repeatid = item.repeatid

	newitem.timewindow = deepCopy(item.timewindow)

	return newitem
}

//get todo from event
function gettodofromevent(item) {
	let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)

	let duration = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)

	let newitem = new Calendar.Todo(endbeforedate.getFullYear(), endbeforedate.getMonth(), endbeforedate.getDate(), endbeforedate.getHours() * 60 + endbeforedate.getMinutes(), duration, item.title, item.notes)

	newitem.priority = item.priority
	newitem.completed = item.completed
	newitem.id = item.id
	newitem.googleclassroomid = item.googleclassroomid
	newitem.googleclassroomlink = item.googleclassroomlink
	newitem.parentid = item.parentid

	newitem.repeat = deepCopy(item.repeat)
	newitem.repeatid = item.repeatid

	newitem.timewindow = deepCopy(item.timewindow)

	return newitem
}



//DATE PICKER

let datepickerdate;

//open picker
document.addEventListener('focusin', event => {
	let input = event.target
	if (input.classList.contains('inputdatepicker')) {
		let datepicker = getElement('datepicker')
		datepicker.classList.remove('hiddenpopup')
		datepicker.style.top = fixtop(input.getBoundingClientRect().top + input.offsetHeight, datepicker) + 'px'
		datepicker.style.left = fixleft(input.getBoundingClientRect().left, datepicker) + 'px'

		let currentdate = new Date()
		let [year, month, day] = getDate(input.value).value
		if (year == null) {
			year = currentdate.getFullYear()
		}
		if (month == null) {
			month = currentdate.getMonth()
		}
		datepickerdate = new Date(year, month, 1)

		updatedatepicker()
	} else if (input.classList.contains('inputtimepicker')) {
		let timepicker = getElement('timepicker')
		timepicker.classList.remove('hiddenpopup')

		timepicker.style.width = input.offsetWidth + 'px'
		timepicker.style.top = fixtop(input.getBoundingClientRect().top + input.offsetHeight, timepicker) + 'px'
		timepicker.style.left = fixleft(input.getBoundingClientRect().left, timepicker) + 'px'

		let minute = getMinute(input.value).value || 0
		let children = Array.from(timepicker.children)
		let difference = children.filter(g => getMinute(g.innerHTML).value != null).map(d => Math.abs(getMinute(d.innerHTML).value - minute))
		let closestindex = difference.indexOf(Math.min(...difference))
		let closestchild = children[closestindex]
		if (closestchild) {
			closestchild.scrollIntoView()
		}
	} else if (input.classList.contains('inputdurationpicker')) {
		let durationpicker = getElement('durationpicker')
		durationpicker.classList.remove('hiddenpopup')

		durationpicker.style.width = input.offsetWidth + 'px'
		durationpicker.style.top = fixtop(input.getBoundingClientRect().top + input.offsetHeight, durationpicker) + 'px'
		durationpicker.style.left = fixleft(input.getBoundingClientRect().left, durationpicker) + 'px'
	}
})

//close picker
document.addEventListener('focusout', event => {
	let datepicker = getElement('datepicker')
	let timepicker = getElement('timepicker')
	let durationpicker = getElement('durationpicker')
	datepicker.classList.add('hiddenpopup')
	timepicker.classList.add('hiddenpopup')
	durationpicker.classList.add('hiddenpopup')
})


function updatetimepicker() {
	let timepicker = getElement('timepicker')

	let output = []
	for (let min = 0; min < 1440; min += 15) {
		output.push(`<div class="helpitem" onclick="selecttimepicker(${min})">${getHMText(min)}</div>`)
	}
	timepicker.innerHTML = output.join('')
}


function updatedurationpicker() {
	let durationpicker = getElement('durationpicker')

	let durations = TODO_DURATION_PRESETS
	let output = []
	for (let item of durations) {
		output.push(`<div class="helpitem" onclick="selectdurationpicker(${item})">${getDHMText(item)}</div>`)
	}
	durationpicker.innerHTML = output.join('')
}


//select duration picker
function selectdurationpicker(min) {
	let input = document.activeElement
	if (input) {
		input.value = getDHMText(min)
		input.blur()
	}
}

//select time picker
function selecttimepicker(min) {
	let input = document.activeElement
	if (input) {
		input.value = getHMText(min)
		input.blur()
	}
}


//select date on date picker
function selectedatepicker(year, month, day) {
	let input = document.activeElement
	if (input) {
		let tempdate = new Date(year, month, day)
		input.value = getDMDYText(tempdate)
		input.blur()
	}
}

function prevdatepicker(event) {
	event.stopPropagation()
	datepickerdate.setMonth(datepickerdate.getMonth() - 1)
	updatedatepicker()
}
function nextdatepicker(event) {
	event.stopPropagation()
	datepickerdate.setMonth(datepickerdate.getMonth() + 1)
	updatedatepicker()
}

function updatedatepicker() {
	let datepicker = getElement('datepicker')
	function getdaysinmonth(year, month) {
		return new Date(year, month + 1, 0).getDate()
	}

	let input = document.activeElement
	if (!input) return

	let [myyear, mymonth, myday] = getDate(input.value).value
	let duedate = new Date(myyear, mymonth, myday)

	let rows = []

	rows.push(`
	<div class="display-flex flex-row justify-space-between align-center">
		<div class="text-14px text-primary">${MONTHLIST[datepickerdate.getMonth()]} ${datepickerdate.getFullYear()}</div>
		<div class="display-flex flex-row gap-6px">
	
			<div class="topbarbutton" onclick="prevdatepicker(event)">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge rotate180">
				<g>
				<path d="M79.7318 29.7992L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M79.7318 226.201L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
				</svg>
			</div>
	
			<div class="topbarbutton" onclick="nextdatepicker(event)">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge">
				<g>
				<path d="M79.7318 29.7992L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				<path d="M79.7318 226.201L176.268 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
				</svg>
			</div>
	
		</div>
	</div>`)

	let startdate = new Date(datepickerdate.getFullYear(), datepickerdate.getMonth(), 1)
	let enddate = new Date(datepickerdate.getFullYear(), datepickerdate.getMonth() + 1, 0)

	let startdate2 = new Date(datepickerdate.getFullYear(), datepickerdate.getMonth(), 1)
	startdate2.setDate(startdate2.getDate() - startdate2.getDay())

	let counter1 = 0
	let column = []

	//days of week
	let topcolumn = []
	for (let i = 0; i < 7; i++) {
		topcolumn.push(`
		<div class="flex-1 padding-4px">
			<div class="text-14px text-secondary text-center pointer-none">${SHORTESTDAYLIST[i]}</div>
		</div>`)
	}
	rows.push(`<div class="display-flex flex-row gap-4px">${topcolumn.join('')}</div>`)

	//days
	let loop = startdate.getDay() + getdaysinmonth(datepickerdate.getFullYear(), datepickerdate.getMonth()) + (6 - enddate.getDay())

	for (let index = 0; index < loop; index++) {
		let currentdate = new Date(startdate2.getTime())
		currentdate.setDate(currentdate.getDate() + counter1)

		let nowdate = new Date()

		let today = nowdate.getFullYear() == currentdate.getFullYear() && nowdate.getMonth() == currentdate.getMonth() && nowdate.getDate() == currentdate.getDate()

		let selected = !isNaN(duedate.getTime()) && currentdate.getFullYear() == duedate.getFullYear() && currentdate.getMonth() == duedate.getMonth() && currentdate.getDate() == duedate.getDate()

		column.push(`
		<div class="flex-1 border-round hover:background-tint-1 padding-4px transition-duration-100 pointer ${today ? 'todaydayhighlight' : ''} ${selected ? 'selecteddatehighlight' : ''}" onclick="selectedatepicker(${currentdate.getFullYear()}, ${currentdate.getMonth()}, ${currentdate.getDate()})">
			<div class="text-14px text-primary text-center pointer-none  ${currentdate.getMonth() == datepickerdate.getMonth() && currentdate.getFullYear() == datepickerdate.getFullYear() ? '' : 'text-secondary'}">${currentdate.getDate()}</div>
		</div>`)

		counter1++
		if (counter1 % 7 == 0) {
			rows.push(`<div class="display-flex flex-row gap-4px">${column.join('')}</div>`)
			column = []
		}
	}

	datepicker.innerHTML = rows.join('')
}



//EVENTS


//fix end date
function fixeventend(item, duration) {
	let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	let enddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
	enddate.setTime(startdate.getTime() + duration)

	item.end.year = enddate.getFullYear()
	item.end.month = enddate.getMonth()
	item.end.day = enddate.getDate()
	item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
}

//fix start date
function fixeventstart(item, duration) {
	let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	let enddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
	if (startdate.getTime() > enddate.getTime()) {
		startdate.setTime(enddate.getTime() - duration)

		item.start.year = startdate.getFullYear()
		item.start.month = startdate.getMonth()
		item.start.day = startdate.getDate()
		item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()
	}
}


//toggle remind me new
function clickeventremindme() {
	let remindmemenu = getElement('remindmemenu')
	let remindmebutton = getElement('remindmebutton')

	remindmemenu.classList.toggle('hiddenpopup')

	updateitemreminders()

	remindmemenu.style.top = fixtop(remindmebutton.getBoundingClientRect().top + remindmebutton.offsetHeight, remindmemenu) + 'px'
	remindmemenu.style.left = fixleft(remindmebutton.getBoundingClientRect().left + remindmebutton.offsetWidth/2 - remindmemenu.offsetWidth/2, remindmemenu) + 'px'
}

//remind me time
function remindme(option) {
	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return
	if (item.reminder.find(d => d.timebefore == REMINDER_PRESETS[option])) {
		item.reminder = item.reminder.filter(d => d.timebefore != REMINDER_PRESETS[option])
	} else {
		item.reminder.push({ timebefore: REMINDER_PRESETS[option] })
	}
	calendar.updateInfo()
}

function updateitemreminders() {
	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	function isselectedreminder(thisindex) {
		return item.reminder.find(d => d.timebefore == REMINDER_PRESETS[thisindex])
	}

	let remindmetime = getElement('remindmetime')
	for (let [index, div] of Object.entries(remindmetime.children)) {
		div.children[0].innerHTML = getcheck(isselectedreminder(index))
	}
}


//get border data
function getborderdata(item, currentdate, timestamp) {
	let nextdate = new Date(currentdate.getTime())
	nextdate.setDate(nextdate.getDate() + 1)

	let myheight = 16
	let mytop = item.endbefore.minute
	if (mytop == 0) {
		mytop = 1440
	}
	if (mytop + myheight / 2 > 1440) {
		mytop = 1440 - myheight / 2
	}

	let itemclasses = []
	if (selectedeventid == item.id) {
		itemclasses.push('borderwrapselected')
	}

	let output = `<div class="borderwrap ${itemclasses.join(' ')}" onmousedown="clickborder(event, '${item.id}', ${timestamp})" style="top:${mytop}px;height:${myheight}px;transform:translateY(-50%)">
		<div class="eventtext">
			<div class="bordertextdisplay">Due ${getHMText(item.endbefore.minute)}</div>
		</div>
	</div>`

	return output
}

//get sleep data
function getsleepdata() {
	let endminute = calendar.settings.sleep.endminute
	let startminute = calendar.settings.sleep.startminute
	let output = `
 	<div class="sleepwrap" style="top:0;height:${endminute}px">
		<div class="sleepborder">
			<div class="text-purple text-14px text-center padding-top-6px">
	 			Sleep
	 		</div>
		</div>
	</div>
	<div class="sleepwrap" style="top:${startminute}px;height:${1440 - startminute}px">
 		<div class="sleepborder">
	 		<div class="text-purple text-14px text-center padding-top-6px">
	 			Sleep
	 		</div>
	 	</div>
 	</div>`
	return output
}


//get animated day event data
function getanimateddayeventdata(item, olditem, newitem, currentdate, timestamp, percentage, addedtodo) {
	let nextdate = new Date(currentdate.getTime())
	nextdate.setDate(nextdate.getDate() + 1)

	let tempstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	let tempenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

	let itemclasses = []
	let itemclasses2 = []
	let itemclasses3 = []

	let mytop;
	let myheight;

	if (tempstartdate.getTime() >= currentdate.getTime() && tempstartdate.getTime() < nextdate.getTime()) {
		itemclasses.push('eventwraptop')

		if (tempenddate.getTime() > nextdate.getTime()) {
			mytop = item.start.minute
			myheight = 1440 - item.start.minute
		} else {
			mytop = item.start.minute
			myheight = Math.floor((tempenddate.getTime() - tempstartdate.getTime()) / 60000)

			itemclasses.push('eventwrapbottom')
		}
	} else if (tempenddate.getTime() > currentdate.getTime() && tempenddate.getTime() <= nextdate.getTime()) {
		itemclasses.push('eventwrapbottom')

		if (tempstartdate.getTime() < currentdate.getTime()) {
			mytop = 0
			myheight = Math.floor((tempenddate.getTime() - currentdate.getTime()) / 60000)
		} else {
			mytop = item.start.minute
			myheight = Math.floor((tempenddate.getTime() - tempstartdate.getTime()) / 60000)

			itemclasses.push('eventwraptop')
		}
	} else if (tempstartdate.getTime() < currentdate.getTime() && tempenddate.getTime() > nextdate.getTime()) {
		mytop = 0
		myheight = 1440
	}


	if (selectedeventid == item.id || autoscheduleeventid == item.id) {
		itemclasses.push('selectedevent')
		itemclasses3.push('selectedcalendarevent')
		itemclasses2.push('selectedtext')
	}

	if(myheight <= 15){
		itemclasses2.push('smalleventtext')
	}


	let newstartdate = new Date(newitem.start.year, newitem.start.month, newitem.start.day)
	let oldstartdate = new Date(olditem.start.year, olditem.start.month, olditem.start.day)

	let difference = Math.floor((newstartdate.getTime() - oldstartdate.getTime()) / 86400000)

	let output = ''
	output = `
	<div class="absolute pointer-none animatedeventwrap ${itemclasses3.join(' ')}" style="transform: ${!addedtodo ? `translateX(${percentage * difference * 100}%)` : ''} ${addedtodo ? `scale(${percentage * 100}%)` : ''};top:${mytop}px;height:${myheight}px;left:0;width:100%;">
		<div class="popupbutton eventwrap pointer-auto eventborder ${itemclasses.join(' ')}" id="${item.id}" onmousedown="clickevent(event, ${timestamp})" style="background-color:${selectedeventid == item.id ? `${item.hexcolor}` : `${item.hexcolor + '80'}`};border-color:${item.hexcolor}">
			<div class="eventtext">
				<div class="eventtextspace"></div>
				<div class="eventtextdisplay ${itemclasses2.join(' ')}">
					
					${item.type == 1 ? 
						`<span class="todoitemcheckbox tooltip checkcircletop">
							${myheight <= 15 ? `${getwhitecheckcirclesmall(item.completed)}` : `${getwhitecheckcircle(item.completed)}`}
						</span>` 
						: ''
					}

					<span class="text-bold">${Calendar.Event.getTitle(item)}</span>
				
					${item.repeat.frequency != null && item.repeat.interval != null && item.type == 1 ? `
					<span class="todoitemcheckbox tooltip checkcircletop pointer-none">
						<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="repeatbuttonevent">
						<g>
						<g opacity="1">
						<path d="M0 119.447C0 123.04 1.24973 126.086 3.7492 128.586C6.24867 131.085 9.29489 132.335 12.8879 132.335C16.4809 132.335 19.5271 131.085 22.0265 128.586C24.526 126.086 25.7757 123.04 25.7757 119.447L25.7757 111.714C25.7757 102.42 28.7243 94.9407 34.6215 89.2778C40.5187 83.615 48.2709 80.7835 57.8783 80.7835L155.592 80.7835L155.592 55.3593L60.3387 55.3593C48.0757 55.3593 37.4139 57.5854 28.3533 62.0375C19.2928 66.4897 12.3021 72.7969 7.38124 80.9593C2.46041 89.1216 0 98.7484 0 109.84L0 119.447ZM146.219 105.27C146.219 108.473 147.176 110.992 149.089 112.827C151.003 114.663 153.561 115.581 156.763 115.581C158.169 115.581 159.575 115.327 160.981 114.819C162.387 114.312 163.637 113.589 164.73 112.652L209.018 76.097C211.674 73.9881 212.982 71.391 212.943 68.3057C212.904 65.2204 211.595 62.5843 209.018 60.3973L164.73 23.6082C163.637 22.749 162.387 22.0461 160.981 21.4993C159.575 20.9526 158.169 20.6792 156.763 20.6792C153.561 20.6792 151.003 21.6165 149.089 23.4911C147.176 25.3657 146.219 27.9042 146.219 31.1066L146.219 105.27ZM109.781 150.847C109.781 147.644 108.844 145.125 106.969 143.29C105.095 141.454 102.517 140.536 99.2366 140.536C97.8307 140.536 96.4442 140.79 95.0773 141.298C93.7104 141.806 92.4802 142.489 91.3867 143.348L47.0993 179.903C44.4436 182.09 43.1158 184.707 43.1158 187.753C43.1158 190.799 44.4436 193.416 47.0993 195.603L91.3867 232.392C92.4802 233.329 93.7104 234.052 95.0773 234.559C96.4442 235.067 97.8307 235.321 99.2366 235.321C102.517 235.321 105.095 234.403 106.969 232.568C108.844 230.732 109.781 228.213 109.781 225.011L109.781 150.847ZM256 136.436C256 132.843 254.75 129.777 252.251 127.238C249.751 124.7 246.705 123.431 243.112 123.431C239.519 123.431 236.473 124.7 233.973 127.238C231.474 129.777 230.224 132.843 230.224 136.436L230.224 144.168C230.224 153.463 227.276 160.942 221.378 166.605C215.481 172.268 207.729 175.099 198.122 175.099L100.408 175.099L100.408 200.524L195.661 200.524C208.002 200.524 218.684 198.278 227.705 193.787C236.727 189.295 243.698 182.969 248.619 174.806C253.54 166.644 256 157.056 256 146.043L256 136.436Z" fill-rule="nonzero" opacity="1" ></path>
						</g>
						</g>
						</svg>
					</span>` : ''}

					${item.type == 1 && item.priority != 0 ?
						`<span class="todoitemcheckbox tooltip">
							${getpriorityicon(item.priority)}
						</span>` : '' }

					
			
					${myheight < 45 ? ' ' : '</br>'}<span class="text-quaternary">${Calendar.Event.getShortStartEndText(item)}</span>
				
				</div>
				
			</div>
		</div>
	</div>`

	return output
}

//get day event data
function getdayeventdata(item, currentdate, timestamp, leftindent, columnwidth) {
	let nextdate = new Date(currentdate.getTime())
	nextdate.setDate(nextdate.getDate() + 1)

	let itemclasses = []
	let itemclicks = []
	let itemclasses2 = []
	let itemclasses3 = []

	let tempstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	let tempenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

	let mytop;
	let myheight;

	if (tempstartdate.getTime() >= currentdate.getTime() && tempstartdate.getTime() < nextdate.getTime()) {
		itemclasses.push('eventwraptop')

		if (tempenddate.getTime() > nextdate.getTime()) {
			mytop = item.start.minute
			myheight = 1440 - item.start.minute
		} else {
			mytop = item.start.minute
			myheight = Math.floor((tempenddate.getTime() - tempstartdate.getTime()) / 60000)

			itemclasses.push('eventwrapbottom')
			itemclicks.push(`<div class="${myheight <= 30 ? 'eventbottomsmall' : 'eventbottom'}" onmousedown="clickeventbottom(event, ${timestamp})"></div>`)
		}

		if(myheight >= 30){
			itemclicks.push(`<div class="${myheight <= 30 ? 'eventtopsmall' : 'eventtop'}" onmousedown="clickeventtop(event, ${timestamp})"></div>`)
		}
	} else if (tempenddate.getTime() > currentdate.getTime() && tempenddate.getTime() <= nextdate.getTime()) {
		itemclasses.push('eventwrapbottom')

		if (tempstartdate.getTime() < currentdate.getTime()) {
			mytop = 0
			myheight = Math.floor((tempenddate.getTime() - currentdate.getTime()) / 60000)
		} else {
			mytop = item.start.minute
			myheight = Math.floor((tempenddate.getTime() - tempstartdate.getTime()) / 60000)

			itemclasses.push('eventwraptop')
			if(myheight >= 30){
				itemclicks.push(`<div class="${myheight <= 30 ? 'eventtopsmall' : 'eventtop'}" onmousedown="clickeventtop(event, ${timestamp})"></div>`)
			}
		}

		itemclicks.push(`<div class="${myheight <= 30 ? 'eventbottomsmall' : 'eventbottom'}" onmousedown="clickeventbottom(event, ${timestamp})"></div>`)
	} else if (tempstartdate.getTime() < currentdate.getTime() && tempenddate.getTime() > nextdate.getTime()) {
		mytop = 0
		myheight = 1440
	}


	if (selectedeventid == item.id || autoscheduleeventid == item.id) {
		itemclasses.push('selectedevent')
		itemclasses3.push('selectedcalendarevent')
		itemclasses2.push('selectedtext')
	}

	if (tempenddate.getTime() < Date.now()) {
		itemclasses.push('greyedoutevent')
	}

	if(myheight <= 15){
		itemclasses2.push('smalleventtext')
	}

	let output = ''
	output = `
	<div class="absolute pointer-none ${itemclasses3.join(' ')}" style="top:${mytop}px;height:${myheight}px;left:${leftindent / columnwidth * 100}%;width:${100 / columnwidth}%">
		<div class="popupbutton eventwrap pointer-auto eventborder ${itemclasses.join(' ')}" id="${item.id}" onmousedown="clickevent(event, ${timestamp})" style="background-color:${selectedeventid == item.id ? `${item.hexcolor}` : `${item.hexcolor + '80'}`};border-color:${item.hexcolor}">
			${!Calendar.Event.isReadOnly(item) ? itemclicks.join('') : ''}
			<div class="eventtext">
				<div class="eventtextspace"></div>
				<div class="eventtextdisplay ${itemclasses2.join(' ')}">
					
					${item.type == 1 ? 
						`<span class="scalebutton todoitemcheckbox tooltip checkcircletop pointer pointer-auto" onclick="eventcompleted(event, '${item.id}')">
							${myheight <= 15 ? `${getwhitecheckcirclesmall(item.completed)}` : `${getwhitecheckcircle(item.completed)}`}
						</span>` 
						: ''
					}

					<span class="text-bold">${Calendar.Event.getTitle(item)}</span>
		

					${item.repeat.frequency != null && item.repeat.interval != null && item.type == 1 ? `
					<span class="todoitemcheckbox tooltip checkcircletop pointer-none">
						<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="repeatbuttonevent">
						<g>
						<g opacity="1">
						<path d="M0 119.447C0 123.04 1.24973 126.086 3.7492 128.586C6.24867 131.085 9.29489 132.335 12.8879 132.335C16.4809 132.335 19.5271 131.085 22.0265 128.586C24.526 126.086 25.7757 123.04 25.7757 119.447L25.7757 111.714C25.7757 102.42 28.7243 94.9407 34.6215 89.2778C40.5187 83.615 48.2709 80.7835 57.8783 80.7835L155.592 80.7835L155.592 55.3593L60.3387 55.3593C48.0757 55.3593 37.4139 57.5854 28.3533 62.0375C19.2928 66.4897 12.3021 72.7969 7.38124 80.9593C2.46041 89.1216 0 98.7484 0 109.84L0 119.447ZM146.219 105.27C146.219 108.473 147.176 110.992 149.089 112.827C151.003 114.663 153.561 115.581 156.763 115.581C158.169 115.581 159.575 115.327 160.981 114.819C162.387 114.312 163.637 113.589 164.73 112.652L209.018 76.097C211.674 73.9881 212.982 71.391 212.943 68.3057C212.904 65.2204 211.595 62.5843 209.018 60.3973L164.73 23.6082C163.637 22.749 162.387 22.0461 160.981 21.4993C159.575 20.9526 158.169 20.6792 156.763 20.6792C153.561 20.6792 151.003 21.6165 149.089 23.4911C147.176 25.3657 146.219 27.9042 146.219 31.1066L146.219 105.27ZM109.781 150.847C109.781 147.644 108.844 145.125 106.969 143.29C105.095 141.454 102.517 140.536 99.2366 140.536C97.8307 140.536 96.4442 140.79 95.0773 141.298C93.7104 141.806 92.4802 142.489 91.3867 143.348L47.0993 179.903C44.4436 182.09 43.1158 184.707 43.1158 187.753C43.1158 190.799 44.4436 193.416 47.0993 195.603L91.3867 232.392C92.4802 233.329 93.7104 234.052 95.0773 234.559C96.4442 235.067 97.8307 235.321 99.2366 235.321C102.517 235.321 105.095 234.403 106.969 232.568C108.844 230.732 109.781 228.213 109.781 225.011L109.781 150.847ZM256 136.436C256 132.843 254.75 129.777 252.251 127.238C249.751 124.7 246.705 123.431 243.112 123.431C239.519 123.431 236.473 124.7 233.973 127.238C231.474 129.777 230.224 132.843 230.224 136.436L230.224 144.168C230.224 153.463 227.276 160.942 221.378 166.605C215.481 172.268 207.729 175.099 198.122 175.099L100.408 175.099L100.408 200.524L195.661 200.524C208.002 200.524 218.684 198.278 227.705 193.787C236.727 189.295 243.698 182.969 248.619 174.806C253.54 166.644 256 157.056 256 146.043L256 136.436Z" fill-rule="nonzero" opacity="1" ></path>
						</g>
						</g>
						</svg>
					</span>` : ''}

					${item.type == 1 && item.priority != 0 ?
						`<span class="todoitemcheckbox tooltip">
							${getpriorityicon(item.priority)}
						</span>` : '' }
					
			
					${myheight < 45 ? ' ' : '</br>'}<span class="text-quaternary">${Calendar.Event.getShortStartEndText(item)}</span>
				
				</div>
				
			</div>
		</div>
	</div>`

	return output
}



//event type
function eventtype(type) {
	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return
	if (item.type == type) return

	item.type = type
	if (item.type == 1) {
		let endbeforedate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
		endbeforedate.setHours(0, 0, 0, 0)
		endbeforedate.setDate(endbeforedate.getDate() + 1)
		endbeforedate.setMinutes(-1)

		item.endbefore.year = endbeforedate.getFullYear()
		item.endbefore.month = endbeforedate.getMonth()
		item.endbefore.day = endbeforedate.getDate()
		item.endbefore.minute = endbeforedate.getHours() * 60 + endbeforedate.getMinutes()

		if(Calendar.Event.isAllDay(item)){
			let currentdate = new Date()
			currentdate.setHours(12, 0, 0, 0)

			item.start.minute = currentdate.getHours() * 60 + currentdate.getMinutes()
			
			let tempdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			tempdate.setHours(tempdate.getHours() + 1)
			item.end.year = tempdate.getFullYear()
			item.end.month = tempdate.getMonth()
			item.end.day = tempdate.getDate()
			item.end.minute = tempdate.getHours() * 60 + tempdate.getMinutes()
		}
	}

	calendar.updateInfo(true)
	calendar.updateEvents()
	calendar.updateHistory()
	calendar.updateTodo()

	if (item.type == 0) {
		if(gtag){gtag('event', 'button_click', { useraction: 'Event - event info' })}
	} else {
		if(gtag){gtag('event', 'button_click', { useraction: 'Task - event info' })}
	}
}

//get borders
function getborders(startrange, endrange) {
	let maxdate = new Date(calendar.getDate().getTime())
	maxdate.setFullYear(maxdate.getFullYear() + 1)

	let output = []
	let shownevents = calendar.events.filter(d => !Calendar.Event.isHidden(d))
	for (let item of shownevents) {
		if (item.type != 1) continue

		let itemenddate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)

		if (item.repeat.interval == null || item.repeat.frequency == null || item.type == 1) {
			//no repeat
			if (!startrange || !endrange || (itemenddate.getTime() > startrange.getTime() && itemenddate.getTime() <= endrange.getTime())) {
				output.push(item)
			}
		} else {
			//repeat
			let byday = [0]
			if (item.repeat.frequency == 1) {
				byday = [...item.repeat.byday]
				if (byday.length == 0) {
					byday.push(itemenddate.getDay())
				}
			}

			for (let repeatindex of byday) {
				let repeatstartdate = new Date(itemenddate.getTime())
				if (item.repeat.frequency == 1) {
					repeatstartdate.setDate(repeatstartdate.getDate() + (repeatindex - repeatstartdate.getDay() + 7) % 7)
				}

				let intervalcounter = 0
				while (repeatstartdate.getTime() < maxdate.getTime()) {
					//create
					if (intervalcounter % item.repeat.interval == 0) {
						let repeatenddate = new Date(repeatstartdate.getTime())

						let repeatitem = deepCopy(item)

						repeatitem.endbefore.year = repeatenddate.getFullYear()
						repeatitem.endbefore.month = repeatenddate.getMonth()
						repeatitem.endbefore.day = repeatenddate.getDate()
						repeatitem.endbefore.minute = repeatenddate.getHours() * 60 + repeatenddate.getMinutes()

						if (!startrange || !endrange || (repeatenddate.getTime() > startrange.getTime() && repeatenddate.getTime() <= endrange.getTime())) {
							output.push(repeatitem)
						}
					}

					//next
					if (item.repeat.frequency == 0) {
						repeatstartdate.setDate(repeatstartdate.getDate() + 1)
					} else if (item.repeat.frequency == 1) {
						repeatstartdate.setDate(repeatstartdate.getDate() + 7)
					} else if (item.repeat.frequency == 2) {
						repeatstartdate.setMonth(repeatstartdate.getMonth() + 1)
					} else if (item.repeat.frequency == 3) {
						repeatstartdate.setFullYear(repeatstartdate.getFullYear() + 1)
					}

					intervalcounter++
				}

			}

		}
	}
	return output
}

//get conflicting events
function getconflictingevents(data) {
	let output = []

	for (let [i, item1] of Object.entries(data)) {
		for (let [j, item2] of Object.entries(data)) {
			if (i < j) {
				if (item1.id == item2.id) continue
				let tempstartdate1 = new Date(item1.start.year, item1.start.month, item1.start.day, 0, item1.start.minute)
				let tempenddate1 = new Date(item1.end.year, item1.end.month, item1.end.day, 0, item1.end.minute)

				let tempstartdate2 = new Date(item2.start.year, item2.start.month, item2.start.day, 0, item2.start.minute)
				let tempenddate2 = new Date(item2.end.year, item2.end.month, item2.end.day, 0, item2.end.minute)

				if (tempstartdate1.getTime() < tempenddate2.getTime() + calendar.settings.eventspacing * 60000 && tempenddate1.getTime() + calendar.settings.eventspacing * 60000 > tempstartdate2.getTime()) {
					if ((!item1.completed && item1.type == 1 && data.find(d => d.id == item1.id)) || (!item2.completed && item2.type == 1 && data.find(d => d.id == item2.id))) {
						output.push([item1, item2])
					}
				}

			}

		}
	}
	return output
}

//get sleeping events
function getsleepingevents(data) {
	let output = []

	for (let item of data) {
		let tempstartdate1 = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		let tempenddate1 = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
		let sleepstartdate1 = new Date(item.start.year, item.start.month, item.start.day, 0, calendar.settings.sleep.startminute)
		let sleependdate1 = new Date(item.start.year, item.start.month, item.start.day + 1, 0, calendar.settings.sleep.endminute + 30)
		let sleepstartdate2 = new Date(item.start.year, item.start.month, item.start.day - 1, 0, calendar.settings.sleep.startminute)
		let sleependdate2 = new Date(item.start.year, item.start.month, item.start.day, 0, calendar.settings.sleep.endminute + 30)

		if ((tempstartdate1.getTime() < sleependdate1.getTime() && tempenddate1.getTime() > sleepstartdate1.getTime()) || (tempstartdate1.getTime() < sleependdate2.getTime() && tempenddate1.getTime() > sleepstartdate2.getTime())) {
			if (item.type == 1 && data.find(d => d.id == item.id)) {
				output.push(item)
			}
		}
	}
	return output
}

//get events between range, given existing events (including repeating)
function geteventslite(startrange, endrange, filterevents){
	return filterevents.filter(item => {
		let itemstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		let itemenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

		if(!Calendar.Event.isHidden(item)){
			if (!startrange || !endrange || (itemenddate.getTime() > startrange.getTime() && itemstartdate.getTime() < endrange.getTime())) {
				return true
			}
		}
		return false
	})
}


//get all calendar events if no parameters
//get events between range if parameters
function getevents(startrange, endrange, filterevents) {
	let maxdate = new Date(calendar.getDate().getTime())
	maxdate.setFullYear(maxdate.getFullYear() + 1)

	let output = []
	let shownevents = calendar.events.filter(d => {
		return !Calendar.Event.isHidden(d) && (!filterevents || filterevents.find(g => g.id === d.id))
	})


	for (let item of shownevents) {
		let itemstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		let itemenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

		if (item.repeat.interval == null || item.repeat.frequency == null || item.type == 1) {
			//no repeat
			if (!startrange || !endrange || (itemenddate.getTime() > startrange.getTime() && itemstartdate.getTime() < endrange.getTime())) {
				output.push(item)
			}
		} else {
			//repeat
			let byday = [0]
			if (item.repeat.frequency == 1) {
				byday = [...item.repeat.byday]
				if (byday.length == 0) {
					byday.push(itemstartdate.getDay())
				}
			}

			for (let repeatindex of byday) {
				let repeatstartdate = new Date(itemstartdate.getTime())
				if (item.repeat.frequency == 1) {
					repeatstartdate.setDate(repeatstartdate.getDate() + (repeatindex - repeatstartdate.getDay() + 7) % 7)
				}


				let counter = 0

				while (repeatstartdate.getTime() < maxdate.getTime()) {
					//create
					if (counter % item.repeat.interval == 0) {
						let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()
						let repeatenddate = new Date(repeatstartdate.getTime() + duration)

						let repeatitem = deepCopy(item)
						repeatitem.start.year = repeatstartdate.getFullYear()
						repeatitem.start.month = repeatstartdate.getMonth()
						repeatitem.start.day = repeatstartdate.getDate()
						repeatitem.start.minute = repeatstartdate.getHours() * 60 + repeatstartdate.getMinutes()

						repeatitem.end.year = repeatenddate.getFullYear()
						repeatitem.end.month = repeatenddate.getMonth()
						repeatitem.end.day = repeatenddate.getDate()
						repeatitem.end.minute = repeatenddate.getHours() * 60 + repeatenddate.getMinutes()

						if (!startrange || !endrange || (repeatenddate.getTime() > startrange.getTime() && repeatstartdate.getTime() < endrange.getTime())) {
							output.push(repeatitem)
						}
					}

					//next
					if (item.repeat.frequency == 0) {
						repeatstartdate.setDate(repeatstartdate.getDate() + 1)
					} else if (item.repeat.frequency == 1) {
						repeatstartdate.setDate(repeatstartdate.getDate() + 7)
					} else if (item.repeat.frequency == 2) {
						repeatstartdate.setMonth(repeatstartdate.getMonth() + 1)
					} else if (item.repeat.frequency == 3) {
						repeatstartdate.setFullYear(repeatstartdate.getFullYear() + 1)
					}

					counter++

					//until or count
					if ((item.repeat.count && counter >= item.repeat.count) || (item.repeat.until && repeatstartdate.getTime() > new Date(item.repeat.until).getTime())) {
						break
					}

				}

			}

		}
	}
	return output
}




//get least busy date V1
function getLeastBusyDateV1(item, myevents) {
	let startafterdate = new Date()
	startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)
	let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)

	//fix due date to before sleep
	let sleepstartdate1 = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, calendar.settings.sleep.startminute)
	let sleependdate1 = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day + 1, 0, calendar.settings.sleep.endminute + 30)
	let sleepstartdate2 = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day - 1, 0, calendar.settings.sleep.startminute)
	let sleependdate2 = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, calendar.settings.sleep.endminute + 30)
	if (endbeforedate.getTime() > sleepstartdate1.getTime() && endbeforedate.getTime() < sleependdate1.getTime()) {
		endbeforedate.setTime(sleepstartdate1.getTime())
	}
	if (endbeforedate.getTime() > sleepstartdate2.getTime() && endbeforedate.getTime() < sleependdate2.getTime()) {
		endbeforedate.setTime(sleepstartdate2.getTime())
	}

	let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	let enddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

	let duration = enddate.getTime() - startdate.getTime()

	let data = []
	let range = Math.floor((endbeforedate.getTime() - startafterdate.getTime()) / 60000)
	//loop through every 5 minutes
	for (let tempminute = 0; tempminute <= range; tempminute += 5) {
		let tempstartdate = new Date(startafterdate.getTime())
		tempstartdate.setMinutes(tempstartdate.getMinutes() + tempminute)

		let otherevents = myevents.filter(b => b.id != item.id)

		//sleep
		otherevents.push({ start: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate() - 1, minute: calendar.settings.sleep.startminute }, end: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate(), minute: calendar.settings.sleep.endminute + 30 } })
		otherevents.push({ start: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate(), minute: calendar.settings.sleep.startminute }, end: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate() + 1, minute: calendar.settings.sleep.endminute + 30 } })

		let inverteddistance = 0
		for (let otheritem of otherevents) {
			let otherstartdate = new Date(otheritem.start.year, otheritem.start.month, otheritem.start.day, 0, otheritem.start.minute)
			let otherenddate = new Date(otheritem.end.year, otheritem.end.month, otheritem.end.day, 0, otheritem.end.minute)

			//add inverted distance of each event to total
			let distance = Math.min(Math.abs(otherstartdate.getTime() - tempstartdate.getTime()), Math.abs(otherenddate.getTime() - tempstartdate.getTime()))
			inverteddistance += 1 / distance
		}

		data.push(inverteddistance)
	}

	let leastbusyindex = data.indexOf(Math.min(...data)) * 5
	leastbusyindex = Math.floor(leastbusyindex / (item.priority + 1)) //make earlier if important

	let leastbusydate = new Date(startafterdate.getTime())
	leastbusydate.setMinutes(leastbusydate.getMinutes() + leastbusyindex)
	if (leastbusydate.getTime() > endbeforedate.getTime() - duration / 2) {
		leastbusydate.setTime(endbeforedate.getTime() - duration / 2)
	}
	if (leastbusydate.getTime() < startafterdate.getTime() + duration / 2) {
		leastbusydate.setTime(startafterdate.getTime() + duration / 2)
	}
	return leastbusydate
}

//get iterated events in calendar view
function getiteratedevents() {
	let currentdate;
	let nextdate;
	if (calendarmode == 0) {
		currentdate = new Date(calendar.getDate())
		currentdate.setHours(0, 0, 0, 0)
		currentdate.setDate(currentdate.getDate() - 1)
		nextdate = new Date(currentdate.getTime())
		nextdate.setDate(nextdate.getDate() + 3)
	} else if (calendarmode == 1) {
		currentdate = new Date(calendar.getDate())
		currentdate.setHours(0, 0, 0, 0)
		currentdate.setDate(currentdate.getDate() - currentdate.getDay() - 7)
		nextdate = new Date(currentdate.getTime())
		nextdate.setDate(nextdate.getDate() + 21)
	} else if (calendarmode == 2) {
		currentdate = new Date(calendar.getDate())
		currentdate.setHours(0, 0, 0, 0)
		currentdate.setDate(1)
		currentdate.setMonth(currentdate.getMonth() - 1)
		nextdate = new Date(currentdate.getTime())
		nextdate.setMonth(nextdate.getMonth() + 3)
	}

	let tempborders = getborders(currentdate, nextdate)
	let tempevents = getevents(currentdate, nextdate)
	let output = []
	for (let item of [...tempborders, ...tempevents]) {
		if (!output.find(d => d.id == item.id && new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime() == new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute).getTime())) {
			if (!Calendar.Event.isAllDay(item)) {
				output.push(item)
			}
		}
	}
	return output
}


//get least busy date V2
function getLeastBusyDateV2(item, myevents, availabletime) {
	let startafterdate = new Date()
	startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)

	let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	let enddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

	let duration = enddate.getTime() - startdate.getTime()

	let data = []
	//loop through every range by 5 minutes
	for (let range of availabletime) {
		let rangeduration = range.end - range.start
		let tempminutes = Math.floor((rangeduration - duration) / 60000)

		for (let tempminute = 0; tempminute <= tempminutes; tempminute += 5) {
			let tempstartdate = new Date(range.start)
			tempstartdate.setMinutes(tempstartdate.getMinutes() + tempminute)

			let otherevents = myevents.filter(b => b.id != item.id)

			//sleep
			otherevents.push({ start: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate() - 1, minute: calendar.settings.sleep.startminute }, end: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate(), minute: calendar.settings.sleep.endminute + 30 } })
			otherevents.push({ start: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate(), minute: calendar.settings.sleep.startminute }, end: { year: tempstartdate.getFullYear(), month: tempstartdate.getMonth(), day: tempstartdate.getDate() + 1, minute: calendar.settings.sleep.endminute + 30 } })

			let inverteddistance = 0
			for (let otheritem of otherevents) {
				let otherstartdate = new Date(otheritem.start.year, otheritem.start.month, otheritem.start.day, 0, otheritem.start.minute)
				let otherenddate = new Date(otheritem.end.year, otheritem.end.month, otheritem.end.day, 0, otheritem.end.minute)

				//add inverted distance of each event to total
				let distance = Math.min(Math.abs(otherstartdate.getTime() - tempstartdate.getTime()), Math.abs(otherenddate.getTime() - tempstartdate.getTime()))
				inverteddistance += 1 / distance
			}

			data.push({ value: inverteddistance, timestamp: tempstartdate.getTime() })
		}
	}

	let minitem = data[0]
	for (let i = 1; i < data.length; i++) {
		if (data[i].value < minitem.value) {
			minitem = data[i]
		}
	}
	let timestamp;
	if (minitem) {
		timestamp = minitem.timestamp
	} else {
		timestamp = startafterdate.getTime()
	}

	let leastbusydate = new Date(timestamp)
	return leastbusydate
}

//get available times
function getavailabletime(item, startrange, endrange) {
	let availabletime = []

	let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()

	let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)

	//exclude events
	let filteredevents = getevents(startrange, endrange).filter(d => d.id != item.id && d.type != 1 && !Calendar.Event.isAllDay(d)).sort((a, b) => {
		return new Date(a.start.year, a.start.month, a.start.day, 0, a.start.minute).getTime() - new Date(b.start.year, b.start.month, b.start.day, 0, b.start.minute).getTime()
	})

	let lastendtime = startrange.getTime()
	for (let tempevent of filteredevents) {
		let start = new Date(tempevent.start.year, tempevent.start.month, tempevent.start.day, 0, tempevent.start.minute)
		let end = new Date(tempevent.end.year, tempevent.end.month, tempevent.end.day, 0, tempevent.end.minute)

		if (start.getTime() >= lastendtime) {
			availabletime.push({ start: lastendtime, end: start.getTime() })
		}
		lastendtime = Math.max(lastendtime, end.getTime())
	}

	if (lastendtime < endrange.getTime()) {
		availabletime.push({ start: lastendtime, end: endrange.getTime() })
	}


	//exclude sleep and time window
	let newavailabletime = []

	let tempstartdate = new Date(startrange)
	tempstartdate.setHours(0, 0, 0, 0)
	for (; tempstartdate.getTime() <= endrange.getTime(); tempstartdate.setDate(tempstartdate.getDate() + 1)) {
		let tempenddate = new Date(tempstartdate)
		tempenddate.setDate(tempenddate.getDate() + 1)

		let sleepstart = new Date(tempstartdate)
		sleepstart.setHours(0, calendar.settings.sleep.startminute, 0, 0)
		let sleepend = new Date(tempstartdate)
		sleepend.setHours(0, calendar.settings.sleep.endminute + 30, 0, 0)

		let tempranges = availabletime.filter(d => {
			return d.start < tempenddate.getTime() && d.end > tempstartdate.getTime()
		})

		for (let range of tempranges) {
			//sleep exclusion
			let newstart = Math.max(sleepend.getTime(), range.start)
			let newend = Math.min(sleepstart.getTime(), range.end)

			//time window exclusion
			if (item.timewindow.time.startminute && item.timewindow.time.endminute) {
				let timewindowstart = new Date(tempstartdate)
				timewindowstart.setHours(0, item.timewindow.time.startminute, 0, 0)
				let timewindowend = new Date(tempstartdate)
				timewindowend.setHours(0, item.timewindow.time.endminute, 0, 0)

				newstart = Math.max(newstart, timewindowstart.getTime())
				newend = Math.min(newend, timewindowend.getTime())
			}

			//day window exclusion
			if (item.timewindow.day.byday.length > 0 && !item.timewindow.day.byday.includes(tempstartdate.getDay())) {
				continue
			}

			//event needs to fit range
			newend -= duration

			if (newstart <= newend) {
				newavailabletime.push({ start: newstart, end: newend })
			}
		}
	}

	return newavailabletime
}


//auto schedule V2
let animatenextitem;
let reviewanimate;
let closeanimate;
let isautoscheduling = false;

let rescheduletaskfunction;

async function autoScheduleV2({smartevents, addedtodos, resolvedpassedtodos}) {
	//functions
	function sleep(time) {
		return new Promise(resolve => {
			setTimeout(resolve, time)
		})
	}



	function fixconflict(item, conflictitem, spacing = 0) {
		let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()
		//get penetration
		let differenceA = Math.abs(new Date(conflictitem.end.year, conflictitem.end.month, conflictitem.end.day, 0, conflictitem.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute))
		let differenceB = Math.abs(new Date(conflictitem.start.year, conflictitem.start.month, conflictitem.start.day, 0, conflictitem.start.minute).getTime() - new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute))

		let penetration = Math.min(differenceA, differenceB) + spacing

		//move time
		let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		startdate.setTime(startdate.getTime() + penetration)
		startdate.setMinutes(ceil(startdate.getMinutes(), 5))
		let enddate = new Date(startdate.getTime() + duration)

		item.start.year = startdate.getFullYear()
		item.start.month = startdate.getMonth()
		item.start.day = startdate.getDate()
		item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

		item.end.year = enddate.getFullYear()
		item.end.month = enddate.getMonth()
		item.end.day = enddate.getDate()
		item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
	}


	function getbreaktime(item) {
		let eventspacingratio = calendar.settings.eventspacing / 60
		if(isNaN(eventspacingratio)){
			eventspacingratio = 15
		}

		let duration = (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())
		return Math.min(Math.max(round(duration * eventspacingratio, 60000 * 5), 60000 * 5), 60 * 60000)
		
	  }
	  

	function getconflictingevent(data, item1) {
		let sortdata = data.sort((a, b) => {
			return new Date(b.start.year, b.start.month, b.start.day, 0, b.start.minute).getTime() - new Date(a.start.year, a.start.month, a.start.day, 0, a.start.minute).getTime()
		})

		
		for (let item2 of sortdata) {
			if (item1.id == item2.id || Calendar.Event.isAllDay(item2)) continue
			let tempstartdate1 = new Date(item1.start.year, item1.start.month, item1.start.day, 0, item1.start.minute)
			let tempenddate1 = new Date(item1.end.year, item1.end.month, item1.end.day, 0, item1.end.minute)

			let tempstartdate2 = new Date(item2.start.year, item2.start.month, item2.start.day, 0, item2.start.minute)
			let tempenddate2 = new Date(item2.end.year, item2.end.month, item2.end.day, 0, item2.end.minute)

			let spacing = getbreaktime(item2)

			if (tempstartdate1.getTime() < tempenddate2.getTime() + spacing && tempenddate1.getTime() + spacing > tempstartdate2.getTime()) {
				return [item2, spacing]
			}
		}

		return null
	}


	function isoutofrange(item) {
		let startafterdate = new Date()
		startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)

		let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		let enddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

		return getavailabletime(item, startdate, enddate).length != 1
	}

	function fixrange(item) {
		let startafterdate = new Date()
		startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)
		let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
		if (endbeforedate.getTime() < startafterdate.getTime()) {
			endbeforedate.setTime(startafterdate.getTime())
		}

		let oldstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		let oldenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
		let duration = oldenddate.getTime() - oldstartdate.getTime()

		let nextdate = new Date(oldstartdate)
		nextdate.setDate(nextdate.getDate() + 30) //check for openings 1 month in future

		function moveitemto(starttimestamp) {
			let temprangestart = new Date(starttimestamp)
			let temprangeend = new Date(temprangestart)
			temprangeend.setTime(temprangeend.getTime() + duration)

			item.start.year = temprangestart.getFullYear()
			item.start.month = temprangestart.getMonth()
			item.start.day = temprangestart.getDate()
			item.start.minute = temprangestart.getHours() * 60 + temprangestart.getMinutes()

			item.end.year = temprangeend.getFullYear()
			item.end.month = temprangeend.getMonth()
			item.end.day = temprangeend.getDate()
			item.end.minute = temprangeend.getHours() * 60 + temprangeend.getMinutes()
		}

		let availabletime = getavailabletime(item, oldstartdate, nextdate)

		if (availabletime[0]) {
			let rangeindex = 0
			let finalrangeindex = 0
			for (let range of availabletime) {
				if (oldstartdate.getTime() <= range.end && oldstartdate.getTime() >= range.start) {
					finalrangeindex = rangeindex + 1
					break
				}
				rangeindex++
			}

			rangeindex = Math.min(finalrangeindex, availabletime.length - 1)
			let myrange = availabletime[rangeindex]

			moveitemto(myrange.start)
		}
	}

	function getcalculatedpriority(tempitem) {
		let currentdate = new Date()
		let timedifference = new Date(tempitem.endbefore.year, tempitem.endbefore.month, tempitem.endbefore.day, 0, tempitem.endbefore.minute).getTime() - currentdate.getTime()
		return currentdate.getTime() * (tempitem.priority + 1) / Math.max(timedifference, 1)
	}


	//============================================================================


	if (isautoscheduling == true && resolvedpassedtodos.length == 0) return
	isautoscheduling = true


	//stats
	const autoschedulestats = {}
	const startautoscheduleprocess = performance.now()


	//initialize
	let iteratedevents = getiteratedevents()
	let oldsmartevents = deepCopy(smartevents)
	let oldcalendarevents = deepCopy(calendar.events)

	smartevents = smartevents.filter(d => Calendar.Event.isSchedulable(d)).sort((a, b) => {
		return getcalculatedpriority(b) - getcalculatedpriority(a)
	})


	//check for todos that are currently being done - don't reschedule first one
	let doingtodos = sortstartdate(smartevents).filter(d => new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute).getTime() <= Date.now() && new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute).getTime() > Date.now() && !getconflictingevent(iteratedevents, d))
	if(doingtodos[0]){
		smartevents = smartevents.filter(d => d.id != doingtodos[0].id)
	}


	//check for todos that haven't been done - ask to reschedule them
	let passedtodos = smartevents.filter(d => new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute).getTime() <= Date.now())
	if(resolvedpassedtodos){
		passedtodos = passedtodos.filter(d => !resolvedpassedtodos.find(f => f == d.id))
	}
	
	if(passedtodos.length > 0){
		let overdueitem = passedtodos[0]

		rescheduletaskfunction = async function(complete){
			let tempitem = calendar.events.find(d => d.id == overdueitem.id)

			if(complete){
				if(tempitem){
					tempitem.completed = true
					calendar.updateTodo()
				}
				calendar.updateEvents()
			}

			let rescheduletaskpopup = getElement('rescheduletaskpopup')
			rescheduletaskpopup.classList.add('hiddenpopup')

			let newresolvedpassedtodos = resolvedpassedtodos || []

			newresolvedpassedtodos.push(overdueitem.id)

			await sleep(300)

			autoScheduleV2({smartevents: smartevents, addedtodos: addedtodos, resolvedpassedtodos: newresolvedpassedtodos})
		}

		//show popup
		let rescheduletaskpopuptext = getElement('rescheduletaskpopuptext')
		rescheduletaskpopuptext.innerHTML = `We want to keep your schedule up-to-date.<br>Have you completed <span class="text-bold">${Calendar.Event.getTitle(overdueitem)}</span>?`

		let rescheduletaskpopupbuttons = getElement('rescheduletaskpopupbuttons')
		rescheduletaskpopupbuttons.innerHTML = `
			<div class="border-8px background-tint-1 hover:background-tint-2 padding-8px-12px text-primary text-14px transition-duration-100 pointer" onclick="rescheduletaskfunction()">No, reschedule it</div>
			<div class="border-8px background-blue hover:background-blue-hover padding-8px-12px text-white text-14px transition-duration-100 pointer" onclick="rescheduletaskfunction(true)">Yes, mark completed</div>`

		let rescheduletaskpopup = getElement('rescheduletaskpopup')
		rescheduletaskpopup.classList.remove('hiddenpopup')
		return
	}

	//start
	if (true) {
		//SMART FOCUS

		//set to best time
		for(let item of smartevents){
			let startafterdate = new Date()
			startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)

			//repeat task scheduling
			//move repeat to start after last repeat is due
			if(item.repeatid){
				let relatedtodos = sortduedate([...calendar.events, ...calendar.todos].filter(d => d.repeatid == item.repeatid || d.id == item.repeatid))
				let currentindex = relatedtodos.findIndex(d => d.id == item.id)
				if(currentindex > 0){
					let previoustodo = relatedtodos[currentindex - 1]
					startafterdate = new Date(previoustodo.endbefore.year, previoustodo.endbefore.month, previoustodo.endbefore.day, 0, previoustodo.endbefore.minute)
				}
			}


			let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
			if (endbeforedate.getTime() < startafterdate.getTime()) {
				endbeforedate.setTime(startafterdate.getTime())
			}

			let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()


			//subtask scheduling
			let percentrange = 0.4 //default schedule at 40% of range
			let parent = Calendar.Event.getMainTask(item)
			if(parent){
				let scheduledchildren = Calendar.Event.getSubtasks(parent).filter(d => Calendar.Event.isEvent(item))
				let childindex = scheduledchildren.findIndex(d => d.id == item.id)
				if(childindex != -1){
					percentrange = (1 + childindex)/Calendar.Event.getSubtasks(Calendar.Event.getMainTask(item)).length * 0.9 //evenly space out sub tasks, finish by 90% of range
				}
			}

			let daystartafterdate = new Date(startafterdate)
			daystartafterdate.setHours(0,0,0,0)
			let dayindex = Math.floor((endbeforedate.getTime() - daystartafterdate.getTime()) * percentrange / 86400000)

			let startdate = new Date(daystartafterdate.getTime())
			startdate.setDate(startdate.getDate() + dayindex)
			startdate.setTime(Math.max(startdate.getTime(), startafterdate.getTime()))
			let enddate = new Date(startdate.getTime() + duration)

			item.start.year = startdate.getFullYear()
			item.start.month = startdate.getMonth()
			item.start.day = startdate.getDate()
			item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

			item.end.year = enddate.getFullYear()
			item.end.month = enddate.getMonth()
			item.end.day = enddate.getDate()
			item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
		}


		//fix conflicts
		let donesmartevents = []
		smartevents = smartevents.sort((a, b) => {
			return getcalculatedpriority(b) - getcalculatedpriority(a)
		})
		for (let item of smartevents) {
			donesmartevents.push(item)

			let tempiteratedevents = iteratedevents.filter(d => donesmartevents.find(f => f.id == d.id) || !smartevents.find(g => g.id == d.id))


			//fix conflict
			let loopindex = 0
			while (true) {
				let outofrange = isoutofrange(item)
				if (outofrange) {
					fixrange(item)
				}


				let temp = getconflictingevent(tempiteratedevents, item)
				let conflictitem, spacing;
				if(temp) [conflictitem, spacing] = temp
				if (conflictitem) {
					fixconflict(item, conflictitem, spacing)
				}

				//exit
				loopindex++
				if ((!outofrange && !conflictitem) || loopindex > 1000) {
					break
				}
			}

		}


		
		//adjust time
		/*
		smartevents = smartevents.sort((a, b) => {
			return new Date(b.start.year, b.start.month, b.start.day, 0, b.start.minute).getTime() - new Date(a.start.year, a.start.month, a.start.day, 0, a.start.minute).getTime()
		})
		for(let item of smartevents){
			let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()

			let startafterdate = new Date()
			startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)

			let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
			if (endbeforedate.getTime() < startafterdate.getTime()) {
				endbeforedate.setTime(startafterdate.getTime())
			}

			let range = endbeforedate.getTime() - startafterdate.getTime()


			let freetimes = []
			let tempstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			let oldstartdatetime = tempstartdate.getTime()
			while(tempstartdate.getTime() <= (startafterdate.getTime() + range * 0.4) - duration){ //0.4 is the magic constant
				let tempenddate = new Date(tempstartdate)
				tempenddate.setTime(tempenddate.getTime() + duration)

				item.start.year = tempstartdate.getFullYear()
				item.start.month = tempstartdate.getMonth()
				item.start.day = tempstartdate.getDate()
				item.start.minute = tempstartdate.getHours() * 60 + tempstartdate.getMinutes()

				item.end.year = tempenddate.getFullYear()
				item.end.month = tempenddate.getMonth()
				item.end.day = tempenddate.getDate()
				item.end.minute = tempenddate.getHours() * 60 + tempenddate.getMinutes()

				if(!getconflictingevent(iteratedevents, item) && !isoutofrange(item)){
					freetimes.push(tempstartdate.getTime())
				}

				tempstartdate.setMinutes(tempstartdate.getMinutes() + 60)
			}

			let lastfreetime = oldstartdatetime
			if(freetimes.length > 0){
				lastfreetime = Math.max(...freetimes)
			}


			let lastfreestartdate = new Date(lastfreetime)
			let lastfreeenddate = new Date(lastfreetime + duration)
			
			item.start.year = lastfreestartdate.getFullYear()
			item.start.month = lastfreestartdate.getMonth()
			item.start.day = lastfreestartdate.getDate()
			item.start.minute = lastfreestartdate.getHours() * 60 + lastfreestartdate.getMinutes()

			item.end.year = lastfreeenddate.getFullYear()
			item.end.month = lastfreeenddate.getMonth()
			item.end.day = lastfreeenddate.getDate()
			item.end.minute = lastfreeenddate.getHours() * 60 + lastfreeenddate.getMinutes()
		}
		*/
	} else if (calendar.smartschedule.mode == 1) {
		//BALANCED

		//set to specific part of range
		let priorityindex = 0;
		for (let item of smartevents) {
			let startafterdate = new Date()
			startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)
			let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
			if (endbeforedate.getTime() < startafterdate.getTime()) {
				endbeforedate.setTime(startafterdate.getTime())
			}


			let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()


			let availabletime = getavailabletime(item, startafterdate, endbeforedate)
			let totaltime = 0
			for (let myrange of availabletime) {
				totaltime += myrange.end - myrange.start
			}
			let percenttime = (totaltime - duration) * priorityindex / (Math.max(smartevents.length - 1), 1)

			let temptime = 0
			let finaltime = startafterdate.getTime()
			for (let myrange of availabletime) {
				let rangeduration = myrange.end - myrange.start
				temptime += rangeduration
				if (temptime >= percenttime) {
					finaltime = myrange.start + (percenttime - (temptime - rangeduration))
					break
				}
			}

			let startdate = new Date(finaltime)
			startdate.setMinutes(ceil(startdate.getMinutes(), 5))
			let enddate = new Date(startdate)
			enddate.setTime(enddate.getTime() + duration)

			item.start.year = startdate.getFullYear()
			item.start.month = startdate.getMonth()
			item.start.day = startdate.getDate()
			item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

			item.end.year = enddate.getFullYear()
			item.end.month = enddate.getMonth()
			item.end.day = enddate.getDate()
			item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()

			priorityindex++
		}

		//final touch
		let donesmartevents = []
		for (let item of smartevents) {
			donesmartevents.push(item)

			let tempiteratedevents = iteratedevents.filter(d => donesmartevents.find(f => f.id == d.id) || !smartevents.find(g => g.id == d.id))

			//get basic variables
			let startafterdate = new Date()
			startafterdate.setMinutes(ceil(startafterdate.getMinutes(), 5), 0, 0)
			let endbeforedate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
			if (endbeforedate.getTime() < startafterdate.getTime()) {
				endbeforedate.setTime(startafterdate.getTime())
			}

			let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()

			let availabletime = getavailabletime(item, startafterdate, endbeforedate)
			if (availabletime.length > 0) {
				let leastbusydate = getLeastBusyDateV2(item, smartevents, availabletime)

				let startdate = new Date(leastbusydate)
				let enddate = new Date(startdate)
				enddate.setTime(enddate.getTime() + duration)

				item.start.year = startdate.getFullYear()
				item.start.month = startdate.getMonth()
				item.start.day = startdate.getDate()
				item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

				item.end.year = enddate.getFullYear()
				item.end.month = enddate.getMonth()
				item.end.day = enddate.getDate()
				item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
			}

			//fix conflict
			let loopindex = 0
			while (true) {
				let outofrange = isoutofrange(item)
				if (outofrange) {
					fixrange(item)
				}

				let temp = getconflictingevent(tempiteratedevents, item)
				let conflictitem, spacing;
				if(temp) [conflictitem, spacing] = temp
				if (conflictitem) {
					fixconflict(item, conflictitem, spacing)
				}

				//exit
				loopindex++
				if ((!outofrange && !conflictitem) || loopindex > 1000) {
					break
				}
			}

		}
	}



	let modifiedevents = sortstartdate(oldsmartevents.filter(item1 => {
		let item2 = smartevents.find(f => f.id == item1.id)
		if (!item2) return false

		if (addedtodos.find(d => d.id == item1.id)) return true

		if (new Date(item1.start.year, item1.start.month, item1.start.day, 0, item1.start.minute).getTime() == new Date(item2.start.year, item2.start.month, item2.start.day, 0, item2.start.minute).getTime()) {
			return false
		}
		return true
	}))
	

	//stop if no change
	if(modifiedevents.length == 0){
		isautoscheduling = false
		return
	}

	//stats
	autoschedulestats.scheduleduration = performance.now() - startautoscheduleprocess
	autoschedulestats.iteratedeventslength = iteratedevents.length
	autoschedulestats.smarteventslength = smartevents.length
	autoschedulestats.modifiedeventslength = modifiedevents.length


	//scroll to first event
	let oldcalendaryear = calendaryear
	let oldcalendarmonth = calendarmonth
	let oldcalendarday = calendarday

	if (addedtodos.length > 0) {
		let firstitem = calendar.events.find(f => f.id == modifiedevents[0].id)
		if(firstitem){
			let firstitemdate = new Date(firstitem.start.year, firstitem.start.month, firstitem.start.day, 0, firstitem.start.minute)

			if(!isNaN(firstitemdate.getTime())){
				//horizontal
				calendaryear = firstitemdate.getFullYear()
				calendarmonth = firstitemdate.getMonth()
				calendarday = firstitemdate.getDate()

				//vertical
				let target = firstitemdate.getHours() * 60 + firstitemdate.getMinutes()
				scrollcalendarY(target)
			}
		}
	}

	if (oldcalendaryear != calendaryear || oldcalendarmonth != calendarmonth || oldcalendarday != calendarday) {
		calendar.updateCalendar()
	}


	//stats
	const startautoscheduleanimate = performance.now()

	//animate
	let autoscheduleframemenu = getElement('autoscheduleframemenu')
	let autoscheduleframemenucontent = getElement('autoscheduleframemenucontent')

	clickscheduleframeclose()

	let newcalendarevents = deepCopy(calendar.events)
	calendar.events = deepCopy(oldcalendarevents)



	function animateitem(id){
		return new Promise(resolve => {
			let newitem = newcalendarevents.find(d => d.id == id)
			let olditem = oldsmartevents.find(d => d.id == id)
			let item = calendar.events.find(d => d.id == id)
			let todoitem = addedtodos.find(d => d.id == id)

			if(!newitem || !olditem || !item){
				resolve()
				return
			}

			let oldstartdate = new Date(olditem.start.year, olditem.start.month, olditem.start.day, 0, olditem.start.minute)
			let oldenddate = new Date(olditem.end.year, olditem.end.month, olditem.end.day, 0, olditem.end.minute)
			let duration = oldenddate.getTime() - oldstartdate.getTime()

			let realfinalstartdate = new Date(newitem.start.year, newitem.start.month, newitem.start.day, 0, newitem.start.minute)
			let finalstartdate = new Date(oldstartdate)
			finalstartdate.setHours(realfinalstartdate.getHours(), realfinalstartdate.getMinutes())
			
			let difference = finalstartdate.getTime() - oldstartdate.getTime()

			const frames = 30
			function nextframe(){
				if(todoitem){
					let percentage = easeoutcubic(tick/frames)
					
					let autoscheduleitem = autoscheduleeventslist.find(f => f.id == item.id)
					if(autoscheduleitem){
						autoscheduleitem.percentage = percentage
						calendar.updateAnimatedEvents()
					}
				}else{
					let percentage = beziercurve(tick/frames)

					let newstartdate = new Date(oldstartdate.getTime() + difference * percentage)
					let newenddate = new Date(newstartdate.getTime() + duration)

					item.start.minute = newstartdate.getHours() * 60 + newstartdate.getMinutes()
					item.start.day = newstartdate.getDate()
					item.start.month = newstartdate.getMonth()
					item.start.year = newstartdate.getFullYear()

					item.end.minute = newenddate.getHours() * 60 + newenddate.getMinutes()
					item.end.day = newenddate.getDate()
					item.end.month = newenddate.getMonth()
					item.end.year = newenddate.getFullYear()

					let autoscheduleitem = autoscheduleeventslist.find(f => f.id == item.id)
					if(autoscheduleitem){
						autoscheduleitem.percentage = percentage
						calendar.updateAnimatedEvents()
					}
				}


				if (tick >= frames || todoitem) {
					let newstartdate = new Date(realfinalstartdate)
					let newenddate = new Date(newstartdate.getTime() + duration)
	
					item.start.minute = newstartdate.getHours() * 60 + newstartdate.getMinutes()
					item.start.day = newstartdate.getDate()
					item.start.month = newstartdate.getMonth()
					item.start.year = newstartdate.getFullYear()
					
					item.end.minute = newenddate.getHours() * 60 + newenddate.getMinutes()
					item.end.day = newenddate.getDate()
					item.end.month = newenddate.getMonth()
					item.end.year = newenddate.getFullYear()
				}

				if(tick >= frames && !todoitem){
					let autoscheduleitem = autoscheduleeventslist.find(f => f.id == item.id)
					if(autoscheduleitem){
						autoscheduleitem.percentage = 0
						calendar.updateAnimatedEvents()
					}
				}


				if (tick >= frames) {
					//stop
					
					return resolve()
				} else {
					//continue
					tick++
					calendar.updateAnimatedEvents()
					requestAnimationFrame(nextframe, 10)
				}

			}

			let tick = 0
			nextframe()
		})
	}

	
	function animateitems(items) {
		return new Promise(resolve => {

			if (items.length == 0) {
				resolve()
				return
			}

			const frames = 30
			function nextframe() {
				for (let id of items) {
					let newitem = newcalendarevents.find(d => d.id == id)
					let olditem = oldsmartevents.find(d => d.id == id)
					let item = calendar.events.find(d => d.id == id)

					if (!newitem || !olditem || !item) {
						continue
					}

					let oldstartdate = new Date(olditem.start.year, olditem.start.month, olditem.start.day, 0, olditem.start.minute)
					let oldenddate = new Date(olditem.end.year, olditem.end.month, olditem.end.day, 0, olditem.end.minute)
					let duration = oldenddate.getTime() - oldstartdate.getTime()

					let realfinalstartdate = new Date(newitem.start.year, newitem.start.month, newitem.start.day, 0, newitem.start.minute)
					let finalstartdate = new Date(oldstartdate)
					finalstartdate.setHours(realfinalstartdate.getHours(), realfinalstartdate.getMinutes())

					let difference = finalstartdate.getTime() - oldstartdate.getTime()


					let newstartdate = new Date(oldstartdate.getTime() + difference * beziercurve(tick / frames))
					let newenddate = new Date(newstartdate.getTime() + duration)

					item.start.minute = newstartdate.getHours() * 60 + newstartdate.getMinutes()
					item.start.day = newstartdate.getDate()
					item.start.month = newstartdate.getMonth()
					item.start.year = newstartdate.getFullYear()

					item.end.minute = newenddate.getHours() * 60 + newenddate.getMinutes()
					item.end.day = newenddate.getDate()
					item.end.month = newenddate.getMonth()
					item.end.year = newenddate.getFullYear()

					let autoscheduleitem = autoscheduleeventslist.find(f => f.id == item.id)
					if (autoscheduleitem) {
						autoscheduleitem.percentage = beziercurve(tick / frames)
					}

					if (tick >= frames) {
						let newstartdate = new Date(realfinalstartdate)
						let newenddate = new Date(newstartdate.getTime() + duration)

						item.start.minute = newstartdate.getHours() * 60 + newstartdate.getMinutes()
						item.start.day = newstartdate.getDate()
						item.start.month = newstartdate.getMonth()
						item.start.year = newstartdate.getFullYear()

						item.end.minute = newenddate.getHours() * 60 + newenddate.getMinutes()
						item.end.day = newenddate.getDate()
						item.end.month = newenddate.getMonth()
						item.end.year = newenddate.getFullYear()
					}

				}

				if (tick >= frames) {
					//stop
					return resolve()
				} else {
					//continue
					tick++
					calendar.updateAnimatedEvents()
					requestAnimationFrame(nextframe, 10)
				}

			}

			let tick = 0
			nextframe()
		})
	}

	function displayitem(id) {
		let newitem = newcalendarevents.find(d => d.id == id)
		let olditem = oldsmartevents.find(d => d.id == id)

		if (!newitem || !olditem) return

		let currentdate = new Date()
		let itemstartdate = new Date(newitem.start.year, newitem.start.month, newitem.start.day, 0, newitem.start.minute)

		autoscheduleeventid = id

		autoscheduleeventslist = [{ id: id, percentage: 0 }]
		calendar.updateEvents()
		calendar.updateAnimatedEvents()

		autoscheduleframemenucontent.innerHTML = `
		<div class="infotop">
			<div class="infotitle">${Calendar.Event.getTitle(newitem)}</div>
		</div>
		<div class="info">
			<div class="infotext">Scheduled for ${getDMDYText(new Date(newitem.start.year, newitem.start.month, newitem.start.day, 0, newitem.start.minute))} ${getHMText(newitem.start.minute)}.${addedtodos.find(d => d.id == newitem.id) ? `` : ` Keep this time?`}</div>
			<div class="display-flex flex-row justify-space-between align-center gap-12px">
	 			<div class="text-14px text-secondary">Event ${animateindex + 1} of ${modifiedevents.length}</div>
		 		<div class="display-flex flex-row gap-12px">
		 			${addedtodos.find(d => d.id == newitem.id) ? `<div class="border-8px background-blue hover:background-blue-hover transition-duration-100 padding-8px-12px text-white text-14px pointer" onclick="animatenextitem(false)">Next</div>` :
				`<div class="border-8px background-red hover:background-red-hover transition-duration-100 padding-8px-12px text-white text-14px pointer" onclick="animatenextitem(true)">Decline</div>
					<div class="border-8px background-blue hover:background-blue-hover transition-duration-100 padding-8px-12px text-white text-14px pointer" onclick="animatenextitem(false)">Accept</div>`}
				</div>
			</div>
	 		
	 	</div>`
	}

	function scrollitem(id) {
		let newitem = newcalendarevents.find(d => d.id == id)
		if (!newitem) return

		calendaryear = newitem.start.year
		calendarmonth = newitem.start.month
		calendarday = newitem.start.day
		calendar.updateCalendar()

		scrollcalendarY(newitem.start.minute)
	}


	function displaydone() {
		autoscheduleframemenu.classList.remove('hiddenfade')
		autoscheduleframemenucontent.innerHTML = `
		<div class="infotop">
			<div class="infotitle">Schedule Completed</div>
		</div>
		<div class="info">
			<div class="infotext">Success! ${addedtodos.length > 0 ? `I've added ${addedtodos.length} new tasks to your calendar.` : ''}</div>
	 		<div class="display-flex flex-row justify-flex-end gap-12px">
				${modifiedevents.length > 0 ? `<div class="border-8px background-blue hover:background-blue-hover transition-duration-100 padding-8px-12px text-white text-14px pointer" onclick="reviewanimate()">Review changes</div>` : ''}
				<div class="border-8px background-blue hover:background-blue-hover transition-duration-100 padding-8px-12px text-white text-14px pointer" onclick="closeanimate()">Done</div>
		 	</div>
	 	</div>`
	}

	animatenextitem = function (reject) {
		if (reject == true) {
			let currentitem = calendar.events.find(d => d.id == modifiedevents[animateindex - 1].id)
			let olditem = modifiedevents.find(d => d.id == modifiedevents[animateindex - 1].id)
			if (currentitem && olditem) {
				[currentitem.start.year, currentitem.start.month, currentitem.start.day, currentitem.start.minute, currentitem.end.year, currentitem.end.month, currentitem.end.day, currentitem.end.minute] = [olditem.start.year, olditem.start.month, olditem.start.day, olditem.start.minute, olditem.end.year, olditem.end.month, olditem.end.day, olditem.end.minute]

				calendar.updateEvents()
			}
		}

		if (animateindex < modifiedevents.length) {
			scrollitem(modifiedevents[animateindex].id)
			displayitem(modifiedevents[animateindex].id)

			animateindex++
		} else if (animateindex == modifiedevents.length) {
			closeanimate()
		}
	}

	reviewanimate = function () {
		autoscheduleeventid = null

		//remove animate
		autoscheduleeventslist = []
		oldautoscheduleeventslist = []
		newautoscheduleeventslist = []
		calendar.updateEvents()
		calendar.updateAnimatedEvents()

		animateindex = 0
		animatenextitem()
	}

	closeanimate = function () {
		autoscheduleeventid = null

		//remove animate
		autoscheduleeventslist = []
		oldautoscheduleeventslist = []
		newautoscheduleeventslist = []

		calendar.updateAnimatedEvents()
		calendar.updateEvents()

		calendar.updateHistory()
		calendar.updateInfo(true)
		calendar.updateTodo()

		clickscheduleframeclose()

		isautoscheduling = false
		return
	}

	//pre animate	
	autoscheduleeventid = null
	autoscheduleeventslist = [...modifiedevents.map(d => { return { id: d.id, percentage: 0, addedtodo: !!addedtodos.find(f => f.id == d.id) } })]
	oldautoscheduleeventslist = oldsmartevents
	newautoscheduleeventslist = newcalendarevents

	calendar.updateEvents()
	calendar.updateAnimatedEvents()

	//animate
	for(let item of modifiedevents){
		await animateitem(item.id)
		await sleep(400)
	}

	//post animate
	if(addedtodos.length > 0){
		displayalert(`${addedtodos.length} task${addedtodos.length == 1 ? ' was' : 's were'} successfully scheduled.`)
	}

	let animateindex = 0
	closeanimate()

	//stats
	autoschedulestats.animateduration = performance.now() - startautoscheduleanimate
	//console.log(autoschedulestats)

	//confetti
	let confetticanvas = getElement('confetticanvas')
	let myconfetti = confetti.create(confetticanvas, {
		resize: true,
		useWorker: true
	})

	let promises = []
	for (let item of modifiedevents) {
		let itemelement = getElement(item.id)
		if (!itemelement) continue
		let itemrect = itemelement.getBoundingClientRect()

		promises.push(myconfetti({
			spread: 30,
			particleCount: 20,
			gravity: 0.75,
			startVelocity: 15,
			decay: 0.94,
			ticks: 100,
			origin: {
				x: (itemrect.x + itemrect.width / 2) / (window.innerWidth || document.body.clientWidth),
				y: (itemrect.y + itemrect.height / 2) / (window.innerHeight || document.body.clientHeight)
			}
		}))
	}
	await Promise.all(promises)

	try{
		myconfetti.reset()
	}catch(e){}
}



//auto schedule V1
async function autoScheduleV1(currentevents, showsummary) {
	if (isautoscheduling == true) return
	isautoscheduling = true

	let schedulesummarytext = getElement('schedulesummarytext')
	let schedulesummarymenu = getElement('schedulesummarymenu')
	schedulesummarymenu.classList.add('hiddenpopup')
	schedulesummarytext.innerHTML = ''

	let oldevents = deepCopy(currentevents)
	let oldcalendarevents = deepCopy(calendar.events)

	let currentdate = new Date()

	//calculated priority based on due date and importance
	function getcalculatedpriority(tempitem) {
		let timedifference = new Date(tempitem.endbefore.year, tempitem.endbefore.month, tempitem.endbefore.day, 0, tempitem.endbefore.minute).getTime() - currentdate.getTime()
		return currentdate.getTime() * (tempitem.priority + 1) / Math.max(timedifference, 1)
	}

	if (calendar.smartschedule.mode == 0) {
		//sort most to least priority
		currentevents = currentevents.sort((a, b) => {
			return getcalculatedpriority(a) - getcalculatedpriority(b)
		})

		//set time to ASAP
		for (let item of currentevents) {
			if (!Calendar.Event.isSchedulable(item)) continue
			let duration = (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())

			let startdate = new Date()
			startdate.setMinutes(ceil(startdate.getMinutes(), 5), 0, 0)
			let enddate = new Date(startdate.getTime() + duration)

			item.start.year = startdate.getFullYear()
			item.start.month = startdate.getMonth()
			item.start.day = startdate.getDate()
			item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

			item.end.year = enddate.getFullYear()
			item.end.month = enddate.getMonth()
			item.end.day = enddate.getDate()
			item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
		}

		resolveconflicts()
	} else if (calendar.smartschedule.mode == 1) {
		//sort least to most priority
		currentevents = currentevents.sort((a, b) => {
			return getcalculatedpriority(a) - getcalculatedpriority(b)
		})

		//set time to ASAP
		for (let item of currentevents) {
			if (!Calendar.Event.isSchedulable(item)) continue
			let duration = (new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime())

			let startdate = new Date()
			startdate.setMinutes(ceil(startdate.getMinutes(), 5), 0, 0)
			let enddate = new Date(startdate.getTime() + duration)

			item.start.year = startdate.getFullYear()
			item.start.month = startdate.getMonth()
			item.start.day = startdate.getDate()
			item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

			item.end.year = enddate.getFullYear()
			item.end.month = enddate.getMonth()
			item.end.day = enddate.getDate()
			item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
		}

		//set time to least busy
		for (let item of currentevents) {
			if (!Calendar.Event.isSchedulable(item)) continue

			let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)

			let leastbusydate = getLeastBusyDateV1(item, currentevents)
			let startdate = new Date(leastbusydate.getTime() - duration / 2)
			startdate.setMinutes(floor(startdate.getMinutes(), 5))
			let enddate = new Date(startdate.getTime() + duration)

			item.start.year = startdate.getFullYear()
			item.start.month = startdate.getMonth()
			item.start.day = startdate.getDate()
			item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

			item.end.year = enddate.getFullYear()
			item.end.month = enddate.getMonth()
			item.end.day = enddate.getDate()
			item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
		}

		//test balanced scheduling
		resolveconflicts()
	}

	function resolveconflicts() {
		let counter = 0
		while (true) {
			//event conflicting
			let conflictingevents = getconflictingevents(currentevents)
			for (let [item1, item2] of conflictingevents.slice(0, 1)) {
				let duration1 = new Date(item1.end.year, item1.end.month, item1.end.day, 0, item1.end.minute).getTime() - new Date(item1.start.year, item1.start.month, item1.start.day, 0, item1.start.minute)
				let duration2 = new Date(item2.end.year, item2.end.month, item2.end.day, 0, item2.end.minute).getTime() - new Date(item2.start.year, item2.start.month, item2.start.day, 0, item2.start.minute)

				let differenceA = Math.abs(new Date(item2.end.year, item2.end.month, item2.end.day, 0, item2.end.minute).getTime() - new Date(item1.start.year, item1.start.month, item1.start.day, 0, item1.start.minute))
				let differenceB = Math.abs(new Date(item2.start.year, item2.start.month, item2.start.day, 0, item2.start.minute).getTime() - new Date(item1.end.year, item1.end.month, item1.end.day, 0, item1.end.minute))

				let penetration = Math.min(differenceA, differenceB) + calendar.settings.eventspacing * 60000

				let move1 = false
				let move2 = false

				let calculatedpriority1 = getcalculatedpriority(item1)
				let calculatedpriority2 = getcalculatedpriority(item2)

				if (currentevents.find(d => d.id == item1.id) && currentevents.find(d => d.id == item2.id)) {
					if (Calendar.Event.isSchedulable(item1) && Calendar.Event.isSchedulable(item2)) {
						if (calculatedpriority1 < calculatedpriority2) {
							move1 = true
						} else {
							move2 = true
						}
					} else if (Calendar.Event.isSchedulable(item1)) {
						move1 = true
					} else if (Calendar.Event.isSchedulable(item2)) {
						move2 = true
					}
				} else if (currentevents.find(d => d.id == item1.id)) {
					move1 = true
				} else if (currentevents.find(d => d.id == item2.id)) {
					move2 = true
				}

				if (move1) {
					let startdate1 = new Date(item1.start.year, item1.start.month, item1.start.day, 0, item1.start.minute)
					startdate1.setTime(startdate1.getTime() + penetration)
					let enddate1 = new Date(startdate1.getTime() + duration1)

					item1.start.year = startdate1.getFullYear()
					item1.start.month = startdate1.getMonth()
					item1.start.day = startdate1.getDate()
					item1.start.minute = startdate1.getHours() * 60 + startdate1.getMinutes()

					item1.end.year = enddate1.getFullYear()
					item1.end.month = enddate1.getMonth()
					item1.end.day = enddate1.getDate()
					item1.end.minute = enddate1.getHours() * 60 + enddate1.getMinutes()
				} else if (move2) {
					let startdate2 = new Date(item2.start.year, item2.start.month, item2.start.day, 0, item2.start.minute)
					startdate2.setTime(startdate2.getTime() + penetration)
					let enddate2 = new Date(startdate2.getTime() + duration2)

					item2.start.year = startdate2.getFullYear()
					item2.start.month = startdate2.getMonth()
					item2.start.day = startdate2.getDate()
					item2.start.minute = startdate2.getHours() * 60 + startdate2.getMinutes()

					item2.end.year = enddate2.getFullYear()
					item2.end.month = enddate2.getMonth()
					item2.end.day = enddate2.getDate()
					item2.end.minute = enddate2.getHours() * 60 + enddate2.getMinutes()
				}
			}

			//event during sleep
			let sleepingevents = getsleepingevents(currentevents)
			for (let item of sleepingevents.slice(0, 1)) {
				let duration = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()

				let tempstartdate1 = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
				let tempenddate1 = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
				let sleepstartdate1 = new Date(item.start.year, item.start.month, item.start.day, 0, calendar.settings.sleep.startminute)
				let sleependdate1 = new Date(item.start.year, item.start.month, item.start.day + 1, 0, calendar.settings.sleep.endminute + 30)
				let sleepstartdate2 = new Date(item.start.year, item.start.month, item.start.day - 1, 0, calendar.settings.sleep.startminute)
				let sleependdate2 = new Date(item.start.year, item.start.month, item.start.day, 0, calendar.settings.sleep.endminute + 30)

				if (tempstartdate1.getTime() < sleependdate1.getTime() && tempenddate1.getTime() > sleepstartdate1.getTime()) {
					let startdate = new Date(item.start.year, item.start.month, item.start.day + 1, 0, calendar.settings.sleep.endminute + 30)
					let enddate = new Date(startdate.getTime() + duration)

					item.start.year = startdate.getFullYear()
					item.start.month = startdate.getMonth()
					item.start.day = startdate.getDate()
					item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

					item.end.year = enddate.getFullYear()
					item.end.month = enddate.getMonth()
					item.end.day = enddate.getDate()
					item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
				} else if (tempstartdate1.getTime() < sleependdate2.getTime() && tempenddate1.getTime() > sleepstartdate2.getTime()) {
					let startdate = new Date(item.start.year, item.start.month, item.start.day, 0, calendar.settings.sleep.endminute + 30)
					let enddate = new Date(startdate.getTime() + duration)

					item.start.year = startdate.getFullYear()
					item.start.month = startdate.getMonth()
					item.start.day = startdate.getDate()
					item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()

					item.end.year = enddate.getFullYear()
					item.end.month = enddate.getMonth()
					item.end.day = enddate.getDate()
					item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
				}
			}


			counter++
			if ((conflictingevents.length == 0 && sleepingevents.length == 0) || counter > 1000) {
				break
			}
		}

	}

	//animate
	function sleep(time) {
		return new Promise(resolve => {
			setTimeout(resolve, time)
		})
	}

	let newevents = deepCopy(calendar.events)
	let intermediateevents = deepCopy(oldcalendarevents)
	calendar.events = intermediateevents

	let frames = 30
	for (let tick = 0; tick < frames; tick++) {
		for (let item of intermediateevents) {

			let newitem = newevents.find(d => d.id == item.id)
			let olditem = oldevents.find(d => d.id == item.id)

			if (!newitem || !olditem || !Calendar.Event.isSchedulable(olditem)) continue

			let oldstartdate = new Date(olditem.start.year, olditem.start.month, olditem.start.day, 0, olditem.start.minute)
			let oldenddate = new Date(olditem.end.year, olditem.end.month, olditem.end.day, 0, olditem.end.minute)
			let duration = oldenddate.getTime() - oldstartdate.getTime()

			let finalstartdate = new Date(newitem.start.year, newitem.start.month, newitem.start.day, 0, newitem.start.minute)
			let difference = finalstartdate.getTime() - oldstartdate.getTime()

			let newstartdate = new Date(oldstartdate.getTime() + difference * beziercurve(tick / frames))
			let newenddate = new Date(newstartdate.getTime() + duration)

			item.start.minute = newstartdate.getHours() * 60 + newstartdate.getMinutes()
			item.start.day = newstartdate.getDate()
			item.start.month = newstartdate.getMonth()
			item.start.year = newstartdate.getFullYear()

			item.end.minute = newenddate.getHours() * 60 + newenddate.getMinutes()
			item.end.day = newenddate.getDate()
			item.end.month = newenddate.getMonth()
			item.end.year = newenddate.getFullYear()
		}

		calendar.updateEvents()
		await sleep(10)
	}

	calendar.events = newevents
	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()

	//summary
	if (showsummary) {
		let movedlatercount = 0
		let movedearliercount = 0

		for (let olditem of oldevents) {
			let newitem = newevents.find(d => d.id == olditem.id)
			if (!newitem || olditem.type != 1) continue
			let oldstartdate = new Date(olditem.start.year, olditem.start.month, olditem.start.day, 0, olditem.start.minute)
			let newstartdate = new Date(newitem.start.year, newitem.start.month, newitem.start.day, 0, newitem.start.minute)
			if (oldstartdate.getTime() < newstartdate.getTime()) {
				movedlatercount++
			} else if (oldstartdate.getTime() > newstartdate.getTime()) {
				movedearliercount++
			}
		}

		let summary = []
		if (movedearliercount > 0) {
			summary.push(`Moved ${movedearliercount} event${movedearliercount != 1 ? 's' : ''} earlier`)
		}
		if (movedlatercount > 0) {
			summary.push(`Moved ${movedlatercount} event${movedlatercount != 1 ? 's' : ''} later`)
		}

		let undoschedulesummary = getElement('undoschedulesummary')
		undoschedulesummary.classList.remove('display-none')

		if (summary.length == 0) {
			undoschedulesummary.classList.add('display-none')
			summary.push(`No events were changed`)
		}

		let openschedulebutton = getElement('openschedulebutton')
		schedulesummarymenu.classList.remove('hiddenpopup')
		schedulesummarytext.innerHTML = summary.join('\n')

		schedulesummarymenu.style.top = (openschedulebutton.offsetTop + openschedulebutton.offsetHeight) + 'px'
		schedulesummarymenu.style.left = fixleft(openschedulebutton.offsetLeft + openschedulebutton.offsetWidth * 0.5 - schedulesummarymenu.offsetWidth * 0.5, schedulesummarymenu) + 'px'
	}

	isautoscheduling = false
}

//update calendar list
let calendarlistexpanded = false
function updatecalendarlist() {
	let calendarlist = getElement('calendarlist')

	let output = []

	let sortedcalendars = calendar.calendars.sort((a, b) => {
		if (a.isprimary != b.isprimary) return a.isprimary ? -1 : 1
		if (!!a.googleid != !!b.googleid) return !!a.googleid ? -1 : 1
		if (a.subscriptionurl != b.subscriptionurl) {
			if (!a.subscriptionurl) return 1
			if (!b.subscriptionurl) return -1
		}
		return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
	})

	for (let item of sortedcalendars) {
		output.push(`
		<div class="calendaritem transition-duration-100 justify-space-between display-flex gap-12px padding-top-8px padding-bottom-8px flex-row border-8px align-center">
			<div class="gap-12px display-flex flex-row overflow-hidden">
				<div class="todoitemcheckbox tooltip" onclick="toggleshowcalendar(event, '${item.id}')">
					${getcolorcheckbox(!item.hidden, item.hexcolor)}
				</div>
		 
				<div class="pointer-none text-primary calendaritemtext text-overflow-ellipsis text-14px nowrap calendaritemtext">${Calendar.Calendar.getTitle(item)}</div>
			</div>

	 		<div class="display-none pointer calendaritembutton popupbutton" onclick="togglecalendaritempopup2('${item.id}', this)">
				<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttonlarge rotate">
				<g>
				<path d="M178.389 21.6002L31.105 168.884M234.4 77.6109L87.1156 224.895M178.389 21.6002C193.856 6.13327 218.933 6.13327 234.4 21.6002C249.867 37.0671 249.867 62.1439 234.4 77.6109M10 245.998L31.105 168.884M10.0017 246L87.1156 224.895" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
				</g>
				</svg>
			</div>
	 	</div>`)

	}
	output.push(`<div class="text-14px text-primary pointer background-tint-1 padding-8px-12px border-8px hover:background-tint-2 transition-duration-100" onclick="opencreatecalendarbutton()">Add calendar...</div>`)
	calendarlist.innerHTML = output.join('')

	//expand/collapse
	let calendarlisttoggle = getElement('calendarlisttoggle')
	calendarlisttoggle.classList.remove('rotate-90')
	calendarlist.classList.remove('display-none')

	if (calendarlistexpanded) {
	} else {
		calendarlisttoggle.classList.add('rotate-90')
		calendarlist.classList.add('display-none')
	}
}



//expand/collapse calendar list
function togglesettingscalendarlist() {
	calendarlistexpanded = !calendarlistexpanded
	updatecalendarlist()
}



//open list of calendar
function clickcalendaroption() {
	let calendaroptionbutton = getElement('calendaroptionbutton')
	let calendaroptionmenu = getElement('calendaroptionmenu')

	calendaroptionmenu.classList.toggle('hiddenpopup')
	updatecalendaroptionmenu()

	calendaroptionmenu.style.top = fixtop(calendaroptionbutton.getBoundingClientRect().top + calendaroptionbutton.offsetHeight, calendaroptionmenu) + 'px'
	calendaroptionmenu.style.left = fixleft(calendaroptionbutton.getBoundingClientRect().left, calendaroptionmenu) + 'px'
	calendaroptionmenu.style.width = calendaroptionbutton.offsetWidth + 'px'
}
function closecalendaroptionmenu() {
	let calendaroptionmenu = getElement('calendaroptionmenu')
	calendaroptionmenu.classList.add('hiddenpopup')
}
//update ui
function updatecalendaroptionmenu() {
	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	let calendaroptionmenu = getElement('calendaroptionmenu')

	let output = []

	let selectablecalendars = calendar.calendars.filter(d => !d.readonly)
	for (let calendaritem of selectablecalendars) {
		output.push(`<div class="helpitem display-flex flex-row gap-12px" onclick="selectcalendaroption('${calendaritem.id}')"><span>${getcheck(item.calendarid == calendaritem.id || (item.calendarid == null && calendaritem.isprimary))}</span>${Calendar.Calendar.getTitle(calendaritem)}</div>`)
	}

	output.push(`<div class="helpitem display-flex flex-row gap-12px" onclick="opencreatecalendarbutton()">
 		<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline"></svg>
		Add calendar...
 	</div>`)

	calendaroptionmenu.innerHTML = output.join('')
}
//select event's calendar
function selectcalendaroption(calendarid) {
	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	let calendaritem = calendar.calendars.find(f => f.id == calendarid)
	if (!calendaritem) return

	item.calendarid = calendarid
	item.hexcolor = calendaritem.hexcolor

	calendar.updateInfo()
	calendar.updateEvents()
	calendar.updateHistory()
	closecalendaroptionmenu()
}


//open repeat every menu
function clickrepeatfrequency() {
	let repeatfrequencymenu = getElement('repeatfrequencymenu')
	let repeatfrequencybutton = getElement('repeatfrequencybutton')
	repeatfrequencymenu.classList.toggle('hiddenpopup')

	repeatfrequencymenu.style.top = fixtop(repeatfrequencybutton.getBoundingClientRect().top + repeatfrequencybutton.offsetHeight, repeatfrequencymenu) + 'px'
	repeatfrequencymenu.style.left = fixleft(repeatfrequencybutton.getBoundingClientRect().left, repeatfrequencymenu) + 'px'
}

//input repeat interval
function inputrepeatinterval(event) {
	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return
	tempinterval = Math.max(Math.floor(+event.target.value || 1), 1)
	updatecustomrepeat()
}

//select repeat frequency
function selectrepeatfrequency(index) {
	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return
	tempfrequency = index
	updatecustomrepeat()

	let repeatfrequencymenu = getElement('repeatfrequencymenu')
	repeatfrequencymenu.classList.add('hiddenpopup')
}

function fixrepeat(item) {
	if(Calendar.Event.isEvent(item)){
		if (item.repeat.frequency == 1 && item.repeat.interval != null) {
			if (item.repeat.byday.length == 0) {
				item.repeat.byday = [new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getDay()]
			}
		}
	}else if(Calendar.Todo.isTodo(item)){
		if (item.repeat.frequency == 1 && item.repeat.interval != null) {
			if (item.repeat.byday.length == 0) {
				item.repeat.byday = [new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute).getDay()]
			}
		}
	}
}

let tempinterval, tempfrequency, tempbyday, tempuntil;
function submitcustomrepeat() {
	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return

	item.repeat.frequency = tempfrequency
	item.repeat.interval = tempinterval
	item.repeat.byday = deepCopy(tempbyday)
	item.repeat.until = tempuntil
	fixrepeat(item)

	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()

	let repeatcustommenu = getElement('repeatcustommenu')
	repeatcustommenu.classList.add('hiddenpopup')

	let repeatfrequencymenu = getElement('repeatfrequencymenu')
	repeatfrequencymenu.classList.add('hiddenpopup')
}

function cancelcustomrepeat() {
	let repeatcustommenu = getElement('repeatcustommenu')
	repeatcustommenu.classList.add('hiddenpopup')

	let repeatfrequencymenu = getElement('repeatfrequencymenu')
	repeatfrequencymenu.classList.add('hiddenpopup')
}

//update custom repeat
function updatecustomrepeat() {
	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return
	tempinterval = tempinterval || 1
	tempfrequency = tempfrequency || 0
	tempbyday = tempbyday || []
	tempuntil = tempuntil || null

	let repeatintervalinput = getElement('repeatintervalinput')
	let repeatfrequencybutton = getElement('repeatfrequencybutton')
	repeatintervalinput.value = tempinterval
	repeatfrequencybutton.innerHTML = `${['day', 'week', 'month', 'year'][tempfrequency]}${tempinterval == 1 ? '' : 's'}
	<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 256 256" width="100%" class="buttoninline rotate90">
	<g>
	<path d="M88.6229 47.8879L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
	<path d="M88.6229 208.112L167.377 128" opacity="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"></path>
	</g>
	</svg>`

	let repeatfrequencymenu = getElement('repeatfrequencymenu')
	for (let [index, child] of Object.entries(repeatfrequencymenu.children)) {
		child.innerHTML = `${['day', 'week', 'month', 'year'][index]}${tempinterval == 1 ? '' : 's'}`
	}


	//day of week
	let repeatweek = getElement('repeatweek')
	repeatweek.classList.add('display-none')
	if (tempfrequency == 1) {
		repeatweek.classList.remove('display-none')

		for (let [index, div] of Object.entries(repeatweekchildren.children)) {
			if (tempbyday.find(h => h == index) != null) {
				div.classList.add('selectedbutton')
			} else {
				div.classList.remove('selectedbutton')
			}
		}
	}

	//until
	let repeatuntilnever = getElement('repeatuntilnever')
	let repeatuntilondate = getElement('repeatuntilondate')
	let repeatuntilondateui = getElement('repeatuntilondateui')
	let repeatuntilinput = getElement('repeatuntilinput')

	let repeatuntildate;
	if(tempuntil && !isNaN(new Date(tempuntil).getTime())){
		repeatuntildate = new Date(tempuntil)
	}
	
	repeatuntilnever.innerHTML = getcheckcircle(!repeatuntildate)
	repeatuntilondate.innerHTML = getcheckcircle(!!repeatuntildate)
	if(repeatuntildate){
		repeatuntilondateui.classList.remove('greyedoutevent')
	}else{
		repeatuntilondateui.classList.add('greyedoutevent')
	}

	repeatuntilinput.value = repeatuntildate ? getDMDYText(repeatuntildate) : ''


	let repeatoptionbutton = getElement('repeatoptionbutton')
	let repeatcustommenu = getElement('repeatcustommenu')
	repeatcustommenu.classList.remove('hiddenpopup')

	repeatcustommenu.style.top = fixtop(repeatoptionbutton.getBoundingClientRect().top + repeatoptionbutton.offsetHeight, repeatcustommenu) + 'px'
	repeatcustommenu.style.left = fixleft(repeatoptionbutton.getBoundingClientRect().left, repeatcustommenu) + 'px'
}


//input repeat until
function inputrepeatuntil(event){
	let repeatuntilinput = getElement('repeatuntilinput')
	let string = repeatuntilinput.value

	let [myendyear, myendmonth, myendday] = getDate(string).value

	let tempdate = new Date(myendyear, myendmonth, myendday)

	if (!isNaN(tempdate.getTime())) {
		tempuntil = tempdate.getTime()
	}

	updatecustomrepeat()
}

function clickrepeatuntiltype(type){
	if(type == 0){
		tempuntil = null
	}else if(type == 1){
		let repeatuntildate;
		if(tempuntil && !isNaN(new Date(tempuntil).getTime())){
			repeatuntildate = new Date(tempuntil)
		}

		if(!repeatuntildate){
			let tempdate = new Date()
			tempdate.setHours(0,0,0,0)
			tempdate.setMonth(tempdate.getMonth() + 1)
			tempuntil = tempdate.getTime()
		}
	}

	updatecustomrepeat()
}


//click day of week
function clickrepeatdayofweek(index) {
	if (tempbyday.includes(index)) {
		tempbyday = tempbyday.filter(g => g != index)
	} else {
		tempbyday.push(index)
	}
	updatecustomrepeat()
}

//open repeat presets
function clickrepeatoption() {
	let repeatoptionmenu = getElement('repeatoptionmenu')
	let repeatoptionbutton = getElement('repeatoptionbutton')
	repeatoptionmenu.classList.toggle('hiddenpopup')

	repeatoptionmenu.style.top = fixtop(repeatoptionbutton.getBoundingClientRect().top + repeatoptionbutton.offsetHeight, repeatoptionmenu) + 'px'
	repeatoptionmenu.style.left = fixleft(repeatoptionbutton.getBoundingClientRect().left, repeatoptionmenu) + 'px'
	repeatoptionmenu.style.width = repeatoptionbutton.offsetWidth + 'px'

	updaterepeatoptionmenu()
}



function updaterepeatoptionmenu() {
	function isnotrepeat() {
		return !REPEAT_OPTION_DATA.find(f => f.interval == item.repeat.interval && f.frequency == item.repeat.frequency && isEqualArray(item.repeat.byday, f.byday))
	}
	function isselectedrepeat(myindex) {
		let f = REPEAT_OPTION_DATA[myindex]
		return f.interval == item.repeat.interval && f.frequency == item.repeat.frequency && isEqualArray(item.repeat.byday, f.byday)
	}

	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return

	let repeatoption0 = getElement('repeatoption0')
	let repeatoption1 = getElement('repeatoption1')
	let repeatoption2 = getElement('repeatoption2')
	let repeatoption3 = getElement('repeatoption3')
	let repeatoption4 = getElement('repeatoption4')
	let repeatoption5 = getElement('repeatoption5')
	let repeatoption = getElement('repeatoption')

	repeatoption0.innerHTML = getcheck(isselectedrepeat(0))
	repeatoption1.innerHTML = getcheck(isselectedrepeat(1))
	repeatoption2.innerHTML = getcheck([2, 7, 8, 9, 10, 11, 12, 13].find(d => isselectedrepeat(d)))
	repeatoption3.innerHTML = getcheck(isselectedrepeat(3))
	repeatoption4.innerHTML = getcheck(isselectedrepeat(4))
	repeatoption5.innerHTML = getcheck(isselectedrepeat(5))
	repeatoption.innerHTML = getcheck(isnotrepeat())
}

//select repeat preset
function selectrepeatoption(index) {
	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return
	if (index == null) {
		tempinterval = item.repeat.interval
		tempfrequency = item.repeat.frequency
		tempbyday = deepCopy(item.repeat.byday)
		tempuntil = item.repeat.until
		updatecustomrepeat()

		let repeatoptionbutton = getElement('repeatoptionbutton')
		let repeatcustommenu = getElement('repeatcustommenu')
		repeatcustommenu.classList.remove('hiddenpopup')

		repeatcustommenu.style.top = fixtop(repeatoptionbutton.getBoundingClientRect().top + repeatoptionbutton.offsetHeight, repeatcustommenu) + 'px'
		repeatcustommenu.style.left = fixleft(repeatoptionbutton.getBoundingClientRect().left, repeatcustommenu) + 'px'
	} else {
		let option = REPEAT_OPTION_DATA[index]
		if (!option) return

		item.repeat.frequency = option.frequency
		item.repeat.interval = option.interval
		item.repeat.byday = option.byday
		fixrepeat(item)

		updaterepeatoptionmenu()
		calendar.updateEvents()
		calendar.updateInfo()
		calendar.updateHistory()
	}

	let repeatoptionmenu = getElement('repeatoptionmenu')
	repeatoptionmenu.classList.add('hiddenpopup')
}



//color event
function eventcolor(value) {
	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return
	item.hexcolor = value

	calendar.updateEvents()
	calendar.updateInfo(true)
	calendar.updateHistory()
}


//event all day
function eventallday() {
	let item = calendar.events.find(f => f.id == selectedeventid)
	if (!item) return
	if (Calendar.Event.isAllDay(item)) {
		let currentdate = new Date()
		currentdate.setHours(12, 0, 0, 0)

		item.start.minute = currentdate.getHours() * 60 + currentdate.getMinutes()

		let tempdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
		tempdate.setHours(tempdate.getHours() + 1)
		item.end.year = tempdate.getFullYear()
		item.end.month = tempdate.getMonth()
		item.end.day = tempdate.getDate()
		item.end.minute = tempdate.getHours() * 60 + tempdate.getMinutes()

		scrollcalendarY(item.start.minute)
	} else {
		item.start.minute = 0

		let tempdate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
		tempdate.setHours(0, 0, 0, 0)
		tempdate.setDate(tempdate.getDate() + 1)
		item.end.year = tempdate.getFullYear()
		item.end.month = tempdate.getMonth()
		item.end.day = tempdate.getDate()
		item.end.minute = tempdate.getHours() * 60 + tempdate.getMinutes()
	}

	calendar.updateEvents()
	calendar.updateInfo(true)
	calendar.updateHistory()
}




//event completed
async function eventcompleted(event, id) {
	let item = calendar.events.find(f => f.id == id)
	if (!item) return
	item.completed = !item.completed

	if(item.completed){
		if(Calendar.Event.isEvent(item)){
			let currentdate = new Date()

			if(new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() > currentdate.getTime()){
				let oldstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
				let oldenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
				let duration = oldenddate.getTime() - oldstartdate.getTime()


				//set event to end at now
				let enddate = new Date(currentdate)
				enddate.setMinutes(floor(enddate.getMinutes(), 5))

				let startdate = new Date(enddate)
				startdate.setTime(startdate.getTime() - duration)
			
				item.start.year = startdate.getFullYear()
				item.start.month = startdate.getMonth()
				item.start.day = startdate.getDate()
				item.start.minute = startdate.getHours() * 60 + startdate.getMinutes()
			
				item.end.year = enddate.getFullYear()
				item.end.month = enddate.getMonth()
				item.end.day = enddate.getDate()
				item.end.minute = enddate.getHours() * 60 + enddate.getMinutes()
			}
		}
	}


	fixrecurringtodo(item)
	fixsubandparenttask(item)

	if(item.type == 1){
		calendar.updateTodo()
	}
	calendar.updateEvents()
	calendar.updateInfo()
	calendar.updateHistory()

	if (item.completed) {
		let confetticanvas = getElement('confetticanvas')
		let myconfetti = confetti.create(confetticanvas, {
			resize: true,
			useWorker: true
		})

		await myconfetti({
			particleCount: 20,
			gravity: 0.75,
			startVelocity: 15,
			decay: 0.94,
			ticks: 100,
			origin: {
				x: (event.clientX) / (window.innerWidth || document.body.clientWidth),
				y: (event.clientY) / (window.innerHeight || document.body.clientHeight)
			}
		})

		try{
			myconfetti.reset()
		}catch(e){}

	}
}

//double click column
function dblclickboxcolumn(event, timestamp) {

	let barcolumngroup = getElement('barcolumngroup')

	let relativey = round(event.clientY - barcolumngroup.getBoundingClientRect().top, 15)

	if (relativey < 0) {
		relativey = 0
	}
	if (relativey > barcolumngroup.offsetHeight - 15) {
		relativey = barcolumngroup.offsetHeight - 15
	}

	let tempdate = new Date(timestamp)

	let item = new Calendar.Event(tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate(), relativey, tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate(), relativey + 60)
	calendar.events.push(item)

	selectedeventid = item.id
	selectedeventdate = new Date(item.end.year, item.end.month, item.end.day)

	editinfo = true

	calendar.updateEvents()
	calendar.updateInfo(true)
	calendar.updateHistory()
}

//click column
function clickboxcolumn(event, timestamp) {
	if(event.button !== 0) return

	selectedeventinitialy = event.clientY
	selectedeventid = null
	selectedeventfromdate = new Date(timestamp)

	calendar.updateEvents()

	movingevent = true
	calendar.updateInfo(true)

	document.addEventListener("mousemove", moveboxcolumn, false)
	document.addEventListener("mouseup", finishfunction, false);
	function finishfunction() {
		document.removeEventListener("mousemove", moveboxcolumn, false);
		document.removeEventListener("mouseup", finishfunction, false);
		movingevent = false
		calendar.updateInfo(false, true)
	}
}

//move in column
function moveboxcolumn(event) {
	movingevent = true
	if (Math.abs(event.clientY - selectedeventinitialy) > 15) {

		let barcolumngroup = getElement('barcolumngroup')

		let relativey = round(selectedeventinitialy - barcolumngroup.getBoundingClientRect().top, 15)

		if (relativey < 0) {
			relativey = 0
		}
		if (relativey > barcolumngroup.offsetHeight - 15) {
			relativey = barcolumngroup.offsetHeight - 15
		}

		let tempdate = new Date(selectedeventfromdate.getTime())

		let item = new Calendar.Event(tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate(), relativey, tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate(), relativey + 15)
		calendar.events.push(item)

		selectedeventid = item.id
		editeventid = selectedeventid
		selectedeventdate = new Date(item.end.year, item.end.month, item.end.day)

		editinfo = true

		calendar.updateAnimatedEvents()
		calendar.updateInfo(true)

		document.removeEventListener("mousemove", moveboxcolumn, false)
		document.addEventListener("mousemove", moveeventbottom, false)
		document.addEventListener("mouseup", finishfunction, false);
		function finishfunction() {
			document.removeEventListener("mousemove", moveeventbottom, false)
			document.removeEventListener("mouseup", finishfunction, false)
			movingevent = false
			calendar.updateInfo(false, true)

			editeventid = null
			calendar.updateEvents()
		}
	}
}

//click event
function clickevent(event, timestamp) {
	event.stopPropagation()
	if(event.button !== 0) return
	let barcolumncontainer = getElement('barcolumncontainer')

	selectedeventid = event.target.id

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	selectedeventdate = new Date(item.start.year, item.start.month, item.start.day)
	selectedeventdatetime = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	selectedeventfromdate = new Date(timestamp)
	selectedeventinitialy = event.clientY - item.start.minute + barcolumncontainer.scrollTop
	fixrepeat(item)
	selectedeventbyday = item.repeat.byday

	updatedeventsaftermove = false

	calendar.updateEvents()

	movingevent = true
	calendar.updateInfo(true)

	document.addEventListener("mousemove", moveevent, false)
	document.addEventListener("mouseup", finishfunction, false)

	function finishfunction() {
		document.removeEventListener("mousemove", moveevent, false)
		document.removeEventListener("mouseup", finishfunction, false)

		//turn off auto schedule
		if (item.type == 1) {
			let currentdatemodified = new Date()
			currentdatemodified.setSeconds(0,0)

			let newstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			if (newstartdate.getTime() != selectedeventdatetime.getTime() && selectedeventdatetime.getTime() >= currentdatemodified) {
				item.type = 0
				calendar.updateInfo(true)
			}
			
		}

		movingevent = false
		calendar.updateInfo(false, true)

		editeventid = null
		calendar.updateEvents()
	}
}

//click border
function clickborder(event, id, timestamp) {
	event.stopPropagation()
	if(event.button !== 0) return

	let barcolumncontainer = getElement('barcolumncontainer')

	selectedeventid = id

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	selectedeventdate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day)
	selectedeventfromdate = new Date(timestamp)
	selectedeventinitialy = event.clientY - item.endbefore.minute + barcolumncontainer.scrollTop

	calendar.updateEvents()
	movingevent = true
	calendar.updateInfo(true)

	document.addEventListener("mousemove", moveborder, false)
	document.addEventListener("mouseup", finishfunction, false)
	function finishfunction() {
		document.removeEventListener("mouseup", finishfunction, false)
		document.removeEventListener("mousemove", moveborder, false)
		movingevent = false
		calendar.updateInfo(false, true)
	}
}

//move event
let updatedeventsaftermove = false
function moveevent(event) {
	editeventid = selectedeventid
	movingevent = true

	let barcolumngroup = getElement('barcolumngroup')
	let barcolumncontainer = getElement('barcolumncontainer')

	let relativey = round(event.clientY - selectedeventinitialy + barcolumncontainer.scrollTop, 15)
	let relativex = event.clientX - barcolumngroup.offsetLeft

	let selectedeventdate2 = new Date(selectedeventfromdate.getTime())

	let item = calendar.events.find(c => c.id == selectedeventid)
	if (!item) return

	if (Calendar.Event.isReadOnly(item)) return

	//move to other day
	if (calendarmode == 1) {
		let allchildren = []
		for (let child of Array.from(barcolumngroup.children)) {
			for (let childchild of Array.from(child.children)) {
				allchildren.push(childchild)
			}
		}
		for (let div of allchildren) {
			let rect = div.getBoundingClientRect()
			if (relativex >= rect.x - barcolumngroup.offsetLeft && relativex < rect.x - barcolumngroup.offsetLeft + rect.width) {
				let tempselectedeventdate = new Date(selectedeventdate.getTime())
				tempselectedeventdate.setHours(0, 0, 0, 0)

				let index = Math.round((selectedeventfromdate.getTime() - tempselectedeventdate.getTime()) / (1000 * 24 * 3600))
				let timestamp = div.dataset.timestamp
				selectedeventdate2.setTime(timestamp)
				selectedeventdate2.setMinutes(selectedeventdate.getHours() * 60 + selectedeventdate.getMinutes())
				selectedeventdate2.setDate(selectedeventdate2.getDate() - index)

				let dayindex = Math.round((selectedeventdate.getTime() - selectedeventdate2.getTime()) / (1000 * 24 * 3600))
				if (item.repeat.frequency == 1 && item.repeat.interval != null && item.repeat.byday.length == 1) {
					item.repeat.byday = selectedeventbyday.map(d => ((d - dayindex) % 7 + 7) % 7)
				}
			}
		}
	}

	let difference = Math.floor((new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() - new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime()) / 60000)

	let tempdate1 = new Date(selectedeventdate2.getTime())
	tempdate1.setMinutes(relativey)

	let tempdate2 = new Date(selectedeventdate2.getTime())
	tempdate2.setMinutes(relativey + difference)

	//min delta y 15 minutes
	let oldtempdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	if (Math.abs(tempdate1.getTime() - oldtempdate.getTime()) < 900000) return

	item.start.minute = tempdate1.getHours() * 60 + tempdate1.getMinutes()
	item.start.day = tempdate1.getDate()
	item.start.month = tempdate1.getMonth()
	item.start.year = tempdate1.getFullYear()

	item.end.minute = tempdate2.getHours() * 60 + tempdate2.getMinutes()
	item.end.day = tempdate2.getDate()
	item.end.month = tempdate2.getMonth()
	item.end.year = tempdate2.getFullYear()

	if(!updatedeventsaftermove){
		calendar.updateEvents()
		updatedeventsaftermove = true
	}
	calendar.updateAnimatedEvents()
	calendar.updateInfo()
}

//move border
function moveborder(event) {
	movingevent = true
	let barcolumngroup = getElement('barcolumngroup')
	let barcolumncontainer = getElement('barcolumncontainer')

	let relativey = round(event.clientY - selectedeventinitialy + barcolumncontainer.scrollTop, 15)
	let relativex = event.clientX - barcolumngroup.offsetLeft

	let selectedeventdate2 = new Date(selectedeventdate.getTime())

	let item = calendar.events.find(c => c.id == selectedeventid)
	if (!item) return

	//move to other day
	if (calendarmode == 1) {
		let allchildren = []
		for (let child of Array.from(barcolumngroup.children)) {
			for (let childchild of Array.from(child.children)) {
				allchildren.push(childchild)
			}
		}
		for (let div of allchildren) {
			let rect = div.getBoundingClientRect()
			if (relativex >= rect.x - barcolumngroup.offsetLeft && relativex < rect.x - barcolumngroup.offsetLeft + rect.width) {
				let tempselectedeventdate = new Date(selectedeventdate.getTime())
				tempselectedeventdate.setHours(0, 0, 0, 0)

				let index = Math.round((selectedeventfromdate.getTime() - tempselectedeventdate.getTime()) / (1000 * 24 * 3600))
				let timestamp = div.dataset.timestamp
				selectedeventdate2.setTime(timestamp)
				selectedeventdate2.setMinutes(selectedeventdate.getHours() * 60 + selectedeventdate.getMinutes())
				selectedeventdate2.setDate(selectedeventdate2.getDate() - index)
			}
		}
	}

	let tempdate1 = new Date(selectedeventdate2.getTime())
	tempdate1.setMinutes(relativey)

	//min delta y 15 minutes
	let oldtempdate = new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute)
	if (Math.abs(tempdate1.getTime() - oldtempdate.getTime()) < 900000) return

	item.endbefore.minute = tempdate1.getHours() * 60 + tempdate1.getMinutes()
	item.endbefore.day = tempdate1.getDate()
	item.endbefore.month = tempdate1.getMonth()
	item.endbefore.year = tempdate1.getFullYear()

	
	fixsubandparenttask(item)

	calendar.updateEvents()
	calendar.updateInfo()
}


//click event bottom
function clickeventbottom(event, timestamp) {
	event.stopPropagation()
	if(event.button !== 0) return
	selectedeventid = event.target.parentNode.id

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	selectedeventfromdate = new Date(timestamp)
	selectedeventdate = new Date(item.end.year, item.end.month, item.end.day)
	if (item.end.minute == 0) {
		selectedeventdate.setDate(selectedeventdate.getDate() - 1)
	}

	selectedeventinitialy = event.clientY

	updatedeventsaftermove = false

	calendar.updateEvents()

	movingevent = true
	calendar.updateInfo(true)

	document.addEventListener("mousemove", moveeventbottom, false)
	document.addEventListener("mouseup", finishfunction, false);
	function finishfunction() {
		document.removeEventListener("mousemove", moveeventbottom, false);
		document.removeEventListener("mouseup", finishfunction, false);
		movingevent = false
		calendar.updateInfo(false, true)

		editeventid = null
		calendar.updateEvents()
	}
}


//click event top
function clickeventtop(event, timestamp) {
	event.stopPropagation()
	if(event.button !== 0) return
	selectedeventid = event.target.parentNode.id

	let item = calendar.events.find(d => d.id == selectedeventid)
	if (!item) return

	selectedeventfromdate = new Date(timestamp)
	selectedeventdate = new Date(item.start.year, item.start.month, item.start.day)

	selectedeventinitialy = event.clientY

	updatedeventsaftermove = false

	calendar.updateEvents()

	movingevent = true
	calendar.updateInfo(true)

	document.addEventListener("mousemove", moveeventtop, false)
	document.addEventListener("mouseup", finishfunction, false);
	function finishfunction() {
		document.removeEventListener("mousemove", moveeventtop, false);
		document.removeEventListener("mouseup", finishfunction, false);
		movingevent = false
		calendar.updateInfo(false, true)

		editeventid = null
		calendar.updateEvents()
	}
}

//move event bottom
function moveeventbottom(event) {
	editeventid = selectedeventid
	movingevent = true
	event.stopPropagation()
	let barcolumngroup = getElement('barcolumngroup')

	let relativey = round(event.clientY - barcolumngroup.getBoundingClientRect().top, 15)
	let relativex = event.clientX - barcolumngroup.offsetLeft

	let selectedeventdate2 = new Date(selectedeventdate.getTime())

	//move to other day
	if (calendarmode == 1) {
		let allchildren = []
		for (let child of Array.from(barcolumngroup.children)) {
			for (let childchild of Array.from(child.children)) {
				allchildren.push(childchild)
			}
		}
		for (let div of allchildren) {
			let rect = div.getBoundingClientRect()
			if (relativex >= rect.x - barcolumngroup.offsetLeft && relativex < rect.x - barcolumngroup.offsetLeft + rect.width) {
				let tempselectedeventdate = new Date(selectedeventdate.getTime())
				tempselectedeventdate.setHours(0, 0, 0, 0)

				let index = Math.round((selectedeventfromdate.getTime() - tempselectedeventdate.getTime()) / (1000 * 24 * 3600))
				let timestamp = div.dataset.timestamp
				selectedeventdate2.setTime(timestamp)
				selectedeventdate2.setMinutes(selectedeventdate.getHours() * 60 + selectedeventdate.getMinutes())
				selectedeventdate2.setDate(selectedeventdate2.getDate() - index)
			}
		}
	}

	let item = calendar.events.find(c => c.id == selectedeventid)
	if (!item) return

	if (Calendar.Event.isReadOnly(item)) return

	let tempdate1 = new Date(selectedeventdate2.getTime())
	tempdate1.setMinutes(relativey)
	let tempdate2 = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)

	//min delta y 15 minutes
	let oldtempdate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)
	if (Math.abs(tempdate1.getTime() - oldtempdate.getTime()) < 900000) return

	if (tempdate1.getTime() - tempdate2.getTime() < 15 * 60000 && tempdate1.getTime() - tempdate2.getTime() >= 0) {
		tempdate1.setTime(tempdate2.getTime() + 15 * 60000)
	}

	item.end.minute = tempdate1.getHours() * 60 + tempdate1.getMinutes()
	item.end.day = tempdate1.getDate()
	item.end.month = tempdate1.getMonth()
	item.end.year = tempdate1.getFullYear()

	if (tempdate1.getTime() < tempdate2.getTime()) {
		[item.start.year, item.start.month, item.start.day, item.start.minute, item.end.year, item.end.month, item.end.day, item.end.minute] = [item.end.year, item.end.month, item.end.day, item.end.minute, item.start.year, item.start.month, item.start.day, item.start.minute]

		document.removeEventListener("mousemove", moveeventbottom, false);
		document.addEventListener("mousemove", moveeventtop, false)
		document.addEventListener("mouseup", finishfunction, false);
		function finishfunction() {
			document.removeEventListener("mousemove", moveeventtop, false);
			document.removeEventListener("mouseup", finishfunction, false);
		}
	}
	
	if(!updatedeventsaftermove){
		calendar.updateEvents()
		updatedeventsaftermove = true
	}

	calendar.updateAnimatedEvents()
	calendar.updateInfo()
}

//move event top
function moveeventtop(event) {
	editeventid = selectedeventid
	movingevent = true
	event.stopPropagation()
	let barcolumngroup = getElement('barcolumngroup')

	let relativey = round(event.clientY - barcolumngroup.getBoundingClientRect().top, 15)
	let relativex = event.clientX - barcolumngroup.offsetLeft

	let selectedeventdate2 = new Date(selectedeventdate.getTime())

	//move to other day
	if (calendarmode == 1) {
		let allchildren = []
		for (let child of Array.from(barcolumngroup.children)) {
			for (let childchild of Array.from(child.children)) {
				allchildren.push(childchild)
			}
		}
		for (let div of allchildren) {
			let rect = div.getBoundingClientRect()
			if (relativex >= rect.x - barcolumngroup.offsetLeft && relativex < rect.x - barcolumngroup.offsetLeft + rect.width) {
				let tempselectedeventdate = new Date(selectedeventdate.getTime())
				tempselectedeventdate.setHours(0, 0, 0, 0)

				let index = Math.round((selectedeventfromdate.getTime() - tempselectedeventdate.getTime()) / (1000 * 24 * 3600))
				let timestamp = div.dataset.timestamp
				selectedeventdate2.setTime(timestamp)
				selectedeventdate2.setMinutes(selectedeventdate.getHours() * 60 + selectedeventdate.getMinutes())
				selectedeventdate2.setDate(selectedeventdate2.getDate() - index)
			}
		}
	}

	let item = calendar.events.find(c => c.id == selectedeventid)
	if (!item) return

	if (Calendar.Event.isReadOnly(item)) return

	let tempdate1 = new Date(selectedeventdate2.getTime())
	tempdate1.setMinutes(relativey)
	let tempdate2 = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

	//min delta y 15 minutes
	let oldtempdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
	if (Math.abs(tempdate1.getTime() - oldtempdate.getTime()) < 900000) return

	if (tempdate1.getTime() - tempdate2.getTime() > -15 * 60000 && tempdate1.getTime() - tempdate2.getTime() <= 0) {
		tempdate1.setTime(tempdate2.getTime() - 15 * 60000)
	}

	item.start.minute = tempdate1.getHours() * 60 + tempdate1.getMinutes()
	item.start.day = tempdate1.getDate()
	item.start.month = tempdate1.getMonth()
	item.start.year = tempdate1.getFullYear()

	if (tempdate2.getTime() < tempdate1.getTime()) {
		[item.start.year, item.start.month, item.start.day, item.start.minute, item.end.year, item.end.month, item.end.day, item.end.minute] = [item.end.year, item.end.month, item.end.day, item.end.minute, item.start.year, item.start.month, item.start.day, item.start.minute]

		document.removeEventListener("mousemove", moveeventtop, false);
		document.addEventListener("mousemove", moveeventbottom, false)
		document.addEventListener("mouseup", function () {
			document.removeEventListener("mousemove", moveeventbottom, false);
		}, false);
	}

	if(!updatedeventsaftermove){
		calendar.updateEvents()
		updatedeventsaftermove = true
	}

	calendar.updateAnimatedEvents()
	calendar.updateInfo()
}


// PUSH NOTIFS

async function removePushNotifs() {
	if ("serviceWorker" in navigator && "PushManager" in window) {
		const existing = await navigator.serviceWorker.getRegistration()
		if (existing) {
			console.log("Unregistering from push notifications...")
			existing.unregister()
		}
	}
}

let subscription;
async function enablePushNotifs() {
	const Notifications = await import("/notifications.mjs")
	if (!Notifications.pushNotificationsSupported()) return
	console.log("Registering for push notifications...")

	// to make sure duplicates don't exist, remove existing SW
	await Notifications.requestPermission()
	const registration = await Notifications.registerSW()
	subscription = await Notifications.subscribe()
}

// actual function that handles the setting
function togglePushNotifs(event) {
	calendar.pushSubscriptionEnabled = event.target.checked
	if (event.target.checked) {
		enablePushNotifs()
	} else {
		removePushNotifs()
	}
	calendar.updateSettings()
}