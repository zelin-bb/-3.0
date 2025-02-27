// 创建音频对象
const woodfishSound = new Audio('audio/敲击木鱼_耳聆网_[声音ID：19572].wav');
woodfishSound.preload = 'auto';

// 获取DOM元素
const woodfishWrapper = document.querySelector('.woodfish-wrapper');
const meritCounter = document.getElementById('merit');
let merit = 0;

// 创建浮动数字
function createFloatingNumber(x, y) {
    const floatingNumber = document.createElement('div');
    floatingNumber.className = 'floating-number';
    floatingNumber.textContent = '功德+1';
    
    // 随机左右偏移，使效果更自然
    const randomOffset = (Math.random() - 0.5) * 40;
    floatingNumber.style.left = `${x + randomOffset}px`;
    floatingNumber.style.top = `${y}px`;
    
    woodfishWrapper.appendChild(floatingNumber);
    
    // 动画结束后移除元素
    floatingNumber.addEventListener('animationend', () => {
        floatingNumber.remove();
    });
}

// 检查功德值并跳转
function checkMeritAndRedirect() {
    if (merit >= 49) {
        // 添加过渡动画
        document.body.style.animation = 'fadeOut 1s forwards';
        
        // 1秒后跳转到聊天页面
        setTimeout(() => {
            window.location.href = 'chat.html';
        }, 1000);
    }
}

// 点击事件处理
woodfishWrapper.addEventListener('click', (e) => {
    // 播放音效
    const soundClone = woodfishSound.cloneNode();
    soundClone.play().catch(error => {
        console.log('播放失败:', error);
    });
    
    // 更新功德计数
    merit++;
    meritCounter.textContent = merit;
    
    // 创建浮动数字
    // 获取点击位置相对于woodfishWrapper的坐标
    const rect = woodfishWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createFloatingNumber(x, y);
    
    // 创建涟漪效果
    const ripple = document.querySelector('.ripple');
    ripple.style.animation = 'none';
    ripple.offsetHeight; // 触发重排
    ripple.style.animation = 'ripple 0.6s ease-out';

    // 检查功德值
    checkMeritAndRedirect();
});

// 添加触摸事件支持
woodfishWrapper.addEventListener('touchstart', (e) => {
    e.preventDefault(); // 防止双击缩放
    const touch = e.touches[0];
    const rect = woodfishWrapper.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    createFloatingNumber(x, y);
    woodfishWrapper.click();
}); 