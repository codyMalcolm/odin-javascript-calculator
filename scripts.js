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

//maintain aspect ratio
window.addEventListener('resize', handleResize);
// TODO: Add a debouncer
function handleResize() {
  container.style.width = (container.offsetHeight / 11) * 14 + "px";
}
handleResize();

function add(x, y) {

}

function subtract(x, y) {

}

function multiply(x, y) {

}

function divide(x, y) {

}

function exponent(x, y) {

}

function root(x, y) {

}

function addDecimal() {

}

function reverseSign() {

}

function backspace() {

}

function handleZero() {

}

function operate(operator, x, y) {

}

function calculate() {

}

function dividedByZero() {

}

function softClear() {

}

function hardClear() {

}

function updateDisplay() {

}

function storeMemory() {

}

function retrieveMemory() {

}
