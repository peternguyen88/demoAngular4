@set PROJECT_DIR=D:\Personal\WebstormProjects\GMAT Test\Angular4_CLI_Starter
@set FIREBASE_DIR=D:\Personal\WebstormProjects\Deployment\gmat-zero-to-hero.firebaseapp
@set HEROKU_DIR=D:\Personal\WebstormProjects\Deployment\gmat-zero-to-hero.herokuapp

@echo ON
cd /d %PROJECT_DIR%
rem ==============Copy to Deployment folders=========
robocopy "%PROJECT_DIR%\dist" %HEROKU_DIR% /s /e
robocopy "%PROJECT_DIR%\dist" %FIREBASE_DIR%\public /s /e
rem ==============Deploy Heroku======================
cd /d %HEROKU_DIR%
call __deploy.bat
rem ==============Deploy Firebase====================
cd /d %FIREBASE_DIR%
call __deploy.bat