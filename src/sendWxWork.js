const fetch = require('node-fetch')

const { WORKWX_WEBHOOK } = require('./config')

/**
 * 发送到企业微信机器人
 * @param {*} content
 * @returns
 */
const sendDingTalk = async content => {
  try {
    if (!WORKWX_WEBHOOK) return Promise.reject('未配置企业微信机器人通知')

    const data = {
      msgtype: 'markdown',
      markdown: { content }
    }

    const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${WORKWX_WEBHOOK}`

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json())

    return res.errcode === 0
      ? '发送企业微信机器人通知成功'
      : Promise.reject('发送企业微信机器人通知失败')
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendDingTalk
