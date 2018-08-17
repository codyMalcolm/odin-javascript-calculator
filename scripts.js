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

// initialize selectors
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

// add listeners
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

// initialize variables
let output = ''; // stores top row of display, working equation
let input = '0'; // stores number being currently entered
let result = ''; // stores last result (until next calculation started)
let memory = ''; // stores memory value

//maintain aspect ratio
window.addEventListener('resize', handleResize);
// TODO: Add a debouncer
function handleResize() {
  container.style.width = (container.offsetHeight / 11) * 14 + "px";
}
handleResize();

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
  checkResult();
  const lastOperator = (input.match(/[\+\-\*÷\^]/g) || ['!']).slice(-1);
  if (input.lastIndexOf('.') <= Math.max(0, input.lastIndexOf(lastOperator))) {
    input += '.';
  }
  updateDisplay();
}

function number() {
  handleNumber(this.dataset.number);
}

function handleNumber(num) {
  checkResult();
  if (input === '0') input = '';
  if (input === '-0') input = '-';
  if (input.slice(-1) !== ')' && input.slice(-2) !== '(0') input += num;
  updateDisplay();
}

function operator() {
  handleOperator(this.dataset.operator);
}

function handleOperator(oper) {
  if (result) { //consider last result this input
    output = '';
    input = result;
    result = '';
  }
  if ((!output && (input === '0' || input === '-0')) || input.slice(-1) === '(') return;
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
  checkResult();
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
  if (result) { //consider last result this input
    output = '';
    input = result;
    result = '';
  }
  if (input.indexOf('(') === -1 || (input.lastIndexOf(')') === input.length - 1 && (input.match(/\(/g) || []).length === (input.match(/\)/g) || []).length)) { //if there are no brackers or if brackets are matched
    input = input.charAt(0) === '-' ? input.slice(1) : '-' + input;
  } else {
    if (/\d+(\.\d+)?$/.test(input)) {
      const match = input.match(/\d+(\.\d+)?$/);
      const pos = match['index'];
      if (input.charAt(pos-1) !== '-') {
        input = input.slice(0, pos) + '-' + match[0];
      } else {
        input = input.slice(0, pos-1) + match[0];
      }
    } else {
      if (input.slice(-1) !== '-') {
        input += '-';
      } else {
        input = input.slice(0, -1);
      }
    }
  }
  updateDisplay();
}

function backspace() {
  checkResult();
  if (input.length === 1) {
    input = '0';
  } else if (input.length === 2 && input.charAt(0) === '-') {
    input = '-0';
  } else {
    input = input.slice(0, -1);
  }
  updateDisplay();
}

function checkResult() {
  if (result) {
    hardClear();
  }
}

function calculate() {
  function parseOutput(string) {
    function operate(operator, x, y) {
      // calculation functions
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
          return 'undefined';
        } else {
          return roundFix(parseFloat(x) / y, -14);
        }
      }

      function exponent(x, y) {
        return roundFix(parseFloat(x)**parseFloat(y), -13);
      }

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
    function testForTrickyNegatives(str, index) {
      return (index === 1 && str.charAt(0) === '-') || (index > 0 && str.charAt(index-1) === '-' && /[\+\-\*÷]/.test(str.charAt(index-2)))
    }
    function removeTrickyNegative(str, index) {
      return str.substring(0, index-1) + str.substring(index)
    }

    // Solve brackets from innermost to outermost
    const innerBrackets = /\([^()]+\)/;
    while (innerBrackets.test(string)) {
      const innerBracketsResult = parseOutput(string.match(innerBrackets)[0].substr(1, string.match(innerBrackets)[0].length-2));

      string = innerBracketsResult !== 'undefined' ? string.replace(innerBrackets, innerBracketsResult) : innerBracketsResult;
    }

    // Handle sloppy user input of the nature "12.+3"
    const trailingDecimal = /(\.\D|\.$)/;
    while (trailingDecimal.test(string)) {
      const pos = trailingDecimal.exec(string)['index'] + 1;
      string = string.slice(0, pos) + '0' + string.slice(pos);
    }

    // Handle sloppy user input of the nature "(.12)+3"
    const leadingDecimal = /(\D\.|^\.)/;
    while (leadingDecimal.test(string)) {
      const pos = leadingDecimal.exec(string)['index'];
      string = pos ? string.slice(0, pos+1) + '0' + string.slice(pos+1) : '0' + string;
    }

    // Solve exponents
    const carrot = /\d+(\.\d+)?\^\-?\d+(\.\d+)?/;
    while (carrot.test(string)) {
      let match = string.match(carrot)[0];
      const index = string.indexOf(match);
      let arr = match.split('^');
      if (testForTrickyNegatives(string, index)) {
        string = removeTrickyNegative(string, index);
        string = string.replace(carrot, operate("**", '-' + arr[0], arr[1]));
      } else {
        string = string.replace(carrot, operate("**", arr[0], arr[1]));
      }
    }

    // Solve multiplication and division
    const divAndMult = /(\d+(\.\d+)?\*\-?\d+(\.\d+)?|\d+(\.\d+)?÷\-?\d+(\.\d+)?)/
    while (divAndMult.test(string)) {
      let match = string.match(divAndMult)[0];
      const index = string.indexOf(match);
      let oper = /(\*|÷)/.exec(string)[0];
      let arr = match.split(oper);
      let res;
      if (testForTrickyNegatives(string, index)) {
        string = removeTrickyNegative(string, index);
        res = operate(oper, '-' + arr[0], arr[1]);
      } else {
        res = operate(oper, arr[0], arr[1]);
      }
      string = res !== 'undefined' ? string.replace(divAndMult, res) : res;
    }

    // TODO: refactor to be less gross
    // Solve addition and subtraction
    const addAndSub = /(.\-|\+)/;
    while (addAndSub.test(string)) {
      let numRegex = /.\d*(\.\d+)?/;
      let firstNum = string.match(numRegex)[0];
      let oper = string.substr(firstNum.length, 1);
      string = string.substring(firstNum.length+1);
      let secondNum = string.match(numRegex)[0];
      string = operate(oper, firstNum, secondNum) + string.substring(secondNum.length);
    }
    return string;
  }

  if (result) return;
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

function softClear() {
  input = '0';
  updateDisplay();
}

function hardClear() {
  output = '';
  input = '0';
  result = '';
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
  if (result && result !== 'undefined') {
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
