# retro-snaker

> ci project

## Build Setup

``` bash
# install dependencies
npm install

#更改默认样式
cp /static/antd.css /node_modules/ant-design-vue/dist
cp /static/codemirror.css /node_modules/codemirror/lib

#环境变量
API_BASE_URL 服务端数据URL 
AUTHORITY_URL 授权地址URL
CLIENT_URL 客户端URL
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
