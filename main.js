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
var backImage, planetImage, meteoImage;
var run = true;
var working = true;
var fps = 1000 /30;
var mouse = new Point();
var ctx;
var click = false;
var ENEMY_MAX_COUNT = 10;
var ENEMY_MAX_SPEED = 20;
var ENEMY_MIN_SPEED = -20;
var ENEMY_TYPE = 0;
var RECOVERY_TYPE = 1;
var counter = 0;
// - main ---------------------------------------------------------------------
window.onload = function(){
    backImage = new Image();
    backImage.src = 'space.png';
    planetImage = new Image();
    planetImage.src = 'planet.png';
    meteoImage = new Image();
    meteoImage.src = 'meteo.png';
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

    var chara = new Character(10);
    var enemy = new Array(ENEMY_MAX_COUNT);
    for(i = 0; i < ENEMY_MAX_COUNT; i++){
      enemy[i] = new Enemy();
    }

    // ループ処理を呼び出す
    (function(){
        if(working){
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
          fillBackImage();
          fillCharacter(chara);
          fillEnemies(enemy);

          fillDebugText(chara, enemy);
        }
        judgeGameOver(chara);
        fillGameOverText();
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

function fillBackImage(event){
  // 現在のパスをリセットする
  ctx.beginPath();
  // 繰り返しパターンの作成
  var pattern = ctx.createPattern(backImage, 'repeat');
  // 塗りつぶしスタイルの設定
  ctx.fillStyle = pattern;
  // パスに矩形のサブパスを追加する
  ctx.rect(0,0,screenCanvas.width,screenCanvas.height);
  // 現在の塗りつぶしスタイルでサブパスを塗りつぶす
  ctx.fill();
}

function fillDebugText(chara, enemy){
    var boolean;
    if(chara.clockwise){
      boolean = 'true';
    }else{
      boolean = 'false'
    }
    ctx.textAlign = 'start';
    ctx.fillStyle = 'rgba(100, 100, 255, 0.75)';
    ctx.font = "14px 'ＭＳ ゴシック'"
    var text = 'DEBUG -> ' + enemy[0].position.y + ' : ' + enemy[0].size + ' : ' + screenCanvas.width + ' : ' + screenCanvas.height + ' : ' +boolean;
    ctx.fillText(text,50,50);
    var text = 'SCORE -> ' + counter + ' LIFE -> ' + chara.life;
    ctx.fillText(text,50,75);
}

function fillGameOverText(){
  if(!working){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(100, 100, 255, 0.75)';
    ctx.font = "14px 'ＭＳ ゴシック'"
    var text = 'GAME OVER';
    ctx.fillText(text,screenCanvas.width/2,screenCanvas.height/2,screenCanvas.width/5);

  }
}

function moveCharacter(chara){
  chara.move(click, screenCanvas);
}

function setEnemy(enemy, type){
  // すべてのエネミーを調査する
  for(i = 0; i < ENEMY_MAX_COUNT; i++){
      // エネミーの生存フラグをチェック
      if(!enemy[i].alive){
          var enemySize = 10;
          var p = new Point();
          p.x = 0 ;
          p.y = Math.floor( Math.random() * (screenCanvas.height + 1 - 0) ) + 0 ;
          var speed_x = Math.floor( Math.random() * (ENEMY_MAX_SPEED + 1 - ENEMY_MIN_SPEED) ) + ENEMY_MIN_SPEED ;
          var speed_y = Math.floor( Math.random() * (ENEMY_MAX_SPEED + 1 - ENEMY_MIN_SPEED) ) + ENEMY_MIN_SPEED ;
//          var type = RECOVERY_TYPE ;
          // エネミーを新規にセット
          enemy[i].init(enemySize, p, speed_x, speed_y, type);
          // 1体出現させたのでループを抜ける
          break;
      }
  }

}

function createEnemy(enemy){
  if(counter % 500 == 0){
    var type = RECOVERY_TYPE ;
    setEnemy(enemy, RECOVERY_TYPE);
  }else if(counter % 100 == 0){
    setEnemy(enemy, ENEMY_TYPE);
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
        if(enemy[i].type == ENEMY_TYPE){
          chara.life--;
        }else if(enemy[i].type == RECOVERY_TYPE){
          chara.life++;
        }
        break;
      }
    }
  }
}

function judgeGameOver(chara){
  if(chara.life <= 0){
    working = false;
  }
  if(!working){
    if(click){
      working = true;
      chara.life = 3;
      counter = 0;
    }
  }
}

function fillCharacter(chara){
    /*
    var drawBeginX = chara.position.x-chara.size;
    var drawBeginY = chara.position.y-chara.size;
    ctx.drawImage(planetImage,drawBeginX,drawBeginY,chara.size*2,chara.size*2);
    */
    ctx.beginPath();
    ctx.arc(chara.position.x, chara.position.y, chara.size, 0, Math.PI * 2, false);
    ctx.fillStyle = chara.color;
    ctx.fill();
  }

function fillEnemies(enemy){
  for(i = 0; i < ENEMY_MAX_COUNT; i++){
      // エネミーの生存フラグをチェック
      if(enemy[i].alive){
        /*
        var drawBeginX = enemy[i].position.x-enemy[i].size;
        var drawBeginY = enemy[i].position.y-enemy[i].size;
        ctx.drawImage(meteoImage,drawBeginX,drawBeginY,enemy[i].size*2,enemy[i].size*2);
        */
        ctx.beginPath();
        ctx.arc(enemy[i].position.x, enemy[i].position.y, enemy[i].size, 0, Math.PI * 2, false);
        ctx.fillStyle = enemy[i].color;
        ctx.fill();
      }
  }
}
