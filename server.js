// FOR DOTENV DEV
try {
	require("dotenv").config()
} catch (e) {}

//DATABASE INITIALIZATION
const { DynamoDBClient, CreateTableCommand, PutItemCommand, GetItemCommand, ScanCommand, QueryCommand, UpdateItemCommand, DeleteItemCommand, BatchWriteCommand } = require('@aws-sdk/client-dynamodb')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY

const dynamoclient = new DynamoDBClient({ 
	region: 'us-west-1',
	credentials: {
		accessKeyId: ACCESS_KEY_ID,
		secretAccessKey: SECRET_ACCESS_KEY
	}
})


//DATABASE FUNCTIONS

async function createUser(user){
	const existinguser = user.username ? await getUserByAttribute(user.username) : null || user.google_email ? await getUserByAttribute(user.google_email) : null
	if(existinguser) throw new Error('User already exists')
	
	const params = {
	  TableName: 'smartcalendarusers',
	  Item: marshall(user, { convertClassInstanceToMap: true, removeUndefinedValues: true })
	}
	
	await dynamoclient.send(new PutItemCommand(params))
	return user
}

async function setUser(user){
	const params = {
	  TableName: 'smartcalendarusers',
	  Item: marshall(user, { convertClassInstanceToMap: true, removeUndefinedValues: true })
	}
	
	await dynamoclient.send(new PutItemCommand(params))
	return user
}


async function getUserById(userid){
	const params = {
    TableName: 'smartcalendarusers',
    Key: {
      'userid': { S: userid }
    }
  }
  const data = await dynamoclient.send(new GetItemCommand(params))
	if(data.Item){
		return addmissingpropertiestouser(unmarshall(data.Item))
	}
	return null
}

async function getUserByGoogleId(input){
	const params = {
		TableName: 'smartcalendarusers',
		IndexName: 'googleid-index',
		KeyConditionExpression: 'googleid = :input',
		ExpressionAttributeValues: {
		  ':input': { S: input }
		}
	  }
	
	const data = await dynamoclient.send(new QueryCommand(params))
	
	if(data.Items[0]){
		return addmissingpropertiestouser(unmarshall(data.Items[0]))
	}
}

async function getUserByAppleId(input){
	const params = {
		TableName: 'smartcalendarusers',
		IndexName: 'appleid-index',
		KeyConditionExpression: 'appleid = :input',
		ExpressionAttributeValues: {
		  ':input': { S: input }
		}
	  }
	
	const data = await dynamoclient.send(new QueryCommand(params))
	
	if(data.Items[0]){
		return addmissingpropertiestouser(unmarshall(data.Items[0]))
	}
}

async function getUserByAttribute(input){
	const params = {
    TableName: 'smartcalendarusers',
    IndexName: 'username-index',
    KeyConditionExpression: 'username = :input',
    ExpressionAttributeValues: {
      ':input': { S: input }
    }
  }

  const data = await dynamoclient.send(new QueryCommand(params))

	if(data.Items[0]){
		return addmissingpropertiestouser(unmarshall(data.Items[0]))
	}

	const params2 = {
    TableName: 'smartcalendarusers',
    IndexName: 'google_email-index',
    KeyConditionExpression: 'google_email = :input',
    ExpressionAttributeValues: {
      ':input': { S: input }
    }
  }

  const data2 = await dynamoclient.send(new QueryCommand(params2))

	if(data2.Items[0]){
		return addmissingpropertiestouser(unmarshall(data2.Items[0]))
	}
	
	return null
}

async function getUserByUsername(input){
	const params = {
    TableName: 'smartcalendarusers',
    IndexName: 'username-index',
    KeyConditionExpression: 'username = :input',
    ExpressionAttributeValues: {
      ':input': { S: input }
    }
  }

  const data = await dynamoclient.send(new QueryCommand(params))

	if(data.Items[0]){
		return addmissingpropertiestouser(unmarshall(data.Items[0]))
	}

	return null
}



async function deleteUser(userid){
	const params = {
    TableName: 'smartcalendarusers',
    Key: {
      'userid': { S: userid },
    },
  }

  await dynamoclient.send(new DeleteItemCommand(params))
	return
}


async function savefeedbackobject(data){
	const params = {
	  TableName: 'smartcalendarfeedback',
	  Item: marshall(data, { convertClassInstanceToMap: true, removeUndefinedValues: true })
	}
	
	await dynamoclient.send(new PutItemCommand(params))
	return data
}


async function savecontactusobject(data){
	const params = {
	  TableName: 'smartcalendarcontactus',
	  Item: marshall(data, { convertClassInstanceToMap: true, removeUndefinedValues: true })
	}
	
	await dynamoclient.send(new PutItemCommand(params))
	return data
}


async function getchatconversation(conversationid){
	const params = {
		TableName: 'smartcalendarchatconversations',
		Key: {
		  'conversationid': { S: conversationid }
		}
	  }
	  const data = await dynamoclient.send(new GetItemCommand(params))
		if(data.Item){
			return (unmarshall(data.Item))
		}
		return null
}


async function getfeedback(id){
	const params = {
		TableName: 'smartcalendarfeedback',
		Key: {
		  'id': { S: id }
		}
	  }
	  const data = await dynamoclient.send(new GetItemCommand(params))
		if(data.Item){
			return (unmarshall(data.Item))
		}
		return null
}


async function setchatconversation(tempdata){
	try{
		const params2 = {
			TableName: 'smartcalendarchatconversations',
			Item: marshall(tempdata, { convertClassInstanceToMap: true, removeUndefinedValues: true })
		}
		
		await dynamoclient.send(new PutItemCommand(params2))
	}catch(error){
		console.error(error)
	}
}

async function setfeedback(tempdata){
	try{
		const params2 = {
			TableName: 'smartcalendarfeedback',
			Item: marshall(tempdata, { convertClassInstanceToMap: true, removeUndefinedValues: true })
		}
		
		await dynamoclient.send(new PutItemCommand(params2))
	}catch(error){
		console.error(error)
	}
}

async function savechatconversation(conversationid, userid, chatconversation){
	if(userid === 'qoc6sjx02h708xk4sqxhy770dkzow3f2') return
	try{
		const params = {
			TableName: 'smartcalendarchatconversations',
			Key: {
				'conversationid': { S: conversationid }
			}
		}
		const data = await dynamoclient.send(new GetItemCommand(params))
		let tempdata = data.Item

		if(tempdata){
			tempdata = unmarshall(tempdata)
		}else{
			tempdata = new ChatConversationObject({ conversationid: conversationid, userid: userid })
		}

		tempdata.chatconversation = chatconversation

		const params2 = {
			TableName: 'smartcalendarchatconversations',
			Item: marshall(tempdata, { convertClassInstanceToMap: true, removeUndefinedValues: true })
		}
		
		await dynamoclient.send(new PutItemCommand(params2))
	}catch(error){
		console.error(error)
	}
}

async function getreferafriendinvitelinkobject(invitelink){
	const params = {
		TableName: 'smartcalendarreferafriendinvitelinks',
		Key: {
		  'invitelink': { S: invitelink }
		}
	}
	const data = await dynamoclient.send(new GetItemCommand(params))
	if(data.Item){
		return unmarshall(data.Item)
	}
	return null
}

async function setreferafriendinvitelinkobject(data){
	const params = {
		TableName: 'smartcalendarreferafriendinvitelinks',
		Item: marshall(data, { convertClassInstanceToMap: true, removeUndefinedValues: true })
	}
	  
	await dynamoclient.send(new PutItemCommand(params))
	return data
}

//DATABASE CLASSES
function addmissingproperties(model, current) {
  for (let prop in model) {
    if (!current.hasOwnProperty(prop)) {
      current[prop] = model[prop]
    } else if (typeof model[prop] === 'object') {
      addmissingproperties(model[prop], current[prop])
    }
  }
}

function addmissingpropertiestouser(user){
	addmissingproperties(MODELUSER, user)
	addmissingproperties(MODELCALENDARDATA, user.calendardata)
	addmissingproperties(MODELACCOUNTDATA, user.accountdata)
	for(let item of user.calendardata.events){
		addmissingproperties(MODELEVENT, item)
	}
	for(let item of user.calendardata.todos){
		addmissingproperties(MODELTODO, item)
	}
	for(let item of user.calendardata.calendars){
		addmissingproperties(MODELCALENDAR, item)
	}
	return user
}

function getRecurrenceString(item) {
	let frequency = item.repeat.frequency
	let interval = item.repeat.interval
	let byday = item.repeat.byday
	let count = item.repeat.count
	let until = item.repeat.until

  const options = {}

	if(frequency != null && frequency < 4){
		options.freq = 3 - frequency
	}
	if(byday && byday.length > 0){
		options.byweekday = byday.map((d) => (d + 6) % 7)
	}
	if(interval != null){
		options.interval = interval
	}
	if(count != null){
		options.count = count
	}
	if(until != null){
		options.until = new Date(until)
	}

  return new RRule(options).toString()
}

function getRecurrenceData(item){
	let frequency, interval, count, until;
	let byday = []
	if(item.recurrence && item.recurrence.length > 0){
		try{
			const parsedrecurrence = new RRule.fromString(item.recurrence[0])

			frequency = parsedrecurrence.options.freq < 4 ? 3 - parsedrecurrence.options.freq : null
			interval = parsedrecurrence.options.interval
			byday = parsedrecurrence.options.byweekday ? parsedrecurrence.options.byweekday.map((d) => (d + 1) % 7) : []
			count = parsedrecurrence.options.count
			if(parsedrecurrence.options.until){
				until = new Date(parsedrecurrence.options.until).getTime()
			}
		}catch(error){ }
	}
	return { frequency: frequency, interval: interval, byday: byday, count: count, until: until }
}



function deepCopy(obj){
	return JSON.parse(JSON.stringify(obj))
}

function isEqualArray(array1, array2){
	let temparray1 = array1.sort()
	let temparray2 = array2.sort()
	return temparray1.length === temparray2.length && temparray1.every((value, index) => value === temparray2[index])
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


function ceil(number, increment) {
	return Math.ceil(number / increment) * increment;
}

function floor(number, increment) {
	return Math.floor(number / increment) * increment;
}

function round(number, increment) {
	return Math.round(number / increment) * increment;
}

class FeedbackObject{
	constructor({ content, userid }){
		this.id = generateID()
		this.content = content
		this.userid = userid
		this.timestamp = Date.now()
	}
}

class ContactUsObject{
	constructor({ content, userid, email }){
		this.id = generateID()
		this.content = content
		this.userid = userid
		this.email = email
		this.timestamp = Date.now()
	}
}

class ChatConversationObject{
	constructor({ conversationid, userid, chatconversation = [] }){
		this.conversationid = conversationid
		this.userid = userid
		this.timestamp = Date.now()
		this.chatconversation = chatconversation
	}
}



class User{
	constructor({ username, password, google_email, googleid, appleid }){
		this.userid = generateID()

		this.username = username
		this.password = password

		this.google_email = google_email
		this.googleid = googleid

		this.appleid = appleid

		this.calendardata = {}
		this.accountdata = {}

		this.accountdata.createddate = Date.now()
		this.accountdata.lastloggedindate = Date.now()
	}
}

const MODELUSER = { calendardata: {}, accountdata: {} }
const MODELCALENDARDATA = { events: [], todos: [], calendars: [], notifications: [], settings: { issyncingtogooglecalendar: false, issyncingtogoogleclassroom: false, sleep: { startminute: 1380, endminute: 420 }, militarytime: false, theme: 0, eventspacing: 15, gettasksuggestions: true, geteventsuggestions: true, emailpreferences: { engagementalerts: true, importantupdates: true }  }, smartschedule: { mode: 1 }, lastsyncedgooglecalendardate: 0, lastsyncedgoogleclassroomdate: 0, onboarding: { start: false, connectcalendars: false, choosecalendars: false, eventreminders: false, sleeptime: false, addtask: false, finished: false }, interactivetour: { clickaddtask: false, clickscheduleoncalendar: false, autoschedule: false, subtask: false }, pushSubscription: null, pushSubscriptionEnabled: false, emailreminderenabled: false, discordreminderenabled: false, lastmodified: 0, lastprompttodotodaydate: 0, iosnotificationenabled: false, closedsocialmediapopup: false, closedfeedbackpopup: false, recognitionlanguage: 'en-US', lastgottasksuggestion: 0, lastgotsubtasksuggestion: 0 }
const MODELACCOUNTDATA = { refreshtoken: null, google: { name: null, firstname: null, profilepicture: null }, timezoneoffset: null, lastloggedindate: null, logindata: [], createddate: null, discord: { id: null, username: null }, iosdevicetoken: null, apple: { email: null }, gptsuggestionusedtimestamps: [], gptchatusedtimestamps: [], gptvoiceusedtimestamps: [], betatester: false, haspremium: false, premium: { referafriendclaimvalue: 0, starttimestamp: null, endtimestamp: null }, engagementalerts: { activitytries: 0, onboardingtries: 0, lastsentdate: null }, referafriend: { invitelink: null, acceptedcount: 0 } }
const MODELEVENT = { start: {}, end: {}, endbefore: {}, startafter: {}, id: null, calendarid: null, googleeventid: null, googlecalendarid: null, googleclassroomid: null, googleclassroomlink: null, title: null, type: 0, notes: null, completed: false, priority: 0, hexcolor: '#18a4f5', reminder: [], repeat: { frequency: null, interval: null, byday: [], until: null, count: null }, timewindow: { day: { byday: [] }, time: { startminute: null, endminute: null } }, lastmodified: 0, parentid: null, subtasksuggestions: [], gotsubtasksuggestions: false, iseventsuggestion: false, goteventsuggestion: false, autoschedulelocked: false }
const MODELTODO = { endbefore: {}, startafter: {}, title: null, notes: null, id: null, lastmodified: 0, completed: false, priority: 0, hexcolor: '#18a4f5', reminder: [], timewindow: { day: { byday: [] }, time: { startminute: null, endminute: null } }, googleclassroomid: null, googleclassroomlink: null, repeat: { frequency: null, interval: null, byday: [], until: null, count: null }, parentid: null, repeatid: null, subtasksuggestions: [], gotsubtasksuggestions: false, goteventsuggestion: false, issuggestion: false }
const MODELCALENDAR = { title: null, notes: null, id: null, googleid: null, hidden: false, hexcolor: '#18a4f5', isprimary: false, subscriptionurl: null, lastmodified: 0  }


//WEBPUSH NOTIFICATIONS
const webpush = require("web-push")
webpush.setVapidDetails(
  "mailto:contact@smartcalendar.us",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)


//EMAIL SERVICE INITIALIZATION
const { SESClient, SendEmailCommand, SendRawEmailCommand } = require("@aws-sdk/client-ses")

const sesclient = new SESClient({ 
	region: 'us-west-1',
	credentials: {
		accessKeyId: ACCESS_KEY_ID,
		secretAccessKey: SECRET_ACCESS_KEY
	}
})

function sleep(time) {
	return new Promise(resolve => {
		setTimeout(resolve, time)
	})
}


async function sendRawEmail({ from, to, htmlbody, textbody, subject, configurationset }){
	//formatting is very careful, newlines and space cannot be messed up

    const unsubscribeLink = 'mailto:james.tsaggaris@smartcalendar.us'
    const listUnsubscribePostValue = 'List-Unsubscribe=One-Click'
	const configurationsetname = configurationset || 'smart-calendar-user-sending'

    const input = {
        "Destinations": [],
        "FromArn": "",
        "RawMessage": {
            "Data": Buffer.from(`From: ${from}
To: <${to}>
Subject: ${subject}
MIME-Version: 1.0
Content-type: Multipart/Alternative; boundary="NextPart"
List-Unsubscribe: <${unsubscribeLink}>
List-Unsubscribe-Post: ${listUnsubscribePostValue}

--NextPart
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

${textbody.trim()}

--NextPart
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

${htmlbody.trim()}

--NextPart--`)
        },
        "ReturnPathArn": "",
        "Source": from,
        "SourceArn": "",
		"ConfigurationSetName": configurationsetname
    }

    try{
        const command = new SendRawEmailCommand(input)
        const response = await sesclient.send(command)
        return response
    }catch(err){
		console.error(err)
		
        return null
    }
}

async function sendEmail({ from, to, subject, htmlbody, textbody, configurationset }){
	const configurationsetname = configurationset || 'smart-calendar-user-sending'

	const params = {
		Source: from,
	  	Destination: {
			ToAddresses: [to]
		},
	 	Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: htmlbody,
				},
				Text: {
					Charset: "UTF-8",
					Data: textbody,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: subject,
			},
	  	},
		ConfigurationSetName: configurationsetname
	}

  try {
    const command = new SendEmailCommand(params)
    const response = await sesclient.send(command)
		return response
  } catch (error) {
    console.error(error)

	return null
  }
}


//REMINDERS
//send reminders

