const fetch = require('node-fetch');
const sign_in = require('./src/signIn');
const draw = require('./src/draw');
const dipLucky = require('./src/dipLucky');
const { headers, webhook, phone, corpid,corpsecret, touser, agentid } = require('./src/config');
const axios = require('axios');
  (async ()=>{
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
    };
    try {
      const gettokenURL = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww777712c027a9d7e5&corpsecret=ijmTDi2by1NeXxnAsKGweDvnKNG_WvyOEudeuEz9KB0`
         var getAccess_token = await axios.get(gettokenURL)
    } catch (error) {
      console.log('推送错误',error)
    }
    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${getAccess_token.data.access_token}`
      console.log('获取到的发送微信地址：'，url)
      await axios.post(url, {
                "touser": touser,
                "agentid": agentid,
                "msgtype": "textcard",
                "textcard": {
                  "title": '掘金定时任务',
                  "description": `<div>签到结果：${sign_res}</div><div>抽奖结果：${draw_res}</div><div>沾喜气结果：${dip_res}</div><div>当前矿石：${data}</div>`,
                  "url": "URL",
                  "btntxt": "点击没用"
                }
              }).then(res => {
            })
    } catch (error){
    
    }
  })();
