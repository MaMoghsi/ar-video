const TARGETS = [

    {
        // id: 0,
        //
        // type: "video",
        //
        // src: "assets/videos/intro.mp4",
        //
        // width: 1,
        // height: 0.56,
        //
        // position: "0 0 0",
        //
        // rotation: "0 0 0",
        //
        // opacity: 1,
        //
        // transparent: true,
        //
        // restart: false,
        //
        // fitTarget: true,
        //
        // onFound: function (){
        //     console.log("target 0 Found");
        // },
        //
        // onLost: function (){
        //     console.log("target 0 Found");
        // }
        id: 0,

        type: "model",

        src: "assets/models/Hamburger.glb",

        position: "0 0 0",

        rotation: "0 0 0",

        scale: "0.001 0.001 0.001",

        visible: true

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