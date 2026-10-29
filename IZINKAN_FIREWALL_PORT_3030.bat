@echo off
chcp 65001 >nul
title Pengaturan Firewall Port 3030 - VibeGenesis

echo.
echo ======================================================================
echo    PENGATURAN FIREWALL PORT 3030 UNTUK AKSES DARI HP / PERANGKAT LAIN
echo ======================================================================
echo.
echo Script ini akan mendaftarkan aturan Inbound Rule pada Windows Firewall
echo agar HP, Tablet, dan laptop lain di jaringan Wi-Fi yang sama dapat
echo membuka aplikasi di http://<IP-KOMPUTER>:3030.
echo.
echo Pastikan Anda menjalankan file ini dengan:
echo Klik Kanan -> 'Run as administrator'
echo.

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [PERINGATAN] Script ini membutuhkan hak Administrator!
    echo Silakan tutup jendela ini, lalu Klik Kanan pada file .bat ini
    echo dan pilih 'Run as administrator' (Jalankan sebagai administrator).
    echo.
    pause
    exit /b
)

echo Menambahkan aturan Firewall untuk Port 3030 TCP...
netsh advfirewall firewall delete rule name="VibeGenesis Studio Port 3030" >nul 2>&1
netsh advfirewall firewall add rule name="VibeGenesis Studio Port 3030" dir=in action=allow protocol=TCP localport=3030 profile=any >nul

if %errorlevel% equ 0 (
    echo.
    echo [SUKSES] Port 3030 berhasil dibuka pada Windows Firewall!
    echo Sekarang HP dan perangkat lain dapat mengakses aplikasi tanpa hambatan.
) else (
    echo.
    echo [GAGAL] Gagal menambahkan aturan firewall. Pastikan Anda adalah Administrator.
)

echo.
pause

