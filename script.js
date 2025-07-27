let currentInput = '0';
let previousInput = '';
let operation = null;
let resetScreen = false;
let memoryValue = 0;
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');

// Update display
function updateDisplay() {
  display.textContent = currentInput;
}

// Append number
function appendNumber(number) {
  if (currentInput === '0' || resetScreen) {
    currentInput = number === 'Math.PI' ? Math.PI.toString() :
      number === 'Math.E' ? Math.E.toString() : number;
    resetScreen = false;
  } else {
    currentInput += number;
  }
  updateDisplay();
  createRipple(event);
}

// Append decimal
function appendDecimal() {
  if (resetScreen) {
    currentInput = '0.';
    resetScreen = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
  createRipple(event);
}

// Append operator
function appendOperator(op) {
  if (operation !== null) calculate();
  previousInput = currentInput;
  operation = op;
  resetScreen = true;
  historyDisplay.textContent = `${previousInput} ${operation}`;
  createRipple(event);
}

// Calculate
function calculate() {
  if (operation === null || resetScreen) return;
  let result;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  
  try {
    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = prev / current;
        break;
      case '%':
        result = prev % current;
        break;
      default:
        return;
    }
    
    historyDisplay.textContent = `${previousInput} ${operation} ${currentInput} =`;
    currentInput = result.toString();
    operation = null;
    resetScreen = true;
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    updateDisplay();
  }
  createRipple(event);
}

// Clear all
function clearAll() {
  currentInput = '0';
  previousInput = '';
  operation = null;
  historyDisplay.textContent = '';
  updateDisplay();
  createRipple(event);
}

// Delete last character
function deleteLastChar() {
  if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
  createRipple(event);
}

// Percentage
function percentage() {
  currentInput = (parseFloat(currentInput) / 100).toString();
  updateDisplay();
  createRipple(event);
}

// Toggle sign
function toggleSign() {
  currentInput = (parseFloat(currentInput) * -1).toString();
  updateDisplay();
  createRipple(event);
}

// Scientific functions
function calculateFunction(func) {
  try {
    const inputValue = parseFloat(currentInput);
    let result;
    
    if (func === 'Math.log10') {
      result = Math.log10(inputValue);
    } else {
      result = eval(`${func}(${inputValue})`);
    }
    
    historyDisplay.textContent = `${func}(${currentInput})`;
    currentInput = result.toString();
    resetScreen = true;
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    updateDisplay();
  }
  createRipple(event);
}

// Power functions
function calculatePower(power) {
  try {
    const inputValue = parseFloat(currentInput);
    let result;
    
    if (power === 'Math.sqrt') {
      result = Math.sqrt(inputValue);
      historyDisplay.textContent = `√(${currentInput})`;
    } else if (power === 'y') {
      if (operation === null) {
        previousInput = currentInput;
        operation = '^';
        resetScreen = true;
        historyDisplay.textContent = `${previousInput} ^`;
        return;
      } else {
        result = Math.pow(parseFloat(previousInput), parseFloat(currentInput));
        historyDisplay.textContent = `${previousInput} ^ ${currentInput}`;
      }
    } else {
      result = Math.pow(inputValue, power);
      historyDisplay.textContent = `${currentInput}^${power}`;
    }
    
    currentInput = result.toString();
    resetScreen = true;
    operation = null;
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    updateDisplay();
  }
  createRipple(event);
}

// Factorial
function factorial() {
  try {
    let num = parseInt(currentInput);
    if (num < 0) {
      currentInput = 'Error';
      updateDisplay();
      return;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    historyDisplay.textContent = `${currentInput}!`;
    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    updateDisplay();
  }
  createRipple(event);
}

// Memory functions
function memoryAdd() {
  memoryValue += parseFloat(currentInput);
  createRipple(event);
}

function memorySubtract() {
  memoryValue -= parseFloat(currentInput);
  createRipple(event);
}

function memoryRecall() {
  currentInput = memoryValue.toString();
  updateDisplay();
  createRipple(event);
}

function memoryClear() {
  memoryValue = 0;
  createRipple(event);
}

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  document.querySelectorAll('.button-grid').forEach(panel => {
    panel.style.display = 'none';
  });
  
  document.getElementById(`${tabName}-panel`).style.display = 'grid';
  createRipple(event);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    appendOperator(e.key);
  }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') deleteLastChar();
  else if (e.key === '%') percentage();
});

// Ripple effect
function createRipple(event) {
  const btn = event.currentTarget;
  const circle = document.createElement('span');
  circle.classList.add('ripple');
  
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (btn.getBoundingClientRect().left + radius)}px`;
  circle.style.top = `${event.clientY - (btn.getBoundingClientRect().top + radius)}px`;
  
  btn.appendChild(circle);
  
  setTimeout(() => {
    circle.remove();
  }, 600);
}