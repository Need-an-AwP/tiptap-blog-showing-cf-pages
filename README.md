# tiptap blog showing page

这是一个基于 Tiptap 示例编辑器重构的富文本编辑器项目。该项目专为在 Cloudflare Pages 上部署而设计，并通过 Cloudflare Worker 与 D1 数据库进行交互。

### 沿用编辑模板
为了保留编辑时的样式和布局，此tiptap编辑器被设为只读模式，并添加了用于导航的页脚

### 关于tiptap模板源码
tiptap模板源码来自https://cloud.tiptap.dev/react-templates
该模板构建在nextjs上
原模板使用了许多pro extension，在此项目中尽量避免了使用相关功能
但是拖动手柄还是不可避免地使用了pro extension
`"@tiptap-pro/extension-drag-handle-react": "^2.10.11"`
安装pro extension需要在npm配置中添加tiptap的私有镜像
具体可参考https://cloud.tiptap.dev/pro-extensions

