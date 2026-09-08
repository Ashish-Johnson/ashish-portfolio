// script.js - Ashish Johnson Portfolio with 3D Data Analytics Visualisations

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // 1. Scroll Progress Bar & IntersectionObserver Reveal Animations
    // -------------------------------------------------------------
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
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        function legacyReveal() {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                if (el.getBoundingClientRect().top < windowHeight - 100) {
                    el.classList.add('active');
                }
            });
        }
        window.addEventListener('scroll', legacyReveal);
        legacyReveal();
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    // -------------------------------------------------------------
    // 2. Smooth Scrolling for Navigation Links
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 3. Navbar Background & Theme Toggle Logic
    // -------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    function updateNavbarBg() {
        if (window.scrollY > 50) {
            if (body.classList.contains('light-theme')) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
            } else {
                navbar.style.background = 'rgba(11, 17, 32, 0.95)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            }
        } else {
            if (body.classList.contains('light-theme')) {
                navbar.style.background = 'rgba(255, 255, 255, 0.85)';
                navbar.style.boxShadow = 'none';
            } else {
                navbar.style.background = 'rgba(11, 17, 32, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
            updateNavbarBg();
        });
    }

    window.addEventListener('scroll', updateNavbarBg);
    updateNavbarBg();

    // -------------------------------------------------------------
    // 4. Interactive 3D Card Tilt & Dynamic Lighting Effect
    // -------------------------------------------------------------
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale3d(1.01, 1.01, 1.01)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
        });
    });

    // -------------------------------------------------------------
    // 5. Interactive 3D Data Sphere Visualization (Three.js)
    // -------------------------------------------------------------
    const container = document.getElementById('hero-3d-canvas-container');

    if (container && typeof THREE !== 'undefined') {
        const width = container.clientWidth || 450;
        const height = container.clientHeight || 450;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // 3D Data Network Group
        const dataGroup = new THREE.Group();
        scene.add(dataGroup);

        // 1. Outer Icosahedron Wireframe
        const outerGeo = new THREE.IcosahedronGeometry(2.2, 2);
        const outerMat = new THREE.MeshBasicMaterial({
            color: 0x0EA5E9,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const outerSphere = new THREE.Mesh(outerGeo, outerMat);
        dataGroup.add(outerSphere);

        // 2. Inner Octahedron Core Wireframe
        const innerGeo = new THREE.OctahedronGeometry(1.3, 1);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x38BDF8,
            wireframe: true,
            transparent: true,
            opacity: 0.45
        });
        const innerCore = new THREE.Mesh(innerGeo, innerMat);
        dataGroup.add(innerCore);

        // 3. Floating Data Particles
        const particleCount = 200;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 2.0 + Math.random() * 0.8;

            particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
            particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            particlePositions[i + 2] = r * Math.cos(phi);
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0x38BDF8,
            size: 0.06,
            transparent: true,
            opacity: 0.85
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        dataGroup.add(particleSystem);

        // Parallax Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 200;
            mouseY = (e.clientY - window.innerHeight / 2) / 200;
        });

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            // Smooth rotation
            dataGroup.rotation.y += 0.004;
            dataGroup.rotation.x += 0.002;
            innerCore.rotation.y -= 0.008;

            // Mouse inertia tilt
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            dataGroup.rotation.x += (targetY - dataGroup.rotation.x) * 0.05;
            dataGroup.rotation.y += (targetX - dataGroup.rotation.y) * 0.05;

            renderer.render(scene, camera);
        }

        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            const newW = container.clientWidth || 450;
            const newH = container.clientHeight || 450;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });
    }
});
