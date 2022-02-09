const { headers } = require('../config');
const got = require('got')
const jwt = require('jsonwebtoken')

const GET_TOKEN_URL = 'https://juejin.cn/get/token'

const HOST_BASE = 'https://juejin-game.bytedance.com/game/sea-gold'
const START_GAME_URL = HOST_BASE + '/game/start?'
const LOGIN_GAME_URL = HOST_BASE + '/user/login?'
const GET_INFO_URL = HOST_BASE + '/home/info?'
const COMMAND_URL = HOST_BASE + '/game/command?'
const OVER_GAME_URL = HOST_BASE + '/game/over?'
const FRESH_MAP_URL = HOST_BASE + '/game/fresh_map?'
const ROLE_LIST = {
  CLICK: 2,
  YOYO: 1,
  HAWKING: 3
}

const PUBLIC_KEY = `-----BEGIN EC PARAMETERS-----
BggqhkjOPQMBBw==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49
AwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU
nYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==
-----END EC PRIVATE KEY-----
`
class Game {
  #uid
  #username
  #cookie
  #authorization
  #gameId

  constructor(uid, cookie) {
    this.#uid = uid
    this.#cookie = cookie
  }

  /**
   * @desc 启动游戏
   * @returns {Boolean} 是否启动成功
   */
   openGame = async () => {
    // 1.获取授权
    let res = await this.#getToken().json()
    this.#authorization = 'Bearer ' + res.data

    // 2.获取用户名
    res = await this.#getInfo().json()
    this.#username = res.data.userInfo.name
    const gameStatus = res.data.gameStatus

    // 3.登录游戏
    await this.#loginGame().json()

    if (gameStatus !== 0) {
      // 如果已经在游戏中那么先退出游戏
      await this.outGame()
    }

    // 4.开始游戏，获取游戏id
    res = await this.#startGame(ROLE_LIST.CLICK).json()
    this.#gameId = res.data.gameId

    // 5.游戏启动成功返回游戏信息
    return this.#gameId !== undefined ? res.data : undefined
  }

  /**
   * @desc 获取authorization授权
   * @returns
   */
  #getToken = () => {
    const cookie = this.#cookie
    return got.post(GET_TOKEN_URL, {
      hooks: {
        beforeRequest: [
          options => {
            Object.assign(options.headers, {
              ...headers,
              cookie
            })
          }
        ]
      }
    })
  }

  /**
   * @desc 获取用户信息
   * @returns
   */
  #getInfo = () => {
    const URL = GET_INFO_URL + `uid=${this.#uid}&time=` + new Date().getTime()
    const authorization = this.#authorization
    return got.get(URL, {
      hooks: {
        beforeRequest: [
          options => {
            Object.assign(options.headers, {
              ...headers,
              authorization: authorization
            })
          }
        ]
      }
    })
  }

  /**
   * @desc 登录游戏
   * @returns
   */
  #loginGame = () => {
    const URL = LOGIN_GAME_URL + `uid=${this.#uid}&time=` + new Date().getTime()
    const body = { name: this.#username }
    const authorization = this.#authorization
    return got.post(URL, {
      hooks: {
        beforeRequest: [
          options => {
            Object.assign(options.headers, {
              ...headers,
              authorization: authorization
            })
          }
        ]
      },
      json: body
    })
  }

  /**
   * @desc 开始游戏
   * @param {Number} roleId 角色id
   */
  #startGame = roleId => {
    const URL = START_GAME_URL + `uid=${this.#uid}&time=` + new Date().getTime()
    const body = { roleId }
    const authorization = this.#authorization
    return got.post(URL, {
      hooks: {
        beforeRequest: [
          options => {
            Object.assign(options.headers, {
              ...headers,
              authorization: authorization
            })
          }
        ]
      },
      json: body
    })
  }

  /**
   * @desc 移动
   * @param {Array} command 移动参数 例(向上一步，向右6步)：{"command":["U", {"times":6,"command":["R"]}]}
   */
  move = command => {
    const NOW_TIME = new Date().getTime()
    const URL = COMMAND_URL + `uid=${this.#uid}&time=` + NOW_TIME
    const body = { command }
    const authorization = this.#authorization
    const xttgameid = this.#getSign(NOW_TIME)
    return got.post(URL, {
      hooks: {
        beforeRequest: [
          options => {
            Object.assign(options.headers, {
              ...headers,
              authorization: authorization,
              'x-tt-gameid': xttgameid
            })
          }
        ]
      },
      json: body
    })
  }

  /**
   * @desc 计算签名
   * @param {Number} t  13位时间戳
   * @returns {String} sign
   */
  #getSign = t => {
    return jwt.sign(
      {
        gameId: this.#gameId,
        time: t
      },
      PUBLIC_KEY,
      {
        algorithm: 'ES256',
        expiresIn: 2592e3,
        header: {
          alg: 'ES256',
          typ: 'JWT'
        }
      }
    )
  }

  /**
   * @desc 结束游戏
   */
  outGame = () => {
    const URL = OVER_GAME_URL + `uid=${this.#uid}&time=` + new Date().getTime()
    const body = { isButton: 1 }
    const authorization = this.#authorization
    return got.post(URL, {
      hooks: {
        beforeRequest: [
          options => {
            Object.assign(options.headers, {
              ...headers,
              authorization: authorization
            })
          }
        ]
      },
      json: body
    })
  }

  /**
   * @desc 刷新地图
   */
  freshMap = () => {
    const URL = FRESH_MAP_URL + `uid=${this.#uid}&time=` + new Date().getTime()
    const body = {}
    const authorization = this.#authorization
    return got.post(URL, {
      hooks: {
        beforeRequest: [
          options => {
            Object.assign(options.headers, {
              ...headers,
              authorization: authorization
            })
          }
        ]
      },
      json: body
    })
  }
}

exports.Game = Game