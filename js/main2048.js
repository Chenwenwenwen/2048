//board 初始化位一维数组--->需要变成二维数组
var board = new Array()
var score = 0 ;
//hasConflicted 二维数组记录是否已经发生过一个add
var hasConflicted = new Array();

//手机端的处理:采用对于手机屏幕的百分比
//获取手机屏幕宽度
var documentWidth = window.screen.availWidth;
//设定是92%大格子
var gridContainerWidth = 0.92 * documentWidth;
//小方块是18%小格子
var cellSideLength = 0.18 * documentWidth;
//小方块之间的边距
var cellSpace = 0.04 * documentWidth;

var startx = 0 ;
var starty = 0 ;
var endx = 0;
var endy =0 ;



// 当整个程序加载完毕
$(document).ready(function () {
    //手机端开始之前需要的准备工作
    prepareForMoblie();
    //开始新游戏
    newgame();

});

function prepareForMoblie(){

    if( window.screen.availWidth > 500 ) {
        gridContainerWidth = 500 ;
        cellSpace = 20;
        cellSideLength = 100;
    }
    //对grid-container的css进行调整
    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02 * gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02 * cellSideLength);
}

//开始新的游戏->清零、初始化、随机出现
function newgame() {
    //初始化棋盘格
    init();
    //随机两个格子生成数据 
    //generateOneNumber(); 每次随机生成一个，所以运行两遍
    generateOneNumber(); generateOneNumber();
}

//初始化棋盘格
function init() {
    for(var i = 0 ; i < 4;i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            //对于第一行 top为20
            //对于第二行 top为20px+120px
            //对与第三行 top为20px+120px*2
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    //初始化board数组，变成二维数组
    for(var i = 0 ; i < 4;i++) {
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }

    //初始化board数组，变成二维数组
    for(var i = 0 ; i < 4;i++) {
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            hasConflicted[i][j] = 0;
            hasConflicted[i][j] =false;
        }
    }

    //分数清0
    score  = 0;
    updateScore(score);
    //利用updateBoardView()控制UI
    updateBoardView();

}

//根据board变量的值对前端的number-cell进行控制
function updateBoardView() {

    //把原来的值删掉
    $(".number-cell").remove();
    for(var i = 0 ; i < 4 ; i++ ){
        for(var j = 0 ; j < 4 ; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' )
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                //是0的时候 是隐藏的
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                //位置放在小格子的中间
                theNumberCell.css('top',getPosTop(i, j) + cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i, j) + cellSideLength/2);
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                //把grid-cell 覆盖住
                theNumberCell.css('top',getPosTop(i, j) );
                theNumberCell.css('left',getPosLeft(i, j) );
                //显示的内容不同背景颜色也是不一样的
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                //显示的内容不同字体颜色也是不一样的
                theNumberCell.css('color',getNumberColor(board[i][j]));
                //显示文本的值
                theNumberCell.text(board[i][j]);

            }

            hasConflicted[i][j] = false;
        }
    }

    $('.number-cell').css('line-height',cellSideLength+"px");
    $('.number-cell').css('font-size',0.6 * cellSideLength + 'px');
}

