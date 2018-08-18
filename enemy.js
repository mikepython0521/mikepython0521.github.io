class Enemy {
    constructor() {
      this.size = 0;
      this.color = 'rgba(255, 0, 0, 0.75)';
      this.position = new Point();
      this.speed_x = 0;
      this.speed_y = 0;
      this.alive = false;
      this.type = 0;
    }
    set size(size) {
      this._size = size;
    }
    get size() {
      return this._size;
    }
    init(size, position, speed_x, speed_y, type) {
      this.size = size;
      this.position.x = position.x;
      this.position.y = position.y;
      this.speed_x = speed_x;
      this.speed_y = speed_y;
      this.alive = true;
      this.type = type;
      if(this.type == 0){
        this.color = 'rgba(255, 0, 0, 0.75)';
      }else if (this.type == 1){
        this.color = 'rgba(0, 255, 0, 0.75)';        
      }
    }

    move(screenCanvas){
      this.position.x = this.position.x + this.speed_x;
      this.position.y = this.position.y + this.speed_y;
      if(this.position.x <0){
        this.speed_x = this.speed_x * (-1);
      }else if(this.position.x > screenCanvas.width){
        this.speed_x = this.speed_x * (-1);
      }
      if(this.position.y <0){
        this.speed_y = this.speed_y * (-1);
      }else if(this.position.y > screenCanvas.height){
        this.speed_y = this.speed_y * (-1);
      }
    }
}
