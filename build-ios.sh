#!/bin/bash
# OpenClaw Calendar iOS云编译脚本
# 使用方法: 运行此脚本进行iOS云编译

echo "=== OpenClaw Calendar iOS云编译 ==="

# 1. 登录Expo (需要交互)
echo "步骤1: 请在浏览器中登录Expo账号"
eas login -b

# 2. 配置项目
echo "步骤2: 初始化EAS Build"
cd OpenClawCalendarRN
eas build:configure

# 3. 开始iOS云编译
echo "步骤3: 开始iOS云编译 (需要Apple Developer账号)"
eas build -p ios

echo "=== 编译完成 ==="
echo "编译完成后，下载IPA文件并安装到iPhone"