async function processReminders(){
	function getFullRelativeDHMText(input){
	  let temp = Math.abs(input)
	  let days = Math.floor(temp / 1440)
	  temp -= days * 1440
	
	  let hours = Math.floor(temp / 60)
	  temp -= hours * 60
	
	  let minutes = temp
	
	  if (days) days += ` day${days == 1 ? '' : 's'}`
	  if (hours) hours += ` hour${hours == 1 ? '' : 's'}`
	  if (minutes) minutes += ` minute${hours == 1 ? '' : 's'}`
	
	  if (days == 0 && hours == 0 && minutes == 0){
	    return 'now'
	  }
	
		if(input < 0){
			return `in ${[days, hours, minutes].filter(v => v)[0]}`
		}else{
			return `${[days, hours, minutes].filter(v => v)[0]} ago`
		}
	}

	function getDMDYText(date){
		let today = new Date()
		let tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)
		let yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)
		
		if(date.getMonth() == today.getMonth() && date.getDate() == today.getDate() && date.getFullYear() == today.getFullYear()) return 'Today'
		if(date.getMonth() == tomorrow.getMonth() && date.getDate() == tomorrow.getDate() && date.getFullYear() == tomorrow.getFullYear()) return 'Tomorrow'
		if(date.getMonth() == yesterday.getMonth() && date.getDate() == yesterday.getDate() && date.getFullYear() == yesterday.getFullYear()) return 'Yesterday'
		
	  return `${SHORTDAYLIST[date.getDay()]}, ${SHORTMONTHLIST[date.getMonth()]} ${date.getDate()}${date.getFullYear() != today.getFullYear() ? `, ${date.getFullYear()}` : ''}`
	}

	
	function getHMText(input){
		let hours = Math.floor(input / 60)
	 	let minutes = input % 60
		return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
	}	

	function formatURL(text) {
		let regex = /((?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)+[\w]{2,}(?:\/[\w-_.~%\/#?&=!$()'*+,;:@]+)?)/gi
		return text.replace(regex, function (url) {
			return `<a href="${url}" style="color:#2693ff;text-decoration:none;" target="_blank" rel="noopener noreferrer">${url}</a>`
		})
	}


	//check if remind
	let sendreminders = []
	let currentdate = Date.now()
	for(let [key, tempreminders] of Object.entries(reminderscache)){
		sendreminders.push(...tempreminders.filter(d => d.reminder.timestamp <= currentdate && lastreminderdate < d.reminder.timestamp))
	}
	lastreminderdate = currentdate


	//send reminders
	for(let item of sendreminders){
		//push notifications
		if(item.pushSubscriptionEnabled){
			if(item.pushSubscription){
				if(item.type == 'event'){
					try{
						let difference = Math.floor((Date.now() - new Date(item.event.start).getTime())/60000)
						await webpush.sendNotification(item.pushSubscription, `Your event "${item.event.title || "New Event"}" starts ${getFullRelativeDHMText(difference)}`, {
							TTL: 60*60*12,
							urgency: 'high'
						  })
					}catch(error){
						//console.error(error)
					}
				}else if (item.type == 'task'){
					try{
						let difference = Math.floor((Date.now() - new Date(item.event.duedate).getTime())/60000)
						await webpush.sendNotification(item.pushSubscription, `Your task "${item.event.title || "New Task"}" is due ${getFullRelativeDHMText(difference)}`, {
							TTL: 60*60*12,
							urgency: 'high'
						  })
					}catch(error){
						//console.error(error)
					}
				}
			}
		}


		//ios notifications
		if(item.iosnotificationenabled && item.iosdevicetoken){
			if(item.type == 'event'){
				try{
					let difference = Math.floor((Date.now() - new Date(item.event.start).getTime())/60000)
					let note = new apn.Notification({
						alert: `Starts at ${getHMText(new Date(item.event.utcstart).getHours() * 60 + new Date(item.event.utcstart).getMinutes())} (${getFullRelativeDHMText(difference)}).`,
						title: `${item.event.title || 'New Event'}`,
						topic: APPLE_BUNDLE_ID,
						sound: 'default',
						badge: 1,
					})
					
					let result = await apnProvider.send(note, item.iosdevicetoken)
					if (result.failed.length > 0) {
						//console.error("iOS notification failed:", result.failed)
					}
				}catch(error){
					console.error(error)
				}
			}else if(item.type == 'task'){
				try{
					let difference = Math.floor((Date.now() - new Date(item.event.duedate).getTime())/60000)
					let note = new apn.Notification({
						alert: `Due at ${getHMText(new Date(item.event.utcduedate).getHours() * 60 + new Date(item.event.utcduedate).getMinutes())} (${getFullRelativeDHMText(difference)}).`,
						title: `${item.event.title || 'New Task'}`,
						topic: APPLE_BUNDLE_ID,
						sound: 'default',
						badge: 1,
					})
					
					let result = await apnProvider.send(note, item.iosdevicetoken)
					if (result.failed.length > 0) {
						//console.error("iOS notification failed:", result.failed)
					}
				}catch(error){
					console.error(error)
				}
			}
		}


		//email
		if(item.emailreminderenabled){
			if(item.type == 'event'){
				await sendRawEmail({
					from: 'Smart Calendar <reminders@smartcalendar.us>',
					to: item.user.email,
					subject: `Friendly reminder: ${item.event.title || 'New Event'} (starts ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.start)/60000))})`,
					htmlbody: `
					<!DOCTYPE html>
					<html>
					<head>
							<title>Smart Calendar | Your Event Reminder</title>
							<style>
									@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap');

							</style>
					</head>
					<body style="background-color: #f4f4f4; font-family: 'Wix Madefor Text', Arial, sans-serif;">
							<div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 6px;">
									<img src="https://smartcalendar.us/logo.png" style="display: block; margin: auto; height: 150px; width: auto;" alt="Smart Calendar Logo" />
									<p style="text-align: center; font-size: 24px; color: #333; margin-top: 20px;">
											Hi ${item.user.name},
									</p>
									<p style="font-size: 18px; color: #333;">
											Just a quick reminder that you have an event starting ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.start)/60000))}:

											<div style="background-color:#f4f4f4;border-radius:6px;font-size:18px">
												<div style="padding:12px">
													<strong>${item.event.title || 'New Event'}</strong> <span style="color:#595959;">${getHMText(new Date(item.event.utcstart).getHours() * 60 + new Date(item.event.utcstart).getMinutes())} – ${getHMText(new Date(item.event.utcend).getHours() * 60 + new Date(item.event.utcend).getMinutes())}</span>
													${item.event.notes ? `<div class="font-size:16px;color:#595959;">${formatURL(item.event.notes)}</div>` : ''}
												</div>
											</div>
									</p>
									<p style="text-align: center;font-size: 14px; color: #333;padding:12px;">
										<a href="https://smartcalendar.us/app" style="font-size:18px;padding:8px 16px;background-color:#2693ff;color: #ffffff !important; text-decoration: none;border-radius:999px"><span style="color: #ffffff">Open the app</span></a>
									</p>

									<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<p style="font-size: 18px; color: #333;">
										If you have other tasks to plan, simply add them to your to-do list, and Smart Calendar will automatically schedule them for you.
									</p>
									<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<p style="text-align: center; font-size: 18px; color: #333;">
											Stay Productive,<br>
											Smart Calendar | Where AI Meets Agenda
									</p>

							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
										<p>You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may <a href="https://smartcalendar.us/app?to=unsubscribe&userid=${item.user.userid}" style="color: #2693ff; text-decoration: none;">unsubscribe</a>.</p>
									<p>&copy; 2024 James Tsaggaris. All rights reserved.</p>
									</div>

							</div>
					</body>
					</html>`,
					textbody: `Hi ${item.user.name},
					Just a quick reminder that you have an event starting ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.start)/60000))}:
					${item.event.title || 'New Event'} (${getHMText(new Date(item.event.utcstart).getHours() * 60 + new Date(item.event.utcstart).getMinutes())} – ${getHMText(new Date(item.event.utcend).getHours() * 60 + new Date(item.event.utcend).getMinutes())}).

					Open https://smartcalendar.us/app to see more details about your event.
					
					If you have other tasks to plan, simply add them to your to-do list, and Smart Calendar will automatically schedule them for you.

					Stay Productive,
					Smart Calendar | Where AI Meets Agenda

					You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may unsubscribe at https://smartcalendar.us/app?to=unsubscribe&userid=${item.user.userid}.
					(c) 2024 James Tsaggaris. All rights reserved.`
				})

			}else if(item.type == 'task'){

				await sendRawEmail({
					from: 'Smart Calendar <reminders@smartcalendar.us>',
					to: item.user.email,
					subject: `Friendly reminder: ${item.event.title || 'New Event'} (due ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.duedate)/60000))})`,
					htmlbody: `
					<!DOCTYPE html>
					<html>
					<head>
							<title>Smart Calendar | Your Task Reminder</title>
							<style>
									@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap');
							</style>
					</head>
					<body style="background-color: #f4f4f4; font-family: 'Wix Madefor Text', Arial, sans-serif;">
							<div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 6px;">
									<img src="https://smartcalendar.us/logo.png" style="display: block; margin: auto; height: 150px; width: auto;" alt="Smart Calendar Logo" />
									<p style="text-align: center; font-size: 24px; color: #333; margin-top: 20px;">
											Hi ${item.user.name},
									</p>
									<p style="font-size: 18px; color: #333;">
											Just a quick reminder that you have a task due ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.duedate)/60000))}:

											<div style="background-color:#f4f4f4;border-radius:6px;font-size:18px">
												<div style="padding:12px">
													<strong>${item.event.title || 'New Task'}</strong> <span style="color:#595959;">Due ${getHMText(new Date(item.event.utcduedate).getHours() * 60 + new Date(item.event.utcduedate).getMinutes())}</span>
													${item.event.notes ? `<div class="font-size:16px;color:#595959;">${formatURL(item.event.notes)}</div>` : ''}
												</div>
											</div>
									</p>
									<p style="text-align: center;font-size: 14px; color: #333;padding:12px;">
										<a href="https://smartcalendar.us/app" style="font-size:18px;padding:8px 16px;background-color:#2693ff;color: #ffffff !important; text-decoration: none;border-radius:999px"><span style="color: #ffffff">Open the app</span></a>
									</p>

									<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<p style="font-size: 18px; color: #333;">
										If you have other tasks to plan, simply add them to your to-do list, and Smart Calendar will automatically schedule them for you.
									</p>
									<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<p style="text-align: center; font-size: 18px; color: #333;">
											Stay Productive,<br>
											Smart Calendar | Where AI Meets Agenda
									</p>

							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
										<p>You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may <a href="https://smartcalendar.us/app?to=unsubscribe&userid=${item.user.userid}" style="color: #2693ff; text-decoration: none;">unsubscribe</a>.</p>
									<p>&copy; 2024 James Tsaggaris. All rights reserved.</p>
									</div>

							</div>
					</body>
					</html>`,
					textbody: `Hi ${item.user.name},
					Just a quick reminder that you have a task due ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.duedate)/60000))}:
					${item.event.title || 'New Task'} (Due ${getHMText(new Date(item.event.utcduedate).getHours() * 60 + new Date(item.event.utcduedate).getMinutes())}).

					Open https://smartcalendar.us/app to see more details about your task.
					
					If you have other tasks to plan, simply add them to your to-do list, and Smart Calendar will automatically schedule them for you.

					Stay Productive,
					Smart Calendar | Where AI Meets Agenda

					You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may unsubscribe at https://smartcalendar.us/app?to=unsubscribe&userid=${item.user.userid}.
					(c) 2024 James Tsaggaris. All rights reserved.`
				})
				
			}
		}


		//discord message
		if(item.discordreminderenabled){
			if(!item.user.discordid) continue

			const discorduser = await getDiscordUserFromId(item.user.discordid)
			if(!discorduser) continue

			if(item.type == 'event'){
				const embed = new EmbedBuilder()
					.setTitle(`Event "${item.event.title || 'New Event'}" starts ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.start)/60000))}`)
					.setDescription(`Hey ${discorduser.username}, just a quick reminder for your event [**${item.event.title || 'New Event'}**](https://smartcalendar.us/app). It's from ${getHMText(new Date(item.event.utcstart).getHours() * 60 + new Date(item.event.utcstart).getMinutes())} to ${getHMText(new Date(item.event.utcend).getHours() * 60 + new Date(item.event.utcend).getMinutes())}.`)
					.setFooter({ text: 'Smart Calendar', iconURL: `https://smartcalendar.us/logo.png` })
					.setColor(item.event.hexcolor || MODELEVENT.hexcolor)
				if(item.event.notes){
					embed.addFields({ name: 'Notes', value: item.event.notes })
				}

				await sendDiscordMessageToUser(discorduser, { embeds: [embed] })
			}else if(item.type == 'task'){
				const embed = new EmbedBuilder()
					.setTitle(`Task "${item.event.title || 'New Event'}" due ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.duedate)/60000))}`)
					.setDescription(`Hey ${discorduser.username}, just a quick reminder for your task [**${item.event.title || 'New Task'}**](https://smartcalendar.us/app). It's due at ${getHMText(new Date(item.event.utcduedate).getHours() * 60 + new Date(item.event.utcduedate).getMinutes())}.`)
					.setFooter({ text: 'Smart Calendar', iconURL: `https://smartcalendar.us/logo.png` })
					.setColor(item.event.hexcolor || MODELEVENT.hexcolor)
				if(item.event.notes){
					embed.addFields({ name: 'Notes', value: item.event.notes })
				}
				
				await sendDiscordMessageToUser(discorduser, { embeds: [embed] })
			}
		}

	}
}

//here2
async function processengagementalerts(){
	return
	let sendengagementalerts = []
	for(let [key, value] of Object.entries(engagementcache)){
		if(!value.finishedonboarding && currentdate - value.createddate > 86400*1000*2){
			//unfinished onboarding
			//send email on day 2, 6, 18

			if(currentdate - value.engagementalerts.lastsentdate > 86400*1000*2 * (Math.pow(3, value.engagementalerts.onboardingtries || 0) - 1)){
				if(value.engagementalerts.onboardingtries <= 2){ //stop after 3
					sendengagementalerts.push({ value: value, type: 0 })

					let tempuser = await getUserById(key)
					tempuser.accountdata.engagementalerts.onboardingtries++
					tempuser.accountdata.engagementalerts.lastsentdate = currentdate
					await setUser(tempuser)
				}
			}
		}else if(currentdate - value.lastmodified > 86400*1000*7){
			//inactive for 7 days
			//send email on day 7, 14, 28, 56

			if(currentdate - value.engagementalerts.lastsentdate > 86400*1000*7 * (Math.pow(2, value.engagementalerts.activitytries || 0) - 1)){
				if(value.engagementalerts.activitytries <= 3){ //stop after 4
					sendengagementalerts.push({ value: value, type: 1 })

					let tempuser = await getUserById(key)
					tempuser.accountdata.engagementalerts.activitytries++
					tempuser.accountdata.engagementalerts.lastsentdate = currentdate
					await setUser(tempuser)
				}
			}
		}
		
	}

	for(let { value, type } of sendengagementalerts){
		let email = value.user.email
		let name = value.user.name

		if(type == 0){
			//email
			await sendRawEmail({
				from: 'Smart Calendar <reminders@smartcalendar.us>',
				to: email,
				subject: `Let's complete your setup for Smart Calendar`,
				htmlbody: `
				<!DOCTYPE html>
				<html>
				<head>
					<title>Let's complete your setup for Smart Calendar</title>
					<style>
							@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap');
					</style>
				</head>
				<body style="background-color: #f4f4f4; font-family: 'Wix Madefor Text', Arial, sans-serif;">
					<div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 6px;">
							<img src="https://smartcalendar.us/logo.png" style="display: block; margin: auto; height: 150px; width: auto;" alt="Smart Calendar Logo" />
							<p style="text-align: center; font-size: 24px; color: #333; margin-top: 20px;">
									Hello ${name},
							</p>
							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<p style="font-size: 18px; color: #333;">
								We noticed you started setting up your Smart Calendar but didn't quite finish. Let's get you across the finish line!
							</p>
							<p style="font-size: 18px; color: #333;">
								We would really like to show you the power of Smart Calendar. By completing your setup, you'll unlock the full potential of turning to-dos into a well-organized schedule. We think you'll like that a lot.
							</p>
							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<p style="font-size: 18px; color: #333;">
								If you have any questions or have feedback, please <a href="https://smartcalendar.us/contact" style="color: #2693ff; text-decoration: none;"></a>. We're here for you.
							</p>
							<p style="text-align: center;font-size: 18px; color: #333;">
								<a href="https://smartcalendar.us/app" style="padding:8px 16px;background-color:#2693ff;color: #ffffff !important; text-decoration: none;border-radius:999px"><span style="color: #ffffff">Open the app</span></a>
							</p>
							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<p style="text-align: center; font-size: 18px; color: #333;">
									Stay Productive,<br>
									Smart Calendar | Where AI Meets Agenda
							</p>
			
					<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
								<p>You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may <a href="https://smartcalendar.us/app?to=unsubscribe&userid=${value.user.userid}" style="color: #2693ff; text-decoration: none;">unsubscribe</a>.</p>
							<p>&copy; 2024 James Tsaggaris. All rights reserved.</p>
							</div>
			
					</div>
				</body>
				</html>`,
						textbody: `Hello ${name},
			
				We noticed you started setting up your Smart Calendar but didn't quite finish. Let's get you across the finish line!

				We would really like to show you the power of Smart Calendar. By completing your setup, you'll unlock the full potential of turning to-dos into a well-organized schedule. We think you'll like that a lot.
	
				If you have any questions or have feedback, please <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a> at https://smartcalendar.us/contact. We're here for you.
	
				Stay Productive,
				Smart Calendar | Where AI Meets Agenda
			
				You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may unsubscribe at https://smartcalendar.us/app?to=unsubscribe&userid=${value.user.userid}.
				(c) 2024 James Tsaggaris. All rights reserved.`
			})


			//ios notification
			if(value.iosdevicetoken){
				let note = new apn.Notification({
					alert: `Complete your setup to start planning with our powerful AI scheduling.`,
					title: `Let's complete your setup`,
					topic: APPLE_BUNDLE_ID,
					sound: 'default',
					badge: 1,
				})
				
				let result = await apnProvider.send(note, value.iosdevicetoken)
				if (result.failed.length > 0) {
					console.error("iOS notification failed:", result.failed)
				}
			}

		}else if(type == 1){
			//email
			await sendRawEmail({
				from: 'Smart Calendar <reminders@smartcalendar.us>',
				to: email,
				subject: `Let's get back on track for your Smart Calendar`,
				htmlbody: `
				<!DOCTYPE html>
				<html>
				<head>
					<title>Let's complete your setup for Smart Calendar</title>
					<style>
							@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap');
					</style>
				</head>
				<body style="background-color: #f4f4f4; font-family: 'Wix Madefor Text', Arial, sans-serif;">
					<div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 6px;">
							<img src="https://smartcalendar.us/logo.png" style="display: block; margin: auto; height: 150px; width: auto;" alt="Smart Calendar Logo" />
							<p style="text-align: center; font-size: 24px; color: #333; margin-top: 20px;">
								Hello ${name},
							</p>
							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<p style="font-size: 18px; color: #333;">
								It's been a while since we last saw you on Smart Calendar. We have a lot of new things to share with you, and we think you'll like them a lot. Try planning your schedule for this week. You'll unlock the full potential of Smart Calendar's AI planning.
							</p>
							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<p style="font-size: 18px; color: #333;">
								If you have any questions or have feedback, please <a href="https://smartcalendar.us/contact" style="color: #2693ff; text-decoration: none;"></a>. We're here for you.
							</p>
							<p style="text-align: center;font-size: 18px; color: #333;">
								<a href="https://smartcalendar.us/app" style="padding:8px 16px;background-color:#2693ff;color: #ffffff !important; text-decoration: none;border-radius:999px"><span style="color: #ffffff">Open the app</span></a>
							</p>
							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<p style="text-align: center; font-size: 18px; color: #333;">
									Stay Productive,<br>
									Smart Calendar | Where AI Meets Agenda
							</p>
			
					<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
								<p>You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may <a href="https://smartcalendar.us/app?to=unsubscribe&userid=${value.user.userid}" style="color: #2693ff; text-decoration: none;">unsubscribe</a>.</p>
							<p>&copy; 2024 James Tsaggaris. All rights reserved.</p>
							</div>
			
					</div>
				</body>
				</html>`,
						textbody: `Hello ${name},
			
				It's been a while since we last saw you on Smart Calendar. We have a lot of new things to share with you, and we think you'll like them a lot. Try planning your schedule for this week. You'll unlock the full potential of Smart Calendar's AI planning.
	
				If you have any questions or have feedback, please <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a> at https://smartcalendar.us/contact. We're here for you.
	
				Stay Productive,
				Smart Calendar | Where AI Meets Agenda
			
				You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may unsubscribe at https://smartcalendar.us/app?to=unsubscribe&userid=${value.user.userid}.
				(c) 2024 James Tsaggaris. All rights reserved.`
			})


			//ios notification
			if(value.iosdevicetoken){
				let note = new apn.Notification({
					alert: `Try planning your schedule for this week with our AI.`,
					title: `Let's get back on track`,
					topic: APPLE_BUNDLE_ID,
					sound: 'default',
					badge: 1,
				})
				
				let result = await apnProvider.send(note, value.iosdevicetoken)
				if (result.failed.length > 0) {
					console.error("iOS notification failed:", result.failed)
				}
			}


		}
	}
}

function getLoginData(req){
	return {
		ip: req?.headers['x-forwarded-for']?.split(',')[0],
		useragent: req?.headers['user-agent'],
		iosapp: req?.cookies?.iosapp === 'true',
		hotjarid: Object.keys(req?.cookies)?.find(d => d.startsWith('_hjSessionUser_'))?.replace('_hjSessionUser_', ''),
		timestamp: Date.now()
	}
}


function isEmail(str) {
	let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return pattern.test(str)
}

//cache reminders
function cacheReminders(user){


	//get calendar events within 1 day
	function getevents(){
		function isHidden(item){
			if(item.calendarid == null){
				let calendaritem = calendar.calendars.find(f => f.isprimary)
				if(calendaritem){
					return calendaritem.hidden
				}
			}else{
				let calendaritem = calendar.calendars.find(f => f.id == item.calendarid)
				if(calendaritem){
					return calendaritem.hidden
				}
			}
		}

		let calendar = user.calendardata


		let maxdate = new Date()
		maxdate.setDate(maxdate.getDate() + 1)
		
		let output = []
		let shownevents = calendar.events.filter(d => {
			return !isHidden(d)
		})

		
		for(let item of shownevents){
			let itemstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			let itemenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

			if(item.repeat.interval == null || item.repeat.frequency == null || item.type == 1){
				//no repeat
				output.push(item)
			}else{
				//repeat
				let byday = [0]
				if(item.repeat.frequency == 1){
					byday = [...item.repeat.byday]
					if(byday.length == 0){
						byday.push(itemstartdate.getDay())
					}
				}
				
				for(let repeatindex of byday){
					let repeatstartdate = new Date(itemstartdate.getTime())
					if(item.repeat.frequency == 1){
						repeatstartdate.setDate(repeatstartdate.getDate() + (repeatindex - repeatstartdate.getDay() + 7) % 7)
					}

		
					let counter = 0
					
					while(repeatstartdate.getTime() < maxdate.getTime()){
						//create
						if(counter % item.repeat.interval == 0){
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

							output.push(repeatitem)
						}

						//next
						if(item.repeat.frequency == 0){
							repeatstartdate.setDate(repeatstartdate.getDate() + 1)
						}else if(item.repeat.frequency == 1){
							repeatstartdate.setDate(repeatstartdate.getDate() + 7)
						}else if(item.repeat.frequency == 2){
							repeatstartdate.setMonth(repeatstartdate.getMonth() + 1)
						}else if(item.repeat.frequency == 3){
							repeatstartdate.setFullYear(repeatstartdate.getFullYear() + 1)
						}
		
						counter++

						//until or count
						if((item.repeat.count && counter >= item.repeat.count) || (item.repeat.until && repeatstartdate.getTime() > new Date(item.repeat.until).getTime())){
							break
						}
						
					}
					
				}
				
			}
		}
		return output
	}




	let email = getUserEmail(user)
	if(!isEmail(email)) return

	let timezoneoffset = user.accountdata.timezoneoffset
	if(timezoneoffset == null) return

	let name = getUserName(user)

	let discordid = user.accountdata.discord.id

	let tempreminders = []

	let allevents = getevents()
	for(let item of allevents){
		if(item.type == 1 && item.completed) continue

		for(let itemreminder of item.reminder){
			tempreminders.push({
				type: 'event',
				user: {
					name: name,
					email: email,
					discordid: discordid,
					userid: user.userid
				},
				event: {
					id: item.id,
					title: item.title,
					start: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime() + timezoneoffset * 60000,
					end: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime() + timezoneoffset * 60000,
					utcstart: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime(),
					utcend: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).getTime(),
					notes: item.notes,
					hexcolor: item.hexcolor
				},
				reminder: {
					timestamp: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).getTime() - itemreminder.timebefore + timezoneoffset * 60000,
				},
				pushSubscription: user.calendardata.pushSubscription,
				emailreminderenabled: user.calendardata.emailreminderenabled,
				pushSubscriptionEnabled: user.calendardata.pushSubscriptionEnabled,
				discordreminderenabled: user.calendardata.discordreminderenabled,
				iosdevicetoken: user.accountdata.iosdevicetoken,
				iosnotificationenabled: user.calendardata.iosnotificationenabled
			})
		}	
	}

	for(let item of user.calendardata.todos){
		if(item.completed) continue

		for(let itemreminder of item.reminder){
			tempreminders.push({
				type: 'task',
				user: {
					name: name,
					email: email,
					discordid: discordid,
					userid: user.userid
				},
				event: {
					id: item.id,
					title: item.title,
					duedate: new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute).getTime() + timezoneoffset * 60000,
					utcduedate: new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute).getTime(),
					notes: item.notes,
					hexcolor: item.hexcolor
				},
				reminder: {
					timestamp: new Date(item.endbefore.year, item.endbefore.month, item.endbefore.day, 0, item.endbefore.minute).getTime() - itemreminder.timebefore + timezoneoffset * 60000,
				},
				pushSubscription: user.calendardata.pushSubscription,
				emailreminderenabled: user.calendardata.emailreminderenabled,
				pushSubscriptionEnabled: user.calendardata.pushSubscriptionEnabled,
				discordreminderenabled: user.calendardata.discordreminderenabled,
				iosdevicetoken: user.accountdata.iosdevicetoken,
				iosnotificationenabled: user.calendardata.iosnotificationenabled
			})
		}
	}
	
	reminderscache[user.userid] = tempreminders


	//engagement cache
	if(user.calendardata.settings.emailpreferences.engagementalerts == true){
		engagementcache[user.userid] = {
			user: {
				name: name,
				email: email,
				discordid: discordid,
				userid: user.userid
			},
			createddate: user.accountdata.createddate,
			lastmodified: user.calendardata.lastmodified,
			finishedonboarding: user.calendardata.onboarding.finished == true,
			engagementalerts: user.accountdata.engagementalerts,
			iosdevicetoken: user.accountdata.iosdevicetoken
		}
	}
}


