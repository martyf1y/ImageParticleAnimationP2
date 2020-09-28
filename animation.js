class Animation {
  constructor(isLoop, canvasW, canvasH) {
    this.width = canvasW;
    this.height = canvasH;

    this.imageArr = [];
    this.imgInd = 0;

    this.animating = false;
    this.loop = isLoop;
    this.endAnimWait = false;
    this.outroBegin = false;

    this.particles = [];
    this.pSpacing = 5;
    this.pSize = 5;
    this.pSlotSize;
    this.pTotalWide;
    this.pTotalHigh;

    this.moveProgress = 0;
  }

  start() {
    this.resetParticles();
    this.animating = true;
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
    this.outroBegin = false;
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

  resizeImg(i) {
    if (i.width > this.pTotalWide) i.resize(this.pTotalWide, 0);
    if (i.height > this.pTotalHigh) i.resize(0, this.pTotalHigh);
    return i;
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
        else p.setTargetColor(125, 125, 125, 0);

        if (!p.visible) p.vel.y = (p.tPos.y / this.height - 0.5) * 15;
      } else if (p.visible) p.disappear(this.width, this.height);

      p.sDist = p.getDist();
      i++;
    });

    this.particles.sort(this.getFurthest);

    this.resetTriggers();
  }

  getFurthest(a, b) {
    if (a.pos.y < b.pos.y && a.visible) {
      return -1;
    } else if (b.pos.y < a.pos.y && b.visible) {
      return 1;
    } else if (a.visible) return -1;
    else if (b.visible) return 1;
    else if (a.tPos.y < b.tPos.y) return -1;
  }
  // return b.pos.dist(b.tPos) - a.pos.dist(a.tPos);

  resetTriggers() {
    this.endAnimWait = false;
    this.allowedToMove = 0;
    let timer = setInterval(() => {
      if (this.allowedToMove < 1000) this.allowedToMove += 2;
      else clearInterval(timer);
    }, 5);
  }

  outro() {
    this.outroBegin = true;
    this.particles.forEach((p) => {
      if (p.visible) {
        p.disappear(this.width, this.height);
        p.sDist = p.getDist();
        p.sColor = color(p.color);
      }
    });
    this.resetTriggers();
  }

  endOfAnimCheck() {
    if (this.checkNextImage()) this.resetTargets();
    else this.outro();
  }

  checkNextImage() {
    this.imgInd++;
    if (this.imgInd >= this.imageArr.length) {
      this.imgInd = 0;
      if (!this.loop) return false;
    }
    return true;
  }

  checkFinish(pleft) {
    if (pleft == 0 && !this.endAnimWait) {
      console.log("Animation complete");
      if (!this.outroBegin) {
        setTimeout(() => {
          this.endOfAnimCheck();
        }, 2000);
        this.endAnimWait = true;
      } else this.animation = false;
    }
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
    this.checkFinish(pNotAtTarget);
  }

  showParticles() {
    this.particles.forEach((p) => p.visible && p.show());
  }
}
