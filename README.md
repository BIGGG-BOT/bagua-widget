# 八卦桌面挂件 🌀

一个 Electron 桌面悬浮小挂件，显示后天八卦图。点击旋转、Ctrl+滚轮缩放，陪你工作。

---

## ✨ 缘起

这不是一个普通的八卦图，而是一份写给自己的"清静经"。

人生总有烦闷之时。此项目的初衷，是打造一个**数字时代的安心法器**——当你感到焦躁、思绪纷飞时，打开它，点击它，看着八卦缓缓流转，心神便随之安定。

> **万物负阴而抱阳，冲气以为和，吾心清静。**
> ——《道德经》

---

## 功能

| 操作 | 效果 |
|------|------|
| **单击** | 慢转（12 秒一圈）↔ 停止 |
| **双击** | 快转（2 秒一圈）↔ 停止 |
| **长按** | 按住越久转越快，无上限，松手保持 |
| **Ctrl + 滚轮** | 缩放八卦大小（40% ~ 150%） |
| **拖动** | 移动挂件位置 |
| **右键** | 关闭 |

---

## 安装与运行

### 环境要求

- [Node.js](https://nodejs.org) ≥ 18
- Windows 10/11（macOS 也可运行，透明窗口效果略有差异）

### 步骤

```bash
# 1. 克隆仓库
git clone https://github.com/BIGGG-BOT/bagua-widget.git
cd bagua-widget

# 2. 安装依赖（含 Electron）
npm install

# 3. 启动
node_modules\electron\dist\electron.exe .
```

> 如果 Electron 二进制下载失败（国内网络），参考下面的「常见问题」。

### 快捷方式

Windows 用户直接双击仓库里的 `启动八卦.bat`。

---

## 项目结构

```
bagua-widget/
├── main.js          # Electron 主进程（透明无边框置顶窗口）
├── preload.js       # 预加载脚本（IPC 桥接）
├── index.html       # 页面结构 + 样式
├── renderer.js      # Canvas 绘制 + 旋转动画 + 交互逻辑
├── package.json     # 项目配置
├── 启动八卦.bat      # Windows 一键启动
└── .gitignore
```

---

## 自定义

### 修改默认大小

编辑 `renderer.js`，找到 `let currentScale = 0.75`，改成你喜欢的值（1.0 = 原始大小）。

### 修改旋转速度

编辑 `renderer.js`，调整以下常量（单位：度/秒）：

```js
const SPEED_SLOW = 30;   // 单击慢转速度
const SPEED_FAST = 180;  // 双击快转速度
```

### 修改配色

编辑 `renderer.js`，搜索颜色代码（如 `#F2EFE9`、`#3A3C3B`、`#6B4E3D`）替换即可。

---

## 常见问题

### Electron 下载失败（国内网络）

设置镜像后重新安装：

```bash
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
npm install
```

### macOS 下窗口有白色边缘

macOS 对透明窗口的支持不如 Windows。可以尝试在 `main.js` 中增加：

```js
mainWindow.setHasShadow(false);
```

### 如何开机自启？

将 `启动八卦.bat` 的快捷方式放入 Windows 启动文件夹：

```
Win+R → shell:startup → 粘贴快捷方式
```

---

## 许可

MIT
