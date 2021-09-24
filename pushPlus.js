const fetch = require('node-fetch');

const pushPlus = async (data) => {
    const body = {
        token: process.env.push_plus_token || 'e1c10303f47a45caa2f21ce99d60e090',
        title: `${data.title}`,
        content: `${data.content}`,
    };
    try {
        const pushPlusRes = await fetch('https://www.pushplus.plus/send', {
            headers: { 'Content-Type': ' application/json' },
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
        }).then((res) => res.json());
        if (pushPlusRes.code === 200) {
            console.log(`push+发送一对多通知消息完成。\n`);
        } else {
            console.log(`push+发送一对多通知消息失败：${pushPlusRes.msg}\n`);
        }
    } catch (error) {
        console.log(`push+发送一对多通知消息失败！！\n`);
        console.error(error);
    }
};

module.exports = pushPlus;
