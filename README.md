# Fastfood 快订餐微信小程序后端

订餐后端

## Quick start

- 安装依赖

```
npm install
```

- 在 `src/config` 目录下新建 `config.development.js` 与 `adapter.development.js`

```
cp adapter.production.js adapter.development.js
```

按本地数据库配置。

- `config.development.js` 的内容为：

```javascript
module.exports = {
  weixin: {
    appid: '', // 小程序 appid
    secret: '' // 小程序密钥
  }
};
```

- Start server

```
npm start
```
