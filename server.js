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


// FOR PUSH NOTIFS
const webpush = require("web-push")
webpush.setVapidDetails(
  "mailto:contact@smartcalendar.us",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)


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


async function sendmessage(data){
	const params = {
	  TableName: 'smartcalendarmessages',
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
	for(let item of user.calendardata.notifications){
		addmissingproperties(MODELNOTIFICATION, item)
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


class Message{
	constructor({ content, userid, email }){
		this.id = generateID()
		this.content = content
		this.userid = userid
		this.email = email
	}
}


class User{
	constructor({ username, password, google_email, googleid }){
		this.userid = generateID()

		this.username = username
		this.password = password
		this.google_email = google_email
		this.googleid = googleid

		this.calendardata = {}
		this.accountdata = {}
		this.accountdata.createddate = Date.now()
	}
}

const MODELUSER = { calendardata: {}, accountdata: {} }
const MODELCALENDARDATA = { events: [], todos: [], calendars: [], notifications: [], settings: { issyncingtogooglecalendar: false, issyncingtogoogleclassroom: false, sleep: { startminute: 1380, endminute: 420 }, militarytime: false, theme: 0, eventspacing: 15 }, lastnotificationdate: 0, smartschedule: { mode: 1 }, lastsyncedgooglecalendardate: 0, lastsyncedgoogleclassroomdate: 0, onboarding: { start: false, connectcalendars: false, connecttodolists: false, eventreminders: false, sleeptime: false, addtask: false }, interactivetour: { clickaddtask: false, clickscheduleoncalendar: false, autoschedule: false }, welcomepopup: { calendar: false }, pushSubscription: null, pushSubscriptionEnabled: false, emailreminderenabled: false, discordreminderenabled: false, lastmodified: 0, lastprompttodotodaydate: 0  }
const MODELACCOUNTDATA = { refreshtoken: null, google: { name: null, profilepicture: null }, timezoneoffset: null, lastloggedindate: null, createddate: null, discord: { id: null, username: null } }
const MODELEVENT = { start: null, end: null, endbefore: {}, id: null, calendarid: null, googleeventid: null, googlecalendarid: null, googleclassroomid: null, googleclassroomlink: null, title: null, type: 0, notes: null, completed: false, priority: 0, hexcolor: '#2693ff', reminder: [], repeat: { frequency: null, interval: null, byday: [], until: null, count: null }, timewindow: { day: { byday: [] }, time: { startminute: null, endminute: null } }, lastmodified: 0 }
const MODELTODO = { endbefore: {}, title: null, notes: null, id: null, lastmodified: 0, completed: false, priority: 0, reminder: [], timewindow: { day: { byday: [] }, time: { startminute: null, endminute: null } }, googleclassroomid: null, googleclassroomlink: null }
const MODELCALENDAR = { title: null, notes: null, id: null, googleid: null, hidden: false, hexcolor: '#2693ff', isprimary: false, subscriptionurl: null, lastmodified: 0  }
const MODELNOTIFICATION = { id: null, read: false, timestamp: null }


//EMAIL SERVICE INITIALIZATION
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses")

const sesclient = new SESClient({ 
	region: 'us-west-1',
	credentials: {
		accessKeyId: ACCESS_KEY_ID,
		secretAccessKey: SECRET_ACCESS_KEY
	}
})

async function sendEmail({ from, to, subject, htmlbody, textbody }){
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
	}

  try {
    const command = new SendEmailCommand(params)
    const response = await sesclient.send(command)
		return response
  } catch (error) {
    console.error(error)
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
						await webpush.sendNotification(item.pushSubscription, `EVENT: ${item.event.title || "New Event"} (${getFullRelativeDHMText(difference)})`, {
							TTL: 60*60*12,
							urgency: 'high'
						  })
					}catch(error){
						console.error(error)
					}
				}else if (item.type == 'task'){
					try{
						let difference = Math.floor((Date.now() - new Date(item.event.duedate).getTime())/60000)
						await webpush.sendNotification(item.pushSubscription, `TASK DUE: ${item.event.title || "New Task"} (${getFullRelativeDHMText(difference)})`, {
							TTL: 60*60*12,
							urgency: 'high'
						  })
					}catch(error){
						console.error(error)
					}
				}
			}
		}
			

		//email
		if(item.emailreminderenabled){
			if(item.type == 'event'){
				await sendEmail({
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
											Smart Calendar | Your Smart Time Management Assistant
									</p>

							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
										<p>If you wish to stop receiving these notifications, you can update your preferences in the app.<br><a href="https://smartcalendar.us/app" style="color: #2693ff; text-decoration: none;">Click here</a> to open Smart Calendar.</p>
									<p>&copy; 2023 James Tsaggaris. All rights reserved.</p>
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
					Smart Calendar | Your Personal Time Management Assistant

					If you wish to stop receiving these notifications, you can update your preferences in the app.
					(c) 2023 James Tsaggaris. All rights reserved.`
				})

			}else if(item.type == 'task'){

				await sendEmail({
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
											Smart Calendar | Your Smart Time Management Assistant
									</p>

							<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
									<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
										<p>If you wish to stop receiving these notifications, you can update your preferences in the app.<br><a href="https://smartcalendar.us/app" style="color: #2693ff; text-decoration: none;">Click here</a> to open Smart Calendar.</p>
									<p>&copy; 2023 James Tsaggaris. All rights reserved.</p>
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
					Smart Calendar | Your Personal Time Management Assistant

					If you wish to stop receiving these notifications, you can update your preferences in the app.
					(c) 2023 James Tsaggaris. All rights reserved.`
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
					.setTitle(`Event "${item.event.title}" starts ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.start)/60000))}`)
					.setDescription(`Hey ${discorduser.username}, just a quick reminder that your event [**${item.event.title || 'New Event'}**](https://smartcalendar.us/app) goes from ${getHMText(new Date(item.event.utcstart).getHours() * 60 + new Date(item.event.utcstart).getMinutes())} to ${getHMText(new Date(item.event.utcend).getHours() * 60 + new Date(item.event.utcend).getMinutes())}.`)
					.setFooter({ text: 'Smart Calendar', iconURL: `https://smartcalendar.us/logo.png` })
					.setColor(item.event.hexcolor)
				if(item.event.notes){
					embed.addFields({ name: 'Notes', value: item.event.notes })
				}

				await sendDiscordMessageToUser(discorduser, { embeds: [embed] })
			}else if(item.type == 'task'){
				const embed = new EmbedBuilder()
					.setTitle(`Task "${item.event.title}" due ${getFullRelativeDHMText(Math.floor((Date.now() - item.event.duedate)/60000))}`)
					.setDescription(`Hey ${discorduser.username}, just a quick reminder that your task [**${item.event.title || 'New Task'}**](https://smartcalendar.us/app) is due at ${getHMText(new Date(item.event.utcduedate).getHours() * 60 + new Date(item.event.utcduedate).getMinutes())}.`)
					.setFooter({ text: 'Smart Calendar', iconURL: `https://smartcalendar.us/logo.png` })
					.setColor(item.event.hexcolor)
				if(item.event.notes){
					embed.addFields({ name: 'Notes', value: item.event.notes })
				}
				
				await sendDiscordMessageToUser(discorduser, { embeds: [embed] })
			}
		}

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

			if(item.repeat.interval == null || item.repeat.frequency == null){
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




	let email = user.google_email || user.username
	if(!isEmail(email)) return

	let timezoneoffset = user.accountdata.timezoneoffset
	if(timezoneoffset == null) return

	let name = user.google_email ? user.accountdata.google.name || user.google_email : user.username

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
				discordreminderenabled: user.calendardata.discordreminderenabled
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
				discordreminderenabled: user.calendardata.discordreminderenabled
			})
		}
	}
	
	reminderscache[user.userid] = tempreminders
}


