
// CREATES BUFFER AND PLAYS SOUND

var dogBarkingBuffer = null;
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var distortion = context.createWaveShaper();


function loadDogSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      dogBarkingBuffer = buffer;
      // PlaySound.play(dogBarkingBuffer);
      FilterSample.play(dogBarkingBuffer);
    });
  }
  request.send();
}

loadDogSound('http://127.0.0.1:8080/attack.mp3');

var FilterSample = {
  FREQ_MUL: 7000,
  QUAL_MUL: 30,
  playing: false
};

FilterSample.play = function(buffer) {
  // Create the source.
  var source = context.createBufferSource();
  source.buffer = buffer;
  // Create the filter.
  var filter = context.createBiquadFilter();
  var oscillator = context.createOscillator();
  var gainNode = context.createGain();
  var analyser = context.createAnalyser();
  var distortion = context.createWaveShaper();
  var convolver = context.createConvolver();
  //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
  filter.type = 'lowpass'; // LOWPASS
  filter.frequency.value = 100;
  distortion.curve = makeDistortionCurve(400);
  distortion.oversample = '4x';
  gainNode.gain.value = 0;
  convolver.normalize = true; // must be set before the buffer, to take effect
  convolver.buffer = dogBarkingBuffer;
  // Connect source to filter, filter to destination.
  // source.connect(filter);
  // filter.connect(analyser);
  source.connect(distortion);
  distortion.connect(convolver);
  // gain.connect(convolver);
  convolver.connect(gainNode);
  gainNode.connect(context.destination);
  // filter.connect(context.destination);
  // Play!
  // if (!source.start)
  //   source.start = source.noteOn;
  source.start(0);
  source.loop = false;
  // Save source and filterNode for later access.
  // this.source = source;
  // this.filter = filter;
};

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

// PLAYS 2 SOUNDS AT SAME TIME

// window.onload = init;
// var context;
// var bufferLoader;

// function init() {
//     // Fix up prefixing
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
//     context = new AudioContext();

//     bufferLoader = new BufferLoader(
//         context, [
//             'http://127.0.0.1:8080/attack.mp3',
//             'http://127.0.0.1:8080/select_remaining.mp3',
//         ],
//         finishedLoading
//     );

//     bufferLoader.load();
// }

// function finishedLoading(bufferList) {
//     // Create two sources and play them both together.
//     var source1 = context.createBufferSource();
//     var source2 = context.createBufferSource();
//     source1.buffer = bufferList[0];
//     source2.buffer = bufferList[1];

//     source1.connect(context.destination);
//     source2.connect(context.destination);
//     source1.start(0);
//     source2.start(0);
// }

// TOGGLE/PLAYBACK FUNCTIONS FOR EXAMPLE ABOVE

// FilterSample.stop = function() {
//   if (!this.source.stop)
//     this.source.stop = source.noteOff;
//   this.source.stop(0);
//   this.source.noteOff(0);
// };

// FilterSample.toggle = function() {
//   this.playing ? this.stop() : this.play();
//   this.playing = !this.playing;
// };

// FilterSample.changeFrequency = function(element) {
//   // Clamp the frequency between the minimum value (40 Hz) and half of the
//   // sampling rate.
//   var minValue = 40;
//   var maxValue = context.sampleRate / 2;
//   // Logarithm (base 2) to compute how many octaves fall in the range.
//   var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
//   // Compute a multiplier from 0 to 1 based on an exponential scale.
//   var multiplier = Math.pow(2, numberOfOctaves * (element.value - 1.0));
//   // Get back to the frequency value between min and max.
//   this.filter.frequency.value = maxValue * multiplier;
// };

// FilterSample.changeQuality = function(element) {
//   this.filter.Q.value = element.value * this.QUAL_MUL;
// };

// FilterSample.toggleFilter = function(element) {
//   this.source.disconnect(0);
//   this.filter.disconnect(0);
//   // Check if we want to enable the filter.
//   if (element.checked) {
//     // Connect through the filter.
//     this.source.connect(this.filter);
//     this.filter.connect(context.destination);
//   } else {
//     // Otherwise, connect directly.
//     this.source.connect(context.destination);
//   }
// };















// var PlaySound = {
//   FREQ_MUL: 7000,
//   QUAL_MUL: 30,
//   playing: false
// };