//email notifications
let reminderscache = {}
let lastreminderdate = Date.now()

let engagementcache = {}
let lastengagementalertdate = Date.now()

async function initializeReminders(){
	try {
		let ExclusiveStartKey;
		do {
			const command = new ScanCommand({
				TableName: 'smartcalendarusers',
				ExclusiveStartKey
			})

			const response = await dynamoclient.send(command)
			const items = response.Items.map(item => addmissingpropertiestouser(unmarshall(item)))

			for (let user of items) {
				cacheReminders(user)
			}

		ExclusiveStartKey = response.LastEvaluatedKey
		} while (ExclusiveStartKey)
	} catch (error) {
		console.error(error)
	}


	processReminders()
	setInterval(tickreminders, 1000)
	function tickreminders(){
		let currentminutes = Math.floor(Date.now() / 60000)
  		let lastreminderminutes = Math.floor(lastreminderdate / 60000)
		if(currentminutes > lastreminderminutes){
			processReminders()
		}
	}

	setInterval(tickengagementalerts, 60000)
	function tickengagementalerts(){
		let currentminutes = floor(Date.now() / 60000, 60000*5)
  		let lastengagementalertminutes = floor(lastengagementalertdate / 60000, 60000*5)
		if(currentminutes > lastengagementalertminutes){
			processengagementalerts()
		}
	}
}
initializeReminders()


//SERVER INITIALIZATION
const DOMAIN = process.env.DOMAIN
const SESSION_SECRET = process.env.SESSION_SECRET
const port = process.env.PORT || 3000

const fs = require('fs')
const axios = require('axios');
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const formidable = require('formidable')
const compression = require('compression')
const RRule = require('rrule').RRule
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const jwkToPem = require('jwk-to-pem')


//GOOGLE INITIALIZATION
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = `${DOMAIN}/auth/google/callback`

const { google } = require('googleapis')
const { OAuth2Client } = require('google-auth-library')


//APPLE INITIALIZATION
const APPLE_REDIRECT_URI = `${DOMAIN}/auth/apple/callback`
const APPLE_PRIVATE_KEY_PATH = process.env.APPLE_PRIVATE_KEY_PATH
const APPLE_KEY_ID = process.env.APPLE_KEY_ID
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID


//IOS NOTIFICATIONS INITIALIZATION
const apn = require('apn')

const APN_KEY_ID = process.env.APN_KEY_ID
const APN_KEY_PATH = process.env.APN_KEY_PATH
const APPLE_BUNDLE_ID = process.env.APPLE_BUNDLE_ID

const apnoptions = {
	token: {
		key: APN_KEY_PATH,
		keyId: APN_KEY_ID,
		teamId: APPLE_TEAM_ID
  	},
  	production: true
}

let apnProvider = new apn.Provider(apnoptions)


//OPENAI INITIALIZATION
const OpenAI = require('openai').default
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})


//EXPRESS INITIALIZATION
const express = require('express')
const session = require('express-session')
const app = express()

const DynamoDBStore = require('dynamodb-store')
const dynamostore = new DynamoDBStore({
	table: {
		name: "smartcalendarsessions",
		hashKey: "sessionid",
	},
	dynamoConfig: {
		accessKeyId: ACCESS_KEY_ID,
		secretAccessKey: SECRET_ACCESS_KEY,
		region: 'us-west-1'
	},
	keepExpired: false,
	touchInterval: 30000,
	ttl: 604800000
})

app.use(compression())

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser())

app.use(session({
	store: dynamostore,
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 604800000
	},
	rolling: true
}))


//SERVER RUN

async function getNewAccessToken(refreshToken){
	try{
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		const tokens = await googleclient.refreshToken(refreshToken)
		return tokens.tokens.access_token
	}catch(err){
		return false
	}
}

async function isRefreshTokenValid(refreshToken) {
  try {
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		googleclient.setCredentials({ refresh_token: refreshToken })
		const { expiry_date } = await googleclient.getAccessToken()

   	return expiry_date > Date.now()
  } catch (error) {
	return false
  }
}


//USE ROUTES

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public', 'css')))
app.use(express.static(path.join(__dirname, 'public', 'js')))
app.use(express.static(path.join(__dirname, 'public', 'images')))
app.use(express.static(path.join(__dirname, 'public', 'sounds')))
app.use(express.static(path.join(__dirname, 'public', 'blog')))
app.use(express.static(path.join(__dirname, 'public', 'blog', 'css')))
app.use(express.static(path.join(__dirname, 'public', 'blog', 'js')))

app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const newUrl = req.path.slice(0, -5)
    res.redirect(301, newUrl)
  } else {
    next()
  }
})


//GOOGLE ROUTES

app.post('/auth/google', async (req, res, next) => {
	try{
		let options = req.body.options

		const authoptions = {
			access_type: 'offline',
			scope: ['profile', 'email'],
			GOOGLE_REDIRECT_URI: GOOGLE_REDIRECT_URI,
		}


		//ios app
		if(req.cookies?.iosapp === 'true'){
			authoptions.state = 'iosapp'
		}


		if(options?.scope?.includes('calendar')){
			authoptions.scope.push('https://www.googleapis.com/auth/calendar')
		}
		if(options?.scope?.includes('classroom')){
			authoptions.scope.push('https://www.googleapis.com/auth/classroom.courses.readonly', 'https://www.googleapis.com/auth/classroom.coursework.me.readonly')
		}

		if(req.session.user){
			const userid = req.session.user.userid
			const user = await getUserById(userid)
			if(user){
				if(!user.accountdata.refreshtoken){
					authoptions.prompt = 'consent'
				}else{
					if(!isRefreshTokenValid(user.accountdata.refreshtoken)){
						authoptions.prompt = 'consent'
					}
				}

				let modifieduser = false
				if(!user.calendardata.settings.issyncingtogooglecalendar && options?.enable?.includes('calendar')){
					modifieduser = true
					user.calendardata.settings.issyncingtogooglecalendar = true
				}
				if(!user.calendardata.settings.issyncingtogoogleclassroom && options?.enable?.includes('classroom')){
					modifieduser = true
					user.calendardata.settings.issyncingtogoogleclassroom = true
				}
				if(modifieduser){
					await setUser(user)
				}
			}else{
				authoptions.prompt = 'consent'
			}
		}else{
			authoptions.prompt = 'consent'
		}

		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		const authurl = googleclient.generateAuthUrl(authoptions)
		return res.json({ url: authurl })
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


//ios register notification
app.post('/registeriOSDevice', async (req, res) => {
	try{
		const deviceToken = req.body.deviceToken

		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		const userid = req.session.user.userid
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User does not exist.' })
		}

		if (!deviceToken) {
			return res.status(400).json({ error: 'No device token provided.' })
		}

		if(user.accountdata.iosdevicetoken != deviceToken){
			user.calendardata.iosnotificationenabled = true
			user.accountdata.iosdevicetoken = deviceToken
			await setUser(user)
		}
		
		res.status(200).json({ message: 'Device registered successfully' })
	}catch(error){
		console.error(error)
		return res.status(400).json({ error: 'Unexpected error on server.' })
	}
})


//ios login
const sessionTokens = {}
app.get('/restoreSession', async (req, res) => {
    const { token } = req.query

    if (sessionTokens[token]) {
        Object.assign(req.session, sessionTokens[token])
		req.session.save()

        delete sessionTokens[token]

		res.redirect(301, `/app`)
    } else {
        res.status(401).redirect('/login')
    }
})


app.get('/auth/google/callback', async (req, res, next) => {
	try{
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		const { tokens } = await googleclient.getToken(req.query.code)
		googleclient.setCredentials(tokens)

		//redirect to app or ios callback
		const iosapp = req.query.state === 'iosapp'
		function getfinalredirect(){
			if(iosapp == true){
				const token = crypto.randomBytes(32).toString('hex')

				sessionTokens[token] = req.session
				setTimeout(() => { delete sessionTokens[token] }, 60000)
	
				return `smartcalendar://oauth-callback?token=${token}`
			}else{
				return `/app`
			}
		}


		//get user info
		const ticket = await googleclient.verifyIdToken({
			idToken: tokens.id_token,
			audience: GOOGLE_CLIENT_ID,
		})
		const payload = ticket.getPayload()

		//get details
		const googleid = payload.sub
		const email = payload.email
		const name = payload.name
		const firstname = payload.given_name
		const profilepicture = payload.picture
	

		let user = await getUserByGoogleId(googleid)
		if(user){
			//sign in to google account

			req.session.user = { userid: user.userid }
			req.session.tokens = tokens

			if(tokens.refresh_token) user.accountdata.refreshtoken = tokens.refresh_token
			user.accountdata.google.name = name
			user.accountdata.google.firstname = firstname
			user.accountdata.google.profilepicture = profilepicture
			user.accountdata.lastloggedindate = Date.now()
			user.accountdata.logindata.push(getLoginData(req))
			user.googleid = googleid
			user.google_email = email
			await setUser(user)

			return res.redirect(301, getfinalredirect())
		}

		let loggedInUser = req.session.user && req.session.user.userid ? await getUserById(req.session.user.userid) : null
		let userWithEmail = await getUserByAttribute(email)

		if(loggedInUser && !loggedInUser.google_email){ // if current user logged in exists and does not have google email set (they use regular email and password)
			if (userWithEmail && userWithEmail?.userid !== loggedInUser?.userid) throw new Error("Email is being used for another account")
			// if there is no user that has email that matches current user
			// add google to logged in account

			req.session.user = { userid: loggedInUser.userid }
			req.session.tokens = tokens
			
			delete loggedInUser.username
			loggedInUser.google_email = email
			loggedInUser.googleid = googleid
			if(tokens.refresh_token) loggedInUser.accountdata.refreshtoken = tokens.refresh_token
			loggedInUser.accountdata.google.name = name
			loggedInUser.accountdata.google.firstname = firstname
			loggedInUser.accountdata.google.profilepicture = profilepicture
			loggedInUser.accountdata.lastloggedindate = Date.now()
			loggedInUser.accountdata.logindata.push(getLoginData(req))
			await setUser(loggedInUser)

			return res.redirect(301, getfinalredirect())
		}

		if(userWithEmail){
			if(userWithEmail.username == email){
				//reject sign in to regular email account
				throw new Error('Use email and password to log in.')
			}

			if(userWithEmail.google_email == email){
				//sign in to google account

				req.session.user = { userid: userWithEmail.userid }
				req.session.tokens = tokens

				if(tokens.refresh_token) user.accountdata.refreshtoken = tokens.refresh_token
				userWithEmail.accountdata.google.name = name
				userWithEmail.accountdata.google.firstname = firstname
				userWithEmail.accountdata.google.profilepicture = profilepicture
				userWithEmail.accountdata.lastloggedindate = Date.now()
				userWithEmail.accountdata.logindata.push(getLoginData(req))
				userWithEmail.googleid = googleid
				userWithEmail.google_email = email
				await setUser(userWithEmail)

				return res.redirect(301, getfinalredirect())
			}
		}

		
		if(true){
			const newUser = addmissingpropertiestouser(new User({ google_email: email, googleid: googleid }))
			newUser.calendardata.settings.issyncingtogooglecalendar = true
			if(tokens.refresh_token) newUser.accountdata.refreshtoken = tokens.refresh_token
			newUser.accountdata.google.name = name
			newUser.accountdata.google.firstname = firstname
			newUser.accountdata.google.profilepicture = profilepicture
			newUser.accountdata.logindata.push(getLoginData(req))
			await createUser(newUser)

			if(!req.session.user){
				req.session.user = {}
			}
			req.session.user.userid = newUser.userid

			req.session.tokens = tokens


			if(req.session.user?.inviteafriend?.invitecode){
				await validatereferafriendinvitecode(req)
			}

			await sendwelcomeemail(newUser)

			return res.redirect(301, getfinalredirect())
		}

	}catch(error){
		console.error(error)
		res.redirect(301, '/login')
	}
})

app.post('/auth/google/onetap', async (req, res, next) => {
	try{
		//get googleid
		const jsontoken = req.body.credential
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)

		//get user info
		const ticket = await googleclient.verifyIdToken({
			idToken: jsontoken,
			audience: GOOGLE_CLIENT_ID,
		})
		const payload = ticket.getPayload()

		const googleid = payload.sub
		const email = payload.email
		const name = payload.name
		const firstname = payload.given_name
		const profilepicture = payload.picture


		//code below is same as /auth/google/callback but without tokens
		//-----------------------------------------------------------


		let user = await getUserByGoogleId(googleid)
		if(user){
			//sign in to google account

			req.session.user = { userid: user.userid }

			user.accountdata.google.name = name
			user.accountdata.google.firstname = firstname
			user.accountdata.google.profilepicture = profilepicture
			user.accountdata.lastloggedindate = Date.now()
			user.accountdata.logindata.push(getLoginData(req))
			user.googleid = googleid
			user.google_email = email
			await setUser(user)

			return res.redirect(301, '/app')
		}

		let loggedInUser = req.session.user && req.session.user.userid ? await getUserById(req.session.user.userid) : null
		let userWithEmail = await getUserByAttribute(email)

		if(loggedInUser && !loggedInUser.google_email){ // if current user logged in exists and does not have google email set (they use regular email and password)
			if (userWithEmail && userWithEmail?.userid !== loggedInUser?.userid) throw new Error("Email is being used for another account")
			// if there is no user that has email that matches current user
			// add google to logged in account

			req.session.user = { userid: loggedInUser.userid }
			
			delete loggedInUser.username
			loggedInUser.google_email = email
			loggedInUser.googleid = googleid
			loggedInUser.accountdata.google.name = name
			loggedInUser.accountdata.google.firstname = firstname
			loggedInUser.accountdata.google.profilepicture = profilepicture
			loggedInUser.accountdata.lastloggedindate = Date.now()
			loggedInUser.accountdata.logindata.push(getLoginData(req))
			await setUser(loggedInUser)

			return res.redirect(301, '/app')
		}

		if(userWithEmail){
			if(userWithEmail.username == email){
				//reject sign in to regular email account
				throw new Error('Use email and password to log in.')
			}

			if(userWithEmail.google_email == email){
				//sign in to google account

				req.session.user = { userid: userWithEmail.userid }

				userWithEmail.accountdata.google.name = name
				userWithEmail.accountdata.google.firstname = firstname
				userWithEmail.accountdata.google.profilepicture = profilepicture
				userWithEmail.accountdata.lastloggedindate = Date.now()
				userWithEmail.accountdata.logindata.push(getLoginData(req))
				userWithEmail.googleid = googleid
				userWithEmail.google_email = email
				await setUser(userWithEmail)

				return res.redirect(301, '/app')
			}
		}

		
		
		if(true){
			const newUser = addmissingpropertiestouser(new User({ google_email: email, googleid: googleid }))
			newUser.calendardata.settings.issyncingtogooglecalendar = true
			newUser.accountdata.google.name = name
			newUser.accountdata.google.firstname = firstname
			newUser.accountdata.google.profilepicture = profilepicture
			newUser.accountdata.logindata.push(getLoginData(req))
			await createUser(newUser)

			if(!req.session.user){
				req.session.user = {}
			}
			req.session.user.userid = newUser.userid

			if(req.session.user?.inviteafriend?.invitecode){
				await validatereferafriendinvitecode(req)
			}

			await sendwelcomeemail(newUser)
			return res.redirect(301, '/app')
		}
	}catch(error){
		console.error(error)
		res.redirect(301, '/login')
	}
})



app.post('/auth/apple/callback', async (req, res) => {
	try {
		const { code } = req.body
		if (!code) {
			throw new Error('Missing code parameter')
		}

		const privateKey = fs.readFileSync(APPLE_PRIVATE_KEY_PATH, 'utf8')


		const clientsecret = jwt.sign({
			iss: APPLE_TEAM_ID,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + (60 * 60),
			aud: 'https://appleid.apple.com',
			sub: APPLE_CLIENT_ID,
		}, privateKey, { algorithm: 'ES256', keyid: APPLE_KEY_ID })


		const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: APPLE_CLIENT_ID,
				client_secret: clientsecret,
				code,
				grant_type: 'authorization_code',
				redirect_uri: APPLE_REDIRECT_URI
			})
		})
	
		const tokenData = await tokenResponse.json()


		const applePublicKeyResponse = await fetch('https://appleid.apple.com/auth/keys')
		const appleKeys = await applePublicKeyResponse.json()

		const kid = jwt.decode(tokenData.id_token, {complete: true}).header.kid
		const publicKey = jwkToPem(appleKeys.keys.find(key => key.kid === kid))


		const decodedToken = jwt.verify(tokenData.id_token, publicKey, {
			algorithms: ['RS256'],
			audience: APPLE_CLIENT_ID
		})
	
		if (!decodedToken) {
			throw new Error('Invalid token')
		}
		

		const appleuserID = decodedToken.sub
		const appleuseremail = decodedToken.email
		
		if(!appleuserID){
			throw new Error('Invalid user ID')
		}

		//database

		//log in
		let existinguser = await getUserByAppleId(appleuserID)
		if(existinguser){
			existinguser.accountdata.lastloggedindate = Date.now()
			existinguser.accountdata.logindata.push(getLoginData(req))
			existinguser.accountdata.apple.email = appleuseremail

			await setUser(existinguser)

			req.session.user = { userid: existinguser.userid }

			return res.redirect(301, '/app')
		}

		let loggedInUser = req.session.user && req.session.user.userid ? await getUserById(req.session.user.userid) : null
		if(loggedInUser && !loggedInUser.appleid){
			//add apple id to existing user
			loggedInUser.appleid = appleuserID
			loggedInUser.accountdata.apple.email = appleuseremail
			loggedInUser.accountdata.lastloggedindate = Date.now()
			existinguser.accountdata.logindata.push(getLoginData(req))

			await setUser(loggedInUser)

			return res.redirect(301, '/app')
		}

		//create new account
		if(true){
			const newuser = addmissingpropertiestouser(new User({ appleid: appleuserID }))
			newuser.accountdata.apple.email = appleuseremail
			newuser.accountdata.logindata.push(getLoginData(req))
			
			await createUser(newuser)

			if(!req.session.user){
				req.session.user = {}
			}
			req.session.user.userid = newuser.userid

			if(req.session.user?.inviteafriend?.invitecode){
				await validatereferafriendinvitecode(req)
			}

			await sendwelcomeemail(newuser)

			return res.redirect(301, '/app')
		}
	} catch (error) {
		console.error(error)
		res.redirect(301, '/login')
	}
})



//DISCORD BOT INITIALIZATION
const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, channelLink } = require('discord.js')

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const discordclient = new Client({ intents: [GatewayIntentBits.Guilds] })

discordclient.on('ready', async () => {
	console.log(`Logged in as ${discordclient.user.tag}.`)

	function setactivity(){
		let tempvalue = Object.values(reminderscache).filter(b=>b.filter(f => f.user.discordid != null).length > 0).flat().length
		discordclient.user.setActivity(`${tempvalue == 0 ? 'your' : tempvalue} reminders`, { type: ActivityType.Watching })
	}

	setactivity()
	setInterval(function(){
		setactivity()
	}, 5*60000)
})

discordclient.login(DISCORD_TOKEN)


//DISCORD LOGIN AUTHORIZATION
const DISCORD_ID = process.env.DISCORD_ID
const DISCORD_SECRET = process.env.DISCORD_SECRET
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID
const DISCORD_REDIRECT_URI = `${DOMAIN}/auth/discord/callback`

app.post('/auth/discord', async (req, res) => {
	const scopes = ['identify', 'guilds.join']
	
	const encodedscopes = encodeURIComponent(scopes.join(' '))
	const encodedredirecturi = encodeURIComponent(DISCORD_REDIRECT_URI)
	
	const authurl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_ID}&redirect_uri=${encodedredirecturi}&response_type=code&scope=${encodedscopes}`
	
	
	return res.json({ url: authurl })
})


async function getDiscordUserFromAccessToken(access_token) {
  const url = 'https://discord.com/api/v8/users/@me';

	try{
	  const response = await fetch(url, {
	    method: 'GET',
	    headers: {
	      'Authorization': `Bearer ${access_token}`
	    }
	  })
	
	  if (response.ok) {
	    const data = await response.json()
	    return data
	  } else {
	    return null
	  }
	}catch(err){
		console.error(err)
		return null
	}
}

async function getDiscordUserFromId(userid){
	try{
		let user = await discordclient.users.fetch(userid)
		return user
	}catch(error){
		console.error(error)
		return null
	}
}

async function sendDiscordMessageToId(userid, message){
	try{
		let user = await discordclient.users.fetch(userid)
		await user.send(message)
	}catch(error){
		console.error(error)
	}
}

async function sendDiscordMessageToUser(user, message){
	try{
		await user.send(message)
	}catch(error){
		console.error(error)
	}
}


app.get('/auth/discord/callback', async (req, res) => {
  	try {
		const code = req.query.code
		if (!code){
			throw new Error('Invalid code.')
		}
		
		const tokenData = new URLSearchParams({
			client_id: DISCORD_ID,
			client_secret: DISCORD_SECRET,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: DISCORD_REDIRECT_URI,
		})

		const response = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			body: tokenData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})

		const data = await response.json()
		const accessToken = data.access_token
		
		const userobject = await getDiscordUserFromAccessToken(accessToken)


		//update user data
		if(!req.session.user){
			throw new Error('User is not signed in.')
		}
		const userid = req.session.user.userid
		const user = await getUserById(userid)
		if(!user){
			throw new Error('User is not signed in.')
		}

		user.accountdata.discord.id = userobject.id
		
		if(!user.calendardata.discordreminderenabled){
			user.calendardata.discordreminderenabled = true
		}

		await setUser(user)

		
		//join server
		await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userobject.id}`, {
		  method: 'PUT',
		  headers: {
		    Authorization: `Bot ${DISCORD_TOKEN}`,
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    access_token: accessToken,
		  }),
		})

		
		//send message
		const embed = new EmbedBuilder()
			.setTitle(`Thanks for adding me, ${userobject.username}!`)
			.setDescription(`I'll send you a quick reminder here whenever you have an event or task coming up.\n\nIf you have any questions or comments, please let us know in [our server](https://discord.com/channels/${DISCORD_GUILD_ID}).`)
			.setColor(0x2693ff)
		await sendDiscordMessageToId(userobject.id, { embeds: [embed] } )

    	return res.redirect(301, '/app')
  	} catch (error) {
    	console.error(error)
    	return res.redirect(301, '/app')
  }
})




