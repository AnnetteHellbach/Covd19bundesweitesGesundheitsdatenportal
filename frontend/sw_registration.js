// service worker registration from  https://developers.google.com/web/fundamentals/primers/service-workers/registration accessed on 13.01.2020
//sw should be handled as progressive enhancement
//see if service worker is available at navigator
if ('serviceWorker' in navigator) {
    // register service worker after load, because otherwise the sw registration would delay the initial page load
    window.addEventListener('load', function() {
        // the location of the service worker is important for the scope. For example, which files can be cached
      navigator.serviceWorker.register('sw.js');
    });
  }
//   end of service worker registration (from https://developers.google.com/web/fundamentals/primers/service-workers/registration)
