self.addEventListener("push", (event) => {
  console.log("[Service Worker] Received: " + event.data.text())  
  event.waitUntil(self.registration.showNotification(event.data.text()))
})
