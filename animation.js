class Animation {
  constructor(isLoop, canvasW, canvasH) {
    this.allImages = [];
    this.index = 0;
    this.loop = isLoop;
    this.pSpacing = 5;
    this.pSize = Math.ceil(canvasW * 0.07) / this.pSpacing;
    this.particles = [];
    this.animating = false;
    this.tempTransitionInterval;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
  }

  start() {
    this.resetParticles();
    this.animating = true;
    this.checkFinish(); // This will be removed from here and left in main draw
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

    /// if (this.particles.length != totalPWide * totalPHigh)
    this.particles = [];
    this.particles = this.createParticleArray(totalPWide, totalPHigh);

    console.log("---- NEXT IMAGE ----");
    console.log(nImg);

    console.log("Canvas Width " + this.canvasW);
    console.log("Canvas Height " + this.canvasH);

    console.log("Image Width " + nImg.width);
    console.log("Image Height " + nImg.height);

    // Image only needs to be as big as particle count
    if (nImg.width > totalPWide) nImg.resize(totalPWide, 0);
    if (nImg.height > totalPHigh) nImg.resize(0, totalPHigh);

    console.log("Resized Width " + nImg.width);
    console.log("Resized Height " + nImg.height);

    let colStart = Math.floor((totalPWide - nImg.width) / 2);
    let colEnd = colStart + nImg.width;
    let rowStart = Math.floor((totalPHigh - nImg.height) / 2);
    let rowEnd = rowStart + nImg.height;

    console.log("Columns area  " + colStart + " : " + colEnd);
    console.log("Rows area  " + rowStart + " : " + rowEnd);

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
        nParticle.col.set([
          nImg.pixels[pIndex],
          nImg.pixels[pIndex + 1],
          nImg.pixels[pIndex + 2],
        ]);
        nParticle.alpha = nImg.pixels[pIndex + 3];
        nParticle.alive = true;
        nParticle.targetPos.set([
          column * pSlotSize + centerAdjustW,
          row * pSlotSize + centerAdjustH,
        ]);
        pIndex += 4;
        // nParticle.vel = nParticle
        //   .easingF(nParticle.pos, nParticle.targetPos)
        //   .mult(200);
      } else {
        nParticle.col.set([0, 0, 0]);
        nParticle.alpha = 255;
        nParticle.alive = false;
      }
      nParticle.pos.set([
        column * pSlotSize + centerAdjustW,
        row * pSlotSize + centerAdjustH,
      ]);
      particleIndex += 1;
    });
  }

  checkFinish() {
    // this.tempTransitionInterval = setInterval(() => {
    //   this.animating = this.checkNextImage();
    //   if (this.animating) {
    //     this.resetParticles();
    //   } else {
    //     clearInterval(this.tempTransitionInterval);
    //     console.log("----- No more animating -----");
    //   }
    // }, 3000);
  }

  checkNextImage() {
    this.index++;
    if (this.index >= this.allImages.length) {
      this.index = 0;
      if (!this.loop) return false;
    }
    return true;
  }

  animateParticles() {
    let totalFinished = 0;
    let prevP = createVector(0, 0);
    let totalActive = 0;
    this.particles.forEach((p) => {
      if (p.alive && (p.released || p.pos.dist(prevP) > 5)) {
        totalActive++;
        p.released = true;
        if (p.update()) {
          totalFinished++;
          prevP = createVector(0, 0);
        } else prevP = p.pos;
        p.show();
      } else return; // No point continuing if not all particles are out.
    });

    // if (totalFinished == totalActive) {
    //   this.animating = this.checkNextImage();
    //   if (this.animating) {
    //     this.resetParticles();
    //   } else {
    //     clearInterval(this.tempTransitionInterval);
    //     console.log("----- No more animating -----");
    //   }
    // }
  }
}
