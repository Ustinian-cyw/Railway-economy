/* ---- 手机端真锁横屏 ---- */
document.addEventListener('plusready', () => plus.screen.lockOrientation('landscape-primary'));

/* ---- PART-1 开篇点击逻辑 ---- */
let step = 0;
const countEl = document.getElementById('count');
const leftEl = document.getElementById('leftText');
const rightEl = document.getElementById('rightText');
const centerEl = document.getElementById('centerText');
const ticketEl = document.getElementById('ticketText');
const startBtn = document.getElementById('startBtn');
const progressFill = document.querySelector('.progress-fill');
const mainText = document.querySelector('.text-box');
const swipeHint = document.querySelector('.swipe-hint');

// 初始化
progressFill.style.width = '0%';

// 点击事件
document.getElementById('s0').addEventListener('click', () => {
  step++;
  countEl.textContent = step;
  progressFill.style.width = `${(step / 3) * 100}%`;
  
  if (step === 1) {
    // 显示左右文案
    leftEl.classList.add('show');
    rightEl.classList.add('show');
    mainText.style.opacity = '0.3';
    
  } else if (step === 2) {
    // 隐藏左右文案，显示中心文案
    leftEl.classList.remove('show');
    rightEl.classList.remove('show');
    
    centerEl.style.opacity = '1';
    centerEl.style.visibility = 'visible';
    mainText.style.opacity = '0.2';
    
    // 列车震动效果
    const trains = document.querySelectorAll('.train');
    trains.forEach(train => {
      train.style.animation = 'none';
      setTimeout(() => {
        train.style.animation = '';
      }, 10);
    });
    
  } else if (step === 3) {
    // 隐藏中心文案，显示车票文案
    centerEl.style.opacity = '0';
    centerEl.style.visibility = 'hidden';
    
    ticketEl.style.opacity = '1';
    ticketEl.style.visibility = 'visible';
    
    // 显示开始按钮
    startBtn.style.opacity = '1';
    startBtn.style.visibility = 'visible';
    
    // 隐藏滑动提示
    swipeHint.style.opacity = '0';
    
  } else if (step === 4) {
    goNext();
  }
});

// 开始按钮点击事件
startBtn.addEventListener('click', () => {
  goNext();
});

/* ---- 滑向第 2 屏 ---- */
function goNext() {
  // 添加转场效果
  const box = document.getElementById('box');
  box.style.transform = 'translateX(-12.5%)';
  
  // 添加音效（如有）
  // const audio = new Audio('transition.mp3');
  // audio.play();
}

/* ---- 触摸滑动支持 ---- */
// let touchStartX = 0;
// let touchEndX = 0;

// document.addEventListener('touchstart', e => {
//   touchStartX = e.changedTouches[0].screenX;
// }, false);

// document.addEventListener('touchend', e => {
//   touchEndX = e.changedTouches[0].screenX;
//   handleSwipe();
// }, false);

// function handleSwipe() {
//   const swipeThreshold = 50;
//   if (touchStartX - touchEndX > swipeThreshold && step >= 3) {
//     goNext();
//   }
// }

/* ---- 键盘支持 ---- */
// document.addEventListener('keydown', e => {
//   if (e.key === 'ArrowRight' || e.key === ' ') {
//     document.getElementById('s0').click();
//   } else if (e.key === 'ArrowLeft' && step >= 3) {
//     goNext();
//   }
// });

/* ---- 预加载图片 ---- */
window.addEventListener('load', () => {
  // 预加载列车图片
  const trainImages = [
    '../img/s0/green-train.png',
    '../img/s0/speed-train.PNG'
  ];
  
  trainImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
  
  // 显示初始提示
  setTimeout(() => {
    swipeHint.style.opacity = '1';
  }, 4000);
});