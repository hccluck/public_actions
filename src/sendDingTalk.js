/**
 *
 * 发送到钉钉机器人
 *
 *  */

const fetch = require('node-fetch');
const crypto = require('crypto');

const { headers, DD_BOT_TOKEN, DD_BOT_SECRET } = require('./config');

const sendDingTalk = async (content) => {
  if (!DD_BOT_TOKEN) return Promise.reject('未配置钉钉hook');

  let msg = {
    msgtype: 'text',
    text: { content }
  };

  const dateNow = Date.now();
  const hmac = crypto.createHmac('sha256', DD_BOT_SECRET);
  hmac.update(`${dateNow}\n${DD_BOT_SECRET}`);
  const result = encodeURIComponent(hmac.digest('base64'));

  let url = `https://oapi.dingtalk.com/robot/send?access_token=${DD_BOT_TOKEN}`;

  if (DD_BOT_TOKEN && DD_BOT_SECRET) url += `&timestamp=${dateNow}&sign=${result}`;

  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(msg),
    credentials: 'include'
  }).then((res) => res.json());

  return res.errcode == 310000 ? Promise.reject(res.errmsg) : res.errmsg;
};

module.exports = sendDingTalk;
