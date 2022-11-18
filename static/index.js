document.addEventListener('DOMContentLoaded', () => {

    let feedbackModalIsShown = false;

    const feedbackModalEl = document.querySelector('#feedback-modal');
    const feedbackModal = new bootstrap.Modal(feedbackModalEl);

    const feedbackFormEl = feedbackModalEl.querySelector('form');
    const feedbackFormCacher = createFormCacher(feedbackFormEl);
    feedbackFormCacher.backup();

    feedbackModalEl.addEventListener('show.bs.modal', () => {
        feedbackModalIsShown = true;
        history.pushState(null, '', '/feedback');
    });
    feedbackModalEl.addEventListener('shown.bs.modal', () => {
        feedbackModalEl.querySelector('input, select, textarea').focus();
    });
    feedbackModalEl.addEventListener('hide.bs.modal', () => {
        if (!feedbackModalIsShown) return;

        history.back();
    });

    feedbackFormEl.addEventListener('submit', (e) => {
        e.preventDefault();

        feedbackFormEl.classList.add('was-validated')
        if (!feedbackFormEl.checkValidity()) {
            e.stopPropagation();
            return false;
        }

        const formData = new FormData(feedbackFormEl);

        // Convert FormData to plain JavaScript object
        const vals = Object.fromEntries(formData.entries());

        const waitResponse = fetch(feedbackFormEl.getAttribute('action'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(vals)
        });

        waitResponse.then(() => {
            pushSuccessToast('Отзыв успешно отправлен, спасибо!');
            feedbackFormCacher.clear();
        }).catch(() => {
            pushFailureToast('Произошла неизвестная ошибка, приносим свои извинения за предоставленные неудобства.');
        });
    });

    window.addEventListener('popstate', () => {
        feedbackModalIsShown = false;
        feedbackModal.hide();
    });

});

const NOOP = () => {};

const backgroundUrls = [
    "/static/img/1.png",
    "/static/img/funguy.webp",
    "/static/img/2.png",
    "/static/img/3.png",
    "/static/img/4.png",
    "/static/img/5.png",
    "/static/img/6.png",
    "/static/img/7.png",
    "/static/img/8.png",
    "/static/img/9.png",
    "/static/img/10.png",
    "/static/img/11.png",
    "/static/img/12.png",
    "/static/img/13.png",
    "/static/img/14.png",
    "/static/img/15.png",
    "/static/img/16.png"
];

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', reject);
    });
}

function loadImages(sources, afterEachLoadCallback = NOOP) {
    const promises = backgroundUrls.map(url =>
        loadImage(url)
            .then(img => {
                afterEachLoadCallback();
                return img;
            })
    );

    return Promise.all(promises);
}

const CPreloaderProgressBar = {
    progress: 0,
    finalProgress: backgroundUrls.length,
    increment() {
        this.progress += 1;
        this.render();
    },
    render() {
        const e_progress = document.querySelector(".my-preloader .my-progress");
        const e_progressBar = document.querySelector(".my-preloader .my-progress-bar");
        const percent = (100 * this.progress / this.finalProgress).toFixed(1);
        e_progress.innerText = `${percent} %`;
        e_progressBar.style.width = `${percent}%`;
    }
}

function renderGalleryImage(image) {
    return `
        <div class="swiper-slide">
            <img class="gallery-image" src="${image.src}" alt="">
        </div>
    `
}

window.addEventListener("load", function () {
    const e_preloader = document.querySelector(".my-preloader");
    setTimeout(() => {
        e_preloader.style.transform = `translateY(-100%)`;
        document.body.style.overflow = "";
    }, 500);
})

document.addEventListener("DOMContentLoaded", async function () {
    CPreloaderProgressBar.render();

    const swiperWrapper = document.querySelector(".swiper-wrapper");
    const images = await loadImages(backgroundUrls, () => {
        CPreloaderProgressBar.increment();
    });
    images.forEach(image => {
        swiperWrapper.innerHTML += renderGalleryImage(image);
    });

    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        spaceBetween: 16,
        keyboard: {
            enabled: true,
        },

        slidesPerView: 1,
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 4,
            },
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
});
