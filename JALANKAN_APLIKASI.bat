@echo off
chcp 65001 >nul
title VibeGenesis - Studio Desain Reel & Poster Sosmed

echo.
echo ======================================================================
echo    VIBEGENESIS - STUDIO DESAIN REEL & POSTER SOSMED
echo    FYJ CHANNEL - OFFICIAL CREATIVE STUDIO
echo ======================================================================
echo.

:: 1. Periksa ketersediaan Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terpasang di komputer ini!
    echo Silakan unduh dan instal Node.js versi LTS terlebih dahulu dari:
    echo -> https://nodejs.org
    echo.
    pause
    exit /b
)

:: 2. Periksa apakah dependensi (node_modules) sudah terinstal
if not exist "node_modules" (
    echo [INFO] Menyiapkan paket dependensi untuk pertama kali...
    echo Mohon tunggu sebentar, sedang menjalankan 'npm install'...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Gagal menginstal dependensi. Periksa koneksi internet Anda.
        pause
        exit /b
    )
)

:: 3. Ambil alamat IP lokal komputer ini di jaringan Wi-Fi / LAN
set LOCAL_IP=
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike '*Loopback*' -and $_.InterfaceAlias -notlike '*vEthernet*' -and $_.IPAddress -notlike '169.254*' -and $_.IPAddress -notlike '192.168.56.*' } | Select-Object -First 1).IPAddress"`) do (
    set LOCAL_IP=%%i
)

if "%LOCAL_IP%"=="" (
    set LOCAL_IP=10.10.10.159
)

echo.
echo ======================================================================
echo    STATUS SERVER: AKTIF & SIAP DIGUNAKAN
echo ======================================================================
echo.
echo  [1] Akses di Komputer Ini (Lokal):
echo      -> http://localhost:3030
echo.
echo  [2] Akses di Perangkat Lain (HP, Tablet, Laptop):
echo      -> http://%LOCAL_IP%:3030
echo.
echo ----------------------------------------------------------------------
echo  PETUNJUK AKSES DARI HP / PERANGKAT LAIN:
echo  1. Hubungkan HP / Tablet Anda ke jaringan Wi-Fi yang SAMA
echo     dengan komputer ini.
echo  2. Buka browser di HP (Google Chrome, Safari, dll.).
echo  3. Ketik alamat: http://%LOCAL_IP%:3030
echo     (Atau di komputer, klik tombol 'Buka di HP' pada navbar
echo      lalu scan QR Code menggunakan kamera HP).
echo.
echo  TIPS: Jika di HP halaman tidak mau memuat (loading terus):
echo  - Jalankan file 'IZINKAN_FIREWALL_PORT_3030.bat' (Run as Administrator)
echo    agar Windows Firewall tidak memblokir akses dari HP.
echo ======================================================================
echo.
echo Membuka peramban di komputer Anda...

:: Buka browser secara otomatis setelah 2 detik
start "" "http://localhost:3030"

echo Menjalankan Next.js Web Server di port 3030 (0.0.0.0:3030)...
echo Tekan tombol Ctrl + C jika ingin menghentikan server.
echo.

call npm run dev

