document.addEventListener("DOMContentLoaded", () => {
  // Quiz questions array
  const questions = [
    {
      question:
        "You see a website offering a free iPhone if you click a link. What do you do?",
      options: [
        "Click and enter my info right away",
        "Double-check the URL and do a quick search to see if it’s a scam",
        "Ignore it, it’s obviously fake",
      ],
      correct: 1,
      mark: 1,
    },
    {
      question:
        "A friend sends you an article with shocking news. What’s your first step?",
      options: [
        "Share it immediately — it’s interesting!",
        "Check if other credible sources are reporting the same",
        "Comment without reading it",
      ],
      correct: 1,
      mark: 1,
    },
    {
      question:
        "You’re about to upload a photo online. What do you consider first?",
      options: [
        "Whether I look good in it",
        "Whether it’s appropriate, has location data, or might affect my privacy",
        "Whether it gets likes",
      ],
      correct: 1,
      mark: 1,
    },
    {
      question:
        "An unknown website asks for your credit card details. What do you check first?",
      options: [
        "If the design looks trustworthy",
        "If the URL is secure (https), and whether the site is verified",
        "If they promise fast delivery",
      ],
      correct: 1,
      mark: 1,
    },
    {
      question:
        "You edited an image with AI tools. Do you need to tell others it’s not real?",
      options: [
        "No, it’s obvious",
        "Yes, transparency matters online",
        "Only if someone asks",
      ],
      correct: 1,
      mark: 1,
    },
  ];

  let currentQuestion = 0;
  let userAnswers = Array(questions.length).fill(null);

  const quizContent = document.getElementById("quiz-content");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  function loadQuestion(index) {
    let q = questions[index];
    let html = `<h2>Question ${index + 1}</h2><p>${q.question}</p><form>`;
    q.options.forEach((option, i) => {
      const checked = userAnswers[index] === i ? "checked" : "";
      html += `
            <label>
              <input type="radio" name="answer" value="${i}" ${checked}/> ${option}
            </label><br/>
          `;
    });
    html += `</form>`;
    quizContent.innerHTML = html;
    updateButtons();
  }

  function updateButtons() {
    prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
    nextBtn.textContent =
      currentQuestion === questions.length - 1 ? "Submit" : "Next";
  }

  function saveAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
      userAnswers[currentQuestion] = parseInt(selected.value);
    }
  }

  function showResult() {
    let score = 0;
    let resultHTML = `<div class="result">Quiz Completed!<br/>`;
    let resultMessage = "";

    userAnswers.forEach((answer, i) => {
      if (answer === questions[i].correct) {
        score += questions[i].mark;
      }
    });

    if (score < 2) {
      resultMessage =
        "Time to boost your awareness. Start with our detection tools!";
    } else if (score < 4) {
      resultMessage = "You're learning — stay alert and keep improving.";
    } else {
      resultMessage = "You're a savvy digital citizen!";
    }

    resultHTML += `Your Score: ${score} / ${questions.reduce(
      (sum, q) => sum + q.mark,
      0
    )}</div>`;
    resultHTML += `<div style="text-align:center; font-size:1.5rem;"><p>${resultMessage}</p></div>`;
    resultHTML += `
          <div class="controls">
            <button onclick="reviewAnswers()">Review Answers</button>
            <button onclick="restartQuiz()">Retake Quiz</button>
          </div>
        `;
    quizContent.innerHTML = resultHTML;
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }

  // Expose to global scope for result sharing if necessary
  window.reviewAnswers = function () {
    let html = `<h2>Review Your Answers</h2>`;
    questions.forEach((q, i) => {
      let userAnswer = userAnswers[i];
      let isCorrect = userAnswer === q.correct;
      html += `<div class="review-answer">
            <strong>Q${i + 1}: ${q.question}</strong><br/>
            Your Answer: <span class="${isCorrect ? "correct" : "incorrect"}">${
        q.options[userAnswer] || "No Answer"
      }</span><br/>
            Correct Answer: <span class="correct">${q.options[q.correct]}</span>
          </div>`;
    });
    html += `<div class="controls">
          <button onclick="restartQuiz()">Retake Quiz</button>
        </div>`;
    quizContent.innerHTML = html;
  };

  window.restartQuiz = function () {
    currentQuestion = 0;
    userAnswers = Array(questions.length).fill(null);
    loadQuestion(currentQuestion);
    prevBtn.style.display = "inline-block";
    nextBtn.style.display = "inline-block";
  };

  prevBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion > 0) currentQuestion--;
    loadQuestion(currentQuestion);
  });

  nextBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion(currentQuestion);
    } else {
      showResult();
    }
  });

  loadQuestion(currentQuestion);
});
