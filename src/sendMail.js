/**
 *
 * 发送邮件通知脚本执行结果
 *
 *  */

const nodemailer = require('nodemailer');

const { user, pass, to } = require('./config');

const sendMail = async (data) => {
  if (!user || !pass) return Promise.reject('未配置邮箱账号密码！！！');

  let transporter = null;

  const EmailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!EmailReg.test(user)) return Promise.reject('未正确配置邮箱账号格式！！！');

  try {
    const [, type] = user.split('@');

    transporter = nodemailer.createTransport({
      host: `smtp.${type || 'qq.com'}`,
      port: '465',
      secureConnection: true,
      auth: { user, pass }
    });
  } catch (error) {
    return Promise.reject('邮箱账号密码配置错误！！！');
  }

  data.from = `"${data.from}" ${user}`;
  data.to = to;

  return await transporter.sendMail(data);
};

module.exports = sendMail;
