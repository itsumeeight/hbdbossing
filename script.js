document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;

    // Function to add a candle to the cake
    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = left + "px";
        candle.style.top = top + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        cake.appendChild(candle);
        candles.push(candle);
    }

    // Function to place 25 candles evenly across the top of the cake
    function placeCandles() {
        const cakeWidth = 250; // Adjust based on cake width (match icing width)
        const candleWidth = 100; // Width of each candle
        const candleGap = (cakeWidth - (5 * candleWidth)) / 4; // Gap between candles
        const startX = (350 - cakeWidth) / 2; // Center the candles horizontally
        const startY = -5; // Vertical starting position on top of the cake

        // Loop to create 5 rows with 5 candles each
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const left = startX + col * (candleWidth + candleGap);
                const top = startY + row * 10; // Adjust vertical spacing (20px between rows)
                addCandle(left, top);
            }
        }
    }

    // Automatically place candles on the cake
    placeCandles();
    // displayGreeting(); // Show the greeting message - Uncomment this if you have a function

    // Function to detect if the user is blowing (microphone input)
    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        return average > 40; // Adjust sensitivity as needed
    }

    // Function to blow out candles when blowing is detected
    function blowOutCandles() {
        if (isBlowing()) {
            candles.forEach((candle) => {
                if (!candle.classList.contains("out") && Math.random() > 0.5) {
                    candle.classList.add("out");
                }
            });
        }
    }

    // Function to access the microphone to detect blowing
    function enableMicrophone() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(function (stream) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioContext.createAnalyser();
                    microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);
                    analyser.fftSize = 256;
                    setInterval(blowOutCandles, 200);
                })
                .catch(function (err) {
                    console.log("Unable to access microphone: " + err);
                });
        } else {
            console.log("getUserMedia not supported on your browser!");
        }
    }

    // Event listener for the button
    const micButton = document.getElementById("enable-mic");
    micButton.addEventListener("click", enableMicrophone);
});
