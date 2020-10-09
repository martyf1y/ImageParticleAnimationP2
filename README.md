Matthew Martin - Creative Matterz
09.10.2020

Based on:
https://codepen.io/vinsongrant/details/MKwebd

The images do not belong to me and are just for test purposes.

What it does
- Creates animation object
- Locate images in the animation DOM class or images folder of app
- Load images and put in class.
- Auto start animation
- Go through each image with particle array of rectangles (customisable with sliders)
- Does not create particles for no alpha pixels
- Have pixels begin from center
- Give a target area for pixel to go to
- Create a type of elastic style movement
- Create pixel complete check and when done stay for half a second
- Resets to blank and plays again for next image after few seconds

Still to do


- Transition from one animation to next
  - Have a new animation object
  - transition all new points to that object
- Give pixels new destination and colour
- Have pixels lerp colour
- If there are not enough pixels create more from center
- If there are too many have them go to random empty spot and disappear
- Upload to website and have it run there
