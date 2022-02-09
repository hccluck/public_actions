const sign_in = require('./src/signIn');
const draw = require('./src/draw');
const dipLucky = require('./src/dipLucky');
const sendMail = require('./src/sendMail');
const getPoint = require('./src/getPoint');

const { autoGame } = require('./src/games/autoRun');

(async () => {
  // 上次分数
  const yesterday_score = await getPoint();

  console.log(`昨日矿石：${yesterday_score}`);

  let sign_res = '';

  try {
    sign_res = await sign_in();
  } catch (error) {
    sign_res = error;
  }

  console.log(sign_res);

  let draw_res = '';
  try {
    draw_res = await draw();
  } catch (error) {
    draw_res = error;
  }

  console.log(draw_res);

  let game_res = '挖矿成功！';
  try {
    await autoGame();
  } catch (error) {
    game_res = '挖矿失败！';
  }

  // 当前分数
  const now_score = await getPoint();

  console.log(`当前矿石：${now_score}`);

  let dip_res;
  try {
    dip_res = await dipLucky();
  } catch (error) {
    dip_res = error;
  }

  console.log(dip_res);

  try {
    const html = `
      <h1 style="text-align: center">自动签到通知</h1>
      <p style="text-indent: 2em">沾喜气结果：${dip_res}</p>
      <p style="text-indent: 2em">当前矿石：${now_score}</p>
      <p style="text-indent: 2em">较昨日增长：${now_score - yesterday_score}</p>
      <p style="text-indent: 2em">签到结果：${sign_res}</p>
      <p style="text-indent: 2em">抽奖结果：${draw_res}</p>
      <p style="text-indent: 2em">游戏结果：${game_res}</p><br/>
    `;

    console.log(html);

    await sendMail({ from: '掘金', subject: '定时任务', html });

    console.log('邮件发送成功！');
  } catch (error) {
    console.error(error);
  }
})();
