const fetch = require('node-fetch');
const sign_in = require('./src/signIn');
const draw = require('./src/draw');
const dipLucky = require('./src/dipLucky');
const { headers, webhook, phone } = require('./src/config');
const axios = require('axios')

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
      await axios.post(webhook, {
        msgtype: "markdown",
        markdown: {
          title: "掘金",
          text: `### 掘金任务结果 @${phone} \n > #### 签到结果：${sign_res} \n > #### 抽奖结果：${draw_res} \n > #### 沾喜气结果：${dip_res} \n > #### 当前矿石：${data} \n`
        },
        at: {
          atMobiles: [
            "'" + phone + "'"
          ]
        }
      }).then(res => {
        console.log(res)
      })
    } catch (error) {
      console.log(error)
    }
  })();


