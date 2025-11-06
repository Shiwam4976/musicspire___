// Advanced player script
const playlistEl = document.getElementById('playlist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const cover = document.getElementById('cover');
const currTime = document.getElementById('currTime');
const durTime = document.getElementById('durTime');
const volume = document.getElementById('volume');
const playbackRate = document.getElementById('playbackRate');

// Tracks: title, file (exact filename in Music/), image (in images/)
const tracks = [
	{ title: 'Dhun', file: 'Dhun.mp3', image: 'Dhun.jpg', artist: '' },
	{ title: 'Tum ho toh', file: 'Tum ho toh.mp3', image: 'Tum ho toh.jpg', artist: '' },
	{ title: 'Deewaniayt', file: 'Deewaniayt.mp3', image: 'Deewaniayt.jpg', artist: '' },
	{ title: 'Khoobsurat', file: 'Khoobsurat.mp3', image: 'Khoobsurat.jpg', artist: '' },
	{ title: 'Kaise Hua', file: 'Kaise Hua.mp3', image: 'Kaise Hua.jpg', artist: '' },
	{ title: 'Bekhayali', file: 'Bekhayali Kabir Singh .mp3', image: 'Bekhayali.jpg', artist: '' },
	{ title: 'Tumhare hi rahenge hum', file: 'Tumhare hi rahenge hum.mp3', image: 'Tumhare hi rahenge hum.jpg', artist: '' }
];

let current = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Build playlist UI
function buildPlaylist() {
	tracks.forEach((t, i) => {
		const li = document.createElement('li');
		li.dataset.index = i;
		li.innerHTML = `<img src="images/${t.image}" alt="cover"><div class="track-meta"><strong>${t.title}</strong><small>${t.artist}</small></div>`;
		li.addEventListener('click', () => {
			loadTrack(i);
			playTrack();
		});
		playlistEl.appendChild(li);
	});
	highlight();
}

function highlight() {
	const items = playlistEl.querySelectorAll('li');
	items.forEach((li) => li.classList.remove('active'));
	const active = playlistEl.querySelector(`li[data-index='${current}']`);
	if (active) active.classList.add('active');
}

function loadTrack(index) {
	const track = tracks[index];
	current = index;
	audio.src = `Music/${track.file}`; // folder name 'Music'
	titleEl.textContent = track.title;
	artistEl.textContent = track.artist || '';
	cover.src = `images/${track.image}`;
	highlight();
}

function playTrack() {
	audio.play();
	isPlaying = true;
	playBtn.classList.add('active');
	playBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
}

function pauseTrack() {
	audio.pause();
	isPlaying = false;
	playBtn.classList.remove('active');
	playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
}

function togglePlay() {
	isPlaying ? pauseTrack() : playTrack();
}

function prevTrack() {
	if (isShuffle) {
		current = Math.floor(Math.random() * tracks.length);
	} else {
		current = (current - 1 + tracks.length) % tracks.length;
	}
	loadTrack(current);
	playTrack();
}

function nextTrack() {
	if (isShuffle) {
		current = Math.floor(Math.random() * tracks.length);
	} else {
		current = (current + 1) % tracks.length;
	}
	loadTrack(current);
	playTrack();
}

// Progress UI
function updateProgress(e) {
	const { duration, currentTime } = e.target;
	if (!isFinite(duration)) return;
	const percent = (currentTime / duration) * 100;
	progress.style.width = `${percent}%`;
	currTime.textContent = formatTime(currentTime);
	durTime.textContent = formatTime(duration);
}

function setProgress(e) {
	const rect = progressContainer.getBoundingClientRect();
	const clickX = e.clientX - rect.left;
	const w = rect.width;
	const duration = audio.duration || 0;
	audio.currentTime = (clickX / w) * duration;
}

function formatTime(time) {
	if (!isFinite(time)) return '00:00';
	const m = Math.floor(time / 60);
	const s = Math.floor(time % 60);
	return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Shuffle/Repeat
shuffleBtn.addEventListener('click', () => {
	isShuffle = !isShuffle;
	shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
	isRepeat = !isRepeat;
	repeatBtn.classList.toggle('active', isRepeat);
});

// Volume and playback rate
volume.addEventListener('input', (e) => { audio.volume = e.target.value; });
playbackRate.addEventListener('change', (e) => { audio.playbackRate = parseFloat(e.target.value); });

// Events
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', () => {
	if (isRepeat) {
		audio.currentTime = 0;
		playTrack();
	} else {
		nextTrack();
	}
});

// Initialize
buildPlaylist();
loadTrack(current);
audio.volume = parseFloat(volume.value);
