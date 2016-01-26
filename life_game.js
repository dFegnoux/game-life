lifeGame = {
	stopInterval: true,
	previousTable: [],
	currentTable: [],
	_defaults: {
		tableSize: 20,
		aliveClass: "alive",
		speed: 1000
	},
	_init: function(options){
		this.options = $.extend({}, this._defaults, options);
		this.createTable(this.options.tableSize);

		var btnStart = document.getElementById('btn-start');
		var btnStop = document.getElementById('btn-stop');
		var speed = document.getElementById('input-speed');
		if(speed.value && typeof speed.value === "number"){
			this.options.speed = speed.value;
		}
		btnStart.addEventListener('click', function(){
			this.stopInterval = false;
			this.lifeStart(this.options.speed);
		}.bind(this));

		btnStop.addEventListener('click', function(){
			console.log('### Life stopped ###');
			this.stopInterval = true;
		}.bind(this));
	},
	createTable: function(tableSize){
		var self = this;
		var table = document.createElement('table');
		for(var x = 1; x <= tableSize; x++){
			var line = document.createElement('tr');
			self.currentTable[x] = [];
			for(var y = 1; y <= tableSize; y++){
				self.currentTable[x][y] = "";
				var cell = document.createElement('td');
				cell.dataset.x = x;
				cell.dataset.y = y;
				cell.addEventListener('click', function() {
					self.toggleCellStatus(this);
				});
				line.appendChild(cell);
			}
			table.appendChild(line);
		}
		console.log(self.currentTable);
		document.getElementById('life-container').appendChild(table);
	},
	toggleCellStatus: function(cell) {
		console.log(cell.dataset.x+'-'+cell.dataset.y);
		if(cell.className === "alive"){
			cell.className = "";
		} else {
			cell.className = "alive";
		}
	},
	lifeStart: function(speed) {
		var interval = setInterval(function(){
			if(this.stopInterval){
				clearInterval(interval);
			}
			this.nextTurn();
		}.bind(this), speed);
	},
	nextTurn: function() {
		console.log('### NEW TURN ###');
	}

}

lifeGame._init({tableSize: 20});