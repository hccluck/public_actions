/**
 *
 * 发送邮件通知脚本执行结果
 *
 *  */

const nodemailer = require('nodemailer');

const { user, pass, to } = require('./config');

const sendMail = async (data) => {
  if (!user || !pass) return Promise.reject('未配置QQ邮箱账号密码！！！');

  let transporter = null;

  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: '465',
      secureConnection: true,
      auth: { user, pass }
    });
  } catch (error) {
    return Promise.reject('QQ邮箱账号密码配置错误！！！');
  }

  data.from = `"${data.from}" ${user}`;
  data.to = to;

  return await transporter.sendMail(data);
};

module.exports = sendMail;
