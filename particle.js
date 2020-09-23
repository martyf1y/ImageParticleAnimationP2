class Particle {
  constructor(sSize, startX, startY) {
    this.start = createVector(startX, startY);
    this.pos = createVector(startX, startY);
    this.tPos = createVector(startX, startY);
    this.sDist = 0;
    this.vel = createVector(0, 0);

    // this.color = { r: 0, g: 0, b: 0, a: 255 };
    // this.targetColor = { r: 0, g: 0, b: 0, a: 0 };
    this.color = color(125, 125, 125, 0);
    this.sColor = color(255, 0, 0, 255);
    this.tColor = color(255, 0, 0, 255);
    this.size = sSize;
    this.visible = false;
    this.targetReached = false;
  }

  getDistance() {
    return this.pos.dist(this.tPos);
  }

  checkTargetReached(dist) {
    if (dist < 1) {
      this.pos.set(this.tPos);
      this.color = color(this.tColor);
      let alpha = this.color.levels[3];
      if (alpha <= 0) {
        this.resetParticle();
      }
      return true;
    }
    return false;
  }

  goToTarget() {
    let acc = p5.Vector.sub(this.tPos, this.pos);
    //acc.setMag(dist);
    this.vel.add(acc);
    this.vel.limit(5);
    this.vel.mult(0.98); // easing
    this.pos.add(this.vel);
  }

  updateColor(place) {
    let change = map(place, this.sDist, 0, 0, 1);
    this.color = lerpColor(this.sColor, this.tColor, change);
  }

  resetParticle() {
   // console.log("Reset?");
    this.pos.set(this.start);
    this.tPos.set(this.start);
    this.vel.set(0, 0);
    this.color = color(125, 125, 125, 0);
    this.sColor = color(255, 0, 0, 255);
    this.tColor = color(255, 0, 0, 255);
    //this.visible = false;
  }

  setTargetColor(r, g, b, a) {
    this.tColor = color(r,g,b,a);
    // this.tColor.setRed(r);
    // this.tColor.setGreen(g);
    // this.tColor.setBlue(b);
    // this.tColor.setAlpha(a);
  }

  setTargetPos(x, y) {
    this.tPos.set(x, y);
    this.targetReached = false;
  }

  show() {
    noStroke();
    rectMode(CORNER);
    fill(this.color);
    rect(this.pos.x, this.pos.y, this.size);
  }
}
