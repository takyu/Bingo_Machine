// global variable
bingoNum = [];
turnCount = 0;

// forbid form clincking website
let screenLock = () => {

	// create "div" of screen lock
	let screen = document.createElement('div');
	screen.id = "screenLock";

	// style "div" of screen lock
	screen.style.height = '100%';
	screen.style.left = '0px';
	screen.style.position = 'fixed';
	screen.style.top = '0px';
	screen.style.width = '100%';
	screen.style.zIndex = '9999';
	screen.style.opacity = '0';

	// insert element into body
	let objBody = document.getElementsByTagName( "body" )[0].appendChild( screen );
};

// release
	let screenRelease = () => {
	let screen = document.getElementById( "screenLock" );
	let screenParent = screen.parentNode;
	screenParent.removeChild( screen );
};

// create a function of dialog
let result = function() {
	let popupResult = document.getElementById( "popupResult" );
	let popupResultContent = document.getElementById( "popupResultContent" );
	let retryButton = document.getElementById( "retry" );
	let resultCount = document.getElementById( "resultCount" );
	popupResult.style.display = "block";
	resultCount.insertAdjacentHTML('afterend', turnCount + '回');
	retryButton.addEventListener( "click", function() {
		window.location.reload();
	})
};

// roulette
let roulette = function() {
	screenLock();
	let count = 0;
	let drumRoll = setInterval(function() {
		let min = 1, max = 75;
		let num = String( createRandomValue( min, max ));
		let num1 = num.slice(1, 2);
		let num10 = num.slice(0, 1);
		let showNumber = document.getElementById( "showNumber" );
		showNumber.rows[0].cells[0].innerHTML = num10;
		showNumber.rows[0].cells[1].innerHTML = num1;
		count++;
		if ( count > 50 && !bingoNum.includes(num) ) {
			turnCount++;
			clearInterval( drumRoll );
			bingoNum.push( num );
			tableNumLoop( num );
			bingoCardsLoop( num );
			screenRelease();
		}
	}, 20);
};

// forbid from pushing button
let forbidButton = function() {
	let turnButton = document.getElementsByTagName( "button" )[0];
	turnButton.disabled = true;
};

// allow to push button
let allowButton = function() {
	let turnButton = document.getElementsByTagName( "button" )[0];
	turnButton.disabled = false;
};

// search roulettte number in "#bingoCards" and color it
let bingoCardsLoop = function( num ) {
	let tableBingoCards = document.getElementById( "bingoCards" );
	tableBingoCards_loop:
	for ( let i = 0, rowLen = tableBingoCards.rows.length; i < rowLen; i++) {
		for ( let j = 0, colLen = tableBingoCards.rows[i].cells.length; j < colLen; j++) {
			let cells = tableBingoCards.rows[i].cells[j];
			let cellContent = cells.innerHTML
			if ( num == cellContent ) {
				cells.style.backgroundColor = "rgba( 255, 102, 51, 0.6 )";
				forbidButton();
				cells.addEventListener( "click", function() {
				cells.style.backgroundColor = "rgba( 255, 102, 51, 1.0 )";
				cells.style.color = "rgba( 255, 102, 51, 1.0 )";
				cells.innerHTML = 0;
				allowButton();
				checkLine();
				}, {
				once: true
				})
				break tableBingoCards_loop;
			}
		}
	}
};

// search roulette number in "#number" and color it
let tableNumLoop = function( num ) {
	let tableNumber = document.getElementById( "number" );
	tableNumber_loop:
	for ( let i = 0, rowLen = tableNumber.rows.length; i < rowLen; i++) {
		for ( let j = 0, colLen = tableNumber.rows[i].cells.length; j < colLen; j++) {
			let cells = tableNumber.rows[i].cells[j];
			let cellContent = cells.innerHTML;
			if ( num == cellContent ) {
				cells.style.backgroundColor = "rgba( 0, 255, 0, 1.0 )"
				break tableNumber_loop;
			}
		}
	}
};

