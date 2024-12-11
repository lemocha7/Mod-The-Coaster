@echo off
pushd %~dp0
mkdir "../Data-extract"

for /r %%d in (.) do (
	pushd %%d
	mkdir "../../Data-extract/%%~nd"
	for %%f in (*.*) do "../Aqualead_LZSS.exe" "%%f" "../../Data-extract/%%~nd/%%f"
)
echo Decompression is done. Enjoy your files!
pause
:: lemocha