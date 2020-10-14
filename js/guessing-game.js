/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
/*

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/
document.getElementById('');
class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
        this.nHintCalls = 0;
        this.hint = [];
    }
    resetGame() {
        this.winningNumber = generateWinningNumber();
        this.pastGuesses = [];
        this.playersGuess = null;
        this.nHintCalls = 0;
        this.hint = [];
        document.querySelector('#guess-feedback > h4').innerHTML = '';
        for (let i = 1; i <= 5; i++) { document.querySelector(`#guess-list li:nth-child(${i})`).innerHTML = '-'; }
        document.getElementById('hint').disabled = true;
        document.getElementById('player-input').disabled = false;
    }
    difference() { return Math.abs(this.playersGuess - this.winningNumber); }
    isLower() { return (this.playersGuess < this.winningNumber); }
    playersGuessSubmission(number) {
        if (typeof (number) !== 'number' || number > 100 || number < 1) { throw 'That is an invalid guess.'; }
        this.playersGuess = number;
        return this.checkGuess();
    }
    checkGuess() {
        let feedbackText = '';
        let pastGuessesOneStepBack = this.pastGuesses.slice(); // .slice() because we don't just want a reference
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length === 5) { feedbackText = 'You Lose.'; }
        let diff = this.difference();
        if (diff < 100) { feedbackText = `You're ice cold!`; }
        if (diff < 50) { feedbackText = `You're a bit chilly.`; }
        if (diff < 25) { feedbackText = `You're lukewarm.`; }
        if (diff < 10) { feedbackText = `You're burning up!`; }
        // these lines will make the test specs fail
        if (this.playersGuess === this.winningNumber) {
            feedbackText = 'You Win!';
            this.pastGuesses = []; // because the hint button being enabled/disabled depends on pastGuesses' length
            document.querySelector('#guess-feedback > h4').innerHTML = feedbackText;
            document.getElementById('hint').disabled = true;
            document.getElementById('player-input').disabled = true;
        }
        if (pastGuessesOneStepBack.includes(this.playersGuess)) { feedbackText = 'You have already guessed that number.'; }
        document.querySelector('#guess-feedback > h4').innerHTML = feedbackText;
        document.querySelector(`#guess-list li:nth-child(${this.pastGuesses.length})`).innerHTML = this.playersGuess;
        if (this.pastGuesses.length > 4) {
            document.getElementById('hint').disabled = true;
            document.getElementById('player-input').disabled = true;
            feedbackText = 'You Lose';
            document.querySelector('#guess-feedback > h4').innerHTML = feedbackText;
            this.pastGuesses = []; // reset past guesses
        }
        return feedbackText;
    }
    provideHint(hintArray = []) {
        this.nHintCalls++;
        if (this.nHintCalls <= 1) {
            hintArray.push(Math.round((((generateWinningNumber() + this.winningNumber) / 2) + this.winningNumber) / 2),
                this.winningNumber,
                Math.round((((generateWinningNumber() + this.winningNumber) / 2) + this.winningNumber) / 2));
            this.hint = shuffle(hintArray);
        }
        document.querySelector('#guess-feedback > h4').innerHTML = this.hint;
        document.getElementById('hint').disabled = true;
        return this.hint;
    }
}
function generateWinningNumber() { return Math.floor(1 + (Math.random() * 100)); }
function newGame() { return new Game(); }
function shuffle(arr) { // Fisher-Yates shuffle
    for (let i = arr.length - 1; i >= 0; i--) {
        let nextElement = Math.ceil(i * Math.random());
        let temp = arr[i];
        arr[i] = arr[nextElement];
        arr[nextElement] = temp;
    }
    return arr;
}

function playGame() {
    let game = newGame();
    document.getElementById('hint').disabled = true;
    const currentHour = new Date().getHours();
    if (currentHour <= 7 || currentHour >= 19) { // different color for different time of day
        document.getElementById('body').classList.toggle('darkMode');
    }
    // We are grabbing the submit button from our html using getElementById
    const submitButton = document.getElementById('submit');
    // instead of querySelector, so we can refer to exactly one button only.
    // We are listening for when the user clicks on our button.
    // When they click, we will check in the input field to see if they have guessed a number. Then we will run the function `checkGuess`, and give it the player's guess, the winning number, and the empty array of guesses!
    submitButton.addEventListener('click', function () {
        document.querySelector('input').focus(); // has to be first, otherwise the code is unreachable
        const playersGuess = +document.querySelector('input').value;
        document.querySelector('input').value = '';
        game.playersGuessSubmission(playersGuess);
    });

    // We're listening for when the user presses Enter in the input field, and if so we submit the guess if it exists.
    // If it doesn't exist then we reset.
    const enterPress = document.querySelector('input');
    enterPress.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const playersGuess = +document.querySelector('input').value; // + converts the string to an int
            // that means 'string' -> NaN, '1' -> 1, and '' -> 0.
            document.querySelector('input').value = ''; // clear the input field
            if (playersGuess === 0) { game.resetGame(); }
            if (!isNaN(playersGuess)) { game.playersGuessSubmission(playersGuess); }
            document.querySelector('input').focus();
            if (game.pastGuesses.length === 4) { // we only get a hint at a specific time
                document.getElementById('hint').disabled = false;
            }
        }
    });
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', function () {
        game.resetGame();
        document.querySelector('input').focus(); // keeps focus on the input field no matter what the user does
    })
    const hintButton = document.getElementById('hint');
    hintButton.addEventListener('click', function () {
        game.provideHint();
        document.querySelector('input').focus();
    })
    const darkModeButton = document.getElementById('darkModeButton');
    darkModeButton.addEventListener('click', function () {
        document.getElementById('body').classList.toggle('darkMode');
        document.querySelector('input').focus();
    })
}
// start up the game!
playGame(); // note: running this function will cause the test specs to fail
