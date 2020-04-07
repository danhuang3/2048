var nums = new Array();
var score = 0;
var hasConflicted = new Array(); //来判断有没有进行叠加过，没有叠加过设为false，叠加过设为true

$(document).ready(function() {
  newgame();
});

//开始游戏
function newgame() {
  init();

  //在随机的两个单元格中生成数字
  generateOneNumber();
  generateOneNumber();
}

//初始化页面
function init() {
  //初始化单元格位置(下层单元格，固定不动的)
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $("#grid-cell-" + i + "-" + j);
      gridCell.css("top", getPosTop(i, j)); //计算距离上面距离
      gridCell.css("left", getPosLeft(i, j)); //计算距离左边的距离
    }
  }

  //初始化数组
  for (var i = 0; i < 4; i++) {
    nums[i] = new Array();
    hasConflicted[i] = new Array();
    for (var j = 0; j < 4; j++) {
      nums[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }

  // nums[0][2] = 4;
  // nums[1][3] = 16;

  //动态创建上层单元格并初始化
  updateView();

  score = 0;
  updateScore(score);
}

//更新上层单元格视图
function updateView() {
  //将上层所有单元格清空，然后重新初始化创建
  $(".number-cell").remove();

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      $("#content").append(
        '<div class="number-cell" id="number-cell-' + i + "-" + j + '"></div>'
      );
      var numberCell = $("#number-cell-" + i + "-" + j);
      if (nums[i][j] == 0) {
        numberCell.css("width", "0px");
        numberCell.css("height", "0px");
        numberCell.css("top", getPosTop(i, j) + 50); //+50是上层单元格从中间位置变成100px的格子
        numberCell.css("left", getPosLeft(i, j) + 50);
      } else {
        numberCell.css("width", "100px");
        numberCell.css("height", "100px");
        numberCell.css("top", getPosTop(i, j));
        numberCell.css("left", getPosLeft(i, j));
        numberCell.css(
          "background-color",
          getNumberBackgroundColor(nums[i][j])
        );
        numberCell.css("color", getNumbercolor(nums[i][j]));
        numberCell.text(nums[i][j]);
      }
      hasConflicted[i][j] = false;
    }
  }
}

/*在随机的空余格的单元格中生成随机数2或4
  1. 在空余的单元格中随即找一个
  2. 随机产生一个2或4
*/
function generateOneNumber() {
  //判断是否有空间，没有空间直接返回
  if (noSpace(nums)) {
    return;
  }

  //随机一个位置
  var count = 0;
  var temp = new Array();
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (nums[i][j] == 0) {
        temp[count] = i * 4 + j; //存储此时空的格子的i和j的思路，如果i=1,j=3,则x=7，7/4=1 7%4=3，省去了重新建一个二维数组来存储i和j的麻烦
        count++;
      }
    }
  }
  var pos = Math.floor(Math.random() * count); //[0,1)*6=[0,6) ->Math.floor 向下取整，跟temp[count]下标对上变成[0,5]
  var randx = Math.floor(temp[pos] / 4); //js里面除有小数，所以要向下取整
  var randy = Math.floor(temp[pos] % 4);

  //随机一个数字
  var randNum = Math.random() < 0.5 ? 2 : 4;

  //在随机的位置上显示随机的数字
  nums[randx][randy] = randNum; //数据发生变化，但是页面还没有发生变化
  showNumberWithAnimation(randx, randy, randNum);
}

//实现键盘的响应，点击事件
$(document).keydown(function(event) {
  //阻止事件的默认行为
  event.preventDefault();
  
  // console.log(event);
  switch (event.keyCode) {
    case 37: //左
      //判断是否可以向左移动，可以移动的话，要么左边是空的，要么左边的值跟它一样
      if (canMoveLeft(nums)) {
        moveLeft();
        setTimeout(generateOneNumber(), 200);
        setTimeout(isGameOver,500);
      }
      break;
    case 38: //上
      if (canMoveUp(nums)) {
        moveUp();
        setTimeout(generateOneNumber(), 200);
        setTimeout(isGameOver,500);
      }
      break;
    case 39: //右
      if (canMoveRight(nums)) {
        moveRight();
        setTimeout(generateOneNumber(), 200);
        setTimeout(isGameOver,500);
      }
      break;
    case 40: //下
      if (canMoveDown(nums)) {
        moveDown();
        setTimeout(generateOneNumber(), 200);
        setTimeout(isGameOver,500);
      }
      break;
    default:
      break;
  }
});

