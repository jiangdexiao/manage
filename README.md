# y

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all test1s
npm test

# 项目结构说明：
--src
----apis  接口
-------biManagePlatform         bi系统
-------businessManagePlatform   运营管理系统
-------mediaManagePlatform      媒体管理系统
-------mediaSaleManagePaltform  媒体行销系统
-------sellerManagePlatform     商家管理系统
-------customManagePlatform     工具管理系统
-------common                   通用api
-------user                     用户相关api

----assets

----components                  通用组件
-------basic                    基础组件
-------business                 业务组件
-------echarts                  图表组件
-------form-data                表单组件
-------list-data                列表组件
-------layout                   布局组件

----config                      配置文件夹
----json                        静态json菜单数据
----register                    注册目录

----router                      路由
-------biManagePlatform         bi系统
-------businessManagePlatform   运营管理系统
-------mediaManagePlatform      媒体管理系统
-------mediaSaleManagePaltform  媒体行销系统
-------sellerManagePlatform     商家管理系统
-------customManagePlatform     工具管理系统

----store                       vuex
-------modules                  模块

----utils                       工具类
-------ajax                     ajax
-------directive                指令
-------filter                   过滤器
-------rules                    表单验证规则
-------tool                     常用工具

----views                       视图
-------biManagePlatform         bi系统
-------businessManagePlatform   运营管理系统
-------mediaManagePlatform      媒体管理系统
-------mediaSaleManagePaltform  媒体行销系统
-------sellerManagePlatform     商家管理系统
-------customManagePlatform     工具管理系统
-------login

--static                        静态资源目录
----images
----css
----js
----fonts
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
