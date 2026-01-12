/**
 * 第一篇章：绿皮记忆·经济起步的负重前行
 * 独立交互逻辑模块
 */

class Chapter1 {
  constructor() {
    // 状态变量
    this.currentPage = 0;
    this.totalPages = 6;
    this.isAnimating = false;
    this.isQuizAnswered = false;
    
    // DOM 元素
    this.elements = {
      box: null,
      chapterContent: null,
      chapterBg: null,
      indicatorDots: null,
      pageIndicator: null,
      quizOptions: null,
      quizFeedback: null,
      nextChapterBtn: null,
      restartChapterBtn: null,
      prevBtn: null,
      nextBtn: null,
      playVideoBtn: null
    };
    
    // 触摸变量
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchStartTime = 0;
    
    // 配置
    this.config = {
      swipeThreshold: 50,    // 滑动阈值(像素)
      swipeTimeThreshold: 300, // 滑动时间阈值(毫秒)
      swipeVerticalThreshold: 30, // 垂直滑动阈值
      transitionDuration: 1000, // 动画持续时间(毫秒)
      bgParallaxRatio: 0.5    // 背景视差比例
    };
    
    // 页面标题
    this.pageTitles = [
      '1/6: 缓慢的时代',
      '2/6: 邓小平访日',
      '3/6: 铁路技术现状',
      '4/6: 绿皮车的双重角色',
      '5/6: 知识问答',
      '6/6: 篇章结语'
    ];
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化篇章
   */
  init() {
    console.log('初始化第一篇章...');
    
    this.cacheElements();
    this.setupEventListeners();
    this.setupQuiz();
    this.setupVideo();
    this.resetToFirstPage();
    
    // 播放入场动画
    setTimeout(() => {
      this.playEntranceAnimation();
    }, 500);
    
    console.log('第一篇章初始化完成');
  }
  
  /**
   * 缓存DOM元素
   */
  cacheElements() {
    this.elements.box = document.querySelector('.ch-1');
    this.elements.chapterContent = document.querySelector('.chapter-content');
    this.elements.chapterBg = document.querySelector('.chapter-bg');
    this.elements.indicatorDots = document.querySelectorAll('.indicator-dots .dot');
    this.elements.pageIndicator = document.getElementById('pageIndicator');
    this.elements.quizOptions = document.querySelectorAll('.quiz-option');
    this.elements.quizFeedback = document.getElementById('quizFeedback');
    this.elements.nextChapterBtn = document.getElementById('nextChapterBtn');
    this.elements.restartChapterBtn = document.getElementById('restartChapterBtn');
    this.elements.prevBtn = document.getElementById('prevBtn');
    this.elements.nextBtn = document.getElementById('nextBtn');
    this.elements.playVideoBtn = document.getElementById('playVideo1');
  }
  
  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 触摸事件
    this.setupTouchEvents();
    
    // 鼠标滚轮事件
    this.setupWheelEvents();
    
    // 导航按钮事件
    this.setupNavigationEvents();
    
    // 指示器点击事件
    this.setupIndicatorEvents();
    
    // 键盘事件
    this.setupKeyboardEvents();
    
    // 下一章按钮事件
    if (this.elements.nextChapterBtn) {
      this.elements.nextChapterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToNextChapter();
      });
    }
    
    // 重新浏览按钮事件
    if (this.elements.restartChapterBtn) {
      this.elements.restartChapterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.resetToFirstPage();
      });
    }
  }
  
  /**
   * 设置触摸事件
   */
  setupTouchEvents() {
    this.elements.box.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
    }, { passive: true });
    
    this.elements.box.addEventListener('touchmove', (e) => {
      // 防止默认滚动行为
      if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    
    this.elements.box.addEventListener('touchend', (e) => {
      if (this.isAnimating) return;
      
      this.touchEndX = e.changedTouches[0].clientX;
      this.touchEndY = e.changedTouches[0].clientY;
      const touchTime = Date.now() - this.touchStartTime;
      
      this.handleSwipe(touchTime);
    }, { passive: true });
  }
  
  /**
   * 设置滚轮事件
   */
  setupWheelEvents() {
    this.elements.box.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      if (this.isAnimating) return;
      
      // 检测水平滚动
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 0) {
          this.prevPage();
        } else {
          this.nextPage();
        }
      }
    }, { passive: false });
  }
  
  /**
   * 设置导航按钮事件
   */
  setupNavigationEvents() {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener('click', () => {
        this.prevPage();
      });
    }
    
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', () => {
        this.nextPage();
      });
    }
  }
  
  /**
   * 设置指示器事件
   */
  setupIndicatorEvents() {
    this.elements.indicatorDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToPage(index);
      });
    });
  }
  
  /**
   * 设置键盘事件
   */
  setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      // 只在第一篇章响应
      if (!this.elements.box) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prevPage();
          break;
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          this.nextPage();
          break;
        case 'Home':
          e.preventDefault();
          this.resetToFirstPage();
          break;
        case 'End':
          e.preventDefault();
          this.goToPage(this.totalPages - 1);
          break;
      }
    });
  }
  
  /**
   * 设置问答交互
   */
  setupQuiz() {
    this.elements.quizOptions.forEach(option => {
      option.addEventListener('click', () => {
        if (this.isQuizAnswered) return;
        
        const isCorrect = option.dataset.answer === 'A';
        
        // 移除所有选项的样式
        this.elements.quizOptions.forEach(opt => {
          opt.classList.remove('correct', 'incorrect');
        });
        
        // 标记答案
        if (isCorrect) {
          option.classList.add('correct');
          this.showQuizFeedback(true);
        } else {
          option.classList.add('incorrect');
          // 显示正确答案
          this.elements.quizOptions.forEach(opt => {
            if (opt.dataset.answer === 'A') {
              opt.classList.add('correct');
            }
          });
          this.showQuizFeedback(false);
        }
        
        this.isQuizAnswered = true;
        this.playQuizSound(isCorrect);
      });
    });
  }
  
  /**
   * 设置视频交互
   */
  setupVideo() {
    if (this.elements.playVideoBtn) {
      this.elements.playVideoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.playVideo();
      });
    }
    
    // 处理外部链接（防止直接跳转）
    document.querySelectorAll('.content-box a[href^="http"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('video-btn') || 
            link.classList.contains('card-link') ||
            link.classList.contains('ref-link')) {
          // 这些链接已经有特殊处理
          return;
        }
        
        e.preventDefault();
        const url = link.href;
        const title = link.textContent.trim();
        
        if (confirm(`即将打开外部链接: ${title}\n\n是否继续？`)) {
          window.open(url, '_blank');
        }
      });
    });
  }
  
  /**
   * 播放入场动画
   */
  playEntranceAnimation() {
    // 显示所有元素
    this.elements.box.style.opacity = '1';
    
    // 列车动画
    const train = document.querySelector('.train-left');
    if (train) {
      train.style.opacity = '0';
      train.style.transform = 'translateX(-50px) scale(0.9)';
      
      setTimeout(() => {
        train.style.transition = 'opacity 1s ease, transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        train.style.opacity = '1';
        train.style.transform = 'translateX(0) scale(1)';
      }, 300);
    }
    
    // 内容框动画
    const contentBox = document.querySelector('.content-box');
    if (contentBox) {
      contentBox.style.animation = 'boxFloatIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }
  }
  
  /**
   * 处理滑动
   */
  handleSwipe(touchTime) {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    // 检查是否是有效水平滑动
    if (Math.abs(deltaY) > this.config.swipeVerticalThreshold) {
      return; // 垂直滑动，忽略
    }
    
    if (Math.abs(deltaX) < this.config.swipeThreshold || 
        touchTime > this.config.swipeTimeThreshold) {
      return;
    }
    
    if (deltaX > 0) {
      // 向右滑动 - 上一页
      this.prevPage();
    } else {
      // 向左滑动 - 下一页
      this.nextPage();
    }
  }
  
  /**
   * 转到指定页面
   */
  goToPage(pageIndex) {
    if (this.isAnimating || 
        pageIndex < 0 || 
        pageIndex >= this.totalPages || 
        pageIndex === this.currentPage) {
      return;
    }
    
    this.isAnimating = true;
    this.currentPage = pageIndex;
    
    // 计算内容移动距离
    const contentTranslateX = -this.currentPage * (100 / this.totalPages);
    
    // 计算背景移动距离（视差效果）
    const bgTranslateX = -this.currentPage * (100 / this.totalPages) * this.config.bgParallaxRatio;
    
    // 应用移动
    this.elements.chapterContent.style.transform = `translateX(${contentTranslateX}%)`;
    this.elements.chapterBg.style.transform = `translateX(${bgTranslateX}%)`;
    
    // 更新指示器
    this.updateIndicator();
    
    // 播放页面切换音效
    this.playPageSound();
    
    // 如果是问答页面，重置问答状态
    if (this.currentPage === 4 && !this.isQuizAnswered) {
      this.resetQuiz();
    }
    
    // 如果是最后一页，显示下一篇章提示
    if (this.currentPage === this.totalPages - 1) {
      this.showNextChapterHint();
    }
    
    // 解锁动画
    setTimeout(() => {
      this.isAnimating = false;
    }, this.config.transitionDuration);
  }
  
  /**
   * 下一页
   */
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    } else {
      // 在最后一页，可以提示切换到下一篇章
      console.log('已经是最后一页，可以切换到第二篇章');
    }
  }
  
  /**
   * 上一页
   */
  prevPage() {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    } else {
      // 在第一页，可以提示返回开篇
      console.log('已经是第一页，可以返回开篇');
    }
  }
  
  /**
   * 重置到第一页
   */
  resetToFirstPage() {
    this.currentPage = 0;
    this.isQuizAnswered = false;
    
    this.elements.chapterContent.style.transform = 'translateX(0%)';
    this.elements.chapterBg.style.transform = 'translateX(0%)';
    
    this.updateIndicator();
    this.resetQuiz();
    
    // 重新播放入场动画
    setTimeout(() => {
      this.playEntranceAnimation();
    }, 300);
  }
  
  /**
   * 更新指示器
   */
  updateIndicator() {
    // 更新点状指示器
    this.elements.indicatorDots.forEach((dot, index) => {
      if (index === this.currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // 更新文字指示器
    if (this.elements.pageIndicator && this.currentPage < this.pageTitles.length) {
      this.elements.pageIndicator.textContent = this.pageTitles[this.currentPage];
    }
    
    // 更新导航按钮状态
    this.updateNavigationButtons();
  }
  
  /**
   * 更新导航按钮状态
   */
  updateNavigationButtons() {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = this.currentPage === 0;
      this.elements.prevBtn.style.opacity = this.currentPage === 0 ? '0.5' : '1';
      this.elements.prevBtn.style.cursor = this.currentPage === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (this.elements.nextBtn) {
      const isLastPage = this.currentPage === this.totalPages - 1;
      this.elements.nextBtn.disabled = isLastPage;
      this.elements.nextBtn.style.opacity = isLastPage ? '0.5' : '1';
      this.elements.nextBtn.style.cursor = isLastPage ? 'not-allowed' : 'pointer';
      
      if (isLastPage) {
        this.elements.nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
      }
    }
  }
  
  /**
   * 显示问答反馈
   */
  showQuizFeedback(isCorrect) {
    if (!this.elements.quizFeedback) return;
    
    let feedbackHTML = '';
    
    if (isCorrect) {
      feedbackHTML = `
        <div class="feedback-header">
          <i class="fas fa-check-circle"></i>
          <h4>回答正确！</h4>
        </div>
        <div class="feedback-content">
          <p><strong>正确答案：A. 40公里</strong></p>
          <p>1978年，中国铁路平均运行时速仅为40公里左右，这成为当时经济发展的主要瓶颈之一。</p>
          <p>邓小平同志乘坐日本新干线时深刻感受到这种差距，这成为我国铁路提速的重要契机。</p>
        </div>
      `;
    } else {
      feedbackHTML = `
        <div class="feedback-header">
          <i class="fas fa-times-circle"></i>
          <h4>回答错误</h4>
        </div>
        <div class="feedback-content">
          <p><strong>正确答案：A. 40公里</strong></p>
          <p>在1978年，中国铁路技术基础薄弱，平均运行时速较低。这种缓慢的速度严重制约了经济发展和人员流动。</p>
          <p>正是认识到这种差距，中国开始了铁路现代化的艰难征程。</p>
        </div>
      `;
    }
    
    this.elements.quizFeedback.innerHTML = feedbackHTML;
    this.elements.quizFeedback.classList.add('show');
    
    // 自动滚动到反馈区域
    setTimeout(() => {
      this.elements.quizFeedback.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 300);
  }
  
  /**
   * 重置问答
   */
  resetQuiz() {
    this.isQuizAnswered = false;
    
    this.elements.quizOptions.forEach(option => {
      option.classList.remove('correct', 'incorrect');
    });
    
    if (this.elements.quizFeedback) {
      this.elements.quizFeedback.classList.remove('show');
      this.elements.quizFeedback.innerHTML = '';
    }
  }
  
  /**
   * 播放视频
   */
  playVideo() {
    const videoTitle = '邓小平乘坐日本新干线';
    const videoUrl = 'https://tv.cctv.com/2025/12/12/VIDEbic2NqwkMtGagI6KDjX1251212.shtml';
    
    // 在实际项目中，这里可以嵌入视频播放器
    // 现在用模拟方式
    const playVideo = confirm(`即将播放: ${videoTitle}\n\n是否继续？`);
    
    if (playVideo) {
      // 打开新窗口播放视频
      const videoWindow = window.open(videoUrl, '_blank', 'width=800,height=600');
      
      if (videoWindow) {
        // 视频窗口打开成功
        console.log('视频窗口已打开');
      } else {
        // 如果弹出窗口被阻止，直接在当前窗口打开
        window.open(videoUrl, '_blank');
      }
    }
  }
  
  /**
   * 显示下一篇章提示
   */
  showNextChapterHint() {
    const nextBtn = this.elements.nextChapterBtn;
    if (nextBtn) {
      nextBtn.style.animation = 'arrowPulse 2s ease-in-out infinite';
      
      // 添加一个提示动画
      const arrowContainer = document.querySelector('.arrow-container');
      if (arrowContainer) {
        arrowContainer.style.animation = 'arrowPulse 1.5s ease-in-out infinite';
      }
    }
  }
  
  /**
   * 前往下一篇章
   */
  goToNextChapter() {
    // 触发全局的篇章切换
    if (typeof window.goToNextChapter === 'function') {
      window.goToNextChapter(2); // 第二篇章的索引是2（从0开始）
    } else {
      console.log('切换到第二篇章');
      alert('即将进入第二篇章：提速之路·技术引进的艰难探索');
    }
  }
  
  /**
   * 播放页面切换音效
   */
  playPageSound() {
    // 在实际项目中，这里可以播放音效
    // 现在用控制台输出代替
    console.log(`切换到第 ${this.currentPage + 1} 页`);
    
    // 模拟音效
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440 + (this.currentPage * 20);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }
  
  /**
   * 播放问答音效
   */
  playQuizSound(isCorrect) {
    // 在实际项目中，这里可以播放音效
    console.log(isCorrect ? '播放回答正确音效' : '播放回答错误音效');
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (isCorrect) {
      // 正确音效：上升音调
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
    } else {
      // 错误音效：下降音调
      oscillator.frequency.setValueAtTime(698.46, audioContext.currentTime); // F5
      oscillator.frequency.exponentialRampToValueAtTime(349.23, audioContext.currentTime + 0.3); // F4
    }
    
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }
  
  /**
   * 销毁篇章（清理资源）
   */
  destroy() {
    // 移除事件监听器
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // 清理DOM引用
    this.elements = {};
    
    console.log('第一篇章已销毁');
  }
}

// 导出到全局作用域
window.Chapter1 = Chapter1;

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否在第一篇章
  if (document.querySelector('.ch-1')) {
    window.chapter1 = new Chapter1();
  }
});

// 提供全局函数供其他篇章调用
window.goToNextChapter = function(chapterIndex) {
  console.log(`切换到第 ${chapterIndex} 篇章`);
  // 这里可以添加实际的篇章切换逻辑
};