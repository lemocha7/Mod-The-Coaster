"use strict";

const asn =
{
	// parameters (including file data) to be entered in simFile.download()
	file: [undefined, undefined, undefined],

	// take AAR file and trim the first 32 bytes
	//	files [fileList]:					files to be trimmed
	loadFile: async function(files)
	{
		const zip = new JSZip();
		asnFileList.value = "";

		// for each file...
		const l = files.length;
		for (let i = 0; i < l; i++)
		{
			// obtain file HEX
			const viewer = new Uint8Array(await simFile.read(files[i], "readAsArrayBuffer"));

			// get first 4 bytes of file
			const magic = viewer.slice(0, 4).join(" ");

			// if magic header is "ALSN" in HEX
			if (magic === "65 76 83 78")
			{
				// if only parsing 1 file
				if (l === 1)
				{
					// trim first 32 bytes of file, then download it
					this.file = [viewer.slice(32), simFile.fileName + ".ogg", "application/octet-stream"];
				}
				else
				{
					// trim first 32 bytes of file, then zip it
					zip.file(simFile.fileName + ".ogg", new Blob([viewer.slice(32)], {type: "application/octet-stream"}));
				}


				// add file name to <textarea>
				asnFileList.value += files[i].name;
				if (i !== l - 1) { asnFileList.value += "\n"; }


				if (i === 0)
				{
					// hex display
					asnTxtIn.value = ""; asnHexIn.value = "";
					asnTxtOut.value = ""; asnHexOut.value = "";

					const hexRun = (offset, txt, hex) =>
					{
						if (16 > viewer[offset])
						{
							hex.value += "0";
						}

						// DECIMAL -> ASCII
						txt.value += String.fromCharCode(viewer[offset]);
						txt.value += " ";

						// DECIMAL -> HEX
						hex.value += viewer[offset].toString(16).toUpperCase();
						hex.value += " ";

						if (offset === 15 || offset === 31)
						{
							txt.value += "\n";
							hex.value += "\n";
						}
					};
					for (let i = 0; i < 48; i++)
					{
						hexRun(i, asnTxtIn, asnHexIn);
					}
					for (let i = 32; i < 80; i++)
					{
						hexRun(i, asnTxtOut, asnHexOut);
					}
				}
			}
			// OggS
			//else if (magic === "79 103 103 83")
			//{

			//}
			else if (l === 1)
			{
				alert("Hmm... The file you entered doesn't seem to be an ASN file. Try another file or check the magic header.");
			}
		}
		
		if (l !== 1)
		{
			this.file = [await zip.generateAsync({ type:"blob" }), "asnSnip.zip", "application/zip"];
		}
		simFile.download(...this.file);
	}
};



// lemocha - lemocha7.github.io