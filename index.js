// Game state
let cards = []
let flippedCards = []
let matchedPairs = []
let moves = 0
let gameState = "playing"
let timer = 0
let gameStarted = false
let timerInterval = null
let hintPath = []
let showingHint = false
let revealedCards = []

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// BFS Algorithm: Find optimal sequence to complete the game
function findOptimalPath(currentCards, currentMatched) {
  // Get all unmatched cards
  const unmatchedCards = currentCards.filter((card) => !currentMatched.includes(card.number))

  // Create adjacency list of card pairs
  const pairs = {}
  unmatchedCards.forEach((card) => {
    if (!pairs[card.number]) {
      pairs[card.number] = []
    }
    pairs[card.number].push(card.id)
  })

  // BFS to find shortest sequence of moves
  const queue = [
    {
      matched: [...currentMatched],
      path: [],
      remaining: Object.keys(pairs).map(Number),
    },
  ]

  const visited = new Set()

  while (queue.length > 0) {
    const current = queue.shift()

    // If all pairs are matched, return the path
    if (current.remaining.length === 0) {
      return current.path
    }

    // Create state key for visited check
    const stateKey = current.remaining.sort().join(",")
    if (visited.has(stateKey)) continue
    visited.add(stateKey)

    // Try matching each remaining pair
    for (const number of current.remaining) {
      if (pairs[number] && pairs[number].length === 2) {
        const newMatched = [...current.matched, number]
        const newRemaining = current.remaining.filter((n) => n !== number)
        const newPath = [
          ...current.path,
          {
            type: "match",
            number: number,
            cardIds: pairs[number],
          },
        ]

        queue.push({
          matched: newMatched,
          path: newPath,
          remaining: newRemaining,
        })
      }
    }
  }

  return []
}

// Show hint using BFS result
function showHint() {
  if (showingHint || gameState !== "playing") return

  const optimalPath = findOptimalPath(cards, matchedPairs)

  if (optimalPath.length > 0) {
    const nextMove = optimalPath[0]
    hintPath = nextMove.cardIds
    showingHint = true

    // Update card display
    updateCardDisplay()

    // Show hint message
    document.getElementById("hint-message").style.display = "block"

    // Hide hint after 3 seconds
    setTimeout(() => {
      hintPath = []
      showingHint = false
      updateCardDisplay()
      document.getElementById("hint-message").style.display = "none"
    }, 3000)
  }
}

// Reveal all cards temporarily
function peekAllCards() {
  if (revealedCards.length > 0 || gameState !== "playing") return

  const unmatchedCardIds = cards.filter((card) => !card.isMatched).map((card) => card.id)
  revealedCards = unmatchedCardIds

  updateCardDisplay()

  // Hide after 2 seconds
  setTimeout(() => {
    revealedCards = []
    updateCardDisplay()
  }, 2000)
}

// Initialize game board
function initializeGame() {
  // Create pairs of numbers 1-10
  const numbers = []
  for (let i = 1; i <= 10; i++) {
    numbers.push(i, i) // Add each number twice
  }

  // Shuffle the cards using Fisher-Yates algorithm
  const shuffledNumbers = shuffleArray(numbers)

  // Create card objects with unique IDs
  cards = shuffledNumbers.map((number, index) => ({
    id: index,
    number: number,
    isFlipped: false,
    isMatched: false,
  }))

  flippedCards = []
  matchedPairs = []
  moves = 0
  gameState = "playing"
  timer = 0
  gameStarted = false
  hintPath = []
  showingHint = false
  revealedCards = []

  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  updateDisplay()
  createGameBoard()
}

// Create game board HTML
function createGameBoard() {
  const gameBoard = document.getElementById("game-board")
  gameBoard.innerHTML = ""

  cards.forEach((card) => {
    const cardElement = document.createElement("button")
    cardElement.className = "card"
    cardElement.id = `card-${card.id}`
    cardElement.onclick = () => handleCardClick(card.id)
    gameBoard.appendChild(cardElement)
  })

  updateCardDisplay()
}

// Update card display
function updateCardDisplay() {
  cards.forEach((card) => {
    const cardElement = document.getElementById(`card-${card.id}`)
    if (!cardElement) return

    // Reset classes
    cardElement.className = "card"

    // Add state classes
    if (card.isMatched) {
      cardElement.classList.add("matched")
    } else if (card.isFlipped || revealedCards.includes(card.id)) {
      cardElement.classList.add("flipped")
    }

    if (hintPath.includes(card.id)) {
      cardElement.classList.add("hint")
    }

    // Set content
    if (card.isFlipped || card.isMatched || revealedCards.includes(card.id)) {
      cardElement.textContent = card.number
    } else {
      cardElement.textContent = "?"
    }

    // Disable if needed
    cardElement.disabled = gameState !== "playing" || card.isMatched || flippedCards.length >= 2
  })
}

// Handle card click
function handleCardClick(cardId) {
  if (gameState !== "playing") return

  const card = cards.find((c) => c.id === cardId)
  if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

  // Start timer on first click
  if (!gameStarted) {
    gameStarted = true
    startTimer()
  }

  card.isFlipped = true
  flippedCards.push(cardId)

  updateCardDisplay()

  // Check for match when 2 cards are flipped
  if (flippedCards.length === 2) {
    const [firstId, secondId] = flippedCards
    const firstCard = cards.find((c) => c.id === firstId)
    const secondCard = cards.find((c) => c.id === secondId)

    moves++
    updateDisplay()

    if (firstCard.number === secondCard.number) {
      // Match found!
      setTimeout(() => {
        firstCard.isMatched = true
        secondCard.isMatched = true
        matchedPairs.push(firstCard.number)
        flippedCards = []
        updateCardDisplay()
        updateDisplay()
        checkWinCondition()
      }, 1000)
    } else {
      // No match - flip cards back
      setTimeout(() => {
        firstCard.isFlipped = false
        secondCard.isFlipped = false
        flippedCards = []
        updateCardDisplay()
      }, 1500)
    }
  }
}

// Start timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer++
    updateDisplay()
  }, 1000)
}

// Check win condition
function checkWinCondition() {
  if (matchedPairs.length === 10 && gameState === "playing") {
    gameState = "won"
    gameStarted = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    updateDisplay()
    showWinMessage()
  }
}

// Show win message
function showWinMessage() {
  document.getElementById("final-moves").textContent = moves
  document.getElementById("final-time").textContent = formatTime(timer)
  document.getElementById("win-message").style.display = "block"
}

// Format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Update display
function updateDisplay() {
  document.getElementById("pairs").textContent = matchedPairs.length
  document.getElementById("timer").textContent = formatTime(timer)
  document.getElementById("moves").textContent = moves

  const gameStatus = document.getElementById("game-status")
  if (gameState === "won") {
    gameStatus.textContent = "🎉 You Won!"
    gameStatus.classList.add("won")
  } else {
    gameStatus.textContent = "🎮 Playing"
    gameStatus.classList.remove("won")
  }

  // Update button states
  document.getElementById("hint-btn").disabled = showingHint || gameState !== "playing"
  document.getElementById("peek-btn").disabled = revealedCards.length > 0 || gameState !== "playing"
}

// Reset game
function resetGame() {
  document.getElementById("hint-message").style.display = "none"
  document.getElementById("win-message").style.display = "none"
  initializeGame()
}

// Initialize game on page load
window.onload = () => {
  initializeGame()
}
