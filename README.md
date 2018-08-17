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
3. Add support for entering negative numbers.
4. Add support for memory storage.

#### Learning Objectives

To gain experience with Javascript, logic, and interaction and manipulation with the DOM.

## Author's Notes

#### Preliminary Thoughts

I've already built a [Javascript calculator](https://codepen.io/CTKShadow/pen/LBeGjL), so I'm going to add as much as possible to challenge myself, including parsing the data in a different way (as I wasn't completely satisfied with the solution in that other calculator). As such, this calculator will observe order of operations. As for ambiguity \#2, the calculator will operate on a result if an operator is pressed first, and will clear the input if a number or decimal is pressed first. I will round repeating numbers to 10 decimal places.

#### Final Thoughts

It turns out rounding in Javascript is pretty tricky, due to floating point issues. A simple round to x decimal places can be accomplished with `Math.round(n*10**x)/10**x`, but this doesn't always round in a predictable way: for example, 1.005 rounded to 2 decimal places will return 1, not 1.01. Using n.toFixed(2) will cause the given decimals to always show, so `10.25.toFixed(4)` will return `"10.2500"` rather than `"10.25"` (and also has issues with floating point). Using `Math.round(n + "e+2") + "e-2"` also causes bugs. In the end, I decided to leverage an existing solution, and tweak it to handle what I needed. Credit is in the code comments.

Further to floating point weirdness, a decision needed to be made about when to round off - whether to do so for every sub-calculation or just at the end. Ideally you would only round at the end to preserve accuracy, but consider the following scenario:

```10 / ((5-4.4)-0.6)=
10 / (0.5999999999999996 - 0.6)=
10 / -3.3306690738754696e-16=
-30023997515803308
```

But the correct answer obviously should have been "undefined." So to minimize bugs like the above, while preserving the maximum amount of accuracy, after every calculation (add, subtract, multiply, etc), results will be rounded to 13 or 14 decimal places, and the final result will be rounded to 10 decimal places.

I could write a lot more about the completion of this project, so I'll try to just make some brief points:
* I got a lot of practice with regular expressions.
* There are several instances where repeated code could be refactored. For example, in several places I check to see if input is either '0' or '-0'.
* Similarly, there are several instances where I could use regex in data validation to perhaps streamline some of the conditional logic.
* My largest dissatisfaction with how the program is structured is related to the brackets. Currently, when an operator is pressed, the previously entered number and the operator are moved to the top display and the input is cleared. However, early I made a decision that if a bracket is being used, the user could enter the whole bracket subequation before having the input moved to the upper display. A major consequence of this decision is that once I started implementing checks to prevent invalid input (such as `0(+)-^.`), I had to essentially handle the checks for "empty" input in completely separate ways depending on if the input was "empty with no brackets" ('0' or '-0') or "empty with brackets" (eg. '(35+)'). When combined with the other logic required to prevent flawed input, this results in some pretty ugly conditional logic in some parts of the program. The two reasons I originally decided to handle brackets this way were to make it easier to visualize that the brackets were closed, and to allow the user to remove brackets they don't want. Ultimately, however, if I was to rebuild this project, I'd have brackets immediately moved to the upper display so valid input test is more predictable and less validation is required.
* Parsing the data was pretty interesting, but for the most part recursion handled the brackets and regex did the rest. The most difficult part was just trying to figure out how many different ways input could be flawed. For a while it seemed that every time I fixed an exception, while testing I would accidentally stumble upon two more that I hadn't yet considered. This is why `TODO` exists.

## Miscellaneous

Read more about this project at [The Odin Project.](https://www.theodinproject.com/courses/web-development-101/lessons/calculator)
