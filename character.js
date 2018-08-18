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
    }
    set size(size) {
      this._size = size;
    }
    get size() {
      return this._size;
    }
}
