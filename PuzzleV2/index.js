let emptyTileRow = 1;
let emptyTileCol = 1;
let cellDisplacement = "70px";
let goal_arr = [
	[1, 2],
	[3, 0]
];
let heur = "man";

let isWin = false;
let isShuffle = false;

function moveTile() {
	let pos = $(this).attr('data-pos');
	let posRow = parseInt(pos.split(',')[0]);
	let posCol = parseInt(pos.split(',')[1]);

	// Move tile down
	if (posRow + 1 == emptyTileRow && posCol == emptyTileCol) {

		$(this).animate({
			'top': "+=" + cellDisplacement
		});

		$('#empty').animate({
			'top': "-=" + cellDisplacement
		});

		emptyTileRow -= 1;
		$(this).attr('data-pos', (posRow + 1) + "," + posCol);
	}

	// Move tile up
	if (posRow - 1 == emptyTileRow && posCol == emptyTileCol) {

		$(this).animate({
			'top': "-=" + cellDisplacement
		});

		$('#empty').animate({
			'top': "+=" + cellDisplacement
		});

		emptyTileRow += 1;
		$(this).attr('data-pos', (posRow - 1) + "," + posCol);
	}

	// Move tile right
	if (posRow == emptyTileRow && posCol + 1 == emptyTileCol) {

		$(this).animate({
			'right': "-=" + cellDisplacement // move right
		});

		$('#empty').animate({
			'right': "+=" + cellDisplacement // move left
		});

		emptyTileCol -= 1;
		$(this).attr('data-pos', posRow + "," + (posCol + 1));
	}

	// Move tile left
	if (posRow == emptyTileRow && posCol - 1 == emptyTileCol) {

		$(this).animate({
			'right': "+=" + cellDisplacement
		});

		$('#empty').animate({
			'right': "-=" + cellDisplacement
		});

		emptyTileCol += 1;
		$(this).attr('data-pos', posRow + "," + (posCol - 1));
	}

	$('#empty').attr('data-pos', emptyTileRow + "," + emptyTileCol);

	if (!isShuffle) checkWinState();
}

$('.start .cell').click(moveTile);
window.onkeydown = function (e) {
	const emptyCell = getEmptyCell();
	const posString = (emptyCell.getAttribute('data-pos'));
	const posRow = parseInt(posString.split(',')[0]);
	const posCol = parseInt(posString.split(',')[1]);

	// move to left
	if (e.keyCode === 37) {
		if (posCol == 1) return;
		const nextElement = getCellByPosition(posRow, posCol + 1);

		$(nextElement).animate({
			'right': "+=" + cellDisplacement
		});

		$('#empty').animate({
			'right': "-=" + cellDisplacement
		});


		emptyTileCol += 1;
		$(nextElement).attr('data-pos', posRow + "," + (posCol));
	}

	// move to right
	if (e.keyCode === 39) {
		if (posCol == 0) return;
		const nextElement = getCellByPosition(posRow, posCol - 1);


		$(nextElement).animate({
			'right': "-=" + cellDisplacement // move right
		});

		$('#empty').animate({
			'right': "+=" + cellDisplacement // move left
		});

		emptyTileCol -= 1;
		$(nextElement).attr('data-pos', posRow + "," + (posCol));
	}

	// move to top
	if (e.keyCode === 38) {
		if (posRow == 1) return;
		const nextElement = getCellByPosition(posRow + 1, posCol);


		$(nextElement).animate({
			'top': "-=" + cellDisplacement
		});

		$('#empty').animate({
			'top': "+=" + cellDisplacement
		});

		emptyTileRow += 1;
		$(nextElement).attr('data-pos', (posRow) + "," + posCol);
	}

	// move to bottom
	if (e.keyCode === 40) {
		if (posRow == 0) return;
		const nextElement = getCellByPosition(posRow - 1, posCol);


		$(nextElement).animate({
			'top': "+=" + cellDisplacement
		});

		$('#empty').animate({
			'top': "-=" + cellDisplacement
		});

		emptyTileRow -= 1;
		$(nextElement).attr('data-pos', (posRow) + "," + posCol);
	}

	$('#empty').attr('data-pos', emptyTileRow + "," + emptyTileCol);
	if (!isShuffle) checkWinState();

}



