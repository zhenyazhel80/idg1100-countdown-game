// =====================
// Constants & Elements
// =====================

const display = document.getElementById("display"); // Finds the HTML element with the ID display. Accessing DOM elements
const stopBtn = document.getElementById("stopBtn"); // A variable used to hold a reference to an element in the HTML page (a node object)

const triesBox = document.getElementById("tries");
const avgBox = document.getElementById("average");
const bestBox = document.getElementById("best");

const COUNTDOWN_MS = 5000;   // This line creates a constant named COUNTDOWN_MS, and its value is 5000 milliseconds (which equals 5 seconds).


// =====================
// Variables
// =====================

let startTime = 0;
let timerId = null; // empty value on purpose
let running = false;

let tries = 0;
let totalDeviation = 0;
let best = null;


// =====================
// Start Countdown
// =====================

function startCountdown() {  // This function starts the countdown timer
    running = true;   // stopping the countdown
    startTime = Date.now();  // assignment statement that uses a function

    // Update display every 10 ms (same as lecture)
    timerId = setInterval(updateTimer, 10);
}


// =====================
// Update Timer
// =====================
// This function runs every 10 milliseconds (because setInterval calls it).
// Its job is to calculate how much time is left and update the display.
function updateTimer() {      
    const now = Date.now(); // Takes the current timestamp in milliseconds.
                            // Example: 1700000000000
    const elapsed = now - startTime;  // Calculates how much time has passed since the countdown started.
                                      // elapsed = current time – time when countdown began
    const timeLeft = (COUNTDOWN_MS - elapsed) / 1000;  // Countdown starts from COUNTDOWN_MS (5000 ms = 5 sec)
                                                       // Subtract elapsed time to get remaining time
                                                       // Divide by 1000 to convert milliseconds → seconds
    display.textContent = timeLeft.toFixed(3);       // Updates the text on the screen.
                                                     // Shows timeLeft rounded to 3 decimals, e.g., "3.452"
}

// =====================
// Stop Countdown
// =====================

// This function is called when the user presses SPACE or clicks the STOP button.
// It either stops the countdown OR resets the game depending on the state.
function stopCountdown() {

    // -------------------------
    // CASE 1: The timer is running
    // -------------------------
    if (running) {     // Checks the boolean variable "running"
                       // If running === true → the countdown is active

        running = false;              // Mark the countdown as stopped
        clearInterval(timerId);       // Stop calling updateTimer()

        const now = Date.now();       // Get current time
        const elapsed = now - startTime; 
        // How much time passed since the countdown started

        let diff = (elapsed - COUNTDOWN_MS) / 1000;
        // Compare actual time with the target time (5 seconds)
        // Positive = too slow, Negative = too early

        diff = Math.abs(diff);  
        // Convert negative values to positive (absolute error)

        // -------------------------
        // Update statistics
        // -------------------------
        tries += 1;                   // Add one attempt
        totalDeviation += diff;       // Add this attempt's error to the total

        // Update "best" attempt (smallest deviation)
        if (best === null || diff < best) {  
            best = diff;
        }

        updateStats();                // Refresh the numbers shown on screen
        return;                       // IMPORTANT: Stop here!
                                      // Prevents the resetGame() from triggering in the same keypress
    }

    // -------------------------
    // CASE 2: The timer is NOT running
    // -------------------------
    // This means the player already stopped the countdown.
    // Pressing SPACE again should restart the game.
    resetGame();
}
// =====================
// Update Stats
// =====================

// This function updates the scoreboard on the page.
// It writes: total tries, average deviation, and best result.
function updateStats() {

    // Show how many attempts the player has made
    triesBox.textContent = tries;

    // Calculate average deviation:
    // totalDeviation = sum of all errors
    // tries = number of attempts
    // toFixed(3) = show 3 decimals (e.g., 0.245)
    avgBox.textContent = (totalDeviation / tries).toFixed(3);

    // Update "best" only if it already has a value.
    // (best starts as null, so we skip it for the first run)
    if (best !== null) {
        // Show the smallest deviation the player has achieved
        bestBox.textContent = best.toFixed(3);
    }
}
// =====================
// Event Handlers
// =====================

// Listen for any key pressed on the keyboard.
// When a key is pressed, the function handleKeyPress() will run.
document.addEventListener("keydown", handleKeyPress); // DOM event, Keyboard event


// This function checks which key was pressed.
function handleKeyPress(event) { // Keyboard event

    // event.code tells us the *name* of the key.
    // "Space" means the spacebar.
    // If the player presses SPACE → stop or reset the countdown.
    if (event.code === "Space") {
        stopCountdown();   // Call the function that stops (or restarts) the game
    }
}


// Add a click listener to the STOP button.
// When the player clicks the button → stopCountdown() runs.
stopBtn.addEventListener("click", stopCountdown); // The DOM detects a click event. JavaScript reacts by running stopCountdown().
// When the STOP button is clicked, run the stopCountdown function.


// =====================
// Start the game
// =====================

// As soon as the page loads, immediately start the countdown.
// This calls the startCountdown() function defined earlier.
startCountdown();


// =====================
// Reset Game
// =====================

function resetGame() {

    // Reset the timer display back to the original countdown value (5.000 sec).
    // COUNTDOWN_MS is in milliseconds (5000), so divide by 1000 to convert to seconds.
    // toFixed(3) formats it to 3 decimal places.
    display.textContent = (COUNTDOWN_MS / 1000).toFixed(3); // JavaScript modifies the DOM, and the browser updates the screen instantly.

    // Start a brand-new countdown.
    // This gets called when the player presses the STOP key *again* after finishing a round.
    startCountdown();
}
