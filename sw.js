importScripts('js/sw-utils.js')

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE= 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'js/app.js',
    'js/sw-utils.js',
]

const APP_SHELL_INMUTABLE = [
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'css/animate.css',
    'js/libs/jquery.js',

];

//Install SW
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
                            .then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
                                    .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

//Activate SW
self.addEventListener('activate', e =>{
    
    const resp = caches.keys().then( keys =>{
        keys.forEach ( key => {
            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        }) 
    });
    e.waitUntil(resp);
});

// Fetch Listener

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then(resp => {
        if(resp){
            return resp;
        }else{
            return fetch(e.request).then( newResp => {
                return actualizaCacheDinamico(DYNAMIC_CACHE,e.request, newResp);
            });
        }
    });

    e.respondWith(respuesta);

});