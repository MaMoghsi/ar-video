const registry = {};
const assetManager = {}
const factories = {
    video: createVideoPlane,
    image: createImage
}
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
    registry[item.id] = {
        item: item,
        entity: entity,
        object: object,
    }

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

    const factory = factories[item.type];

    if (!factory) {

        console.error("Unknown Type : " + item.type);

        return null;

    }

    return factory(item);

}
function applyProperties(object,item){
    object.setAttribute("width",item.width);
    object.setAttribute("height",item.height);
    object.setAttribute("position",item.position);
    object.setAttribute("rotation",item.rotation);
    object.setAttribute("opacity",item.opacity);
    object.setAttribute("transparent",item.transparent);
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
    registerAsset(video.id,video);

}
function registerAsset(id,asset){
    assetManager[id] = asset;
}
function getAsset(id){
    return assetManager[id];
}

function createVideoPlane(item) {

    const video = document.getElementById("video" + item.id);

    const plane = document.createElement("a-video");

    plane.setAttribute("src", "#video" + item.id);
    applyProperties(plane,item)

    return plane;

}

function createImage(item) {

    const image = document.createElement("a-image");

    image.setAttribute("src", item.src);
    applyProperties(image,item)

    return image;

}

function bindEvents(entity, video, item) {

    entity.addEventListener("targetFound", function () {

        if (currentVideo && currentVideo !== video) {

            stop(currentVideo.id.replace("video", ""));

        }

        currentVideo = video;

        play(item.id);

        if (item.onFound) {

            item.onFound();

        }

    });

    entity.addEventListener("targetLost", function () {

        pause(item.id);

        if (item.restart) {

            stop(item.id);

        }

        if (currentVideo === video) {

            currentVideo = null;

        }

        if (item.onLost) {

            item.onLost();

        }

    });

}
function getObject(id){
    const target = getTarget(id);

    if(!target){
        return null;
    }
    return target.object;
}
function hide(id){
    const object = getObject(id);
    if (!object) return;
    object.setAttribute("visible",false);
}
function show(id){
    const object = getObject(id);
    if (!object) return;
    object.setAttribute("visible",true);
}
function setPosition(id, x, y, z) {

    const object = getObject(id);

    if (!object) return;

    object.setAttribute(
        "position",
        x + " " + y + " " + z
    );

}

function getTarget(id){
    return registry[id];
}

function getVideo(id){
    const target = getTarget(id);

    if(!target){
        return null;
    }
    return getAsset("video"+id);
}
function play(id){

    const video = getVideo(id);

    if(!video){

        return;

    }

    video.play();

}
function pause(id){

    const video = getVideo(id);

    if(!video){

        return;

    }

    video.pause();

}
function stop(id){

    const video = getVideo(id);

    if(!video){

        return;

    }

    video.pause();

    video.currentTime = 0;

}
function unmute(id){

    const video = getVideo(id);

    if(!video){

        return;

    }

    video.muted = false;

}
function mute(id){

    const video = getVideo(id);

    if(!video){

        return;

    }

    video.muted = true;

}
function toggle(id){

    const object = getObject(id);

    if(!object){

        return;

    }

    const visible = object.getAttribute("visible");

    object.setAttribute(
        "visible",
        !visible
    );

}
function isTracking(id){

    const target = getTarget(id);

    if(!target){

        return false;

    }

    return target.entity.object3D.visible;
}
function registerType(name,factory){
    factories[name] = factory;
}