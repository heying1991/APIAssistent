# 🚀 API Testing Platform

一个功能强大的在线 API 测试平台，使用 React 构建，提供现代化的用户界面和丰富的功能特性。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 功能特性

### 🔧 核心功能
- **HTTP 请求支持**: 支持 GET、POST、PUT、DELETE、PATCH 等所有 HTTP 方法
- **请求构建器**: 直观的 URL 输入、请求头管理、参数设置和请求体编辑
- **响应查看器**: 实时显示响应状态、头部信息、响应体和执行时间
- **错误处理**: 完善的错误捕获和显示机制，包含详细的错误信息

### 🎨 界面特性
- **多主题支持**: 
  - 🌞 浅色主题 (Light)
  - 🌙 深色主题 (Dark) 
  - 🌈 彩色主题 (Colorful) - 带有蛋糕糖果小马动画效果
  - ⚡ 科技主题 (Tech) - 极致清冷的科技风格
- **响应式设计**: 完美适配桌面和移动设备
- **可拖拽分割**: 左右面板可自由调整宽度
- **现代化 UI**: 采用最新的设计趋势，界面简洁美观

### 📚 数据管理
- **历史记录**: 自动保存请求历史，支持查看、重试和删除
- **集合管理**: 创建和管理 API 集合，支持分类和搜索
- **自动保存**: 可配置的自动保存功能
- **本地存储**: 所有数据安全保存在浏览器本地

### 🌍 国际化
- **多语言支持**: 中文和英文界面
- **动态切换**: 实时切换语言，无需刷新页面

## 🛠️ 技术栈

- **前端框架**: React 18.2.0
- **路由管理**: React Router DOM 6.3.0
- **HTTP 客户端**: Axios 1.4.0
- **图标库**: Lucide React 0.263.1
- **代码高亮**: React Syntax Highlighter 15.5.0
- **构建工具**: Create React App 5.0.1
- **样式**: CSS3 + CSS Variables (主题系统)

## 📦 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
# 本地开发 (localhost:3000)
npm run start:local

# 网络访问 (0.0.0.0:3000)
npm start
```

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
npm test
```

## 🎯 使用指南

### 发送 API 请求

1. **选择请求方法**: 在左上角选择 HTTP 方法 (GET, POST, PUT, DELETE, PATCH)
2. **输入 URL**: 在 URL 输入框中输入完整的 API 地址
3. **配置请求头**: 在 Headers 标签页中添加自定义请求头
4. **设置参数**: 在 Params 标签页中添加 URL 查询参数
5. **编写请求体**: 在 Body 标签页中编写 JSON 或表单数据 (仅 POST/PUT/PATCH)
6. **发送请求**: 点击发送按钮，查看响应结果

### 管理历史记录

- **查看历史**: 点击顶部导航的"历史"按钮
- **重试请求**: 在历史记录中点击"重试"按钮
- **删除记录**: 点击删除按钮移除不需要的历史记录
- **搜索过滤**: 使用搜索框快速找到特定请求

### 创建集合

1. **新建集合**: 在集合页面点击"新建集合"
2. **添加请求**: 在集合中添加 API 请求
3. **组织管理**: 创建文件夹分类管理 API
4. **导入导出**: 支持集合的导入和导出

### 个性化设置

- **主题切换**: 在设置页面选择喜欢的主题
- **语言设置**: 切换中英文界面
- **自动保存**: 开启或关闭自动保存功能

## 🎨 主题特色

### 🌈 Colorful 主题
- 炫彩的紫色系配色
- 点击发送按钮时的蛋糕糖果小马动画效果 🍰🎂🧁🍪🍭🍬🍡🍩🦄🐴🦓🌈
- 霓虹灯风格的界面元素

### ⚡ Tech 主题  
- 极致清冷的科技风格
- 蓝色系配色方案
- 未来感十足的界面设计

### 🌙 Dark 主题
- 经典的深色模式
- 护眼舒适的配色
- 适合夜间使用

### 🌞 Light 主题
- 清爽的浅色模式
- 适合日间使用
- 传统简洁的设计

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── RequestBuilder/  # 请求构建器
│   ├── ResponseViewer/  # 响应查看器
│   ├── History/         # 历史记录
│   ├── Collections/     # 集合管理
│   ├── Settings/        # 设置页面
│   └── common/          # 通用组件
├── context/             # React Context
│   └── SettingsContext.js
├── locales/             # 国际化文件
│   └── translations.js
├── App.js              # 主应用组件
└── index.js            # 应用入口
```

## 🔧 开发指南

### 添加新主题
1. 在 `SettingsContext.js` 中添加新主题的 CSS 变量
2. 在设置组件中添加主题选项
3. 更新主题切换逻辑

### 添加新功能
1. 创建新的组件文件
2. 在 `App.js` 中添加路由
3. 在导航中添加菜单项

### 国际化支持
1. 在 `translations.js` 中添加新的翻译键值
2. 在组件中使用 `getTranslation` 函数
3. 在设置中添加语言选项

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [Lucide React](https://lucide.dev/) - 图标库
- [Axios](https://axios-http.com/) - HTTP 客户端
- [React Router](https://reactrouter.com/) - 路由管理

---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 