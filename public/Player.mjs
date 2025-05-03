class Player {
    constructor({x, y, id, imageHref}) {
      this.id = id;
      this.sprite = new Image();
      this.sprite.src = imageHref;
      this.position = {x: x, y:y};
      this.size = {w: 50, h:50};
      this.spriteLoaded = false;
      this.points = 0;
  }


  movePlayer(dir, speed) {
    if (dir === 'ArrowUp') {
      this.position.y -= speed; // Move up
    } if (dir === 'ArrowDown') {
      this.position.y += speed; // Move down
    } if (dir === 'ArrowLeft') {
      this.position.x -= speed; // Move left
    } if (dir === 'ArrowRight') {
      this.position.x += speed; // Move right
    }
  }

  collision(item) {
    const xAxisCollision = this.position.x + this.size.w >= item.position.x && this.position.x <= (item.position.x + item.size.w);
    const yAxisCollision = (this.position.y + this.size.h) >= item.position.y && this.position.y <= (item.position.y + item.size.h);
    if(xAxisCollision && yAxisCollision ){
      this.points += 1;
      return true;
    }
  }

  calculateRank(arr) {
    const pointsArr = arr.map(item => item.points);
    pointsArr.push(this.points);
    pointsArr.sort((a,b) => {
        return b>a;
    });
    return pointsArr.indexOf(this.points) + 1;
  }
}

export default Player;