// PlaySound.play = function(buffer) {
//   var source = context.createBufferSource(); // creates a sound source
//   source.buffer = buffer; 
//   var filter = context.createBiquadFilter();
//   filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
//   filter.frequency.value = 100; // Set cutoff to 440 HZ                   // tell the source which sound to play
//   source.connect(filter);
//   source.connect(context.destination);       // connect the source to the context's destination (the speakers)
//   source.start(0);                           // play the source now
// };



        // var oscillator = audioCtx.createOscillator();
        // var gainNode = audioCtx.createGain();
        // var analyser = audioCtx.createAnalyser();
        // var distortion = audioCtx.createWaveShaper();
        // var gainNode = audioCtx.createGain();
        // var biquadFilter = audioCtx.createBiquadFilter();
        // var convolver = audioCtx.createConvolver();

        // navigator.mediaDevices.getUserMedia(constraints)
        // .then(function(stream) {
        //   	var video = document.querySelector('video');
        //   	source = audioCtx.createMediaStreamSource(stream);
        // source.connect(analyser);
        // analyser.connect(distortion);
        // distortion.connect(biquadFilter);
        // biquadFilter.connect(convolver);
        // convolver.connect(gainNode);
        // gainNode.connect(audioCtx.destination);
        // biquadFilter.type = "lowshelf";
        // biquadFilter.frequency.value = 1000;
        // biquadFilter.gain.value = 25;

        //  // 	oscillator.connect(gainNode);
        // 	// gainNode.connect(audioCtx.destination);
        //  // 	source = audioCtx.createMediaStreamSource(stream);

        // 	// source.connect(analyser);
        // 	// analyser.connect(distortion);
        // 	// distortion.connect(biquadFilter);
        // 	// biquadFilter.connect(convolver);
        // 	// convolver.connect(gainNode);
        // 	// gainNode.connect(audioCtx.destination);

        // 	// oscillator.type = 'sine'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
        // 	// oscillator.frequency.value = 2500; // value in hertz
        // 	// oscillator.start();


        //   video.srcObject = stream;
        //   video.onloadedmetadata = function(e) {
        //     video.play();
        //   };
        // })
        // .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.




        // navigator.mediaDevices.getUserMedia('audio', gotAudio);
        //  function gotAudio(stream) {
        //      var microphone = context.createMediaStreamSource(stream);
        //      var filter = context.createBiquadFilter();
        //      var peer = context.createMediaStreamDestination();
        //      microphone.connect(filter);
        //      filter.connect(peer);
        //      peerConnection.addStream(peer.stream);
        //  }









        // if (navigator.mediaDevices.getUserMedia) {
        //     console.log('getUserMedia supported.');
        //     navigator.mediaDevices.getUserMedia (
        //       // constraints: audio and video for this app
        //       {
        //          audio: true,
        //          video: true
        //       },
        //       // Success callback
        //       function(stream) {
        //          video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        //          video.onloadedmetadata = function(e) {
        //             video.play();
        //             video.muted = 'true';
        //          };
        //     }
        // )};

        // var context;
        // if (typeof AudioContext !== "undefined") {
        //     context = new AudioContext();
        // } else if (typeof webkitAudioContext !== "undefined") {
        //     context = new webkitAudioContext();
        // } else {
        //     throw new Error('AudioContext not supported. :(');
        // }


        // var request = new XMLHttpRequest();
        // request.open("GET", 'http://10.0.0.2:8080/attack.mp3', true);
        // request.responseType = "arraybuffer";

        // // Our asynchronous callback
        // request.onload = function() {
        //     var audioData = request.response;
        //     createSoundSource(audioData);
        // };
        // request.send();




        // $(document).ready(function() {



        // var myAudioContext = new AudioContext();


        // var audio = new Audio('assets/audio/attack.mp3');
        // // audio.play();



        // myAudioContext.createMediaElementSource(audio);

        // var source = myAudioContext.createOscillator();
        // source.type = 0; // sine wave

        // var curveLength = 100;
        // var curve1 = new Float32Array(curveLength);
        // var curve2 = new Float32Array(curveLength);
        // for (var i = 0; i < curveLength; i++)
        //     curve1[i] = Math.sin(Math.PI * i / curveLength);

        // for (var i = 0; i < curveLength; i++)
        //     curve2[i] = Math.cos(Math.PI * i / curveLength);

        // var waveTable = myAudioContext.createWaveTable(curve1, curve2);
        // source.setWaveTable(waveTable);


        // });



        // // Create lineOut
        // var lineOut	= new WebAudiox.LineOut(context)
        // lineOut.volume	= 0.2
        // var analyser	= context.createAnalyser()
        // analyser.connect(lineOut.destination);
        // lineOut.destination	= analyser;
        // // load a sound and play it immediatly
        // WebAudiox.loadBuffer(context, 'http://127.0.0.1:8080/attack.mp3', function(buffer){
        // 	var source	= context.createBufferSource();
        // 	source.buffer	= buffer;
        // 	source.loop	= true
        // 	source.connect(lineOut.destination);
        // 	source.start(0);		
        // });

        // // get microphone as source
        // // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        // // navigator.getUserMedia( {audio:true}, 	function gotStream(stream) {
        // // 	// Create an AudioNode from the stream.
        // // 	var source	= context.createMediaStreamSource( stream );

        // // 	source.connect(lineOut.destination);
        // // });	



        // //////////////////////////////////////////////////////////////////////////////////
        // //		comment								//
        // //////////////////////////////////////////////////////////////////////////////////
        // // create and add the canvas
        // var canvas	= document.createElement('canvas');
        // canvas.width	= window.innerWidth;
        // canvas.height	= window.innerHeight;
        // var ctx		= canvas.getContext("2d");  
        // document.body.appendChild(canvas)
        // // create the object
        // var analyser2canvas	= new WebAudiox.Analyser2Canvas(analyser, canvas)
        // // loop and update
        // requestAnimationFrame(function update() {
        // 	requestAnimationFrame(update);
        // 	// clear the canvas
        // 	ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 	// put the sound in the canvas
        // 	analyser2canvas.update()
        // })