function generateOneNumber() {
    //如果棋盘没有位置--->nospace = true  ---> 不能再生成
    if( nospace(board)) return false;

    //随机一个位置 随机生成->0 1 2 3 要浮点随机数->要整型
    var randx = parseInt(Math.floor(Math.random() * 4))
    var randy = parseInt(Math.floor(Math.random() * 4))
    //判断该随机位置是否已经有东西
    var times = 0;
    while(times < 50 ){
        if(board[randx][randy] === 0) break;
        var randx = parseInt(Math.floor(Math.random() * 4))
        var randy = parseInt(Math.floor(Math.random() * 4))

        times ++ ;
    }
    if( times == 50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4 ;

    //在随机的位置显示随机数字
    board[randx][randy] = randNumber;
    //显示的时候带动画
    showNumberWhitAnimation(randx,randy,randNumber);

    return true;
}

//keydown 当玩家按下按钮
$(document).keydown(function(event){
   switch(event.keyCode){
       case 37 : //left
            //按键的默认效果都消失
            event.preventDafault();
           //判断是否真的能向左移动，如果所有数据都在左边则应该无法移动
           if(moveLeft()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
           break;
       case 38 : //up
            //按键的默认效果都消失
            event.preventDafault();
           if(moveUp()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
           break;
       case 39 : //right
            //按键的默认效果都消失
            event.preventDafault();
           if(moveRight()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
           break;
       case 40 : //down
            //按键的默认效果都消失
            event.preventDafault();
           if(moveDown()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
           break;
       default: //default
           break;
   }
});

document.addEventListener('touchstart',function(event){
    startx=event.touches[0].pageX; 
    starty=event.touches[0].pageY;

});

document.addEventListener('touchmove',function(event){
    event.preventDafault();
});

document.addEventListener('touchend',function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

     //记录这个向量，判断正负以此来判断左右
     var deltax = endx-startx;
     var deltay = endy-starty;

     //判断用户是点击还是滑动
     if(Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth){
        return;
     }

     //x
     if(Math.abs(deltax) >= Math.abs(deltay)){
        //x>0 向右
        if(deltax > 0){
              if(moveRight()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
        }
        //向左
        else{
              if(moveLeft()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
        }
     }
     //y
     else{
        //向下
        if(deltay > 0){
           if(moveDown()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
        }
        //向上
        else{
            if(moveUp()){
               //更新面板
               setTimeout("generateOneNumber()",210);
               //游戏是否结束
               setTimeout("isgameover()",300);
           }
        }

     }
});



function isgameover() {
    //游戏没有空格且没有游戏空间
    if(nospace(board) && noMove(board)){
        gameover();
    }
}

function gameover() {
    alert("Game Over!")
}

function moveLeft(){
    //判断当前的局势是否能向左移动
    if(!canMoveLeft(board)){
        return false;
    }
    //如果真的能移动
    for(var i = 0 ; i < 4 ; i++ ) {
        //第0列（最左边的数字不需要判断）
        for (var j = 1; j < 4; j++) {
            if(board[i][j] != 0){
                for(var k = 0 ; k < j;k++){
                    //是不是落脚点
                    //如果为空且有没有障碍物
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move带动画
                        shwoMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //左右两边的相等且有没有障碍物
                    else if(board[i][k]==board[i][j]&& noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        shwoMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j] = 0;
                        //add score
                        score +=  board[i][k];
                        updateScore(score);
                        //已发生过一次碰撞
                        hasConflicted[i][k] = true;
                        continue;
                    }

                }
            }
        }
    }
    //对整体数据进行刷新
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    //如果真的能移动
    for(var i = 0 ; i < 4 ; i++ ) {
        for (var j = 2; j >= 0; j--) {
            if(board[i][j] != 0){
                for(var k = 3 ; k > j;k--){
                    //是不是落脚点
                    //如果为空且有没有障碍物
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        //move带动画
                        shwoMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //左右两边的相等且有没有障碍物
                    else if(board[i][k]==board[i][j]&& noBlockHorizontal(i,j,k,board)&& !hasConflicted[i][k]){
                        //move
                        shwoMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j] = 0;
                        //add score
                        score +=  board[i][k];
                        updateScore(score);
                        //已发生过一次碰撞
                        hasConflicted[i][k] = true;
                        continue;
                    }

                }
            }
        }
    }
    //对整体数据进行刷新
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    //如果真的能移动
    for (var j = 0; j < 4; j++) {
         for(var i = 1 ; i < 4 ; i++ ) {
            if(board[i][j] != 0){
                for(var k = 0 ; k < i;k++){
                    //是不是落脚点
                    //如果为空且有没有障碍物
                    if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        //move带动画
                        shwoMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //左右两边的相等且有没有障碍物
                    else if(board[k][j]==board[i][j]&& noBlockVertical(j,k,i,board)&& !hasConflicted[k][j]){
                        //move
                        shwoMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j] = 0;
                        //add score
                        score +=  board[k][j];
                        updateScore(score);
                        //已发生过一次碰撞
                        hasConflicted[k][j] = true;
                        continue;
                    }

                }
            }
        }
    }
    //对整体数据进行刷新
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    //如果真的能移动
    for (var j = 0; j < 4; j++) {
        for(var i = 2 ; i >= 0 ; i-- ) {
            if(board[i][j] != 0){
                for(var k = 3; k >i;k--){
                    //是不是落脚点
                    //如果为空且有没有障碍物
                    if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                        //move带动画
                        shwoMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //左右两边的相等且有没有障碍物
                    else if(board[k][j]==board[i][j]&& noBlockVertical(j,i,k,board)&& !hasConflicted[k][j]){
                        //move
                        shwoMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j] = 0;
                        //add score
                        score +=   board[k][j];
                        updateScore(score);
                        //已发生过一次碰撞
                        hasConflicted[k][j] = true;
                        continue;
                    }

                }
            }
        }
    }
    //对整体数据进行刷新
    setTimeout("updateBoardView()",200);
    return true;
}