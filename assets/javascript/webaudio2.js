// Prefer camera resolution nearest to 1280x720.
var constraints = { audio: true, video: { width: 1280, height: 720 } }; 

// stream = new MediaStream(stream);
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      	var video = document.querySelector('video');
      	source = audioCtx.createMediaStreamSource(stream);
      	video.srcObject = stream;
        video.onloadedmetadata = function(e) {
        	video.play();
        };
    })
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.