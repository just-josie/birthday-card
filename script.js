script.js
 // Get the name from the URL parameters (e.g., ?name=Josie)
const urlParams = new URLSearchParams(window.location.search);
let name = urlParams.get('name') || "XXX";
document.getElementById('name').textContent = name;

// Update name when user types it in
document.getElementById('updateName').addEventListener('click', function() {
    const newName = document.getElementById('nameInput').value;
    if (newName) {
        document.getElementById('name').textContent = newName;
    }
});

// Audio processing to detect blowing and animate the candle flame
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
            if (maxAmplitude > 250) {
                document.getElementById('flame').style.display = 'none'; // Hide the flame
            } else {
                // Adjust threshold for flicker effect
                if (maxAmplitude > 250) {
                    const flame = document.getElementById('flame');
                    flame.style.transform = 'scale(1.5)'; // Bigger flicker
                    setTimeout(() => {
                        flame.style.transform = 'scale(1)'; // Reset to normal
                    }, 100);
                }
                // Ensure the flame is visible if it's not blown out
                document.getElementById('flame').style.display = 'block';
            }
            
            requestAnimationFrame(detectBlow);
        }
        
        detectBlow();
    })
    .catch(function(err) {
        console.error('Error accessing the microphone', err);
    });

