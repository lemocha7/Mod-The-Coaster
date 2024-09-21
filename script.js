"use strict";

// =================
// == TAB MANAGER ==
// =================
// DOM of all tab buttons
const tabButtons = idTabContainer.getElementsByTagName("button");
const tab =
{
	active: 1,
	list: ["about", "jacketConv", undefined, undefined, "asn", "aarZip"],

	// list of all tab <div>
	DOM:
	{
		about: document.getElementById("idTabAbout"),
		jacketConv: document.getElementById("idTabJacketConv"),
		asn: document.getElementById("idTabASN"),
		aarZip: document.getElementById("idTabAARZip")
	},
	// list of all tab <button> in tab container
	buttons:
	{
		about: tabButtons[3],
		jacketConv: tabButtons[0],
		asn: tabButtons[2],
		aarZip: tabButtons[1],
	},


	// open tab, set <div> and <button> as classes
	//	id [int]:				ID of tab to open
	open: function(id)
	{
		if (id !== this.active)
		{
			this.DOM[this.list[id]].classList.add("selected");
			this.DOM[this.list[this.active]].classList.remove("selected");
			this.buttons[this.list[id]].classList.add("selected");
			this.buttons[this.list[this.active]].classList.remove("selected");

			this.active = id;
		}
	}
};
// select tab ID in tab.active
tab.DOM[tab.list[tab.active]].classList.add("selected");
tab.buttons[tab.list[tab.active]].classList.add("selected");

// position of jacket elements
const jacket =
{
	AC:
	{
		height: 256,
		img: { x:1, y:1, w:196, h:196 },
		titleMenu: { y:197, h:28 },

		source: { y:180 }
	},
	AC2:
	{
		titleMenu: { x:6, w:356 },
		titleGame: { x:203, y:5, w:302, h:19 },

		artist: { x:2, y:226, w:370, h:22, },
		source: { x:208 }
	},
	AC4:
	{
		titleMenu: { x:5, w:366 },
		titleGame: { x:199, y:3, w:312, h:25 },

		artist: { x:7, y:234, w:364, h:20, },
		source: { x:205 }
	},
	SW:
	{
		height: 512,
		imgBigStretch: { x:2, y:0, w:336, h:336 },
		imgBig: { x:72, y:70, w:196, h:196 },
		img: { x:340, y:2, w:170, h:170 },
		imgSmall: { x:340, y:174, w:112, h:112 },

		titleMenu: { x:6, y:368 },
		titleMenuCenter: { x:70, y:404 },
		titleGame: { x:6, y:337 },  // , w:327, h:25
		titleSmall: { x:343, y:299, w:106, h:11 },
		artist: { x:6, y:439 },
		source: { x:7, y:466 }
	}
};

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


// ===============
// == FILE DRAG ==
// ===============
// tied to "ondragover" event. set drop visuals, add "drag" class
//	event [event]:		drag / drop event
//	dom [dom]:				DOM of file-area
function fileDrag(event, dom)
{
	event.stopPropagation();
	event.preventDefault();
	event.dataTransfer.dropEffect = "copy";

	dom.classList.add("drag");
}
// tied to "ondragleave" event. remove "drag" class
//	dom [dom]:				DOM of file-area
function fileDragLeave(dom) { dom.classList.remove("drag"); }

// tied to "ondrop" event. remove drop visuals, run 
//	event [event]:		drag / drop event
//	dom [dom]:				DOM of file-area
//	dest [obj]:				loadFile() under whichever object specified (e.g. "aarZip")
function fileDrop(event, dom, dest)
{
	event.stopPropagation();
	event.preventDefault();
	dest.loadFile(event.dataTransfer.files);

	dom.classList.remove("drag");
}



// lemocha - lemocha7.github.io