function getEmptyCell() {
	return document.getElementById('empty');
}

function getCellByPosition(posX, posY) {
	return document.querySelector(`.cell[data-pos="${posX},${posY}"]`);
}


/**
 * Constructor of class Node
 * @class
 * @constructor
 * @param {int} value - represents  `f(x)`
 * @param {ANode} state - represents  the state of the board as a 2D array
 * @param {int} emptyRow - represents  empty row no.
 * @param {int} emptyCol - represents  empty column no.
 * @param {int} depth 
 */
function ANode(value, state, emptyRow, emptyCol, depth) {
	this.value = value;
	this.state = state;
	this.emptyCol = emptyCol;
	this.emptyRow = emptyRow;
	this.depth = depth;
	this.strRepresentation = "";
	this.path = "";
	this.size = this.state.length;

	for (let i = 0; i < state.length; i++) {
		for (let j = 0; j < state[i].length; j++) {
			this.strRepresentation += state[i][j] + ",";
		}

	}

	console.log("this.strRepresentation", this.strRepresentation);
	console.log("chekcing type of init array: " + typeof (this.strRepresentation));
}

/**
* Constructor of class A-Star
* @param {ANode} initial
* @param {ANode} goal
* @param {int} empty
**/
function AStar(initial, goal, empty) {
	this.initial = initial;
	this.goal = goal;
	this.empty = empty;
	this.queue = new PriorityQueue({
		comparator: function (a, b) {
			if (a.value > b.value) return 1;
			if (a.value < b.value) return -1;
			return 0;

		}
	});
	this.queue.queue(initial);
	this.visited = new HashSet();
}

AStar.prototype.execute = function () {
	this.visited.add(this.initial.strRepresentation);
	while (this.queue.length > 0) {
		let current = this.queue.dequeue();
		if (current.strRepresentation == this.goal.strRepresentation) {
			console.log("Solution found!");
			return current;
		}
		this.expandNode(current);
	}
}

AStar.prototype.expandNode = function (node) {
	let temp;
	let newState;
	let col = node.emptyCol;
	let row = node.emptyRow;
	let newNode;

	// Up
	if (row > 0) {
		newState = node.state.clone()
		temp = newState[row - 1][col];
		newState[row - 1][col] = this.empty;
		newState[row][col] = temp;
		newNode = new ANode(0, newState, row - 1, col, node.depth + 1);

		if (!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode);
			newNode.path = node.path + "U";
			this.queue.queue(newNode);
			this.visited.add(newNode.strRepresentation);
		}
	}

	// Down
	if (row < node.size - 1) {
		newState = node.state.clone();
		temp = newState[row + 1][col];
		newState[row + 1][col] = this.empty;
		newState[row][col] = temp;
		newNode = new ANode(0, newState, row + 1, col, node.depth + 1);

		if (!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode);
			newNode.path = node.path + "D";
			this.queue.queue(newNode);
			this.visited.add(newNode.strRepresentation);
		}
	}

	// Left
	if (col > 0) {
		newState = node.state.clone();
		temp = newState[row][col - 1];
		newState[row][col - 1] = this.empty;
		newState[row][col] = temp;
		newNode = new ANode(0, newState, row, col - 1, node.depth + 1);

		if (!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode);
			newNode.path = node.path + "L";
			this.queue.queue(newNode);
			this.visited.add(newNode.strRepresentation);
		}
	}

	// Right
	if (col < node.size - 1) {
		newState = node.state.clone();
		temp = newState[row][col + 1];
		newState[row][col + 1] = this.empty;
		newState[row][col] = temp;
		newNode = new ANode(0, newState, row, col + 1, node.depth + 1);

		if (!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode);
			newNode.path = node.path + "R";
			this.queue.queue(newNode);
			this.visited.add(newNode.strRepresentation);
		}
	}
}

Array.prototype.clone = function () {
	return JSON.parse(JSON.stringify(this));
}

AStar.prototype.heuristic = function (node) {
	return this.manhattanDistance(node);
}

