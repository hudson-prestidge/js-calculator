document.addEventListener('DOMContentLoaded', startCalc)

var currentOperatorsList = []

function Operator (character) {
  this.character = character
  this.firstArgument = getFirstArgument() // this currently doesn't function right! returns empty string every time.
}

function startCalc () {
  var numberSection = document.getElementsByClassName('number-section')[0]
  for (var i = 0; i < numberSection.children.length; i++) {
    addNumberButtonListener(numberSection.children[i])
  }
  var operatorSection = document.getElementsByClassName('operator-section')[0]
  for (var j = 0; j < operatorSection.children.length; j++) {
    addOperatorButtonListener(operatorSection.children[j])
  } document.getElementById('clear-button').addEventListener('click', clearCharacter)
  document.getElementById('equals-button').addEventListener('click', evaluate)
}

function addNumberButtonListener (button) {
  var number = button.innerHTML
  button.addEventListener('click', function () {
    writeToOutput(number)
  })
}

function addOperatorButtonListener (button) {
  var operator = new Operator(button.innerHTML)
  button.addEventListener('click', function () {
    var output = document.getElementsByClassName('output')[0].innerHTML
    if (endsInOperator(output)) {
      clearCharacter()
    }
    writeToOutput(' ' + operator.character + ' ')
    currentOperatorsList.push(operator)
  })
}

function writeToOutput (x) {
  document.getElementsByClassName('output')[0].innerHTML += x
}

function clearCharacter () {
  var output = document.getElementsByClassName('output')[0].innerHTML
  if (endsInOperator(output)) {
    document.getElementsByClassName('output')[0].innerHTML = output.substring(0, output.length - 3)
    currentOperatorsList.pop()
  } else {
    document.getElementsByClassName('output')[0].innerHTML = output.substring(0, output.length - 1)
  }
}

function getFirstArgument () {
  return document.getElementsByClassName('output')[0].innerHTML
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
  var total = Number(input[0])
  // check for brackets
  // check for multiplication/division and resolve them
  for (var i = 1; i < input.length; i += 2) {
    if (input[i] === 'x') {
      total *= Number(input[i + 1])
    }
  }
  // check for addition/subtraction and resolve them
  for (var j = 1; j < input.length; j += 2) {
    if (input[j] === '+') {
      total += Number(input[j + 1])
    }
  } document.getElementsByClassName('output')[0].innerHTML = total
  currentOperatorsList = []
}
