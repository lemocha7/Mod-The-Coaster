# v1.1 - TableTune tab + AAR Difficulty Shifting + Song Spreadsheet + Modding Guide
This release adds a **Table Tune** tab, **difficulty shifting** (and other changes) to AAR Zip, a link to my new [song list spreadsheet](https://docs.google.com/spreadsheets/d/1Ia1Pj9P0OHSlMKTNB8HuUs1qk7ODr7MGuCyzzunbAZk), and a link to my (work in progress) [modding guide](https://github.com/lemocha7/Mod-The-Coaster/wiki).

**TableTune [NEW!]**
- re-assign difficulties of existing songs in `TableTune.aar`.
- **NOTE: only works on uncompressed TableTune files.**
	+ uncompressed file should be 392 KB instead of 112 KB, and in a hex editor, the first 4 bytes should say "ALAR" instead of "ALLZ"
	+ use [Aqualead LZSS Decoder](https://github.com/Brolijah/Aqualead_LZSS) to decrypt

**AAR Zip**
- **option to move higher difficulties to lower ones (e.g. EASY chart becomes HARD chart)**
- **fixed bug where uploaded too few files would skip some with higher IDs**
- **will now detect SW chart files and lowercase BGM / SHOT files**
- option to download a blank shot file if none is found (I cannot automatically plug-in a blank shot in this case without a major code rewrite)
- EMPTY.ogg is now smaller (3.47 KB --> 2.59 KB)

- will now support 5 SHOT files at once instead of 4 (to my knowledge only `HATSUNE MIKU no BOUSOU` has this, which crashes on ST)
- will now block out other settings when setting AAR Type to `Bgm`
- added line breaks to settings help text
- some internal code changes for a secret project 🤫

**General**
- **settings are now saved in local storage and will re-apply on startup**
- removed hex / text preview from AAR Zip / ASN Snip
- file imported text area in AAR and ASN will now auto-resize to fit all lines
- Steam tabs now display before Switch tabs
- moved tab / file area functions to my tabs library
- added a running locally and dependency section to README
- my [Groove Coaster Song List spreadsheet](https://docs.google.com/spreadsheets/d/1Ia1Pj9P0OHSlMKTNB8HuUs1qk7ODr7MGuCyzzunbAZk) is now done and available to view.
- i'm releasing my modding guide, though it is currently unfinished. You can read it on GitHub under [Mod-The-Coaster/wiki](https://github.com/lemocha7/Mod-The-Coaster/wiki)


# v1.0.1 - AAR Zip Bugfixes
**AAR Zip**
- apparently AAR Type BGM just didn't work. Like, at all.
	+ will now actually read imported BGM files
	+ file ID is set to `60 48` instead of `50 48`
	+ fix error on files under 48 bytes long
	+ Exported file will be named `Bgm.aar` when selecting AAR Type BGM
- fixed EXTRA charts crashing
- added option to mute inputted SHOT audio files
- added option that changes song ID safeguards to better match DLC songs

**General**
- will save last opened tab in "mtc/last-tab" and go to it on page load