script.js
// Get the name from the URL parameters (e.g., ?name=John)
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
if (name) {
    document.getElementById('name').textContent = name;
}

// Audio processing to detect blowing
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        microphone.connect(analyser);
        
        function detectBlow() {
            analyser.getByteTimeDomainData(dataArray);
            
            let maxAmplitude = 0;
            for (let i = 0; i < dataArray.length; i++) {
                maxAmplitude = Math.max(maxAmplitude, dataArray[i]);
            }
            
            // Simple detection: if the amplitude is above a certain threshold, "blow out" the candle
            if (maxAmplitude > 200) {
                document.getElementById('flame').style.display = 'none'; // Hide the flame
            }
            
            requestAnimationFrame(detectBlow);
        }
        
        detectBlow();
    })
    .catch(function(err) {
        console.error('Error accessing the microphone', err);
    });
