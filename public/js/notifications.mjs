const SERVER_KEY = "BNGLnd4LSIBUFr4PcLg5Om52NXw5_9YxieSeK-tA6FbnVlxNQ-mSRLhBJnsUW9MUK_1qX4Y1zHCJ7uWn8wubwuM"

function pushNotificationsSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

async function requestPermission() {
  return await Notification.requestPermission()
}

async function registerSW() {
  if (!pushNotificationsSupported()) throw new Error("Not supported.")
  let result;
  try {
    result = await navigator.serviceWorker.register("/service-worker.js")
  } catch (e) {
    console.error(`Service Worker registration failed: ${e}`)
  }
  return result;
}

async function subscribe() {
  const serviceWorker = await navigator.serviceWorker.ready;
  const subscription = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: SERVER_KEY
  })
  await fetch("/push-subscription", {
    headers: { "content-type": "application/json;charset=UTF-8", "sec-fetch-mode": "cors" },
    body: JSON.stringify({
      subscription: subscription,
      offset: new Date().getTimezoneOffset()
    }),
    method: "POST",
    mode: "cors",
    credentials: "include"
  })
  return subscription;
}


export { pushNotificationsSupported, requestPermission, registerSW, subscribe }