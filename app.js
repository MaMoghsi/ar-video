const scene = document.querySelector("a-scene");
const assets = document.querySelector("#assets");

let currentVideo = null;

window.addEventListener("load", init);

function init() {

    TARGETS.forEach(function (item) {
        createTarget(item);
    });

}

function createTarget(item) {

    if (item.type === "video") {
        createVideoAsset(item);
    }

    const entity = document.createElement("a-entity");

    entity.setAttribute(
        "mindar-image-target",
        "targetIndex: " + item.id
    );

    const object = createObject(item);

    if (!object) {
        return;
    }

    entity.appendChild(object);

    scene.appendChild(entity);

    if (item.type === "video") {

        const video = document.getElementById("video" + item.id);

        bindEvents(entity, video, item);

    }

}

function createObject(item) {

    switch (item.type) {

        case "video":
            return createVideoPlane(item);

        case "image":
            return createImage(item);

        default:
            console.error("Unknown Type : " + item.type);
            return null;

    }

}

function createVideoAsset(item) {

    const video = document.createElement("video");

    video.id = "video" + item.id;

    video.src = item.src;

    video.loop = true;

    video.preload = "auto";

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    assets.appendChild(video);

}

function createVideoPlane(item) {

    const video = document.getElementById("video" + item.id);

    const plane = document.createElement("a-video");

    plane.setAttribute("src", "#video" + item.id);

    plane.setAttribute("width", item.width);

    plane.setAttribute("height", item.height);

    plane.setAttribute("position", item.position);

    plane.setAttribute("rotation", item.rotation);

    plane.setAttribute("opacity", item.opacity);

    plane.setAttribute("transparent", item.transparent);

    return plane;

}

function createImage(item) {

    const image = document.createElement("a-image");

    image.setAttribute("src", item.src);

    image.setAttribute("width", item.width);

    image.setAttribute("height", item.height);

    image.setAttribute("position", item.position);

    image.setAttribute("rotation", item.rotation);

    image.setAttribute("opacity", item.opacity);

    image.setAttribute("transparent", item.transparent);

    return image;

}

function bindEvents(entity, video, item) {

    entity.addEventListener("targetFound", function () {

        if (currentVideo && currentVideo !== video) {

            currentVideo.pause();

            currentVideo.currentTime = 0;

        }

        currentVideo = video;

        video.play();

    });

    entity.addEventListener("targetLost", function () {

        video.pause();

        if (item.restart) {
            video.currentTime = 0;
        }

        if (currentVideo === video) {
            currentVideo = null;
        }

    });

}