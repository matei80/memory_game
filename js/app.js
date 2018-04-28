"use strict";
/*
 * Create a list that holds all of your cards
 *
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 *
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// TODO: Add functionality for RELOAD button
//     : Add visual effect on cards match
//     : Add visual effect on cards unmatch

/* ===== VARIABLES ===== */

let currentCard,
    counter,
    openCards,
    matchedCards,
    deckOfCards  = document.querySelector(".deck"),
    movesMade    = document.querySelector(".moves"),
    restartGame  = document.querySelector(".restart");

setGame();

restartGame.addEventListener("click", function(event) {
    setGame();
});

// add a listener to the whole deck of cards
deckOfCards.addEventListener("click", function rollGame(event) {
	currentCard = showSelectedCard(event);
	openCards = addToArray(currentCard, openCards);

	if(openCards.length === 2) {
		if(isSameIcon(openCards)) {
			addToArray(openCards[0], matchedCards);
			addToArray(openCards[1], matchedCards);
			openCards = [];
		} else {
			deckOfCards.removeEventListener("click", rollGame(event));
			setTimeout(function() {
				hideCards(openCards);
				openCards = [];
			}, 300);
		}
		showMovesCount(++counter);
	}

	if(isGameEnd(matchedCards)) {
		setTimeout(function() {
			gameEnd(counter);
		}, 500);
	}
});

/* ===== HELPER FUNCTIONS ===== */

/**
 * Insert a value into an array
 * @param   *   value   Any valid value
 * @param  ARRAY array  Array to add to
 * @return ARRAY        Resulted array
 */
function addToArray(value, array) {
	if(value && array.constructor === Array) {
		array.push(value);
	}
	return array;
}


/**
 * Create a card
 * @param  STRING 	icon  Font Awesome or Glyphicon CSS classes
 *                        as a string using a single space as
 *                        separator if necessary (more than one CSS class)
 * @param  INTEGER	pos   Any integer. If more than a card is created this
 *                        value should be unique.
 * @return OBJECT         DOM element
 */
function createCard(icon, pos) {
	let card, cardIcon;

	card     = createDOMObject("li", { class: "card", id: "card" + pos });
	cardIcon = createDOMObject("i", { class: icon });

	card.appendChild(cardIcon);

	return card;
}

/**
 * Create a new DOM Object
 * @param  STRING tag   	HTML tag name
 * @param  OBJECT options 	HTML element attributes
 * @return OBJECT 			DOM element
 */
function createDOMObject(tag, options = {}) {
	let obj  = document.createElement(tag);
	let keys = null;

	if(options.constructor === Object && Object.keys(options).length > 0) {
		keys = Object.keys(options);

		for(let key of keys) {
			obj.setAttribute(key, options[key]);
		}
	}
	return obj;
}

/**
 * Display a message when the player wins the game
 * that shows the prevision game score and the
 * current game score.
 * @param  INTEGER moves [description]
 * @return VOID       	 [description]
 */
function gameEnd(moves) {
	let name = prompt("Enter your name:");

	if(typeof localStorage != 'undefined') {
		let userData  = [name, moves, new Date()];
		let scoreStat = JSON.parse(localStorage.getItem("memoryGame"));

		localStorage.removeItem("memoryGame");
		localStorage.setItem("memoryGame", JSON.stringify(userData));

		if(scoreStat) {
			alert("Game stats:\nPlayer: " + userData[0] +
					"\nMoves made: " + userData[1] +
					"\nGame date: " + userData[2] +
					"\n\nPrevious game stats:\nPlayer " + scoreStat[0] +
					"\nMoves made: " + scoreStat[1] +
					"\nGame date: " + scoreStat[2]
				);
		}
	} else {
		alert("Thank you for playing with me " + name + ".\nYou've won after " + moves + " moves.");
	}
	alert("To play again, press Reload button. Have fun!");
}

/**
 * Hide cards if don't match
 * @param  ARRAY   array List of valid HTML IDs for elements
 *                       to remove CSS classes from
 * @return VOID
 */
function hideCards(array) {
	let first, second;
	try {
		first  = document.getElementById(array[0]);
		second = document.getElementById(array[1]);

		first.classList.remove("show", "open", "disabled");
		second.classList.remove("show", "open", "disabled");

	} catch(error) {
		"Unable to perform action. Please try to refresh page.";
	}
}

/**
 * Check if all cards were matched
 * @param  ARRAY 	matched All matched cards list
 * @return BOOLEAN         	TRUE if all cards were matched
 *                          FALSE otherwise
 */
function isGameEnd(matched) {
	return (matched.length === 16) ? true : false;
}

/**
 * Check if two cards have same icon
 * @param  ARRAY     array  List of valid HTML elements IDs
 * @return BOOLEANT         TRUE if same CSS classes
 *                          FALSE otherwise
 */
function isSameIcon(array) {
	let first, second;
	try {
		first  = document.getElementById(array[0]).childNodes[0].classList;
		second = document.getElementById(array[1]).childNodes[0].classList;

		return first.toString() === second.toString();
	} catch(error) {
		"Invalid array values. Only strings please.";
	}
	return false;
}


/**
 * Set the game board.
 * @param ARRAY  cards   List of CSS classes used to create card icons
 * @param DOM    newDeck Container for cards
 */
function setGame() {
	let icon, cardIcons, deckOfCards  = document.querySelector(".deck");
	const cards = [
	"fa fa-diamond",
	"fa fa-paper-plane-o",
	"fa fa-anchor",
	"fa fa-bolt",
	"fa fa-cube",
	"fa fa-anchor",
	"fa fa-leaf",
	"fa fa-bicycle",
	"fa fa-diamond",
	"fa fa-bomb",
	"fa fa-leaf",
	"fa fa-bomb",
	"fa fa-bolt",
	"fa fa-bicycle",
	"fa fa-paper-plane-o",
	"fa fa-cube"
	];

	deckOfCards.innerHTML = "";
	counter = 0;
	openCards    = [];
	matchedCards = [];
	movesMade.innerHTML = "0";

	cardIcons   = (cards.constructor === Array) ? shuffle(cards) : null;

	try {
		while(cardIcons.length > 0) {
			icon = cardIcons.pop();
			deckOfCards.appendChild(createCard(icon, cardIcons.length));
		}
		return deckOfCards;
	} catch(error) {
		console.log("Unable to create valid deck of cards.");
	}

}

/**
 * Display the selected card
 * @param  DOM Event  event   The "CLICK" event
 * @return OBJECT             Card that was clicked
 */
function showSelectedCard(event) {
	let card;
	if(event.type === "click" && event.target.tagName === "LI") {
		event.target.classList.add("show", "open", "disabled");
		return event.target.getAttribute("id");
	}
	return;
}

/**
 * Show number of moves made
 * @param  INTEGER value Moves made
 * @return VOID
 */
function showMovesCount(value) {
	movesMade.innerHTML = value;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}