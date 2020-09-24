class Animation {
  constructor(isLoop, canvasW, canvasH) {
    this.width = canvasW;
    this.height = canvasH;

    this.allImages = [];
    this.imgI = 0;

    this.animating = false;
    this.loop = isLoop;
    this.delayEnd = false;

    this.particles = [];
    this.pSpacing = 5;
    this.pSize = 5;
    this.pSlotSize;
    this.pTotalWide;
    this.pTotalHigh;
  }

  start() {
    this.resetParticles();
    this.animating = true;
  }

  addImagesfromBasket(images) {
    this.allImages = images;
  }

  createParticleArray(tWide, tHigh) {
    let newParticles = [];
    for (let i = 0; i < tWide * tHigh; i++)
      newParticles.push(
        new Particle(this.pSize, this.width / 2, this.height / 2)
      );
    console.log(newParticles.length + " particles created.");
    return newParticles;
  }

  resetParticles() {
    this.pSlotSize = this.pSize + this.pSpacing;
    this.pTotalWide = Math.floor(this.width / this.pSlotSize);
    this.pTotalHigh = Math.floor(this.height / this.pSlotSize);
    this.particles = [];
    this.particles = this.createParticleArray(this.pTotalWide, this.pTotalHigh);
    this.resetTargets();
  }

  shuffleArray(array) {
    for (let i = 0; i < array.length; i++) {
      let rIndex = Math.floor(Math.random() * i);
      let temp = array[i];
      array[i] = array[rIndex];
      array[rIndex] = temp;
    }
    return array;
  }

  insideArea(x, y, x1, x2, y1, y2) {
    return x >= x1 && x < x2 && y >= y1 && y < y2;
  }

  resetTargets() {
    console.log("---- NEXT IMAGE ----");
    const img = this.allImages[this.imgI].get();
    console.log("Image size " + img.width + " " + img.height);
    // Image only needs to be as big as particle count
    if (img.width > this.pTotalWide) img.resize(this.pTotalWide, 0);
    if (img.height > this.pTotalHigh) img.resize(0, this.pTotalHigh);

    const cStart = Math.floor((this.pTotalWide - img.width) / 2);
    const cEnd = cStart + img.width;
    const rStart = Math.floor((this.pTotalHigh - img.height) / 2);
    const rEnd = rStart + img.height;

    const sSize = this.pSlotSize;
    const centerAdjW = ((this.width % sSize) + this.pSpacing) * 0.5;
    const centerAdjH = ((this.height % sSize) + this.pSpacing) * 0.5;

    // Randommise particles array
    this.particles = this.shuffleArray(this.particles);

    img.loadPixels();
    let pIndex = 0;
    let pixI = 0;
    this.particles.forEach((nParticle) => {
      nParticle.atTarget = false;
      const col = Math.floor(pIndex % this.pTotalWide);
      const row = Math.floor(pIndex / this.pTotalWide);
      const insideImg = this.insideArea(col, row, cStart, cEnd, rStart, rEnd);
      const pixHasAlpha = img.pixels[pixI + 3] > 0;
      // Set target Pos
      if (nParticle.visible || (insideImg && pixHasAlpha))
        nParticle.setTargetPos(
          col * sSize + centerAdjW,
          row * sSize + centerAdjH
        );
      // Set target colour
      if (insideImg && pixHasAlpha) nParticle.setColorFromImg(img, pixI);
      else nParticle.setTargetColor(125, 125, 125, 0);
      // Set start velocity
      if (!nParticle.visible)
        nParticle.vel.set(0, (nParticle.tPos.y / this.height - 0.5) * 15);

      nParticle.sDist = nParticle.getDist();
      nParticle.sColor = color(nParticle.color);
      if (insideImg) pixI += 4;
      pIndex += 1;
    });

    // this.particles.sort(this.getFurthest);
    this.delayEnd = false;
  }

  getFurthest(a, b) {
    // return b.pos.dist(b.tPos) - a.pos.dist(a.tPos);
    return a.pos.y - b.pos.y || a.tPos.y - b.tPos.y;
  }

  endOfAnimCheck() {
    this.animating = this.checkNextImage();
    if (this.animating) this.resetTargets();
    else console.log("----- No more animating -----");
  }

  checkNextImage() {
    this.imgI++;
    if (this.imgI >= this.allImages.length) {
      this.imgI = 0;
      if (!this.loop) return false;
    }
    return true;
  }

  checkFinish(pleft) {
    if (pleft == 0 && !this.delayEnd) {
      console.log("Animation complete");
      setTimeout(() => {
        this.endOfAnimCheck();
      }, 2000);
      this.delayEnd = true;
    }
  }

  updateParticles() {
    let tShowNow = 0;
    let pNotAtTarget = 0;
    this.particles.forEach((p) => {
      if (!p.targetReached) pNotAtTarget++;
      else return;

      if (p.visible && pNotAtTarget < 1000) p.update();
      else if (tShowNow < 15) {
        p.visible = true;
        tShowNow++;
      }
    });

    this.checkFinish(pNotAtTarget);
  }

  showParticles() {
    this.particles.forEach((p) => p.visible && p.show());
  }
}
