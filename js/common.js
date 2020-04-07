//获取距离上边的位置
function getPosTop(i, j) {
  return 20 + 120 * i;
}

//获取距离左边的位置
function getPosLeft(i, j) {
  return 20 + 120 * j;
}

//获取数据背景颜色
function getNumberBackgroundColor(num) {
  switch (num) {
    case 2:
      return "#eee4da";
      break;
    case 4:
      return "#ede0c8";
      break;
    case 8:
      return "#f2b179";
      break;
    case 16:
      return "#f59563";
      break;
    case 32:
      return "#f67c5f";
      break;
    case 64:
      return "#f65e3b";
      break;
    case 128:
      return "#edcf72";
      break;
    case 256:
      return "#edcc61";
      break;
    case 512:
      return "#9c0";
      break;
    case 1024:
      return "#33b5e5";
      break;
    case 2048:
      return "#09c";
      break;
    case 4096:
      return "#a6c";
      break;
    case 8192:
      return "#93c";
      break;
  }
}

//获取数字颜色
function getNumbercolor(num) {
  if (num <= 4) {
    return "#776e65";
  } else {
    return "#fff";
  }
}

//判断是否没有空间
function noSpace(nums) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (nums[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}

//判断能否向左移动
function canMoveLeft(nums) {
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (nums[i][j] != 0) {
        if (nums[i][j - 1] == 0 || nums[i][j - 1] == nums[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

//判断水平方向上是否没有障碍物
function noBlockHorizontal(row, col1, col2, nums) {
  for (var i = col1 + 1; i < col2; i++) {
    if (nums[row][i] != 0) {
      return false;
    }
  }
  return true;
}

//更新分数
function updateScore(score) {
  $("#score").text(score);
}

//判断能否向右移动
function canMoveRight(nums) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 4; j++) {
      if (nums[i][j] != 0) {
        if (nums[i][j + 1] == 0 || nums[i][j + 1] == nums[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

//判断竖直方向上有没有障碍物
function noBlockVertical(col,row1,row2,nums){
  for(var i = row1 + 1;i < row2;i++){
    if(nums[i][col] != 0){
      return false;
    }
  }
  return true;
}
//判断是否能向上移动
function canMoveUp(nums) {
  for (var i = 1; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (nums[i][j] != 0) {
        if (nums[i - 1][j] == 0 || nums[i - 1][j] == nums[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
//判断是否能像下移动
function canMoveDown(nums){
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 4; j++) {
      if (nums[i][j] != 0) {
        if (nums[i + 1][j] == 0 || nums[i + 1][j] == nums[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

//判断是否不能移动
function noMove(nums){
  if(canMoveLeft(nums) || canMoveRight(nums) || canMoveUp(nums) || canMoveDown(nums)){
    return false;
  }
  return true;
}

//判断游戏是否结束，两个条件：1.没有空的单元格，2.不能移动了
function isGameOver(){
  if(noSpace(nums) && noMove(nums)){
    alert('Oh! Man! Your Game Is Over!');
  }
}