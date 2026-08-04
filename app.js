const scene = document.querySelector("a-scene");
const assets = document.querySelector("#assets");

TARGETS.forEach((item) => {

    // ساخت ویدیو
    const video = document.createElement("video");

    video.id = "video" + item.id;
    video.src = item.video;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    assets.appendChild(video);

    // ساخت Target
    const entity = document.createElement("a-entity");

    entity.setAttribute(
        "mindar-image-target",
        targetIndex: ${item.id}
);

    // ساخت ویدیو
    const plane = document.createElement("a-video");

    plane.setAttribute("src", "#" + video.id);
    plane.setAttribute("width", item.width);
    plane.setAttribute("height", item.height);
    plane.setAttribute("position", "0 0 0");

    entity.appendChild(plane);

    scene.appendChild(entity);

    entity.addEventListener("targetFound", () => {

        video.play();

    });

    entity.addEventListener("targetLost", () => {

        video.pause();
        video.currentTime = 0;

    });

});