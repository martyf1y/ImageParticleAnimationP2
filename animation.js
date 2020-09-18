class Animation {
  constructor(isLoop, canvasW, canvasH) {
    this.allImages = [];
    this.index = 0;
    this.loop = isLoop;
    this.pSpacing = 2;
    this.pSize = 2;
    this.particles = [];
    this.animating = false;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.areaReleased = 0;
    this.delayEndStart = false;
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
        new Particle(this.pSize, this.canvasW / 2, this.canvasH / 2)
      );
    console.log(newParticles.length + " particles created.");
    return newParticles;
  }


  
  resetParticles() {
    let nImg = this.allImages[this.index].get();
    let pSlotSize = this.pSize + this.pSpacing;
    let totalPWide = Math.floor(this.canvasW / pSlotSize);
    let totalPHigh = Math.floor(this.canvasH / pSlotSize);
    this.areaReleased = totalPHigh;
    this.delayEndStart = false;

    this.particles = [];
    this.particles = this.createParticleArray(totalPWide, totalPHigh);

    console.log("---- NEXT IMAGE ----");

    // Image only needs to be as big as particle count
    if (nImg.width > totalPWide) nImg.resize(totalPWide, 0);
    if (nImg.height > totalPHigh) nImg.resize(0, totalPHigh);

    let colStart = Math.floor((totalPWide - nImg.width) / 2);
    let colEnd = colStart + nImg.width;
    let rowStart = Math.floor((totalPHigh - nImg.height) / 2);
    let rowEnd = rowStart + nImg.height;

    let particleIndex = 0;
    let pIndex = 0;
    let centerAdjustW = (this.canvasW % pSlotSize) / 2;
    centerAdjustW += this.pSpacing / 2;
    let centerAdjustH = (this.canvasH % pSlotSize) / 2;
    centerAdjustH += this.pSpacing / 2;

    nImg.loadPixels();
    this.particles.forEach((nParticle) => {
      let column = Math.floor(particleIndex % totalPWide);
      let row = Math.floor(particleIndex / totalPWide);
      if (
        column >= colStart &&
        column < colEnd &&
        row >= rowStart &&
        row < rowEnd
      ) {
        if (nImg.pixels[pIndex + 3] > 0) {
          nParticle.setTargetColor(
            nImg.pixels[pIndex],
            nImg.pixels[pIndex + 1],
            nImg.pixels[pIndex + 2],
            nImg.pixels[pIndex + 3]
          );
          nParticle.alive = true;
          nParticle.targetPos.set([
            column * pSlotSize + centerAdjustW,
            row * pSlotSize + centerAdjustH,
          ]);
          let initialForce = (nParticle.targetPos.y / this.canvasH - 0.5) * 10;
          nParticle.vel.y = initialForce;
        } else
          nParticle.resetParticle(
            column * pSlotSize + centerAdjustW,
            row * pSlotSize + centerAdjustH
          );
        pIndex += 4;
      } else {
        nParticle.resetParticle(
          column * pSlotSize + centerAdjustW,
          row * pSlotSize + centerAdjustH
        );
      }
      particleIndex += 1;
    });
    this.particles.sort(this.getFurthest);
  }

  getFurthest(a, b) {
    return b.pos.dist(b.targetPos) - a.pos.dist(a.targetPos);
  }

  endOfAnimCheck() {
    this.animating = this.checkNextImage();
    if (this.animating) {
      this.resetParticles();
    } else {
      console.log("----- No more animating -----");
    }
  }

  checkNextImage() {
    this.index++;
    if (this.index >= this.allImages.length) {
      this.index = 0;
      if (!this.loop) return false;
    }
    return true;
  }

  updateParticles() {
    let tAlive = 0;
    let tReleaseNow = 0;
    let aReleased = 0;
    this.particles.forEach((p) => {
      if (p.alive) {
        tAlive++;
        if (p.released) {
          p.goToTarget();
          p.goToColor();
          aReleased++;
        } else if (tReleaseNow < 15 && aReleased < 800) {
          //    p.pos.dist(p.targetPos) > this.areaReleased
          p.released = true;
          tReleaseNow++;
        }
        p.alive = p.checkTargetReached();
      }
    });
    if (tAlive == 0 && !this.delayEndStart) {
      setTimeout(() => {
        this.endOfAnimCheck();
      }, 3000);
      this.delayEndStart = true;
    }
  }

  showParticles() {
    this.particles.forEach((p) => p.released && p.show());
  }
}
