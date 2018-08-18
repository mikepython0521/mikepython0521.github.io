class Character {
    constructor(size) {
      this.size = size;
      this.color = 'rgba(100, 100, 255, 0.75)';
      this.position = new Point();
      this.clockwise = true;
    }
    set size(size) {
      this._size = size;
    }
    get size() {
      return this._size;
    }
}
