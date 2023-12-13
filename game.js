const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQues = {};
let acceptAns = false;
let score = 0;
let quesCount = 0;
let availableQues=[];

let questions = [];

fetch(
    'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

const correct_bonus=10;
const max_ques=10;

startGame = () => {
    quesCount = 0;
    score = 0;
    availableQues = [...questions];
    console.log(availableQues);
    getNewQues();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQues = () => {

    if (availableQues.length === 0 || quesCount >= max_ques) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("/end.html");
    }
    quesCount++;
    progressText.innerHTML = `Question ${quesCount}/${max_ques}`;
    progressBarFull.style.width = `${(quesCount / max_ques) * 100}%`;

    const quesIndex = Math.floor(Math.random() * availableQues.length);
    currentQues = availableQues[quesIndex];
    question.innerText = currentQues.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQues['choice' + number];
    });

    availableQues.splice(quesIndex, 1);
    acceptAns = true;
};

choices.forEach(choice =>{
    choice.addEventListener("click", e=> {
        if(!acceptAns) return;

        acceptAns = false;
        const selectedChoice = e.target;
        const selectedAns = selectedChoice.dataset["number"];

        const classToApply = selectedAns == currentQues.answer ? "correct" : "incorrect";

        if (classToApply === 'correct') {
            incrementScore(correct_bonus);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQues();
        }, 1000)
    });
});

incrementScore = num =>{
    score += num;
    scoreText.innerText = score;
}

