let canvas;
let particles = [];
let embers = [];
let brands = [];

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", -2);
    
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-0.5, 0.5),
            vy: random(-0.3, 0.3),
            alpha: random(30, 80),
            size: random(2, 6),
            life: 255
        });
    }
    
    for (let i = 0; i < 30; i++) {
        embers.push({
            x: random(width),
            y: height + random(50),
            vy: random(-0.5, -1.5),
            vx: random(-0.3, 0.3),
            size: random(1, 3),
            alpha: random(150, 255),
            flicker: random(20, 50)
        });
    }
    
    for (let i = 0; i < 8; i++) {
        brands.push({
            x: random(width),
            y: random(height),
            size: random(40, 80),
            alpha: 0,
            targetAlpha: random(20, 60),
            fadeSpeed: random(0.3, 0.8),
            rotation: random(TWO_PI),
            rotSpeed: random(-0.002, 0.002)
        });
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // gradient background
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(10, 0, 0), color(0, 0, 0), inter);
        stroke(c);
        line(0, y, width, y);
    }
    
    for (let i = 0; i < brands.length; i++) {
        let b = brands[i];
        
        // fade in and out
        if (b.alpha < b.targetAlpha) {
            b.alpha += b.fadeSpeed;
        } else {
            b.alpha -= b.fadeSpeed * 0.5;
            if (b.alpha <= 0) {
                b.targetAlpha = random(20, 60);
            }
        }
        
        b.rotation += b.rotSpeed;
        
        // draw the symbol
        push();
        translate(b.x, b.y);
        rotate(b.rotation);
        fill(139, 0, 0, b.alpha);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(b.size);
        text('𒉭', 0, 0);
        pop();
    }
    
    // update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.5;
        
        // wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        // draw particle
        noStroke();
        fill(139, 0, 0, p.alpha * (p.life / 255));
        ellipse(p.x, p.y, p.size);
        
        // remove dead particles
        if (p.life < 0) {
            particles.splice(i, 1);
        }
    }
    
    // update embers
    for (let i = 0; i < embers.length; i++) {
        let e = embers[i];
        
        e.y += e.vy;
        e.x += e.vx;
        e.flicker = random(20, 50);
        
        // draw ember
        noStroke();
        fill(220, 20, 60, e.alpha + e.flicker);
        ellipse(e.x, e.y, e.size);
        
        // glow
        fill(255, 100, 0, (e.alpha + e.flicker) * 0.3);
        ellipse(e.x, e.y, e.size * 2);
        
        // reset when off screen
        if (e.y < -50) {
            e.x = random(width);
            e.y = height + random(50);
            e.vy = random(-0.5, -1.5);
            e.vx = random(-0.3, 0.3);
        }
    }
    
    // add more particles to keep it going
    while (particles.length < 50) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-0.5, 0.5),
            vy: random(-0.3, 0.3),
            alpha: random(30, 80),
            size: random(2, 6),
            life: 255
        });
    }
}

function mouseMoved() {
    for (let i = 0; i < 3; i++) {
        particles.push({
            x: mouseX + random(-20, 20),
            y: mouseY + random(-20, 20),
            vx: random(-2, 2),
            vy: random(-2, 2),
            alpha: random(100, 200),
            size: random(3, 8),
            life: 255,
            gravity: true
        });
    }
}

function draw() {
    // gradient background
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(10, 0, 0), color(0, 0, 0), inter);
        stroke(c);
        line(0, y, width, y);
    }
    
    for (let i = 0; i < brands.length; i++) {
        let b = brands[i];
        
        if (b.alpha < b.targetAlpha) {
            b.alpha += b.fadeSpeed;
        } else {
            b.alpha -= b.fadeSpeed * 0.5;
            if (b.alpha <= 0) {
                b.targetAlpha = random(20, 60);
            }
        }
        
        b.rotation += b.rotSpeed;
        
        push();
        translate(b.x, b.y);
        rotate(b.rotation);
        fill(139, 0, 0, b.alpha);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(b.size);
        text('𒉭', 0, 0);
        pop();
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.gravity ? 3 : 0.5;
        
        if (p.gravity) {
            p.vy += 0.1;
            p.vx *= 0.98;
            p.vy *= 0.98;
        }
        
        if (!p.gravity) {
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        }
        
        noStroke();
        if (p.gravity) {
            fill(220, 20, 60, p.alpha * (p.life / 255));
        } else {
            fill(139, 0, 0, p.alpha * (p.life / 255));
        }
        ellipse(p.x, p.y, p.size);
        
        if (p.life < 0) {
            particles.splice(i, 1);
        }
    }
    
    for (let i = 0; i < embers.length; i++) {
        let e = embers[i];
        
        e.y += e.vy;
        e.x += e.vx;
        e.flicker = random(20, 50);
        
        noStroke();
        fill(220, 20, 60, e.alpha + e.flicker);
        ellipse(e.x, e.y, e.size);
        
        fill(255, 100, 0, (e.alpha + e.flicker) * 0.3);
        ellipse(e.x, e.y, e.size * 2);
        
        if (e.y < -50) {
            e.x = random(width);
            e.y = height + random(50);
            e.vy = random(-0.5, -1.5);
            e.vx = random(-0.3, 0.3);
        }
    }
    
    while (particles.length < 50) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-0.5, 0.5),
            vy: random(-0.3, 0.3),
            alpha: random(30, 80),
            size: random(2, 6),
            life: 255
        });
    }
}