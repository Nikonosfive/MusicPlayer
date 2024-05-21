document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const audio = document.getElementById('audio');
    const playPauseButton = document.getElementById('playPauseButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const shuffleButton = document.getElementById('shuffleButton');
    const repeatButton = document.getElementById('repeatButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const speedSlider = document.getElementById('speedSlider');
    const volumeLabel = document.getElementById('volumeLabel');
    const speedLabel = document.getElementById('speedLabel');
    const playlistElement = document.getElementById('playlist');
    const nowPlaying = document.getElementById('nowPlaying');

    let playlist = [];
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;

    fileInput.addEventListener('change', function () {
        const files = Array.from(fileInput.files);
        if (files.length > 0) {
            playlist = playlist.concat(files);
            loadPlaylist();
            if (playlist.length === files.length) {
                currentTrackIndex = 0;
                loadTrack(currentTrackIndex);
            }
        }
    });

    playPauseButton.addEventListener('click', function () {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    });

    prevButton.addEventListener('click', function () {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
            audio.play();
        }
    });

    nextButton.addEventListener('click', function () {
        if (currentTrackIndex < playlist.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
            audio.play();
        }
    });

    shuffleButton.addEventListener('click', function () {
        isShuffle = !isShuffle;
        shuffleButton.textContent = isShuffle ? 'Unshuffle' : 'Shuffle';
    });

    repeatButton.addEventListener('click', function () {
        isRepeat = !isRepeat;
        repeatButton.textContent = isRepeat ? 'Unrepeat' : 'Repeat';
    });

    volumeSlider.addEventListener('input', function () {
        audio.volume = volumeSlider.value;
        volumeLabel.textContent = `${Math.round(volumeSlider.value * 100)}%`;
    });

    speedSlider.addEventListener('input', function () {
        audio.playbackRate = speedSlider.value;
        speedLabel.textContent = `${Math.round(speedSlider.value * 100)}%`;
    });

    audio.addEventListener('play', function () {
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
        updateNowPlaying();
    });

    audio.addEventListener('pause', function () {
        isPlaying = false;
        playPauseButton.textContent = 'Play';
    });

    audio.addEventListener('ended', function () {
        if (isRepeat) {
            audio.play();
        } else if (isShuffle) {
            currentTrackIndex = Math.floor(Math.random() * playlist.length);
            loadTrack(currentTrackIndex);
            audio.play();
        } else if (currentTrackIndex < playlist.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
            audio.play();
        }
    });

    function loadTrack(index) {
        const file = playlist[index];
        const url = URL.createObjectURL(file);
        audio.src = url;
        audio.load();
        updatePlaylistUI();
        updateNowPlaying();
    }

    function loadPlaylist() {
        playlistElement.innerHTML = '';
        playlist.forEach((file, index) => {
            const li = document.createElement('li');
            li.textContent = file.name;
            li.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                audio.play();
            });
            playlistElement.appendChild(li);
        });
    }

    function updatePlaylistUI() {
        const items = playlistElement.getElementsByTagName('li');
        Array.from(items).forEach((item, index) => {
            if (index === currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function updateNowPlaying() {
        if (playlist[currentTrackIndex]) {
            nowPlaying.textContent = `Now Playing: ${playlist[currentTrackIndex].name}`;
        } else {
            nowPlaying.textContent = 'Now Playing: None';
        }
    }
});
