const video = document.querySelector("#myVideo");

const target = document.querySelector(
    "[mindar-image-target]"
);

target.addEventListener("targetFound", () => {
    video.play();
});

target.addEventListener("targetLost", () => {
    video.pause();
    video.currentTime = 0;
});