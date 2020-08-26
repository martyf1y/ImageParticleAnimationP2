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

let classNames = "ImagesToAnimate";
let imageFolder = "images";

let toAnimateImgArray = [];
let pixelArray = [];
let particle;

let imgArrayIndex = 0;
let stopAnimation = false;
let posX = 0;

function preload() {
  reloadImages();
}

function setup() {
  createCanvas(500, 500);

  // particle = {
  //   x0: x,
  //   y0: y,
  //   x1: png.width / 2,
  //   y1: png.height / 2,
  //   color:
  //     "rgb(" +
  //     data.data[y * 4 * data.width + x * 4] +
  //     "," +
  //     data.data[y * 4 * data.width + x * 4 + 1] +
  //     "," +
  //     data.data[y * 4 * data.width + x * 4 + 2] +
  //     ")",
  //   speed: Math.random() * 4 + 2,
  // };
}

async function draw() {
  background(0);
  if (toAnimateImgArray != 0 && !stopAnimation) {
    runAnimation(toAnimateImgArray[imgArrayIndex])
      .then(() => {
        stopAnimation = checkNextAnimation(false);
      })
      .catch((err) => console.error(err));
  }
}

function checkNextAnimation(loop) {
  if (imgArrayIndex >= toAnimateImgArray.length - 1) {
    imgArrayIndex = 0;
    if (!loop) return true;
  } else imgArrayIndex++;
  return false;
}

async function runAnimation(img) {
  await animateImage(img);
}

async function animateImage(img) {
  return new Promise((resolve, reject) => {
    img.loadPixels();

    fill(255);
    image(img, posX++, 0, height / (img.height / img.width), height);
    if (posX >= 100) resolve(posX = 0);
  });
}

// Go through each animation
// In function
// Try use image. If not run onto next img
// for(int i =0; i < toAnimateImgList.length; i++){
// targetPixelArray =   createTargetPixelArray(toAnimateImgList[i]);
//    await pixelArray = runningAnimation(startPixelArray, targetPixelArray);
// once it is complete i++;
//}

function findImagesFromFolder(folderName) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", folderName, true);
    xhr.responseType = "document";
    xhr.onload = () => {
      if (xhr.status === 200) {
        let elements = xhr.response.getElementsByTagName("a");
        let imgArray = [];
        for (x of elements) {
          if (x.href.match(/\.(jpe?g|png|gif)$/)) {
            imgArray.push(loadImage(x.href));
          }
        }
        resolve(imgArray);
      } else reject(Error("Could not reach folder. Check directory"));
    };
    xhr.send();
  });
}

// Refactor into highorder try catch statements
function findImagesFromClass(classNames) {
  let foundClasses = document.getElementsByClassName(classNames);
  if (foundClasses.length != 0) {
    console.log("Get Images");
    let imgArray = [];
    for (thisClass of foundClasses) {
      let imgElement = thisClass.getElementsByTagName("img");
      if (imgElement.length != 0) {
        imgElement.foreach((i) => imgArray.push(loadImage(i.src)));
      } else console.log("No images in class");
    }
    return imgArray;
  } else console.log("No Classes");
  return null;
}

async function reloadImages() {
  // or toAnimateList = findImagesFromClass("ImagesToAnimate");
  toAnimateImgArray = await findImagesFromFolder(imageFolder);
}
