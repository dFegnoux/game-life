# game-life

A simple life game in javascript.

There is for now a few actions and options:

**Installation :**
- Set a div to contain life game
`<div id="game-container"></div>`

- Join life_game.js to your html
`<script src="life_game.js"></script>`

- Launch life game
`lifeGame._init({ gameContainer: 'div-whitch-contain-game' });`

Here is the few options enabled for now:

```
{
	tableSize: [Integer], // Int > 0, 20 by default
	gameContainer: [String], // Id of the game container
	aliveClass: [String], // Class name that you want to use "alive" by default
	dragToToggle: [Bool] // Enable or not the drag function, default is true
	btnsList: [Array], // List of all buttons, available buttons are 'speed', 'start', 'stop', 'next' and 'clear'
	speedOptions: {
		default: [Integer],	// Default value of millisecond between turns
		min: [Integer],	// Minimum value for the slider
		max: [Integer] // Maximum value for the slider
	},
}
```

**TODO :**
- Refactor code
- Use more options to customize the game
- Detect when previous and current states are the same to automaticaly stop simulation