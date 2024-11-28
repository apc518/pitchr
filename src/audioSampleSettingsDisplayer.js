function displayAudioSampleSettings(){
    audioSampleDropdown.replaceChildren([]);
    
    for (let option of audioSampleOptions){
        let elem = document.createElement('option');
        elem.value = option.filepath;
        elem.innerText = option.displayName;
        audioSampleDropdown.appendChild(elem);
        
        elem.onclick = e => {
            if (e) return;

            audioSampleFilename = option.filepath;
            audioSampleDisplayName = option.displayName;
            audioSampleFrequency = option.sampleFrequency
        }
    }
}
