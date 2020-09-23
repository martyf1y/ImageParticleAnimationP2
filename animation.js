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

    this.pMovingAtOnce = 15;
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

  resetTargets() {
    console.log("---- NEXT IMAGE ----");
    const nImg = this.allImages[this.imgI].get();
    console.log("Image size " + nImg.width + " " + nImg.height);
    // Image only needs to be as big as particle count
    if (nImg.width > this.pTotalWide) nImg.resize(this.pTotalWide, 0);
    if (nImg.height > this.pTotalHigh) nImg.resize(0, this.pTotalHigh);

    const cStart = Math.floor((this.pTotalWide - nImg.width) / 2);
    const cEnd = cStart + nImg.width;
    const rStart = Math.floor((this.pTotalHigh - nImg.height) / 2);
    const rEnd = rStart + nImg.height;

    const sSize = this.pSlotSize;
    const centerAdjW = ((this.width % sSize) + this.pSpacing) * 0.5;
    const centerAdjH = ((this.height % sSize) + this.pSpacing) * 0.5;

    // Randommise particles array
    this.particles = this.shuffleArray(this.particles);

    nImg.loadPixels();
    let pIndex = 0;
    let pixI = 0;
    this.particles.forEach((nParticle) => {
      nParticle.atTarget = false;
      const col = Math.floor(pIndex % this.pTotalWide);
      const row = Math.floor(pIndex / this.pTotalWide);
      const insideImg =
        col >= cStart && col < cEnd && row >= rStart && row < rEnd;
      //  console.log(nImg.pixels[pixI + 2]);
      if (nParticle.visible || (insideImg && nImg.pixels[pixI + 3] > 0)) {
        nParticle.setTargetPos(
          col * sSize + centerAdjW,
          row * sSize + centerAdjH
        );
      }

      if (insideImg && nImg.pixels[pixI + 3] > 0) {
        nParticle.setTargetColor(
          nImg.pixels[pixI],
          nImg.pixels[pixI + 1],
          nImg.pixels[pixI + 2],
          nImg.pixels[pixI + 3]
        );
      } else {
        nParticle.setTargetColor(125, 125, 125, 0);
      }

      if (!nParticle.visible) {
        nParticle.vel.y = (nParticle.tPos.y / this.height - 0.5) * 15;
        nParticle.vel.x = 0;
      }
      if (insideImg) {
        pixI += 4;
      }

      nParticle.sDist = nParticle.getDistance();
      nParticle.sColor = color(nParticle.color);
      pIndex += 1;
    });
   // this.particles.sort(this.getFurthest);
    this.delayEnd = false;
    this.pMovingAtOnce = 15;
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

  updateParticles() {
    let tNotAtTarget = 0;
    let tShowNow = 0;
    let tMoving = 0;
    if (!this.delayEnd) {
      this.particles.forEach((p) => {
        let dist = p.getDistance();
        if (!p.targetReached) {
          tNotAtTarget++;
          if (p.visible && tMoving < this.pMovingAtOnce) {
            p.goToTarget(dist);
            p.updateColor(dist);
            p.targetReached = p.checkTargetReached(dist);
            tMoving++;
          } else if (tShowNow < 15) {
            p.visible = true;
            tShowNow++;
          }
        }
        if (this.pMovingAtOnce < 1000) {this.pMovingAtOnce++;}
      });

      if (tNotAtTarget == 0) {
        console.log("Anim complete");
        setTimeout(() => {
          this.endOfAnimCheck();
        }, 2000);
        this.delayEnd = true;
      }
    }
  }

  showParticles() {
    this.particles.forEach((p) => p.visible && p.show());
  }
}
