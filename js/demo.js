const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const base64UrlToUint8Array = base64UrlData => {
  const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
  const base64 = (base64UrlData + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

const check = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
};

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register("service.js");
  return swRegistration;
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
};

const setUpPushPermission = async () => {
    await navigator.serviceWorker.ready
    .then((serviceWorkerRegistration) => {
      return serviceWorkerRegistration.pushManager.getSubscription();
    })
    .then((subscription) => {
      if (!subscription) {
        return;
      }
      console.log(subscription);
    })
    .catch((err) => {
      console.log('setUpPushPermission() ', err);
    });
  }

const subscribePush = async () => {
    await navigator.serviceWorker.ready
    .then((serviceWorkerRegistration) => {
      const ask = base64UrlToUint8Array(
        "BKmYQW_V8jpiQ0buqGIHurfxGX9gZWqrJhJRClBCj_jQXrc0c-LjIJs3v_c3S5Xm5xkfWYh8YoUzHj6wguF4Brs"
      );
      console.log(ask)
      const options = { applicationServerKey: ask, userVisibleOnly: true };
      return serviceWorkerRegistration.pushManager.subscribe(options);
    })
    .then((subscription) => {
      console.log(JSON.stringify(subscription, null, 2));
      if (!subscription) {
        return;
      }
    })
    .catch((err) => {
      console.log('subscribePush() ', err);
    });
}

const main = async () => {
  check();
  const swRegistration = await registerServiceWorker();
  const permission = await requestNotificationPermission();
  const subscribe = await subscribePush();
  const setUp = await setUpPushPermission();
};
// main(); we will not call main in the beginning.
