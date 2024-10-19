import * as express from 'express';
import http = require('http');
import { Server } from 'socket.io';

const app = express();

const server = new http.Server(app);

const sock = new Server(server)

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('img'))

app.get(["/", "/index", "/index.html"], function(req, res) {
	res.render('index');
});

function clamp(num : number, min : number, max : number) : number {
	return num <= min ? min : num >= max ? max : num;
}

function safeClamp(num : any, min : number, max : number) : number {
	if (num == undefined || isNaN(num)) {
		return min;
	}
	return clamp(num, min, max);
}

let activeUsers = 0;
const honkMax = 400;
const resetMillis = 1000*30;

sock.on('connection', socket => {
	let resetTime = Date.now();
	let honkCount = honkMax;

	socket.on('honk', honkData => {
		const now = Date.now();
		if (honkCount <= 0) {
			if (now - resetTime > resetMillis) {
				honkCount = honkMax;
				resetTime = now;
			}
		}

		if (honkCount <= 0) {
			return;
		}

		honkCount--;

		const safeHonk = {
			x: safeClamp(honkData.x, 0, 1),
			y: safeClamp(honkData.y, 0, 1),
			ang: safeClamp(honkData.ang, 0, 1),
			color: Math.round(safeClamp(honkData.color, 0, 7))
		}
		socket.broadcast.emit('honk', safeHonk)
	})


	activeUsers = clamp(activeUsers+1, 0, 99999999999999);
	sock.emit('honkers', activeUsers);
	
	socket.on('disconnect', () => {
		activeUsers = clamp(activeUsers-1, 0, 99999999999999);
		socket.broadcast.emit('honkers', activeUsers);
	});

})

console.log("Listening on 3000")
server.listen(3000);