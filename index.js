//Random quotes api
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//Display random quotes
const renderNewQuote = async () => {
    //Fetch content from quote api url
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    //Array of chars in quote
    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });
    quoteSection.innerHTML += arr.join("");
};

//Logic to compare input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    //Array of user input chars
    let userInputChars = userInput.value.split("");
    //Loop through each char in quote
    quoteChars.forEach((char, index) => {
        //Check chars with quote chars
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        //If user hasn't entered anything or backspaced
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        }
        //if user entered wrong char
        else {
            if (!char.classList.contains("fail")) {
                //increament and displaying mistakes
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        //Return true if all chars are correct
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
 
        //End test if all chars are correct
        if (check) {
            displayResult();
        }
        // or end test if atleast 80% of char are correct
    });

});

//Update timer
function updateTimer() {
    if (time == 0) {
        //End test if reaches 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

//Set timer of the test
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

//End test
const displayResult = () => {
    //Display the result
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";   
    wpmScore = (userInput.value.length / 5 / timeTaken).toFixed(2);
    document.getElementById("wpm").innerText = wpmScore + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";  
    document.getElementById("wpm-score").innerText = wpmScore;
 
};

//Start test
const startTest = () => {
    mistakes = 0;
    timer = "60";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    document.getElementById("reset-test").disabled = false;
    if (!testStarted) {
        timeReduce();
        testStarted = true;
    }
}

//Reset test
function resetTest() {
    clearInterval(timer);
    time = 60;
    mistakes = 0;
    userInput.value = "";
    quoteSection.innerHTML = "";
    document.getElementById("mistakes").innerText = mistakes;
    document.getElementById("timer").innerText = time + "s";
    document.getElementById("reset-test").disabled = true;
    document.getElementById("start-test").disabled = false;
    document.getElementById("start-test").innerHTML = "Start Test";
    document.getElementById("stop-test").disabled = false;
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("wpm").innerText = "";
    document.getElementById("accuracy").innerText = "";
    renderNewQuote();
   
  }
  
    // generate a new quote and render it  
window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}
