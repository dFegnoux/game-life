lifeGame = {
	stopInterval: true,
	currentTable: [],
	lifeContainer: null,
	txtTotalTurns: null,
	totalTurns:0,
	btns: {},
	speed: 0,
	_defaults: {
		tableSize: 20,
		gameContainer: null,
		dragToToggle: true,
		aliveClass: "alive",
		btnsList: ['speed', 'start', 'stop', 'next', 'clear'],
		speedOptions: {
			default: 100,
			min: 1,
			max: 3000
		}
	},
	_init: function(options){
		this.options = this._extend(this._defaults, options);
		this._createInterface();
		this._setEvents();
		this.txtTotalTurns = document.getElementById('turn-counter');
	},
	_createInterface: function() {
		if(this.options.gameContainer) {
			var bottomContainer = document.createElement('div');
			bottomContainer.className = 'bottom';
			var actionsContainer = document.createElement('div');
			actionsContainer.className = 'actions';
			this.options.btnsList.forEach(function(btnName) {
				if(btnName === 'speed') {
					var unit = 'ms';
					var speedContainer = document.createElement('div');
					
					var minLabel = document.createElement('label');
					minLabel.innerHTML = this.options.speedOptions.min+' '+unit;
					var maxLabel = document.createElement('label');
					maxLabel.innerHTML = this.options.speedOptions.max+' '+unit;
					this.btns.speed = document.createElement('input');
					this.btns.speed.type = 'range';
					this.btns.speed.min = this.options.speedOptions.min;
					this.btns.speed.max = this.options.speedOptions.max;
					this.btns.speed.value = this.options.speedOptions.default;
					speedContainer.appendChild(minLabel);
					speedContainer.appendChild(this.btns.speed);
					speedContainer.appendChild(maxLabel);
					actionsContainer.appendChild(speedContainer);
				}
				else{
					this.btns[btnName] = document.createElement('button');
					this.btns[btnName].innerHTML = btnName;
					actionsContainer.appendChild(this.btns[btnName]);
				}
			}.bind(this));
			bottomContainer.appendChild(actionsContainer);
			this.lifeContainer = document.createElement('div');
			this.lifeContainer.id = 'life-container';
			this.options.gameContainer.appendChild(this.lifeContainer);
			this.options.gameContainer.appendChild(bottomContainer);
			this.createTable();
		}
	},
	_setEvents: function() {
		this.lifeContainer.addEventListener('click', function(e) {
			var cell = e.target;
			if(cell.tagName.toLowerCase() === 'td'){
				this.toggleCellStatus(cell.dataset.x, cell.dataset.y);
			}
		}.bind(this));

		if(this.options.dragToToggle){
			this.lifeContainer.addEventListener('dragenter', function(e) {
				var cell = e.target;
				if(cell.tagName.toLowerCase() === 'td'){
					this.toggleCellStatus(cell.dataset.x, cell.dataset.y);
				}
			}.bind(this));
		}

		if(this.btns.start){
			this.btns.start.addEventListener('click', function() {
				this.stopInterval = false;
				this.lifeStart();
			}.bind(this));
		}

		if(this.btns.stop){
			this.btns.stop.addEventListener('click', function() {
				this.stopInterval = true;
			}.bind(this));
		}

		if(this.btns.stop){
			this.btns.next.addEventListener('click', function() {
				this.nextTurn();
			}.bind(this));
		}

		if(this.btns.stop){
			this.btns.clear.addEventListener('click', function() {
				this.clearLife();
			}.bind(this));
		}

		if(this.btns.speed){
			this.btns.speed.addEventListener('change', function(e) {
				this.speed = e.target.value;
			}.bind(this));
		}
	},
	createTable: function() {
		var self = this;
		var table = document.createElement('table');
		for(var x = 1; x <= this.options.tableSize; x++){
			var line = document.createElement('tr');
			self.currentTable[x] = [];
			console.log(this.options.tableSize);
			for(var y = 1; y <= this.options.tableSize; y++){
				var cell = document.createElement('td');
				cell.dataset.x = x;
				cell.dataset.y = y;
				self.currentTable[x][y] = cell;
				line.appendChild(cell);
			}
			table.appendChild(line);
		}
		console.log('toto', table);
		this.lifeContainer.appendChild(table);
	},
	clearLife: function() {
		this.currentTable = [];
		this.lifeContainer.innerHTML = "";
		this.stopInterval = true;
		this.totalTurns = 0;
		var table = document.getElementsByTagName('td');
		for(cell in table){
			table[cell].className ="";
		}
		if(this.txtTotalTurns){
			this.txtTotalTurns.innerHTML = this.totalTurns;
		}
		this.createTable();
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
			console.log(this.speed);
			this.incrementTurn();
			if(!this.stopInterval){
				this.nextTurn();
				this.lifeStart();
			}
			else{
				if(!this.txtTotalTurns){
					alert('Life stopped at turn #'+this.totalTurns);
				}
			}
		}.bind(this), this.speed);
	},
	nextTurn: function() {
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
		if(this.txtTotalTurns){
			this.txtTotalTurns.innerHTML = this.totalTurns;
		}
	},
	_extend : function(a, b){
	    for(var key in b)
	        if(b.hasOwnProperty(key))
	            a[key] = b[key];
	    return a;
	}
};

lifeGame._init({
	gameContainer: document.getElementById('game-container'),
	tableSize: 40
});