// ============================================
// LIVE DATA VISUALIZATION BACKGROUND
// ============================================

const canvas = document.getElementById('dataCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Data points for visualization
class DataPoint {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3 + 1;
        this.value = Math.random();
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        // Keep within bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
        
        // Slowly change value (simulating data changes)
        this.value += (Math.random() - 0.5) * 0.02;
        this.value = Math.max(0, Math.min(1, this.value));
    }
    
    draw() {
        // Color based on value (gradient from blue to pink)
        const r = Math.floor(99 + this.value * (236 - 99));
        const g = Math.floor(102 + this.value * (72 - 102));
        const b = Math.floor(241 + this.value * (153 - 241));
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create data points
const dataPoints = [];
const numPoints = 100;

for (let i = 0; i < numPoints; i++) {
    dataPoints.push(new DataPoint());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections between nearby points
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < dataPoints.length; i++) {
        for (let j = i + 1; j < dataPoints.length; j++) {
            const dx = dataPoints[i].x - dataPoints[j].x;
            const dy = dataPoints[i].y - dataPoints[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.15;
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(dataPoints[i].x, dataPoints[i].y);
                ctx.lineTo(dataPoints[j].x, dataPoints[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Update and draw data points
    dataPoints.forEach(point => {
        point.update();
        point.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    });
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.project-card, .skill-category, .expertise-item, .contact-method, .education-card, .certifications-card'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

// ============================================
// SKILL BAR ANIMATIONS
// ============================================

const skillBars = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillFill = entry.target;
            const targetWidth = skillFill.style.width;
            skillFill.style.width = '0';
            
            setTimeout(() => {
                skillFill.style.width = targetWidth;
            }, 200);
            
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================

const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // If using Formspree, remove the preventDefault and update the action URL
        // For demo purposes, showing a success message
        
        // Uncomment these lines and comment out the rest if NOT using Formspree
        // e.preventDefault();
        // alert('Thank you for your message! I will get back to you soon.');
        // contactForm.reset();
        
        // If using Formspree or another service, the form will submit normally
        // Make sure to update the action attribute in the HTML
    });
}

// ============================================
// TYPING EFFECT (Optional Enhancement)
// ============================================

function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// Uncomment to enable typing effect on page load
/*
window.addEventListener('load', () => {
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        const originalText = heroName.textContent;
        typeWriter(heroName, originalText, 100);
    }
});
*/

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && window.innerWidth > 768) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ============================================
// CURSOR GLOW EFFECT (Optional)
// ============================================

function createCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 15 + 'px';
        cursor.style.top = cursorY - 15 + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Make cursor larger on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5)';
            cursor.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent)';
        });
    });
}

// Uncomment to enable cursor effect (works best on desktop)
if (window.innerWidth > 1024) {
    // createCursorEffect();
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseFloat(text);
                const suffix = text.replace(/[0-9.]/g, '');
                
                stat.dataset.suffix = suffix;
                animateCounter(stat, number);
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c🚀 Hi there, fellow developer!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cLike what you see? Let\'s connect!', 'color: #ec4899; font-size: 14px;');
console.log('%cEmail: your.email@example.com', 'color: #475569; font-size: 12px;');
console.log('%cGitHub: github.com/yourusername', 'color: #475569; font-size: 12px;');
console.log('%c\nThis portfolio was built with:', 'color: #f59e0b; font-size: 12px; font-weight: bold;');
console.log('%c• HTML5 & CSS3', 'color: #475569; font-size: 11px;');
console.log('%c• Vanilla JavaScript', 'color: #475569; font-size: 11px;');
console.log('%c• Canvas API for live data viz', 'color: #475569; font-size: 11px;');
console.log('%c• Lots of ☕ and 💙', 'color: #475569; font-size: 11px;');

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Log page load time
window.addEventListener('load', () => {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`%cPage loaded in ${loadTime}ms`, 'color: #10b981; font-size: 12px;');
});

// ============================================
// THEME TOGGLE (Optional Feature)
// ============================================

// This is commented out but can be enabled if you want a dark mode toggle

/*
function initThemeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '🌙';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--gradient-1);
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: var(--transition);
    `;
    
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
    
    document.body.appendChild(toggleBtn);
}

// Uncomment to enable theme toggle
// initThemeToggle();
*/

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Add keyboard navigation for hamburger menu
if (hamburger) {
    hamburger.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// Add focus visible styles
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ============================================
// PROJECT IMAGE LAZY LOADING
// ============================================

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ============================================
// SCROLL TO TOP BUTTON (Optional)
// ============================================

/*
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 12px;
        background: var(--gradient-1);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
        box-shadow: var(--shadow-md);
        z-index: 999;
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Uncomment to enable scroll to top button
// createScrollToTop();
*/
