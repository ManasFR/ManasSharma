// --- 1. PRELOADER & SETUP ---
gsap.registerPlugin(ScrollTrigger);

const loaderTimeline = gsap.timeline();

// Count up animation
let count = { val: 0 };
gsap.to(count, {
    val: 100,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
        document.querySelector('.counter').textContent = Math.round(count.val);
    }
});

// Reveal Animation
loaderTimeline
    .to(".loader-text", { opacity: 0, delay: 2.2, duration: 0.5 })
    .to(".loader-wrap", { y: "-100%", duration: 1, ease: "power4.inOut" })
    .from(".hero-title", { y: 100, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=0.5")
    .from(".hero-subtitle", { opacity: 0, letterSpacing: "10px", duration: 1 }, "-=1")
    .from(".hero-tech-stack", { opacity: 0, y: 30, duration: 1 }, "-=0.5")
    .call(() => document.body.classList.remove('loading'));

// --- 2. CUSTOM CURSOR ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.1 });
});

// Magnetic & Hover Effects
const magnetics = document.querySelectorAll('.magnetic-link, .magnetic');

magnetics.forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.classList.add('cursor-active');
        gsap.to(follower, { scale: 1.5 });
    });
    
    el.addEventListener('mouseleave', () => {
        follower.classList.remove('cursor-active');
        gsap.to(follower, { scale: 1 });
        gsap.to(el, { x: 0, y: 0, duration: 0.5 });
    });

    if(el.classList.contains('magnetic')) {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
    }
});

// --- 3. SCROLL ANIMATIONS ---

// About Section Reveal
gsap.from(".about-section .headline", {
    scrollTrigger: { trigger: ".about-section", start: "top 80%" },
    y: 50, opacity: 0, duration: 1
});

// Stats Counter
gsap.utils.toArray(".num").forEach(num => {
    gsap.to(num, {
        scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
        textContent: num.getAttribute("data-val"),
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 }
    });
});

// Experience Timeline Drawing
gsap.from(".timeline-item", {
    scrollTrigger: { trigger: ".experience-section", start: "top 70%" },
    y: 50, opacity: 0, duration: 1, stagger: 0.3
});

// Timeline Year Display Update with Content
const timelineItems = document.querySelectorAll('.timeline-item');
const yearDisplay = document.querySelector('.year-display');
const timelineRole = document.querySelector('.timeline-role');
const timelineCompany = document.querySelector('.timeline-company');
const timelineDesc = document.querySelector('.timeline-desc');

// Timeline data for each year
const timelineData = {
    '2023': {
        role: 'Senior Full Stack Dev',
        company: 'TechCorp Solutions',
        desc: 'Leading a team of 5 developers. Architecting SaaS platforms using Laravel & Vue.js.'
    },
    '2021': {
        role: 'Backend Specialist',
        company: 'Creative Agency',
        desc: 'Developed custom CMS solutions and E-commerce integrations. Managed database migrations.'
    },
    '2019': {
        role: 'Web Developer',
        company: 'Freelance',
        desc: 'Built over 20+ websites for international clients. Focused on WordPress & React SPAs.'
    }
};

if (yearDisplay && timelineRole) {
    ScrollTrigger.create({
        trigger: ".experience-section",
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(
                Math.floor(progress * timelineItems.length),
                timelineItems.length - 1
            );
            
            if (timelineItems[index]) {
                const year = timelineItems[index].getAttribute('data-year');
                if (year && yearDisplay.textContent !== year && timelineData[year]) {
                    // Fade out animation
                    gsap.to([yearDisplay, timelineRole, timelineCompany, timelineDesc], {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        stagger: 0.05,
                        onComplete: () => {
                            // Update content
                            yearDisplay.textContent = year;
                            timelineRole.textContent = timelineData[year].role;
                            timelineCompany.textContent = timelineData[year].company;
                            timelineDesc.textContent = timelineData[year].desc;
                            
                            // Fade in animation
                            gsap.to([yearDisplay, timelineRole, timelineCompany, timelineDesc], {
                                opacity: 1,
                                y: 0,
                                duration: 0.4,
                                stagger: 0.05
                            });
                        }
                    });
                }
            }
        }
    });
}

// Skills Cards Stagger Animation
gsap.from(".skill-card", {
    scrollTrigger: { 
        trigger: ".skills-section", 
        start: "top 80%",
        once: true
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    clearProps: "all"
});

// Horizontal Scroll Projects
let sections = gsap.utils.toArray(".project-slide");
let scrollContainer = document.querySelector(".projects-slider-wrapper");

gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: ".projects-container",
        pin: true,
        scrub: 1,
        end: () => "+=" + scrollContainer.offsetWidth
    }
});

// Footer Reveal
gsap.from(".huge-link", {
    scrollTrigger: { trigger: ".footer-section", start: "top 60%" },
    y: 100, opacity: 0, duration: 1
});

// --- 4. THREE.JS BACKGROUND ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg-canvas'), 
    alpha: true, 
    antialias: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Particles
const geometry = new THREE.BufferGeometry();
const countParts = 2000;
const posArray = new Float32Array(countParts * 3);

for(let i = 0; i < countParts * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const material = new THREE.PointsMaterial({
    size: 0.005, 
    color: 0x6c5ce7, 
    transparent: true, 
    opacity: 0.8
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);
camera.position.z = 2;

// Interactive Mouse Movement
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = mouseY * 0.5;
    particlesMesh.rotation.y += mouseX * 0.5;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});