//REGULAR ROUTES

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'))
})

app.get('/home', (req, res) => {
  res.redirect(301, '/')
})

app.get('/login', async (req, res, next) => {
	const referrer = req.headers.referer
	if (referrer && referrer.endsWith('/app')) {
		next()
		return
	}

	if (req.session.user && req.session.user.userid) {
		res.redirect(301, '/app')
	} else{
		next()
	}
})

app.get('/invite/:code', async (req, res, next) => {
	const filepath = path.join(__dirname, 'public', 'html', 'invite.html')
	res.sendFile(filepath)
})

app.get('/blog/:page', (req, res, next) => {
	let page = req.params.page

	if(!page){
		const filepath = path.join(__dirname, 'public', 'blog')
		const htmlfilepath = path.join(__dirname, 'public', 'blog', 'html')
		
		if (fs.existsSync(htmlfilepath)) {
			res.sendFile(htmlfilepath)
		}else if(fs.existsSync(filepath)){
			res.sendFile(filepath)
		}else{
			next()
		}
	}else{
		const filepath = path.join(__dirname, 'public', 'blog', page)
		const htmlfilepath = path.join(__dirname, 'public', 'blog', 'html', `${page}.html`)
		
		if (fs.existsSync(htmlfilepath)) {
			res.sendFile(htmlfilepath)
		}else if(fs.existsSync(filepath)){
			res.sendFile(filepath)
		}else{
			next()
		}
	}
})
  

app.get('/:page', (req, res, next) => {
  let page = req.params.page
  
	const filepath = path.join(__dirname, 'public', page)
	const htmlfilepath = path.join(__dirname, 'public', 'html', `${page}.html`)
	
	if (fs.existsSync(htmlfilepath)) {
		res.sendFile(htmlfilepath)
	}else if(fs.existsSync(filepath)){
		res.sendFile(filepath)
	}else{
		next()
	}
})


app.get('*', (req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'public', 'html', 'error.html'))
})


//post routes
/*
app.post('/syncclientgooglecalendar', async(req, res, next) =>{
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		const userid = req.session.user.userid
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User does not exist.' })
		}

		if(!user.google_email){
			return res.status(401).json({ error: loginwithgooglecalendarhtml })
		}

		if(!req.session.tokens && !user.accountdata.refreshtoken) {
			return res.status(401).json({ error: loginwithgooglecalendarhtml })
		}

		if(!req.session.tokens || !req.session.tokens.access_token){
			let accesstoken = await getNewAccessToken(user.accountdata.refreshtoken)
			if(!accesstoken){
				return res.status(401).json({ error: loginwithgooglecalendarhtml })
			}
			req.session.tokens = req.session.tokens || {}
			req.session.tokens.access_token = accesstoken
		}
		if(!req.session.tokens.refresh_token){
			req.session.tokens.refresh_token = user.accountdata.refreshtoken
		}


		//google calendar
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		googleclient.setCredentials(req.session.tokens)
		const googlecalendar = await google.calendar({ version: 'v3', auth: googleclient })

		//download data
		const googlecalendarlist = await googlecalendar.calendarList.list()
		if(googlecalendarlist.status != 200){
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.'})
		}

		const currentdate = new Date()
		const timedifference = 30 * 86400000
		const timeMin = new Date(currentdate.getTime() - timedifference).toISOString()
		const timeMax = new Date(currentdate.getTime() + timedifference).toISOString()

		let googlecalendardata = []
		for (const calendaritem of googlecalendarlist.data.items) {
		  const calendarevents = await googlecalendar.events.list({
		    calendarId: calendaritem.id,
		    timeMin: timeMin,
				timeMax: timeMax,
		  })

			if(calendarevents.status != 200){
				return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
			}
			
			googlecalendardata.push({ calendar: calendaritem, events: calendarevents.data.items })
		}

		
		//SMART CALENDAR CHANGES
		let smartcalendar = req.body.calendar
		let timezoneoffset = req.body.timezoneoffset
		let timezonename = req.body.timezonename
		
		let syncgooglecalendarcreatedevents = smartcalendar.syncgooglecalendar.createdevents.filter(d => !smartcalendar.syncgooglecalendar.deletedevents.find(g => g.id == d.id))
		let syncgooglecalendareditedevents = smartcalendar.syncgooglecalendar.editedevents.filter(d => !smartcalendar.syncgooglecalendar.deletedevents.find(g => g.id == d.id) && !smartcalendar.syncgooglecalendar.createdevents.find(g => g.id == d.id))
		let syncgooglecalendardeletedevents = smartcalendar.syncgooglecalendar.deletedevents.filter(d => !smartcalendar.syncgooglecalendar.createdevents.find(g => g.id == d.id))

		let syncgooglecalendarcreatedcalendars = smartcalendar.syncgooglecalendar.createdcalendars.filter(d => !smartcalendar.syncgooglecalendar.deletedcalendars.find(g => g.id == d.id))
		let syncgooglecalendareditedcalendars = smartcalendar.syncgooglecalendar.editedcalendars.filter(d => !smartcalendar.syncgooglecalendar.deletedcalendars.find(g => g.id == d.id) && !smartcalendar.syncgooglecalendar.createdcalendars.find(g => g.id == d.id))
		let syncgooglecalendardeletedcalendars = smartcalendar.syncgooglecalendar.deletedcalendars.filter(d => !smartcalendar.syncgooglecalendar.createdcalendars.find(g => g.id == d.id))

		let timezoneoffsetstring = `${timezoneoffset < 0 ? '+' : '-'}${Math.floor(Math.abs(timezoneoffset) / 60).toString().padStart(2, '0')}:${(Math.abs(timezoneoffset) % 60).toString().padStart(2, '0')}`

		//set synced timestamp
		smartcalendar.lastsyncedgooglecalendardate = Date.now()

		//edit calendar
		for(let { id } of syncgooglecalendareditedcalendars){
			let item = smartcalendar.calendars.find(d => d.id == id)
			if(!item) continue

			let googlecalendaritem = googlecalendardata.find(d => d.calendar.id == item.id)
			if(!googlecalendaritem) continue
			
			let googleitem = googlecalendaritem.calendar
			if(!googleitem) continue
			
			//check for change
			if(item.title == googleitem.summary && item.notes == googleitem.description) continue

			googleitem.summary = item.title
			googleitem.description = item.notes
			
			try{
				const response = await googlecalendar.calendars.update({
					calendarId: googlecalendaritem.calendar.id,
					requestBody: googleitem
				})

				if(response.status != 200){
					throw new Error(response.data?.error?.message)
				}

				item.lastsyncedgooglecalendardate = smartcalendar.lastsyncedgooglecalendardate
			}catch(error){
				console.error(error)
			}

		}

		//create calendar
		for(let { id } of syncgooglecalendarcreatedcalendars){
			let item = smartcalendar.calendars.find(d => d.id == id)
			if(!item) continue

			try{
				const response = await googlecalendar.calendars.insert({
					requestBody: {
						summary: item.title.trim() || 'New Calendar',
						description: item.notes,
					},
				})

				if(response.status != 200){
					throw new Error(response.data?.error?.message)
				}
				
				item.id = response.data.id
				item.lastsyncedgooglecalendardate = smartcalendar.lastsyncedgooglecalendardate
			}catch(error){
				console.error(error)
			}
		}

		//delete calendar
		for(let { id } of syncgooglecalendardeletedcalendars){
			let googlecalendaritem = googlecalendardata.find(d => d.calendar.id == id)
			if(!googlecalendaritem) continue

			try{
				const response = await googlecalendar.calendars.delete({
					calendarId: googlecalendaritem.calendar.id,
				})
	
				if(response.status != 200){
					throw new Error(response.data?.error?.message)
				}
			}catch(error){
				console.error(error)
			}
		}


		//edit event
		for(let { id, oldcalendarid } of syncgooglecalendareditedevents){
			let item = smartcalendar.events.find(d => d.id == id)
			if(!item) continue

			let googlecalendaritem = googlecalendardata.find(d => (d.calendar.primary && oldcalendarid == null) || (d.calendar.id == oldcalendarid))
			if(!googlecalendaritem) continue
			
			let googleitem = googlecalendaritem.events.find(d => d.id == item.id)
			if(!googleitem) continue

			//check for change
			let googleitemstartdate = googleitem.start.dateTime ? new Date(googleitem.start.dateTime.substring(0, 19)) : new Date(googleitem.start.date)
			let itemstartdate = new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute)
			
			let googleitemenddate = googleitem.end.dateTime ? new Date(googleitem.end.dateTime.substring(0, 19)) : new Date(googleitem.end.date)
			let itemenddate = new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute)

			let { frequency, interval, byday, count, until } = getRecurrenceData(googleitem)

			if(item.title == googleitem.summary && item.notes == googleitem.description && googleitemstartdate.getTime() == itemstartdate.getTime() && googleitemenddate.getTime() == itemenddate.getTime() && item.calendarid == googlecalendaritem.calendar.id && item.repeat.frequency == frequency && item.repeat.interval == interval && isEqualArray(item.repeat.byday, byday) && item.repeat.count == count && item.repeat.until == until) continue

			googleitem.summary = item.title
			googleitem.description = item.notes
			googleitem.start = { dateTime: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename }
			googleitem.end = { dateTime: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename }
			googleitem.recurrence = item.repeat.frequency != null && item.repeat.interval != null ? [ getRecurrenceString(item) ] : []
			
			try{
				//edit event request
				const response = await googlecalendar.events.update({
					calendarId: googlecalendaritem.calendar.id,
					eventId: item.id,
					requestBody: googleitem
				})

				
				if(response.status != 200){
					throw new Error(response.data?.error?.message)
				}

				if(item.calendarid != googlecalendaritem.calendar.id){
					//move event request
					const response2 = await googlecalendar.events.move({
						calendarId: googlecalendaritem.calendar.id,
						eventId: item.id,
						destination: item.calendarid
					})
	
					if(response2.status != 200){
						throw new Error(response.data?.error?.message)
					}
				}

				item.lastsyncedgooglecalendardate = smartcalendar.lastsyncedgooglecalendardate
			}catch(error){
				console.error(error)
			}

		}

		//create event
		for(let { id } of syncgooglecalendarcreatedevents){
			let item = smartcalendar.events.find(d => d.id == id)
			if(!item) continue

			let googlecalendaritem = googlecalendardata.find(d => (d.calendar.primary && item.calendarid == null) || (d.calendar.id == item.calendarid))
			if(!googlecalendaritem) continue

			try{
				const response = await googlecalendar.events.insert({
					calendarId: googlecalendaritem.calendar.id,
					requestBody: {
						summary: item.title,
						description: item.notes,
						start: {
							dateTime: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().replace('Z', timezoneoffsetstring),
							timeZone: timezonename
						},
						end: {
							dateTime: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().replace('Z', timezoneoffsetstring),
							timeZone: timezonename
						},
						recurrence: item.repeat.frequency != null && item.repeat.interval != null ? [ getRecurrenceString(item) ] : []
					},
				})

				if(response.status != 200){
					throw new Error(response.data?.error?.message)
				}

				item.id = response.data.id
				item.calendarid = googlecalendaritem.calendar.id
				item.lastsyncedgooglecalendardate = smartcalendar.lastsyncedgooglecalendardate
			}catch(error){
				console.error(error)
			}
		}

		//delete event
		for(let { id, calendarid } of syncgooglecalendardeletedevents){
			let googlecalendaritem = googlecalendardata.find(d => (d.calendar.primary && calendarid == null) || (d.calendar.id == calendarid))
			if(!googlecalendaritem) continue
			
			let googleitem = googlecalendaritem.events.find(d => d.id == id)
			if(!googleitem) continue

			try{
				const response = await googlecalendar.events.delete({
					calendarId: googlecalendaritem.calendar.id,
					eventId: id,
				})
	
				if(response.status != 200){
					throw new Error(response.data?.error?.message)
				}
			}catch(error){
				console.error(error)
			}
		}



		//DOWNLOAD DATA
		
		const newgooglecalendarlist = await googlecalendar.calendarList.list()
		if(newgooglecalendarlist.status != 200){
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
		}

		let newgooglecalendardata = []
		for (const calendaritem of newgooglecalendarlist.data.items) {
		  const calendarevents = await googlecalendar.events.list({
		    calendarId: calendaritem.id,
		    timeMin: timeMin,
				timeMax: timeMax,
		  })

			if(calendarevents.status != 200){
				return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
			}
			
			newgooglecalendardata.push({ calendar: calendaritem, events: calendarevents.data.items })
		}

		
		
		return res.json({ data: newgooglecalendardata, calendar: smartcalendar })
	}catch(error){
		console.error(error)
	  return res.status(401).json({ error: loginwithgooglecalendarhtml })
	}
})
*/

const loginwithgoogleclassroomhtml = `<div class="border-8px nowrap width-fit display-flex flex-row gap-6px align-center googlebutton justify-center text-center text-14px padding-8px-16px pointer transition-duration-100" onclick="logingoogle({ scope: ['calendar', 'classroom'], enable: ['classroom'] })">
<img class="logopng" src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png">
Connect to Google Classroom
</div>`

const loginwithgooglecalendarhtml = `<div class="border-8px nowrap width-fit display-flex flex-row gap-6px align-center googlebutton justify-center text-center text-14px padding-8px-16px pointer transition-duration-100" onclick="logingoogle({ scope: ['calendar'], enable: ['calendar'] })">
<img class="logopng" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png">
Connect to Google Calendar
</div>`


app.post('/setclientgooglecalendar', async (req, res, next) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		const userid = req.session.user.userid
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User does not exist.' })
		}

		if(!user.google_email){
			return res.status(401).json({ error: loginwithgooglecalendarhtml })
		}

		if(!req.session.tokens && !user.accountdata.refreshtoken) {
			return res.status(401).json({ error: loginwithgooglecalendarhtml })
		}

		if(!req.session.tokens || !req.session.tokens.access_token){
			let accesstoken = await getNewAccessToken(user.accountdata.refreshtoken)
			if(!accesstoken){
				return res.status(401).json({ error: loginwithgooglecalendarhtml })
			}
			req.session.tokens = req.session.tokens || {}
			req.session.tokens.access_token = accesstoken
		}
		if(!req.session.tokens.refresh_token){
			req.session.tokens.refresh_token = user.accountdata.refreshtoken
		}


		//google calendar
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		googleclient.setCredentials(req.session.tokens)
		const googlecalendar = await google.calendar({ version: 'v3', auth: googleclient })


		//req body
		let requestchanges = req.body.requestchanges
		let timezoneoffset = req.body.timezoneoffset
		let timezonename = req.body.timezonename
		
		let timezoneoffsetstring = `${timezoneoffset < 0 ? '+' : '-'}${Math.floor(Math.abs(timezoneoffset) / 60).toString().padStart(2, '0')}:${(Math.abs(timezoneoffset) % 60).toString().padStart(2, '0')}`
		
		let responsechanges = []

		//requests
		function isAllDay(item) {
			return !item.start.minute && !item.end.minute
		}

		for(let requestchange of requestchanges){
			
			if(requestchange.type == 'editevent'){

				let item = requestchange.item
				
				try{
					let start, end;
					if(isAllDay(item)){
						start = { date: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().slice(0, 10), timeZone: timezonename, dateTime: null }
						end = { date:  new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().slice(0, 10), timeZone: timezonename, dateTime: null }
					}else{
						start = { dateTime: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename, date: null }
						end = { dateTime: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename, date: null }
					}

					const response = await googlecalendar.events.patch({
						calendarId: requestchange.oldgooglecalendarid || 'primary',
						eventId: item.googleeventid,
						requestBody: {
							summary: item.title,
							description: item.notes,
							start: start,
							end: end,
							recurrence: recurrence = item.type != 1 && item.repeat.frequency != null && item.repeat.interval != null ? [ getRecurrenceString(item) ] : []
						}
					})
					
					if(response.status != 200){
						throw new Error(response.data?.error?.message)
					}


					//move event to different calendar
					if(requestchange.newgooglecalendarid != requestchange.oldgooglecalendarid){
						const response2 = await googlecalendar.events.move({
							calendarId: requestchange.oldgooglecalendarid || 'primary',
							eventId: item.googleeventid,
							destination: requestchange.newgooglecalendarid || 'primary'
						})
		
						if(response2.status != 200){
							throw new Error(response.data?.error?.message)
						}

						responsechanges.push({ type: 'editevent', id: item.id, googlecalendarid: requestchange.newgooglecalendarid })
					}
				}catch(error){
					//console.error(error)
				}
				
			}else if(requestchange.type == 'createevent'){

				let item = requestchange.item

				try{
					let start, end;
					if(isAllDay(item)){
						start = { date: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().slice(0, 10), timeZone: timezonename, dateTime: null }
						end = { date:  new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().slice(0, 10), timeZone: timezonename, dateTime: null }
					}else{
						start = { dateTime: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename, date: null }
						end = { dateTime: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename, date: null }
					}

					const response = await googlecalendar.events.insert({
						calendarId: item.googlecalendarid || 'primary',
						requestBody: {
							summary: item.title,
							description: item.notes,
							start: start,
							end: end,
							recurrence: item.type != 1 && item.repeat.frequency != null && item.repeat.interval != null ? [ getRecurrenceString(item) ] : []
						},
					})
	
					if(response.status != 200){
						throw new Error(response.data?.error?.message)
					}

					responsechanges.push({ type: 'createevent', id: item.id, googleeventid: response.data.id })
				}catch(error){
					//console.error(error)
				}
				
			}else if(requestchange.type == 'deleteevent'){

				try{
					const response = await googlecalendar.events.delete({
						calendarId: requestchange.googlecalendarid || 'primary',
						eventId: requestchange.googleeventid,
					})
		
					if(response.status != 200){
						throw new Error(response.data?.error?.message)
					}
				}catch(error){
					//console.error(error)
				}
					
			}else if(requestchange.type == 'editcalendar'){

				let item = requestchange.item
	
				try{
					const response = await googlecalendar.calendars.patch({
						calendarId: item.googleid,
						requestBody: {
							summary: item.title.trim() || 'New Calendar',
							description: item.notes
						}
					})
	
					if(response.status != 200){
						throw new Error(response.data?.error?.message)
					}
				}catch(error){
					//console.error(error)
				}
					
			}else if(requestchange.type == 'createcalendar'){

				let item = requestchange.item
	
				try{
					const response = await googlecalendar.calendars.insert({
						requestBody: {
							summary: item.title.trim() || 'New Calendar',
							description: item.notes,
						},
					})
	
					if(response.status != 200){
						throw new Error(response.data?.error?.message)
					}
					
					responsechanges.push({ type: 'createcalendar', id: item.id, googleid: response.data.id })
				}catch(error){
					//console.error(error)
				}
				
			}else if(requestchange.type == 'deletecalendar'){

				try{
					const response = await googlecalendar.calendars.delete({
						calendarId: requestchange.googleid,
					})
		
					if(response.status != 200){
						throw new Error(response.data?.error?.message)
					}
				}catch(error){
					//console.error(error)
				}
				
			}
			
		}

		return res.json({ data: responsechanges })
	}catch(error){
		console.error(error)
	  return res.status(401).json({ error: loginwithgooglecalendarhtml })
	}
})


app.post('/getclientgooglecalendar', async (req, res, next) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		const userid = req.session.user.userid
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User does not exist.' })
		}

		if(!user.google_email){
			return res.status(401).json({ error: loginwithgooglecalendarhtml })
		}

		if(!req.session.tokens && !user.accountdata.refreshtoken) {
			return res.status(401).json({ error: loginwithgooglecalendarhtml })
		}

		if(!req.session.tokens || !req.session.tokens.access_token){
			let accesstoken = await getNewAccessToken(user.accountdata.refreshtoken)
			if(!accesstoken){
				return res.status(401).json({ error: loginwithgooglecalendarhtml })
			}
			req.session.tokens = req.session.tokens || {}
			req.session.tokens.access_token = accesstoken
		}
		if(!req.session.tokens.refresh_token){
			req.session.tokens.refresh_token = user.accountdata.refreshtoken
		}


		//google calendar
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		googleclient.setCredentials(req.session.tokens)
		const googlecalendar = await google.calendar({ version: 'v3', auth: googleclient })

		//download data
		const googlecalendarlist = await googlecalendar.calendarList.list()
		if(googlecalendarlist.status != 200){
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.'})
		}

		const currentdate = new Date()
		const timedifference = 30 * 86400000
		const timeMin = new Date(currentdate.getTime() - timedifference).toISOString()
		const timeMax = new Date(currentdate.getTime() + timedifference).toISOString()

		let googlecalendardata = []
		for (const calendaritem of googlecalendarlist.data.items) {
		  const calendarevents = await googlecalendar.events.list({
		    calendarId: calendaritem.id,
		    timeMin: timeMin,
				timeMax: timeMax,
				maxResults:2500
		  })

			if(calendarevents.status != 200){
				return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
			}
			
			googlecalendardata.push({ calendar: calendaritem, events: calendarevents.data.items })
		}
		
		return res.json({ data: googlecalendardata })
	}catch(error){
		console.error(error)
		return res.status(401).json({ error: loginwithgooglecalendarhtml })
	}
})



