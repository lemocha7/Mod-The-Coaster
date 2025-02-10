"use strict";

// FUNCTION MOVED HERE FOR GRUCO MANAGER COMPATIBILITY
// convert DECIMAL to HEX, flip order of byte chunks (e.g. 12 34 56 ==> 56 34 12)
//	input [int]:			decimal to convert
//	l [int]:					how many bytes HEX should be
//	hex [arr]:				array to push to
function hexReverseChunk(input, l, hex)
{
	// offset in aar has the order of bytes backwards
	// convert offset to HEX and reverse the string
	// e.g. 12 34 56 ==> 65 43 21
	let str = input.toString(16).split("").reverse().join("");

	// make string always L bytes long
	if (str.length !== l)
	{
		str += "0".repeat(l - str.length);
	}

	// swap bytes with the one next to it, convert HEX back to DECIMAL
	// e.g. 65 43 21 ==> 56 34 12
	for (let i = 0; i < l; i += 2)
	{
		hex.push(parseInt(str[i + 1] + str[i], 16));
	}
}


const aarZip =
{
	// parameters (including file data) to be entered in simFile.download()
	file: [undefined, undefined, undefined],

	// order that SHOT audio is stored
	shotOrder: ["e", "ne", "n", "h", "hn", "xh", "nx", "shot", "x"],


	// order that files are laid out in AAR. FILE ORDER IS IMPORTANT!!!
	stageOrder:[["easy.dat", 0, "easy_1.dat"],
	            ["BGM.asn", 0, "BGM.ogg"],
							["easy_clip.dat", 1, "easy_1_clip.dat"],
							[undefined, 1],  // reserved for SHOT
							["easy_ext.dat", 2, "easy_1_ext.dat"],
							[undefined, 2],  // reserved for SHOT
							[undefined, 3],  // reserved for SHOT
							["normal.dat", 4, "normal_1.dat"],
							[undefined, 4],  // reserved for SHOT
							["normal_clip.dat", 5, "normal_1_clip.dat"],
							[undefined, 5],  // reserved for SHOT
							["normal_ext.dat", 6, "normal_1_ext.dat"],
							["hard.dat", 8, "hard_1.dat"],
							["hard_clip.dat", 9, "hard_1_clip.dat"],
							["hard_ext.dat", 0xA, "hard_1_ext.dat"],
							["ex.dat", 0xC, "mas_1.dat"],
							["ex_clip.dat", 0xD, "mas_1_clip.dat"],
							["ex_ext.dat", 0xE, "mas_1_ext.dat"],

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

	extra: false,  // were EX difficulty files specified?
	stageOrderShot: [3,5,6,8,10],  // which stage type slots are reserved for shots
	diffSlots: [[0,2,4],[7,9,11],[12,13,14],[15,16,17]],  // which stage types shots are used by difficulties


	// takes multiple files and packs them in 1 AAR file
	//	files [fileList]:					files to be put in AAR
	//	gcman [bool]:							toggles off textarea and file downloading. set to true while using GRUCO MANAGER
	//	gcmanNames [arr]:					array containing file names. replaces files[i].name
	loadFile: async function(files, gcman, gcmanNames)
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
		const fileNames = [];
		const shotList = [];

		if (type === "Stage")
		{
			this.extra = false;

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

					aarID.value = 0;
					return;
				}
			}

			// set which files to read in which order
			// ORDER IS VERY IMPORTANT IN AAR!!!
			for (let i = 0; i < filesAmount; i++)
			{
				let success = false;
				let fileNameBack;
				if (gcman)
				{
					fileNameBack = gcmanNames[i];
				}
				else
				{
					fileNameBack = files[i].name;
				}

				for (let x = 0; x < 27; x++)
				{
					// check if file name matches
					if (fileNameBack.endsWith(this.stageOrder[x][0]))
					{
						success = true;
					}
					// else, if alt name specified matches
					else if (this.stageOrder[x][2] !== undefined && fileNameBack.endsWith(this.stageOrder[x][2]))
					{
						success = true;

						// if not BGM or SHOT
						if (x !== 1 && x < 18)
						{
							// convert SW name to ST
							fileNames[i] = fileNameBack.replace("_1", "").replace("_2", "").replace("mas", "ex");
						}
					}

					// check if BGM or SHOT is lowercase
					else if ((x === 1 || x > 18) && fileNameBack.endsWith(this.stageOrder[x][2].toLowerCase()))
					{
						success = true;
					}

					if (success)
					{
						// if file is NOT SHOT audio
						if (this.stageOrder[x][1] > -1)
						{
							if (aarDiffShift.value !== "0")
							{
								switch (x)
								{
									// EASY
									case 0: case 2: case 4:
										switch (aarDiffShift.value)
										{
											// NORMAL	--> EASY
											// HARD		--> EASY
											// EXTRA	--> EASY
											case "1": case "2": case "3":
												success = false;
												break;
										}
										break;

									// NORMAL
									case 7: case 9: case 11:
										switch (aarDiffShift.value)
										{
											// NORMAL	--> EASY
											case "1":
												x = this.diffSlots[0][(x - 7) / 2];
												break;

											// HARD		--> NORMAL
											// EXTRA	--> NORMAL
											case "2": case "3":
												success = false;
												break;
										}
										break;

									// HARD
									case 12: case 13: case 14:
										if (aarDiffShift.value === "3")
										{
											success = false;
										}
										else
										{
											x = this.diffSlots[2 - Number(aarDiffShift.value)][x - 12];
										}
										break;

									// EXTRA
									case 15: case 16: case 17:
										x = this.diffSlots[3 - aarDiffShift.value][x - 15];
										break;
								}
							}

							if (success)
							{
								fileReadOrder[x] = i;
								fileType[x] = this.stageOrder[x][1];
							}
						}


						if (success)
						{
							if (fileNames[i] === undefined) { fileNames[i] = fileNameBack; }

							switch (x)
							{
								case 1:  // BGM
									if (aarID.value === fileNames[i].slice(6, 9))
									{
										if (!aarDLC.checked)
										{
											if (!confirm("Hey! The song ID should be set to the song you're replacing in the base game, NOT the song you're adding (so, not " + fileNames[i].slice(6, 9) + ").\n\nContinue anyways?"))
											{
												return;
											}
										}
									}
									else
									{
										if (aarDLC.checked)
										{
											if (confirm("Hey! Since the song is a DLC song, the song ID should match the song.\n\nShall I set it to " + fileNames[i].slice(6, 9) + "?"))
											{
												aarID.value = fileNames[i].slice(6, 9);
											}
										}
									}
									break;

								// ex.dat
								case 15: this.extra = true; break;

								case 18: shotList.push(["e",   i]); break;
								case 19: shotList.push(["ne",  i]); break;
								case 20: shotList.push(["n",   i]); break;
								case 21: shotList.push(["h",   i]); break;
								case 22: shotList.push(["hn",  i]); break;
								case 23: shotList.push(["xh",  i]); break;
								case 24: shotList.push(["nx",  i]); break;
								case 25: shotList.push(["x",   i]); break;
								case 26: shotList.push(["shot",i]); break;
							}

							// break from loop
							break;
						}
					}
				}

				// if file does not belong in AAR...
				if (!success)
				{
					// lower file count in HEX
					hex[6]--;
				}
			}

			
			// throw error if song ID isn't tied to any valid ST ID.
			if (!STList.includes(Number(aarID.value)))
			{
				if (!confirm("Hmm... The song ID doesn't seem to be tied to any song in ST.\n\nContinue anyways?"))
				{
					return;
				}
			}
			
			// throw error if difficulty shift was set to extra when there is no extra
			if (!this.extra && aarDiffShift.value === "3")
			{
				alert("ERROR: Difficulty Shift was set to EXTRA even though no EXTRA chart files were provided. EXITING!");
				return;
			}

			// throw error if no BGM or SHOT audio files were provided.
			if (fileReadOrder[1] === undefined)
			{
				alert('Hey! You didn\'t specify a BGM file!\nIf it didn\'t get detected, make sure the file name follows this format:\n"bgm_b-###_name_BGM"');
				return;
			}
			if (shotList[0] === undefined)
			{
				if (confirm("Hey! You didn\'t specify any SHOT files!\nWould you like to download an empty one?"))
				{
					simFile.download(await fetch("EMPTY.ogg").then(x => x.blob()), files[fileReadOrder[1]].name.slice(0, -7) + "SHOT.ogg", "audio/ogg")
				}
				
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
				fileNames.push(files[i].name);
			}
		}


		// 90 0C 50 00 9A 0C 50
		// ID is included twice (9X 0C 50)
		// second instance has X as largest file type ID used in file
		// - Stage00201 uses X all the way to A, so second X is A
		// - Bpm.aar doesn't use X beyond 0, so both Xs are 0

		hex.push(0x00);

		if (!gcman)
		{
			aarFileList.value = "";
		}
		aarFileList.cols = 30;


		// generate header
		let headerOffset = 0;
		const l = fileReadOrder.length;

		for (let i = 0; i < l; i++)
		{
			// if file does not belong in AAR...
			if (fileReadOrder[i] === undefined)
			{
					fileViewer.push(undefined);
			}
			// else, if file belongs in AAR...
			else
			{
				// convert file to viewer, then store viewer to array
				if (!gcman)
				{
					fileViewer.push(new Uint8Array(await simFile.read(files[fileReadOrder[i]], "readAsArrayBuffer")));
				}
				else
				{
					fileViewer.push(new Uint8Array(files[fileReadOrder[i]]));

					simFile.fileName = gcmanNames[fileReadOrder[i]].split(".")[0];
					simFile.fileExtension = gcmanNames[fileReadOrder[i]].split(".")[1];
				}


				// if file is SHOT audio, replace to muted file if option is checked
				if (aarMuteSHOT.checked && simFile.fileName.endsWith("_SHOT"))
				{
					fileViewer[i] = await fetch("EMPTY.ogg").then(x => x.arrayBuffer()).then(x => new Uint8Array(x));
				}


				// copy ID from header
				// byte 1 of ID
				// e.g. ID is 90 0C 50, type is 3, so first byte becomes 93
				hex.push(headerID[0] + fileType[i], headerID[1]);
				hex.push((type === "Stage") ? 0x50 : 0x60);

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
				if (!gcman)
				{
					aarFileList.value += fileNames[fileReadOrder[i]];
					aarFileList.value += "\n";

					// if file name is too long, increase width to fit it
					if (fileNames[fileReadOrder[i]].length > aarFileList.cols)
					{
						aarFileList.cols = fileNames[fileReadOrder[i]].length;
					}
				}

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
		for (let i = 0; i < l; i++)
		{
			//console.log(i, fileReadOrder[i]);
			if (fileReadOrder[i] !== undefined)
			{
				hex.push(0x00, 0x00);

				// if file name is over 32 characters
				if (fileNames[fileReadOrder[i]].length > 32)
				{
					// trim extra characters, even if that removes file extension
					// yes this is how the official charts do this (nightofbutaotome)
					fileNames[fileReadOrder[i]] = fileNames[fileReadOrder[i]].slice(0,32);
				}

				// FILE NAME HEADER
				let arr = fileNames[fileReadOrder[i]].split("");
				arr.forEach((currentValue, index) => arr[index] = currentValue.charCodeAt(0));
				hex.push(...arr);

				// file name always takes up 32 bytes
				// fill with 0 if missing length
				arr = new Array(32 - fileNames[fileReadOrder[i]].length);
				arr.fill(0);
				hex.push(...arr);
				hex.push(0x00,0x00);

				// copy data from file and add it to AAR
				fileViewer[i].forEach(currentValue => hex.push(currentValue));
			}
		}


		// generate file name and download file
		this.file = [new Uint8Array(hex), undefined, "application/octet-stream"];
		if (type === "Stage")
		{
			this.file[1] = "Stage00" + "0".repeat(3 - aarID.value.length) + aarID.value + ".aar";
		}
		else
		{
			this.file[1] = "Bgm.aar";
		}


		if (!gcman)
		{
			aarFileList.rows = hex[6];
			simFile.download(...this.file);
		}
	}
};



// lemocha - lemocha7.github.io