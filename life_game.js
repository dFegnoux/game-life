lifeGame = {
	stopInterval: true,
	previousTable: [],
	currentTable: [],
	totalTurns:0,
	_defaults: {
		tableSize: 20,
		aliveClass: "alive",
		speed: 50
	},
	_init: function(options){
		this.options = $.extend({}, this._defaults, options);
		this.createTable(this.options.tableSize);

		var btnStart = document.getElementById('btn-start');
		var btnStop = document.getElementById('btn-stop');
		var btnNext = document.getElementById('btn-next');
		var btnClear = document.getElementById('btn-clear');
		
		btnStart.addEventListener('click', function() {
			this.stopInterval = false;
			this.lifeStart(this.options.speed);
		}.bind(this));

		btnStop.addEventListener('click', function() {
			console.log('### Life stopped ###');
			this.stopInterval = true;
		}.bind(this));

		btnNext.addEventListener('click', function() {
			this.nextTurn();
		}.bind(this));

		btnClear.addEventListener('click', function() {
			this.clearLife();
		}.bind(this));
	},
	createTable: function(tableSize) {
		var self = this;
		var table = document.createElement('table');
		for(var x = 1; x <= tableSize; x++){
			var line = document.createElement('tr');
			self.currentTable[x] = [];
			for(var y = 1; y <= tableSize; y++){
				var cell = document.createElement('td');
				cell.dataset.x = x;
				cell.dataset.y = y;
				self.currentTable[x][y] = cell;
				cell.addEventListener('click', function() {
					self.toggleCellStatus(this.dataset.x, this.dataset.y);
				});
				line.appendChild(cell);
			}
			table.appendChild(line);
		}
		document.getElementById('life-container').appendChild(table);
	},
	clearLife: function() {
		this.previousTable = [];
		this.currentTable  = [];
		this.stopInterval = true;
		this.totalTurns = 0;
		document.getElementById('life-container').innerHTML = "";
		this.createTable(this.options.tableSize);
	},
	toggleCellStatus: function(x, y) {
		var cell = this.currentTable[x][y];
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
		this.totalTurns++;
		if(this.stopInterval){
			console.log("Life stopped on turn #"+this.totalTurns);
		}
		// Stop simulation if previous state is the same of current
		if(this.previousTable === this.currentTable){
			//this.stopInterval = true;
		}
		this.previousTable = this.currentTable;
		for(var x = 1; x <= this.options.tableSize; x++){
			for(var y = 1; y <= this.options.tableSize; y++){
				this.checkNeighbour(x,y);
			}
		}
	},
	checkNeighbour: function(x, y) {
		var nbNeighbour = 0;
		for(var i=-1; i<= 1; i++){
			for(var j=-1; j<= 1; j++){
				if(((x+i) > 0 && (x+i) < this.options.tableSize) && ((y+j) > 0 && (y+j) < this.options.tableSize) && !(x+i === x && y+j === y)){
					if(this.previousTable[x+i][y+j].className === "alive") {
						nbNeighbour++;
					}
				}
			}
		}
		if(this.previousTable[x][y].className === "alive" && (nbNeighbour < 2 || nbNeighbour > 3) ){
				this.currentTable[x][y].className = "";
		}
		if(nbNeighbour === 3){
			this.currentTable[x][y].className = "alive";
		}
	}
}

lifeGame._init({tableSize: 20});