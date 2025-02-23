// 创建音频对象
const woodfishSound = new Audio('audio/敲击木鱼_耳聆网_[声音ID：19572].wav');
woodfishSound.preload = 'auto';

// 获取DOM元素
const woodfishWrapper = document.querySelector('.woodfish-wrapper');
const meritCounter = document.getElementById('merit');
let merit = 0;

// 点击事件处理
woodfishWrapper.addEventListener('click', () => {
    // 播放音效
    const soundClone = woodfishSound.cloneNode();
    soundClone.play().catch(error => {
        console.log('播放失败:', error);
    });
    
    // 更新功德计数
    merit++;
    meritCounter.textContent = merit;
    
    // 创建涟漪效果
    const ripple = document.querySelector('.ripple');
    ripple.style.animation = 'none';
    ripple.offsetHeight; // 触发重排
    ripple.style.animation = 'ripple 0.6s ease-out';
});

// 添加触摸事件支持
woodfishWrapper.addEventListener('touchstart', (e) => {
    e.preventDefault(); // 防止双击缩放
    woodfishWrapper.click();
}); 