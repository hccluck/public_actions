/**
 *
 * 签到
 *
 *  */

const fetch = require('node-fetch');
const { headers } = require('./config');

async function sign_in() {
  // 查询今日是否已经签到
  const today_status = await fetch('https://api.juejin.cn/growth_api/v1/get_today_status', {
    headers,
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());

  if (today_status.err_no !== 0) return Promise.reject('签到失败！');
  if (today_status.data) return '今日已经签到！';

  // 签到
  const res = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
    headers,
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());

  if (res.err_no !== 0) return Promise.reject('签到异常！');

  return `签到成功！`;
}

module.exports = sign_in;
