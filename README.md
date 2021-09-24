## 定时任务脚本

掘金自动签到 签到后会获得一次免费抽奖机会，自动触发免费抽奖。
执行结束发送PUSHPLUS通知签到结果。
增加梭哈选项

使用方法：fork 本仓库

打开浏览器，登陆掘金，F12 查看 Network 面板，复制 cookie

打开 github 仓库的 Setting，选择 Secrets，新建下列 3 个仓库 Secret
| key             | value                               |
| --------------- | ----------------------------------- |
| COOKIE          | 值为上面复制掘金的 cookie           |
| PUSH_PLUS_TOKEN | PUSH PLUS TOKEN                     |
| SUOHA           | 是否梭哈     1梭哈 0 不梭哈 默认是0 |

`注意：掘金的cookie大概有一个月的有效期，所以需要定期更新Secret`