app.post('/disconnectdiscord', async (req, res, next) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		let userid = req.session.user.userid
		
		const user = await getUserById(userid)

		user.accountdata.discord.id = null
		await setUser(user)
	
		return res.end()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

app.post('/getdiscordusername', async (req, res, next) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		let discordid = req.body.id

		let username;
		if(discordid){
			let fetcheduser = await getDiscordUserFromId(discordid)
			if(fetcheduser){
				username = fetcheduser.username
			}
		}
	
		return res.json({ data: username })
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})



app.post('/disconnectgoogle', async (req, res, next) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		let userid = req.session.user.userid
		
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User does not exist.' })
		}

		//if apple, ok
		//if username and pass, ok
		//if existing user with username being google email, not ok

		if(user.appleid){

		}else{
			if(!user.password){
				return res.status(401).json({ error: 'You need to set a password before disconnecting.' })
			}

			if(user.google_email){
				let existinguser = await getUserByUsername(user.google_email)
				if(existinguser && existinguser.userid != user.userid){
					return res.status(401).json({ error: 'You cannot disconnect your Google account because the email is taken as a username.' })
				}
	
				user.username = user.google_email
			}
		}
		
		delete req.session.tokens
		
		delete user.google_email
		delete user.googleid
		user.calendardata.settings.issyncingtogooglecalendar = false
		user.calendardata.settings.issyncingtogoogleclassroom = false
		await setUser(user)
	
		return res.end()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/disconnectapple', async (req, res, next) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		let userid = req.session.user.userid
		
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User does not exist.' })
		}

		//if username and pass, ok
		//if google email, ok

		if((!user.username || !user.password) && !user.google_email){
			return res.status(401).json({ error: 'You need to add another login method (email + password or Google) before disconnecting, so you can log in later.' })
		}
				
		delete user.appleid
		await setUser(user)
	
		return res.end()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getclientgoogleclassroom', async (req, res, next) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		const userid = req.session.user.userid
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User does not exist.' })
		}

		if(!user.google_email){
			return res.status(401).json({ error: loginwithgoogleclassroomhtml })
		}

		if(!req.session.tokens && !user.accountdata.refreshtoken) {
			return res.status(401).json({ error: loginwithgoogleclassroomhtml })
		}

		if(!req.session.tokens || !req.session.tokens.access_token){
			let accesstoken = await getNewAccessToken(user.accountdata.refreshtoken)
			if(!accesstoken){
				return res.status(401).json({ error: loginwithgoogleclassroomhtml })
			}
			req.session.tokens = req.session.tokens || {}
			req.session.tokens.access_token = accesstoken
		}
		if(!req.session.tokens.refresh_token){
			req.session.tokens.refresh_token = user.accountdata.refreshtoken
		}


		//google calendar
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		googleclient.setCredentials(req.session.tokens)

		const classroom = google.classroom({ version: 'v1', auth: googleclient })


		let userToDos = []

		try {
			const courseRes = await classroom.courses.list();
			const courses = courseRes.data.courses || [];

			for (const course of courses) {
				const courseId = course.id;
				const courseworkRes = await classroom.courses.courseWork.list({ courseId });
				const courseWorkItems = courseworkRes.data.courseWork || [];
				
				const toDos = courseWorkItems.filter(item => item.workType === 'ASSIGNMENT')
				userToDos = [...userToDos, ...toDos.map(todo => ({ courseId, ...todo }))]
			}
		} catch (error) {
			return res.status(401).json({ error: loginwithgoogleclassroomhtml })
		}

		return res.json({ data: userToDos })

	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: loginwithgoogleclassroomhtml })
	}
})


app.post('/login', async (req, res, next) => {
	try {
		const form = new formidable.IncomingForm()

		const fields = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields) => {
				if (err) {
					reject(err)
				} else {
					resolve(fields)
				}
			})
		})
		let username = fields.username
		let password = fields.password
		
		if(!username){
			return res.status(401).json({ error: 'Email or password are incorrect.' })
		}

		const user = await getUserByAttribute(username)
		if(!user){
			return res.status(401).json({ error: 'Email or password are incorrect.' })
		}

		if(!user.password){
			return res.status(401).json({ error: 'Use log in with Google.' })
		}
		
		if(password !== user.password){
			return res.status(401).json({ error: 'Email or password are incorrect.' })
		}
		
		req.session.user = { userid: user.userid }
		user.accountdata.lastloggedindate = Date.now()
		user.accountdata.logindata.push(getLoginData(req))

		await setUser(user)
		return res.redirect(301, '/app')
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

app.post('/signup', async (req, res, next) => {
	const form = new formidable.IncomingForm()
	try {
		const fields = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields) => {
				if (err) {
					reject(err)
				} else {
					resolve(fields)
				}
			})
		})
		let username = fields.username
		let password = fields.password
		let confirmpassword = fields.confirmpassword

		if(password.length < 6){
			return res.status(401).json({ error: 'Password is too short, must be 6+ letters.' })
		}
		
		if(password !== confirmpassword){
			return res.status(401).json({ error: 'Passwords do not match.' })
		}
	

		const olduser = await getUserByAttribute(username)
		if(olduser){
			return res.status(401).json({ error: 'Email is already taken.' })
		}
		
		const user = addmissingpropertiestouser(new User({ username: username, password: password}))
		user.accountdata.logindata.push(getLoginData(req))
		await createUser(user)

		if(!req.session.user){
			req.session.user = {}
		}
		req.session.user.userid = user.userid

		if(req.session.user?.inviteafriend?.invitecode){
			await validatereferafriendinvitecode(req)
		}

		await sendwelcomeemail(user)

		return res.redirect(301, '/app')
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

function getUserEmail(user){
	return user.google_email || user.accountdata.apple?.email || user.username
}

function getUserName(user){
	return (user.accountdata.google?.firstname || user.accountdata.google?.name || user.google_email?.split('@')[0]) || user.accountdata.apple?.email?.split('@')[0] || user?.username?.split('@')[0]
}

async function sendwelcomeemail(user){
	let email = getUserEmail(user)
	let name = getUserName(user)

	if(isEmail(email)){
		await sendRawEmail({
			from: 'Smart Calendar <welcome@smartcalendar.us>',
			to: email,
			subject: `Welcome to Smart Calendar!`,
			htmlbody: `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Your Newfound Productivity Starts Now With Smart Calendar</title>
		<style>
				@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap');
		</style>
	</head>
	<body style="background-color: #f4f4f4; font-family: 'Wix Madefor Text', Arial, sans-serif;">
		<div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 6px;">
				<img src="https://smartcalendar.us/logo.png" style="display: block; margin: auto; height: 150px; width: auto;" alt="Smart Calendar Logo" />
				<p style="text-align: center; font-size: 24px; color: #333; margin-top: 20px;">
						Greetings ${name},
				</p>
				<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
				<p style="font-size: 18px; color: #333;">
						You are now a part of a group of hundreds of people who use Smart Calendar to find productivity and peace in life. That's special!
				</p>
				<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
				<p style="font-size: 18px; color: #333;">
						We know you're excited to explore Smart Calendar. If you have any questions or have feedback, please <a href="https://smartcalendar.us/contact" style="color: #2693ff; text-decoration: none;"></a>. We're here for you.
				</p>
				<p style="text-align: center;font-size: 18px; color: #333;">
					<a href="https://smartcalendar.us/app" style="padding:8px 16px;background-color:#2693ff;color: #ffffff !important; text-decoration: none;border-radius:999px"><span style="color: #ffffff">Open the app</span></a>
				</p>
				<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
				<p style="text-align: center; font-size: 18px; color: #333;">
						Stay Productive,<br>
						Smart Calendar | Where AI Meets Agenda
				</p>

		<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
				<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
					<p>You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may <a href="https://smartcalendar.us/app?to=unsubscribe&userid=${user.userid}" style="color: #2693ff; text-decoration: none;">unsubscribe</a>.</p>
				<p>&copy; 2024 James Tsaggaris. All rights reserved.</p>
				</div>

		</div>
	</body>
	</html>`,
			textbody: `Hello ${name},

	You are now a part of a group of hundreds people who use Smart Calendar to find productivity and peace in life. That's special!

	We know you're excited to explore Smart Calendar. If you have any questions or have feedback, please <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a> at https://smartcalendar.us/contact. We're here for you.

	Stay Productive,
	Smart Calendar | Where AI Meets Agenda

	You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may unsubscribe at https://smartcalendar.us/app?to=unsubscribe&userid=${user.userid}.
	(c) 2024 James Tsaggaris. All rights reserved.`
		})
	}
}


app.post('/changepassword', async (req, res, next) => {
	const form = new formidable.IncomingForm()
	try {
		const fields = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields) => {
				if (err) {
					reject(err)
				} else {
					resolve(fields)
				}
			})
		})
		let currentpassword = fields.currentpassword
		let newpassword = fields.newpassword
		let confirmnewpassword = fields.confirmnewpassword

		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		if(newpassword !== confirmnewpassword){
			return res.status(401).json({ error: 'Passwords do not match.' })
		}
		
		if(newpassword.length < 6){
			return res.status(401).json({ error: 'Password is too short, must be 6+ letters.' })
		}
		
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		if(currentpassword !== user.password){
			return res.status(401).json({ error: 'Incorrect password.' })
		}
		
		user.password = newpassword
		await setUser(user)
		return res.end()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

app.post('/setpassword', async (req, res, next) => {
	const form = new formidable.IncomingForm()
	try {
		const fields = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields) => {
				if (err) {
					reject(err)
				} else {
					resolve(fields)
				}
			})
		})
		let newpassword = fields.newpassword
		let confirmnewpassword = fields.confirmnewpassword

		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		if(newpassword !== confirmnewpassword){
			return res.status(401).json({ error: 'Passwords do not match.' })
		}
		
		if(newpassword.length < 6){
			return res.status(401).json({ error: 'Password is too short, must be 6+ letters.' })
		}
		
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		user.password = newpassword
		await setUser(user)
		return res.end()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

app.post('/deleteaccount', async (req, res, next) => {
	const form = new formidable.IncomingForm()
	try {
		const fields = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields) => {
				if (err) {
					reject(err)
				} else {
					resolve(fields)
				}
			})
		})
		let password = fields.password

		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		if(!user.password){
			return res.status(401).json({ error: 'You need to set a password before deleting your account.' })
		}

		if(password != user.password){
			return res.status(401).json({ error: 'Incorrect password.' })
		}

		await deleteUser(user.userid)

		req.session.destroy((err) => {
			if(err) {
				console.error(err)
			}
		})

		return res.redirect(301, '/')
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

app.post('/changeusername', async (req, res, next) => {
	const form = new formidable.IncomingForm()
	try {
		const fields = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields) => {
				if (err) {
					reject(err)
				} else {
					resolve(fields)
				}
			})
		})
		let currentpassword = fields.currentpassword
		let newusername = fields.newusername

		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		let userid = req.session.user.userid
		
		const user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		if(user.google_email){
			return res.status(401).json({ error: `You need to disconnect your Google account before changing your email.` })
		}
		if(!user.password){
			return res.status(401).json({ error: 'You need to set a password before changing your email.' })
		}

		if(user.password != currentpassword){
			return res.status(401).json({ error: 'Incorrect password.' })
		}

		const existinguser = await getUserByAttribute(newusername)
		if(existinguser){
			return res.status(401).json({ error: 'Email is already taken.' })
		}
		
		user.username = newusername
		await setUser(user)
		return res.end()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getclientinfo', async (req, res, next) => {
	try {
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		let userid = req.session.user.userid
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		//timezone
		user.accountdata.timezoneoffset = req.body.timezoneoffset
		cacheReminders(user)

		//premium
		checkreferafriendpremium(user)

		await setUser(user)
		
		return res.json({ data: { username: user.username, password: user.password != null, google_email: user.google_email, google: user.accountdata.google, discord: user.accountdata.discord, apple: user.accountdata.apple, appleid: user.appleid != null, createddate: user.accountdata.createddate, iosdevicetoken: user.accountdata.iosdevicetoken != null, betatester: user.accountdata.betatester, referafriend: user.accountdata.referafriend, haspremium: user.accountdata.haspremium, premiumendtimestamp: user.accountdata.premium.endtimestamp } })
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getclientdata', async (req, res, next) => {
	try {
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let lastmodified = req.body.lastmodified
		if(lastmodified != null){
			if(lastmodified < user.calendardata.lastmodified){
				return res.json({ data: user.calendardata })
			}else{
				return res.json({ nochange: true })
			}
		}else{
			return res.json({ data: user.calendardata })
		}
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

app.post('/setclientdata', async (req, res, next) => {
	try {
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let newcalendardata = req.body.calendardata
		user.calendardata = newcalendardata
		cacheReminders(user)
		await setUser(user)

		return res.end()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/sendcontactus', async (req, res, next) => {
	try {
		const content = req.body.content
		const email = req.body.email
		const userid = req.session?.user?.userid

		const message = new ContactUsObject({ email: email, userid: userid, content: content })
		
		try{
			await savecontactusobject(message)
		}catch(error){
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
		}

		return res.end()
	}catch(error){
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

app.post('/sendfeedback', async (req, res, next) => {
	try {
		const content = req.body?.content
		const userid = req.session?.user?.userid
		const loggedoutuserid = req.body?.loggedoutuserid

		const message = new FeedbackObject({ userid: userid || loggedoutuserid, content: content })
		
		try{
			await savefeedbackobject(message)
		}catch(error){
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
		}

		return res.end()
	}catch(error){
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/logout', async (req, res, next) => {
	req.session.destroy((err) => {
		if(err) {
			console.error(err)
		}
    return res.redirect(301, '/login')
	})
})


app.post('/dev', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}
		if(user.google_email != 'james.tsaggaris@gmail.com'){
			return res.status(401).json({ error: 'Unathorized.' })
		}


		//functions
		async function addbetatester(tempvalue){
			let tempuser = await getUserById(tempvalue)
			tempuser.accountdata.betatester = true
			if(!tempuser){
				tempuser = await getUserByAttribute(tempvalue)
				if(!tempuser) return false
			}
			await setUser(tempuser)
			return true
		}

		async function getuserinfo(tempvalue){
			function charstosize(chars) {
				let bytes = chars.length
				if (bytes < 1024) return bytes + " bytes"
				else if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(0) + " KB"
				else if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(0) + " MB"
				return (bytes / 1024 ** 3).toFixed(0) + " GB"
			}

			function getlocaldate(date){
				return new Date(date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour12: true })
			}

			let tempuser = await getUserById(tempvalue)

			if(!tempuser){
				tempuser = await getUserByAttribute(tempvalue)
				if(!tempuser) return false
			}
			
			return `User ID: ${tempuser.userid}\nUsername: ${tempuser.username || ''}\nGoogle email: ${tempuser.google_email || ''}\nApple ID: ${tempuser.appleid || ''}\nCreated date: ${getlocaldate(tempuser.accountdata.createddate)} (UTC)\nLast logged in date: ${getlocaldate(tempuser.accountdata.lastloggedindate)} (UTC)\n\nAccount data size: ${charstosize(JSON.stringify(user))}\nCalendar data size: ${charstosize(JSON.stringify(tempuser.calendardata))}\n\nEvents: ${tempuser.calendardata.events.length}\nTasks: ${tempuser.calendardata.todos.length}\nFixed events: ${tempuser.calendardata.events.filter(d => d.type == 0).length}\nFlexible events: ${tempuser.calendardata.events.filter(d => d.type == 1).length}\n\n\nGPT chat uses: ${tempuser.accountdata.gptchatusedtimestamps.length}`
		}

		async function getdiscorduserid(tempdiscordid){
			for(let [key, value] of Object.entries(reminderscache)){if(value[0]?.user?.discordid == tempdiscordid){return JSON.stringify(key)}}
			return false
		}

		async function getreferafriendpending(){
			function getlocaldate(date){
				return new Date(date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour12: true })
			}

			let allitems = []
			try {
				let ExclusiveStartKey;
				do {
					const command = new ScanCommand({
						TableName: 'smartcalendarreferafriendinvitelinks',
						ExclusiveStartKey
					})
		
					const response = await dynamoclient.send(command)
					const items = response.Items.map(item => unmarshall(item))	
					
					allitems.push(...items)
					ExclusiveStartKey = response.LastEvaluatedKey
				} while (ExclusiveStartKey)
			} catch (error) {
				console.error(error)
			}

			return allitems.length > 0 && allitems.find(d => d.pending.length > 0) ? allitems.filter(d => d.pending.length > 0).map(d => `Invite code: ${d.invitelink}\nInvite user ID: ${d.userid}\nInvite date: ${getlocaldate(d.logindata?.timestamp)}\nInvite IP: ${d.logindata?.ip}\nInvite user agent: ${d.logindata?.useragent}\nInvite IOS app: ${d.logindata?.iosapp}\nInvite Hotjar ID: ${d.logindata?.hotjarid}\n\nAccepted: ${d.accepted?.length}\nRejected: ${d.rejected?.length}\n\n\nPending:\n\n${d.pending?.map(f => `User ID: ${f.userid}\nDate: ${getlocaldate(f.logindata?.timestamp)}\nIP: ${f.logindata?.ip}\nUser agent: ${f.logindata?.useragent}\nIOS app: ${f.logindata?.iosapp}\nHotjar ID: ${f.logindata?.hotjarid}\nTo accept: <span class="inlinecode">await acceptreferafriendinvitecode('${d.invitelink}', '${f.userid}')</span>\nTo reject: <span class="inlinecode">await rejectreferafriendinvitecode('${d.invitelink}', '${f.userid}')</span>\nTo whitelist: <span class="inlinecode">await setwhitelistreferafriendinvitecode('${d.invitelink}', true)</span>`).join('\n\n')}`).join('\n\n\n') : 'None'
		}
		
		async function getstats(){
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

			
			function charsToSize(chars) {
				let bytes = chars;
				if (bytes < 1024) return bytes + " bytes";
				else if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(0) + " KB";
				else if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(0) + " MB";
				return (bytes / 1024 ** 3).toFixed(0) + " GB";
			}

			const memoryUsage = process.memoryUsage();

			let stats = [];
			stats.push('Server Stats:\n');
			stats.push(`Node.js Version: ${process.version}`);
			stats.push(`Process ID: ${process.pid}`);
			stats.push(`Platform: ${process.platform}`);
			stats.push(`Architecture: ${process.arch}`);
			stats.push(`Execution Path: ${process.execPath}`);
			stats.push(`Memory Usage:`);
			stats.push(`- RSS: ${charsToSize(memoryUsage.rss)}`);
			stats.push(`- Heap Total: ${charsToSize(memoryUsage.heapTotal)}`);
			stats.push(`- Heap Used: ${charsToSize(memoryUsage.heapUsed)}`);
			stats.push(`- External: ${charsToSize(memoryUsage.external)}`);
			stats.push(`- Array Buffers: ${charsToSize(memoryUsage.arrayBuffers)}`);
			stats.push(`Uptime: ${getDHMText(Math.floor(process.uptime()/60))}`);
			return stats.join('\n');
		}

		async function help(){
			return `<span class="inlinecode">addbetatester(userid or email)</span>\n\n<span class="inlinecode">getuserinfo(userid or email)</span>\n<span class="inlinecode">getdiscorduserid(discordid)</span>\n\n<span class="inlinecode">getreferafriendpending()</span>\n<span class="inlinecode">acceptreferafriendinvitecode(invitecode, userid)</span>\n<span class="inlinecode">rejectreferafriendinvitecode(invitecode, userid)</span>\n<span class="inlinecode">whitelistreferafriendinvitecode(invitecode)</span>\n\n<span class="inlinecode">getstats()</span>\n\n<span class="inlinecode">displaychat(conversationid)</span>\n<span class="inlinecode">flagchat(conversationid)</span>\n\n<span class="inlinecode">displayfeedback(id)</span>\n<span class="inlinecode">flagfeedback(id)</span>`
		}

		async function displaychat(conversationid){
			let tempdata = await getchatconversation(conversationid)
			if(!tempdata) return 'Not found'
			
			let tempoutput = []
			for(let item of tempdata.chatconversation.flat()){
				tempoutput.push(`${item.role == 'assistant' ? 'Athena' : 'User'}: ${item.message} ${item.liked ? '(LIKED)' : ''} ${item.disliked ? '(DISLIKED)' : ''}`)
			}

			tempdata.read = true
			await setchatconversation(tempdata)

			function getlocaldate(date){
				return new Date(date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour12: true })
			}

			return `Chat ID: ${conversationid}\nUser ID: ${tempdata.userid}\nTime: ${getlocaldate(tempdata.timestamp)}\n\n`+tempoutput.join('\n\n')
		}

		async function flagchat(conversationid){
			let tempdata = await getchatconversation(conversationid)
			tempdata.flagged = true
			await setchatconversation(tempdata)

			return 'Done'
		}

		async function displayfeedback(feedbackid){
			function getlocaldate(date){
				return new Date(date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour12: true })
			}

			let tempdata = await getfeedback(feedbackid)
			if(!tempdata) return 'Not found'
			
			tempdata.read = true
			await setfeedback(tempdata)

			return `Feedback ID: ${feedbackid}\nUser ID: ${tempdata.userid}\nTime: ${getlocaldate(tempdata.timestamp)}\n\n${typeof tempdata.content === 'string' ? tempdata.content : JSON.stringify(tempdata.content)}`
		}

		async function flagfeedback(feedbackid){
			let tempdata = await getfeedback(feedbackid)
			tempdata.flagged = true
			await setfeedback(tempdata)

			return 'Done'
		}
		

		//eval
		let input = req.body.input
		if(input.split('\n').length == 1){
			input = `return ${input}`
		}

		let errordata, output;
		try{
			output = await eval(`(async () => {${input}})()`)
		}catch(err){
			errordata = err.stack
		}

		return res.json({ error: errordata, output: output })
	}catch(err){
		console.error(err)
	}
})


app.post('/subscribecalendar', async (req, res) => {
	function isurl(url) {
  	const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
	  return pattern.test(url)
	}
		
  	const url = req.body.url
	if(!isurl(url)) return res.status(401).end()
	
	try{
		//import fetch
		const fetch = (await import('node-fetch')).default
		
 	 	const response = await fetch(url)
		if(response.status == 200){
			const text = await response.text()
			return res.json({ data: text })
		}else{
			return res.status(401).end()
		}
	}catch(error){
		console.error(error)
		return res.status(401).end()
	}
})


