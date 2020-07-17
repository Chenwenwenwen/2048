function showNumberWhitAnimation(i,j,randNumber){
    var numberCell = $('#number-cell-'+i+"-"+j);

    //外观改变
    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);

    //动画部分 animate渐变
    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50) //50代表50毫秒
}

function shwoMoveAnimation(fromx,fromy,tox,toy) {
    var numberCell = $('#number-cell-'+fromx+"-"+fromy);

    //动画部分 animate渐变
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function  updateScore(score) {
    $('#score').text(score);
}