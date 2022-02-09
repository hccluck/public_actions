/*
 *
 * 查询当前分数
 *
 **/

const fetch = require('node-fetch');
const { headers } = require('./config');

async function get_cur_point() {
  try {
    const { data } = await fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
      headers,
      method: 'GET',
      credentials: 'include'
    }).then((res) => res.json());
  
    return data;
  } catch (error) {
    return 0;
  }
}

module.exports = get_cur_point;
