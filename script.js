let letters = document.getElementById(`letters`)
let wordsButton = document.getElementById(`wordsButton`)
let showAllDiv = document.getElementById(`showAllDiv`)
let showAllCheckbox = document.getElementById(`showAllCheckbox`)
let box = document.getElementById(`box`)

let finding = false
let words

let dictionary = {}
fetchDictionary()

wordsButton.addEventListener(`click`, startFindWords)
showAllCheckbox.addEventListener(`change`, toggleShowAll)

letters.addEventListener(`keydown`, keyPressed)
letters.focus()

function startFindWords() {
  let lettersValue = letters.value.trim().toLowerCase()

  if (!finding) {
    showAllCheckbox.checked = false

    if (lettersValue.length > 10) {
      box.innerHTML = `Input cannot have more than 10 letters.`
      showHideCheckbox(lettersValue)
    } else {
      box.innerHTML = `Finding all permutations...`
      finding = true

      setTimeout(findWords, 10, lettersValue)
    }
  }
}

function findWords(lettersValue) {
  words = [``]
  let foundWords = {}

  for (let character of lettersValue) {
    let newWords = []

    for (let word of words) {
      for (let i = 0; i <= word.length; i++) {
        let beforeChar = word.substring(0, i)
        let afterChar = word.substring(i)
        let newWord = `${beforeChar}${character}${afterChar}`

        if (!foundWords[newWord]) {
          newWords.push(newWord)
          foundWords[newWord] = true
        }
      }
    }

    words = newWords
  }

  showHideCheckbox(lettersValue)
  showWords()
}

function showWords() {
  box.innerHTML = ``
  let wordsFound = false

  for (let word of words) {
    if (dictionary[word] || showAllCheckbox.checked) {
      let wordDiv = makeWordDiv(word)

      if (dictionary[word]) {
        labelValid(wordDiv)
      }

      wordsFound = true
    }
  }

  if (!wordsFound) {
    box.innerHTML = `No words found.`
  }

  finding = false
}

function makeWordDiv(word) {
  let wordDiv = document.createElement(`div`)
  wordDiv.classList.add(`word`)
  wordDiv.innerHTML = word
  box.appendChild(wordDiv)

  return wordDiv
}

function labelValid(wordDiv) {
  wordDiv.classList.add(`valid`)
}

function showHideCheckbox(lettersValue) {
  if (lettersValue.length <= 7) {
    showAllDiv.style.display = `inline-block`
  } else {
    showAllDiv.style.display = `none`
  }
}

function toggleShowAll() {
  if (!finding) {
    if (showAllCheckbox.checked) {
      box.innerHTML = `Showing all permutations...`
      finding = true

      setTimeout(showWords, 10)
    } else {
      showWords()
    }
  }
}

function fetchDictionary() {
  let request = new XMLHttpRequest()
  request.addEventListener(`load`, makeDictionary)
  request.open(`GET`, `dictionary.txt`)
  request.send()
}

function makeDictionary() {
  let words = this.response.split(/\r?\n/)

  for (let word of words) {
    dictionary[word] = true
  }
}

function keyPressed(event) {
  if (event.keyCode == 13) {
    startFindWords()
  }
}
