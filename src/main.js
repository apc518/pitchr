"use strict";

let snd;
let audioSampleFilename;
let audioFileExtension;

function initSound() {
    audioSampleFilename = audioSampleOptions[audioSampleDropdown.selectedIndex].filepath;

    let filenameSplitByDot = audioSampleFilename.split(".");
    audioFileExtension = filenameSplitByDot[filenameSplitByDot.length - 1];
    
    snd = new Sound(audioSampleFilename, audioFileExtension, 1);
}


let soundDuration = 1; // second

const noteToNum = {"B#":0, "C":0, "Dbb":0,"C#":1, "Db":1, "Bx":1, "D":2,"Cx":2,"Ebb":2, "D#":3, "Eb":3, "Fbb":3, "E":4, "Dx":4, "Fb":4, "E#":5, "F":5, "Gbb":5, "F#":6, "Gb":6, "Ex":6, "G":7, "Fx":7, "Abb":7, "G#":8, "Ab":8, "A":9, "Gx":9, "Bbb":9, "A#":10, "Bb":10, "Cbb":10, "B":11, "Cb":11, "Ax":11};
const numToNote = {0:"C", 1:"Db", 2:"D", 3:"Eb", 4:"E", 5:"F", 6:"Gb", 7:"G", 8:"Ab", 9:"A", 10:"Bb", 11:"B"};

let noteValue = -1;
let stopScrambling = false;
let hasAnsweredCurrentChallenge = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function scramble(){
    let snd2 = new Sound(audioSampleFilename, audioFileExtension, 1);
    let snd3 = new Sound(audioSampleFilename, audioFileExtension, 1);

    let scrambleHelper = (duration) => {
        if (stopScrambling){
            stopScrambling = false;
            return;
        }

        snd.setRate(1 * Math.pow(2,  (Math.floor(Math.random() * 48) + 0.5) / 12));
        snd2.setRate(1 * Math.pow(2, (Math.floor(Math.random() * 48) + 0.5) / 12));
        snd3.setRate(1 * Math.pow(2, (Math.floor(Math.random() * 48) + 0.5) / 12));
        snd.snd.stereo(Math.random() * 2 - 1);
        snd2.snd.stereo(Math.random() * 2 - 1);
        snd3.snd.stereo(Math.random() * 2 - 1);
        snd.play(duration);
        if (Math.random() < 0.75)
            snd2.play(duration);
        if (Math.random() < 0.5)
            snd3.play(duration);
    
        sleep(duration * 1000 * (Math.random() + 0.5)).then(() => {
            scrambleHelper(duration);
        });
    }

    scrambleHelper(0.12);
}

function newChallenge(){
    hasAnsweredCurrentChallenge = false;
    answerInput.value = "";
    let oldNoteValue = noteValue;
    let iterations = 0;
    while (noteValue === oldNoteValue){
        noteValue = Math.floor(Math.random() * 48);
        iterations += 1;
        if (iterations > 1000){
            console.error("new note value tries exceeded; was same note 1000 times in a row somehow???");
            break;
        }
    }
}

function play(){
    snd.setRate(1 * Math.pow(2, noteValue / 12));
    snd.play(1);
}

function storeResult(numberAnswered, actualNote){
    let sessionList = JSON.parse(localStorage.pitchrSessions);
    sessionList[sessionContainer.getSelectedIndex()].history.push({ date: Date.now(), guess: numberAnswered, answer: actualNote });
    localStorage.pitchrSessions = JSON.stringify(sessionList);
}

function checkAnswer(answer){
    if (!Object.keys(noteToNum).includes(answer)){
        return;
    }

    let numberOfAnswer = noteToNum[answer];

    if (!hasAnsweredCurrentChallenge){
        storeResult(numberOfAnswer, noteValue % 12);
        
        if (numberOfAnswer === (noteValue % 12)) {
            Swal.fire({
                title: `Correct!`,
                imageUrl: "assets/images/jacob-yes.png",
                showCancelButton: false,
                timer: autoplayCheckbox.checked ? 1500 : null
            });
        }
        else{
            Swal.fire({
                title: `Wrong. It was ${numToNote[noteValue % 12]}`,
                imageUrl: "assets/images/jacob-no.png",
                showCancelButton: false,
                timer: autoplayCheckbox.checked ? 1500 : null
            })
        }
    }

    hasAnsweredCurrentChallenge = true;

    if (autoplayCheckbox.checked) {
        setTimeout(() => {
            newChallenge();
            play();
        }, 1500);
    }
}

function populateSaveCards(){

}

function main(){
    displayAudioSampleSettings();
    populateSaveCards();
    initSound();
    Howler.volume(convertSliderValueToAmplitude(50));
    newChallenge();
}

main();