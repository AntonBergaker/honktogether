const honkButton = document.getElementById("honk_me");
const honkCollection = document.getElementById("honk_collection");
const socket = io();

function randomRange(x1, x2) {
    return x1 + (x2-x1)*Math.random();
}


function createHonk(x, y, angle) {
    const honk = document.createElement("img");

    honk.src = "./honk.png";
    honk.className = "honk";
    honk.style.transform = "rotate(" + (-15 + angle*30) + "deg)";
    x *= (window.innerWidth-150);
    y *= (window.innerHeight-50);
    honk.style.top = y;
    honk.style.left = x;
    const audio = new Audio('honk.ogg');
    audio.playbackRate = randomRange(0.75, 1.25);
    audio.play();

    setTimeout(function() {
        honk.classList.add("fade");
        setTimeout(function() {
            honk.remove();
        }, 300);
    }, 500);
    honkCollection.appendChild(honk);
}

honkButton.addEventListener("mousedown", function() {
    this.src = "./honking.png";

    let x, y;

    do {
        x = Math.random();
        y = Math.random();
    } while( Math.abs(x-0.5) < 0.1 && Math.abs(y-0.5) < 0.1 )

    const ang = Math.random();

    socket.emit('honk', {
        x: x,
        y: y,
        ang: ang
    });
    createHonk(x, y, ang);
});

socket.on('honk', function(honkData) {
    createHonk(honkData.x, honkData.y, honkData.ang);
});