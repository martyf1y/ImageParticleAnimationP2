class Animation {
  constructor(isLoop, aWidth, aHeight) {
    this.allImages = [];
    this.index = 0;
    this.loop = isLoop;
    this.pSize = Math.ceil(aWidth * 0.01);
    this.particles = [];
    this.animating = false;
    this.tempTransitionInterval;
    this.aWidth = aWidth;
    this.aHeight = aHeight;  
  }

  start() {
    this.resetParticles();
    this.animating = true;
    this.checkFinish(); // This will be removed from here and left in main draw
  }

  addImagesfromBasket(images) {
    this.allImages = images;
  }

  createParticleArray(w, h) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        this.particles.push(new Particle(this.pSize));
      }
    }
    console.log(this.particles.length + " particles created.");
  }

  resetParticles() {
    let nImg = this.allImages[this.index];
    let particleW = Math.ceil(this.aWidth / this.pSize);
    let particleH = Math.ceil(this.aHeight / this.pSize);

    if (this.particles.length == 0)
      this.createParticleArray(particleW, particleH);

    console.log("---- NEXT IMAGE ----");
    console.log(nImg);

    console.log("Canvas Width " + particleW);
    console.log("Canvas Height " + particleH);

    console.log("Image Width " + nImg.width);
    console.log("Image Height " + nImg.height);

    if (nImg.width > particleW) nImg.resize(particleW, 0);
    if (nImg.height > particleH) nImg.resize(0, particleH);

    console.log("Resized Width " + nImg.width);
    console.log("Resized Height " + nImg.height);

    let colStart = Math.floor((particleW - nImg.width) / 2);
    let colEnd = colStart + nImg.width;
    let rowStart = Math.floor((particleH - nImg.height) / 2);
    let rowEnd = rowStart + nImg.height;

    console.log("Columns area  " + colStart + " : " + colEnd);
    console.log("Rows area  " + rowStart + " : " + rowEnd);

    let i = 0;
    let pIndex = 0;
    nImg.loadPixels();
    this.particles.forEach((nParticle) => {
      let column = Math.floor(i % particleW);
      let row = Math.floor(i / particleW);
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
        pIndex += 4;
      } else {
        nParticle.col.set([0, 0, 0]);
        nParticle.alpha = 0;
      }
      nParticle.pos.set([column * this.pSize, row * this.pSize]);
      i += 1;
    });
  }

  checkFinish() {
    this.tempTransitionInterval = setInterval(() => {
      this.animating = this.checkNextImage();
      if (this.animating) {
        this.resetParticles();
      } else {
        clearInterval(this.tempTransitionInterval);
        console.log("----- No more animating -----");
      }
    }, 3000);
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
    animation.particles.forEach((p) => {
      p.update();
      p.show();
    });
  }
}