/*向左移动
  需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
  1. 落脚点没有数字，并且移动的路径中没有数字挡住
  2. 落脚点的数字和自己相同，并且移动过程中没有数字挡住
*/
function moveLeft() {
  // console.log('111');
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (nums[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          if (nums[i][k] == 0 && noBlockHorizontal(i, k, j, nums)) {
            //第i行的第k列和第j列之间是否有障碍物数字存在
            //移动操作
            showMoveAnimation(i, j, i, k); //仅为了展示移动的时候有延缓的动画效果
            nums[i][k] = nums[i][j];
            nums[i][j] = 0;
            break;
            //然后每一次移动要更新上层单元格，要不然页面显示不出来
          } else if (
            nums[i][k] == nums[i][j] &&
            noBlockHorizontal(i, k, j, nums) &&
            !hasConflicted[i][k]
          ) {
            //注意hasConflicted这里是取反操作
            showMoveAnimation(i, j, i, k);
            nums[i][k] += nums[i][j];
            nums[i][j] = 0;
            //统计分数
            score += nums[i][k];
            updateScore(score);

            hasConflicted[i][k] = true;
            break;
          }
        }
      }
    }
  }
  //更新页面上的数字单元格，此时才是真正的更新显示移动后的效果
  setTimeout("updateView()", 200); //等待200ms是为了让单元格移动效果能够显示完
}

function moveRight() {
  // console.log('111');
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      if (nums[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          if (nums[i][k] == 0 && noBlockHorizontal(i, j, k, nums)) {
            //第i行的第j列和第k列之间是否有障碍物数字存在
            //移动操作
            showMoveAnimation(i, j, i, k); //仅为了展示移动的时候有延缓的动画效果
            nums[i][k] = nums[i][j];
            nums[i][j] = 0;
            break;
            //然后每一次移动要更新上层单元格，要不然页面显示不出来
          } else if (
            nums[i][k] == nums[i][j] &&
            noBlockHorizontal(i, j, k, nums) &&
            !hasConflicted[i][k]
          ) {
            //注意hasConflicted这里是取反操作
            showMoveAnimation(i, j, i, k);
            nums[i][k] += nums[i][j];
            nums[i][j] = 0;
            //统计分数
            score += nums[i][k];
            updateScore(score);

            hasConflicted[i][k] = true;
            break;
          }
        }
      }
    }
  }
  //更新页面上的数字单元格，此时才是真正的更新显示移动后的效果
  setTimeout("updateView()", 200); //等待200ms是为了让单元格移动效果能够显示完
}

function moveUp(){  //一列一列的操作
  for(var j=0;j<4;j++){
    for(var i=1;i<4;i++){
      if(nums[i][j] != 0){
        for(var k=0;k<i;k++){
          if(nums[k][j] == 0 && noBlockVertical(j,k,i,nums)){ //第j列的第k行到第i行
            showMoveAnimation(i,j,k,j);
            nums[k][j] = nums[i][j];
            nums[i][j] = 0;
            break;
          }else if(nums[k][j] == nums[i][j] && noBlockVertical(j,k,i,nums) && !hasConflicted[k][j]){
            showMoveAnimation(i,j,k,j);
            nums[k][j] += nums[i][j];
            nums[i][j] = 0;
            score += nums[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            break;
          }
        }
      }
    }
  }
  setTimeout("updateView()",200);
}

function moveDown(){
  for(var j=0;j<4;j++){
    for(var i=2;i>=0;i--){ //最下面哪一行不需要遍历
      if(nums[i][j] != 0){
        for(var k=3;k>i;k--){ //往下移找落脚点的时候，最好从最下面往上找方便
          if(nums[k][j] == 0 && noBlockVertical(j,i,k,nums)){ //第j列的第i行到第k行
            showMoveAnimation(i,j,k,j);
            nums[k][j] = nums[i][j];
            nums[i][j] = 0;
            break;
          }else if(nums[k][j] == nums[i][j] && noBlockVertical(j,i,k,nums) && !hasConflicted[k][j]){
            showMoveAnimation(i,j,k,j);
            nums[k][j] += nums[i][j];
            nums[i][j] = 0;
            score += nums[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            break;
          }
        }
      }
    }
  }
  setTimeout("updateView()",200);
}