app.post('/sendinviteemailreferafriend', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}


		let inviteemail = req.body.inviteemail
		let invitecode = req.body.invitecode

		if(!invitecode){
			return res.status(401).json({ error: 'Invite link not found.' })
		}

		invitecode = invitecode.toLowerCase()

		let existinginviteobject = await getreferafriendinvitelinkobject(invitecode)
		if(!existinginviteobject){
			return res.status(401).json({ error: 'Invite link not found.' })
		}

		let inviteuser = await getUserById(existinginviteobject.userid)
		if(!inviteuser){
			return res.status(401).json({ error: 'Invite link not valid. The user who made this invite link no longer exists.' })
		}
		

		if(!isEmail(inviteemail)){
			return res.status(401).json({ error: 'Please enter a valid email.' })
		}


		let response = await sendRawEmail({
			from: 'Smart Calendar <reminders@smartcalendar.us>',
			to: inviteemail,
			subject: `${getUserName(inviteuser)} invited you to Smart Calendar`,
			htmlbody: `
			<!DOCTYPE html>
			<html>
			<head>
					<title>Smart Calendar | Invitation to Sign Up</title>
					<style>
							@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap');

					</style>
			</head>
			<body style="background-color: #f4f4f4; font-family: 'Wix Madefor Text', Arial, sans-serif;">
					<div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 6px;">
							<img src="https://smartcalendar.us/logo.png" style="display: block; margin: auto; height: 150px; width: auto;" alt="Smart Calendar Logo" />
							<p style="text-align: center; font-size: 24px; color: #333; margin-top: 20px;">
									Hey!
							</p>
							<p style="font-size: 18px; color: #333;text-align:center;">
								${getUserName(inviteuser)} invited you to sign up for Smart Calendar.
							</p>
							<p style="text-align: center;font-size: 16px; color: #333;padding:12px;">
								Not sure what we are? We're a productivity app that uses AI to build your schedule, manage your tasks, and more. And, we've developed a super cool AI assistant that you can even talk to (we're so excited and we think you will love it)!
							</p>

							<p style="text-align: center;font-size: 14px; color: #333;padding:12px;">
								<a href="https://smartcalendar.us/invite/${invitecode.toUpperCase()}" style="font-size:18px;padding:8px 16px;background-color:#13b03b;color: #ffffff !important; text-decoration: none;border-radius:999px"><span style="color: #ffffff">Accept invite</span></a>
							</p>

							<p style="text-align: center;font-size: 16px; color: #333;padding:12px;">
								By signing up, you'll also help your friend get closer to 1 month of free Premium. Let's give it a try!
							</p>

							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<p style="text-align: center; font-size: 18px; color: #333;">
									Stay Productive,<br>
									Smart Calendar | Where AI Meets Agenda
							</p>

					<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
							<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
								<p>You are receiving this email because a Smart Calendar user sent you an invitation. If you wish to stop receiving these notifications, you may <a href="https://smartcalendar.us/app?to=unsubscribe" style="color: #2693ff; text-decoration: none;">unsubscribe</a>.</p>
							<p>&copy; 2024 James Tsaggaris. All rights reserved.</p>
							</div>

					</div>
			</body>
			</html>`,
			textbody: `Hey!
			${getUserName(inviteuser)} invited you to sign up for Smart Calendar.

			Not sure what we are? We're a productivity app that uses AI to build your schedule, manage your tasks, and more. And, we've developed a super cool AI assistant that you can even talk to (we're so excited and we think you will love it)!

			Accept invite: https://smartcalendar.us/invite/${invitecode.toUpperCase()}.

			By signing up, you'll also help your friend get closer to 1 month of free Premium. Let's give it a try!

			Stay Productive,
			Smart Calendar | Where AI Meets Agenda

			You are receiving this email because you signed up with Smart Calendar. If you wish to stop receiving these notifications, you may unsubscribe at https://smartcalendar.us/app?to=unsubscribe.
			(c) 2024 James Tsaggaris. All rights reserved.`
		})


		if(!response || response?.$metadata?.httpStatusCode != 200){
			return res.status(401).json({ error: `Could not send an email to ${inviteemail}, please enter a valid email or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.` })
		}

		existinginviteobject.emailinvited.push({ email: inviteemail, timestamp: Date.now() })
		await setreferafriendinvitelinkobject(existinginviteobject)

		return res.end()
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})



app.post('/submitreferafriendinvitelink', async (req, res) => {
	try{
		let invitecode = req.body.invitecode

		if(!invitecode){
			return res.status(401).json({ error: 'Invite link not found!' })
		}

		invitecode = invitecode.toLowerCase()

		let existinginviteobject = await getreferafriendinvitelinkobject(invitecode)
		if(!existinginviteobject){
			return res.status(401).json({ error: 'Invite link not found!' })
		}

		let inviteuser = await getUserById(existinginviteobject.userid)
		if(!inviteuser){
			return res.status(401).json({ error: 'Invite link not valid. The user who made this invite link no longer exists.' })
		}

		//set req session
		if(!req.session.user){
			req.session.user = {}
		}
		req.session.user.inviteafriend = { invitecode: invitecode, timestamp: Date.now() }

		return res.json({ data: { name: getUserName(inviteuser), googleprofilepicture: inviteuser.accountdata.google.profilepicture } })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


//validate when sign up
async function validatereferafriendinvitecode(req){
	if(!req.session?.user?.userid) return false

	let referafriendinvitecode = req.session.user?.inviteafriend?.invitecode
	let timestamp = req.session.user?.inviteafriend?.timestamp

	if(Date.now() - timestamp > 60 * 60 * 1000) return false

	if(!referafriendinvitecode) return false

	referafriendinvitecode = referafriendinvitecode.toLowerCase()

	//get invite db object
	let existinginviteobject = await getreferafriendinvitelinkobject(referafriendinvitecode)
	if(!existinginviteobject) return false

	if(existinginviteobject.whitelisted == true){
		//return if already in accepted
		if(existinginviteobject.accepted.find(d => d.userid == req.session.user.userid)) return false

		//save invite db object accepted
		existinginviteobject.accepted.push({ userid: req.session.user.userid, logindata: getLoginData(req) })
		await setreferafriendinvitelinkobject(existinginviteobject)
	}else{
		//return if already in pending
		if(existinginviteobject.pending.find(d => d.userid == req.session.user.userid)) return false

		//save invite db object pending
		existinginviteobject.pending.push({ userid: req.session.user.userid, logindata: getLoginData(req) })
		await setreferafriendinvitelinkobject(existinginviteobject)
	}

	//get inviter
	let inviteuser = await getUserById(existinginviteobject.userid)
	if(!inviteuser) return false

	//save inviter object
	inviteuser.accountdata.referafriend.acceptedcount = existinginviteobject.accepted.length
	checkreferafriendpremium(inviteuser)
	await setUser(inviteuser)

	return true
}

function checkreferafriendpremium(user){
	if(user.accountdata.referafriend.acceptedcount >= 10){
		if(user.accountdata.premium.referafriendclaimvalue < 3){
			user.accountdata.premium.referafriendclaimvalue = 3

			if(!user.accountdata.premium.endtimestamp || user.accountdata.premium.starttimestamp || user.accountdata.premium.endtimestamp < Date.now()){
				//start new
				user.accountdata.premium.starttimestamp = Date.now()
				user.accountdata.premium.endtimestamp = Date.now() + 86400*1000*180 //6 months
			}else{
				//continue
				user.accountdata.premium.endtimestamp = user.accountdata.premium.endtimestamp + 86400*1000*180
			}
		}
	}else if(user.accountdata.referafriend.acceptedcount >= 5){
		if(user.accountdata.premium.referafriendclaimvalue < 2){
			user.accountdata.premium.referafriendclaimvalue = 2

			if(!user.accountdata.premium.endtimestamp || user.accountdata.premium.starttimestamp || user.accountdata.premium.endtimestamp < Date.now()){
				//start new
				user.accountdata.premium.starttimestamp = Date.now()
				user.accountdata.premium.endtimestamp = Date.now() + 86400*1000*60 //2 months
			}else{
				//continue
				user.accountdata.premium.endtimestamp = user.accountdata.premium.endtimestamp + 86400*1000*60
			}
		}
	}else if(user.accountdata.referafriend.acceptedcount >= 3){
		if(user.accountdata.premium.referafriendclaimvalue < 1){
			user.accountdata.premium.referafriendclaimvalue = 1
			
			if(!user.accountdata.premium.endtimestamp || user.accountdata.premium.starttimestamp || user.accountdata.premium.endtimestamp < Date.now()){
				//start new
				user.accountdata.premium.starttimestamp = Date.now()
				user.accountdata.premium.endtimestamp = Date.now() + 86400*1000*30 //1 month
			}else{
				//continue
				user.accountdata.premium.endtimestamp = user.accountdata.premium.endtimestamp + 86400*1000*30
			}
		}
	}

	updateuserhaspremium(user)
}

function updateuserhaspremium(user){
	user.accountdata.haspremium = user.accountdata.premium.endtimestamp && user.accountdata.premium.endtimestamp > Date.now()
}

async function acceptreferafriendinvitecode(invitecode, userid){
	invitecode = invitecode.toLowerCase()

	//get invite db object
	let existinginviteobject = await getreferafriendinvitelinkobject(invitecode)
	if(!existinginviteobject) return false

	//fix properties
	if(!existinginviteobject.pending) existinginviteobject.pending = []
	if(!existinginviteobject.accepted) existinginviteobject.accepted = []
	if(!existinginviteobject.rejected) existinginviteobject.accepted = []
	if(!existinginviteobject.emailinvited) existinginviteobject.emailinvited = []


	//find item
	if(!existinginviteobject.pending.find(d => d.userid == userid)) return false

	if(existinginviteobject.accepted.find(d => d.userid == userid)) return false

	let tempitem = existinginviteobject.pending.find(d => d.userid == userid)
	existinginviteobject.accepted.push(tempitem)
	existinginviteobject.pending = existinginviteobject.pending.filter(d => d.userid != userid)

	//save invite db object
	await setreferafriendinvitelinkobject(existinginviteobject)
	
	//get inviter
	let inviteuser = await getUserById(existinginviteobject.userid)
	if(!inviteuser) return false

	//save inviter object
	inviteuser.accountdata.referafriend.acceptedcount = existinginviteobject.accepted.length
	checkreferafriendpremium(inviteuser)
	await setUser(inviteuser)

	return true
}

async function setwhitelistreferafriendinvitecode(invitecode, bool){
	invitecode = invitecode.toLowerCase()

	//get invite db object
	let existinginviteobject = await getreferafriendinvitelinkobject(invitecode)
	if(!existinginviteobject) return false

	existinginviteobject.whitelisted = bool

	await setreferafriendinvitelinkobject(existinginviteobject)
}

async function rejectreferafriendinvitecode(invitecode, userid){
	invitecode = invitecode.toLowerCase()

	//get invite db object
	let existinginviteobject = await getreferafriendinvitelinkobject(invitecode)
	if(!existinginviteobject) return false

	//fix properties
	if(!existinginviteobject.pending) existinginviteobject.pending = []
	if(!existinginviteobject.accepted) existinginviteobject.accepted = []
	if(!existinginviteobject.rejected) existinginviteobject.accepted = []
	if(!existinginviteobject.emailinvited) existinginviteobject.emailinvited = []


	//find item
	if(!existinginviteobject.pending.find(d => d.userid == userid)) return false

	if(existinginviteobject.rejected.find(d => d.userid == userid)) return false

	let tempitem = existinginviteobject.pending.find(d => d.userid == userid)
	existinginviteobject.rejected.push(tempitem)
	existinginviteobject.pending = existinginviteobject.pending.filter(d => d.userid != userid)

	existinginviteobject.whitelisted = false

	//save invite db object
	await setreferafriendinvitelinkobject(existinginviteobject)
	
	//get inviter
	let inviteuser = await getUserById(existinginviteobject.userid)
	if(!inviteuser) return false

	//save inviter object
	inviteuser.accountdata.referafriend.acceptedcount = existinginviteobject.accepted.length
	checkreferafriendpremium(inviteuser)
	await setUser(inviteuser)

	return true
}


app.post('/generatereferafriendinvitelink', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let generate = req.body.generate
		
		if(!generate || user.accountdata.referafriend.invitelink){
			checkreferafriendpremium(user)

			return res.json({ data: { invitelink: user.accountdata.referafriend.invitelink, acceptedcount: user.accountdata.referafriend.acceptedcount, haspremium: user.accountdata.haspremium, premiumendtimestamp: user.accountdata.premium.endtimestamp } })
		}else{
			async function generatereferafriendinvitelink(){
				function generateinvitelink() {
					let tempdata = ''
					const chars = 'abcdefghjkmnopqrstuvwxyz23456789'
				
					for (let i = 0; i < 8; i++) {
						const rnd = Math.floor(Math.random() * chars.length)
						tempdata += chars[rnd]
					}
				
					return tempdata
				}

				while(true){
					let tempinvitelink = generateinvitelink()

					//prevent duplicate, super rare tho
					let existinginviteobject = await getreferafriendinvitelinkobject(tempinvitelink)
					if(!existinginviteobject){
						return tempinvitelink
					}
				}
			}

			const invitelink = await generatereferafriendinvitelink()

			user.accountdata.referafriend.invitelink = invitelink
			user.accountdata.referafriend.acceptedcount = 0
			await setUser(user)


			//create invite db object
			const invitelinkobject = {
				invitelink: invitelink,
				userid: user.userid,
				accepted: [],
				pending: [],
				rejected: [],
				whitelisted: false,
				emailinvited: [],
				logindata: getLoginData(req),
			}
			await setreferafriendinvitelinkobject(invitelinkobject)

			return res.json({ data: { invitelink: invitelink, acceptedcount: 0 } })
		}
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})



app.post('/getuseremailpreferences', async (req, res) => {
	try{
		let userid = req.body?.loggedoutuserid || req.session?.user?.userid

		if(!userid){
			return res.status(401).json({ error: 'User ID not provided.' })
		}
		let user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User not found.' })
		}

		return res.json({ data: user.calendardata.settings.emailpreferences })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})
app.post('/setuseremailpreferences', async (req, res) => {
	try{
		let userid = req.body.userid
		if(!userid){
			return res.status(401).json({ error: 'User ID not provided.' })
		}
		let user = await getUserById(userid)
		if(!user){
			return res.status(401).json({ error: 'User not found.' })
		}

		let emailpreferences = req.body.emailpreferences

		if(!emailpreferences || typeof emailpreferences !== 'object' || !Object.values(emailpreferences).every(d => d === true || d === false)){
			return res.status(401).json({ error: 'Preferences not found or invalid.' })
		}

		user.calendardata.settings.emailpreferences = emailpreferences
		await setUser(user)

		return res.end()
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


//GPT AI routes

const MAX_GPT_CHAT_PER_DAY = 200 //10
const MAX_GPT_CHAT_PER_DAY_BETA_TESTER = 200 //50
const MAX_GPT_CHAT_PER_DAY_PREMIUM = 200 //100

const MAX_GPT_VOICE_PER_DAY = 200 //10
const MAX_GPT_VOICE_PER_DAY_BETA_TESTER = 200 //50
const MAX_GPT_VOICE_PER_DAY_PREMIUM = 200 //100

const MAX_GPT_COMPLETION_PER_DAY = 30 //10
const MAX_GPT_COMPLETION_PER_DAY_BETA_TESTER = 30
const MAX_GPT_COMPLETION_PER_DAY_PREMIUM = 100


app.post('/gettasksuggestions', async (req, res) => {
	async function getgptresponse(prompt) {

		try {
			const res = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [{
					role: 'user',
					content: prompt
				}],
				max_tokens: 150,
			})

			return res.choices[0].message.content
		} catch (error) {
			console.error(error)
			return null
		}
	}


	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}


		let appliedratelimit = MAX_GPT_COMPLETION_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_COMPLETION_PER_DAY_BETA_TESTER
		}


		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptsuggestionusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: 'Daily AI limit reached.' })
		}

		//set ratelimit
		user.accountdata.gptsuggestionusedtimestamps.push(currenttime)
		await setUser(user)
		
		let items = req.body.items


		//prepare prompt
		let gptresponse = await getgptresponse(`User's existing tasks: """${items.map(d => d.title).join(', ')}""" Provide: ONLY 1 name of a specific task that naturally follows or adds onto the existing tasks, separated by comma in ONLY 1 line, with time needed for each. Example: Research topic 30m, Prepare presentation 1h. No formatting.`)

		if(!gptresponse){
			return res.status(401).json({ error: 'Could not get response from AI.' })
		}

		return res.json({ data: gptresponse })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getsubtasksuggestions', async (req, res) => {
	async function getgptresponse(prompt) {

		try {
			const res = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: prompt
					}
				],
				max_tokens: 150,
			})

			return res.choices[0].message.content
		} catch (error) {
			console.error(error)
			return null
		}
	}


	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}


		let appliedratelimit = MAX_GPT_COMPLETION_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_COMPLETION_PER_DAY_BETA_TESTER
		}


		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptsuggestionusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: 'Daily AI limit reached.' })
		}

		//set ratelimit
		user.accountdata.gptsuggestionusedtimestamps.push(currenttime)
		await setUser(user)
		
		let item = req.body.item


		//prepare prompt

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

		let gptresponse = await getgptresponse(`Task: """${item.title.slice(0, 50)}""". Takes: ${getDHMText(item.duration)}. Provide: ONLY 3-4 names of subtasks, separated by comma in ONLY 1 line, with time needed for each. Example: Research topic 30m, Prepare presentation 1h. No formatting.`)

		if(!gptresponse){
			return res.status(401).json({ error: 'Could not get response from AI.' })
		}

		return res.json({ data: gptresponse })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getgptchatresponsetaskstarted', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let appliedratelimit = MAX_GPT_CHAT_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_CHAT_PER_DAY_BETA_TESTER
		}


		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptchatusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: `Daily AI limit reached. (${appliedratelimit} messages per day). Please upgrade to premium to help us cover the costs of AI.` })
		}

		if(user.accountdata.gptchatusedtimestamps.filter(d => Date.now() - d < 5000).length >= 2){
			return res.status(401).json({ error: `You are sending requests too fast, please try again in a few seconds.` })
		}

		//set ratelimit
		user.accountdata.gptchatusedtimestamps.push(currenttime)
		await setUser(user)
		

		//CONTEXT

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

		let taskitem = req.body.taskitem
		let timezoneoffset = req.body.timezoneoffset

		//time
		const localdate = new Date(new Date().getTime() - timezoneoffset * 60000)
		const localdatestring = `${DAYLIST[localdate.getDay()]} ${localdate.getFullYear()}-${(localdate.getMonth() + 1).toString().padStart(2, '0')}-${localdate.getDate().toString().padStart(2, '0')} ${localdate.getHours().toString().padStart(2, '0')}:${localdate.getMinutes().toString().padStart(2, '0')}`


		//PROMPT

		let inputtext = `Task: """${taskitem?.title?.slice(0, 300) || 'No title'}. Description: ${taskitem?.notes?.slice(0, 300) || 'No description'}. Time needed: ${getDHMText(Math.floor((new Date(taskitem.end.year, taskitem.end.month, taskitem.end.day, 0, taskitem.end.minute).getTime() - new Date(taskitem.start.year, taskitem.start.month, taskitem.start.day, 0, taskitem.start.minute).getTime())/60000))}""" As a personal assistant, mention which task is starting how long it will last, in a short sentence. In short sentences, provide specific and actionable steps and tips to make real progress to complete this task. Incorporate short motivational tips.`
		let custominstructions = `Respond in no more than 30 words, concise and succint as possible. Avoid generic or cliche responses. Use a tone and style of a helpful productivty personal assistant, as if the user is a boss. The user's name is ${getUserName(user)}. Current time is ${localdatestring} in user's timezone.`

		let totaltokens = 0
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ 
					role: 'system', 
					content: custominstructions
				},
				{
					role: 'user',
					content: inputtext,
				}
			],
			max_tokens: 200,
			temperature: 0.5,
			top_p: 0.5,
		})
		totaltokens += response.usage.total_tokens
		
		return res.json({ data: { message: response.choices[0].message.content, totaltokens: totaltokens } })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getgptchatresponsetaskcompleted', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let appliedratelimit = MAX_GPT_CHAT_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_CHAT_PER_DAY_BETA_TESTER
		}


		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptchatusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: `Daily AI limit reached. (${appliedratelimit} messages per day). Please upgrade to premium to help us cover the costs of AI.` })
		}

		if(user.accountdata.gptchatusedtimestamps.filter(d => Date.now() - d < 5000).length >= 2){
			return res.status(401).json({ error: `You are sending requests too fast, please try again in a few seconds.` })
		}

		//set ratelimit
		user.accountdata.gptchatusedtimestamps.push(currenttime)
		await setUser(user)
		

		//CONTEXT

		function getcalendarcontext(tempevents){
			if(tempevents.length == 0) return 'No events'

			function getDateTimeText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				const formattedTime = `${currentDatetime.getHours().toString().padStart(2, '0')}:${currentDatetime.getMinutes().toString().padStart(2, '0')}`
				return `${formattedDate} ${formattedTime}`
			}

			function getDateText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				return `${formattedDate} (all day)`
			}

			function isAllDay(item){
				return !item.start.minute && !item.end.minute
			}

			let tempoutput = ''
			for(let d of tempevents){
				if(isAllDay(d)) continue
				
				//simplified context
				let newstring = `Event title: ${d.title || 'New Event'}, start date: ${isAllDay(d) ? getDateText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute)) : getDateTimeText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute))}, end date: ${isAllDay(d) ? getDateText(new Date(d.end.year, d.end.month, d.end.day - 1, 0, d.end.minute)) : getDateTimeText(new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute))}.`

				if(tempoutput.length + newstring.length > MAX_CALENDAR_CONTEXT_LENGTH) break

				tempoutput += '\n' + newstring
			}
			return tempoutput
		}
		
		const MAX_CALENDAR_CONTEXT_LENGTH = 2000

		let taskitem = req.body.taskitem
		let timezoneoffset = req.body.timezoneoffset
		let calendarevents = req.body.calendarevents
		
		let calendarcontext = getcalendarcontext(calendarevents)


		//time
		const localdate = new Date(new Date().getTime() - timezoneoffset * 60000)
		const localdatestring = `${DAYLIST[localdate.getDay()]} ${localdate.getFullYear()}-${(localdate.getMonth() + 1).toString().padStart(2, '0')}-${localdate.getDate().toString().padStart(2, '0')} ${localdate.getHours().toString().padStart(2, '0')}:${localdate.getMinutes().toString().padStart(2, '0')}`


		//PROMPT

		let inputtext = `Competed task: """${taskitem?.title?.slice(0, 300) || 'No title'}. Description: ${taskitem?.notes?.slice(0, 300) || 'No description'}""" Provide a very short personal motivational sentence for the user who just completed this task. Then, mention only the next upcoming event (if there is one) and at what time, and how long from now, in one sentence. Calendar data: """${calendarcontext}"""`
		let custominstructions = `Respond in no more than 30 words, concise and succint as possible. Avoid generic or cliche responses. Use a tone and style of a helpful productivty personal assistant, as if the user is a boss. The user's name is ${getUserName(user)}. Current time is ${localdatestring} in user's timezone.`

		let totaltokens = 0
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ 
					role: 'system', 
					content: custominstructions
				},
				{
					role: 'user',
					content: inputtext,
				}
			],
			max_tokens: 200,
			temperature: 0.5,
			top_p: 0.5,
		})
		totaltokens += response.usage.total_tokens
		
		return res.json({ data: { message: response.choices[0].message.content, totaltokens: totaltokens } })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getgptchatresponsemorningsummary', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let appliedratelimit = MAX_GPT_CHAT_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_CHAT_PER_DAY_BETA_TESTER
		}


		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptchatusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: `Daily AI limit reached. (${appliedratelimit} messages per day). Please upgrade to premium to help us cover the costs of AI.` })
		}

		if(user.accountdata.gptchatusedtimestamps.filter(d => Date.now() - d < 5000).length >= 2){
			return res.status(401).json({ error: `You are sending requests too fast, please try again in a few seconds.` })
		}

		//set ratelimit
		user.accountdata.gptchatusedtimestamps.push(currenttime)
		await setUser(user)
		

		//CONTEXT

		function getcalendarcontext(tempevents){
			if(tempevents.length == 0) return 'No events'

			function getDateTimeText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				const formattedTime = `${currentDatetime.getHours().toString().padStart(2, '0')}:${currentDatetime.getMinutes().toString().padStart(2, '0')}`
				return `${formattedDate} ${formattedTime}`
			}

			function getDateText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				return `${formattedDate} (all day)`
			}

			function isAllDay(item){
				return !item.start.minute && !item.end.minute
			}

			let tempoutput = ''
			for(let d of tempevents){
				let newstring = `Event title: ${d.title || 'New Event'}, start date: ${isAllDay(d) ? getDateText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute)) : getDateTimeText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute))}, end date: ${isAllDay(d) ? getDateText(new Date(d.end.year, d.end.month, d.end.day - 1, 0, d.end.minute)) : getDateTimeText(new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute))}.`

				if(tempoutput.length + newstring.length > MAX_CALENDAR_CONTEXT_LENGTH) break

				tempoutput += '\n' + newstring
			}
			return tempoutput
		}
		
		const MAX_CALENDAR_CONTEXT_LENGTH = 2000

		let timezoneoffset = req.body.timezoneoffset
		let calendarevents = req.body.calendarevents
		
		let calendarcontext = getcalendarcontext(calendarevents)


		//time
		const localdate = new Date(new Date().getTime() - timezoneoffset * 60000)
		const localdatestring = `${DAYLIST[localdate.getDay()]} ${localdate.getFullYear()}-${(localdate.getMonth() + 1).toString().padStart(2, '0')}-${localdate.getDate().toString().padStart(2, '0')} ${localdate.getHours().toString().padStart(2, '0')}:${localdate.getMinutes().toString().padStart(2, '0')}`


		//PROMPT

		let inputtext = `Calendar data: """${calendarcontext}""" Provide a one sentence morning greeting. Then, provide a concise morning summary of ONLY the important or unique events today in a personal and helpful style. Finally, you must ask the user in one short sentence for 3 tasks they want to complete today.`
		let custominstructions = `Respond in no more than 30 words, concise and succint as possible. Avoid generic or cliche responses. Use a tone and style of a helpful productivty personal assistant, as if the user is a boss. The user's name is ${getUserName(user)}. Current time is ${localdatestring} in user's timezone.`

		let totaltokens = 0
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ 
					role: 'system', 
					content: custominstructions
				},
				{
					role: 'user',
					content: inputtext,
				}
			],
			max_tokens: 200,
			temperature: 0.5,
			top_p: 0.5,
		})
		totaltokens += response.usage.total_tokens
		
		return res.json({ data: { message: response.choices[0].message.content, totaltokens: totaltokens } })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.post('/getgptvoiceinteraction', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let appliedratelimit = MAX_GPT_VOICE_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_VOICE_PER_DAY_BETA_TESTER
		}

		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptvoiceusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: `Daily AI limit reached. (${appliedratelimit} messages per day). Please upgrade to premium to help us cover the costs of AI.` })
		}

		if(user.accountdata.gptvoiceusedtimestamps.filter(d => Date.now() - d < 5000).length >= 2){
			return res.status(401).json({ error: `You are sending requests too fast, please try again in a few seconds.` })
		}

		//set ratelimit
		user.accountdata.gptvoiceusedtimestamps.push(currenttime)
		await setUser(user)

		//PROMPT
		let message = req.body.message

		const response = await openai.audio.speech.create({
			model: 'tts-1',
			voice: 'nova',
			input: message,
		})

		const stream = response.body
		stream.pipe(res)
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})