//email notifications
let reminderscache = {}
let lastreminderdate = Date.now()

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
}
initializeReminders()


//SERVER INITIALIZATION
const DOMAIN = process.env.DOMAIN
const SESSION_SECRET = process.env.SESSION_SECRET
const port = process.env.PORT || 3000

const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const formidable = require('formidable')
const compression = require('compression')
const RRule = require('rrule').RRule
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

//GOOGLE INITIALIZATION
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = `${DOMAIN}/auth/google/callback`

const { google } = require('googleapis')
const { OAuth2Client } = require('google-auth-library')

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

app.use(session({
	store: dynamostore,
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
		cookie: {
		maxAge: 604800000
	},
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

app.use('/.well-known', express.static(path.join(__dirname, '.well-known')))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public', 'css')))
app.use(express.static(path.join(__dirname, 'public', 'js')))
app.use(express.static(path.join(__dirname, 'public', 'images')))

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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
	}
})



const sessionTokens = {}
app.get('/restoreSession', async (req, res) => {
    const { token } = req.query

    if (sessionTokens[token]) {
        req.session = sessionTokens[token]

		req.session.touch()

		res.setHeader('Set-Cookie', ['connect.sid=' + req.session.id + '; Path=/; HttpOnly'])

        delete sessionTokens[token]

        res.redirect('/app')
    } else {
        res.redirect('/login')
    }
})
app.get('/auth/google/callback', async (req, res, next) => {
	try{
		const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
		const { tokens } = await googleclient.getToken(req.query.code)
		googleclient.setCredentials(tokens)
		const { data } = await googleclient.request({
			url: 'https://people.googleapis.com/v1/people/me',
			params: {
				personFields: 'emailAddresses,names,photos'
			}
		})


		//ios callback
		let state;
		const useragent = req.headers['user-agent']
		if (useragent.includes('iPhone')) {
			state = 'iOSApp'
		}

		function getfinalredirect(){
			if(state === 'iOSApp'){
				const token = crypto.randomBytes(32).toString('hex')

				sessionTokens[token] = req.session
				setTimeout(() => { delete sessionTokens[token] }, 60000)
	
				return `smartcalendar://oauth-callback?token=${token}`
			}else{
				return `/app`
			}
		}
		//here4



		//get googleid
		const ticket = await googleclient.verifyIdToken({
			idToken: tokens.id_token,
			audience: GOOGLE_CLIENT_ID,
		})
		const payload = ticket.getPayload()
		const googleid = payload.sub

		//get details
		const email = data.emailAddresses[0].value
		const name = data.names[0].displayName
		const profilepicture = data.photos[0].url
	

		let user = await getUserByGoogleId(googleid)
		if(user){
			//sign in to google account

			req.session.user = { userid: user.userid }
			req.session.tokens = tokens

			if(tokens.refresh_token) user.accountdata.refreshtoken = tokens.refresh_token
			user.accountdata.google.name = name
			user.accountdata.google.profilepicture = profilepicture
			user.accountdata.lastloggedindate = Date.now()
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
			loggedInUser.accountdata.google.profilepicture = profilepicture
			loggedInUser.accountdata.lastloggedindate = Date.now()
			await setUser(loggedInUser)

			updatefinalredirect()

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
				userWithEmail.accountdata.google.profilepicture = profilepicture
				userWithEmail.accountdata.lastloggedindate = Date.now()
				userWithEmail.googleid = googleid
				userWithEmail.google_email = email
				await setUser(userWithEmail)

				updatefinalredirect()

				return res.redirect(301, getfinalredirect())
			}
		}

		
		
		if(true){
			const newUser = addmissingpropertiestouser(new User({ google_email: email, googleid: googleid }))
			newUser.calendardata.settings.issyncingtogooglecalendar = true
			if(tokens.refresh_token) newUser.accountdata.refreshtoken = tokens.refresh_token
			newUser.accountdata.google.name = name
			newUser.accountdata.google.profilepicture = profilepicture
			newUser.accountdata.lastloggedindate = Date.now()
			await createUser(newUser)

			req.session.user = { userid: newUser.userid }
			req.session.tokens = tokens

			await sendwelcomeemail(newUser)

			updatefinalredirect()

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
		const ticket = await googleclient.verifyIdToken({
			idToken: jsontoken,
			audience: GOOGLE_CLIENT_ID,
		})
		const payload = ticket.getPayload()
		const googleid = payload.sub

		//get other data
		const email = payload.email
		const name = payload.name
		const profilepicture = payload.picture


		//code below is same as /auth/google/callback but without tokens
		//-----------------------------------------------------------


		let user = await getUserByGoogleId(googleid)
		if(user){
			//sign in to google account

			req.session.user = { userid: user.userid }

			user.accountdata.google.name = name
			user.accountdata.google.profilepicture = profilepicture
			user.accountdata.lastloggedindate = Date.now()
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
			loggedInUser.accountdata.google.profilepicture = profilepicture
			loggedInUser.accountdata.lastloggedindate = Date.now()
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
				userWithEmail.accountdata.google.profilepicture = profilepicture
				userWithEmail.accountdata.lastloggedindate = Date.now()
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
			newUser.accountdata.google.profilepicture = profilepicture
			newUser.accountdata.lastloggedindate = Date.now()
			await createUser(newUser)

			req.session.user = { userid: newUser.userid }

			await sendwelcomeemail(newUser)
			return res.redirect(301, '/app')
		}
	}catch(error){
		console.error(error)
		res.redirect(301, '/login')
	}
})




