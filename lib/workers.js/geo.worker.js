import geolib from 'geolib'

self.addEventListener('message', (event) => {
	console.warn('worker received: ', event.data)
})
self.postMessage('from worker')
