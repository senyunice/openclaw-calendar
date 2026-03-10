# OpenClaw Calendar - React Native版本

跨平台日历App，可在Windows上直接编译！

## 功能特性

- 📅 月历视图
- ✅ 任务管理（添加、完成、删除）
- 🔄 API同步（可选）
- 🌙 深色主题
- 📱 跨平台支持

## 快速开始

### 1. 安装依赖

```bash
cd OpenClawCalendarRN
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

### 3. 运行应用

- **Android**: `npm run android`
- **iOS**: `npm run ios` (需要Mac)
- **Web**: `npm run web`

### 4. 构建APK（Windows）

```bash
# 安装expo-cli
npm install -g expo-cli

# 构建Android APK
expo build:android -t apk
```

或使用EAS Build：
```bash
npm install -g eas-cli
eas build -p android
```

## 项目结构

```
OpenClawCalendarRN/
├── App.js              # 主应用
├── app.json            # Expo配置
├── package.json        # 依赖
├── babel.config.js     # Babel配置
└── assets/             # 静态资源
```

## API配置

App默认连接本地API：
- 地址：`http://localhost:18796/api`
- 如需修改，编辑 `App.js` 中的 `API_BASE_URL`

## 后端API

后端位于：`../openclaw-calendar-api/`

启动后端：
```bash
cd ../openclaw-calendar-api
python app.py
```

API端点：
- `GET /api/tasks` - 获取所有任务
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/<id>` - 更新任务
- `DELETE /api/tasks/<id>` - 删除任务

## 编译说明

### Windows生成APK
```bash
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

### iOS编译（需要Mac）
```bash
npx expo prebuild --platform ios
# 用Xcode打开ios目录编译
```

### 云编译（推荐）
使用Expo EAS Build：
1. 注册 Expo 账号
2. 运行 `eas login`
3. 运行 `eas build`

## 技术栈

- React Native 0.76
- Expo SDK 52
- date-fns (日期处理)
- Zustand (状态管理)
- React Native Paper (UI组件)

---
**Matrix 2026-03-10**
