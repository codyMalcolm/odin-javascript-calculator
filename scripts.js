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

// TODO: refactor checks for 0 / -0;

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
const calculateBtn = container.querySelector('.calculate');
const numberBtns = [...container.querySelectorAll('.number')];
const operatorBtns = [...container.querySelectorAll('.operator')];
const bracketBtns = [...container.querySelectorAll('.bracket')];

const numbers = numberBtns.map(b => b.dataset.number);
const operators = operatorBtns.map(b => b.dataset.operator);
const brackets = bracketBtns.map(b => b.dataset.bracket);

window.addEventListener('keydown', handleKey);
softClearBtn.addEventListener('click', softClear);
hardClearBtn.addEventListener('click', hardClear);
storeMemoryBtn.addEventListener('click', storeMemory);
retrieveMemoryBtn.addEventListener('click', retrieveMemory);
backspaceBtn.addEventListener('click', backspace);
reverseSignBtn.addEventListener('click', reverseSign);
decimalBtn.addEventListener('click', decimal);
calculateBtn.addEventListener('click', calculate);

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

function handleKey(e) {
  if (numbers.includes(e.key)) handleNumber(e.key);
  if (operators.includes(e.key)) handleOperator(e.key);
  if (brackets.includes(e.key)) handleBracket(e.key);
  switch (e.key) {
    case '.':
      decimal();
      break;
    case 'Enter': case '=':
      calculate();
      break;
    case 'Backspace':
      backspace();
      break;
    case '^':
      handleOperator('**');
      break;
    case 'Escape':
      softClear();
      break;
  }
}

function decimal() {
  if (input.indexOf('.') === -1) {
    input += '.';
  }
  updateDisplay();
}

function number() {
  handleNumber(this.dataset.number);
}

function handleNumber(num) {
  if (input === '0') input = '';
  if (input === '-0') input = '-';
  if (input.slice(-1) !== ')') input += num;
  updateDisplay();
}

function operator() {
  handleOperator(this.dataset.operator);
}

function handleOperator(oper) {
  if (!output && (input === '0' || input === '-0')) return;
  let symbol = displayOperator(oper);
  if (input === '0' || input === '-0') {
    output = output.slice(0, -1) + symbol;
    updateOutputDisplay();
  } else if (/[+\-*÷^]$/.test(input)) {
    input = input.slice(0, -1) + symbol;
    updateDisplay();
  } else {
    input = input+symbol;
    if ((input.match(/\(/g) || []).length !== (input.match(/\)/g) || []).length) {
      updateDisplay();
    } else {
      output += input;
      input = '0';
      updateOutputDisplay();
    }
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
  handleBracket(this.dataset.bracket);
}

function handleBracket(bracket) {
  if (bracket === '(') {
    if (input === '0') {
      input = '(';
    } else if (input === '-0') {
      input = '-(';
    } else if (/\D$/.test(input)) {
      input += '(';
    }
  } else {
    if ((input.match(/\(/g) || []).length > (input.match(/\)/g) || []).length && /[^(+\-*÷^]/.test(input.slice(-1))) input += ')';
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
    case '÷':
      return divide(x, y);
    case '**':
      return exponent(x, y);
  }
}

// TODO: clear the result variable once further input
function calculate() {
  if (output && input === '0' || input === '-0') {
    output = output.slice(0, -1) + '='
  } else {
    output += input;
  }
  result = parseOutput(output);
  output += '=';
  updateOutputDisplay();
  displayResult();
}

// TODO: doesn't handle decimals...

function parseOutput(string) {
  const innerBrackets = /\([^()]+\)/;
  while (innerBrackets.test(string)) {
    string = string.replace(innerBrackets, parseOutput(string.match(innerBrackets)[0].substr(1, string.match(innerBrackets)[0].length-2)));
  }
  const carrot = /\d+\^\d+/;
  while (carrot.test(string)) {
    let arr = string.match(carrot)[0].split('^');
    string = string.replace(carrot, operate("**", arr[0], arr[1]));
  }
  const divAndMult = /(\d+\*\d+|\d+÷\d+)/
  while (divAndMult.test(string)) {
    let oper = /(\*|÷)/.exec(string)[0];
    let arr = string.match(divAndMult)[0].split(oper);
    string = string.replace(divAndMult, operate(oper, arr[0], arr[1]));
  }
  const addAndSub = /(\d+\+\d+|\d+\-\d+)/
  while (addAndSub.test(string)) {
    let oper = /(\+|\-)/.exec(string)[0];
    let arr = string.match(addAndSub)[0].split(oper);
    string = string.replace(addAndSub, operate(oper, arr[0], arr[1]));
  }
  return string;
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

// TODO: handle overflow
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
