

const container = document.querySelector('.container');
const pages = document.querySelectorAll('.page');
let currentPage = 0;


let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;


function goToPage(index) {
    if (index < 0 || index >= pages.length) return;

    currentPage = index;
    container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.transform = `translateX(-${index * 100}vw)`;

    
    pages.forEach(p => p.classList.remove('active'));
    pages[index].classList.add('active');
}


pages.forEach((page, i) => {
    if (i === 0) page.classList.add('active');
});


document.querySelectorAll('.nav-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
        if (arrow.classList.contains('left')) {
            goToPage(currentPage - 1);
        } else {
            goToPage(currentPage + 1);
        }
    });
});


document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
    if (e.key === 'ArrowRight') goToPage(currentPage + 1);
});


let touchStartX = 0;

container.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    
    e.preventDefault();
}, { passive: false });

container.addEventListener('touchend', e => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { 
        if (diff > 0) {
            goToPage(currentPage + 1); 
        } else {
            goToPage(currentPage - 1); 
        }
    }

    touchStartX = 0;
});


container.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    prevTranslate = currentTranslate;
    container.style.transition = 'none'; 
    container.style.cursor = 'grabbing';
});

container.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    currentTranslate = prevTranslate + diff;
    container.style.transform = `translateX(${currentTranslate}px)`;
});

['mouseup', 'mouseleave'].forEach(event => {
    container.addEventListener(event, () => {
        if (!isDragging) return;
        isDragging = false;

        container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;

        
        if (Math.abs(movedBy) > 100) {
            if (movedBy < 0) {
                goToPage(currentPage - 1); 
            } else {
                goToPage(currentPage + 1);
            }
        } else {
            goToPage(currentPage); 
        }
    });
});


container.style.cursor = 'grab';