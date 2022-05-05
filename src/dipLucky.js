/**
 *
 * 粘喜气
 *
 *  */

const fetch = require('node-fetch');
const { headers } = require('./config');

const random = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min);

async function dipLucky() {
  const list = await fetch('https://api.juejin.cn/growth_api/v1/lottery_history/global_big', {
    headers,
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ page_no: 1, page_size: 5 })
  }).then((res) => res.json());

  const index = random(list.data.lotteries.length - 1);

  const res = await fetch('https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky', {
    headers,
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ lottery_history_id: list.data.lotteries[index].history_id })
  }).then((res) => res.json());

  if (res.err_no !== 0) return Promise.reject('可能是由于cookie导致的网络异常！');

  if (res.data.has_dip) return `今日已经沾过喜气！喜气值：${res.data.total_value}`;

  if (res.data.dip_action === 1) return `沾喜气成功！喜气值：${res.data.total_value}`;
}

module.exports = dipLucky;
