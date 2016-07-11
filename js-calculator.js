document.addEventListener('DOMContentLoaded', startCalc)

var checkIfReusing = false
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
    if (checkIfReusing) {
      clearAll()
      checkIfReusing = false
    } writeToOutput(number)
  })
}

function addOperatorButtonListener (button) {
  var operator = button.innerHTML
  button.addEventListener('click', function () {
    checkIfReusing = false
    var output = document.getElementsByClassName('output')[0].innerHTML
    if (output.length === 0 && operator === '-') {
      writeToOutput(operator)
    } else if (endsInOperator(output)) {
      clearCharacter()
      writeToOutput(' ' + operator + ' ')
    } else {
      writeToOutput(' ' + operator + ' ')
    }
  })
}

function writeToOutput (x) {
  document.getElementsByClassName('output')[0].innerHTML += x
}

function clearCharacter () {
  var output = document.getElementsByClassName('output')[0].innerHTML
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
  if (checkIfReusing) {
    clearAll()
    checkIfReusing = false
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
    // check for exponents and resolve them
    resolveOperator(args, '^', Math.pow)
    // check for multiplication/division and resolve them
    var i = 1
    while (i < args.length) {
      if (args[i] === 'x') {
        args[i + 1] = args[i - 1] * args[i + 1]
        args.splice(i - 1, 2)
        i = 1
        continue
      } if (args[i] === '/') {
        args[i + 1] = args[i - 1] / args[i + 1]
        args.splice(i - 1, 2)
        i = 1
        continue
      } i += 2
    }i = 1
    // check for addition/subtraction and resolve them
    while (i < args.length) {
      if (args[i] === '+') {
        // using Number() here to avoid accidental string concatonation instead of addition
        args[i + 1] = Number(args[i - 1]) + Number(args[i + 1])
        args.splice(i - 1, 2)
        i = 1
        continue
      } if (args[i] === '-') {
        args[i + 1] = args[i - 1] - args[i + 1]
        args.splice(i - 1, 2)
        i = 1
        continue
      } i += 2
    } document.getElementsByClassName('output')[0].innerHTML = args[0]
    checkIfReusing = true
  }
}

function resolveOperator (args, op, fn) {
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
  return Number(x + y)
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
