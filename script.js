"use strict";

// ========================
// === JACKET CONSTANTS ===
// ========================
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
		titleGame: { x:6, y:337 },
		titleSmall: { x:343, y:299, w:106, h:11 },
		artist: { x:6, y:439 },
		source: { x:7, y:466 }
	}
};


// LIST OF ALL SONGS IN ST (total: 165)
const STList = [
// BASE GAME
 21, 43, 44, 47, 48, 52, 53, 92, 93, 99,114,115,117,119,122,148,
192,198,201,275,344,345,347,353,372,378,380,381,382,383,387,388,
390,421,474,476,512,560,567,568,569,595,596,624,625,626,670,671,672,
 28,272,623,705,720,	// UPDATE
379,475,510,542,			// LOCKED
950,951,999,					// CREDITS / TUTORIAL
// DLC
 23, 38, 41, 45, 49, 51, 55, 56, 57, 89,116,124,159,184,200,255,
256,257,266,267,271,274,276,280,298,311,312,313,356,357,365,368,370,
373,374,389,395,396,397,413,422,423,479,480,493,494,517,518,520,522,
548,554,558,570,574,576,587,592,594,597,605,607,609,610,629,632,640,
643,666,667,669,675,679,682,684,698,699,701,707,711,712,713,714,715,
716,717,721,722,723,724,725,734,735,737,738,739,741,743,751,759,761,
762,763,764];


// ======================
// === MISC FUNCTIONS ===
// ======================

// hexReverseChunk function moved to aarZip.js

function downloadIfValid(file)
{
	if (file[0] !== undefined)
	{
		simFile.download(...file);
	}
}



// lemocha - lemocha7.github.io