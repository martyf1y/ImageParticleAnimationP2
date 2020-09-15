class Particle {
  constructor(sSize, startX, startY) {
    this.pos = createVector(startX, startY);
    this.targetPos = createVector();
    this.vel = createVector(0, 0);
    this.color = { r: 0, g: 0, b: 0, a: 255 };
    this.size = sSize;
    this.released = false;
    this.alive = false;
  }

  goToTarget() {
    let tDist = this.pos.dist(this.targetPos);
    if (tDist > 1) {
      let acc = p5.Vector.sub(this.targetPos, this.pos);
      //acc.setMag(tDist);
      this.vel.add(acc);
      this.vel.limit(5);
      this.vel.mult(0.98); // easing
      this.pos.add(this.vel);
    } else {
      this.pos = this.targetPos;
      this.alive = false;
    }
  }

  resetParticle(x, y) {
    this.setColor(255, 0, 0, 255);
    this.alive = false;
    this.released = false;
    this.pos.set([x, y]);
  }

  setColor(r, g, b, a) {
    this.color.r = r;
    this.color.g = g;
    this.color.b = b;
    this.color.a = a;
  }

  show() {
    noStroke();
    rectMode(CORNER);
    fill(this.color.r, this.color.g, this.color.b, this.color.a);
    rect(this.pos.x, this.pos.y, this.size);
  }
}
