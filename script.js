// ===================
// إعداد الحالات (صور + سؤال + الإجابة الصحيحة + السبب)
// ===================
const states = [
  {
    images: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
    question: "هل تقبل العينة؟",
    correct: true,
    reason: "البيانات كاملة وسليمة، لذلك يجب قبول العينة."
  },
  {
    images: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "2.jpg"],
    question: "هل تقبل العينة؟",
    correct: false,
    reason: "العينة غير مطابقة لشروط الفحص."
  },
  {
    images: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
    question: "هل تقبل العينة؟",
    correct: true,
    reason: "تم توثيق العينة بالشكل الصحيح."
  },
  {
    images: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
    question: "هل تقبل العينة؟",
    correct: false,
    reason: "يوجد نقص في بيانات المريض."
  }
];

// ===================
// مراجع DOM والمتغيرات
// ===================
let score = 100;
let currentState = 0;
let currentImage = 0;

const homeSection = document.getElementById("home");
const gameSection = document.getElementById("game");
const rotateSection = document.getElementById("rotateNotice");

const startBtn = document.getElementById("startBtn");
const gameImage = document.getElementById("gameImage");
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const scoreText = document.getElementById("scoreText");
const stateText = document.getElementById("stateText");

const resultModal = document.getElementById("resultModal");
const modalTitle = document.getElementById("modalTitle");
const modalReason = document.getElementById("modalReason");
const modalDelta = document.getElementById("modalDelta");
const modalContinue = document.getElementById("modalContinue");

const answerYesBtn = document.getElementById("answerYes");
const answerNoBtn = document.getElementById("answerNo");

// ===================
// وظائف عامة
// ===================
function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

function checkOrientation() {
  const landscape = isLandscape();
  // إذا أفقي: أخفي التنبيه وأظهر اللعبة. إذا عمودي: أعكس.
  rotateSection.style.display = landscape ? "none" : "flex";
  gameSection.style.display   = landscape ? "block" : "none";
  return landscape;
}

function gameStarted() {
  return homeSection.style.display === "none" && gameSection.style.display === "block";
}

function updateUI() {
  scoreText.textContent = "النقاط: " + score;
  stateText.textContent = "الحالة " + (currentState + 1);
}

function loadImage() {
  const images = states[currentState].images;
  gameImage.src = images[currentImage];
  gameImage.alt = `صورة ${currentImage + 1} من الحالة ${currentState + 1}`;
  // إخفاء السؤال حتى نصل لآخر صورة
  questionBox.style.display = "none";
  updateUI();
}

// عند خطأ تحميل الصورة (ملفات الصور غير موجودة)
gameImage.addEventListener("error", () => {
  console.warn("تعذر تحميل الصورة:", gameImage.src);
});

// تقدم عبر الصور بالنقر
function onImageClick() {
  if (currentImage < states[currentState].images.length - 1) {
    currentImage++;
    loadImage();
  } else {
    // وصلنا لنهاية الصور -> أظهر السؤال
    questionText.textContent = states[currentState].question;
    questionBox.style.display = "block";
  }
}

function answer(userAnswer) {
  const correct = states[currentState].correct;
  if (userAnswer !== correct) {
    score -= 10;
    showResult("إجابة خاطئة ❌", states[currentState].reason, true);
  } else {
    showResult("إجابة صحيحة ✅", "تم اتخاذ القرار الصحيح.", false);
  }
}

function showResult(title, reason, deducted) {
  const isLast = currentState >= states.length - 1;
  modalTitle.textContent = title;
  modalReason.textContent = reason;
  modalDelta.textContent = deducted ? "-10 نقاط" : "";

  // تغيير وظيفة وزر المتابعة حسب إن كانت آخر حالة أم لا
  modalContinue.textContent = isLast ? "إظهار النتيجة" : "متابعة";
  modalContinue.onclick = () => {
    if (isLast) {
      hideResult();
      endGame();
    } else {
      nextState();
    }
  };

  resultModal.hidden = false;
}

function hideResult() {
  resultModal.hidden = true;
}

function nextState() {
  currentState++;
  currentImage = 0;

  if (currentState >= states.length) {
    endGame();
    return;
  }

  hideResult();
  loadImage();
}

function endGame() {
  // شاشة نهائية بدون زر إعادة اللعب حسب الطلب
  gameSection.innerHTML = `
    <div class="end-screen">
      <h2>انتهت جميع الحالات 👏</h2>
      <p>مجموع النقاط: ${score}</p>
    </div>
  `;
}

// ===================
// تهيئة الأحداث
// ===================
document.addEventListener("DOMContentLoaded", () => {
  // تأكد من حالة الاتجاه عند بداية التحميل
  checkOrientation();

  // زر البدء (مرة واحدة فقط)
  startBtn.addEventListener("click", () => {
    if (!checkOrientation()) {
      // إذا كان عمودي، نظهر تعليمات التدوير ولا نبدأ
      rotateSection.style.display = "flex";
      return;
    }
    homeSection.style.display = "none";
    gameSection.style.display = "block";
    loadImage();
  });

  // التنقل في الصور
  gameImage.addEventListener("click", onImageClick);

  // أزرار الإجابة
  answerYesBtn.addEventListener("click", () => answer(true));
  answerNoBtn.addEventListener("click", () => answer(false));

  // عند تغيير حجم/اتجاه الشاشة
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
  // تحسين استجابة iOS وبعض الأجهزة: مهلة قصيرة بعد تغيير الاتجاه
  window.addEventListener("orientationchange", () => setTimeout(checkOrientation, 50));
});
