const preVideo = document.getElementById("preVideo");
const introVideo = document.getElementById("introVideo");
const mainContent = document.getElementById("mainContent");
const videoStart = document.getElementById("kosmosVideo");
const videoScroll = document.getElementById("kosmosVideoScroll");
const firstSection = document.querySelector(".section-one");
const secondSection = document.querySelector(".section-two");
const header = document.querySelector("header");

gsap.registerPlugin(ScrollTrigger);

const transitionTime = 3;

let introFinished = false;
let hasPlayed = false;
let isAutoScrolling = false;
let heroAnimated = false;
let lastScroll = 0;

videoStart.pause();
videoStart.currentTime = 0;

videoScroll.pause();
videoScroll.currentTime = transitionTime;
videoScroll.playbackRate = 3;

function playFirstVideo() {
    if (!introFinished) return;

    videoStart.pause();
    videoStart.currentTime = 0;
    videoStart.play().catch(() => {});
}

function startTextAnimations() {
    if (heroAnimated) return;

    heroAnimated = true;

    const heroTimeline = gsap.timeline();

    heroTimeline
        .to(".section-one .text", {
            opacity: 1,
            duration: 0
        })
        .from(".section-one .text h2", {
            y: 80,
            opacity: 0,
            duration: 1.4,
            ease: "power4.out"
        })
        .from(".section-one .text p", {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.9")
        .from(".section-one .text a", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.7");

    gsap.fromTo(".section-two .content-left", {
        opacity: 0,
        x: -100
    }, {
        opacity: 1,
        x: 0,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".section-two",
            start: "top 70%",
            once: true
        }
    });

    gsap.fromTo(".section-two .content-right", {
        opacity: 0,
        x: 100
    }, {
        opacity: 1,
        x: 0,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".section-two",
            start: "top 70%",
            once: true
        }
    });

    ScrollTrigger.refresh();
}

function finishIntro() {

    if (introFinished) return;

    introFinished = true;

    videoStart.currentTime = 0;

    videoStart.play().catch(() => {});

    setTimeout(() => {

        if (preVideo) {
            preVideo.classList.add("hide");
        }

        mainContent.classList.add("show");

        document.body.style.overflow = "";

        setTimeout(() => {

            if (preVideo) {
                preVideo.remove();
            }

            startTextAnimations();

            ScrollTrigger.refresh();

        }, 1800);

    }, 500);

}

document.body.style.overflow = "hidden";

if (introVideo && preVideo) {

    introVideo.muted = true;
    introVideo.playsInline = true;

    introVideo.addEventListener("loadeddata", () => {

        preVideo.classList.add("show");

        introVideo.play().catch(() => {});

    });

    introVideo.addEventListener("ended", finishIntro);

    setTimeout(() => {

        if (!introFinished) {
            finishIntro();
        }

    }, 6500);

}

videoStart.addEventListener("timeupdate", () => {
    if (videoStart.currentTime >= transitionTime) {
        videoStart.pause();
        videoStart.currentTime = transitionTime;
    }
});


const secondObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !hasPlayed && introFinished) {
            hasPlayed = true;
            videoScroll.currentTime = transitionTime;
            videoScroll.play().catch(() => {});
        }

        if (!entry.isIntersecting) {
            hasPlayed = false;
            videoScroll.pause();
            videoScroll.currentTime = transitionTime;
        }
    });
}, { threshold: 0.7 });

secondObserver.observe(secondSection);

function goToSection(section) {
    if (isAutoScrolling || !introFinished) return;

    isAutoScrolling = true;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setTimeout(() => {
        isAutoScrolling = false;
    }, 1200);
}

window.addEventListener("wheel", (event) => {
    const scrollY = window.scrollY;

    if (event.deltaY > 20 && scrollY < window.innerHeight * 0.5) {
        goToSection(secondSection);
    }

    if (event.deltaY < -20 && scrollY > window.innerHeight * 0.5 && scrollY < window.innerHeight * 1.5) {
        goToSection(firstSection);
    }
}, { passive: true });

let touchStartY = 0;

window.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0].clientY;
});

window.addEventListener("touchmove", (event) => {
    const touchEndY = event.touches[0].clientY;
    const distance = touchStartY - touchEndY;
    const scrollY = window.scrollY;

    if (distance > 20 && scrollY < window.innerHeight * 0.5) {
        goToSection(secondSection);
    }

    if (distance < -20 && scrollY > window.innerHeight * 0.5 && scrollY < window.innerHeight * 1.5) {
        goToSection(firstSection);
    }
});

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 80) {
        header.classList.add("hidden");
    } else {
        header.classList.remove("hidden");
    }

    lastScroll = currentScroll;
});