/*
 *	James-Swift/AlbumViewer
 *
 *	Copyright James Swift 2012 - Creative Commons Attribution-ShareAlike 3.0
 *
 *	2013-08-20  - Version: v0.24.0
 *
 *	This file creates a global object named AlbumViewer which allows you to
 *	easily insert a simple album viewer into any element on a page.
 *
 *	///////////////////////////////////////////////////////////////////////////////////
 *	Here is an example implementation:
 *
 *		//Initialize album viewer
 *		var rotator = new AlbumViewer({
 *			container:"MY_CUSTOM_DIV",
 *			slideshowDelay:6500
 *		});
 *
 *		 //Load Album
 *		rotator.loadAlbum({
 *			name:"example",
 *			location:"images/exampleAlbum/",
 *			images:['img1.jpg','other_img.jpg','test.gif']
 *		});
 *
 *		//Make it an endlessly repeating album
 *		rotator.endlessAlbum=true;
 *
 *		//Start a slideshow
 *		rotator.slideshowStart();
 *
 *
 *
 *	///////////////////////////////////////////////////////////////////////////////////
 *	The AlbumViewer has the following user-settable variables:
 *
 *	The following can only be set as elements in the constructor object (they cannot
 *	be altered once the AlbumViewer has been initialized). If you do not specify
 *	"container", the AlbumViewer will look for the other 6 variables listed below
 *	it. You should only specify one group or the other.
 *
 *	enableLinks		boolean	If you plan to have the displayed images link to their source files, set this to true. If set to false, no links will be generated.
 *
 *	--------------------------------------------------------------------------------------------
 *	container		string	The ID of a div or other element to construct a simple album viewer inside. If you plan to construct a complex viewer, create and then specify each element below in your HTML file instead.
 *	--------------- OR -------------------------------------------------------------------------
 *	container1		string	The ID of the table, div or other element containing the first image.
 *	link1			string	The ID of the anchor (<a>) element associated with the first image. Optional.
 *	img1			string	The ID of the actual img (<img>) element for the first image.
 *	container2		string	The ID of the table, div or other element containing the second image.
 *	link2			string	The ID of the anchor (<a>) element associated with the second image. Optional.
 *	img2			string	The ID of the actual img (<img>) element for the second image.
 *	--------------------------------------------------------------------------------------------
 *
 *	The following are optional and can either be set as elements in the constructor
 *	object or later by editing the new instance using the . dot notation:
 *
 *	blankImage		string	The path to a blank gif image. Used as the initial image to fade from. Default is "images/blank.png"
 *	fadeStep		number	The amount of opacity to add/subtract on each frame of the fading process. A smaller value is smoother, but fades slower.
 *	fadeTime		number	The time in ms between frames of the fader. A larger value fades slower, but may appear more jerky.
 *	fadeBoth		boolean	Default: true. By default the album viewer, when transitioning, will fade both images - the current and the new - in case they are different dimension (otherwise the edges of one might just suddenly appear). If you know for sure your images will be the same size, you can specify false to halve the browsers work load.
 *	slideshowDelay		number	The delay between each slide in ms.
 *	slideshowRandom		boolean	If set to true, the slideshow will display the images randomly instead of sequentially.
 *	endlessAlbum		boolean	When set to true, once the slideshow has reached the end of the album it will continue from the start. Otherwise the slideshow will just end.
 *
 *
 *
 *	///////////////////////////////////////////////////////////////////////////////////
 *	The AlbumViewer has the following non-settable variables which can be accessed
 *	(after the album viewer has been initialized), using the . dot notation. They are
 *	provided for reference only, altering them will not change anything.
 *
 *	args			array	The arguments that where passed to the constructor. Includes the IDs for the container group even if they were not specified (as in rotator.args.img1, rotator.args.container1, rotator.args.link2 etc.) for reference.
 *	selectedImageID		number	The array ID of the currently selected image.
 *	selectedImageSrc	string	The image name as taken from "albumImages". Has not been passed through getSrc().
 *	history			array	This array contains the history of requested images. Item 0 is always the last requested image (history is unshift-ed rather than push-ed). The currently selected image is not stored in history, but is found in "selectedImageID".
 *	albumName		string	The name of the album as passed in by loadAlbum()
 *	albumLocation		string	The path to the album as passed in by loadAlbum()
 *	albumImages		array	The array of images passed in by loadAlbum(). May be an array of strings containing the image name (as indicated by the variable "imagesAreArrays" = false), or an array of arrays containing image properties ("imagesAreArrays" = true).
 *	imagesAreArrays		boolean Indicates whether "albumImages" is an array of strings, or an array of arrays.
 *	imageNameField		string	If "albumImages" is an array of arrays the value of this variable indicates the field in each array that contains the image's file name. (I.E. albumImages[imageNameField] = "test.jpg") Defaults to "name".
 *	slideshowStopped	boolean	If the slideshow is stopped, this variable will be set to true.
 *
 *
 *
 *	///////////////////////////////////////////////////////////////////////////////////
 *	The AlbumViewer has the following functions (methods) which you can use to
 *	controll it:
 *
 *	loadAlbum (				Call loadAlbum to (re-)initialize the album viewer with album data. returns true on success, throws an error on failure.
 *		object {				It only has one argument, which must be an object.
 *			name					REQUIRED A string containing the name of your album.
 *			images					REQUIRED An array of strings containing image names OR an array of arrays containing image properties. If you are using an array of arrays please indicate which field will contain each image's file name by specifying imageNameField (see below).
 *			location				OPTIONAL A string containing the path to the folder containing your album images. By default the album viewer will combine this path with the selected image filename when loading the source file. (E.G. my_albumLocation/image1.jpg), but if each image is in a different locationecory you can set "location" null and hard code the full path into each image's file name in the "images" array.
 *			imageNameField			OPTIONAL If "images" is an array of arrays the value of this variable indicates the field in each array that contains the image's file name. (I.E. if "images[0].fileName = 'test.jpg'" set this variable to "fileName") Defaults to "name".
 *		  }
 *		)
 *
 *	switchTo (				Call switchTo to display a specific image from the "albumImages" array.
 *			imageID			The "Images" array id of an image you want to switch to. If the id is out of bounds it will be corrected.
 *		)
 *
 *	findImageID (				Call this when you want to find the id of an image's file-name. Returns the id of the item in the albumImages array on success, boolean false on failure.
 *			imageName			The name of the image
 *		      )
 *
 *	safeImageID (				When processing user defined image IDs, pass them through this function. It will check they are valid, and try to intelligently guess what the user wanted if the id is invalid. (For example, if the id is past the end of the album it will either return the last image or if endlessAlbum==true it will return the first image).
 *			imageID			The numerical id which might represent an image
 *		      )
 *
 *	imageNext ( )				Moves to the next image in the array. If "endlessAlbum" is true, it will reset to the begining of the array once the last item has been reached.
 *
 *	imagePrevious ( )			Moves to the previous image in the array. If "endlessAlbum" is true, it will start at the end of the array once the first item in the array has been reached.
 *
 *	imageRandom ( )				Displays a random image from the "albumImages" array.
 *
 *	slideshowStart (			Starts a slideshow of the images in "albumImages"
 *			randomly			If this argument is true, it will set "slideshowRandom" to true and play a random never-ending slideshow.
 *			startAt				The ID of the image to start the slideshow at. If not set, will default to next image();
 *		)
 *
 *	slideshowStop ( )			Stops the slideshow (if one is taking place).
 *
 *	slideshowToggle ( )			Starts/Stops the slideshow depending on it's state.
 *
 *
 *
 *
 *
 *
 *	///////////////////////////////////////////////////////////////////////////////////
 *	The AlbumViewer has the following functions available for you to reassign to
 *	aid in building applications on top of it. You do not need to reassign them, the
 *	album viewer will function correctly normally, but you may wish to reassign them
 *	to extend it's abilities.
 *
 *	onSwitchTo (				Called whenever the selected image changes.
 *		selectedImageID				The id of the newly selected image is passed as an argument
 *		)
 *
 *	loadingStarted ( )			Called whenever the AlbumViewer expects a delay in loading the requested image (more than 10 ms).
 *
 *	loadingComplete ( )			Called when the AlbumViewer has finished downloading data. Just before the fade transition has started,
 *
 *	getSrc (				Caled whenever the AlbumViewer needs to download an image. It allows you to alter the requested URL (perhaps to route it through an image resizer script)
 *		imageID					The array id of the requested image (from albumImages)
 *		)
 *		return					Your function should return a string containing the location of the image.
 *
 *	getAlt (				Called whenever the AlbumViewer want to update the "alt" text of an image. You could perhpas append you own description.
 *		imageID					The array id of the requested image (from albumImages)
 *		)
 *		return					Your function should return a string containing the new alt text for the requested image
 *
 *	getLink (				Called whenever the AlbumViewer needs to generate a link to an image. By default it just links to the image source, but you might want to make it link to a larger version, or an album page with comments.
 *		imageID					The array id of the requested image (from albumImages)
 *		)
 *		return					Your function should return a string containing the url to be used as a link to this image.
 *
 *
 *	You could reassign one of the above functions like this:
 *
 *		//(assuming an instance of the AlbumViewer named rotator)
 *
 *		rotator.getLink = function (imageID) {
 *			return "large_images/" + this.albumImages[imageID];
 *		}
 *
 *
 *
 *
 *
 *	///////////////////////////////////////////////////////////////////////////////////
 *	A note on the construction of the AlbumViewer:
 *
 *	Javascript doesn't fully support classes like other languages do. By use of the NEW
 *	keyword, you can create a copy of a function, which means you can sort of construct
 *	a class by declaring it inside a function then instantiating it with the NEW keyword.
 *
 *	The problem with this approach is that a LITERAL copy is made of the function, meaning
 *	that a lot of memory would be needlessly consumed with each new instance. The solution
 *	to this problem is to put only the constructor inside the main function, and declare
 *	any other needed functions outside of it. That way, when a copy is made, only the
 *	constructor is copied, the other functions are just referenced.
 *
 *	The problem with doing that though is that the global namespace is cluttered up with
 *	lots of extra functions. To avoid that, the AlbumViewer is encapsulated inside
 *	a closure. A closure is a function which is executed immediately after being declared.
 *	For example:
 *
 *		var aClosure = function() {
 *
 *			function do_stuff(i) {
 *				return i += 1;
 *			}
 *
 *			return function construct(arg1, arg2) {
 *				var i = do_stuff(2);
 *				return i;
 *			}
 *
 *		}();
 *
 *	Note the () at the end of the line. A closure has the effect of hiding anything that is
 *	declared within it from the global namespace. In the above instance, only "aClosure"
 *	is visible in the global namespace, and "aClosure" represents the function called
 *	"construct". When a new instance is created, only the "construct" function is copied.
 *	"do_stuff" is just linked/referenced. That is the form the AlbumViewer takes.
 *
 *	It can look a little confusing at first, but is really quite simple once you get your
 *	head around it.
 *	
 *	Happy Hacking!
 */


