// - common -------------------------------------------------------------------

function Point(){
    this.x = 0;
    this.y = 0;
}

// - global -------------------------------------------------------------------
var container, screenCanvas;
var run = true;
var fps = 1000 / 30;
var mouse = new Point();
var ctx;
var click = false;
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

    var chara = new Character(10);

    // ループ処理を呼び出す
    (function(){
        if(click){
          if(chara.clockwise == true){
            chara.clockwise = false;
          }else{
            chara.clockwise = true;
          }
          click = false;
        }

        // HTMLを更新
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
        fillDebugText(chara);

        chara.position.x = mouse.x;
        chara.position.y = mouse.y;


        fillCharacter(chara);
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

function fillDebugText(chara){
    var boolean;
    if(chara.clockwise){
      boolean = 'true';
    }else{
      boolean = 'false'
    }
    var text = 'DEBUG -> ' + mouse.x + ' : ' + mouse.y + ' : ' + screenCanvas.width + ' : ' + screenCanvas.height + ' : ' +boolean;
    ctx.fillText(text,10,50);
}

function fillCharacter(chara){
    ctx.beginPath();
    ctx.fillStyle = chara.color;
    ctx.arc(chara.position.x, chara.position.y, chara.size, 0, Math.PI * 2, false);
    ctx.fill();
}