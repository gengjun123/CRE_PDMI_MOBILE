# CRE_PDMI_MOBILE（人民日媒资库报社移动端）

#### 安装nodejs环境
 - 下载使用的操作系统对应的nodejs版本 https://nodejs.org/en/download/
 - 安装nodejs。
 
#### 启动
 - 解压zip包，`unzip CRE_PDMI_MOBILE.zip`
 - 安装forever进程管理工具 `npm i forever -g`
 - cd到解压缩的目录，执行 `NODE_ENV={项目名称} forever start server.js`
 - 项目名称是指项目的代号，代码会根据项目名称读取不同的配置。内蒙古的项目名称为neimenggu，人民日报社的项目名称为peopledaily。
