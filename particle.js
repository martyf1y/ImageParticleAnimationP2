class Particle {
  constructor(sSize) {
    this.pos = createVector();
    this.alpha = 255;
    this.col = createVector();
    this.size = sSize;
  }

  update() {
      this.pos.add(createVector(random(-1, 1), random(-1, 1)));
      this.alpha -= 2;
  }

  show() {
    noStroke();
    fill(this.col.x, this.col.y, this.col.z, this.alpha);
    rect(this.pos.x, this.pos.y, this.size);
  }
}