var AlbumViewer = AlbumViewer || (function () {
	"use strict";

	var	construct, buildHTML, loadAlbum, switchTo, fade, safeImageID, findImageID,
		slideshowStop, slideshowStart, slideshowToggle,
		imageNext, imagePrevious, imageRandom,
		IS_IE, IS_OLD_IE,
		instances = 0;

	//Check wether the browser is Internet Explorer (IE)
	if (navigator.userAgent.match(/\bMSIE\b/) && (!document.documentMode || document.documentMode < 9)) {
		IS_IE = true;
	} else {
		IS_IE = false;
	}

	if ((/\bMSIE 6/.test(navigator.userAgent) || /\bMSIE 7/.test(navigator.userAgent)) && !window.opera) {
		IS_OLD_IE = true;
	} else {
		IS_OLD_IE = false;
	}


	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	construct = function (args) {
		var	that = this, me = {};

		//Keep track of the number of instances
		instances += 1;

		//Default State for user-setable variables
		that.blankImage = args.blankImage || "images/blank.png";						//The location of a blank image to load at startup
		that.fadeStep = args.fadeStep || 2;									//How much opacity should be added/subtracted each cycle
		that.fadeTime = args.fadeTime || 12;									//How long in ms between each cycle
		that.slideshowDelay = args.slideshowDelay || 5000;							//How long in ms before the next image is loaded
		that.slideshowRandom = args.slideshowRandom || false;							//Load random images instead of start to finish
		that.endlessAlbum = (args.endlessAlbum === undefined || args.endlessAlbum === true) ? true : false;	//Should the album reset when it reaches the end
		that.fadeBoth = args.fadeBoth || true;

		//Other slideshow variables
		me.c1 = {};
		me.c2 = {};
		me.slideshowStopped = true;
		me.instanceID = instances;
		me.enableLinks = (args.enableLinks === undefined || args.enableLinks === true) ? true : false;
		me.loading = false;
		me.loadingStartedCalled = false;
		that.selectedImageID = null;
		that.selectedImageSrc = null;
		that.history = [];

		//Should we build the html elements ourselves?
		if (args.container !== null && document.getElementById(args.container) !== null) {
			//Link to main container
			me.c0 = document.getElementById(args.container);

			//Build HTML elements
			buildHTML(me, that);

			//Update args with element names
			args.container1 = "AlbumViewer_" + me.instanceID + "_t1";
			args.link1 = "AlbumViewer_" + me.instanceID + "_l1";
			args.img1 = "AlbumViewer_" + me.instanceID + "_i1";
			args.container2 = "AlbumViewer_" + me.instanceID + "_t2";
			args.link2 = "AlbumViewer_" + me.instanceID + "_l2";
			args.img2 = "AlbumViewer_" + me.instanceID + "_i2";
		}

		//Check all the needed html Elements are in place
		if (document.getElementById(args.container1)			!== null &&
				document.getElementById(args.img1)		!== null &&
				document.getElementById(args.container2)	!== null &&
				document.getElementById(args.img2)		!== null &&
				(me.enableLinks === false || (document.getElementById(args.link1) !== null && document.getElementById(args.link2) !== null))
				) {
			//Link Elements to me
			me.c1.table = document.getElementById(args.container1);
			me.c1.img = document.getElementById(args.img1);
			me.c2.table = document.getElementById(args.container2);
			me.c2.img = document.getElementById(args.img2);
			if (me.enableLinks === true) {
				me.c1.link = document.getElementById(args.link1);
				me.c2.link = document.getElementById(args.link2);
			}

			//Fix IE7 Stupidity
			if (args.container !== null) {
				me.c1.img.style.width = "auto";
				me.c1.img.style.height = "auto";
				me.c2.img.style.width = "auto";
				me.c2.img.style.height = "auto";
			}
		} else {
			throw {
				name : "Error",
				message : "Not all elements could be found. Please check the correct element id has been specified. Unable to load album viewer."
			};
		}

		//list args for user refference
		that.args = args;

		//Declare functions that can be over-written by the user
		that.onSwitchTo = function () {};
		that.loadingStarted = function () {};
		that.loadingComplete = function () {};
		that.getSrc = function (srcID) {
			var isrc;
			if (this.imagesAreArrays === true) {
				isrc = this.albumImages[srcID][this.imageNameField];
			} else {
				isrc = this.albumImages[srcID];
			}
			if (this.albumLocation === null) {
				return isrc;
			} else {
				return this.albumLocation + isrc;
			}
		};
		that.getAlt = function (srcID) {
			if (this.imagesAreArrays === true) {
				return this.albumImages[srcID][this.imageNameField].substr(this.albumImages[srcID][this.imageNameField].lastIndexOf("/") + 1);
			} else {
				return this.albumImages[srcID].substr(this.albumImages[srcID].lastIndexOf("/") + 1);
			}
		};
		that.getLink = function (srcID) {
			var isrc;
			if (this.imagesAreArrays === true) {
				isrc = this.albumImages[srcID][this.imageNameField];
			} else {
				isrc = this.albumImages[srcID];
			}
			if (this.albumLocation === null) {
				return isrc;
			} else {
				return this.albumLocation + isrc;
			}
		};

		//Link our functions to this instance (rather than declaring them inside it which would copy them for every instance)
		that.loadAlbum		= function (album) {
			return loadAlbum(album, me, that);
		};
		that.switchTo		= function (srcID) {
			return switchTo(srcID, me, that);
		};
		that.safeImageID	= function (srcID) {
			return safeImageID(srcID, me, that);
		};
		that.findImageID	= function (image) {
			return findImageID(image, me, that);
		};
		that.slideshowStart	= function (randomly, startAt) {
			return slideshowStart(randomly, startAt, me, that);
		};
		that.slideshowStop	= function () {
			return slideshowStop(me, that);
		};
		that.slideshowToggle	= function () {
			return slideshowToggle(me, that);
		};
		that.imageNext		= function () {
			return imageNext(me, that);
		};
		that.imagePrevious	= function () {
			return imagePrevious(me, that);
		};
		that.imageRandom	= function () {
			return imageRandom(me, that);
		};
		me.fade			= function () {
			return fade(me, that);
		};

		return that;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	buildHTML = function (me, that) {
		var i, dm = {};
		//Empty the container
		me.c0.innerHTML = "";
		//Build html elements
		for (i = 1; i <= 2; i += 1) {
			dm.table = document.createElement("table");
			dm.table.setAttribute("id", "AlbumViewer_" + me.instanceID + "_t" + i);
			dm.table.setAttribute("cellpadding", "0");
			dm.table.setAttribute("cellspacing", "0");
			dm.table.style.position = "absolute";
			dm.table.style.zIndex = i;
			dm.table.style.verticalAlign = "middle";
			dm.table.style.textAlign = "center";
			dm.table.style.width = "100%";
			dm.table.style.height = "100%";

			dm.tbody = document.createElement("tbody");
			dm.tr = document.createElement("tr");
			dm.td = document.createElement("td");
			if (me.enableLinks === true) {
				dm.a = document.createElement("a");
				dm.a.setAttribute("target", "_blank");
				dm.a.setAttribute("id", "AlbumViewer_" + me.instanceID + "_l" + i);
				dm.img = document.createElement("img");
				dm.img.setAttribute("id", "AlbumViewer_" + me.instanceID + "_i" + i);
				dm.img.setAttribute("src", that.blankImage);
				dm.img.setAttribute("alt", "Loading");
				dm.a.appendChild(dm.img);
				dm.td.appendChild(dm.a);
			} else {
				dm.img = document.createElement("img");
				dm.img.setAttribute("id", "AlbumViewer_" + me.instanceID + "_i" + i);
				dm.img.setAttribute("src", that.blankImage);
				dm.img.setAttribute("alt", "Loading");
				dm.td.appendChild(dm.img);
			}
			dm.tr.appendChild(dm.td);
			dm.tbody.appendChild(dm.tr);
			dm.table.appendChild(dm.tbody);
			me.c0.appendChild(dm.table);
		}
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	loadAlbum = function (album, me, that) {

		if (typeof album === "object") {
			//Convert images objects into arrays
			if (typeof album.images === "object") {
				var key, oldAlbumImages = album.images;
				album.images = [];
				for (key in oldAlbumImages) {
					if (oldAlbumImages.hasOwnProperty(key)) {
						album.images.push(oldAlbumImages[key]);
					}
				}
			}

			if (album.name && album.images && album.images.length > 0 && (album.location === null || typeof album.location === "string")) {

				//Cancel any current actions
				that.slideshowStop();

				//Populate object

				that.albumName = album.name;
				that.albumImages = album.images;
				that.selectedImageID = null;
				that.selectedImageID = null;

				that.imageNameField = album.imageNameField || "name";
				that.imagesAreArrays = false;
				if (typeof that.albumImages[0] !== "string") {
					that.imagesAreArrays = true;
				}

				if (album.location !== null) {
					album.location = album.location.replace(/\\/g, "/");
					that.albumLocation = (album.location.charAt(album.location.length - 1) !== "/") ? album.location + "/" : album.location;
				} else {
					that.albumLocation = null;
				}


				//Reset Element variables

				me.selectedImageID = -1;
				me.selectedContainer = 1;
				me.c1.opacity = 100;
				me.c2.opacity = 0;

				me.imageNameField = that.imageNameField;
				me.imagesAreArrays = that.imagesAreArrays;

				//Reset Opacity
				if (IS_IE === false) {
					me.c1.table.style.opacity = (me.c1.opacity / 100);
					me.c2.table.style.opacity = (me.c2.opacity / 100);
				} else {
					me.c1.table.style.filter = "alpha(opacity=" + me.c1.opacity + ")";
					me.c2.table.style.filter = "alpha(opacity=" + me.c2.opacity + ")";
				}
				return true;
			}
		}

		throw {
			name: "InvalidObject",
			message: "The album object you passed is invalid. Please make sure it contains the properties 'name','images' (and array of 1 or more image file names) and 'location' (the path to the folder containting the images)."
		};

	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	switchTo = function (srcID, me, that) {

		//Catch over-runs and handle endlessAlbum setting
		me.nextImageID = that.safeImageID(srcID);

		//If attempting to switch to the current image, just return true (unless in random slideshow)
		if (me.nextImageID === me.selectedImageID && (that.slideshowRandom === false || me.slideshowStopped === false)) {
			return true;
		}

		//Update that with currently selected image
		if (me.selectedImageID > -1) {
			that.history.unshift(me.selectedImageID);
		}
		that.selectedImageID = me.nextImageID;
		if (me.imagesAreArrays === true) {
			that.selectedImageSrc = that.albumImages[me.nextImageID][me.imageNameField];
		} else {
			that.selectedImageSrc = that.albumImages[me.nextImageID];
		}

		//Call loadingStarted() in case the user has reassigned that function
		me.loading = true;
		setTimeout(
			function () {
				if (me.loading === true && me.loadingStartedCalled === false) {
					that.loadingStarted();
					me.loadingStartedCalled = true;
				}
			},
			10
		);

		//Apply actions to appropriate container
		if (me.selectedContainer === 1) {
			//Stop any actions currently pending
			me.c2.img.onload = null;
			me.c2.img.src = that.blankImage;

			//Set onload to trigger fade to switch to hidden container
			me.c2.img.onload = function () {
				clearTimeout(me.timer);
				me.fade();
				if (me.c1.img.onload === null && me.loading === true) {
					me.loadingStartedCalled = false;
					me.loading = false;
					that.loadingComplete();
				}
			};

			//Load next source into currently hidden container
			me.c2.img.src = that.getSrc(me.nextImageID);
			me.c2.img.alt = that.getAlt(me.nextImageID);
			if (me.enableLinks === true) {
				me.c2.link.href = that.getLink(me.nextImageID);
			}

		} else {
			//Stop any actions currently pending
			me.c1.img.onload = null;
			me.c1.img.src = that.blankImage;

			//Set onload to trigger fade to switch to hidden container
			me.c1.img.onload = function () {
				me.timer = clearTimeout(me.timer);
				me.fade();
				if (me.c2.img.onload === null && me.loading === true) {
					me.loadingStartedCalled = false;
					me.loading = false;
					that.loadingComplete();
				}
			};

			//Load next source into currently hidden container
			me.c1.img.src = that.getSrc(me.nextImageID);
			me.c1.img.alt = that.getAlt(me.nextImageID);
			if (me.enableLinks === true) {
				me.c1.link.href = that.getLink(me.nextImageID);
			}

		}

		that.onSwitchTo(me.nextImageID);
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	fade = function (me, that) {
		if (me.selectedContainer === 1) {
			me.c1.opacity = me.c1.opacity - that.fadeStep;
			me.c2.opacity = me.c2.opacity + that.fadeStep;
		} else {
			me.c1.opacity = me.c1.opacity + that.fadeStep;
			me.c2.opacity = me.c2.opacity - that.fadeStep;
		}

		//Catch over-runs
		me.c1.opacity = (me.c1.opacity < 0 ? 0 : (me.c1.opacity > 100 ? 100 : me.c1.opacity));
		me.c2.opacity = (me.c2.opacity < 0 ? 0 : (me.c2.opacity > 100 ? 100 : me.c2.opacity));

		if (IS_IE === false) {
			if (that.fadeBoth === true) { me.c1.table.style.opacity = (me.c1.opacity / 100); }
			me.c2.table.style.opacity = (me.c2.opacity / 100);
		} else {
			if (that.fadeBoth === true) { me.c1.table.style.filter = "alpha(opacity=" + me.c1.opacity + ")"; }
			me.c2.table.style.filter = "alpha(opacity=" + me.c2.opacity + ")";
		}

		//Set display to none to allow links on lower layers to work
		if (me.c1.opacity <= 0) {
			me.c1.table.style.display = "none";
		} else if (IS_OLD_IE) {
			me.c1.table.style.display = "inline-block";
		} else {
			me.c1.table.style.display = "table";
		}
		if (me.c2.opacity <= 0) {
			me.c2.table.style.display = "none";
		} else if (IS_OLD_IE) {
			me.c2.table.style.display = "inline-block";
		} else {
			me.c2.table.style.display = "table";
		}

		if (me.c1.opacity > 0 && me.c1.opacity < 100) {
			me.timer = setTimeout(function () { me.fade(); }, that.fadeTime);
		} else {
			//Update Selected source
			me.selectedImageID = me.nextImageID;

			//Finished fading so update me.selectedContainer
			if (me.selectedContainer === 1) {
				me.c2.img.onload = null;
				me.selectedContainer = 2;
				//Auto-load the next image if no action is currently taking place
				if (me.c1.img.onload === null) {
					me.c1.img.src = that.getSrc(that.safeImageID(me.selectedImageID + 1));
				}
			} else {
				me.c1.img.onload = null;
				me.selectedContainer = 1;
				//Auto-load the next image if no action is currently taking place
				if (me.c2.img.onload === null) {
					me.c2.img.src = that.getSrc(that.safeImageID(me.selectedImageID + 1));
				}
			}

			//Should we move onto the next picture?
			if (me.slideshowStopped !== true) {
				if (that.slideshowRandom === false) {
					//Just move onto the next in the sequence
					me.timer = setTimeout(
						function () {
							that.imageNext();
						},
						that.slideshowDelay
					);
				} else {
					//Pick a random picture to move onto
					me.timer = setTimeout(
						function () {
							that.imageRandom();
						},
						that.slideshowDelay
					);
				}
			}

		}
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	safeImageID = function (srcID, me, that) {
		if (srcID >= that.albumImages.length) {
			srcID = that.endlessAlbum ? 0 : that.albumImages.length - 1;
		}
		if (srcID < 0) {
			srcID = that.endlessAlbum ? that.albumImages.length - 1 : 0;
		}
		if (that.albumImages[srcID] === undefined) {
			//try to find the next id in the array
			while (that.albumImages[srcID] === undefined && srcID <= that.albumImages.length) {
				srcID += 1;
			}
			//If still not found return 0
			if (that.albumImages[srcID] === undefined) {
				srcID = 0;
			}
		}
		return srcID;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	findImageID = function (image, me, that) {
		var img, i = 0;
		if (me.imagesAreArrays === true) {
			for (img in that.albumImages) {
				if (that.albumImages.hasOwnProperty(img)) {
					if (that.albumImages[img][me.imageNameField] === image) {
						return i;
					}
					i += 1;
				}
			}
		} else {
			return that.safeImageID(that.albumImages.indexOf(image));
		}
		return false;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	slideshowStop = function (me, that) {
		window.clearTimeout(me.timer);
		me.c1.img.onload = null;
		me.c2.img.onload = null;
		me.slideshowStopped = true;
		that.slideshowStopped = true;
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	slideshowStart = function (randomly, startAt, me, that) {
		that.slideshowStop();
		me.slideshowStopped = false;
		that.slideshowStopped = false;
		if (randomly === true) {
			that.slideshowRandom = true;
		}
		if (that.slideshowRandom === true) {
			that.switchTo(Math.floor(Math.random() * (that.albumImages.length - 1)));
		} else if (me.selectedImageID === that.albumImages.length - 1) {
			that.switchTo(0);
		} else {
			if (startAt === null || startAt === undefined) {
				that.imageNext();
			} else {
				that.switchTo(startAt);
			}
		}

		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	slideshowToggle = function (me, that) {
		if (me.slideshowStopped === true) {
			that.slideshowStart();
		} else {
			that.slideshowStop();
		}
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	imageNext = function (me, that) {
		that.switchTo(me.selectedImageID + 1);
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	imagePrevious = function (me, that) {
		that.switchTo(me.selectedImageID - 1);
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	imageRandom = function (me, that) {
		var rid = -1;
		//Check that there are more than two images before doing a true random switch (likely to get caught in a loop otherwise)
		if (that.albumImages.length > 2) {
			do {
				rid = Math.round(Math.random() * (that.albumImages.length - 1));
			} while (rid === me.selectedImageID);
		} else {
			rid = me.selectedImageID + 1;
		}
		that.switchTo(rid);
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//Fix IE7 stupidity
	if (!Array.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			var i;
			for (i = (start || 0); i < this.length; i += 1) {
				if (this[i] === obj) {
					return i;
				}
			}
			return undefined;
		};
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//Lastly return the constructor function
	return construct;

}());