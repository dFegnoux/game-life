lifeGame = {
	stopInterval: true,
	currentTable: [],
	totalTurns:0,
	lifeContainer: null,
	txtTotalTurns: null,
	_defaults: {
		tableSize: 20,
		aliveClass: "alive",
		speed: 50
	},
	_init: function(options){
		this.options = this._extend(this._defaults, options);
		this.txtTotalTurns = document.getElementById('turn-counter');
		this.lifeContainer = document.getElementById('life-container');

		this.createTable(this.options.tableSize);

		var btnStart = document.getElementById('btn-start');
		var btnStop = document.getElementById('btn-stop');
		var btnNext = document.getElementById('btn-next');
		var btnClear = document.getElementById('btn-clear');
		var rangeSpeed = document.getElementById('input-speed');
		
		btnStart.addEventListener('click', function() {
			this.stopInterval = false;
			this.lifeStart();
		}.bind(this));

		btnStop.addEventListener('click', function() {
			this.stopInterval = true;
		}.bind(this));

		btnNext.addEventListener('click', function() {
			this.nextTurn();
		}.bind(this));

		btnClear.addEventListener('click', function() {
			this.clearLife();
		}.bind(this));

		rangeSpeed.addEventListener('change', function(e) {
			this.options.speed = e.target.value;
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
		this.lifeContainer.appendChild(table);
	},
	clearLife: function() {
		this.currentTable  = [];
		this.stopInterval = true;
		this.totalTurns = 0;
		this.lifeContainer.innerHTML = "";
		this.txtTotalTurns.innerHTML = this.totalTurns;
		this.createTable(this.options.tableSize);
	},
	toggleCellStatus: function(x, y) {
		var cell = this.currentTable[x][y];
		if(cell.className === this.options.aliveClass){
			cell.className = "";
		} else {
			cell.className = this.options.aliveClass;
		}
	},
	lifeStart: function() {
		window.setTimeout(function(){
			this.incrementTurn();
			if(!this.stopInterval){
				this.nextTurn();
				this.lifeStart();
			}
		}.bind(this), this.options.speed);
	},
	nextTurn: function() {
		this.totalTurns++;
		if(this.stopInterval){
			console.log("Life stopped on turn #"+this.totalTurns);
		}
		for(var x = 1; x <= this.options.tableSize; x++){
			for(var y = 1; y <= this.options.tableSize; y++){
				this.checkNeighbour(x,y);
			}
		}
		this.applyNextState();
	},
	checkNeighbour: function(x, y) {
		var nbNeighbour = 0;
		for(var i=-1; i<= 1; i++){
			for(var j=-1; j<= 1; j++){
				if(((x+i) > 0 && (x+i) < this.options.tableSize) && ((y+j) > 0 && (y+j) < this.options.tableSize) && !(x+i === x && y+j === y)){
					if(this.currentTable[x+i][y+j].className === this.options.aliveClass) {
						nbNeighbour++;
					}
				}
			}
		}
		if(nbNeighbour < 2 || nbNeighbour > 3){
			this.currentTable[x][y].dataset.nextstate = "";
		}
		if(nbNeighbour === 3){
			this.currentTable[x][y].dataset.nextstate = this.options.aliveClass;
		}
	},
	applyNextState: function() {
		var toChangeState = document.querySelectorAll('[data-nextstate]');
		[].forEach.call(toChangeState, function(cell) {
			cell.className = cell.dataset.nextstate;
			delete cell.dataset.nextstate;
		});
	},
	incrementTurn: function() {
		this.totalTurns++;
		this.txtTotalTurns.innerHTML = this.totalTurns;
	},
	_extend : function(a, b){
    for(var key in b)
        if(b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
	}
}

lifeGame._init({
	tableSize: 40,
	speed: 100
});