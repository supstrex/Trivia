//declaring all required elements
let quizData = {};
const start_btn = document.querySelector(".start_btn button");
const players_box = document.querySelector(".players_box");
const options_box = document.querySelector(".options_box");
const exit_btn_1 = players_box.querySelector(".buttons .quit_1");
const exit_btn_2 = options_box.querySelector(".buttons .quit_2");
const restart_btn = players_box.querySelector(".buttons .restart");
const continue_btn_1 = players_box.querySelector(".buttons .continue-1");
const continue_btn_2 = options_box.querySelector(".buttons .continue-2");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const player_information_box = document.querySelector(
  ".player_information_box"
);
const usersLabel = document.querySelectorAll(".player_box");

// if start button clicked
start_btn.onclick = () => {
  players_box.classList.add("activeInfo"); //show players box
};
// if exitQuiz button clicked
exit_btn_1.onclick = () => {
  players_box.classList.remove("activeInfo"); //hide info box
};

exit_btn_2.onclick = () => {
  options_box.classList.remove("activeOption"); //hide info box
  player_information_box.classList.remove("activePlayerInformation");
  //hide info box
};

// if continueQuiz button clicked
continue_btn_1.onclick = () => {
  //selecting user input
  const input1 = document.getElementById("player1").value;
  const input2 = document.getElementById("player2").value;
  const input3 = document.getElementById("player3").value;
  const input4 = document.getElementById("player4").value;
  //selecting name elements to display on screen
  document.getElementById("name1").innerHTML = input1;
  document.getElementById("name2").innerHTML = input2;
  document.getElementById("name3").innerHTML = input3;
  document.getElementById("name4").innerHTML = input4;
  //adding information in quizeData
  quizData["Player_1"] = {
    name: input1 || "Player_1",
    xp: 0,
    questions: [],
  };
  quizData["Player_2"] = {
    name: input2 || "Player_2",
    xp: 0,
    questions: [],
  };
  quizData["Player_3"] = {
    name: input3 || "Player_3",
    xp: 0,
    questions: [],
  };
  quizData["Player_4"] = {
    name: input4 || "Player_4",
    xp: 0,
    questions: [],
  };
  player_information_box.classList.add("activePlayerInformation"); //show player information box
  players_box.classList.remove("activeInfo"); //hide info box
  options_box.classList.add("activeOption"); //show option box
};

//shuffle answers
function shuffleAnswers(rightAnswer, incorrectAnswers) {
  const array = new Array(4).fill(undefined);
  let holder = Math.floor(Math.random() * 4);
  array[holder] = rightAnswer;
  for (let i = 0, j = 0; i < 4; i++) {
    if (i !== holder) {
      array[i] = incorrectAnswers[j];
      j++;
    }
  }
  return array;
}

//function to insert the right answer among wrong ones
function generateQuestionsData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    const question = {
      numb: i + 1,
      question: data[i].question,
      answer: data[i].correct_answer,
      options: shuffleAnswers(
        data[i].correct_answer,
        data[i].incorrect_answers
      ),
    };
    result.push(question);
  }
  return result;
}

// Set active class to current user label
function setActiveUserLabel(activeUserIndex) {
  usersLabel.forEach((userLabel) => {
    userLabel.classList.remove("active");
  });

  if (typeof activeUserIndex == "number") {
    usersLabel[activeUserIndex].classList.add("active");
  }
}

function getQuestionRequest() {
  const number_of_questions =
    document.getElementById("number_of_questions").value * 4 || 40;
  const category_options =
    document.getElementById("category_options").value || "9";
  let dificulty_options =
    document.getElementById("dificulty_options").value || "easy";
  if (
    category_options === "11" ||
    category_options === "14" ||
    category_options === "21"
  ) {
    dificulty_options = "medium";
  }
  fetch(
    `https://opentdb.com/api.php?amount=${number_of_questions}&category=${category_options}&difficulty=${dificulty_options}&type=multiple`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 1; i <= 4; i++) {
        quizData[`Player_${i}`].questions = generateQuestionsData(
          data.results.slice(
            (i - 1) * (number_of_questions / 4),
            (number_of_questions / 4) * i
          )
        );
      }
    })
    .then(() => {
      options_box.classList.remove("activeOption"); //hide option box
      quiz_box.classList.add("activeQuiz"); //show quiz box
      showQuetions(0); //calling showQestions function
      queCounter(1); //passing 1 parameter to queCounter
      startTimer(15); //calling startTimer function
      startTimerLine(0); //calling startTimerLine function
      setActiveUserLabel(0); //making label background selected
    })
    .catch((e) => console.log(e));
}

// if continueQuiz button clicked
continue_btn_2.onclick = () => {
  getQuestionRequest();
};

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let counter;
let players_array = ["Player_1", "Player_2", "Player_3", "Player_4"];
let current_player_index = 0;
let counterLine;
let widthValue = 0;
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
function resetUsersScoreLabels() {
  for (let i = 1; i <= 4; i++) {
    const userScoreElement = document.getElementById(`xp${i}`);
    userScoreElement.innerText = "0 Xp";
  }
}

