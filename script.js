const states = [
  {
    images: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"],
    question: "هل تقبل العينة؟",
    correct: true,
    reason: "البيانات كاملة وسليمة، لذلك يجب قبول العينة."
  },
  {
    images: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","2.jpg"],
    question: "هل تقبل العينة؟",
    correct: false,
    reason: "العينة غير مطابقة لشروط الفحص."
  }
];

let score = 100;
let currentState = 0;
let currentImage = 0;

const rotateNotice = document.getElementById("rotate");
const gameSection = document.getElementById("game");
const homeSection = document.getElementById("home");

function checkOrientation() {
  if (window.innerHeight > window.innerWidth) {
    // الجوال عامودي
    rotateNotice.style.display = "flex";
    gameSection.style.display = "none";
    return false;
  } else {
    // الجوال أفقي
    rotateNotice.style.display = "none";
    return true;
  }
}

// تحقق عند الضغط على زر البداية
document.getElementById("startBtn").onclick = () => {
  if (!checkOrientation()) return; // توقف إذا الجوال عمودي

  homeSection.style.display = "none";
  gameSection.style.display = "block";
  loadImage();
};

// تحقق عند تغيير حجم/اتجاه الجوال أثناء اللعبة
window.addEventListener("resize", () => {
  checkOrientation();
});


const gameImage = document.getElementById("gameImage");
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");

document.getElementById("startBtn").onclick = () => {
  document.getElementById("home").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadImage();
};

function loadImage() {
  gameImage.src = states[currentState].images[currentImage];
  questionBox.style.display = "none";
  updateUI();
}

gameImage.onclick = () => {
  if (currentImage < 5) {
    currentImage++;
    loadImage();
  } else {
    questionText.textContent = states[currentState].question;
    questionBox.style.display = "block";
  }
};

function answer(userAnswer) {
  const correct = states[currentState].correct;

  if (userAnswer !== correct) {
    score -= 10;
    showResult(
      "إجابة خاطئة ❌",
      states[currentState].reason,
      true
    );
  } else {
    showResult(
      "إجابة صحيحة ✅",
      "تم اتخاذ القرار الصحيح.",
      false
    );
  }
}

function showResult(title, reason, deducted) {
  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      background:#020617;
      color:white;
      text-align:center;
      padding:20px;
    ">
      <div style="max-width:400px;">
        <h2>${title}</h2>
        <p style="margin:15px 0;">${reason}</p>
        ${deducted ? `<p style="color:#f87171;">-10 نقاط</p>` : ``}
        <button
          style="
            margin-top:20px;
            padding:12px 35px;
            border:none;
            border-radius:25px;
            background:#22c55e;
            color:#022c22;
            font-size:16px;
          "
          onclick="nextState()"
        >
          متابعة
        </button>
      </div>
    </div>
  `;
}

function nextState() {
  currentState++;        // انتقل للحالة التالية
  currentImage = 0;      // ابدأ من الصورة الأولى

  // إذا انتهت كل الحالات
  if (currentState >= states.length) {
    document.body.innerHTML = `
      <div style="
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        text-align:center;
        padding:20px;
      ">
        <div>
          <h2>انتهت جميع الحالات 👏</h2>
          <p>مجموع النقاط: ${score}</p>
        </div>
      </div>
    `;
    return;
  }

  // تحديث واجهة اللعبة للحالة الجديدة
  gameImage.src = states[currentState].images[currentImage];
  questionText.textContent = states[currentState].question;
  questionBox.style.display = "none";

  updateUI(); // تحديث رقم الحالة والنقاط
}


function updateUI() {
  document.getElementById("scoreText").textContent = "النقاط: " + score;
  document.getElementById("stateText").textContent = "الحالة " + (currentState + 1);
}
