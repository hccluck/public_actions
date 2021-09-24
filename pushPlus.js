const fetch = require('node-fetch');

const pushPlus = async (data) => {
    const body = {
        token: process.env.push_plus_token,
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

//test
// let awad = {
//     bug: 10,
//     抱枕: 10,
//     其他: 10,
// };
// pushPlus({
//     title: '掘金',
//     content: `
// <h1 style="text-align: center">自动签到通知</h1>
// <p style="text-indent: 2em">签到结果：success</p>
// <p style="text-indent: 2em">梭哈结果：${JSON.stringify(awad)}</p>
// <p style="text-indent: 2em">当前积分：10000</p><br/>
// `,
// }).catch(console.error);

module.exports = pushPlus;
