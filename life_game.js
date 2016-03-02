lifeGame = {
	stopInterval: true,
	currentTable: [],
	lifeContainer: null,
	txtTotalTurns: null,
	totalTurns:0,
	btns: {},
	speed: 100,
	maxMortality: 0,
	mouseIsDown: false,
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
		},
		mortalityColors: {
			min: [225, 225, 225],
			max: [0, 0, 0]
		}
	},
	_init: function(options){
		this.options = this._extend(this._defaults, options);
		this.baseColorPercent = this.options.mortalityColors.min.map(function(min, index) {
			return min-this.options.mortalityColors.max[index];
		}.bind(this));
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
		document.addEventListener('mousedown', function(e) {
			this.mouseIsDown = true;
			var cell = e.target;
			if(cell.tagName.toLowerCase() === 'td'){
				this.toggleCellStatus(cell);
			}
		}.bind(this));


		document.addEventListener('mouseup', function(e) {
			this.mouseIsDown = false;
		}.bind(this));

		this.setDragEvent();

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
	setDragEvent: function() {
		if(this.options.dragToToggle){
			var cells = document.querySelectorAll('td');
			for(var i = 0; i < cells.length; i++){
				var cell = cells[i];
				cell.addEventListener('mouseenter', function(e) {
					if(this.mouseIsDown){
						var cell = e.target;
						if(cell.tagName.toLowerCase() === 'td'){
							if(!this.isAlive(cell)){
								this.toggleCellStatus(cell);
							}
						}
					}
				}.bind(this));
			}
		}
	},
	createTable: function() {
		var self = this;
		var table = document.createElement('table');
		for(var x = 1; x <= this.options.tableSize; x++){
			var line = document.createElement('tr');
			self.currentTable[x] = [];
			for(var y = 1; y <= this.options.tableSize; y++){
				var cell = document.createElement('td');
				cell.dataset.x = x;
				cell.dataset.y = y;
				cell.dataset.nbDeaths = 0;
				cell.dataset.nextstate = null;
				self.currentTable[x][y] = cell;
				line.appendChild(cell);
			}
			table.appendChild(line);
		}
		this.lifeContainer.appendChild(table);
		this.setDragEvent();
	},
	clearLife: function() {
		this.currentTable = [];
		this.lifeContainer.innerHTML = "";
		this.stopInterval = true;
		this.totalTurns = 0;
		var table = document.getElementsByTagName('td');
		for(var cell in table){
			table[cell].className ="";
		}
		if(this.txtTotalTurns){
			this.txtTotalTurns.innerHTML = this.totalTurns;
		}
		this.createTable();
	},
	toggleCellStatus: function(cell) {
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
			else{
				if(!this.txtTotalTurns){
					this.showAllMortalityRate();
					alert('Life stopped at turn #'+this.totalTurns);
				}
			}
		}.bind(this), this.speed);
	},
	nextTurn: function() {
		for(var x = 1; x <= this.options.tableSize; x++){
			for(var y = 1; y <= this.options.tableSize; y++){
				this.checkNeighbour(x,y);
			}
		}
		this.applyNextState();
	},
	checkNeighbour: function(x, y) {
		var nbNeighbour = 0;
		var cell = this.currentTable[x][y];
		for(var i=-1; i<= 1; i++){
			for(var j=-1; j<= 1; j++){
				if(((x+i) > 0 && (x+i) < this.options.tableSize) && ((y+j) > 0 && (y+j) < this.options.tableSize) && !(x+i === x && y+j === y)){
					if(this.currentTable[x+i][y+j].className === this.options.aliveClass) {
						nbNeighbour++;
					}
				}
			}
		}
		// Lets considerate that next default value of an alive cell is alive
		if(this.isAlive(cell)){
			cell.dataset.nextstate = this.options.aliveClass;
		}

		if(nbNeighbour < 2 || nbNeighbour > 3){
			cell.dataset.nextstate = "";
			if(this.isAlive(cell)){
				cell.dataset.nbDeaths++;
			}
		}
		if(nbNeighbour === 3){
			cell.dataset.nextstate = this.options.aliveClass;
		}
		this.updateCellColor(cell);
	},
	applyMortalityRate: function(cell) {
		var percent = cell.dataset.nbDeaths / this.maxMortality;
		if(parseInt(cell.dataset.nbDeaths, 10) > -1){
			var newColor = this.options.mortalityColors.max.map(function(max, key) {
				return  parseInt((this.baseColorPercent[key] * (1-percent)) + max);
			}.bind(this));
			cell.dataset.mortalityColor = "rgb("+newColor.join(',')+")";
		}
		// Apply color if active
		if(this.isAlive(cell) && cell.dataset.mortalityColor){
			cell.style.backgroundColor = cell.dataset.mortalityColor;
		}
		else {
			cell.style.backgroundColor = "transparent";
		}
	},
	updateCellColor: function(cell) {
		if(parseInt(cell.dataset.nbDeaths, 10) > parseInt(this.maxMortality, 10)) {
			this.maxMortality = cell.dataset.nbDeaths;
		}
	},
	isAlive: function(cell) {
		return cell.className === this.options.aliveClass;
	},
	applyNextState: function() {
		var toChangeState = document.querySelectorAll('[data-nextstate]');
		[].forEach.call(toChangeState, function(cell) {
			cell.className = cell.dataset.nextstate;
			this.applyMortalityRate(cell);
			delete cell.dataset.nextstate;
		}.bind(this));
	},
	incrementTurn: function() {
		this.totalTurns++;
		if(this.txtTotalTurns){
			this.txtTotalTurns.innerHTML = this.totalTurns;
		}
	},
	showAllMortalityRate: function(){
		var toSetAlive = document.getElementsByTagName('TD');
		for (var key in toSetAlive) {
			if(toSetAlive[key].dataset && parseInt(toSetAlive[key].dataset.nbDeaths, 10)) {
				toSetAlive[key].className = this.options.aliveClass;
				this.applyMortalityRate(toSetAlive[key]);
			}
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