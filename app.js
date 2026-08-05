const scene = document.querySelector("a-scene");
const assets = document.querySelector("#assets");
let currentVideo = null;
TARGETS.forEach((item) => {

    // ساخت ویدیو
    const video = document.createElement("video");

    video.id = "video" + item.id;
    video.src = item.video;
    video.loop = true;
    video.preload = "auto";

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    assets.appendChild(video);

    // ساخت Target
    const entity = document.createElement("a-entity");

    entity.setAttribute(
        "mindar-image-target",
        `targetIndex: ${item.id}`
);

    // ساخت Video Plane
    const plane = document.createElement("a-video");

    plane.setAttribute("src", "#" + video.id);
    plane.setAttribute("width", item.width);
    plane.setAttribute("height", item.height);
    plane.setAttribute("position", "0 0 0");

    entity.appendChild(plane);

    scene.appendChild(entity);

    entity.addEventListener("targetFound", () => {
        if (currentVideo && currentVideo !== video){
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }
        currentVideo = video;
        video.play();
    });

    entity.addEventListener("targetLost", () => {

        video.pause();

        if (item.restart) {
            video.currentTime = 0;
        }

        if (currentVideo === video){
            currentVideo = null;
        }

    });

});