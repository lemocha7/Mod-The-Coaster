"use strict";

const aarZip =
{
	// parameters (including file data) to be entered in simFile.download()
	file: [undefined, undefined, undefined],

	// order that SHOT audio is stored
	shotOrder: ["e", "ne", "n", "h", "hn", "xh", "nx", "shot", "x"],

	// were EX difficulty files specified?
	extra: false,

	// order that files are layed out in AAR. FILE ORDER IS IMPORTANT!!!
	stageOrder:[["easy.dat", 0],
	            ["BGM.asn", 0, "BGM.ogg"],
							["easy_clip.dat", 1],
							[undefined, 1],  // reserved for SHOT
							["easy_ext.dat", 2],
							[undefined, 2],  // reserved for SHOT
							[undefined, 3],  // reserved for SHOT
							["normal.dat", 4],
							[undefined, 4],  // reserved for SHOT
							["normal_clip.dat", 5],["normal_ext.dat", 6],
							["hard.dat", 8],["hard_clip.dat", 9],["hard_ext.dat", 0xA],
							["ex.dat", 0xC],["ex_clip.dat", 0xD],["ex_ext.dat", 0xE],

							// SHOTs (order handled in code)
							[ "_e_SHOT.asn", -1,  "_e_SHOT.ogg"],
	            ["_ne_SHOT.asn", -2, "_ne_SHOT.ogg"],
	            [ "_n_SHOT.asn", -3,  "_n_SHOT.ogg"],
							[ "_h_SHOT.asn", -4,  "_h_SHOT.ogg"],
							// priorities unknown
							["_hn_SHOT.asn", -5, "_hn_SHOT.ogg"],  // used by 17 songs (in 4MAX)
							["_xh_SHOT.asn", -5, "_xh_SHOT.ogg"],  // used only by cinder & bb2-hz
							["_nx_SHOT.asn", -5, "_nx_SHOT.ogg"],  // used only by uraomote2

							[ "_x_SHOT.asn", -7,  "_x_SHOT.ogg"],
	            [    "SHOT.asn", -6,     "SHOT.ogg"]],

	// which stage type slots are reserved for shots
	stageOrderShot: [3,5,6,8],

	// takes multiple files and packs them in 1 AAR file
	//	files [fileList]:					files to be put in AAR
	loadFile: async function(files)
	{
		const filesAmount = files.length;  // does NOT include files to be skipped
		const fileViewer = [];
		let fileType = [];

		// 41 4C 41 52 02 61 0B 00
		// 41 4C 41 52 = "ALAR" magic header
		//       02 61 = version[?]
		//          0B = amount of files stored (e.g. 11)
		//          00 = SPACING
		const hex = [0x41,0x4C,0x41,0x52,0x02,0x61,filesAmount,0x00];

		const type = aarType.value;
		let headerID;
		const fileReadOrder = [];

		if (type === "Stage")
		{
			this.extra = false;
			const shotList = [];

			// cap ID at 999
			if (Number(aarID.value) > 999)
			{
				aarID.value = 999;
			}
			// if ID is undefined, 0, or negative
			if (Number(aarID.value) < 1)
			{
				if (!aarDLC.checked)
				{
					alert("Hey! Song ID is invalid. Set the ID to the song you're replacing in the base game.");

					aarID.value = "";
					return;
				}
			}
			// if song ID not between 21 and 764 (min / max used by ST and its DLC)
			else if (Number(aarID.value) < 20 || Number(aarID.value) > 764)
			{
				if (!confirm("Just letting you know, the song ID you entered (" + Number(aarID.value) + ") is out of range. ST only uses 21 - 764. Remember! The song ID should be set to the song you're replacing in the base game, NOT the song you're adding.\n\nContinue anyways?"))
				{
					return;
				}
			}

			// set which files to read in which order
			// ORDER IS VERY IMPORTANT IN AAR!!!
			for (let i = 0; i < filesAmount; i++)
			{
				let success = false;
				for (let x = 0; x < 26; x++)
				{
					if (files[i].name.endsWith(this.stageOrder[x][0]))
					{
						success = true;
					}
					else if (this.stageOrder[x][2] !== undefined && files[i].name.endsWith(this.stageOrder[x][2]))
					{
						success = true;
					}

					if (success)
					{
						// if file is NOT SHOT audio
						if (this.stageOrder[x][1] > -1)
						{
							fileReadOrder[x] = i;
							fileType[x] = this.stageOrder[x][1];
						}

						switch (x)
						{
							case 1:  // BGM
								if (aarID.value === files[i].name.slice(6, 9))
								{
									if (!aarDLC.checked)
									{
										if (!confirm("Hey! The song ID should be set to the song you're replacing in the base game, NOT the song you're adding (so, not " + files[i].name.slice(6, 9) + ").\n\nContinue anyways?"))
										{
											return;
										}
									}
								}
								else
								{
									if (aarDLC.checked)
									{
										if (confirm("Hey! Since the song is a DLC song, the song ID should match the song.\n\nShall I set it to " + files[i].name.slice(6, 9) + "?"))
										{
											aarID.value = files[i].name.slice(6, 9);
										}
									}
								}
								break;
								
							// ex.dat
							case 14: this.extra = true; break;
							
							case 17: shotList.push(["e",   i]); break;
							case 18: shotList.push(["ne",  i]); break;
							case 19: shotList.push(["n",   i]); break;
							case 20: shotList.push(["h",   i]); break;
							case 21: shotList.push(["hn",  i]); break;
							case 22: shotList.push(["xh",  i]); break;
							case 23: shotList.push(["nx",  i]); break;
							case 24: shotList.push(["x",   i]); break;
							case 25: shotList.push(["shot",i]); break;
						}
						break;
					}
				}

				// if file does not belong in AAR...
				if (!success)
				{
					// lower file count in HEX
					hex[6]--;
				}
			}

			// throw errors if no BGM or SHOTs were provided.
			if (fileReadOrder[1] === undefined)
			{
				alert('Hey! You didn\'t specify a BGM file!\nIf it didn\'t get detected, make sure the file name follows this format:\n"bgm_b-###_name_BGM"');
				return;
			}
			if (shotList[0] === undefined)
			{
				alert('Hey! You didn\'t specify any SHOT files!\nIf it didn\'t get detected, make sure the file name follows this format:\n"bgm_b-###_name_SHOT" or "bgm_b-###_name_#_SHOT"');
				return;
			}



			// ==================
			// === SHOT AUDIO ===
			// ==================

			// SHOT files do not follow set IDs like chart DATs
			// it will increment from 1 until all shot files are included
			// x_SHOT will always be after SHOT

			// EXAMPLE: Miracle Party (uses e, ne, and n SHOTs)
			// 1: e_SHOT
			// 2: ne_SHOT
			// 3: n_SHOT
			// 4: SHOT

			// go through every shot type until one matches, following pre-defined order
			// for each shot type...
			let shotCount = 0;
			const l = shotList.length;
			for (let x = 0; x < 9; x++)
			{
				// go through each shot file and find one that matches type
				for (let i = 0; i < l; i++)
				{
					// if shot type matches one from list
					if (shotList[i][0] === this.shotOrder[x])
					{
						// change reserved SHOT slot to point to file
						fileReadOrder[this.stageOrderShot[shotCount]] = shotList[i][1];
						fileType[this.stageOrderShot[shotCount]] = shotCount + 1;

						shotCount++;
						break;
					}
				}
			}

			
			const hexID = Number(aarID.value).toString(16);
			headerID = [parseInt(hexID[hexID.length - 1], 16) * 16, parseInt(hexID.slice(0, hexID.length - 1), 16)];

			hex.push(headerID[0], headerID[1],
				       0x50,0x00,
				       headerID[0] + ((this.extra) ? 14 : 10), headerID[1],
				       0x50);
		}
		else
		{
			headerID = [0, 0];

			fileType = [0,1,2,3,4,5,6];
			hex.push(0x00,0x00,0x60,0x00,0x06,0x00,0x60);
			
			for (let i = 0; i < filesAmount; i++)
			{
				fileReadOrder.push(i);
			}
		}


		// 90 0C 50 00 9A 0C 50
		// ID is included twice (9X 0C 50)
		// second instance has X as largest file type ID used in file
		// - Stage00201 uses X all the way to A, so second X is A
		// - Bpm.aar doesn't use X beyond 0, so both Xs are 0

		hex.push(0x00);

		aarFileList.value = "";

		// generate header
		let headerOffset = 0;
		const l = fileReadOrder.length;
		for (let i = 0; i < l; i++)
		{
			// if file does not belong in AAR...
			if (fileReadOrder[i] === undefined)
			{
				// create dummy file hex (will always be skipped)
				fileViewer.push(undefined);
			}
			// else, if file belongs in AAR...
			else
			{
				// convert file to viewer, then store viewer to array
				fileViewer.push(new Uint8Array(await simFile.read(files[fileReadOrder[i]], "readAsArrayBuffer")));

				// if file is SHOT audio, replace to muted file if option is checked
				if (aarMuteSHOT.checked && simFile.fileName.endsWith("_SHOT"))
				{
					fileViewer[i] = await fetch("EMPTY.ogg").then(x => x.arrayBuffer()).then(x => new Uint8Array(x));
				}


				// copy ID from header
				// byte 1 of ID
				// e.g. ID is 90 0C 50, type is 3, so first byte becomes 93
				hex.push(headerID[0] + fileType[i], headerID[1]);

				if (type === "Stage")
				{
					hex.push(0x50);
				}
				else
				{
					hex.push(0x60);
				}

				switch (simFile.fileExtension)
				{
					// chart files use 0x00
					case "dat":
						hex.push(0x00);
						break;
					// audio files use 0x48
					case "asn": case "ogg": case "oga":
						hex.push(0x48);
						break;
				}

				// add file name to <textarea>
				aarFileList.value += files[fileReadOrder[i]].name;
				if (i !== filesAmount - 1) { aarFileList.value += "\n"; }

				// get offset
				if (headerOffset === 0)
				{
					// starting offset is determined by length of header
					// each file takes up 16 bytes, and rest of header takes up 52 bytes
					headerOffset = hex[6] * 16 + 52;
				}
				// technically this can fail if file is too long,
				// but the limit is like 4 GB so we're fine
				hexReverseChunk(headerOffset, 8, hex);
				
				// increment offset by file length, +36 for length of file name header
				headerOffset += fileViewer[i].length + 36;
				hexReverseChunk(fileViewer[i].length, 8, hex);

				hex.push(0x01,0x00,0x00,0x80);
			}
		}
		
		// for each file...
		for (let i = 0; i < filesAmount; i++)
		{
			if (fileReadOrder[i] !== undefined)
			{
				hex.push(0x00, 0x00);

				// FILE NAME HEADER
				let arr = files[fileReadOrder[i]].name.split("");
				arr.forEach((currentValue, index) => arr[index] = currentValue.charCodeAt(0));
				hex.push(...arr);

				if (files[fileReadOrder[i]].name.length > 32)
				{
					alert('Hey! "' + files[fileReadOrder[i]].name + '" is too long of a file name! It has to be 32 characters or under.');
					return;
				}

				// file name always takes up 32 bytes
				// fill with 0 if missing length
				arr = new Array(32 - files[fileReadOrder[i]].name.length);
				arr.fill(0);
				hex.push(...arr);
				hex.push(0x00,0x00);

				// copy data from file and add it to AAR
				fileViewer[i].forEach(currentValue => hex.push(currentValue));
			}
		}



		// HEX PREVIEW
		aarHex.value = "";
		aarTxt.value = "";
		const viewer = new Uint8Array(hex);
		if (viewer.length > 48)
		{
			for (let i = 0; i < 48; i++)
			{
				if (16 > viewer[i])
				{
					aarHex.value += "0";
				}
		
				// DECIMAL -> ASCII
				aarTxt.value += String.fromCharCode(viewer[i]);
				aarTxt.value += " ";
		
				// DECIMAL -> HEX
				aarHex.value += viewer[i].toString(16).toUpperCase();
				aarHex.value += " ";
		
				if (i === 15 || i === 31)
				{
					aarTxt.value += "\n";
					aarHex.value += "\n";
				}
			}
		}
		

		// generate file name and download file
		this.file = [viewer, undefined, "application/octet-stream"];
		if (type === "Stage")
		{
			this.file[1] = "Stage00" + "0".repeat(3 - aarID.value.length) + aarID.value + ".aar";
		}
		else
		{
			this.file[1] = "Bgm.aar";
		}
		simFile.download(...this.file);
	}
};



// lemocha - lemocha7.github.io