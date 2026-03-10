@echo off
chcp 65001 >nul
echo ============================================
echo OpenClaw Calendar iOS云编译脚本
echo ============================================
echo.

echo 步骤1: 登录Expo账号
echo 请在浏览器中完成登录...
eas login

echo.
echo 步骤2: 初始化EAS Build
cd /d "%~dp0OpenClawCalendarRN"
eas build:configure

echo.
echo 步骤3: 开始iOS云编译
echo 注意: 需要Apple Developer账号!
eas build -p ios

echo.
echo ============================================
echo 编译完成!
echo 下载IPA文件后，可通过以下方式安装到iPhone:
echo 1. Xcode -> Window -> Devices and Simulators
echo 2. 或者使用AltStore/签名工具
echo ============================================
pause
