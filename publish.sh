#!/usr/bin/env bash

# 检查仓库镜像库
npm config get registry
npm config set registry=https://registry.npmjs.org

echo '请进行登录相关操作：'

# 登陆
npm login

echo "-------publishing-------"

# 发布
npm publish

# 设置为淘宝镜像
npm config set registry=https://registry.npm.taobao.org

echo "发布完成"
exit
