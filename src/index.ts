import express = require('express');
const app = express();
const http = require('http').Server(app);
import io = require('socket.io');

const sock = io(http);

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('img'))

app.get('/', function(req, res) {
	res.render('index');
});

function clamp(num : number, min : number, max : number) : number {
	return num <= min ? min : num >= max ? max : num;
}

sock.on('connection', socket => {

	socket.on('honk', honkData => {
		const safeHonk = {
			x: clamp(honkData.x, 0, 1),
			y: clamp(honkData.y, 0, 1),
			ang: clamp(honkData.ang, 0, 1)
		}
		socket.broadcast.emit('honk', safeHonk)
	})

})

http.listen(80);