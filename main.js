// - common -------------------------------------------------------------------

class Point {
  constructor(){
    this.x = 0;
    this.y = 0;
  }
  distance(p){
    var q = new Point();
    q.x = p.x - this.x;
    q.y = p.y - this.y;
    return q;
  }
  calculateLength(){
    var length = Math.sqrt(this.x * this.x + this.y * this.y);
    return length;
  }
}


// - global -------------------------------------------------------------------
var container, screenCanvas;
var run = true;
var fps = 1000 /30;
var mouse = new Point();
var ctx;
var click = false;
var ENEMY_MAX_COUNT = 10;
var ENEMY_MAX_SPEED = 20;
var ENEMY_MIN_SPEED = -20;
var counter = 0;
// - main ---------------------------------------------------------------------
window.onload = function(){

    // スクリーンの初期化
    container = document.getElementById('wrap');
    screenCanvas = document.getElementById('screen');
    ctx = screenCanvas.getContext("2d");
    sizing();
    // イベントの登録
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    screenCanvas.addEventListener('mousedown', mouseDown, true);
    window.addEventListener('keydown', keyDown, true);
    window.addEventListener('resize', sizing, false);
    //iOSでスクロールを禁止する
    window.addEventListener('touchmove', cancelEvent, true);

    var chara = new Character(20);
    var enemy = new Array(ENEMY_MAX_COUNT);
    for(i = 0; i < ENEMY_MAX_COUNT; i++){
      enemy[i] = new Enemy();
    }

    // ループ処理を呼び出す
    (function(){
        counter++;
        // HTMLを更新
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

        createEnemy(enemy);

        if(click){
          chara.switchClockWise();
          click = false;
        }
        moveCharacter(chara);
        moveEnemies(enemy);

        judgeCollision(chara, enemy);

        fillCharacter(chara);
        fillEnemies(enemy);

        fillDebugText(chara, enemy);

        // フラグにより再帰呼び出し
        if(run){setTimeout(arguments.callee, fps);}
    })();
};

// - event --------------------------------------------------------------------
function sizing(){
  screenCanvas.width = window.innerWidth;
  screenCanvas.height = window.innerHeight;
}

function mouseMove(event){
    // マウスカーソル座標の更新
    mouse.x = event.clientX - screenCanvas.offsetLeft;
    mouse.y = event.clientY - screenCanvas.offsetTop;
}

function mouseDown(event){
    // フラグを立てる
    click = true;
}

function keyDown(event){
    // キーコードを取得
    var ck = event.keyCode;

    // Escキーが押されていたらフラグを降ろす
    if(ck === 27){run = false;}
}

function cancelEvent(event){
  event.preventDefault();
}

function fillDebugText(chara, enemy){
    var boolean;
    if(chara.clockwise){
      boolean = 'true';
    }else{
      boolean = 'false'
    }
    var text = 'DEBUG -> ' + enemy[0].position.y + ' : ' + enemy[0].size + ' : ' + screenCanvas.width + ' : ' + screenCanvas.height + ' : ' +boolean;
    ctx.fillText(text,10,50);
    var text = 'SCORE -> ' + counter + ' LIFE -> ' + chara.life;
    ctx.fillText(text,10,75);
}

function moveCharacter(chara){
  chara.move(click, screenCanvas);
}

function createEnemy(enemy){
  if(counter % 100 == 0){
    // すべてのエネミーを調査する
    for(i = 0; i < ENEMY_MAX_COUNT; i++){
        // エネミーの生存フラグをチェック
        if(!enemy[i].alive){
            var enemySize = 15;
            var p = new Point();
            p.x = 0 ;
            p.y = Math.floor( Math.random() * (screenCanvas.height + 1 - 0) ) + 0 ;
            var speed_x = Math.floor( Math.random() * (ENEMY_MAX_SPEED + 1 - ENEMY_MIN_SPEED) ) + ENEMY_MIN_SPEED ;
            var speed_y = Math.floor( Math.random() * (ENEMY_MAX_SPEED + 1 - ENEMY_MIN_SPEED) ) + ENEMY_MIN_SPEED ;
            // エネミーを新規にセット
            enemy[i].init(enemySize, p, speed_x, speed_y);
            // 1体出現させたのでループを抜ける
            break;
        }
    }
  }
}

function moveEnemies(enemy){
  for(i = 0; i < ENEMY_MAX_COUNT; i++){
      // エネミーの生存フラグをチェック
      if(enemy[i].alive){
        enemy[i].move(screenCanvas);
      }
  }
}

function judgeCollision(chara, enemy){
  for(i = 0; i < ENEMY_MAX_COUNT; i++){
    if(enemy[i].alive){
      // エネミーと自機ショットとの距離を計測
      var p = enemy[i].position.distance(chara.position);
      if(p.calculateLength() < chara.size + enemy[i].size){
        // 衝突していたら生存フラグを降ろす
        enemy[i].alive = false;
        chara.life--;
        break;
      }
    }
  }
}

function fillCharacter(chara){
    ctx.beginPath();
    ctx.fillStyle = chara.color;
    ctx.arc(chara.position.x, chara.position.y, chara.size, 0, Math.PI * 2, false);
    ctx.fill();
  }

function fillEnemies(enemy){
  ctx.beginPath();
  for(i = 0; i < ENEMY_MAX_COUNT; i++){
      // エネミーの生存フラグをチェック
      if(enemy[i].alive){
        ctx.arc(enemy[i].position.x, enemy[i].position.y, enemy[i].size, 0, Math.PI * 2, false);
        ctx.fillStyle = enemy[i].color;
        ctx.closePath();
      }
  }
  ctx.fill();
}
