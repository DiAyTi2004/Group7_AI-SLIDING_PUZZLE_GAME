var emptyTileRow = 1;
var emptyTileCol = 2;
var cellDisplacement = "70px";
var goal_arr = [
	[1, 2, 3, 4, 5],
	[6, 7, 8, 9, 10],
	[11, 12, 13, 14, 15],
	[16, 17, 18, 19, 20],
	[21, 22, 23, 24, 0]
];
heur = "man";

isWin = false;
isShuffle = false;

function moveTile() {
	var pos = $(this).attr('data-pos');
	var posRow = parseInt(pos.split(',')[0]);
	var posCol = parseInt(pos.split(',')[1]);

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
		if (posCol == 4) return;
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
		if (posRow == 4) return;
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

	for (var i = 0; i < state.length; i++) {
		if (state[i].length != state.length) {
			alert("No. of rows differ from no.of columns");
			return false;
		}

		for (var j = 0; j < state[i].length; j++) {
			this.strRepresentation += state[i][j] + ",";
		}

		this.size = this.state.length;
	}
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
		var current = this.queue.dequeue();
		if (current.strRepresentation == this.goal.strRepresentation) {
			console.log("Solution found!");
			return current;
		}
		this.expandNode(current);
	}
}

AStar.prototype.expandNode = function (node) {
	var temp;
	var newState;
	var col = node.emptyCol;
	var row = node.emptyRow;
	var newNode;

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
		newNode = new ANode(0, newState, row + 1, col, node.depth);

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
	tileState = [[], [], [], [], []];

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

	var init = new ANode(0, initial_arr, emptyTileRow, emptyTileCol, 0);
	var goal = new ANode(0, goal_arr, 4, 4, 0);
	var astar = new AStar(init, goal, 0);

	var startTime = new Date();
	var result = astar.execute();
	var endTime = new Date();
	alert("Completed in " + (endTime - startTime) + "milliseconds.");
	var panel = document.getElementById('panel');
	panel.innerHTML = "Solution: " + result.path + " Total steps: " + result.path.length + "<br />";
	solution = result.path;
}

AStar.prototype.manhattanDistance = function (node) {
	var result = 0;

	for (var i = 0; i < node.state.length; i++) {
		for (var j = 0; j < node.state[i].length; j++) {
			var elem = node.state[i][j];
			var found = false;
			for (var h = 0; h < this.goal.state.length; h++) {
				for (var k = 0; k < this.goal.state[h].length; k++) {
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
	var move = '';
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
	if (dataPos == "0,0") return ["0,1", "1,0"];
	if (dataPos == "0,1") return ["0,0", "0,2", "1,1"];
	if (dataPos == "0,2") return ["0,1", "0,3", "1,2"];
	if (dataPos == "0,3") return ["0,2", "0,4", "1,3"];
	if (dataPos == "0,4") return ["0,3", "1,4"];

	if (dataPos == "1,0") return ["0,0", "1,1", "2,0"];
	if (dataPos == "1,1") return ["0,1", "1,0", "1,2", "2,1"];
	if (dataPos == "1,2") return ["0,2", "1,1", "1,3", "2,2"];
	if (dataPos == "1,3") return ["0,3", "1,2", "1,4", "2,3"];
	if (dataPos == "1,4") return ["0,4", "1,3", "2,4"];

	if (dataPos == "2,0") return ["1,0", "2,1", "3,0"];
	if (dataPos == "2,1") return ["1,1", "2,0", "2,2", "3,1"];
	if (dataPos == "2,2") return ["1,2", "2,1", "2,3", "3,2"];
	if (dataPos == "2,3") return ["1,3", "2,2", "2,4", "3,3"];
	if (dataPos == "2,4") return ["1,4", "2,3", "3,4"];

	if (dataPos == "3,0") return ["2,0", "3,1", "4,0"];
	if (dataPos == "3,1") return ["2,1", "3,0", "3,2", "4,1"];
	if (dataPos == "3,2") return ["2,2", "3,1", "3,3", "4,2"];
	if (dataPos == "3,3") return ["2,3", "3,2", "3,4", "4,3"];
	if (dataPos == "3,4") return ["2,4", "3,3", "4,4"];

	if (dataPos == "4,0") return ["3,0", "4,1"];
	if (dataPos == "4,1") return ["3,1", "4,0", "4,2"];
	if (dataPos == "4,2") return ["3,2", "4,1", "4,3"];
	if (dataPos == "4,3") return ["3,3", "4,2", "4,4"];
	if (dataPos == "4,4") return ["3,4", "4,3"];

	return [];
}

function roundToNearest70(value) {
	var numericValue = parseFloat(value); // Extract numeric part
	var roundedValue = Math.round(numericValue / 70) * 70; // Round to nearest multiple of 70
	return roundedValue + "px";
}

function alignTiles() {
	$(".start .cell").each(function (i, obj) {
		var style = window.getComputedStyle(this);

		var topValue = style.getPropertyValue("top");
		var rightValue = style.getPropertyValue("right");

		this.style.top = roundToNearest70(topValue);
		this.style.right = roundToNearest70(rightValue);

	});
}

function shuffleTiles() {
	var shuffleCounter = 0;
	var lastShuffled;
	isShuffle = true;
	isWin = false;
	step = 0;
	while (shuffleCounter < 20) {
		emptyPos = $("#empty").attr("data-pos");
		validTiles = movementMap(emptyPos);
		randomPos = validTiles[Math.floor(Math.random() * validTiles.length)];
		if (lastShuffled != randomPos) {
			shuffleCounter++;
			lastShuffled = randomPos;
			$("div[data-pos='" + randomPos + "']").click();

		}
	}
	isShuffle = false;

	alignTiles();
}

function checkWinCondition() {
	var tilePos = getCurrentTileState();
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
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