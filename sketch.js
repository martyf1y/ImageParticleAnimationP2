const domClassNames = "ImagesToAnimate";
const imageFolder = "images";

let animation;
let imgBasket = [];
let loopAnimation = false;
let tempTransitionInterval;

function preload() {
  collectImages().catch((err) => console.error(err));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  animation = new Animation(loopAnimation);
  console.log("Animation created");
  animation.addImagesfromBasket(imgBasket);
}

function draw() {
  background(255);
  if (animation != null && animation.animating) {
    animation.animateParticles();
  }
}

// --------------------- Collect Images --------------------- //

async function collectImages() {
  let imgPaths = findImagesFromClass(domClassNames);
  // let imagePaths = await findImagesFromFolder(imageFolder);
  loadImagesToBasket(imgPaths);
}

function loadImagesToBasket(paths) {
  imgBasket.splice(0, imgBasket.length);
  paths.forEach((p) =>
    loadImage(
      p,
      (res) => imgBasket.push(res),
      (err) => console.error(err)
    )
  );
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
        for (const x of elements) {
          if (x.href.match(/\.(jpe?g|png|gif)$/)) imageDir.push(x.href);
        }
        if (imageDir != 0) resolve(imageDir);
        else reject(Error("No Images in folder"));
      } else reject(Error("Could not reach folder. Check directory"));
    };
    xhr.send();
  });
}

function findImagesFromClass(domClassNames) {
  let foundClasses = document.getElementsByClassName(domClassNames);
  if (foundClasses.length != 0) {
    let imageDir = [];
    for (const thisClass of foundClasses) {
      let elements = thisClass.getElementsByTagName("img");
      if (elements.length != 0)
        Array.prototype.forEach.call(elements, (x) => imageDir.push(x.src));
      else console.log("No images in class");
    }
    if (imageDir != 0) return imageDir;
    else console.error("No Images in DOM class");
  } else console.error("Could not reach the class in DOM");
  return null;
}
