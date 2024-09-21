"use strict";

const jacketConv =
{
	// DOM of canvases used, 
	canvas: document.getElementById("jcCanvas"),
	canvasEdit: document.getElementById("jcCanvasEdit"),
	ctx: document.getElementById("jcCanvas").getContext("2d"),
	ctxEdit: document.getElementById("jcCanvasEdit").getContext("2d"),

	img: undefined,
	from: "AC", to: "SW",

	// handle zipping results if multiple files. else, just run this.master()
	//	files [fileList]:				list of files and their data
	loadFile: async function(files)
	{
		// if only 1 file, run once
		if (files.length === 1)
		{
			this.master(files[0]);
		}
		// else, run for each file and zip results
		else
		{
			const zip = new JSZip();

			// for each file entered...
			const l = files.length;
			for (let i = 0; i < l; i++)
			{
				// draw image in canvas, and wait until done
				await new Promise(resolve => this.master(files[i], resolve));

				// get canvas data and convert to blob,
				// then add PNG file to ZIP
				await fetch(this.canvasEdit.toDataURL("image/png")).then(x => x.blob()).then(blob =>
					zip.file(files[i].name, blob));
			}

			// download ZIP
			simFile.download(await zip.generateAsync({ type:"blob" }), "jacketConvert.zip", "application/zip");
		}
	},

	// load file as image, pass to this.convert()
	//	file [fileList]:				jacket to be converted
	//	resolve [resolve]:			run to end promise (await), passed to this.convert()
	master: async function(file, resolve)
	{
		// if a file was entered
		if (file !== undefined)
		{
			// make new image and set SRC to file
			this.img = new Image();
			this.img.src = await simFile.read(file, "readAsDataURL");

			this.img.onload = () => this.convert(resolve);
		}
		// else, if no image
		else if (this.img === undefined)
		{
			// make new image and set SRC to template
			this.img = new Image();
			this.img.src = "img/dummy_menu.webp";

			this.img.onload = () => this.convert(resolve);
		}
		else
		{
			this.convert(resolve);
		}
	},

	// ======================
	// === JACKET CONVERT ===
	// ======================
	// re-arrange chunks of AC jacket to fit SW
	//	resolve [resolve]:			run to end promise (await)
	convert: function(resolve)
	{
		this.canvas.width  = 512;
		this.canvas.height = this.img.height;
		this.canvasEdit.width  = 512;
		this.canvasEdit.height = jacket[this.to].height;

		this.ctxEdit.imageSmoothingEnabled = false;

		this.ctx.drawImage(this.img, 0, 0, 512, this.img.height);


		// draw big 336x336 image
		if (jcSetStretch.checked)
		{
			this.ctxEdit.drawImage(this.canvas,
				jacket[this.from].img.x, jacket[this.from].img.y, jacket[this.from].img.w, jacket[this.from].img.h,
				jacket[this.to].imgBigStretch.x, jacket[this.to].imgBigStretch.y, jacket[this.to].imgBigStretch.w, jacket[this.to].imgBigStretch.h);
		}
		else
		{
			this.ctxEdit.drawImage(this.canvas,
				jacket[this.from].img.x, jacket[this.from].img.y, jacket[this.from].img.w, jacket[this.from].img.h,
				jacket[this.to].imgBig.x, jacket[this.to].imgBig.y, jacket[this.to].imgBig.w, jacket[this.to].imgBig.h);
		}

		// draw small 170x170 and 112x112 images
		this.ctxEdit.drawImage(this.canvas,
			jacket[this.from].img.x, jacket[this.from].img.y, jacket[this.from].img.w, jacket[this.from].img.h,
			jacket[this.to].img.x, jacket[this.to].img.y, jacket[this.to].img.w, jacket[this.to].img.h);
		this.ctxEdit.drawImage(this.canvas,
			jacket[this.from].img.x, jacket[this.from].img.y, jacket[this.from].img.w, jacket[this.from].img.h,
			jacket[this.to].imgSmall.x, jacket[this.to].imgSmall.y, jacket[this.to].imgSmall.w, jacket[this.to].imgSmall.h);


		// draw song menu titles
		// left-aligned
		this.ctxEdit.drawImage(this.canvas,
			jacket[jcACVer.value].titleMenu.x, jacket[this.from].titleMenu.y, jacket[jcACVer.value].titleMenu.w, jacket[this.from].titleMenu.h,
			jacket[this.to].titleMenu.x, jacket[this.to].titleMenu.y, jacket[jcACVer.value].titleMenu.w, jacket[this.from].titleMenu.h);
		// centered
		this.ctxEdit.drawImage(this.canvas,
			jacket[jcACVer.value].titleMenu.x, jacket[this.from].titleMenu.y, jacket[jcACVer.value].titleMenu.w, jacket[this.from].titleMenu.h,
			jacket[this.to].titleMenuCenter.x, jacket[this.to].titleMenuCenter.y, jacket[jcACVer.value].titleMenu.w, jacket[this.from].titleMenu.h);
		// small
		this.ctxEdit.drawImage(this.canvas,
			jacket[jcACVer.value].titleGame.x, jacket[jcACVer.value].titleGame.y, jacket[jcACVer.value].titleGame.w, jacket[jcACVer.value].titleGame.h,
			jacket[this.to].titleSmall.x, jacket[this.to].titleSmall.y, jacket[this.to].titleSmall.w, jacket[this.to].titleSmall.h);

		// draw song in-game title
		this.ctxEdit.drawImage(this.canvas,
			jacket[jcACVer.value].titleGame.x, jacket[jcACVer.value].titleGame.y, jacket[jcACVer.value].titleGame.w, jacket[jcACVer.value].titleGame.h,
			jacket[this.to].titleGame.x, jacket[this.to].titleGame.y, jacket[jcACVer.value].titleGame.w, jacket[jcACVer.value].titleGame.h);

		// draw artist name
		this.ctxEdit.drawImage(this.canvas,
			jacket[jcACVer.value].artist.x, jacket[jcACVer.value].artist.y, jacket[jcACVer.value].artist.w, jacket[jcACVer.value].artist.h,
			jacket[this.to].artist.x, jacket[this.to].artist.y, jacket[jcACVer.value].artist.w, jacket[jcACVer.value].artist.h);

		// draw song source
		this.ctxEdit.drawImage(this.canvas,
			jacket[jcACVer.value].source.x, jacket[this.from].source.y, 315, 16,
			jacket[this.to].source.x, jacket[this.to].source.y, 315, 16);


		// resolve await
		if (resolve !== undefined) { resolve(); }
	}
};
jacketConv.master();



// lemocha - lemocha7.github.io