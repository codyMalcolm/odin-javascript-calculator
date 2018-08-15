// Math.round10 polyfill credit: MDN
// modified to eliminate unnecessary functionality
function roundFix(value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
      return Math.round(value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

const container = document.querySelector('.container');
const outputDisplay = container.querySelector('.output');
const inputDisplay = container.querySelector('.input');
const softClearBtn = container.querySelector('.soft-clear');
const hardClearBtn = container.querySelector('.hard-clear');
const storeMemoryBtn = container.querySelector('.store-memory')
const retrieveMemoryBtn = container.querySelector('.retrieve-memory');
const backspaceBtn = container.querySelector('.backspace');
const reverseSignBtn = container.querySelector('.reverse-sign');
const decimalBtn = container.querySelector('.decimal');
const numberBtns = container.querySelectorAll('.number');
const operatorBtns = container.querySelectorAll('.operator');
const bracketBtns = container.querySelectorAll('.bracket');

softClearBtn.addEventListener('click', softClear);
hardClearBtn.addEventListener('click', hardClear);
storeMemoryBtn.addEventListener('click', storeMemory);
retrieveMemoryBtn.addEventListener('click', retrieveMemory);
backspaceBtn.addEventListener('click', backspace);
reverseSignBtn.addEventListener('click', reverseSign);
decimalBtn.addEventListener('click', decimal);

numberBtns.forEach(button => {
  button.addEventListener('click', number);
})

operatorBtns.forEach(button => {
  button.addEventListener('click', operator);
});

bracketBtns.forEach(button => {
  button.addEventListener('click', bracket);
})

let output = '';
let input = '0';
let result = '';
let memory = '';

//maintain aspect ratio
window.addEventListener('resize', handleResize);
// TODO: Add a debouncer
function handleResize() {
  container.style.width = (container.offsetHeight / 11) * 14 + "px";
}
handleResize();

function add(x, y) {
  return roundFix(parseFloat(x) + parseFloat(y), -14)
};

function subtract(x, y) {
  return roundFix(parseFloat(x) - parseFloat(y), -14)
};

function multiply(x, y) {
  return roundFix(parseFloat(x) * parseFloat(y), -14)
};

function divide(x, y) {
  y = parseFloat(y);
  if (!y) {
    handleUndefined();
  } else {
    return roundFix(parseFloat(x) / y, -14);
  }
}

function handleUndefined() {
  result = 'undefined';
  displayResult()
}

function exponent(x, y) {
  return roundFix(parseFloat(x)**parseFloat(y), -13);
}

function root(x, y) {
  return roundFix(parseFloat(x)**(divide(1, y)), -13)
}

function decimal() {
  if (input.indexOf('.') === -1) {
    input += '.';
  }
  updateDisplay();
}

function number() {
  if (input === '0') input = '';
  if (input === '-0') input = '-';
  if (input.slice(-1) !== ')') input += this.dataset.number;
  updateDisplay();
}

function operator() {
  let symbol = displayOperator(this.dataset.operator);
  input = input+symbol;
  if ((input.match(/\(/g) || []).length !== (input.match(/\)/g) || []).length) {
    updateDisplay();
  } else {
    output += input;
    input = '0';
    updateOutputDisplay();
  }
}

function displayOperator(sym) {
  if (sym === '/') return '÷';
  if (sym === '**') return '^';
  if (sym === '**1/') return '^(1÷';
  return sym;
}

// TODO: refactor with moar regex
function bracket() {
  if (this.dataset.bracket === '(') {
    if (input === '0') {
      input = '(';
    } else if (input === '-0') {
       input = '-(';
    } else if (input.slice(-1) === '(') {
      input += '(';
    }
  } else {
    if ((input.match(/\(/g) || []).length > (input.match(/\)/g) || []).length && /\d/.test(input.slice(-1))) input += ')';
  }
  updateDisplay();
}

function reverseSign() {
  input = input.charAt(0) === '-' ? input.slice(1) : '-' + input;
  updateDisplay();
}

function backspace() {
  if (input.length === 1) {
    input = '0';
  } else if (input.length === 2 && input.charAt(0) === '-') {
    input = '-0';
  } else {
    input = input.slice(0, -1);
  }
  updateDisplay();
}

function handleZero() {

}

function operate(operator, x, y) {
  switch (operator) {
    case '+':
      return add(x, y);
    case '-':
      return subtract(x, y);
    case '*':
      return multiply(x, y);
    case '/':
      return divide(x, y);
    case '**':
      return exponent(x, y);
      // is root necessary?
    case '**1/':
      return root(x, y);
  }
}

function calculate() {

  displayResult();
}

function softClear() {
  input = '0';
  updateDisplay();
}

function hardClear() {
  output = '';
  input = '0';
  updateOutputDisplay();
}

function updateOutputDisplay() {
  outputDisplay.textContent = output;
  updateDisplay();
}

function updateDisplay() {
  inputDisplay.textContent = input;
}

function displayResult() {
  inputDisplay.textContent = result;
}

function storeMemory() {
  if (result) {
    memory = result;
  }
}

function retrieveMemory() {
  if (memory && input === '0') {
    input = memory;
  } else if (memory && input === '-0') {
    input = '-' + memory;
  }
  updateDisplay();
}
