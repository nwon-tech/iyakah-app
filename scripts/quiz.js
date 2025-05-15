document.addEventListener("DOMContentLoaded", () => {
  
  let userIp = "Unknown";

  const fetchUserIp = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      if (data && data.ip) {
        userIp = data.ip;
        console.log("User IP:", userIp);
      } else {
        throw new Error("No IP in response");
      }
    } catch (err) {
      console.warn("Could not retrieve IP address.", err);
    }
  };

  //  list of questions
  const allQuestions = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
    {
      id: 6,
      question:
        "Which of the following online behaviors is NOT considered a responsible example of digital citizenship?",
      options: [
        "Respecting others' opinions and viewpoints in online discussions.",
        "Sharing personal information and passwords freely on social media.",
        "Citing sources properly when using online content for schoolwork.",
      ],
      correct: 1,
      mark: 1,
    },
    {
      id: 7,
      question:
        "If someone puts copyrighted material on the internet and another person wants to use it, that person should:",
      options: [
        "Not user the information because it is too much trouble.",
        "Ask permission from the author or at least cite the source",
        "Take it, and use it as they want.",
      ],
      correct: 1,
      mark: 1,
    },
    {
      id: 8,
      question: "When dealing with strangers, online users should:",
      options: [
        "Give personal information freely.",
        "Be cautious about giving information",
        "Not tell anyone about the people they meet online.",
      ],
      correct: 1,
      mark: 1,
    },
    {
      id: 9,
      question: "Information on the internet is:",
      options: [
        "Always true and reliable.",
        "Not always true and reliable.",
        "Only true if it is from a government source.",
      ],
      correct: 1,
      mark: 1,
    },
    {
      id: 10,
      question: "What are some useful clues to spot AI-generated images?",
      options: [
        "Unnatural features, odd backgrounds, and inconsistent lighting.",
        "Perfect symmetry and flawless skin.",
        "High resolution and vibrant colors.",
      ],
      correct: 1,
      mark: 1,
    },
    {
      id: 11,
      question:
        "Email authentication can help protect against phishing attacks. True or False?",
      options: ["True", "False"],
      correct: 0,
      mark: 1,
    },
    {
      id: 12,
      question:
        "If you fall for a phishing scam, what should you do to limit the damage?",
      options: [
        "Delete the phising email and forget about it.",
        "Change any compromised passwords and monitor your accounts for unusual activity.",
        "Unplug the computer.",
      ],
      correct: 0,
      mark: 1,
    },
    {
      id: 13,
      question:
        "You can tell whether a link in email will take you to a genuine website, for example belonging to a bank, without risk, by:",
      options: [
        "Hovering over the link to see the actual URL it points to.",
        "Clicking on the link to see where it takes you.",
        "Ignoring the link and going directly to the bank's website.",
      ],
      correct: 0,
      mark: 1,
    },
    {
      id: 14,
      question:
        "When reading the news, different viewpoints will infer different meanings. As readers, we need to:",
      options: [
        "Be aware of our own biases and try to understand the perspectives of others.",
        "Only read articles that confirm our own beliefs.",
        "Ignore any viewpoints that differ from our own.",
      ],
      correct: 0,
      mark: 1,
    },
    {
      id: 15,
      question:
        "If we suspect a news article being published is heavily sensationalised, what can we do about it:",
      options: [
        "Share it anyway, it’s just a bit of fun.",
        "Report it to the platform or website hosting it.",
        "Ignore it, it’s not my problem.",
      ],
      correct: 1,
      mark: 1,
    },
  ];

  // Shuffle utility
  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  // Select 5 random questions on load
  const selectedQuestions = shuffleArray([...allQuestions]).slice(0, 5);

  let currentQuestion = 0;
  let userAnswers = Array(selectedQuestions.length).fill(null);

  const quizContent = document.getElementById("quiz-content");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progressText = document.getElementById("question-progress");

  function updateProgress() {
    progressText.textContent = `Question ${currentQuestion + 1} of ${
      selectedQuestions.length
    }`;
  }

  function loadQuestion(index) {
    const q = selectedQuestions[index];
    let html = `<h2>Question ${index + 1}</h2><p>${q.question}</p><form>`;
    q.options.forEach((option, i) => {
      const checked = userAnswers[index] === i ? "checked" : "";
      html += `<label><input type="radio" name="answer" value="${i}" ${checked}/> ${option}</label><br/>`;
    });
    html += `</form>`;
    quizContent.innerHTML = html;
    updateButtons();
    updateProgress();
  }

  function updateButtons() {
    prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
    nextBtn.textContent =
      currentQuestion === selectedQuestions.length - 1 ? "Submit" : "Next";
  }

  function saveAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
      userAnswers[currentQuestion] = parseInt(selected.value);
    }
  }

  async function showResult() {

    // Ensures IP is fetched before proceeding
    await fetchUserIp(); 

    // prepare the variables for the API call
    let score = 0;
    const questionList = [];
    const questionAnswer = [];
    const questionCorrect = [];

    // to capture the question ID, answer, and mark
    userAnswers.forEach((answer, i) => {
      const q = selectedQuestions[i];
      questionList.push(q.id);
      questionAnswer.push(answer === null ? -1 : answer); // -1 for unanswered
      questionCorrect.push(q.mark); // from 'mark' field
      if (answer === q.correct) score += q.mark;
    });

    const submissionData = {
      userIp,
      questionList,
      questionAnswer,
      questionCorrect,
    };

    // debugging submission data
    console.log("Submission Data:", submissionData);

    // POST
    fetch("https://www.pollucheck8.com:8088/answer/addAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("Server Response:", response);
        // Handle response data here
        const addNumber = response.data?.addNumber || 0;
        const allNumber = response.data?.allNumber || 0;

        document.getElementById(
          "comparison-result"
        ).innerHTML += `<br/><strong>You are part of a community! ${addNumber} more users like you have taken the quiz out of ${allNumber} total.</strong>`;
      })
      .catch((err) => {
        console.error("Error submitting quiz:", err);
        document.getElementById(
          "comparison-result"
        ).innerHTML += `<br/><span style="color:red;">Could not send your data. Try again later.</span>`;
      });
    userAnswers.forEach((answer, i) => {
      if (answer === selectedQuestions[i].correct) {
        score += selectedQuestions[i].mark;
      }
    });

    const total = selectedQuestions.reduce((sum, q) => sum + q.mark, 0);
    let resultMessage =
      score < 2
        ? "Time to boost your awareness. Start with our detection tools!"
        : score < 4
        ? "You're learning — stay alert and keep improving."
        : "You're a savvy digital citizen!";

    let resultHTML = `<div class="result">Quiz Completed!<br/>Your Score: ${score} / ${total}</div>`;
    resultHTML += `<div style="text-align:center; font-size:1.5rem;"><p>${resultMessage}</p></div>`;

    resultHTML += `<div id="comparison-result">Comparing with other users...</div>`;

    resultHTML += `<div class="controls">
      <button onclick="reviewAnswers()">Review Answers</button>
      <button onclick="restartQuiz()">Retake Quiz</button>
    </div>`;

    quizContent.innerHTML = resultHTML;
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";

    // sendScoreToServer(score, total); // Call the backend
  }

  // This function sends score to your Java backend and receives comparison
  function sendScoreToServer(score, total) {
    const endpoint = "https://your-java-server.com/api/compare";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, total }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Example structure: { betterThanPercent: 72 }
        document.getElementById(
          "comparison-result"
        ).innerHTML = `You scored better than <strong>${data.betterThanPercent}%</strong> of users.`;
      })
      .catch(() => {
        document.getElementById("comparison-result").innerHTML =
          "Comparison data not available at the moment.";
      });
  }

  // Expose these for buttons
  window.reviewAnswers = function () {
    let html = `<h2>Review Your Answers</h2>`;
    selectedQuestions.forEach((q, i) => {
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
    html += `<div class="controls"><button onclick="restartQuiz()">Retake Quiz</button></div>`;
    quizContent.innerHTML = html;
    progressText.textContent = "";
  };

  window.restartQuiz = function () {
    currentQuestion = 0;
    userAnswers = Array(selectedQuestions.length).fill(null);
    loadQuestion(currentQuestion);
    prevBtn.style.display = "inline-block";
    nextBtn.style.display = "inline-block";
  };

  // Event Listeners
  prevBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion > 0) currentQuestion--;
    loadQuestion(currentQuestion);
  });

  nextBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion < selectedQuestions.length - 1) {
      currentQuestion++;
      loadQuestion(currentQuestion);
    } else {
      showResult();
    }
  });

  loadQuestion(currentQuestion);

  // loading animation in case the API is slow
  //   document.getElementById("quiz-content").innerHTML = `
  //   <div style="text-align:center; font-size:1.2rem;">
  //     Submitting your answers...<br/>
  //     <img src="spinner.gif" alt="Loading..." />
  //   </div>
  // `;
});
