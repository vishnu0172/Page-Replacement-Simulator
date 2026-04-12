# Page Replacement Simulator

A comprehensive interactive simulator for visualization and comparison of page replacement algorithms in operating systems.

## Project Structure

```
src/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── algorithms.js       # FIFO, LRU, and Optimal algorithms
└── script.js           # Main logic and rendering
```

## Files Overview

### `index.html`
- Main entry point for the application
- Contains all HTML markup and structure
- References external CSS and JavaScript files
- No inline styles or scripts

### `styles.css`
- Complete styling for all components
- CSS custom properties (variables) for theming
- Responsive design with media queries
- Animation effects and transitions

### `algorithms.js`
- **Functions:**
  - `runFIFO(refs, nf)` - First-In-First-Out algorithm
  - `runLRU(refs, nf)` - Least Recently Used algorithm
  - `runOptimal(refs, nf)` - Optimal (MIN) algorithm
- **Metadata:**
  - `META` object containing descriptions and metadata for each algorithm

### `script.js`
- **Main Functions:**
  - `renderSection(key, steps, nf)` - Generates HTML for algorithm results
  - `renderCompare(ff, lf, of_, refs, nf)` - Generates comparison view
  - `showTab(k)` - Handles tab switching
  - `runAll()` - Main simulation orchestrator
- **Event Handlers:**
  - `keydown` - Run simulation on Enter key

## Usage

1. Open `index.html` in a web browser
2. Enter a reference string (e.g., "7, 0, 1, 2, 0, 3, 0, 4")
3. Specify the number of frames (1-8)
4. Click "Run Simulation" or press Enter
5. View detailed results for each algorithm
6. Compare performance metrics

## Features

- **Three Algorithms:** FIFO, LRU, and Optimal
- **Detailed Visualization:** Step-by-step simulation with frame states
- **Performance Metrics:** Page faults, hits, hit rate
- **Comparison View:** Side-by-side algorithm comparison with bar charts
- **Analysis:** Automated insights about algorithm performance
- **Responsive Design:** Works on desktop and mobile devices
- **Accessibility:** Semantic HTML and keyboard support

## Technical Details

- **No Dependencies:** Pure HTML, CSS, and JavaScript
- **Modern Browsers:** Works with all modern browsers
- **Custom Fonts:** Uses Google Fonts (DM Sans, DM Mono, DM Serif Display)
- **Color Scheme:** Customizable via CSS variables

## Algorithm Details

### FIFO (First-In-First-Out)
Evicts the page that has been in memory the longest. Uses a queue to track page arrival order.

### LRU (Least Recently Used)
Evicts the page that was accessed furthest in the past. Exploits temporal locality by keeping recently used pages.

### Optimal (MIN)
Evicts the page that will not be needed for the longest time in the future. Provides the theoretical lower bound for comparison but requires future knowledge, making it impossible to implement in practice.

## References

- Operating Systems course concepts
- Memory management and virtual memory
- Page replacement algorithms
