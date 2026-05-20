@echo off
cd /d "%~dp0"
title My AI Closet

:: 1. 가상환경(.venv)이 존재하면 가상환경 파이썬으로 직접 실행
if exist .venv\Scripts\python.exe (
    echo [INFO] Virtual environment found. Running Streamlit...
    .venv\Scripts\python.exe -m streamlit run app.py
) else (
    echo [WARNING] .venv not found. Trying global python...
    python -m streamlit run app.py
)

:: 2. 만약 실행에 실패한 경우 (라이브러리가 설치 안 되었을 때)
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Installing required packages...
    if exist .venv\Scripts\pip.exe (
        .venv\Scripts\pip.exe install -r requirements.txt
        .venv\Scripts\python.exe -m streamlit run app.py
    ) else (
        pip install -r requirements.txt
        python -m streamlit run app.py
    )
)

pause