function getCurrentTileState() {
	tileState = [[], []];

	$(".start .cell").each(function (i, obj) {
		temp_pos = $(this).attr("data-pos");
		i = parseInt(temp_pos.split(',')[0]);
		j = parseInt(temp_pos.split(',')[1]);
		val_str = ($(this).find("span").text() != '') ? parseInt($(this).find("span").text()) : 0;
		tileState[i][j] = val_str;
	});

	return tileState;
}

function start() {
	isWin = false;
	step = 0;
	emptyPos = $("#empty").attr("data-pos");
	emptyTileRow = parseInt(emptyPos.split(',')[0]);
	emptyTileCol = parseInt(emptyPos.split(',')[1]);

	initial_arr = getCurrentTileState();
	console.log("chekcing init: " + initial_arr);

	let init = new ANode(0, initial_arr, emptyTileRow, emptyTileCol, 0);
	let goal = new ANode(0, goal_arr, 1, 1, 0);
	let astar = new AStar(init, goal, 0);

	let startTime = new Date();
	let result = astar.execute();
	let endTime = new Date();
	alert("Completed in " + (endTime - startTime) + "milliseconds.");
	let panel = document.getElementById('panel');
	panel.innerHTML = "Solution: " + result.path + " Total steps: " + result.path.length + "<br />";
	solution = result.path;
}

AStar.prototype.manhattanDistance = function (node) {
	let result = 0;

	for (let i = 0; i < node.state.length; i++) {
		for (let j = 0; j < node.state[i].length; j++) {
			let elem = node.state[i][j];
			let found = false;
			for (let h = 0; h < this.goal.state.length; h++) {
				for (let k = 0; k < this.goal.state[h].length; k++) {
					if (this.goal.state[h][k] == elem) {
						result += Math.abs(h - i) + Math.abs(j - k);
						found = true;
						break;
					}
				}
				if (found) break
			}
		}
	}

	return result;
}

step = 0;
function showSolution() {
	let move = '';
	if (!solution) return;
	if (step < solution.length) {

		switch (solution[step]) {
			case "R":
				move = (emptyTileRow).toString() + ',' + (emptyTileCol + 1).toString();
				break;
			case "L":
				move = (emptyTileRow).toString() + ',' + (emptyTileCol - 1).toString();
				break;
			case "U":
				move = (emptyTileRow - 1).toString() + ',' + (emptyTileCol).toString();
				break;
			case "D":
				move = (emptyTileRow + 1).toString() + ',' + (emptyTileCol).toString();
				break;
		}
		$("div[data-pos='" + move + "']").click();
		panel.innerHTML += 'Step: ' + step + ' -> ' + solution[step] + ',';
		step++;
	}
}

function shuffle(array) {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

function movementMap(dataPos) {
	if (dataPos === "0,0") return ["0,1", "1,0"];
	if (dataPos === "0,1") return ["0,0", "1,1"];
	if (dataPos === "1,0") return ["0,0", "1,1"];
	if (dataPos === "1,1") return ["0,1", "1,0"];

	return [];
}

function roundToNearest70(value) {
	let numericValue = parseFloat(value); // Extract numeric part
	let roundedValue = Math.round(numericValue / 70) * 70; // Round to nearest multiple of 70
	return roundedValue + "px";
}

function alignTiles() {
	$(".start .cell").each(function (i, obj) {
		let style = window.getComputedStyle(this);

		let topValue = style.getPropertyValue("top");
		let rightValue = style.getPropertyValue("right");

		this.style.top = roundToNearest70(topValue);
		this.style.right = roundToNearest70(rightValue);

	});
}

function shuffleTiles() {

	let shuffleCounter = 0;
	isShuffle = true;
	isWin = false;
	step = 0;
	while (shuffleCounter < 5) {
		const emptyPos = $("#empty").attr("data-pos");
		const validTiles = movementMap(emptyPos);
		const randomPos = validTiles[Math.floor(Math.random() * validTiles.length)];
		shuffleCounter++;
		$("div[data-pos='" + randomPos + "']").click();
	}
	isShuffle = false;

	alignTiles();
}

function checkWinCondition() {
	let tilePos = getCurrentTileState();
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 2; j++) {
			if (tilePos[i][j] != goal_arr[i][j]) return false;
		}
	}
	return true;
}

function checkWinState() {
	isWin = checkWinCondition();
	if (isWin == true) {
		console.log("Win!!!");
	}
}