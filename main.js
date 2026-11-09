const modal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const toastPopup = document.getElementById('toastPopup');
const toastMessage = document.getElementById('toastMessage');
const header = document.querySelector('.sticky-header');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.querySelector('.desktop-nav');
const allLinks = document.querySelectorAll('a[href^="#"]');
const revealElements = document.querySelectorAll('.reveal');

function openBookingModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    bookingForm.reset();
}

function selectService(name) {
    const serviceSelect = document.getElementById('custService');
    const options = serviceSelect.options;
    
    for (let i = 0; i < options.length; i++) {
        if (options[i].text === name) {
            serviceSelect.selectedIndex = i;
            break;
        }
    }
    
    openBookingModal();
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', 
        mobileToggle.classList.contains('active'));
}

function showToast(message) {
    toastMessage.textContent = message;
    toastPopup.classList.add('show');
    
    setTimeout(() => {
        toastPopup.classList.remove('show');
    }, 4000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = header.offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function handleScroll() {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}

function initSmoothScroll() {
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeBookingModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeBookingModal();
        }
    });
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('custName').value.trim();
        const email = document.getElementById('custEmail').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const service = document.getElementById('custService').value;
        
        if (!name || !email || !phone || !service) {
            showToast('Please fill in all required fields');
            return;
        }
        
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showToast('Please enter a valid email address');
            return;
        }
        
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            showToast('Please enter a valid phone number');
            return;
        }
        
        closeBookingModal();
        showToast(`Thanks ${name}! We'll contact you soon about your ${service} consultation.`);
        bookingForm.reset();
    });
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    initSmoothScroll();
    initIntersectionObserver();
});