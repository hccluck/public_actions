const fetch = require('node-fetch');

const pushPlus = async (data) => {
    const body = {
        token: process.env.PUSH_PLUS_TOKEN || 'e1c10303f47a45caa2f21ce99d60e090',
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

pushPlus({
    title: '掘金',
    content: `
<h1 style="text-align: center">自动签到通知</h1>
<p style="text-indent: 2em">签到结果：成功</p>
<p style="text-indent: 2em">当前积分：10000</p><br/>
`,
}).catch(console.error);

module.exports = pushPlus;