// check lines which are aligned
let checkLine = function() {
	let tableBingoCards = document.getElementById( "bingoCards" );

	// check vertical lines
	for ( let i = 0, rowLen = tableBingoCards.rows.length; i < rowLen; i++ ) {
		let verticalBlank = 0;
		for ( let j = 0, colLen = tableBingoCards.rows[i].cells.length; j < colLen; j++ ) {
		if ( tableBingoCards.rows[j].cells[i].innerHTML == 0 ) {
			verticalBlank++;
		}
		}
		if ( verticalBlank == 5) {
		result();
		}
	}

	// check horizontal lines
	for ( let i = 0, rowLen = tableBingoCards.rows.length; i < rowLen; i++ ) {
		let horizontalBlank = 0;
		for ( let j = 0, colLen = tableBingoCards.rows[i].cells.length; j < colLen; j++ ) {
		if ( tableBingoCards.rows[i].cells[j].innerHTML == 0 ) {
			horizontalBlank++;
		}
		}
		if ( horizontalBlank == 5) {
		result();
		}
	}

	// check diagonal lines of lower left
	let diagonalBlankLl = 0;
	for ( let i = 0, rowLen = tableBingoCards.rows.length; i < rowLen; i++ ) {
		if ( tableBingoCards.rows[i].cells[i].innerHTML == 0 ) {
		diagonalBlankLl++;
		}
		if ( diagonalBlankLl == 5 ) {
		result();
		}
	}

	// check a diagonal line of upper left
	let diagonalBlankUl = 0;
	for ( let i = 0, rowLen = tableBingoCards.rows.length; i < rowLen; i++ ) {
		if ( tableBingoCards.rows[i].cells[4 - i].innerHTML == 0 ) {
		diagonalBlankUl++;
		}
		if ( diagonalBlankUl == 5 ) {
		result();
		}
	}
};

// Return a random integer value between min and max
let createRandomValue = function(min, max) {
	return Math.floor( Math.random() * ( max - min + 1)) + min;
};

// create table of bingo Cards
window.addEventListener( "DOMContentLoaded", function() {
	let tableBingoCards = document.getElementById( "bingoCards" );

	// create elements of tr, td
	for (let i = 0; i < 5; i++ ) {
		let tr = document.createElement( "tr" );
		for (let j = 0; j < 5; j++) {
		let td = document.createElement( "td" );
			tr.appendChild(td);
		}
		tableBingoCards.appendChild(tr);
	}

	/* create random numbers for each column */

	// return a array of a column consisting random numbers
	let createColumnNumber = function( min, max ) {
		let column =[];
		for (let i = 0; i < tableBingoCards.rows.length; i++) {
		while( true ) {
			let tmp = createRandomValue(min, max);
			if( !column.includes(tmp) ) {
			column.push( tmp );
			break;
			}
		}
		}
		return column;
	};

	// first column: from 1 to 15
	let min1 = 1, max1 = 15;
	let firstColumn = createColumnNumber( min1, max1 );
	for (let i = 0; i < firstColumn.length; i++) {
		tableBingoCards.rows[i].cells[0].innerHTML = String( firstColumn[i] );
	}

	// second column: from 16 to 30
	let min2 = 16, max2 = 30;
	let secondColumn = createColumnNumber( min2, max2 );
	for (let i = 0; i < secondColumn.length; i++) {
		tableBingoCards.rows[i].cells[1].innerHTML = String( secondColumn[i] );
	}

	// third column: from 31 to 45
	let min3 = 31, max3 = 45;
	let thirdColumn = createColumnNumber( min3, max3 );
	for (let i = 0; i < thirdColumn.length; i++) {
		tableBingoCards.rows[i].cells[2].innerHTML = String( thirdColumn[i] );
	}

	// fourth column: from 46 to 60
	let min4 = 46, max4 = 60;
	let fourthColumn = createColumnNumber( min4, max4 );
	for (let i = 0; i < fourthColumn.length; i++) {
		tableBingoCards.rows[i].cells[3].innerHTML = String( fourthColumn[i] );
	}

	// fifth column: from 61 to 75
	let min5 = 61, max5 = 75;
	let fifthColumn = createColumnNumber( min5, max5 );
	for (let i = 0; i < fifthColumn.length; i++) {
		tableBingoCards.rows[i].cells[4].innerHTML = String( fifthColumn[i] );
	}

	// create free including function of hidden free, #operatingMethod and appear button of turn
	let free = tableBingoCards.rows[2].cells[2];
	free.setAttribute( "id", "free");
	free.innerHTML = "free"
	free.addEventListener( "click", function() {
		alert( "ゲームスタート！" );
		free.style.color = "rgba( 255, 102, 51, 1.0 )";
		free.innerHTML = 0;
		free.style.backgroundColor = "rgba( 255, 102, 51, 1.0 )";
		document.getElementById( "button" ).style.display = "block";
		document.getElementById( "operatingMethod" ).style.display = "none";
	}, {
		once: true
	})
});

// create table of number from 1 to 75
window.addEventListener( "DOMContentLoaded", function() {
	let tableNumber = document.getElementById( "number" );

	// create elements of tr,td
	for (let i = 0; i < 5; i++ ) {
		let tr = document.createElement( "tr" );
		for (let j = 0; j < 15; j++) {
		let td = document.createElement( "td" );
			tr.appendChild(td);
		}
		tableNumber.appendChild(tr);
	}

	// insert numbers into tableNumber
	for ( let i = 0, rowLen = tableNumber.rows.length; i < rowLen; i++ ) {
		for ( let j = 0, colLen = tableNumber.rows[i].cells.length; j < colLen; j++ ) {
		tableNumber.rows[i].cells[j].innerHTML = ( 15 * i ) + j + 1;
		}
	}
});