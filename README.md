# Color Guessing Game

## Overview
The Color Guessing Game is an interactive web-based game where players try to guess the correct color from a set of six options. The game provides immediate feedback on each guess, keeps track of the score, and allows players to reset the game at any time.

## Technologies Used
- HTML
- CSS
- JavaScript (Vanilla)

## Features

### Color Display
- A box displays a randomly selected target color.
- **Attribute:** `data-testid="colorBox"`

### Color Options
- Six color buttons are displayed as possible guesses.
- Each button’s background color represents a possible choice.
- **Attribute:** `data-testid="colorOption"`

### Game Instructions
- Instructions on how to play are displayed.
- **Attribute:** `data-testid="gameInstructions"`

### Game Status
- Displays whether the guess is correct or wrong after each attempt.
- **Attribute:** `data-testid="gameStatus"`

### Score
- A score counter increments with each correct guess.
- **Attribute:** `data-testid="score"`

### New Game Button
- A button allows the player to reset and start a new round.
- **Attribute:** `data-testid="newGameButton"`

### Sound Effects
- **Background Music:**  
  Background music is available and plays on loop with fade-in/out effects. Users can toggle the background music on or off, with the state persisting across pages via localStorage.
- **Guess Sound Effects:**  
  Distinct sound effects play when the user makes a correct guess or a wrong guess.
- **Implementation:**  
  Sound elements are dynamically created in JavaScript, and controls are provided via a volume icon and buttons. Sound effects enhance the overall game experience.

## Styling & Design
- Engaging and user-friendly UI.
- Large and clickable buttons.
- Clear distinction between target color and options.
- Responsive design for desktop, tablet, and mobile devices.
- Animations (e.g., fade-out for wrong answers, celebration effect for correct guesses).

## Functionality
1. Randomly selects a color from a predefined set as the target color.
2. Displays six color options for the player to choose from.
3. Checks if the player’s guess is correct.
4. Updates the score accordingly.
5. Displays messages indicating whether the guess was right or wrong.
6. Resets the game when the "New Game" button is clicked.
7. **Sound Effects:**  
   - Background music plays (if enabled) with smooth fade transitions and loops continuously.
   - Sound effects provide audio feedback for correct guesses, wrong guesses, and game start.

## Implementation Details
- The target color is displayed as a colored box (not as a hex code).
- Players select the correct color based on its visual appearance.
- All game elements use `data-testid` attributes for testing purposes.
- Sound effects are integrated into the game, enhancing user interaction.
