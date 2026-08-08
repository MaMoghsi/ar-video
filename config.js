const Debug = false;
const TARGETS = [

    {
        id: 0,

        type: "model",

        src: "assets/models/Hamburger.glb",

        position: "0 0 0",

        rotation: "0 0 0",

        scale: "0.01 0.01 0.01",

        visible: true,
        animation:{
            type: "rotate",
            height: 0.08,
            speed: 45
        }

    },

    {
        id: 1,

        type: "video",

        src: "assets/videos/outro.mp4",

        width: 1,
        height: 0.56,

        position: "0 0 0",

        rotation: "0 0 0",

        opacity: 1,

        transparent: true,

        restart: false,

        fitTarget: true
    }

];