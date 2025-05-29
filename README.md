# GameTebakAngka

# 🧠 Memory Matching Game – BFS-Powered

A browser-based **Memory Matching Game** where players must find 10 pairs of hidden numbers. The game features a real-time **Breadth-First Search (BFS)** algorithm that intelligently suggests the next best move.

## 👥 Group Members

- **Ammar Ghozy Tanumijaya** – 5025231203  
- **Huraira Shenmue Mahanee** – 5025231216  

## 🔗 Live Demo / GitHub

[👉 GitHub Repository](https://github.com/Sh3nm/GameTebakAngka)

## 🛠️ Technologies Used

- **HTML** – UI structure  
- **CSS** – Responsive, clean styling  
- **JavaScript** – Game logic, BFS implementation, interactivity  

## 🎮 Features

- **💡 BFS Hint**: Suggests the next best matching pair using BFS
- **👁 Peek All**: Temporarily reveals all unmatched cards
- **🔄 New Game**: Resets the board and stats
- **Real-time stats**: Tracks pairs matched, moves, and time
- **Win screen**: Displays summary when all pairs are matched

## 🧩 Gameplay Mechanics

1. Cards are shuffled using the **Fisher-Yates Shuffle** algorithm.
2. Players flip two cards at a time to find matching numbers.
3. If matched, the pair stays revealed; otherwise, they flip back.
4. The game ends when all 10 pairs are found.

## 🔍 BFS Algorithm for Hints

- Each unmatched pair is modeled as a node in a state space.
- BFS traverses level-by-level to find the **shortest sequence of match steps**.
- The next optimal match is highlighted to the user as a suggestion.

## 🧑‍💻 Interface Overview

### Header & Stats
- **Memory Game** title
- 🏆 Pairs found / ⏱ Time elapsed / 🎯 Total moves
- 🎮 Game state: Playing / Won

### Game Board
- 20-card grid (4x5)
- Visual feedback:
  - Blue for flipped cards
  - Green for matched cards
  - Yellow pulse for BFS hint

### Control Panel
- 💡 BFS Hint
- 👁 Peek All
- 🔄 New Game

### Algorithm Info Panel
Explains:
- BFS usage
- Game objectives
- Feature descriptions

## 📈 Analysis

### Strengths
- Intelligent assistance using BFS
- Responsive UI for mobile and desktop
- Clear logic separation (HTML/CSS/JS)

### Efficiency
- BFS runs instantly in small state space (20 cards)
- Optimized with state hashing

### Educational Value
- Demonstrates practical BFS application
- Reinforces understanding of algorithms in interactive systems

## ✅ Conclusion

This project bridges classical algorithm theory and real-world application. Through the integration of **Breadth-First Search** in a memory game, we created an interactive, educational experience that deepens understanding while engaging players.

---
