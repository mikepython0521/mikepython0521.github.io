class Character {
    constructor(size) {
      this.size = size;
      this.color = 'rgba(100, 100, 255, 0.75)';
      this.center = new Point();
      this.position = new Point();
      this.center.x = 200;
      this.center.y = 200;
      this.angle = 0;
      this.clockwise = true;
      this.moveCenterFlag = false;
      this.angle_speed = 7;
      this.radius = 100;
      this.life = 3;
    }
    set size(size) {
      this._size = size;
    }
    get size() {
      return this._size;
    }

    switchClockWise(){
      if(this.clockwise == true){
        this.clockwise = false;
      }else{
        this.clockwise = true;
      }
      this.moveCenterFlag = true;
    }

    move(click, screenCanvas){

      if(this.clockwise){
        this.angle = this.angle + this.angle_speed;
      }else{
        this.angle = this.angle - this.angle_speed;
      }
      if(this.angle > 360){
        this.angle = this.angle - 360;
      }
      if(this.angle < 0){
        this.angle = this.angle + 360;
      }
      if(this.moveCenterFlag){
        this.center.x = this.center.x + this.radius * Math.cos(this.angle * (Math.PI / 180)) * 2;
        this.center.y = this.center.y + this.radius * Math.sin(this.angle * (Math.PI / 180)) * 2;
        this.angle = this.angle + 180;
        this.moveCenterFlag = false;
      }
      this.position.x = this.center.x + this.radius * Math.cos(this.angle * (Math.PI / 180));
      this.position.y = this.center.y + this.radius * Math.sin(this.angle * (Math.PI / 180));

      if(this.position.x < 0 ){
        this.position.x = this.position.x + screenCanvas.width;
        this.center.x = this.center.x + screenCanvas.width;
      }else if(this.position.x > screenCanvas.width){
        this.position.x = this.position.x - screenCanvas.width;
        this.center.x = this.center.x - screenCanvas.width;
      }
      if(this.position.y < 0 ){
        this.position.y = this.position.y + screenCanvas.height;
        this.center.y = this.center.y + screenCanvas.height;
      }else if(this.position.y > screenCanvas.height){
        this.position.y = this.position.y - screenCanvas.height;
        this.center.y = this.center.y - screenCanvas.height;
      }
    }
}
