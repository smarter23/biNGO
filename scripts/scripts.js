
let handleFail = function(err){
    console.log("Error : ", err);
};

// Queries the container in which the remote feeds belong
let remoteContainer= document.getElementById("remote-container");

function addVideoStream(streamId){
    let streamDiv=document.createElement("div"); 
    streamDiv.id=streamId;                    
    streamDiv.style.transform="rotateY(180deg)"; 
    remoteContainer.appendChild(streamDiv);      
}

function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv=document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
    console.log("Remote stream is removed " + stream.getId());
}
// Client Setup
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
        localStream.play('main');
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
client.on('stream-removed',removeVideoStream);
client.on('peer-leave',removeVideoStream);