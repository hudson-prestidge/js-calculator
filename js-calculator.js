document.addEventListener('DOMContentLoaded', startCalc)

var checkIfReusing = false

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
  document.getElementById('equals-button').addEventListener('click', evaluate)
}

function addNumberButtonListener (button) {
  var number = button.innerHTML
  button.addEventListener('click', function () {
    writeToOutput(number)
  })
}

function addOperatorButtonListener (button) {
  var operator = button.innerHTML
  button.addEventListener('click', function () {
    var output = document.getElementsByClassName('output')[0].innerHTML
    // the logic here seems unwieldy, could use revisiting. currently allows for a - by itself if output is empty, or if there's an open bracket on the end.
    if ((output.charAt(output.length - 1) === '(' || output.length === 0) && operator === '-') {
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

function endsInOperator (str) {
  return (str.substring(str.length - 3, str.length) === ' x ' ||
    str.substring(str.length - 3, str.length) === ' - ' ||
    str.substring(str.length - 3, str.length) === ' / ' ||
    str.substring(str.length - 3, str.length) === ' + ' ||
    str.substring(str.length - 3, str.length) === ' ^ ')
}

function evaluate () {
  var input = document.getElementsByClassName('output')[0].innerHTML.split(' ')
  // if the input ends in an operator, trim the last empty element created by splitting
  if (input[input.length - 1] === '') {
    input.splice(input.length - 1, 1)
  // check if there's enough arguments to bother evaluating. If there's less than 3 arguments, none of the binary operators can function so may as well do nothing.'
  } else if (input.length > 2) {
    // check for brackets

    // check for exponents and resolve them
    var i = 1
    while (i < input.length) {
      if (input[i] === '^') {
        input[i + 1] = Math.pow(input[i - 1], input[i + 1])
        input.splice(i - 1, 2)
        i = 1
        continue
      }i += 2
    }i = 1
    // check for multiplication/division and resolve them
    i = 1
    while (i < input.length) {
      if (input[i] === 'x') {
        input[i + 1] = input[i - 1] * input[i + 1]
        input.splice(i - 1, 2)
        i = 1
        continue
      } if (input[i] === '/') {
        input[i + 1] = input[i - 1] / input[i + 1]
        input.splice(i - 1, 2)
        i = 1
        continue
      } i += 2
    }i = 1
    // check for addition/subtraction and resolve them
    while (i < input.length) {
      if (input[i] === '+') {
        // using Number() here to avoid accidental string concatonation instead of addition
        input[i + 1] = Number(input[i - 1]) + Number(input[i + 1])
        input.splice(i - 1, 2)
        i = 1
        continue
      } if (input[i] === '-') {
        input[i + 1] = input[i - 1] - input[i + 1]
        input.splice(i - 1, 2)
        i = 1
        continue
      } i += 2
    } document.getElementsByClassName('output')[0].innerHTML = input[0]
    checkIfReusing = true
  }
}

