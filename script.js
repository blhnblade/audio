async function getMicrophoneAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    } catch (err) {
        console.error('Error accessing microphone: ', err);
        return null;
    }
}

let mediaRecorder;
let audioChunks = [];

async function startRecording() {
    const stream = await getMicrophoneAccess();
    if (!stream) return;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioChunks = [];
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.controls = true;
        document.body.appendChild(audio);
    };

    mediaRecorder.start();
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}
