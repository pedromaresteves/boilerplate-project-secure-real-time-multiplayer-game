const dimensions = {
  width:"640", 
  height:"480"
};
function getRandomInt(min, max) {
  // Ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);
  // Generate a random integer between min and max
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const findPosition = ()=>{
 return {x: getRandomInt(50, dimensions.width-50), y:getRandomInt(50, dimensions.height-50)};
};

class Collectible {
  constructor(position) {
    this.sprite = new Image();
    this.sprite.src = "https://images.rawpixel.com/image_png_social_landscape/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvam9iNjgyLTExNi1wXzEucG5n.png";
    this.position = position
    this.size = {w: 25, h:25};
    this.spriteLoaded = false;
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = {findPosition, Collectible};
} catch(e) {}

export {findPosition, Collectible};


