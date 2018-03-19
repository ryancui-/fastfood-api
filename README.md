# 哪有饭友后端服务

支撑哪有饭友 Web 端，移动端的后端服务，基于 [ThinkJS 3.0](https://thinkjs.org/) 提供 API 接口。

## Quick start

- 安装依赖

```
$ npm install
```

- 在 `src/config` 目录下根据 `config.production.js` 和 `adapter.production.js` 新建 `config.development.js` 与 `adapter.development.js` 并填写开发环境对应的 MySQL，JWT Token 等配置信息

```
$ cp adapter.production.js adapter.development.js

$ cp config.production.js config.development.js
```

- 启动本地服务器，localhost:8360

```
$ npm start
```

## Deployment

使用 docker 进行部署，将本地代码片段打包为 docker image，应用 `*.production.js` 的配置

> npm 的依赖是从目录本地复制进去的，不是在 image build 的时候安装的，因此需要先运行 `npm i` 再 build image

```
$ docker build -t fastfood-api .
```

