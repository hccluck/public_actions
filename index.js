const fetch = require('node-fetch');
const sign_in = require('./src/signIn');
const draw = require('./src/draw');
const dipLucky = require('./src/dipLucky');
const sendMail = require('./src/sendMail');

const { headers } = require('./src/config');

(async () => {
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

  // 当前分数
  const { data } = await fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
    headers,
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());

  console.log(`当前矿石：${data}`);

  let dip_res;
  try {
    dip_res = await dipLucky();
  } catch (error) {
    dip_res = error;
  }

  console.log(dip_res);

  try {
    await sendMail({
      from: '掘金',
      subject: '定时任务',
      html: `
        <h1 style="text-align: center">自动签到通知</h1>
        <p style="text-indent: 2em">签到结果：${sign_res}</p>
        <p style="text-indent: 2em">抽奖结果：${draw_res}</p>
        <p style="text-indent: 2em">沾喜气结果：${dip_res}</p>
        <p style="text-indent: 2em">当前矿石：${data}</p><br/>
      `
    });

    console.log('邮件发送成功！');
  } catch (error) {
    console.error(error);
  }
})();
