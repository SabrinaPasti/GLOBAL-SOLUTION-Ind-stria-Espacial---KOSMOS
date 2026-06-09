let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");

let progressStartValue = 0,
    progressEndValue = 65,
    speed = 100;

let progress = setInterval(() => {
    progressStartValue++;

    circularProgress.style.background = `conic-gradient(#01B574 ${progressStartValue * 3.6}deg, #060C2B  0deg)`;

    if(progressStartValue == progressEndValue){
        clearInterval(progress);
    }


}, speed);
