# ![](img/icon.webp) Mod The Coaster
*Groove Coaster modding utilities.*
[modding guide](https://github.com/lemocha7/Mod-The-Coaster/wiki) · [song list spreadsheet](https://docs.google.com/spreadsheets/d/1Ia1Pj9P0OHSlMKTNB8HuUs1qk7ODr7MGuCyzzunbAZk)


# Tools (STEAM)
## AAR Zip
Packs `.aar` archives. ST stores most of its files (including charts) in `.aar` files.

|List                                    |Unpacked                                  |
|----------------------------------------|------------------------------------------|
|![ST Install](guide-img/st-install.webp)|![AAR unpacked](guide-img/aar-unpack.webp)|


## ASN Snip
Converts `.asn` audio to `.ogg` by trimming header. ST stores its audio in `.asn` files, which are just `.ogg` audio files with a 32 byte header. **ST will accept standard `.ogg` the same as `.asn`.**

![ASN Header](guide-img/asn-header.webp)


## Table Tune [NEW!]
Re-assign difficulties of existing songs in `TableTune.aar`. **NOTE: only works on uncompressed TableTune files.**
- uncompressed file should be 392 KB instead of 112 KB, and in a hex editor, the first 4 bytes should say "ALAR" instead of "ALLZ"
- use [Aqualead LZSS Decoder](https://github.com/Brolijah/Aqualead_LZSS) to decrypt


# Tools (SWITCH)
## Jacket Convert
Converts AC jackets to SW jackets. SW uses a different jacket layout than other versions, and jackets will look stretched unless converted.

|Before                              |After                               |
|------------------------------------|------------------------------------|
|![Before](guide-img/sw-jc2-pre.webp)|![After](guide-img/sw-jc2-post.webp)|



# Running Locally
Most things should work while running locally.

However, these functions will not work unless hosted on a local webserver.
- **Jacket Converter tab**
- **Mute SHOT option in AAR Zip**

## Dependencies
[JSZip](https://stuk.github.io/jszip) v3.10.1
[simFile](https://lemocha7.github.io/lib/simFile/2024.2.19.js) v2024.2.19
[tabs](https://lemocha7.github.io/lib/tabs/2024.11.15.js) v2024.11.15


##

Mod The Coaster ♡ [lemocha](https://lemocha7.github.io) 2024