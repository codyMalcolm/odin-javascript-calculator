# Javascript Calculator

## Objective

To build a calculator using Javascript, HTML, and CSS.

#### Specifications

##### Main

1. The calculator should contain all of the basic mathematical functions (`+`, `-`, `*`, and `-`).
2. There are some specific requirements for how the program should be structured.
* The operations should be handled in separate functions and returned to the `operate()` function.
* The `operate()` function takes two numbers and an operator.
3. The calculator should have buttons for each operator, each of the numbers, equals, and clear.
4. The calculator should have a display.
5. The display should update with the solution to the operation once `=` is pressed.
6. Multiple consecutive operations should be possible (eg. `12 + 7 - 5 * 3` and should give the correct answer).
7. Answers with long decimals (eg. `3.3333333333333`) should be rounded.
8. A "snarky" error message should be displayed if the user tries to divide by zero.

##### Recommended

1. Make it look pretty.

##### Optional

1. Add a decimal button.
2. Add a backspace button.
3. Add keyboard support.

##### Ambiguous

1. Should the calculator observe order of operations or apply operations in the order entered?
2. What should happen if the user presses `=`, returing a result, and then immediately presses:
 * an operator?
 * a number?
3. How many decimals should we round long numbers to?

##### Personal Extras

1. Add support for parenthesis.
2. Add support for exponents and roots.

#### Learning Objectives

To gain experience with Javascript, logic, and interaction and manipulation with the DOM.

## Author's Notes

#### Preliminary Thoughts

I've already built a [Javascript calculator](https://codepen.io/CTKShadow/pen/LBeGjL), so I'm going to add as much as possible to challenge myself, including parsing the data in a different way (as I wasn't completely satisfied with the solution in that other calculator). As such, this calculator will observe order of operations. As for ambiguity \#2, the calculator will operate on a result if an operator is pressed first, and will clear the input if a number or decimal is pressed first. I will round repeating numbers to 10 decimal places.

#### Final Thoughts

It turns out rounding in Javascript is pretty tricky, due to floating point issues. A simple round to x decimal places can be accomplished with `Math.round(n*10**x)/10**x`, but this doesn't always round in a predictable way: for example, 1.005 rounded to 2 decimal places will return 1, not 1.01. Using n.toFixed(2) will cause the given decimals to always show, so `10.25.toFixed(4)` will return `"10.2500"` rather than `"10.25"` (and also has issues with floating point). Using `Math.round(n + "e+2") + "e-2"` also causes bugs. In the end, I decided to leverage an existing solution, and tweak it to handle what I needed. Credit is in the code comments.
 
To be filled out upon project completion.

## Miscellaneous

Read more about this project at [The Odin Project.](https://www.theodinproject.com/courses/web-development-101/lessons/calculator)
