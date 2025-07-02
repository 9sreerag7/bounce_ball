const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const ballCountElem = document.getElementById('ball-count');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`;
}

class Shape {
  constructor(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= canvas.width) this.velX = -Math.abs(this.velX);
    if ((this.x - this.size) <= 0) this.velX = Math.abs(this.velX);
    if ((this.y + this.size) >= canvas.height) this.velY = -Math.abs(this.velY);
    if ((this.y - this.size) <= 0) this.velY = Math.abs(this.velY);

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (this !== balls[j] && balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = randomColor();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20, true);
    this.color = 'white';
    this.size = 15;

    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft': this.x -= this.velX; break;
        case 'ArrowRight': this.x += this.velX; break;
        case 'ArrowUp': this.y -= this.velY; break;
        case 'ArrowDown': this.y += this.velY; break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if ((this.x + this.size) >= canvas.width) this.x = canvas.width - this.size;
    if ((this.x - this.size) <= 0) this.x = this.size;
    if ((this.y + this.size) >= canvas.height) this.y = canvas.height - this.size;
    if ((this.y - this.size) <= 0) this.y = this.size;
  }

  collisionDetect() {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].exists) {
        const dx = this.x - balls[i].x;
        const dy = this.y - balls[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[i].size) {
          balls[i].exists = false;
          updateBallCount();
        }
      }
    }
  }
}

const balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, canvas.width - size),
    random(size, canvas.height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    randomColor(),
    size
  );
  balls.push(ball);
}

function updateBallCount() {
  const count = balls.filter(b => b.exists).length;
  ballCountElem.textContent = `Ball count: ${count}`;
}
updateBallCount();

const evilCircle = new EvilCircle(
  random(0, canvas.width),
  random(0, canvas.height)
);

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