function resetUsersScore() {
  quizData.Player_1.xp = 0;
  quizData.Player_1.questions = [];
  quizData.Player_2.xp = 0;
  quizData.Player_2.questions = [];
  quizData.Player_3.xp = 0;
  quizData.Player_3.questions = [];
  quizData.Player_4.xp = 0;
  quizData.Player_4.questions = [];
}

restart_quiz.onclick = () => {
  quiz_box.classList.add("activeQuiz"); //show quiz box
  result_box.classList.remove("activeResult"); //hide result box
  timeValue = 15;
  que_count = 0;
  que_numb = 1;
  widthValue = 0;
  current_player_index = 0;

  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  timeText.textContent = "Time Left"; //change the text of timeText to Time Left
  next_btn.classList.remove("show"); //hide the next button
  resetUsersScore(); // reset users score
  resetUsersScoreLabels(); // reset users score label
  getQuestionRequest();
};
// if quitQuiz button clicked
quit_quiz.onclick = () => {
  window.location.reload(); //reload the current window
};
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");
// if Next Que button clicked
next_btn.onclick = () => {
  if (
    que_count <
    quizData[players_array[current_player_index]].questions.length - 1
  ) {
    //if question count is less than total question length
    que_count++; //increment the que_count value
    que_numb++; //increment the que_numb value
    showQuetions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(timeValue); //calling startTimer function
    startTimerLine(widthValue); //calling startTimerLine function
    timeText.textContent = "Time Left"; //change the timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else {
    if (current_player_index < 3) {
      current_player_index++;
      setActiveUserLabel(current_player_index);
      alert(
        `${quizData[players_array[current_player_index]].name} it is your turn!`
      );
      que_count = 0;
      que_numb = 1;
      showQuetions(que_count);
      queCounter(que_numb);
      clearInterval(counter); //clear counter
      clearInterval(counterLine); //clear counterLine
      startTimer(timeValue);
      startTimerLine(widthValue);
      timeText.textContent = "Time Left";
      next_btn.classList.remove("show");
    } else {
      clearInterval(counterLine);
      clearInterval(counter);
      showResult(); //calling showResult function
      setActiveUserLabel(null);
    }
  }
};

// getting questions and options from array
function showQuetions(index) {
  const que_text = document.querySelector(".que_text");
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag =
    "<span>" +
    quizData[players_array[current_player_index]].questions[index].numb +
    ". " +
    quizData[players_array[current_player_index]].questions[index].question +
    "</span>";
  let option_tag =
    '<div class="option"><span>' +
    quizData[players_array[current_player_index]].questions[index].options[0] +
    "</span></div>" +
    '<div class="option"><span>' +
    quizData[players_array[current_player_index]].questions[index].options[1] +
    "</span></div>" +
    '<div class="option"><span>' +
    quizData[players_array[current_player_index]].questions[index].options[2] +
    "</span></div>" +
    '<div class="option"><span>' +
    quizData[players_array[current_player_index]].questions[index].options[3] +
    "</span></div>";
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  const option = option_list.querySelectorAll(".option");
  // set onclick attribute to all available options
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

function updateUserScore() {
  quizData[players_array[current_player_index]].xp += 10;

  const activeUserLabelXp = document.getElementById(
    `xp${current_player_index + 1}`
  );

  activeUserLabelXp.innerText = `${
    quizData[players_array[current_player_index]].xp
  } XP`;
}

//if user clicked on option
function optionSelected(answer) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  let userAns = answer.textContent; //getting user selected option
  let correcAns =
    quizData[players_array[current_player_index]].questions[que_count].answer; //getting correct answer from array
  const allOptions = option_list.children.length; //getting all option items

  if (userAns == correcAns) {
    //if user selected option is equal to array's correct answer
    answer.classList.add("correct"); //adding green color to correct selected option
    updateUserScore();
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    for (i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correcAns) {
        //if there is an option which is matched to an array answer
        option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
      }
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
}

function showResult() {
  players_box.classList.remove("activeInfo"); //hide info box
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); //show result box
  const scoreText = result_box.querySelector(".score_text");

  let scoreDiv = document.createElement("div");
  scoreText.innerHTML = ""; // Unload existing board

  for (const userDataValue of Object.values(quizData)) {
    scoreDiv.innerHTML +=
      `<span>${userDataValue.name} congrats! , You got <p>` +
      `${userDataValue.xp} XP` +
      "</p></span>";
  }

  scoreText.appendChild(scoreDiv); //adding new span tag inside score_Text
}

function startTimer(time) {
  counter = setInterval(timer, 1000);

  function timer() {
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "Time Off"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns =
        quizData[players_array[current_player_index]].questions[que_count]
          .answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      next_btn.classList.add("show"); //show the next button if user selected any option
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);

  function timer() {
    time += 1; //upgrading time value with 1
    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    if (time > 549) {
      //if time value is greater than 549
      clearInterval(counterLine); //clear counterLine
    }
  }
}

function queCounter(index) {
  //creating a new span tag and passing the question number and total question
  let totalQueCounTag =
    "<span><p>" +
    index +
    "</p> of <p>" +
    quizData[players_array[current_player_index]].questions.length +
    "</p> Questions</span>";
  bottom_ques_counter.innerHTML = totalQueCounTag; //adding new span tag inside bottom_ques_counter
}
