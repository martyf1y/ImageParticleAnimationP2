const domClassNames = "ImagesToAnimate";
const folderPath = "images";

let animation;
let loopAnimation = false;
let sizeSlider, textInfo;
let spaceSlider;
let button;

function setup() {
  createCanvas(window.innerWidth/2, window.innerHeight/2);

  animation = new Animation(loopAnimation, width, height);
  console.log("Animation Created");

  collectImages("DOMCLASS", domClassNames)
    .then((result) => addImages(result).then(animation.start()))
    .catch((err) => console.error(err));

  sizeSlider = createParticleSlider(10, 1, width / 5, animation.pSize);
  spaceSlider = createParticleSlider(230, 0, 50, animation.pSpacing);
  textInfo = createP(
    " Spacing: " + animation.pSpacing + "   Size: " + animation.pSize
  );
  button = createButton("Run");
  button.position(10, height + textInfo.height * 3);
  button.mousePressed(runAgain);
}

function runAgain() {
  animation.start();
}

function draw() {
  background(220);
  if (animation != null && animation.animating) {
    animation.update();
    animation.show();
  }
}

function adjustAnimation() {
  if (animation != null) {
    animation.pSize = sizeSlider.value();
    animation.pSpacing = spaceSlider.value();
    animation.resetParticles();
    textInfo.html(
      " Spacing: " + animation.pSpacing + "   Size: " + animation.pSize
    );
  }
}

async function addImages(imgBasket) {
  animation.addImagesfromBasket(imgBasket);
}

// --------------------- Collect Images --------------------- //
async function collectImages(search, path) {
  let imgPaths;
  switch (search) {
    case "DOMCLASS":
      imgPaths = findImagesFromClass(path);
      break;
    case "FOLDER":
      imgPaths = await findImagesFromFolder(path);
      break;
    default:
      imgPaths = await findImagesFromFolder(path);
  }
  let iB = await loadImagesFromPaths(imgPaths);
  return iB;
}

function loadImagesFromPaths(paths) {
  return new Promise((resolve) => {
    let imgArray = [];
    let i = 0;
    paths.forEach((p) => {
      loadImage(
        p,
        (res) => {
          console.log("Loaded Image");
          imgArray.push(res);
          i++;
          if (i == paths.length) resolve(imgArray);
        },
        (err) => {
          console.error("IMAGE NOT LOADED" + err);
          i++;
          if (i == paths.length) resolve(imgArray);
        }
      );
    });
  });
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

// --------------------- Slider --------------------- //
function createParticleSlider(posX, s, e, d) {
  let slider = createSlider(s, e, d);
  slider.position(posX, height + 5);
  slider.style("width", "200px");
  slider.input(adjustAnimation);
  return slider;
}
