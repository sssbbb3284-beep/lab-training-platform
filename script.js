let currentStateIndex = 0;
let currentStepIndex = 0;
let score = 100;

const startBtn = document.getElementById("startBtn");
const homeSection = document.getElementById("home");
const rotateSection = document.getElementById("rotate");
const gameSection = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const stateDisplay = document.getElementById("state");
const finalQuestionEl = document.getElementById("finalQuestion");

function updateGameDisplay(){
  scoreDisplay.textContent = "النقاط: " + score;
  stateDisplay.textContent = "الحالة " + (currentStateIndex + 1);
}

// التحقق من اتجاه الشاشة
function checkOrientation() {
  if (window.innerWidth > window.innerHeight) {
    rotateSection.style.display = "none";
    gameSection.style.display = "block";
    updateGameDisplay();
  } else {
    rotateSection.style.display = "flex";
    gameSection.style.display = "none";
  }
}

startBtn.addEventListener("click", () => {
  homeSection.style.display = "none";
  checkOrientation();
});

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", () => updateGameDisplay());

// =========================
// تعريف الحالات
// =========================
const states = [
  {
    number: 1,
    images: ["image1.jpg","image2.jpg","image3.jpg","image4.jpg","image5.jpg","image6.jpg"],
    question: "هل تقبل العينة؟",
    answers: [
      {text:"نعم", correct:true, penalty:0},
      {text:"لا", correct:false, penalty:10}
    ]
  },
  {
    number: 2,
    images: ["image1.jpg","image2.jpg","image3.jpg","image4.jpg","image5.jpg","image6b.jpg"],
    question: "هل العينة الجديدة مقبولة؟",
    answers: [
      {text:"نعم", correct:true, penalty:0},
      {text:"لا", correct:false, penalty:5}
    ]
  },
  {
    number: 3,
    images: ["img1c.jpg","img2c.jpg","img3c.jpg","img4c.jpg","img5c.jpg","img6c.jpg"],
    question: "سؤال الحالة الثالثة",
    answers: [
      {text:"خيار 1", correct:true, penalty:0},
      {text:"خيار 2", correct:false, penalty:15}
    ]
  }
];

// =========================
// الانتقال بين الصور
// =========================
function showStep(){
  const state = states[currentStateIndex];
  const steps = state.images;

  if(currentStepIndex < steps.length){
    for(let i=1;i<=6;i++){
      const el = document.getElementById(`step${i}`);
      el.style.display="none";
      const imgEl = el.querySelector(".game-image");
      if(i-1 < steps.length){
        imgEl.src = steps[i-1];
      }
    }

    const stepEl = document.getElementById(`step${currentStepIndex+1}`);
    stepEl.style.display="block";

    const hotspot = document.getElementById(`hotspot${currentStepIndex+1}`);
    hotspot.addEventListener("click", ()=>{
      currentStepIndex++;
      showStep();
    }, {once:true});

  } else {
    showQuestion();
  }
}

// =========================
// السؤال النهائي
// =========================
function showQuestion(){
  const state = states[currentStateIndex];
  finalQuestionEl.style.display = "block";
  finalQuestionEl.querySelector("p").textContent = state.question;

  const buttons = finalQuestionEl.querySelectorAll("button");
  buttons.forEach((btn, idx)=>{
    const answer = state.answers[idx];
    btn.textContent = answer.text;
    btn.onclick = ()=>{
      if(!answer.correct){
        alert(`خطأ! سيتم خصم ${answer.penalty} نقاط.`);
        score -= answer.penalty;
      } else {
        alert("إجابتك صحيحة!");
      }

      updateGameDisplay();
      finalQuestionEl.style.display = "none";
      currentStateIndex++;
      currentStepIndex = 0;
      if(currentStateIndex < states.length){
        showStep();
      } else {
        alert("انتهت جميع الحالات!");
      }
    }
  });
}

// بدء أول حالة
showStep();
