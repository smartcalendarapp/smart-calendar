const webpush = require("web-push")
webpush.setVapidDetails(
  "mailto:contact@smartcalendar.us",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

class PushNotificationManager {
  constructor(webpush, pushSubscription, user) {
    this.pushSubscription = pushSubscription;
    this.user = user;
    this.webpush = webpush
    this.queue = []
    // init
    update(user)
  }

  init(pushSubscription, user) {
    
  }
  
  update(user) {
      this.user = user
      destroy()
      for (let event of this.user.calendardata.events) {
          const start = new Date(event.start.year, event.start.month, event.start.day, 0, event.start.minute)
          let timezoneoffsetms = user.accountdata.timezoneoffset * -1 * 60000
    			start.setTime(start.getTime() - timezoneoffsetms)
          
          if (start < Date.now()) continue;
          if ((start - Date.now()) > 86400000) continue;
          let id = setTimeout(async () => {
            await this.webpush.sendNotification(pushSubscription, `Event Now: \"${event.title || "New Event"}\" (${event.start.year}-${event.start.month}-${event.start.day})`);  
          console.log(`Event Now: \"${event.title || "New Event"}\"`)
          }, start - Date.now())
        this.queue.push(id)
      }
    }
 
    destroy() {
      for (let id of this.queue) {
        clearTimeout(id)
      }
    }
  
}

module.exports = PushNotificationManager;