//DISCORD BOT INITIALIZATION
const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js')

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const discordclient = new Client({ intents: [GatewayIntentBits.Guilds] })

discordclient.on('ready', async () => {
	console.log(`Logged in as ${discordclient.user.tag}.`)
	discordclient.user.setActivity('your reminders', { type: ActivityType.Watching })
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
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.'})
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
				return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
		}

		let newgooglecalendardata = []
		for (const calendaritem of newgooglecalendarlist.data.items) {
		  const calendarevents = await googlecalendar.events.list({
		    calendarId: calendaritem.id,
		    timeMin: timeMin,
				timeMax: timeMax,
		  })

			if(calendarevents.status != 200){
				return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
						start = { date: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().slice(0, 10), timeZone: timezonename }
						end = { date:  new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().slice(0, 10), timeZone: timezonename }
					}else{
						start = { dateTime: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename }
						end = { dateTime: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename }
					}

					const response = await googlecalendar.events.patch({
						calendarId: requestchange.oldgooglecalendarid || 'primary',
						eventId: item.googleeventid,
						requestBody: {
							summary: item.title,
							description: item.notes,
							start: start,
							end: end,
							recurrence: recurrence = item.repeat.frequency != null && item.repeat.interval != null ? [ getRecurrenceString(item) ] : []
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
					console.error(error)
				}
				
			}else if(requestchange.type == 'createevent'){

				let item = requestchange.item

				try{
					let start, end;
					if(isAllDay(item)){
						start = { date: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().slice(0, 10), timeZone: timezonename }
						end = { date:  new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().slice(0, 10), timeZone: timezonename }
					}else{
						start = { dateTime: new Date(item.start.year, item.start.month, item.start.day, 0, item.start.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename }
						end = { dateTime: new Date(item.end.year, item.end.month, item.end.day, 0, item.end.minute).toISOString().replace('Z', timezoneoffsetstring), timeZone: timezonename }
					}

					const response = await googlecalendar.events.insert({
						calendarId: item.googlecalendarid || 'primary',
						requestBody: {
							summary: item.title,
							description: item.notes,
							start: start,
							end: end,
							recurrence: item.repeat.frequency != null && item.repeat.interval != null ? [ getRecurrenceString(item) ] : []
						},
					})
	
					if(response.status != 200){
						throw new Error(response.data?.error?.message)
					}

					responsechanges.push({ type: 'createevent', id: item.id, googleeventid: response.data.id })
				}catch(error){
					console.error(error)
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
					console.error(error)
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
					console.error(error)
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
					console.error(error)
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
					console.error(error)
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
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.'})
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
				return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		if(!user.password){
			return res.status(401).json({ error: 'You need to set a password before disconnecting.' })
		}
		if(user.google_email){
			let existinguser = await getUserByUsername(user.google_email)
			if(existinguser && existinguser.userid != user.userid){
				return res.status(401).json({ error: 'You cannot disconnect your Google account because the email is taken.' })
			}

			user.username = user.google_email
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		
		if(!username){
			return res.status(401).json({ error: 'Email does not exist.' })
		}

		const user = await getUserByAttribute(username)
		if(!user){
			return res.status(401).json({ error: 'Email does not exist.' })
		}

		if(!user.password){
			return res.status(401).json({ error: 'Use log in with Google.' })
		}
		
		if(password !== user.password){
			return res.status(401).json({ error: 'Incorrect password.' })
		}
		
		req.session.user = { userid: user.userid }
		user.accountdata.lastloggedindate = Date.now()

		await setUser(user)
		return res.redirect(301, '/app')
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		
		const user = new User({ username: username, password: password})
		await createUser(user)
		req.session.user = { userid: user.userid }

		await sendwelcomeemail(user)

		return res.redirect(301, '/app')
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
	}
})

async function sendwelcomeemail(user){
	let email = user.google_email || user.username
	let name = user.google_email ? user.accountdata.google.name || user.google_email : user.username

	if(isEmail(email)){
		await sendEmail({
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
						We know you're excited to explore Smart Calendar. If you have any questions or have feedback, please <a href="https://smartcalendar.us/contact" style="color: #2693ff; text-decoration: none;">contact us</a>. We're here for you!
				</p>
				<p style="font-size: 18px; color: #333;">
					<a href="https://smartcalendar.us/app" style="padding:8px 16px;background-color:#2693ff;color: #ffffff !important; text-decoration: none;border-radius:999px"><span style="color: #ffffff">Open the app</span></a>
				</p>
				<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
				<p style="text-align: center; font-size: 18px; color: #333;">
						Stay Productive,<br>
						Smart Calendar | Your Smart Time Management Assistant
				</p>

		<hr style="border-top: 1px solid #f4f4f4; margin: 20px 0;">
				<div style="font-size: 14px; color: #777; padding-top: 20px; text-align: center;">
					<p>If you wish to stop receiving these notifications, you can update your preferences in the app.<br><a href="https://smartcalendar.us/app" style="color: #2693ff; text-decoration: none;">Click here</a> to open Smart Calendar.</p>
				<p>&copy; 2023 James Tsaggaris. All rights reserved.</p>
				</div>

		</div>
	</body>
	</html>`,
			textbody: `Hello ${name},

	You are now a part of a group of hundreds people who use Smart Calendar to find productivity and peace in life. That's special!

	We know you're excited to explore Smart Calendar. If you have any questions or have feedback, please contact us at https://smartcalendar.us/contact. We're here for you!

	Stay Productive,
	Smart Calendar | Your Personal Time Management Assistant

	If you wish to stop receiving these notifications, you can update your preferences in the app.
	(c) 2023 James Tsaggaris. All rights reserved.`
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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

		user.accountdata.timezoneoffset = req.body.timezoneoffset

		cacheReminders(user)
		
		await setUser(user)
		
		return res.json({ data: { username: user.username, password: user.password != null, google_email: user.google_email, google: user.accountdata.google, discord: user.accountdata.discord, createddate: user.accountdata.createddate } })
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
	}
})


app.post('/sendmessage', async (req, res, next) => {
	try {
		const content = req.body.content
		const email = req.body.email
		const userid = req.session?.user?.userid

		const message = new Message({ email: email, userid: userid, content: content })
		
		try{
			await sendmessage(message)
		}catch(error){
			return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
		}

		return res.end()
	}catch(error){
		console.error(error)
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
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

	let errordata, output;
	try{
		output = await eval(`(async () => {${req.body.input}})()`)
	}catch(err){
		errordata = err.stack
	}

	return res.json({ error: errordata, output: output })
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
		return res.status(401).json({ error: 'An unexpected error occurred, please try again or contact us.' })
	}
})


app.listen(port, () => {
	console.error(`Server listening on port ${port}`)
})