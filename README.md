# CRE_PDMI_MOBILE
人民日媒资库报社移动端

windows下面启动，需要安装cross-env插件 `npm i cross-env -g`

开发环境下启动 `cross-env NODE_ENV=development node server`

如果想添加其他环境下的配置文件，可直接在config目录下添加{环境变量名}.js。 然后再以`cross-env NODE_ENV={环境变量名} node server`启动。config-lite会先读取default.js中的配置，然后再读取该环境的配置，重复的会覆盖。