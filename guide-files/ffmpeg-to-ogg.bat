@echo off
pushd %~dp0

for /r %%d in (.) do (
	pushd %%d
	for %%f in (*.wav) do "C:\Program Files (x86)\FFmpeg for Audacity\ffmpeg.exe" -i "%%f" -c:a libvorbis "%%~nf.ogg"
)
echo Hey! The files are done converting!
pause
:: lemocha~