const DAYLIST = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

app.post('/getgptchatinteractionV2', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}


		let appliedratelimit = MAX_GPT_CHAT_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_CHAT_PER_DAY_BETA_TESTER
		}


		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptchatusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: `Daily AI limit reached. (${appliedratelimit} messages per day). Please upgrade to premium to help us cover the costs of AI.` })
		}

		if(user.accountdata.gptchatusedtimestamps.filter(d => Date.now() - d < 5000).length >= 2){
			return res.status(401).json({ error: `You are sending requests too fast, please try again in a few seconds.` })
		}

		//set ratelimit
		user.accountdata.gptchatusedtimestamps.push(currenttime)
		await setUser(user)
		

		//CONTEXT

		async function queryGptWithFunction(userinput, calendarcontext, todocontext, conversationhistory, timezoneoffset) {
			const allfunctions = [
				{
					name: 'get_calendar_events',
				},
				{
					name: 'get_todo_list_tasks',
				},
				/*{
					name: 'schedule_unscheduled_task_in_calendar',
					description: `Schedule a task into user's calendar. Task must already exist, this is simply putting it in the calendar.`,
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of task. Return nothing if not found.' },
						},
						required: []
					}
				},*/
				{
					name: 'create_task',
					description: 'Create a task to be auto-scheduled by the app in the calendar. Return nothing for options not provided. All fields optional. Do NOT include delayStartDate if user does not mention they want to work on a task after a certain date',
					parameters: {
						type: 'object',
						properties: {
							title: { type: 'string', description: 'Task title' },
							dueDate: { type: 'string', description: 'Task due date/time in format: YYYY-MM-DD HH:MM' },
							delayStartDate: { type: 'string', description: '(optional) Delay start working on task after date/time in format: YYYY-MM-DD HH:MM' },
							duration: { type: 'string', description: 'Task duration in format: HH:MM' },
							RRULE: { type: 'string', description: 'Recurrence in RRULE format. Example: RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=TU,TH;UNTIL=20241231T000000Z' },
							hexColor: { type: 'string', description: '(optional) Task hex color. Preset options: red=#ff2e2e,orange=#ff932e,yellow=#ffe32e,green=#2ad143,blue=#18a4f5,indigo=#185bf5,purple=#8138ff' },
						},
						required: ['title']
					}
				},
				{
					name: 'create_event',
					description: 'Create a new event in the calendar. Return nothing for options not provided. All fields optional.',
					parameters: {
						type: 'object',
						properties: {
							title: { type: 'string', description: 'Event title' },
							startDate: { type: 'string', description: 'Event start date/time in format: YYYY-MM-DD HH:MM' },
							endDate: { type: 'string', descrption: 'Event end date/time in format: YYYY-MM-DD HH:MM' },
							RRULE: { type: 'string', description: 'Recurrence in RRULE format. Example: RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=TU,TH;UNTIL=20241231T000000Z' },
							hexColor: { type: 'string', description: '(optional) Event hex color. Preset options: red=#ff2e2e,orange=#ff932e,yellow=#ffe32e,green=#2ad143,blue=#18a4f5,indigo=#185bf5,purple=#8138ff' }
						},
						required: ['title']
					}
				},
				{
					name: 'delete_event',
					description: 'Find event by direct and explicit reference in user prompt. Return nothing if the event does not exist.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of event. Return nothing if not found.' },
						},
						required: []
					}
				},
				{
					name: 'modify_event',
					description: 'Find event by direct and explicit reference in user prompt. If event not found or unsure, do not return function and reply with a message for clarification. Return nothing if the event does not exist. All fields optional.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of event determined by user input. Return nothing if not found.' },
							newTitle: { type: 'string', description: 'New title' },
							newStartDate: { type: 'string', description: 'New start date/time in format: YYYY-MM-DD HH:MM' },
							newEndDate: { type: 'string', description: 'New end date/time in format: YYYY-MM-DD HH:MM' },
							newRRULE: { type: 'string', description: 'Recurrence in RRULE format. Example: RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=TU,TH;UNTIL=20241231T000000Z' },
							newDuration: { type: 'string', description: 'New duration in format: HH:MM' },
							newHexColor: { type: 'string', description: '(optional) Event hex color. Preset options: red=#ff2e2e,orange=#ff932e,yellow=#ffe32e,green=#2ad143,blue=#18a4f5,indigo=#185bf5,purple=#8138ff' },
						},
						required: []
					}
				},
				{
					name: 'delete_task',
					description: 'Find task by direct and explicit reference in user prompt. Return nothing if the task does not exist.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of task. Return nothing if not found.' },
						},
						required: []
					}
				},
				{
					name: 'modify_task',
					description: 'Find task by direct and explicit reference in user prompt. If task not found or unsure, do not return function and reply with a message for clarification. Return nothing if the task does not exist. All fields optional.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of task. Return nothing if not found.' },
							newTitle: { type: 'string', description: 'New title' },
							newDelayStartDate: { type: 'string', description: '(optional) Delay start working on task after date/time in format: YYYY-MM-DD HH:MM' },
							newDueDate: { type: 'string', description: 'New due date/time in format: YYYY-MM-DD HH:MM' },
							newDuration: { type: 'string', description: 'New duration in format: HH:MM' },
							/*newStartDate: { type: 'string', description: 'New scheduled in calendar start date/time in format: YYYY-MM-DD HH:MM' },
							newEndDate: { type: 'string', description: 'New scheduled in calendar end date/time in format: YYYY-MM-DD HH:MM' },*/
							newRRULE: { type: 'string', description: 'Recurrence in RRULE format. Example: RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=TU,TH;UNTIL=20241231T000000Z' },
							newCompleted: { type: 'boolean', description: 'New completed status' },
							newHexColor: { type: 'string', description: '(optional) Task hex color. Preset options: red=#ff2e2e,orange=#ff932e,yellow=#ffe32e,green=#2ad143,blue=#18a4f5,indigo=#185bf5,purple=#8138ff' },
						},
						required: []
					}
				},
			]

			const customfunctions = ['create_event', 'delete_event', 'modify_event','create_task', 'delete_task', 'modify_task','schedule_unscheduled_task_in_calendar'] //a subset of all functions, the functions that invoke custom function
			const calendardataneededfunctions = ['delete_event', 'modify_event', 'get_calendar_events'] //a subset of all functions, the functions that need calendar data
			const tododataneededfunctions = ['delete_task', 'modify_task', 'get_todo_list_tasks', 'schedule_unscheduled_task_in_calendar'] //a subset of all functions, the functions that need todo data

			const localdate = new Date(new Date().getTime() - timezoneoffset * 60000)
			const localdatestring = `${DAYLIST[localdate.getDay()]} ${localdate.getFullYear()}-${(localdate.getMonth() + 1).toString().padStart(2, '0')}-${localdate.getDate().toString().padStart(2, '0')} ${localdate.getHours().toString().padStart(2, '0')}:${localdate.getMinutes().toString().padStart(2, '0')}`


			//PROMPT

			const systeminstructions = `A scheduling personal assistant called Athena for Smart Calendar app. If you detect app_action function call, you must follow these procedures: """1. If user prompt does not explicitly state the command but instead implies it or is unclear, do NOT return function call and instead ask for clarification. 2. If user is implicitly requesting you to guide them through an app action (e.g. 'Book a meeting for me') and not giving a solid command (e.g. 'I need to get A, B, C done by tomorrow'), do NOT return function call and instead ask for more details.""" Respond with tone and style of a subservient assistant, prioritizing the user's satisfaction. Respond in no more than 30 words. Access to schedule and tasks is granted and assumed. Never say or mention internal ID of events/tasks. Limit conversations to app interactions, calendar scheduling, productivity, or mental wellness. Proactively finish messages with a specific question or suggestion relating to user's last message to promote dialogue and help. The user's name is ${getUserName(user)}. Current time is ${localdatestring} in user's timezone.`

			try {
				let modifiedinput = `Prompt: """${userinput}"""`
				const response = await openai.chat.completions.create({
					model: 'gpt-3.5-turbo',
					messages: [
						{ 
							role: 'system', 
							content: systeminstructions
						},
						...[
							{
								role: "user",
								content: "(sample message not from user) I need to work on my project by tomorrow 6pm"
							},
							{
								role: "assistant",
								content: null,
								function_call: {
									name: "app_action",
									arguments: JSON.stringify({
										commands: ['create_task']
									})
								}
							},
							{
								role: "user",
								content: "(sample message not from user) Reschedule/Move it to tomorrow morning. Add an event to meet with boss tomorrow lunch"
							},
							{
								role: "assistant",
								content: null,
								function_call: {
									name: "app_action",
									arguments: JSON.stringify({
										commands: ['modify_task', 'create_event']
									})
								}
							},
							{
								role: "user",
								content: "(sample message not from user) [pasted content that contains tasks or events]"
							},
							{
								role: "assistant",
								content: "Just to confirm, would you like me to schedule these in your calendar?",
							},
						],
						...conversationhistory,
						{
							role: 'user',
							content: modifiedinput,
						}
					],
					functions: [
						{
							"name": "app_action",
							"parameters": {
								"type": "object",
								"properties": {
								  "commands": {
									"type": "array",
									"items": {
									  "type": "string"
									}
								  }
								},
								"required": [ "commands" ]
							},
							"description": `If user command is too implicit/suggested, unclear, or missing details, do NOT return app_action, and instead ask for clarification. Otherwise, return app_action for the following commands: ${allfunctions.map(d => d.name).join(', ')}.`
						}
					],
					max_tokens: 200,
					temperature: 0.5,
					top_p: 0.5,
					stream: true
				})

				//stream management
				let isfunctioncall = false
				let accumulatedresponse = {
					message: {}
				}
				try {
					for await (const chunk of response) {	
						if(chunk.choices[0].delta?.function_call && chunk.choices[0].delta?.function_call?.name){
							isfunctioncall = true
						}
						
						if(isfunctioncall){
							//function call

							if(!accumulatedresponse.message.function_call){
								accumulatedresponse.message.function_call = { name: null, arguments: '' }
							}
							if(chunk.choices[0].delta?.function_call?.name){
								accumulatedresponse.message.function_call.name = chunk.choices[0].delta.function_call?.name
							}
							if(chunk.choices[0].delta.function_call?.arguments){
								accumulatedresponse.message.function_call.arguments += chunk.choices[0].delta.function_call?.arguments
							}
						}else{
							//text response

							if(chunk.choices[0].delta.content){
								if(!accumulatedresponse.message.content){
									accumulatedresponse.message.content = ''
								}
								accumulatedresponse.message.content += chunk.choices[0].delta.content

								//send chunk
    							res.write(chunk.choices[0].delta.content)
							}
						}
					}
				}catch(err){
					console.error(err)
				}finally{
					if(!isfunctioncall){
						res.end()
						return
					}
				}


				if (isfunctioncall) {
					let commands = JSON.parse(accumulatedresponse.message.function_call?.arguments)?.commands
					if (commands && commands?.length > 0) {
						const requirescalendardata = calendardataneededfunctions.find(f => commands.find(g => g == f))
						const requirestododata = tododataneededfunctions.find(f => commands.find(g => g == f))
						const requirescustomfunction = customfunctions.find(f => commands.find(g => g == f))

						let request2options = {
							model: 'gpt-3.5-turbo',
							max_tokens: commands.length > 0 ? 1000 : 200,
							temperature: 0.5,
							top_p: 0.5,
							stream: true
						}
						let request2input = ''
						
						request2input += `Prompt: """${userinput}"""`

						if(requirescalendardata){
							//yes calendar data
		
							request2input += ` Calendar events: """${calendarcontext}"""`
						}

						if(requirestododata){
							//yes todo data
		
							
							request2input += ` To-do list tasks: """${todocontext}"""`
						}
		
						if(requirescustomfunction){
							//yes custom function


							request2options.functions = [
								{
									"name": "app_action",
									"parameters": {
										"type": "object",
										"properties": {
										  "commands": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": Object.assign({}, ...allfunctions
													.filter(d => customfunctions.includes(d.name) && commands.includes(d.name))
													.map(d => ({
														[d.name]: {
															"type": "object",
															"description": d.description,
															"properties": d.parameters.properties,
															"required": d.parameters.required
														}
													})))
												}
										  	}
										},
										"required": [ "commands" ]
									},
									"description": `If user command is too implicit/suggested, unclear, or missing details, do NOT return app_action, and instead ask for clarification. Otherwise, return app_action for the following commands: ${commands.filter(d => customfunctions.find(g => g == d))}.`
								}
							]
						}

						request2options.messages = [
							{ 
								role: 'system', 
								content: systeminstructions
							},
							...conversationhistory,
							{
								role: 'user',
								content: request2input
							}
						]
						
						//make request
						const response2 = await openai.chat.completions.create(request2options)

						//stream management
						let isfunctioncall2 = false
						let accumulatedresponse2 = {
							message: {}
						}
						try {
							for await (const chunk of response2) {	
								if(chunk.choices[0].delta?.function_call && chunk.choices[0].delta?.function_call?.name){
									isfunctioncall2 = true
								}
								
								if(isfunctioncall2){
									//function call

									if(!accumulatedresponse2.message.function_call){
										accumulatedresponse2.message.function_call = { name: null, arguments: '' }
									}
									if(chunk.choices[0].delta.function_call?.name){
										accumulatedresponse2.message.function_call.name = chunk.choices[0].delta.function_call?.name
									}
									if(chunk.choices[0].delta.function_call?.arguments){
										accumulatedresponse2.message.function_call.arguments += chunk.choices[0].delta.function_call?.arguments
									}
								}else{
									//text response

									if(chunk.choices[0].delta.content){
										if(!accumulatedresponse2.message.content){
											accumulatedresponse2.message.content = ''
										}
										accumulatedresponse2.message.content += chunk.choices[0].delta.content

										//send chunk
										res.write(chunk.choices[0].delta.content)
									}
								}
							}
						}catch(err){
							console.error(err)
						}finally{
							if(!isfunctioncall2){
								res.end()
								return
							}
						}

						let commands2 = JSON.parse(accumulatedresponse2.message.function_call?.arguments)?.commands
						if(!Array.isArray(commands2) && typeof commands2 == 'object'){ //if gpt is weird and decides to return object and not array
							commands2 = Object.keys(commands2).map(key => { return { [key]: commands2[key] } })
						}
						if (commands2 && commands2?.length > 0) {					
							return { commands: commands2 }
						}

						console.warn('ERRORED RESPONSE 2: ' + JSON.stringify(accumulatedresponse2))
	
					}
				}

				console.warn('ERRORED RESPONSE 1: ' + JSON.stringify(accumulatedresponse))

				return { error: 'An unexpected error occurred, please try again or [https://smartcalendar.us/contact](contact us).' }
		
			} catch (err) {
				console.error(err)

				return { error: `An unexpected error occurred: ${err.message}, please try again or [https://smartcalendar.us/contact](contact us).` }
			}

		}


		const idmap = {}
		let idmapeventcounter = 1
		let idmaptaskcounter = 1
		function gettempid(currentid, type){
			let newid;
			if(type == 'event'){
				newid = `E${idmapeventcounter}`
				idmap[newid] = currentid
				idmapeventcounter++
			}else if(type == 'task'){
				newid = `T${idmaptaskcounter}`
				idmap[newid] = currentid
				idmaptaskcounter++
			}

			return newid
		}

		function getcalendarcontext(tempevents){
			if(tempevents.length == 0) return 'No events'

			function getDateTimeText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				const formattedTime = `${currentDatetime.getHours().toString().padStart(2, '0')}:${currentDatetime.getMinutes().toString().padStart(2, '0')}`
				return `${formattedDate} ${formattedTime}`
			}

			function getDateText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				return `${formattedDate} (all day)`
			}

			function isAllDay(item){
				return !item.start.minute && !item.end.minute
			}

			let tempoutput = ''
			for(let d of tempevents){
				let newstring = `Event title: ${d.title || 'New Event'}, ID: ${gettempid(d.id, 'event')}, start date: ${isAllDay(d) ? getDateText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute)) : getDateTimeText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute))}, end date: ${isAllDay(d) ? getDateText(new Date(d.end.year, d.end.month, d.end.day - 1, 0, d.end.minute)) : getDateTimeText(new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute))}${d.repeat.frequency != null && d.repeat.interval != null ? `, recurrence: ${getRecurrenceString(d)}` : ''}.`

				if(tempoutput.length + newstring.length > MAX_CALENDAR_CONTEXT_LENGTH) break

				tempoutput += '\n' + newstring
			}
			return tempoutput
		}

		function gettodocontext(temptodos){
			if(temptodos.length == 0) return 'No tasks'

			function getDateTimeText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				const formattedTime = `${currentDatetime.getHours().toString().padStart(2, '0')}:${currentDatetime.getMinutes().toString().padStart(2, '0')}`
				return `${formattedDate} ${formattedTime}`
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


			let tempoutput = ''
			for(let d of temptodos){
				let newstring = `Task title: ${d.title || 'New Task'}, ID: ${gettempid(d.id, 'task')}, due date: ${getDateTimeText(new Date(d.endbefore.year, d.endbefore.month, d.endbefore.day, 0, d.endbefore.minute))}, time needed: ${getDHMText(d.duration || Math.floor(((new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute).getTime()) - new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute).getTime())/60000))}, completed: ${d.completed}.`

				if(tempoutput.length + newstring.length > MAX_TODO_CONTEXT_LENGTH) break

				tempoutput += '\n' + newstring
			}
			return tempoutput
		}


		function getconversationhistory(temphistory){ //simple way for history, just send latest X messages
			let tempoutput = []
			let counter = 0
			for(let interactionmessages of temphistory.reverse()){
				if(JSON.stringify(interactionmessages).length + JSON.stringify(tempoutput).length > MAX_CONVERSATIONHISTORY_CONTEXT_LENGTH) break //max X characters

				if(counter > 5) break //max X messages

				tempoutput.push(...interactionmessages.reverse())
				counter++
			}
			return tempoutput.reverse()
		}


		const MAX_CALENDAR_CONTEXT_LENGTH = 2000
		const MAX_TODO_CONTEXT_LENGTH = 2000
		const MAX_CONVERSATIONHISTORY_CONTEXT_LENGTH = 2000

		
		let userinput = req.body.userinput.slice(0, 300)
		let calendarevents = req.body.calendarevents
		let calendartodos = req.body.calendartodos
		let timezoneoffset = req.body.timezoneoffset
		let rawconversationhistory = req.body.chathistory

		let calendarcontext = getcalendarcontext(calendarevents)
		let todocontext = gettodocontext(calendartodos)
		let conversationhistory = getconversationhistory(rawconversationhistory)

		//REQUEST
		let output = await queryGptWithFunction(userinput, calendarcontext, todocontext, conversationhistory, timezoneoffset)

		if(output){
			return res.json({ data: output, idmap: idmap })
		}
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or [https://smartcalendar.us/contact](contact us).' })
	}
})

