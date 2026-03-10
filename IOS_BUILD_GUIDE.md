# OpenClaw Calendar iOS编译指南

## 方式一：GitHub Actions云编译（推荐）

### 步骤1: 上传项目到GitHub
将以下文件/文件夹上传到GitHub仓库：
- `OpenClawCalendarRN/` 目录
- `.github/workflows/ios-build.yml`

### 步骤2: 配置Secrets
在GitHub仓库设置中添加：
- `EXPO_USERNAME`: 你的Expo账号邮箱
- `EXPO_PASSWORD`: 你的Expo账号密码

### 步骤3: 触发编译
1. 打开GitHub仓库的Actions页面
2. 选择 "Build iOS IPA" workflow
3. 点击 "Run workflow"
4. 输入Expo账号密码
5. 等待编译完成（约10-15分钟）

### 步骤4: 下载IPA
编译完成后，在Artifacts中下载IPA文件

### 步骤5: 安装到iPhone
1. 下载AltStore（免费iOS签名工具）
2. 用AltStore签名IPA文件
3. 安装到iPhone

---

## 方式二：本地Mac编译

### 前提条件
- Mac电脑
- Xcode已安装
- Apple Developer账号

### 编译步骤
```bash
# 1. 克隆项目
git clone <你的仓库地址>
cd OpenClawCalendarRN

# 2. 安装依赖
npm install

# 3. 登录Expo
npx expo login

# 4. 生成本地iOS项目
npx expo prebuild --platform ios

# 5. 用Xcode打开
open ios/OpenClawCalendar.xcworkspace

# 6. 在Xcode中选择：
#    - Team: 你的Apple Developer Team
#    - Device: iPhone
#    - 点击Run编译并安装
```

---

## 方式三：Expo云编译

### 前提条件
- Expo账号（免费注册）
- Apple Developer账号（$99/年）

### 编译步骤
```bash
# 1. 安装EAS CLI
npm install -g eas-cli

# 2. 登录
eas login

# 3. 初始化项目
cd OpenClawCalendarRN
eas build:configure

# 4. 开始iOS编译
eas build -p ios

# 5. 完成后下载IPA
eas build:download
```

---

## 问题排查

### 常见错误

**1. "No Apple Developer Team found"**
- 解决方案：登录Apple Developer账号

**2. "Bundle ID already exists"**
- 解决方案：在app.json中修改bundleIdentifier

**3. "Pod install failed"**
- 解决方案：删除ios/Pods重新运行

---

## 技术支持

如遇问题，请联系Matrix团队。

---
**Matrix 2026-03-10**
