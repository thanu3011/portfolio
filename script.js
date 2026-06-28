/* ===================================
   PRELOADER
=================================== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.cursor = 'none';
  }, 2200);
});

/* ===================================
   CUSTOM CURSOR
=================================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .gallery-item, .filter-btn, .skill-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.width = '60px';
    follower.style.height = '60px';
    follower.style.borderColor = 'rgba(139,92,246,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.width = '36px';
    follower.style.height = '36px';
    follower.style.borderColor = 'rgba(139,92,246,0.5)';
  });
});

/* ===================================
   SCROLL PROGRESS BAR
=================================== */
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / docHeight) * 100;
  document.getElementById('scroll-progress').style.width = progress + '%';
});

/* ===================================
   NAVBAR
=================================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  updateBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
    if (navLink) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

/* ===================================
   PARTICLE CANVAS
=================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.1;
    const colors = ['139,92,246', '6,182,212', '59,130,246'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
    if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    const fade = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = this.opacity * fade;
    ctx.fillStyle = `rgba(${this.color}, 1)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) {
  particles.push(new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

animateParticles();

/* ===================================
   TYPING EFFECT
=================================== */
const typedEl = document.getElementById('typed');
const roles = [
  'Computer Science Student',
  'Full Stack Developer',
  'AI Enthusiast',
  'Problem Solver',
  'Tech Explorer'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingPaused = false;

function typeEffect() {
  if (typingPaused) return;
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 400);
      return;
    }
    setTimeout(typeEffect, 50);
  } else {
    typedEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
    setTimeout(typeEffect, 80);
  }
}

setTimeout(typeEffect, 2500);

/* ===================================
   SCROLL REVEAL ANIMATIONS
=================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===================================
   COUNTER ANIMATION
=================================== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let start = 0;
      const duration = 1800;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start);
        }
      }, 16);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ===================================
   PROJECT FILTERING
=================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===================================
   GALLERY LIGHTBOX
=================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const item = galleryItems[index];
  lightboxImg.src = item.dataset.src;
  lightboxImg.alt = item.dataset.caption;
  lightboxCaption.textContent = item.dataset.caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryItems.length) % galleryItems.length;
  openLightbox(currentLightboxIndex);
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

/* ===================================
   TESTIMONIAL CAROUSEL
=================================== */
const testimonialItems = document.querySelectorAll('.testimonial-item');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let autoSlideTimer;

function showTestimonial(index) {
  testimonialItems.forEach(item => item.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  testimonialItems[index].classList.add('active');
  dots[index].classList.add('active');
  currentTestimonial = index;
}

function nextTestimonial() {
  const next = (currentTestimonial + 1) % testimonialItems.length;
  showTestimonial(next);
}

function startAutoSlide() {
  autoSlideTimer = setInterval(nextTestimonial, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideTimer);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    stopAutoSlide();
    showTestimonial(parseInt(dot.dataset.index));
    startAutoSlide();
  });
});

startAutoSlide();

/* ===================================
   CONTACT FORM VALIDATION
=================================== */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

function showError(field, msg) {
  const input = document.getElementById(field);
  const error = document.getElementById(field + '-error');
  input.classList.add('error');
  error.textContent = msg;
}

function clearError(field) {
  const input = document.getElementById(field);
  const error = document.getElementById(field + '-error');
  input.classList.remove('error');
  error.textContent = '';
}

function validateForm() {
  let valid = true;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  clearError('name'); clearError('email'); clearError('subject'); clearError('message');

  if (!name || name.length < 2) {
    showError('name', 'Please enter your full name (min 2 characters).');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!subject || subject.length < 3) {
    showError('subject', 'Please enter a subject (min 3 characters).');
    valid = false;
  }

  if (!message || message.length < 10) {
    showError('message', 'Message must be at least 10 characters long.');
    valid = false;
  }

  return valid;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      formSuccess.classList.add('visible');
      contactForm.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    }, 1500);
  }
});

['name', 'email', 'subject', 'message'].forEach(field => {
  const el = document.getElementById(field);
  if (el) el.addEventListener('input', () => clearError(field));
});

/* ===================================
   BACK TO TOP
=================================== */
const backToTop = document.getElementById('back-to-top');

function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===================================
   MAGNETIC BUTTONS
=================================== */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ===================================
   RIPPLE EFFECT
=================================== */
document.querySelectorAll('.btn, .filter-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ===================================
   TILT EFFECT ON PROJECT CARDS
=================================== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

/* ===================================
   PARALLAX HERO GLOW
=================================== */
document.addEventListener('mousemove', (e) => {
  const glows = document.querySelectorAll('.hero-glow');
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  glows.forEach((glow, i) => {
    const factor = (i + 1) * 0.4;
    glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ===================================
   SMOOTH SCROLL FOR NAV LINKS
=================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===================================
   LAZY LOADING OBSERVER
=================================== */
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));

/* ===================================
   GLOW BORDER ON HOVER (PROJECT CARDS)
=================================== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(139,92,246,0.12), rgba(255,255,255,0.06) 60%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ===================================
   SECTION ENTRANCE STAGGER
=================================== */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        setTimeout(() => {
          child.classList.add('visible');
        }, i * 100);
      });
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.section').forEach(section => {
  staggerObserver.observe(section);
});

/* ===================================
   INIT
=================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  updateBackToTop();
});
