var ytOptionLayer = (function () {
	function ytOptionLayer () {
		var s = this;
		LExtends(s, LSprite, []);
	
		s.carIndex = 0;
		s.placeIndex = 0;
		s.coins = parseInt(localStorage.getItem('coins')) || 0;
	
		s.carInfoList = [
			{name : "BMW", data : 0, cost: 0},
			{name : "FORD", data : 1, cost: 50},
			{name : "LAMBORGHINI", data : 2, cost: 100},
			{name : "PAGANI", data : 4, cost: 200}
		];
	
		s.placeInfoList = [
			{name : "Kota 1 (Default)", data : "street_canyon", cost: 0},
			{name : "Kota 2", data : "street_city", cost: 20},
			{name : "Kota 3", data : "street_desert", cost: 30},
			{name : "Kota 4", data : "street_grass", cost: 40},
			{name : "Kota 5 ", data : "street_snow", cost: 50},
			// {name : "Jl. Margonda", data : "street_water", cost: 60}
		];
	
		s.unlockedPlaces = { "Kota 1 (Default)": true }; // CANYON sudah terbuka secara default
		s.purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || { "BMW": true }; // Hanya BMW terbuka secara default
	
		var backgroundBmp = new LBitmap(dataList["default_menu_background"]);
		backgroundBmp.scaleX = LGlobal.width / backgroundBmp.getWidth();
		backgroundBmp.scaleY = LGlobal.height / backgroundBmp.getHeight();
		s.addChild(backgroundBmp);
	
		s.carOptionLayer = new LSprite();
		s.addChild(s.carOptionLayer);
	
		s.placeOptionLayer = new LSprite();
		s.addChild(s.placeOptionLayer);
	
		s.addCarOption();
		s.showCoins(); // Panggil fungsi untuk menampilkan koin
	}

	ytOptionLayer.prototype.addCarOption = function () {
		var s = this, carInfoList = s.carInfoList;

		var carBmpd = dataList["menu_car_icons"].clone();
		carBmpd.setProperties(0, 0, carBmpd.width / 2, carBmpd.height / 6);

		for (var k = 0; k < carInfoList.length; k++) {
			var o = carInfoList[k];

			var contentLayer = new LSprite();

			var cBmpd = carBmpd.clone();
			cBmpd.setCoordinate(0, o.data * carBmpd.height);
			var iconBmp = new LBitmap(cBmpd);
			iconBmp.scaleX = iconBmp.scaleY = 0.2;
			contentLayer.addChild(iconBmp);

			var txt = new LTextField();
			txt.text = o.name + (s.purchasedCars[o.name] ? "" : "\n(Locked - " + o.cost + " coins)");
			txt.size = 13;
			txt.color = "white";
			txt.weight = "bold";
			txt.filters = [new LDropShadowFilter(null, null, "white", 15)];
			txt.x = iconBmp.getWidth() + 5;
			txt.y = (iconBmp.getHeight() - txt.getHeight()) / 2;
			contentLayer.addChild(txt);

			contentLayer.x = 20;

			var btn = new buttonL(2, [contentLayer, null, "middle"], [1, 0.6]);
			btn.index = k;
			btn.y = k * (btn.getHeight() + 10);
			s.carOptionLayer.addChild(btn);

			btn.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
				var car = s.carInfoList[e.currentTarget.index];
				if (s.purchasedCars[car.name]) {
					var tax = Math.ceil(car.cost * 0.1);
					if (s.coins >= tax) {
						s.coins -= tax;
						localStorage.setItem('coins', s.coins);
						alert("Pajak sebesar " + tax + " coins telah dibayar untuk menggunakan " + car.name);
						s.carIndex = e.currentTarget.index;
						s.carOptionLayer.removeAllChild();
						s.addPlaceOption();
					} else {
						alert("Anda membutuhkan " + tax + " coins untuk membayar pajak penggunaan " + car.name);
					}
				} else if (s.coins >= car.cost) {
					s.coins -= car.cost;
					localStorage.setItem('coins', s.coins);
					s.purchasedCars[car.name] = true;
					localStorage.setItem('purchasedCars', JSON.stringify(s.purchasedCars));
					alert(car.name + " berhasil dibeli!");
					s.carOptionLayer.removeAllChild();
					s.addCarOption();
				} else {
					alert("Anda membutuhkan " + car.cost + " coins untuk membeli " + car.name);
				}
			});
		}

		s.carOptionLayer.x = (LGlobal.width - s.carOptionLayer.getWidth()) * 0.5;
		s.carOptionLayer.y = (LGlobal.height - s.carOptionLayer.getHeight()) * 0.5;
	};

	ytOptionLayer.prototype.addPlaceOption = function () {
		var s = this, placeInfoList = s.placeInfoList;
		s.showCoins(); // Update jumlah koin
		
		for (var k = 0; k < placeInfoList.length; k++) {
			var o = placeInfoList[k];
		
			var contentLayer = new LSprite();
		
			var cBmpd = dataList[o.data].clone();
			cBmpd.setProperties(0, 0, cBmpd.width, cBmpd.width);
			var iconBmp = new LBitmap(cBmpd);
			iconBmp.scaleX = iconBmp.scaleY = 0.08;
			contentLayer.addChild(iconBmp);
		
			var txt = new LTextField();
			txt.text = o.name + (s.unlockedPlaces[o.name] ? "" : " (Locked - " + o.cost + " coins)");
			txt.size = 15;
			txt.color = "white";
			txt.weight = "bold";
			txt.filters = [new LDropShadowFilter(null, null, "white", 15)];
			txt.x = iconBmp.getWidth() + 20;
			txt.y = (iconBmp.getHeight() - txt.getHeight()) / 2;
			contentLayer.addChild(txt);
		
			contentLayer.x = 18;
		
			var btn = new buttonL(2, [contentLayer, null, "middle"], [1, 0.6]);
			btn.index = k;
			btn.y = k * (btn.getHeight() + 10);
			s.placeOptionLayer.addChild(btn);
		
			btn.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
				var place = s.placeInfoList[e.currentTarget.index];
				if (s.unlockedPlaces[place.name]) {
					s.placeIndex = e.currentTarget.index;
					s.remove();
					addGameInterface(s.carIndex, place.data);
				} else if (s.coins >= place.cost) {
					s.coins -= place.cost;
					localStorage.setItem('coins', s.coins);
					s.unlockedPlaces[place.name] = true;
					alert(place.name + " unlocked!");
					s.placeOptionLayer.removeAllChild();
					s.addPlaceOption();
				} else {
					alert("Maaf anda harus membayar PAJAK JALAN " + place.name + " sebesar " + place.cost + " Coins");
				}
			});
		}
		
		s.placeOptionLayer.x = (LGlobal.width - s.placeOptionLayer.getWidth()) * 0.5;
		s.placeOptionLayer.y = (LGlobal.height - s.placeOptionLayer.getHeight()) * 0.7;
	};
	
	ytOptionLayer.prototype.showCoins = function () {
		var s = this;
		if (s.coinsText) {
			s.coinsText.text = "Coins: " + s.coins;
		} else {
			s.coinsText = new LTextField();
			s.coinsText.text = "Coins: " + s.coins;
			s.coinsText.size = 18;
			s.coinsText.color = "yellow";
			s.coinsText.weight = "bold";
			s.coinsText.filters = [new LDropShadowFilter(null, null, "black", 10)];
			s.coinsText.x = 20;
			s.coinsText.y = 20;
			s.addChild(s.coinsText);
		}
	};

	return ytOptionLayer;
})();
