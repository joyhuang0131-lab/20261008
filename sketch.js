// 定義測驗題目陣列（共五題）
let questions = [
  {
    question: "1. 在 p5.js 中，哪一個函數會在程式啟動時只執行一次？",
    options: ["draw()", "setup()", "createCanvas()", "mousePressed()"],
    answer: 1 // 正確答案索引：1 代表 setup()
  },
  {
    question: "2. 想要繪製一個圓形，應該使用哪一個指令？",
    options: ["rect()", "line()", "circle()", "triangle()"],
    answer: 2 // 正確答案索引：2 代表 circle()
  },
  {
    question: "3. 在 p5.js 中，用來設定畫布背景顏色的指令是什麼？",
    options: ["fill()", "stroke()", "background()", "color()"],
    answer: 2 // 正確答案索引：2 代表 background()
  },
  {
    question: "4. 若要讓圖案隨著滑鼠移動，應該使用哪一組系統變數？",
    options: ["mouseX, mouseY", "width, height", "x, y", "posX, posY"],
    answer: 0 // 正確答案索引：0 代表 mouseX, mouseY
  },
  {
    question: "5. 設定圖案內部填滿顏色的指令是哪一個？",
    options: ["stroke()", "fill()", "color()", "noFill()"],
    answer: 1 // 正確答案索引：1 代表 fill()
  }
];

// 全域變數定義
let currentQuestionIndex = 0; // 當前進行到第幾題
let score = 0;               // 玩家總得分
let selectedOption = -1;     // 當前點擊的選項 (-1 表示尚未選擇)
let isAnswered = false;      // 當前題目是否已經回答
let shakeOffset = 0;         // 錯誤選項的左右震盪位移量
let shakeTimer = 0;          // 震盪動畫計時器

// p5.js 初始化設定
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定預設文字對齊方式為垂直與水平居中
  textAlign(CENTER, CENTER);
}

// p5.js 主重複繪製循環
function draw() {
  // 設定背景顏色（淺灰藍色）
  background(240, 244, 248);

  // 判斷是否已完成所有題目
  if (currentQuestionIndex < questions.length) {
    // 繪製當前測驗畫面
    displayQuestion();
  } else {
    // 繪製最終結算畫面
    displayScore();
  }
}

// 繪製問題與選項（全自動置中與響應式）
function displayQuestion() {
  let q = questions[currentQuestionIndex]; // 取得當前題目資料

  // 基礎尺寸單位（取畫布長寬較小者）
  let baseUnit = min(width, height);

  // 1. 動態計算字體大小
  let titleSize = constrain(baseUnit * 0.035, 14, 20);
  let questionSize = constrain(baseUnit * 0.045, 18, 28);
  let optionTextSize = constrain(baseUnit * 0.038, 15, 22);
  let tipSize = constrain(baseUnit * 0.03, 12, 18);

  // 2. 繪製頂部進度資訊
  fill(100);
  noStroke();
  textSize(titleSize);
  text(`題目 ${currentQuestionIndex + 1} / ${questions.length}`, width / 2, height * 0.08);

  // 3. 繪製題目內文（使用固定寬高框加上 rectMode CENTER，確保完美水平與垂直置中）
  fill(30);
  textSize(questionSize);
  let qWidth = min(width * 0.85, 700);
  let qHeight = height * 0.18; // 題目專屬高度區域
  let qY = height * 0.22;      // 題目中心點 Y 座標
  
  push();
  rectMode(CENTER); // 改為中心點繪製模式以實現區域置中
  text(q.question, width / 2, qY, qWidth, qHeight);
  pop();

  // 4. 動態計算選項按鈕佈局
  let optionWidth = min(width * 0.85, 550);                // 卡片寬度
  let optionHeight = constrain(height * 0.08, 45, 65);       // 卡片高度
  let spacing = optionHeight + constrain(height * 0.02, 10, 20); // 選項間距
  let startY = height * 0.38;                                // 第一個選項的起始 Y 位置

  // 計算錯誤時的左右搖擺偏移量
  if (shakeTimer > 0) {
    shakeOffset = sin(frameCount * 0.8) * 12; // 左右搖擺幅度
    shakeTimer--;                             // 動畫計時遞減
  } else {
    shakeOffset = 0;                          // 重置偏移
  }

  // 5. 繪製四個選項按鈕
  for (let i = 0; i < q.options.length; i++) {
    let x = width / 2 - optionWidth / 2;
    let y = startY + i * spacing;

    // 預設卡片與文字顏色
    let bgColor = color(255);
    let textColor = color(50);

    // 點擊後的顏色與樣式判斷
    if (isAnswered) {
      if (i === q.answer) {
        // 正確答案顯示 #b5e48c 背景顏色
        bgColor = color('#b5e48c');
      } else if (i === selectedOption) {
        // 答錯選項顯示 #bc4749 背景顏色，並加上左右搖擺偏移
        bgColor = color('#bc4749');
        textColor = color(255);
        x += shakeOffset;
      }
    }

    // 繪製選項圓角卡片
    fill(bgColor);
    stroke(200);
    strokeWeight(1.5);
    rect(x, y, optionWidth, optionHeight, 10);

    // 繪製選項文字
    noStroke();
    fill(textColor);
    textSize(optionTextSize);
    let textX = width / 2 + (i === selectedOption && i !== q.answer ? shakeOffset : 0);
    text(q.options[i], textX, y + optionHeight / 2);
  }

  // 6. 繪製底部提示文字
  if (isAnswered) {
    fill(120);
    textSize(tipSize);
    text("點擊畫面任意處繼續下一題...", width / 2, height * 0.92);
  }
}

// 滑鼠/觸控點擊事件處理
function mousePressed() {
  // 所有題目完成時，點擊重新開始
  if (currentQuestionIndex >= questions.length) {
    currentQuestionIndex = 0;
    score = 0;
    isAnswered = false;
    return;
  }

  // 已回答狀態下，點擊進入下一題
  if (isAnswered) {
    currentQuestionIndex++;
    isAnswered = false;
    selectedOption = -1;
    return;
  }

  // 計算選項區域與點擊判定
  let q = questions[currentQuestionIndex];
  let optionWidth = min(width * 0.85, 550);
  let optionHeight = constrain(height * 0.08, 45, 65);
  let spacing = optionHeight + constrain(height * 0.02, 10, 20);
  let startY = height * 0.38;

  // 檢查是否點擊在任何選項內
  for (let i = 0; i < q.options.length; i++) {
    let x = width / 2 - optionWidth / 2;
    let y = startY + i * spacing;

    if (mouseX > x && mouseX < x + optionWidth && mouseY > y && mouseY < y + optionHeight) {
      selectedOption = i;
      isAnswered = true;

      if (i === q.answer) {
        score += 20; // 答對加分
      } else {
        shakeTimer = 30; // 答錯觸發震盪動畫
      }
      break;
    }
  }
}

// 繪製結算畫面
function displayScore() {
  let baseUnit = min(width, height);

  fill(30);
  noStroke();
  textSize(constrain(baseUnit * 0.06, 24, 38));
  text("測驗完成！", width / 2, height * 0.35);

  fill(70);
  textSize(constrain(baseUnit * 0.045, 18, 28));
  text(`您的最終得分為: ${score} 分`, width / 2, height * 0.48);

  fill(120);
  textSize(constrain(baseUnit * 0.035, 14, 20));
  text("點擊畫面任意處重新開始測驗", width / 2, height * 0.62);
}

// 視窗或螢幕旋轉時自動調整畫布與佈局
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}