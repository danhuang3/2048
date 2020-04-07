//通过动画显示数字
function showNumberWithAnimation(i,j,randomNumber){
  // console.log(i,j,randomNumber);
  var numberCell = $('#number-cell-'+i+'-'+j);
  numberCell.css('background-color',getNumberBackgroundColor(randomNumber));
  numberCell.css('color',getNumbercolor(randomNumber));
  numberCell.text(randomNumber);

  numberCell.animate({
    width: '100px',
    height: '100px',
    top: getPosTop(i,j),
    left: getPosLeft(i,j)
  },500);
}

//通过动画显示移动
function showMoveAnimation(fromx,fromy,tox,toy){
  var numberCell = $('#number-cell-'+ fromx +'-'+ fromy); //这是需要移动的单元格
  numberCell.animate({
    top: getPosTop(tox,toy),
    left: getPosLeft(tox,toy),
  },200);
}