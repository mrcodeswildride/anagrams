var lettersInput = document.getElementById("letters");
var findWordsButton = document.getElementById("findWords");
var showAllDiv = document.getElementById("showAllDiv");
var showAllCheckbox = document.getElementById("showAll");
var messageParagraph = document.getElementById("message");
var wordsDiv = document.getElementById("words");

var dict = {};
var wordCombos;
var wordCount;

lettersInput.addEventListener("keydown", lettersInputKeydown);
findWordsButton.addEventListener("click", findWords);
showAllCheckbox.addEventListener("change", toggleCombos);

lettersInput.focus();
fetchDict();

function lettersInputKeydown(event) {
    if (event.keyCode == 13 && !findWordsButton.disabled) {
        findWords();
    }
}

function findWords() {
    let letters = lettersInput.value.trim().toLowerCase();

    if (letters != "") {
        showAllDiv.classList.add("hidden");
        wordsDiv.innerHTML = "";

        if (letters.length <= 10) {
            findWordsButton.disabled = true;
            messageParagraph.innerHTML = "Finding all permutations...";

            setTimeout(function() {
                let startTime = Date.now();
                wordCombos = getWordCombos(letters, {});

                let noun = (wordCombos.length == 1) ? "permutation" : "permutations";
                let seconds = (Date.now() - startTime) / 1000;
                messageParagraph.innerHTML = "Found " + wordCombos.length + " " + noun + " in " + seconds.toFixed(3) + " seconds, now finding actual words...";

                setTimeout(function() {
                    wordCount = 0;

                    for (let i = 0; i < wordCombos.length; i++) {
                        if (dict[wordCombos[i]]) {
                            let wordDiv = document.createElement("div");
                            wordDiv.classList.add("word");
                            wordDiv.classList.add("valid");
                            wordDiv.innerHTML = wordCombos[i];
                            wordsDiv.appendChild(wordDiv);
                            wordCount++;
                        }
                    }

                    findWordsButton.disabled = false;

                    if (wordCombos.length <= 20000) {
                        showAllCheckbox.checked = false;
                        showAllDiv.classList.remove("hidden");
                    }

                    noun = (wordCount == 1) ? "word" : "words";
                    seconds = (Date.now() - startTime) / 1000;
                    messageParagraph.innerHTML = "Found " + wordCount + " " + noun + ". Total time: " + seconds.toFixed(3) + " seconds";
                }, 10);
            }, 10);
        }
        else {
            messageParagraph.innerHTML = "Input cannot have more than 10 letters.";
        }
    }
}

function toggleCombos() {
    findWordsButton.disabled = true;
    showAllCheckbox.disabled = true;
    wordsDiv.innerHTML = "";

    if (showAllCheckbox.checked) {
        messageParagraph.innerHTML = "Showing all permutations...";
    }
    else {
        messageParagraph.innerHTML = "Showing actual words only...";
    }

    setTimeout(function() {
        for (let i = 0; i < wordCombos.length; i++) {
            if (showAllCheckbox.checked || dict[wordCombos[i]]) {
                let wordDiv = document.createElement("div");
                wordDiv.classList.add("word");
                wordDiv.innerHTML = wordCombos[i];
                wordsDiv.appendChild(wordDiv);

                if (dict[wordCombos[i]]) {
                    wordDiv.classList.add("valid");
                }
            }
        }

        findWordsButton.disabled = false;
        showAllCheckbox.disabled = false;

        if (showAllCheckbox.checked) {
            let noun = (wordCombos.length == 1) ? "permutation" : "permutations";
            messageParagraph.innerHTML = "Showing " + wordCombos.length + " " + noun + ".";
        }
        else {
            let noun = (wordCount == 1) ? "word" : "words";
            messageParagraph.innerHTML = "Showing " + wordCount + " " + noun + ".";
        }
    }, 10);
}

function getWordCombos(input, wordsFound) {
    if (input.length == 1) {
        return [input];
    }
    else {
        var firstLetter = input[0];
        var allButFirstLetter = input.substring(1);

        var subwords = getWordCombos(allButFirstLetter, wordsFound);
        var combos = [];

        for (var i = 0; i < subwords.length; i++) {
            var subword = subwords[i];

            for (var j = 0; j < subword.length + 1; j++) {
                var combo = subword.substring(0, j) + firstLetter + subword.substring(j);

                if (!wordsFound[combo]) {
                    wordsFound[combo] = true;
                    combos.push(combo);
                }
            }
        }

        return combos;
    }
}

function fetchDict() {
    var request = new XMLHttpRequest();
    request.open("GET", "dictionary.txt");
    request.addEventListener("load", createDict);
    request.send();
}

function createDict() {
    var words = this.response.split("\n");

    for (var i = 0; i < words.length; i++) {
        dict[words[i]] = true;
    }
}
