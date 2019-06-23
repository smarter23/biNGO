
let handleFail = function(err){
    console.log("Error : ", err);
};

let client = AgoraRTC.createClient({
    mode: 'live',
    codec: "h264"
});

client.init("7fedbc36b31f41ada6967182cba49da8",() => console.log("AgoraRTC client initialized") ,handleFail);

client.join(null,"biNGO-demo",null, (uid)=>{

    let localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false
    });
    localStream.init(function() {

        localStream.play('general');

       
        client.publish(localStream, handleFail);

    },handleFail);

},handleFail);

client.on('stream-added', function (evt) {
    client.subscribe(evt.stream, handleFail);
});

client.on('stream-subscribed', function (evt) {
    let stream = evt.stream;
    addVideoStream(String(stream.getId()));
    stream.play(String(stream.getId()));
});
