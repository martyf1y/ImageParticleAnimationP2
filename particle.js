class Particle {
  constructor(sSize, startX, startY) {
    this.pos = createVector(startX, startY);
    this.targetPos = createVector();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.alpha = 255;
    this.col = createVector(0, 0, 0);
    this.size = sSize;
    this.released = false;
    this.alive = false;
  }

  update() {
    if (this.pos.dist(this.targetPos) > 1) {
      // let tDirection = p5.Vector.sub(this.targetPos, this.pos);
      // tDirection.normalize();
      let ease = this.easingF(this.pos, this.targetPos);
      this.applyForce(ease);
      //  this.vel.add(this.easingF(this.pos, this.targetPos));
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
      return false;
    } else {
      this.pos = this.targetPos;
      return true;
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  easingF(pos, tPos) {
    let direction = p5.Vector.sub(tPos, pos);
    direction.normalize();
    return p5.Vector.mult(direction, 0.01);
  }

  show() {
    noStroke();
    rectMode(CORNER);
    fill(this.col.x, this.col.y, this.col.z, this.alpha);
    rect(this.pos.x, this.pos.y, this.size);
  }
}
