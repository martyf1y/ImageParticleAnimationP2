class Particle {
  constructor(sSize, startX, startY) {
    this.pos = createVector(startX, startY);
    this.targetPos = createVector();
    this.vel = createVector(0, 0);
    // this.color = { r: 0, g: 0, b: 0, a: 255 };
    // this.targetColor = { r: 0, g: 0, b: 0, a: 0 };
    this.color = color(125, 125, 125, 255);
    this.targetColor = color(0, 0, 0, 255);
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
    } else this.pos = this.targetPos;
  }

  checkTargetReached() {
    if (
      this.pos == this.targetPos &&
      this.color.toString() == this.targetColor.toString()
    )
      return false;
    return true;
  }

  goToColor() {
    this.color = lerpColor(this.color, this.targetColor, 0.95);
  }

  resetParticle(x, y) {
    this.setTargetColor(125, 125, 125, 0);
    this.alive = false;
    this.released = false;
    this.pos.set([x, y]);
  }

  setTargetColor(r, g, b, a) {
    this.targetColor.setRed(r);
    this.targetColor.setGreen(g);
    this.targetColor.setBlue(b);
    this.targetColor.setAlpha(a);
  }

  show() {
    noStroke();
    rectMode(CORNER);
    fill(this.color);
    rect(this.pos.x, this.pos.y, this.size);
  }
}
