class Particle {
  constructor(sSize, startX, startY) {
    this.start = createVector(startX, startY);
    this.pos = createVector(startX, startY);
    this.tPos = createVector(startX, startY);
    this.sDist = 0;
    this.vel = createVector(0, 0);

    this.color = color(125, 125, 125, 0);
    this.sColor = color(255, 0, 0, 255);
    this.tColor = color(255, 0, 0, 255);
    this.size = sSize;
    this.visible = false;
    this.targetReached = false;
  }

  getDist() {
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
      this.targetReached = true;
    }
  }

  goToTarget() {
    let acc = p5.Vector.sub(this.tPos, this.pos);
    //acc.setMag(dist);
    this.vel.add(acc);
    this.vel.limit(5);
    this.vel.mult(0.98); // easing
    this.pos.add(this.vel);
  }

  goToColor(place) {
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
  setColorFromImg(img, i) {
    this.setTargetColor(
      img.pixels[i],
      img.pixels[i + 1],
      img.pixels[i + 2],
      img.pixels[i + 3]
    );
  }
  setTargetColor(r, g, b, a) {
    this.tColor = color(r, g, b, a);
    // this.tColor.setRed(r);
    // this.tColor.setGreen(g);
    // this.tColor.setBlue(b);
    // this.tColor.setAlpha(a);
  }

  setTargetPos(x, y) {
    this.tPos.set(x, y);
    this.targetReached = false;
  }

  update() {
    this.goToTarget(this.getDist());
    this.goToColor(this.getDist());
    this.checkTargetReached(this.getDist());
  }

  show() {
    noStroke();
    rectMode(CORNER);
    fill(this.color);
    rect(this.pos.x, this.pos.y, this.size);
  }
}
