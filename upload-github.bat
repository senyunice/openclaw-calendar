@echo off
chcp 65001 >nul
echo ============================================
echo GitHub上传脚本 - OpenClawCalendarRN
echo ============================================
echo.

REM 检查Git是否安装
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: Git未安装!
    echo 请先安装Git: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo 步骤1: 初始化Git仓库
cd /d "%~dp0"
if not exist ".git" (
    git init
    git add .
    git commit -m "Initial commit: OpenClawCalendar iOS App"
)

echo.
echo 步骤2: 创建GitHub仓库
echo 请在GitHub创建新仓库: https://github.com/new
set /p REPO_URL=请输入仓库URL (例如: https://github.com/username/openclaw-calendar.git):

echo.
echo 步骤3: 推送代码
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ============================================
echo 上传成功!
echo.
echo 下一步:
echo 1. 打开GitHub仓库的Actions页面
echo 2. 运行 iOS Build workflow
echo 3. 下载生成的IPA文件
echo ============================================
pause
