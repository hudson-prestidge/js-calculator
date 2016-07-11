document.addEventListener('DOMContentLoaded', startCalc)

var checkIfReusingAns = false
var operators = ['+', '-', '/', 'x', '^']

function startCalc () {
  var numberSection = document.getElementsByClassName('number-section')[0]
  for (var i = 0; i < numberSection.children.length; i++) {
    addNumberButtonListener(numberSection.children[i])
  }
  var operatorSection = document.getElementsByClassName('operator-section')[0]
  for (var j = 0; j < operatorSection.children.length; j++) {
    addOperatorButtonListener(operatorSection.children[j])
  } document.getElementById('clear-button').addEventListener('click', clearCharacter)
  document.getElementById('clear-all-button').addEventListener('click', clearAll)
  document.getElementById('equals-button').addEventListener('click', solve)
  document.getElementById('decimal-point-button').addEventListener('click', addDecimalPoint)
}

function addNumberButtonListener (button) {
  var number = button.innerHTML
  button.addEventListener('click', function () {
    if (checkIfReusingAns) {
      clearAll()
      checkIfReusingAns = false
    } writeToOutput(number)
  })
}

function addOperatorButtonListener (button) {
  var operator = button.innerHTML
  button.addEventListener('click', function () {
    writeOperator(operator)
  })
}

function writeOperator (operator) {
  checkIfReusingAns = false
  var output = document.getElementsByClassName('output')[0].innerHTML
  if (output.length === 0 && operator === '-') {
    writeToOutput(operator)
  } else if (endsInOperator(output)) {
    clearCharacter()
    writeToOutput(' ' + operator + ' ')
  } else {
    writeToOutput(' ' + operator + ' ')
  }
}

function writeToOutput (x) {
  document.getElementsByClassName('output')[0].innerHTML += x
}

function clearCharacter () {
  var output = document.getElementsByClassName('output')[0].innerHTML
  // as operators are created with spaces on either side, the clear button should remove those if the last thing added was an operator. Otherwise, just trim one char
  if (endsInOperator(output)) {
    document.getElementsByClassName('output')[0].innerHTML = output.substring(0, output.length - 3)
  } else {
    document.getElementsByClassName('output')[0].innerHTML = output.substring(0, output.length - 1)
  }
}

function clearAll () {
  while (document.getElementsByClassName('output')[0].innerHTML.length > 0) {
    clearCharacter()
  }
}

function addDecimalPoint () {
  var output = document.getElementsByClassName('output')[0].innerHTML.split(' ')
  if (checkIfReusingAns) {
    clearAll()
    checkIfReusingAns = false
  } if (output[output.length - 1].indexOf('.') === -1) {
    writeToOutput('.')
  }
}

function endsInOperator (str) {
  for (var i = 0; i < operators.length; i++) {
    if (str.substring(str.length - 3, str.length) === ' ' + operators[i] + ' ') {
      return true
    }
  } return false
}

function solve () {
  var args = document.getElementsByClassName('output')[0].innerHTML.split(' ')
  // if the args ends in an operator, trim the last empty element created by splitting
  if (args[args.length - 1] === '') {
    args.splice(args.length - 1, 1)
  // check if there's enough arguments to bother evaluating. If there's less than 3 arguments, none of the binary operators can function so may as well do nothing.'
  } else if (args.length > 2) {
    // resolve operators in BEDMAS order (brackets not yet implemented)
    resolveOperator(args, '^', Math.pow)
    resolveOperator(args, '/', divide)
    resolveOperator(args, 'x', multiply)
    resolveOperator(args, '+', add)
    resolveOperator(args, '-', subtract)
    document.getElementsByClassName('output')[0].innerHTML = args[0]
    // set checkIfReusingAns to true, so that if the user presses a number/decimal then output will be cleared but if they press an operator the answer will be used
    // as the first argument for that operator
    checkIfReusingAns = true
  }
}

function resolveOperator (args, op, fn) {
  // searches through the odd elements of a given array args for all instances of an operator op, and calls a function fn on the elements directly before and after them
  var i = 1
  while (i < args.length) {
    if (args[i] === op) {
      args[i + 1] = fn(args[i - 1], args[i + 1])
      args.splice(i - 1, 2)
      i = 1
      continue
    }i += 2
  } i = 1
}

function add (x, y) {
  return (Number(x) + Number(y))
}

function subtract (x, y) {
  return x - y
}

function multiply (x, y) {
  return x * y
}

function divide (x, y) {
  return x / y
}
