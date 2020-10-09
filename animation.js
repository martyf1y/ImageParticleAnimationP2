class Animation {
  constructor(isLoop, canvasW, canvasH) {
    this.width = canvasW;
    this.height = canvasH;

    this.imageArr = [];
    this.imgInd = 0;

    this.animating = false;
    this.loop = isLoop;
    this.transitioning = false;
    this.pause;
    this.endAnimation = false;

    this.particles = [];
    this.pSpacing = 3;
    this.pSize = 4;
    this.pSlotSize;
    this.pTotalWide;
    this.pTotalHigh;
  }

  start() {
    this.resetParticles();
    this.animating = true;
    console.log("Animation Started");
  }

  end() {
    this.resetParticles();
    this.endAnimation = false;
    this.animating = false;
    console.log("Animation Finished");
  }

  addImagesfromBasket(images) {
    this.imageArr = images;
  }

  createParticleArray(tWide, tHigh) {
    let p = [];
    for (let i = 0; i < tWide * tHigh; i++)
      p.push(new Particle(this.pSize, this.width / 2, this.height / 2));
    return p;
  }

  resetParticles() {
    clearTimeout(this.pause);
    this.transitioning = false;
    this.outroBegin = false;
    this.pSlotSize = this.pSize + this.pSpacing;
    this.pTotalWide = Math.floor(this.width / this.pSlotSize);
    this.pTotalHigh = Math.floor(this.height / this.pSlotSize);
    this.particles = [];
    this.particles = this.createParticleArray(this.pTotalWide, this.pTotalHigh);
    this.resetTargets();
  }

  resetTargets() {
    let img = this.resizeImg(this.imageArr[this.imgInd].get());
    img.loadPixels();

    const cStart = Math.floor((this.pTotalWide - img.width) / 2);
    const rStart = Math.floor((this.pTotalHigh - img.height) / 2);

    const sSize = this.pSlotSize;
    const centerAdjW = ((this.width % sSize) + this.pSpacing) * 0.5;
    const centerAdjH = ((this.height % sSize) + this.pSpacing) * 0.5;

    this.particles = this.shuffleArray(this.particles);
    this.particles.sort((a, b) => (a.visible ? -1 : 1));

    let i = 0;
    this.particles.forEach((p) => {
      const pixI = i * 4;
      const inImg = pixI < img.pixels.length;

      if (inImg) {
        const pixHasAlpha = img.pixels[pixI + 3] > 0;
        if (pixHasAlpha || p.visible) {
          const col = cStart + Math.floor(i % img.width);
          const row = rStart + Math.floor(i / img.width);
          p.setTargetPos(col * sSize + centerAdjW, row * sSize + centerAdjH);
        }

        if (pixHasAlpha) p.setColorFromImg(img, pixI);
        else p.setTargetColor(255, 255, 255, 0);

        if (!p.visible) p.vel.y = (p.tPos.y / this.height - 0.5) * 15;
      } else if (p.visible) p.disappear(this.width, this.height);

      p.sDist = p.getDist();
      i++;
    });

    this.particles.sort(this.visibleHighestOrder);
    this.resetParticleUpdater();
  }

  resetParticleUpdater() {
    this.allowedToMove = 0;
    let timer = setInterval(() => {
      if (this.allowedToMove < 1000) this.allowedToMove += 2;
      else clearInterval(timer);
    }, 5);
  }

  update() {
    let particlesComplete = this.updateParticles();
    if (particlesComplete && this.endAnimation) this.end();
    else if (particlesComplete && !this.transitioning) this.transition();
  }

  updateParticles() {
    let tShowNow = 0;
    let pNotAtTarget = 0;
    this.particles.forEach((p) => {
      if (!p.targetReached) pNotAtTarget++;
      else return;

      if (p.visible && pNotAtTarget < this.allowedToMove) p.update();
      else if (tShowNow < 15) {
        p.visible = true;
        tShowNow++;
      }
    });
    return pNotAtTarget > 0 ? false : true;
  }

  show() {
    this.particles.forEach((p) => p.visible && p.show());
  }

  transition() {
    this.transitioning = true;
    this.pause = setTimeout(() => {
      if (this.getNextImage()) this.resetTargets();
      else this.startOutro();
      this.transitioning = false;
    }, 2000);
  }

  getNextImage() {
    this.imgInd++;
    if (this.imgInd >= this.imageArr.length) {
      this.imgInd = 0;
      if (!this.loop) return false;
    }
    return true;
  }

  startOutro() {
    this.particles.forEach((p) => {
      if (p.visible) {
        p.disappear(this.width, this.height);
        p.sDist = p.getDist();
        p.sColor = color(p.color);
      }
    });
    this.resetParticleUpdater();
    this.endAnimation = true;
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

  visibleHighestOrder(a, b) {
    if (a.pos.y < b.pos.y && a.visible) {
      return -1;
    } else if (b.pos.y < a.pos.y && b.visible) {
      return 1;
    } else if (a.visible) return -1;
    else if (b.visible) return 1;
    else if (a.tPos.y < b.tPos.y) return -1;
  }

  resizeImg(i) {
    if (i.width > this.pTotalWide) i.resize(this.pTotalWide, 0);
    if (i.height > this.pTotalHigh) i.resize(0, this.pTotalHigh);
    return i;
  }
}
