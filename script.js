// script.js - Ashish Johnson Portfolio: 3D Data Analytics Visualisations, Theme Switcher & Scroll Animations

document.addEventListener('DOMContentLoaded', () => {

    // =============================================================
    // 1. Scroll Progress Bar & IntersectionObserver Reveal Animations
    // =============================================================
    const scrollProgressBar = document.getElementById('scroll-progress');

    function updateScrollProgress() {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrollProgressBar) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = `${progress}%`;
        }
    }

    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        function legacyReveal() {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                if (el.getBoundingClientRect().top < windowHeight - 50) {
                    el.classList.add('active');
                }
            });
        }
        window.addEventListener('scroll', legacyReveal);
        legacyReveal();
    }

    // Force initial activation check for above-the-fold elements
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    // =============================================================
    // 2. Smooth Navigation Scrolling
    // =============================================================
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active-link'));
            this.classList.add('active-link');

            const targetId = this.getAttribute('href').substring(1);
            const targetBlock = document.getElementById(targetId);

            if (targetBlock) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const offsetPosition = targetBlock.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================================
    // 3. Robust Day / Night Theme Switcher
    // =============================================================
    const navbar = document.getElementById('navbar');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    function applyTheme(themeName) {
        if (themeName === 'light') {
            body.classList.add('light-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
            }
        } else {
            body.classList.remove('light-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
            }
        }
        localStorage.setItem('portfolio-theme', themeName);
        updateNavbarBg();
        if (window.update3DColors) {
            window.update3DColors(themeName);
        }
    }

    function updateNavbarBg() {
        const isLight = body.classList.contains('light-theme');
        if (window.scrollY > 50) {
            navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 17, 32, 0.95)';
            navbar.style.boxShadow = isLight ? '0 4px 20px rgba(15, 23, 42, 0.08)' : '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 17, 32, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    }

    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }

    window.addEventListener('scroll', updateNavbarBg);

    // =============================================================
    // 4. Interactive 3D Card Tilt & Lighting Effect
    // =============================================================
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // =============================================================
    // 5. Interactive 3D Data Sphere Visualization (Three.js + Canvas Fallback)
    // =============================================================
    const container = document.getElementById('hero-3d-canvas-container');

    if (container) {
        let width = container.clientWidth || 380;
        let height = container.clientHeight || 380;

        if (typeof THREE !== 'undefined') {
            // Three.js Implementation
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.z = 6.5;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const dataGroup = new THREE.Group();
            scene.add(dataGroup);

            // Outer Wireframe Sphere
            const outerGeo = new THREE.IcosahedronGeometry(2.2, 2);
            const outerMat = new THREE.MeshBasicMaterial({
                color: body.classList.contains('light-theme') ? 0x0284C7 : 0x0EA5E9,
                wireframe: true,
                transparent: true,
                opacity: 0.35
            });
            const outerSphere = new THREE.Mesh(outerGeo, outerMat);
            dataGroup.add(outerSphere);

            // Inner Core Octahedron
            const innerGeo = new THREE.OctahedronGeometry(1.3, 1);
            const innerMat = new THREE.MeshBasicMaterial({
                color: body.classList.contains('light-theme') ? 0x0EA5E9 : 0x38BDF8,
                wireframe: true,
                transparent: true,
                opacity: 0.55
            });
            const innerCore = new THREE.Mesh(innerGeo, innerMat);
            dataGroup.add(innerCore);

            // Particles
            const particleCount = 180;
            const particleGeo = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount * 3; i += 3) {
                const u = Math.random();
                const v = Math.random();
                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);
                const r = 2.0 + Math.random() * 0.7;

                particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
                particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
                particlePositions[i + 2] = r * Math.cos(phi);
            }

            particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

            const particleMat = new THREE.PointsMaterial({
                color: body.classList.contains('light-theme') ? 0x0284C7 : 0x38BDF8,
                size: 0.07,
                transparent: true,
                opacity: 0.85
            });

            const particleSystem = new THREE.Points(particleGeo, particleMat);
            dataGroup.add(particleSystem);

            // Theme color updater callback
            window.update3DColors = (theme) => {
                const primaryHex = theme === 'light' ? 0x0284C7 : 0x0EA5E9;
                const secondaryHex = theme === 'light' ? 0x0EA5E9 : 0x38BDF8;
                outerMat.color.setHex(primaryHex);
                innerMat.color.setHex(secondaryHex);
                particleMat.color.setHex(secondaryHex);
            };

            // Parallax Interaction
            let mouseX = 0, mouseY = 0;
            let targetX = 0, targetY = 0;

            window.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - window.innerWidth / 2) / 220;
                mouseY = (e.clientY - window.innerHeight / 2) / 220;
            });

            function animate() {
                requestAnimationFrame(animate);

                dataGroup.rotation.y += 0.005;
                dataGroup.rotation.x += 0.002;
                innerCore.rotation.y -= 0.009;

                targetX += (mouseX - targetX) * 0.05;
                targetY += (mouseY - targetY) * 0.05;

                dataGroup.rotation.x += (targetY - dataGroup.rotation.x) * 0.04;
                dataGroup.rotation.y += (targetX - dataGroup.rotation.y) * 0.04;

                renderer.render(scene, camera);
            }

            animate();

            window.addEventListener('resize', () => {
                width = container.clientWidth || 380;
                height = container.clientHeight || 380;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            });
        } else {
            // HTML5 Canvas 3D Particle Sphere Fallback
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            container.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            const dots = [];
            const dotCount = 120;
            const radius = 130;

            for (let i = 0; i < dotCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                dots.push({
                    x: radius * Math.sin(phi) * Math.cos(theta),
                    y: radius * Math.sin(phi) * Math.sin(theta),
                    z: radius * Math.cos(phi)
                });
            }

            let angleX = 0.005;
            let angleY = 0.005;

            function renderCanvas3D() {
                ctx.clearRect(0, 0, width, height);
                const cx = width / 2;
                const cy = height / 2;
                const isLight = body.classList.contains('light-theme');
                const dotColor = isLight ? 'rgba(2, 132, 199, ' : 'rgba(56, 189, 248, ';

                dots.forEach(dot => {
                    // Rotate around Y and X
                    let radY = angleY;
                    let radX = angleX;

                    let x1 = dot.x * Math.cos(radY) - dot.z * Math.sin(radY);
                    let z1 = dot.z * Math.cos(radY) + dot.x * Math.sin(radY);

                    let y2 = dot.y * Math.cos(radX) - z1 * Math.sin(radX);
                    let z2 = z1 * Math.cos(radX) + dot.y * Math.sin(radX);

                    dot.x = x1;
                    dot.y = y2;
                    dot.z = z2;

                    const scale = 300 / (300 + z2);
                    const px = cx + dot.x * scale;
                    const py = cy + dot.y * scale;

                    const alpha = (z2 + radius) / (2 * radius) * 0.7 + 0.2;
                    ctx.beginPath();
                    ctx.arc(px, py, Math.max(1, 2.5 * scale), 0, Math.PI * 2);
                    ctx.fillStyle = dotColor + alpha + ')';
                    ctx.fill();
                });

                requestAnimationFrame(renderCanvas3D);
            }

            renderCanvas3D();
        }
    }
});
