import express = require('express');
const app = express();
const http = require('http').Server(app);
import io = require('socket.io');

const sock = io(http);

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

sock.on('connection', socket => {

	socket.on('honk', honkData => {
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

http.listen(80);