var V='mining-v5';
function notify(){self.clients.matchAll().then(function(cs){cs.forEach(function(c){c.postMessage('update')})})}
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(['./','index.html','icon.png','manifest.webmanifest'])}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!=V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
 var u=new URL(e.request.url);
 if(e.request.method!='GET')return;
 if(u.origin!=location.origin&&!/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(u.host))return;
 e.respondWith(caches.match(e.request).then(function(hit){
  var net=fetch(e.request).then(function(r){
   if(r.ok||r.type=='opaque'){var cl=r.clone();caches.open(V).then(function(c){c.put(e.request,cl)});
    if(hit&&r.ok&&e.request.mode=='navigate'){var a=hit.headers.get('etag'),b=r.headers.get('etag');if(a&&b&&a!==b)notify()}}
   return r}).catch(function(){return hit});
  return hit||net}))});
