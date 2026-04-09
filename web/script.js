document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const cursorGlow = document.querySelector('.cursor-glow');
    const particlesContainer = document.getElementById('particles');
    const statValues = document.querySelectorAll('.stat-value');
    const contactForm = document.getElementById('contactForm');

    if (cursorGlow) {
        document.addEventListener('mousemove', function(e) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseleave', function() {
            cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', function() {
            cursorGlow.style.opacity = '1';
        });
    }

    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        const colors = ['#00f5ff', '#ff00ff', '#b400ff', '#00ff88'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        particlesContainer.appendChild(particle);
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveNavLink();
    });

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    function animateStats() {
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateNumber = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };

            updateNumber();
        });
    }

    const fadeElements = document.querySelectorAll('.game-card, .player-card, .achievement-item');

    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = contactForm.querySelector('button');
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="btn-text">发送中...</span>';
            button.disabled = true;

            setTimeout(() => {
                showNotification('消息发送成功！我们会尽快与您联系。', 'success');
                contactForm.reset();
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1500);
        });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notification-message">${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, rgba(0, 245, 255, 0.2) 0%, rgba(180, 0, 255, 0.2) 100%);
            border: 1px solid rgba(0, 245, 255, 0.3);
            color: #00f5ff;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: notificationSlide 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 40px rgba(0, 245, 255, 0.2);
        `;

        document.body.appendChild(notification);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationSlide {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            notification.style.animation = 'notificationSlide 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    const playerCards = document.querySelectorAll('.player-card');
    playerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const frame = this.querySelector('.player-frame');
            if (frame) {
                frame.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const frame = this.querySelector('.player-frame');
            if (frame) {
                frame.style.opacity = '0';
            }
        });
    });

    const buttons = document.querySelectorAll('.btn-neon, .btn-outline-neon');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
        });
    });

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const glows = document.querySelectorAll('.neon-glow');
                
                glows.forEach((glow, index) => {
                    const speed = (index + 1) * 0.1;
                    glow.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    const titles = document.querySelectorAll('.section-title, .hero-title .title-line');
    
    const titleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                entry.target.offsetHeight;
                entry.target.style.animation = null;
            }
        });
    }, { threshold: 0.5 });

    titles.forEach(title => {
        titleObserver.observe(title);
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    const teamPanels = document.querySelectorAll('.team-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            teamPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === tab + '-panel') {
                    panel.classList.add('active');
                }
            });
        });
    });

    console.log('%c🎮 牌子来电竞', 'font-size: 24px; font-weight: bold; color: #00f5ff; text-shadow: 0 0 10px #00f5ff;');
    console.log('%c热血竞技，荣耀加冕', 'font-size: 14px; color: #8888aa;');
    console.log('%c联系我们: business@paizilai.com', 'font-size: 12px; color: #00f5ff;');
});
