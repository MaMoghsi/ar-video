let selectedObject = null;
let selectedTarget = null;
const registry = {};
const assetManager = {}
const factories = {
    video: createVideoPlane,
    image: createImage,
    model: createModel
}
const scene = document.querySelector("a-scene");
const assets = document.querySelector("#assets");

let currentVideo = null;

window.addEventListener("load", init);

function init() {

    TARGETS.forEach(function (item) {
        createTarget(item);
    });

    if (!Debug){
        document.getElementById("debug-panel").remove()
    }

    document.getElementById("scale-plus").onclick = increaseScale;
    document.getElementById("scale-minus").onclick = decreaseScale;
    document.getElementById("copy-config").onclick = copyConfig;
}

function createTarget(item) {

    switch (item.type){
        case "video":
            createVideoAsset(item)
            break;
        case "model":
            createModelAsset(item)
            break;
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

    }else{
        bindEvents(entity,null,item);
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
function applyProperties(object, item){

    if(item.width){
        object.setAttribute("width", item.width);
    }

    if(item.height){
        object.setAttribute("height", item.height);
    }

    if(item.position){
        object.setAttribute("position", item.position);
    }

    if(item.rotation){
        object.setAttribute("rotation", item.rotation);
    }

    if(item.scale){
        object.setAttribute("scale", item.scale);
    }

    if(item.opacity !== undefined){
        object.setAttribute("opacity", item.opacity);
    }

    if(item.transparent !== undefined){
        object.setAttribute("transparent", item.transparent);
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
        if (video){
            currentVideo = video;
            selectedObject = getObject(item.id);

            selectedTarget=item.id;
            play(item.id);
        }

        if (item.onFound) {

            item.onFound();

        }

    });

    entity.addEventListener("targetLost", function () {
        if (video) {
            pause(item.id);

            if (item.restart) {

                stop(item.id);

            }
        }

        if (currentVideo === video) {

            currentVideo = null;

        }

        if (item.onLost) {

            item.onLost();

        }

        if (selectedObject === getObject(item.id)){
            selectedObject = null;
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
function createModelAsset(item){

    const asset = document.createElement("a-asset-item");

    asset.id = "model" + item.id;

    asset.setAttribute("src", item.src);

    assets.appendChild(asset);

    registerAsset(asset.id, asset);

}
function createModel(item){

    const model = document.createElement("a-gltf-model");

    model.setAttribute(
        "src",
        "#model" + item.id
    );

    applyProperties(model, item);
    return model;

}
function changeScale(step){

    if(selectedTarget == null){

        return;

    }

    const object = getObject(selectedTarget);

    const scale = object.object3D.scale;

    scale.x += step;

    scale.y += step;

    scale.z += step;

    console.log(
        scale.x,
        scale.y,
        scale.z
    );

}
function increaseScale(){

    if(!selectedObject){
        return;
    }

    const scale = selectedObject.getAttribute("scale");

    const value = scale.x + 0.05;

    selectedObject.setAttribute(
        "scale",
        value + " " + value + " " + value
    );

    document.getElementById("scale-value").innerText =
        value.toFixed(2);

}
function decreaseScale(){

    if(!selectedObject){
        return;
    }

    const scale = selectedObject.getAttribute("scale");

    const value = Math.max(0.01, scale.x - 0.05);

    selectedObject.setAttribute(
        "scale",
        value + " " + value + " " + value
    );

    document.getElementById("scale-value").innerText =
        value.toFixed(2);

}

function updateDebugValues(){

    if(!selectedObject){
        return;
    }

    document.getElementById("scale-value").innerText =
        selectedObject.object3D.scale.x.toFixed(2);

}
function copyConfig(){

    if(!selectedObject){
        return;
    }

    const position = selectedObject.object3D.position;
    const rotation = selectedObject.object3D.rotation;
    const scale = selectedObject.object3D.scale;

    const text =
        'position: "' +
        position.x.toFixed(3) + ' ' +
        position.y.toFixed(3) + ' ' +
        position.z.toFixed(3) +
        '",\n' +

        'rotation: "' +
        Math.round(rotation.x * 180 / Math.PI) + ' ' +
        Math.round(rotation.y * 180 / Math.PI) + ' ' +
        Math.round(rotation.z * 180 / Math.PI) +
        '",\n' +

        'scale: "' +
        scale.x.toFixed(3) + ' ' +
        scale.y.toFixed(3) + ' ' +
        scale.z.toFixed(3) +
        '"';

    navigator.clipboard.writeText(text);

    alert("Config Copied");

}