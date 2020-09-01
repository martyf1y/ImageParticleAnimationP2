

const domClassNames = "ImagesToAnimate";
const imageFolder = "images/";

let animation;
let loopAnimation = false;
let tempTransitionInterval;

function preload() {
  collectImages().catch((err) => console.error(err));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  if (animation != null && animation.animating) {
    animation.animateParticles();
  }
}

// --------------------- Collect Images --------------------- //

async function collectImages() {
  // or toAnimateList = findImagesFromClass("ImagesToAnimate");
  let imagePaths = await findImagesFromFolder(imageFolder);
  loadImagesToAnimation(imagePaths);
}

function loadImagesToAnimation(paths) {
  if (animation == null) animation = new Animation(loopAnimation);
  paths.forEach((p) =>
    loadImage(
      p,
      (res) => animation.addImage(res),
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
        for (x of elements) {
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
    let images = [];
    for (thisClass of foundClasses) {
      let imgElement = thisClass.getElementsByTagName("img");
      if (imgElement.length != 0)
        imgElement.foreach((i) => images.push(loadImage(i.src)));
      else console.log("No images in class");
    }
    return images;
  } else console.error("No Classes");
  return null;
}
