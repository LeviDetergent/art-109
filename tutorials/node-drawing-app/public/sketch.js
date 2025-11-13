var socket;

function setup() {
    createCanvas(600, 400);
    background(51);

    socket = io.connect('http://localhost:3000'); 
    socket.on('mouse', newDrawing); 
}

function newDrawing(data) {
    console.log(data); 
    noStroke();
    fill(255, 0, 100); 
    ellipse(data.x, data.y, 36, 36); 
}

function mouseDragged() {
    console.log(mouseX + "," + mouseY);
    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 36, 36); 

    var data = {
        x: mouseX,
        y: mouseY
    }; 
    socket.emit('mouse', data); 
}

// function draw() {
//     if (mouseIsPressed) {
//         stroke(255);
//         strokeWeight(4);
//         line(mouseX, mouseY, pmouseX, pmouseY); // Draw a line from the previous mouse position to the current mouse position
//     }
// }