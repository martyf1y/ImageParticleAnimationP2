/*
https://codepen.io/vinsongrant/details/MKwebd
- Locate all images in the animation class DONE
- Check there is a useable image to go with object else return error message and skip object DONE
  - Check there is an actual image as well
- Else create object (Arguments are image source and div)
- Once all tags are checked create a promise to go though each animation once the previous is done
- There is only one object as they image gets replaced with each particle transition

Class Object running (start with on click)
- Variables - targetPos, startPos
- Load image into object
- resize the images to the width of the local Div (check this is required)
Function Create New Array
  - Create particle array (class)
  - Check opacity for pixel is not below a certain amount
  - set each particle to the color of the image pixel
  - Give targets within location of DIV
- Run function of the behaviour of the particles
Function to know when animation has finished after certain amount of time
*/

const domClassNames = "ImagesToAnimate";
const imageFolder = "images/";

let animation;

function preload() {
  collectImages().catch((err) => console.error(err));
}

function setup() {
  createCanvas(500, 500);
  // noLoop();
}

function draw() {
  //background(0);

  if (animation != null && animation.animating) {
    
    animation.draw();
  }
}

function addImagetoAnimation(img) {
  if (animation == null) {
    animation = new Animation(true);
    console.log("Created new animation object!");
    animation.addImage(img);
    animation.start();
  } else animation.addImage(img);
}

class Animation {
  constructor(loop) {
    this.allImages = [];
    this.index = 0;
    this.loop = loop;
    this.imagePixelSize = 10;
    this.particles;
    this.cImage; // current
    this.animating = false;
  }

  start() {
    this.cImage = this.allImages[this.index];
    this.animating = true;
    animation.update();
  }

  addImage(img) {
    this.allImages.push(img);
    console.log("Added image to object! Num: " + this.allImages.length);
    console.log(this.allImages[0].width);
  }

  checkNextImage() {
    this.index++;
    if (this.index >= this.allImages.length ) {
      this.index = 0;
      if (!this.loop) return false;
    }
    return true;
  }

  update() {
    setInterval(() => {
      this.animating = this.checkNextImage();
      if (this.animating) {
        this.cImage = this.allImages[this.index];
        console.log("Next!");
      }
    }, 1000);
  }

  draw() {
    let w = width / this.imagePixelSize;

    fill(255);
    image(
      this.cImage,
      0,
      0,
      height / (this.cImage.height / this.cImage.width),
      height
    );

    // this.cImage.loadPixels();
    // for (let x = 0; x < this.cImage.width; x++) {
    //   for (let y = 0; y < this.cImage.height; y++) {
    //     let i = (x + y * this.cImage.width) * 4;
    //     let r = this.cImage.pixels[i + 0];
    //     let g = this.cImage.pixels[i + 1];
    //     let b = this.cImage.pixels[i + 2];

    //     noStroke();
    //     fill(r, g, b);
    //     rect(x * w, y * w, w, w);
    //   }
    // }
  }
}

async function collectImages() {
  // or toAnimateList = findImagesFromClass("ImagesToAnimate");
  let imagePaths = await findImagesFromFolder(imageFolder);
  loadImagesToAnimation(imagePaths);
}

function loadImagesToAnimation(paths) {
  for (path of paths) {
    loadImage(
      path,
      (result) => addImagetoAnimation(result),
      (error) => console.error(error)
    );
  }
}

function findImagesFromFolder(folderName) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", folderName, true);
    xhr.responseType = "document";
    xhr.onload = () => {
      if (xhr.status === 200) {
        let elements = xhr.response.getElementsByTagName("a");
        let imageDir = [];
        for (x of elements) {
          if (x.href.match(/\.(jpe?g|png|gif)$/)) {
            imageDir.push(x.href);
          }
        }
        resolve(imageDir);
      } else reject(Error("Could not reach folder. Check directory"));
    };
    xhr.send();
  });
}

// Refactor into highorder try catch statements
function findImagesFromClass(domClassNames) {
  let foundClasses = document.getElementsByClassName(domClassNames);
  if (foundClasses.length != 0) {
    console.log("Get Images");
    let images = [];
    for (thisClass of foundClasses) {
      let imgElement = thisClass.getElementsByTagName("img");
      if (imgElement.length != 0) {
        imgElement.foreach((i) => images.push(loadImage(i.src)));
      } else console.log("No images in class");
    }
    return images;
  } else console.error("No Classes");
  return null;
}

class Particle {
  constructor(sourceImg) {
    this.startImg = sourceImg;
    this.pos = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, -5));
    this.alpha = 255;
    this.col = createVector(random(256), random(256), random(256));

    // To do - make previous pixel association be random with new ones
    // previous pixel color and place -> new pixel color and place
    // Then add movement
  }

  finished() {
    return this.alpha <= 0;
  }

  update() {
    this.pos.add(this.velocity);
    this.alpha -= 1;
  }

  show() {
    noStroke();
    fill(this.col.x, this.col.y, this.col.z, this.alpha);
    ellipse(this.pos.x, this.pos.y, 15);
  }
}
