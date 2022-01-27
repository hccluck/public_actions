const { headers, uid } = require('../config');

const { Game } = require('./Game');

const NAGETIVE_DIRECTION = {
  U: 'D',
  L: 'R',
  D: 'U',
  R: 'L'
};
const COLUMN = 6;
const OBSTACLE = 6;

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const random = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * @desc 一维数组转二维数组
 * @param {Array} arr 原数据
 * @param {Number} num 每个维度的元素数量
 */
function ArrayOneToTwo(arr, num) {
  let arrList = [];
  arr.map((item, index) => {
    if (index % num == 0) {
      arrList.push([item]);
    } else {
      arrList[arrList.length - 1].push(item);
    }
  });
  return arrList;
}

/**
 * @desc 计算行走轨迹
 * @param {Array} maps 地图
 */
const getTarck = (maps) => {
  const mapsTrack = [
    [3, 1, 'U'],
    [2, 2, 'L'],
    [4, 2, 'D'],
    [3, 3, 'R']
  ];
  const mapsTree = ArrayOneToTwo(maps, COLUMN);

  // 过滤掉有障碍物的位置
  const trackXY = mapsTrack.filter((item) => {
    const xy = mapsTree[item[0]][item[1]];
    return xy !== OBSTACLE;
  });

  // 移动后反方向移动回初始位置
  const trackList = trackXY
    .map((item) => {
      return [item[2], NAGETIVE_DIRECTION[item[2]]];
    })
    .flat();
  return trackList;
};

let runNum = 0;
let retry = false; // 报错后，尝试再次执行
const autoGame = async () => {
  if (!uid) return Promise.reject('未配置UID');

  try {
    runNum++;
    if (runNum > 500) return; // 防止死循环
    let exp = new Game(uid, headers.cookie);

    let gameData = await exp.openGame();

    console.log(gameData !== undefined ? 'Game Start🎮' : 'Game Start Error❌');
    if (!gameData) return Promise.reject('未配置UID');

    const { mapData } = gameData;
    const track = getTarck(mapData);

    await sleep(2000);
    await exp.move(track);

    await sleep(2000);
    const res = await exp.outGame();

    res.body = JSON.parse(res.body);
    console.log(
      `Game over, 本次获得: ${res.body.data.realDiamond}, 今日已获得: ${res.body.data.todayDiamond}, 今日上限: ${res.body.data.todayLimitDiamond}`
    );

    if (res.body.data.realDiamond < 40) {
      // 奖励小于40刷新下地图
      await sleep(2000);
      await exp.freshMap();
    }
    // 没达到今日上限继续自动游戏
    if (res.body.data.todayDiamond < res.body.data.todayLimitDiamond) {
      const time = random(15000, 10000);
      console.log(`${time}ms后开始下一轮游戏🎮,请稍等～`);
      await sleep(time);
      await autoGame();
    } else {
      console.log('今日奖励已达上限！');
    }
  } catch (e) {
    console.log('捕获到错误 => ', e);
    if (retry) return Promise.reject(e);
    console.log('20s后尝试再次执行🎮');
    retry = true;
    await sleep(20000); // 设置10s执行一次，防止接口调用太过频繁，服务器报500的错
    await autoGame();
  }
};

exports.autoGame = autoGame;
