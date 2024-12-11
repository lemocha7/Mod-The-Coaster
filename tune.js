"use strict";
const tune =
{
	viewer: undefined,
	hex: [],
	hexStr: "",

	index: undefined,
	findID: undefined,

	saved: true,  // did user download data after modifying it?
	

	// copy file hex and convert it to string
	//	file [fileList]:			file that 
	loadFile: async function(file)
	{
		// create and save hex viewer
		this.viewer = new Uint8Array(await simFile.read(file[0], "readAsArrayBuffer"));

		// check magic bytes at start of file
		let success = false;
		if (file[0].name.includes("TableTune") && this.viewer[0] === 65 && this.viewer[1] === 76)
		{
			// if magic bytes spell "ALAR"
			if (this.viewer[2] === 65 && this.viewer[3] === 82)
			{
				// hooray! it passed the check!
				success = true;
			}
			//else, if magic bytes spell "ALLZ"
			else if (this.viewer[2] === 76 && this.viewer[3] === 90)
			{
				alert("Hey, so... It appears like the TableTune file is currently compressed with ALLZ. Run \"Aqualead_LZSS\" on the file and input it again.");
			}
			else { alert("Hey! This file doesn't seem to be \"TableTune.aar\" like I asked for!"); }
		}
		else { alert("Hey! This file doesn't seem to be \"TableTune.aar\" like I asked for!"); }


		if (!success)
		{
			this.viewer = undefined;
			this.hex = [];
			this.hexStr = "";

			tuneState.checked = false;
			tuneHide.classList.add("active");
			return;
		}

		// for each byte in hex, check if they are 2 characters long and add a zero if not
		this.hex = [];
		this.viewer.forEach(currentValue =>
		{
			const str = currentValue.toString(16);
			if (str.length === 1)
			{
				this.hex.push("0" + str);
			}
			else
			{
				this.hex.push(str);
			}
		});
		this.hexStr = this.hex.join(" ");

		// set file as saved
		tuneState.checked = true;
		tuneHide.classList.remove("active");
	},


	// find song ID in hex and set its offset to this.index
	//	diffSet [bool]:				should the value of <input> elements be changed?
	find: function(diffSet)
	{
		if (this.findID !== tuneID.value)
		{
			//let hex;
			let index2 = 0;
			let str;

			// if the song ID was converted to hex, would it be 2 bytes long?
			if (tuneID.value > 255)
			{
				// take the first digit in hex and place it after the other 2
				// E.g. if ID is 291, it would be 123 in hex
				// 23 01 00 00

				const hex = Number(tuneID.value).toString(16);
				str = hex.slice(1) + " 0" + hex.charAt(0) + " 00 00";
			}
			else
			{
				// just add 3 empty bytes after
				str = Number(tuneID.value).toString(16) + " 00 00 00";
			}

			// loop until this.index is out of bounds
			this.index = 0;
			while (this.index !== -1)
			{
				// find song ID string in hex
				this.index = this.hexStr.indexOf(str, index2);

				// if it could find a match...
				if (this.index !== -1)
				{
					this.index = this.index / 3;

					// for each of the 4 difficulties...
					let success = true;
					for (let i = 0; i < 16; i += 4)
					{
						// if number is between 0 and 15 and is followed by 3 empty bytes
						if (this.viewer[this.index + 32 + i] > -1  &&
								this.viewer[this.index + 32 + i] < 16  &&
								this.viewer[this.index + 33 + i] === 0 &&
								this.viewer[this.index + 34 + i] === 0 &&
								this.viewer[this.index + 35 + i] === 0)
						{
							// hooray! it passed the check!
							// no i'm not going to re-write this code
						}
						// if it did not pass the above checks...
						else
						{
							// exit checks, set as failed
							success = false;
							i = 99;
						}
					}

					// if successful, exit loop
					if (success)
					{
						break;
					}
					// else, repeat and find next match
					else
					{
						this.index = this.index * 3;
						index2 = this.index + 1;
					}
				}
			}

			// if match was able to be found
			if (this.index !== -1)
			{
				if (diffSet)
				{
					// set <input> values to hex data 
					tuneE.value = this.viewer[this.index + 32];
					tuneN.value = this.viewer[this.index + 36];
					tuneH.value = this.viewer[this.index + 40];
					tuneX.value = this.viewer[this.index + 44];
				}
			}
			// else, if no match was found
			else
			{
				tuneE.value = -1;
				tuneN.value = -1;
				tuneH.value = -1;
				tuneX.value = -1;
				alert("ID not found :(");
			}
			this.findID = tuneID.value;
		}
	},


	// replace difficulty bytes with ones specified in <input>s
	replace: function()
	{
		// if the ID was found already
		if (this.index !== -1)
		{
			let count = 0;
			if (this.viewer[this.index + 32] !== Number(tuneE.value))
			{
				this.viewer[this.index + 32] = Number(tuneE.value);
				count++;
			}
			if (this.viewer[this.index + 36] !== Number(tuneN.value))
			{
				this.viewer[this.index + 36] = Number(tuneN.value);
				count++;
			}
			if (this.viewer[this.index + 40] !== Number(tuneH.value))
			{
				this.viewer[this.index + 40] = Number(tuneH.value);
				count++;
			}
			if (this.viewer[this.index + 44] !== Number(tuneX.value))
			{
				this.viewer[this.index + 44] = Number(tuneX.value);
				count++;
			}

			if (count !== 0)
			{
				this.saved = false;
				tuneSaved.style.display = "block";
			}
		}
	},

	download: function()
	{
		// download file
		simFile.download(tune.viewer, "TableTune.aar", "application/octet-stream");
		
		// set file as saved
		this.saved = true;
		tuneSaved.style.display = "none";
	}
};



// lemocha - lemocha7.github.io