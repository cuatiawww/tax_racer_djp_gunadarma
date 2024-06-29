var menuL = (function () {
	function menuL () {
		var s = this;
		LExtends(s, LSprite, []);

		var backgroundBmp = new LBitmap(dataList["default_menu_background"]);
		backgroundBmp.scaleX = LGlobal.width / backgroundBmp.getWidth();
		backgroundBmp.scaleY = LGlobal.height / backgroundBmp.getHeight();
		s.addChild(backgroundBmp);
		s.addTitle();
		s.btnLayer = new LSprite();
		s.addChild(s.btnLayer);
		
		s.addBtns()
	}

	//LOGO
	menuL.prototype.addTitle = function () {
		var s = this;

		// Ensure the image key "logofix.png" exists in dataList and is loaded correctly
		var logoData = dataList["logofix"];
		if (!logoData) {
			console.error("Logo image not found in dataList");
			return;
		}

		// Create and position the logo
		var logo = new LBitmap(logoData);
		var logoScale = 0.2; // Adjust the scale as needed
		logo.scaleX = logoScale;
		logo.scaleY = logoScale;
		logo.x = (LGlobal.width - logo.getWidth() * logoScale) * 0.23;
		logo.y = 50; // Adjust this value as needed

		s.addChild(logo);
		console.log("Logo added at:", logo.x, logo.y); // Log the position
	};

	menuL.prototype.addBtns = function () {
		var s = this;

		var txtTemplate = new LTextField();
		txtTemplate.weight = "bold";
		txtTemplate.size = "25";
		txtTemplate.color = "white";
		txtTemplate.filters = [new LDropShadowFilter(null, null, "white", 15)];


		var btnList = ["MULAI", "BANTUAN", "TENTANG GAME"];

		for (var k = 0; k < btnList.length; k++) {
			var t = btnList[k];

			var txt = txtTemplate.clone();
			txt.text = t;

			var btn = new buttonL(1, [txt, "center", "middle"], [0.8, 0.8]);
			btn.y = k * (btn.getHeight() + 20);
			s.btnLayer.addChild(btn);

			if (k == 0) {
				btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
					s.remove();

					addOptionInterface();
				});
			} else if (k == 1) {
				btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
					s.remove();

					addHelpInterface();
				});
			} else if (k == 2) {
				btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
					s.remove();

					addAboutInterface();
				});
			}
		}

		s.btnLayer.x = (LGlobal.width - s.btnLayer.getWidth()) * 0.5;
		s.btnLayer.y = (LGlobal.height - s.btnLayer.getHeight()) * 0.7;
	};

	return menuL;
})();