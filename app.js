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

    const video = createVideo(item);

    const entity = document.createElement("a-entity");

    entity.setAttribute(
        "mindar-image-target",
        "targetIndex: " + item.id
    );

    let plane;

    if(item.type==="video"){

        plane=document.createElement("a-video");

        plane.setAttribute("src","#"+video.id);

    }

    else if(item.type==="image"){

        plane=createImage(item);

    }

    plane.setAttribute("src", "#" + video.id);

    plane.setAttribute("position", item.position);
    plane.setAttribute("rotation", item.rotation);

    plane.setAttribute("opacity", item.opacity);
    plane.setAttribute("transparent", item.transparent);

    plane.setAttribute("width", item.width);
    plane.setAttribute("height", item.height);

    entity.appendChild(plane);

    scene.appendChild(entity);

    bindEvents(entity, video, item);

}

function createVideo(item) {

    const video = document.createElement("video");

    video.id = "video" + item.id;

    video.src = item.src;

    video.loop = true;

    video.preload = "auto";

    video.setAttribute("playsinline", "");

    video.setAttribute("webkit-playsinline", "");

    assets.appendChild(video);

    return video;

}
function createImage(item){

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