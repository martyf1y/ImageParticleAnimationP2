class Particle {
  constructor(sSize, startX, startY) {
    this.start = createVector(startX, startY);
    this.pos = createVector(startX, startY);
    this.tPos = createVector(startX, startY);
    this.sDist = 0;
    this.vel = createVector(0, 0);

    this.color = color(255, 255, 255, 0);
    this.sColor = color(255, 255, 255, 0);
    this.tColor = color(255, 255, 255, 0);
    this.size = sSize;
    this.visible = false;
    this.targetReached = true;
    this.speedLimit = 7;
  }

  getDist() {
    let result = this.pos.dist(this.tPos);
    return result;
  }

  checkTargetReached(dist) {
    if (dist < 1) {
      this.targetReached = true;
      this.pos.set(this.tPos);
      this.sColor = color(this.tColor);
      let alpha = this.tColor.levels[3];
      if (alpha <= 0) this.resetParticle();
    }
  }

  goToTarget() {
    let acc = p5.Vector.sub(this.tPos, this.pos);
    acc.set(acc.x * 0.5, acc.y);
    //acc.setMag(5);
    // acc.mult(0.97);
    this.vel.add(acc);
    this.vel.limit(this.speedLimit);
    this.vel.mult(0.94); // easing
    this.pos.add(this.vel);
  }

  goToColor(place) {
    let change = map(place, this.sDist, 0, 0, 1);
    this.color = lerpColor(this.sColor, this.tColor, change);
  }

  disappear(areaW, areaH) {
    this.setTargetPos(Math.random() * areaW, Math.random() * areaH);
    this.tColor.setAlpha(0);
  }

  resetParticle() {
    this.pos.set(this.start);
    this.tPos.set(this.start);
    this.vel.set(0, 0);
    this.sDist = 0;
    this.color = color(255, 255, 255, 0);
    this.sColor = color(255, 255, 255, 0);
    this.tColor = color(255, 255, 255, 0);
    this.visible = false;
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
    square(this.pos.x, this.pos.y, this.size);
  }
}
