/* =================================================================
   НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ
   ================================================================= */
const USER_CONFIG = {
    links: {
        telegram: "https://t.me/KSN1X",
        steam: "https://steamcommunity.com/profiles/76561199680302013/"
    },
    images: {
        banner: "https://x0.at/iX7C.jpg",
        avatar: "https://x0.at/m6GR.jpg"
    },
    backgrounds: [
        "https://x0.at/Fvg5.jpg",
        "https://x0.at/Om4w.jpg",
        "https://x0.at/PLQ9.jpg"
    ],
    widgetPlayer: {
        // Трек для верхнего плеера
        audioFile: "https://media.vocaroo.com/mp3/1cZT1do1fGxn", 
        coverArt: "https://x0.at/0wFz.jpg",
        trackName: "Электрослабость — Олений Пенис"
    }
};

/* =================================================================
   ЛОГИКА (НЕ МЕНЯТЬ)
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Установка данных
    document.getElementById('profile-banner').src = USER_CONFIG.images.banner;
    document.getElementById('profile-avatar').src = USER_CONFIG.images.avatar;
    document.getElementById('tg-link').href = USER_CONFIG.links.telegram;
    document.getElementById('steam-link').href = USER_CONFIG.links.steam;
    
    const tgUsername = USER_CONFIG.links.telegram.split('/').pop();
    const tgTextLink = document.getElementById('tg-text-link');
    tgTextLink.href = USER_CONFIG.links.telegram;
    tgTextLink.textContent = '@' + tgUsername;

    const trackNameEl = document.getElementById('widget-track-name');
    document.getElementById('bg-music').src = USER_CONFIG.widgetPlayer.audioFile;
    document.getElementById('widget-art').src = USER_CONFIG.widgetPlayer.coverArt;
    trackNameEl.textContent = USER_CONFIG.widgetPlayer.trackName;

    // 2. Бегущая строка
    setTimeout(() => {
        const containerWidth = document.querySelector('.track-info').clientWidth;
        const textWidth = trackNameEl.scrollWidth;
        // Если текст длинный, включаем анимацию
        if (textWidth > (containerWidth - 20)) { 
            trackNameEl.classList.add('scrolling');
        } else {
            trackNameEl.classList.remove('scrolling');
        }
    }, 100);
});


/* 3. 3D НАКЛОН */
const wrapper = document.querySelector('.tilt-wrapper');
const container = document.querySelector('.container');
const constraint = 25; 
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

function animateTilt(e) {
    if (isMobile) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let rotateX = -(y / constraint).toFixed(2);
    let rotateY = (x / constraint).toFixed(2);
    wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt() {
    if (isMobile) return;
    wrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
}

container.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(() => animateTilt(e));
});
container.addEventListener('mouseleave', resetTilt);


/* 4. ВЕРХНИЙ ПЛЕЕР (WIDGET) */
const musicTrigger = document.getElementById('music-trigger');
const musicBar = document.getElementById('music-player-bar');
const closePlayerBtn = document.getElementById('close-player-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const audio = document.getElementById('bg-music');
const volumeSlider = document.getElementById('volume-slider');
const playIcon = playPauseBtn.querySelector('i');

musicTrigger.addEventListener('click', () => {
    musicBar.classList.add('active');
    musicTrigger.style.opacity = '0';
});
closePlayerBtn.addEventListener('click', () => {
    musicBar.classList.remove('active');
    setTimeout(() => { musicTrigger.style.opacity = '1'; }, 300);
});
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        audio.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
});
volumeSlider.addEventListener('input', (e) => audio.volume = e.target.value);
audio.volume = 0.3;


/* 5. СМЕНА ФОНА */
let currentBgIndex = 0;
const bgElement = document.querySelector('.bg-image');
const changeBgBtn = document.getElementById('change-bg-btn');

function setBackground(index) {
    const bgUrl = USER_CONFIG.backgrounds[index];
    bgElement.style.backgroundImage = `url('${bgUrl}')`;
    localStorage.setItem('ks0n1x_bg_index', index);
}

const savedIndex = localStorage.getItem('ks0n1x_bg_index');
if (savedIndex !== null) {
    currentBgIndex = parseInt(savedIndex);
    if (currentBgIndex >= USER_CONFIG.backgrounds.length) currentBgIndex = 0;
}
setBackground(currentBgIndex);

changeBgBtn.addEventListener('click', () => {
    currentBgIndex++;
    if (currentBgIndex >= USER_CONFIG.backgrounds.length) currentBgIndex = 0;
    setBackground(currentBgIndex);
});


/* 6. ЧАСТИЦЫ */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    init();
}

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() * 1) - 0.5;
        this.speedY = (Math.random() * 1) - 0.5;
        this.color = `rgba(255, 0, 60, ${Math.random() * 0.5 + 0.1})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.005;
        if (this.size <= 0.1) {
             this.x = Math.random() * window.innerWidth;
             this.y = Math.random() * window.innerHeight;
             this.size = Math.random() * 2;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    const count = isMobile ? 40 : 80;
    for (let i = 0; i < count; i++) particlesArray.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

resizeCanvas();
animate();
window.addEventListener('resize', resizeCanvas);


/* 7. ПРЕЛОАДЕР */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
