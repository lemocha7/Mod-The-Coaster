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
