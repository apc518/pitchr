const sessionContainer = document.getElementById("sessionContainer");
sessionContainer.children[0].selected = true;

function displaySessionUI(){
    for (let child of sessionContainer.children){
        if (child.selected){
            child.style.background = "#339f";
        }
        else{
            child.style.background = "#0000"
        }
    }
}

for (let child of sessionContainer.children){
    child.onclick = e => {
        for (let c of sessionContainer.children){
            c.selected = false;
        }
        e.target.selected = true;

        displaySessionUI();
    }
}

// go to next note by pressing right arrow key or clicking next
window.addEventListener("keydown", ev => {
    if(ev.key === " "){
        play();
    }
});

// go to next note by pressing right arrow key or clicking next
window.addEventListener("keydown", ev => {
    if(ev.key === "ArrowRight"){
        nextButton.click();
    }
});

const nextButton = document.getElementById("nextButton");
nextButton.onclick = () => {
    newChallenge();
    play();
}

const autoplayCheckbox = document.getElementById("autoplayCheckbox");

const scrambleButton = document.getElementById("scrambleButton");
scrambleButton.checked = false;

scrambleButton.onclick = () => {
    scrambleButton.checked = !scrambleButton.checked;
    if (scrambleButton.checked){
        scrambleButton.innerText = "Stop Clearing My Relative Pitch"
        scramble();
    }
    else{
        scrambleButton.innerText = "Clear My Relative Pitch"
        stopScrambling = true;
    }
}


const answerInput = document.getElementById("answerInput");
answerInput.oninput = () => {
    if (Object.keys(noteToNum).includes(answerInput.value) || answerInput.value === ''){
        answerInput.style.background = "#fff";
    }
    else {
        answerInput.style.background = "#f88";
    }
}
answerInput.onkeydown = e => {
    return e.which !== 32;
}
const submitAnswerButton = document.getElementById("submitAnswerButton");

submitAnswerButton.onclick = () => {
    if (answerInput.value){
        checkAnswer(answerInput.value);
    }
}

window.addEventListener("keypress", ev => {
    if (ev.key == "Enter" && document.activeElement == answerInput){
        checkAnswer(answerInput.value);
    }
})


function logb(base, x) {
    return Math.log(x) / Math.log(base);
}

function convertSliderValueToAmplitude(sliderVal) {
    // use exponential scale to go from 0 to 1 so the volume slider feels more natural
    const tension = 50; // how extreme the curve is (higher = more extreme, slower start faster end)
    const n = 1 / (1 - logb(1 / tension, 1 + (1 / tension)));         
    const val = Math.pow(1 / tension, 1 - (sliderVal / 100) / n) - 1 / tension;
    return val;
}

const globalVolumeSlider = document.getElementById("globalVolumeSlider");

globalVolumeSlider.value = parseInt(globalVolumeSlider.max) / 2;
globalVolumeSlider.oninput = e => {
    const value = globalVolumeSlider.valueAsNumber;
    soundOn = value >= 1;
    if (!soundOn){
        Howler.stop();
    }
    Howler.volume(convertSliderValueToAmplitude(value));
}

globalVolumeSlider.onmouseup = e => e?.target.blur();

const audioSampleDropdown = document.getElementById("audioSampleDropdown");
const audioSampleFileInput = document.createElement('input');
audioSampleFileInput.type = 'file';
audioSampleFileInput.multiple = false;
audioSampleFileInput.accept = ".wav,.mp4,.mp3,.ogg,.aiff,.flac,.m4a,.aac,.wmv,.wma,.alac"

audioSampleDropdown.oninput = e => {
    e?.target.blur();
    initSound()
}

const playPauseBtn = document.getElementById("playpausebtn");
playPauseBtn.onclick = e => {
    e?.target.blur();
    play();
}