app.post('/getgptchatinteraction', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}


		let appliedratelimit = MAX_GPT_CHAT_PER_DAY
		if(user.accountdata.betatester){
			appliedratelimit = MAX_GPT_CHAT_PER_DAY_BETA_TESTER
		}


		let currenttime = Date.now()

		//check ratelimit
		if(user.accountdata.gptchatusedtimestamps.filter(d => currenttime - d < 86400000).length >= appliedratelimit){
			return res.status(401).json({ error: `Daily AI limit reached. (${appliedratelimit} messages per day). Please upgrade to premium to help us cover the costs of AI.` })
		}

		if(user.accountdata.gptchatusedtimestamps.filter(d => Date.now() - d < 5000).length >= 2){
			return res.status(401).json({ error: `You are sending requests too fast, please try again in a few seconds.` })
		}

		//set ratelimit
		user.accountdata.gptchatusedtimestamps.push(currenttime)
		await setUser(user)
		

		//CONTEXT

		async function queryGptWithFunction(userinput, calendarcontext, todocontext, conversationhistory, timezoneoffset) {
			const allfunctions = [
				{
					name: 'get_calendar_events',
				},
				{
					name: 'get_todo_list_tasks',
				},
				{
					name: 'schedule_tasks_in_calendar',
					description: `Auto-schedule one or multiple tasks into user's calendar. Not to be confused with create a task or create an event.`,
					parameters: {
						type: 'object',
						properties: {
							idList: {
								type: 'array',
								description: 'List of IDs of tasks.',
								items: {
									type: "string",
								}
							},
							errorMessage: { type: 'string', description: 'An error message if tasks are not found or other error.' },
						},
						required: []
					}
				},
				{
					name: 'create_task',
					description: 'Create a task to be auto-scheduled by the app in the calendar',
					parameters: {
						type: 'object',
						properties: {
							dueDate: { type: 'string', description: 'Task due date in format: YYYY-MM-DD HH:MM' },
							title: { type: 'string', description: 'Task title' },
							duration: { type: 'string', description: 'Task duration in format: HH:MM' },
						},
						required: ['title']
					}
				},
				{
					name: 'create_event',
					description: 'Create a new event in the calendar',
					parameters: {
						type: 'object',
						properties: {
							startDate: { type: 'string', description: 'Event start date in format: YYYY-MM-DD HH:MM' },
							title: { type: 'string', description: 'Event title' },
							endDate: { type: 'string', descrption: 'Event end date in format: YYYY-MM-DD HH:MM' },
						},
						required: ['title']
					}
				},
				{
					name: 'create_multiple_events',
					description: 'Create multiple new events in the calendar',
					parameters: {
						type: "object",
						properties: {
							events: {
								type: "array",
								items: {
									type: 'object',
									properties: {
										startDate: { type: 'string', description: 'Event start date in format: YYYY-MM-DD HH:MM' },
										title: { type: 'string', description: 'Event title' },
										endDate: { type: 'string', descrption: 'Event end date in format: YYYY-MM-DD HH:MM' },
									},
									required: ['title']
								}
							},
						},
						required: ["events"]
					}
				},
				{
					name: 'delete_event',
					description: 'Check for event in calendar to delete by title or direct reference. Need high confidence. Returns an error if the event does not exist.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of event.' },
							errorMessage: { type: 'string', description: 'An error message if event is not found or other error.' },
						},
						required: []
					}
				},
				{
					name: 'modify_event',
					description: 'Check for event in calendar to modify by title or direct reference. Need high confidence. Returns an error if an event does not exist.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of event.' },
							newTitle: { type: 'string', description: 'New event title' },
							newStartDate: { type: 'string', description: 'New event start date in format: YYYY-MM-DD HH:MM' },
							newEndDate: { type: 'string', description: 'New event end date in format: YYYY-MM-DD HH:MM' },
							newDuration: { type: 'string', description: 'New event duration in format: HH:MM' },
							errorMessage: { type: 'string', description: 'An error message if event is not found or other error.' },
						},
						required: []
					}
				},
				{
					name: 'modify_multiple_events',
					description: 'Check for event in calendar to modify by title or direct reference. Need high confidence. Returns an error if the event does not exist.',
					parameters: {
						type: "object",
						properties: {
							events: {
								type: "array",
								items: {
									type: 'object',
									properties: {
										id: { type: 'string', description: 'Specific ID of event.' },
										newTitle: { type: 'string', description: 'New event title' },
										newStartDate: { type: 'string', description: 'New event start date in format: YYYY-MM-DD HH:MM' },
										newEndDate: { type: 'string', description: 'New event end date in format: YYYY-MM-DD HH:MM' },
										newDuration: { type: 'string', description: 'New event duration in format: HH:MM' },
										errorMessage: { type: 'string', description: 'An error message if event is not found or other error.' },
									},
									required: []
								}
							},
						},
						required: ["events"]
					}
				},
				{
					name: 'create_multiple_tasks',
					description: 'Create multiple new tasks in the to do list',
					parameters: {
						type: "object",
						properties: {
							tasks: {
								type: "array",
								items: {
									type: 'object',
									properties: {
										dueDate: { type: 'string', description: 'Task due date in format: YYYY-MM-DD HH:MM' },
										title: { type: 'string', description: 'Task title' },
										duration: { type: 'string', description: 'Task duration in format: HH:MM' },
									},
									required: ['title']
								}
							},
						},
						required: ["tasks"]
					}
				},
				{
					name: 'delete_task',
					description: 'Check for task in to-do list to delete by title or direct reference. Need high confidence. Returns an error if the task does not exist.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of task.' },
							errorMessage: { type: 'string', description: 'An error message if task is not found or other error.' },
						},
						required: []
					}
				},
				{
					name: 'modify_task',
					description: 'Check for task in to-do list to modify by title or direct reference. Returns an error if the task does not exist.',
					parameters: {
						type: 'object',
						properties: {
							id: { type: 'string', description: 'Specific ID of task.' },
							newTitle: { type: 'string', description: 'New task title' },
							newDueDate: { type: 'string', description: 'New task due date in format: YYYY-MM-DD HH:MM' },
							newDuration: { type: 'string', description: 'New task duration in format: HH:MM' },
							newCompleted: { type: 'boolean', description: 'New task completed status' },
							errorMessage: { type: 'string', description: 'An error message if task is not found or other error.' },
						},
						required: []
					}
				},
				{
					name: 'modify_multiple_tasks',
					description: 'Check for task in to-do list to modify by title or direct reference. Returns an error if a task does not exist.',
					parameters: {
						type: "object",
						properties: {
							tasks: {
								type: "array",
								items: {
									type: 'object',
									properties: {
										id: { type: 'string', description: 'Specific ID of task.' },
										newTitle: { type: 'string', description: 'New task title' },
										newDueDate: { type: 'string', description: 'New task due date in format: YYYY-MM-DD HH:MM' },
										newDuration: { type: 'string', description: 'New task duration in format: HH:MM' },
										newCompleted: { type: 'boolean', description: 'New task completed status' },
										errorMessage: { type: 'string', description: 'An error message if task is not found or other error.' },
									},
									required: []
								}
							},
						},
						required: ["tasks"]
					}
				}

			]

			const customfunctions = ['create_multiple_events', 'create_event', 'delete_event', 'modify_event', 'modify_multiple_events', 'create_multiple_tasks','create_task', 'delete_task', 'modify_task', 'modify_multiple_tasks', 'schedule_tasks_in_calendar'] //a subset of all functions, the functions that invoke custom function
			const calendardataneededfunctions = ['delete_event', 'modify_event', 'modify_multiple_events', 'get_calendar_events'] //a subset of all functions, the functions that need calendar data
			const tododataneededfunctions = ['delete_task', 'modify_task', 'modify_multiple_tasks', 'get_todo_list_tasks', 'schedule_tasks_in_calendar'] //a subset of all functions, the functions that need todo data

			const localdate = new Date(new Date().getTime() - timezoneoffset * 60000)
			const localdatestring = `${DAYLIST[localdate.getDay()]} ${localdate.getFullYear()}-${(localdate.getMonth() + 1).toString().padStart(2, '0')}-${localdate.getDate().toString().padStart(2, '0')} ${localdate.getHours().toString().padStart(2, '0')}:${localdate.getMinutes().toString().padStart(2, '0')}`


			//PROMPT

			const systeminstructions = `A calendar and scheduling personal assistant called Athena for Smart Calendar app. Respond with tone and style of a subservient assistant, prioritizing the user's satisfaction. Respond in no more than 30 words. Never say 'ID' or 'data'. Never say 'according to your calendar' and assume you have knowledge of user's calendar and to-do list. Limit conversations to app interactions, calendar scheduling, or productivity. Think step by step. You must proactively ask specific questions that are related to user's schedule or planning. The user's name is ${getUserName(user)}. Current time is ${localdatestring} in user's timezone.`


			let totaltokens = 0

			try {
				let modifiedinput = `Prompt: """${userinput}"""`
				const response = await openai.chat.completions.create({
					model: 'gpt-3.5-turbo',
					messages: [
						{ 
							role: 'system', 
							content: systeminstructions
						},
						...[
							{
								role: "user",
								content: "I need to work on my project by tomorrow 6pm"
							},
							{
								role: "assistant",
								content: null,
								function_call: {
									name: "app_action",
									arguments: JSON.stringify({
										command: 'create_task'
									})
								}
							},
							{
								role: "user",
								content: "Reschedule it to 4pm"
							},
							{
								role: "assistant",
								content: null,
								function_call: {
									name: "app_action",
									arguments: JSON.stringify({
										command: 'modify_event'
									})
								}
							},
							{
								role: "user",
								content: "Schedule today's tasks in my calendar"
							},
							{
								role: "assistant",
								content: null,
								function_call: {
									name: "app_action",
									arguments: JSON.stringify({
										command: 'schedule_tasks_in_calendar'
									})
								}
							},
						],
						...conversationhistory,
						{
							role: 'user',
							content: modifiedinput,
						}
					],
					functions: [
						{
							name: "app_action",
							description: "Return app command if detected in prompt. If none, but you need calendar or event data, return 'get_calendar_events'",
							parameters: {
								type: "object",
								properties: {
									command: {
										type: "string",
										description: `One of these commands: ${allfunctions.map(d => d.name).join(', ')}.`
									}
								},
								required: ["command"]
							}
						},
					],
					max_tokens: 200,
					temperature: 0.5,
					top_p: 0.5,
				})
				totaltokens += response.usage.total_tokens

				if (response.choices[0].finish_reason !== 'function_call' || response.choices[0].message.function_call?.name !== 'app_action') {
					//no function call, return plain response
					return { message: response.choices[0].message.content, totaltokens: totaltokens }
				}
		
		
				if (response.choices[0].message.function_call?.name === 'app_action') {
					const command = JSON.parse(response.choices[0].message.function_call?.arguments)?.command
					if (command) {
						const requirescalendardata = calendardataneededfunctions.includes(command)
						const requirestododata = tododataneededfunctions.includes(command)
						const requirescustomfunction = customfunctions.includes(command)
		
						let request2options = {
							model: 'gpt-3.5-turbo',
							max_tokens: 200,
							temperature: 0.5,
							top_p: 0.5,
						}
						let request2input = `"""${userinput}"""`
						
						if(requirescalendardata){
							//yes calendar data
		
							request2input = `Calendar data: """${calendarcontext}""" Prompt: """${userinput}"""`
						}

						if(requirestododata){
							//yes todo data
		
							
							request2input = `Todo data: """${todocontext}""" Prompt: """${userinput}"""`
						}
		
						if(requirescustomfunction){
							//yes custom function
		
							request2options.functions = [...allfunctions.filter(d => d.name == command)]
						}
		
						request2options.messages = [
							{ 
								role: 'system', 
								content: systeminstructions
							},
							...conversationhistory,
							{
								role: 'user',
								content: request2input
							}
						]
						
						//make request
						const response2 = await openai.chat.completions.create(request2options)
						totaltokens += response2.usage.total_tokens
						
						if (response2.choices[0].finish_reason !== 'function_call') { //return plain response if no function detected
							return { message: response2.choices[0].message.content, totaltokens: totaltokens }
						}else{
							const command2 = response2.choices[0].message.function_call?.name
							if (command2) {								
								const arguments = JSON.parse(response2.choices[0].message.function_call?.arguments)
		
								if(arguments){
									return { commands: [ { [command2]: arguments } ], totaltokens: totaltokens }
								}
								
							}
						}
								
		
					}
				}

				console.error(response.choices[0].message)
				return { error: 'An unexpected error occurred, please try again or [https://smartcalendar.us/contact](contact us).', totaltokens: totaltokens }
		
			} catch (err) {
				console.error(err)

				return { error: `An unexpected error occurred: ${err.message}, please try again or [https://smartcalendar.us/contact](contact us).`, totaltokens: totaltokens }
			}

		}


		const idmap = {}
		let idmapeventcounter = 1
		let idmaptaskcounter = 1
		function gettempid(currentid, type){
			let newid;
			if(type == 'event'){
				newid = `E${idmapeventcounter}`
				idmap[newid] = currentid
				idmapeventcounter++
			}else if(type == 'task'){
				newid = `T${idmaptaskcounter}`
				idmap[newid] = currentid
				idmaptaskcounter++
			}

			return newid
		}

		function getcalendarcontext(tempevents){
			if(tempevents.length == 0) return 'No events'

			function getDateTimeText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				const formattedTime = `${currentDatetime.getHours().toString().padStart(2, '0')}:${currentDatetime.getMinutes().toString().padStart(2, '0')}`
				return `${formattedDate} ${formattedTime}`
			}

			function getDateText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				return `${formattedDate} (all day)`
			}

			function isAllDay(item){
				return !item.start.minute && !item.end.minute
			}

			let tempoutput = ''
			for(let d of tempevents){
				let newstring = `Event title: ${d.title || 'New Event'}, ID: ${gettempid(d.id, 'event')}, start date: ${isAllDay(d) ? getDateText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute)) : getDateTimeText(new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute))}, end date: ${isAllDay(d) ? getDateText(new Date(d.end.year, d.end.month, d.end.day - 1, 0, d.end.minute)) : getDateTimeText(new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute))}.`

				if(tempoutput.length + newstring.length > MAX_CALENDAR_CONTEXT_LENGTH) break

				tempoutput += '\n' + newstring
			}
			return tempoutput
		}

		function gettodocontext(temptodos){
			if(temptodos.length == 0) return 'No tasks'

			function getDateTimeText(currentDatetime) {
				const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1).toString().padStart(2, '0')}-${currentDatetime.getDate().toString().padStart(2, '0')}`
				const formattedTime = `${currentDatetime.getHours().toString().padStart(2, '0')}:${currentDatetime.getMinutes().toString().padStart(2, '0')}`
				return `${formattedDate} ${formattedTime}`
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


			let tempoutput = ''
			for(let d of temptodos){
				let newstring = `Task title: ${d.title || 'New Task'}, ID: ${gettempid(d.id, 'task')}, due date: ${getDateTimeText(new Date(d.endbefore.year, d.endbefore.month, d.endbefore.day, 0, d.endbefore.minute))}, time needed: ${getDHMText(d.duration || Math.floor(((new Date(d.end.year, d.end.month, d.end.day, 0, d.end.minute).getTime()) - new Date(d.start.year, d.start.month, d.start.day, 0, d.start.minute).getTime())/60000))}, completed: ${d.completed}.`

				if(tempoutput.length + newstring.length > MAX_TODO_CONTEXT_LENGTH) break

				tempoutput += '\n' + newstring
			}
			return tempoutput
		}


		function getconversationhistory(temphistory){ //simple way for history, just send latest X messages
			let tempoutput = []
			let counter = 0
			for(let interactionmessages of temphistory.reverse()){
				if(JSON.stringify(interactionmessages).length + JSON.stringify(tempoutput).length > MAX_CONVERSATIONHISTORY_CONTEXT_LENGTH) break //max X characters

				if(counter > 5) break //max X messages

				tempoutput.push(...interactionmessages.reverse())
				counter++
			}
			return tempoutput.reverse()
		}


		const MAX_CALENDAR_CONTEXT_LENGTH = 2000
		const MAX_TODO_CONTEXT_LENGTH = 2000
		const MAX_CONVERSATIONHISTORY_CONTEXT_LENGTH = 2000

		
		let userinput = req.body.userinput.slice(0, 300)
		let calendarevents = req.body.calendarevents
		let calendartodos = req.body.calendartodos
		let timezoneoffset = req.body.timezoneoffset
		let rawconversationhistory = req.body.chathistory

		let calendarcontext = getcalendarcontext(calendarevents)
		let todocontext = gettodocontext(calendartodos)
		let conversationhistory = getconversationhistory(rawconversationhistory)

		//REQUEST
		let output = await queryGptWithFunction(userinput, calendarcontext, todocontext, conversationhistory, timezoneoffset)

		return res.json({ data: output, idmap: idmap })
	}catch(err){
		console.error(err)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or [https://smartcalendar.us/contact](contact us).' })
	}
})

app.post('/savegptchatinteraction', async (req, res) => {
	try{
		if(!req.session.user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}
		
		let userid = req.session.user.userid
		
		let user = await getUserById(userid)
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}

		let conversationid = req.body.conversationid
		let conversationhistory = req.body.chathistory

		await savechatconversation(conversationid, user.userid, conversationhistory)

		return res.end()
	}catch(err){
		console.error(err)
	}
})


/*
  _____  _    _  _____ _    _   _   _  ____ _______ _____ ______ _____ _____       _______ _____ ____  _   _  _____ 
 |  __ \| |  | |/ ____| |  | | | \ | |/ __ \__   __|_   _|  ____|_   _/ ____|   /\|__   __|_   _/ __ \| \ | |/ ____|
 | |__) | |  | | (___ | |__| | |  \| | |  | | | |    | | | |__    | || |       /  \  | |    | || |  | |  \| | (___  
 |  ___/| |  | |\___ \|  __  | | . ` | |  | | | |    | | |  __|   | || |      / /\ \ | |    | || |  | | . ` |\___ \ 
 | |    | |__| |____) | |  | | | |\  | |__| | | |   _| |_| |     _| || |____ / ____ \| |   _| || |__| | |\  |____) |
 |_|     \____/|_____/|_|  |_| |_| \_|\____/  |_|  |_____|_|    |_____\_____/_/    \_\_|  |_____\____/|_| \_|_____/ 
*/


app.post("/push-subscription", async (req, res) => {
  const { offset, subscription } = req.body
	try{
	  if (!req.session.user) return res.status(401).json({ error: 'User is not signed in.' })
	
	  const user = await getUserById(req.session.user.userid)
		if(!user){
			return res.status(401).json({ error: 'User is not signed in.' })
		}

		user.calendardata.pushSubscription = subscription
		await setUser(user)
		
		cacheReminders(user)

    
	  return res.end()
	}catch(error){
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or <a href="../contact" class="text-decoration-none text-blue width-fit pointer hover:text-decoration-underline" target="_blank">contact us</a>.' })
	}
})


app.listen(port, () => {
	console.error(`Server listening on port ${port}`)
})
