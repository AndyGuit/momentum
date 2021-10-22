import playList from './playList.js';
import translation from './translation.js';

const timeBlock = document.querySelector('time.time');
const dateBlock = document.querySelector('date.date');
const greetingBlock = document.querySelector('span.greeting');
const nameBlock = document.querySelector('input.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('button.slide-next');
const slidePrev = document.querySelector('button.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const cityInput = document.querySelector('input.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const quote = document.querySelector('.quote');
const quoteAuthor = document.querySelector('.author');
const quoteBtn = document.querySelector('button.change-quote');
const audio = new Audio();
const playBtn = document.querySelector('button.play');
const nextBtn = document.querySelector('button.play-next');
const prevBtn = document.querySelector('button.play-prev');
const playListContainer = document.querySelector('ul.play-list');
const audioProgress = document.querySelector('.progress>input');
const audioVol = document.querySelector('.volume>input');
const volBtn = document.querySelector('.volume button');
const trackName = document.querySelector('.track-name');
const langSelect = document.querySelector('.language>select');
const picOptions = document.querySelector('.picture select');
const tagInput = document.querySelector('.picture__tags ul input');
const tagList = document.querySelector('.picture__tags ul');
const settingsIcon = document.querySelector('.settings i');
const settingsBlock = document.querySelector('.settings__block');

let randomNum = Math.floor(Math.random() * 20) + 1;
let appLanguage = localStorage.getItem('language') || langSelect.value;
let picSource = localStorage.getItem('picSource') || 'github';
let playNum = 0;
let tags = [];
let isPlay = false;
let isMouseDown = false;


function showTime() {
  const dateObj = new Date();
  const currentTime = dateObj.toLocaleTimeString();
  timeBlock.textContent = currentTime;
  setTimeout(showTime, 1000);
  setTimeout(showDate, 1000);
}

showTime();

function showDate() {
  const dateObj = new Date();
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const currentDate = dateObj.toLocaleDateString(appLanguage, options);
  dateBlock.textContent = currentDate;
}

showDate();

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  const timeOfDay = ['night', 'morning', 'day', 'evening'];
  const timeIndex = Math.floor(hours / 6);
  nameBlock.placeholder = translation.placeholder[appLanguage];
  greetingBlock.textContent = translation.greeting[appLanguage][timeIndex];

  return timeOfDay[timeIndex];
}

getTimeOfDay();

function setLocalStorage() {
  localStorage.setItem('name', nameBlock.value);
  localStorage.setItem('city', cityInput.value);
  localStorage.setItem('language', appLanguage || langSelect.value);
  localStorage.setItem('picSource', picOptions.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem('name')) {
    nameBlock.value = localStorage.getItem('name');
  }
  if (localStorage.getItem('city')) {
    cityInput.value = localStorage.getItem('city');
    getWeather();
  } else {
    cityInput.value = 'Minsk';
    getWeather();
  }
  if (localStorage.getItem('language')) {
    langSelect.value = localStorage.getItem('language');
  }
  if (localStorage.getItem('picSource')) {
    picSource = localStorage.getItem('picSource');
    picOptions.value = localStorage.getItem('picSource');
  }
}
window.addEventListener('load', getLocalStorage);

async function setBg() {
  const img = new Image();
  img.src = await getLinkToImage();

  img.onload = () => {
    body.style.backgroundImage = `url('${img.src}')`;
  };
}

setBg();

function getSlideNext() {
  if (randomNum >= 20) {
    randomNum = 1;
  } else {
    randomNum++;
  }

  setBg();
}

slideNext.addEventListener('click', getSlideNext);

function getSlidePrev() {
  if (randomNum === 1) {
    randomNum = 20;
  } else {
    randomNum--;
  }

  setBg();
}

slidePrev.addEventListener('click', getSlidePrev);

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=${appLanguage}&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `${translation.wind[appLanguage]}: ${data.wind.speed} ${translation.windValue[appLanguage]}`;
  humidity.textContent = `${translation.humidity[appLanguage]}: ${data.main.humidity}%`;
}

cityInput.addEventListener('change', getWeather);

async function getQuote() {
  let url;
  if (appLanguage === 'en') {
    url = 'https://type.fit/api/quotes';
  } else if (appLanguage === 'ru') {
    url = '../data/rusQuotes.json';
  }
  const res = await fetch(url);
  const data = await res.json();

  const random = Math.floor(Math.random() * data.length);

  quote.textContent = data[random].text;
  quoteAuthor.textContent = data[random].author || 'Unknown Author';
}

getQuote();

quoteBtn.addEventListener('click', getQuote);

function playAudio() {
  if (!isPlay) {
    isPlay = true;
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    highlightActiveTrack();
    changeListIcon();
    toggleBtn();
  } else {
    isPlay = false;
    audio.pause();
    highlightActiveTrack();
    changeListIcon();
    toggleBtn();
  }
}

function toggleBtn() {
  if (isPlay) {
    playBtn.classList.add('pause');
  } else {
    playBtn.classList.remove('pause');
  }
}

playBtn.addEventListener('click', playAudio);
playBtn.addEventListener('click', toggleBtn);

function playNext() {
  if (playNum >= playList.length - 1) {
    playNum = 0;
  } else {
    playNum++;
  }
  isPlay = false;
  playAudio();
  toggleBtn();
}

function playPrev() {
  if (playNum <= 0) {
    playNum = playList.length - 1;
  } else {
    playNum--;
  }
  isPlay = false;
  playAudio();
  toggleBtn();
}

nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

function createTrack(trackName) {
  const li = document.createElement('li');
  const icon = document.createElement('i');
  li.classList.add('play-item');
  icon.classList.add('fas', 'fa-play-circle');
  li.textContent = trackName;
  playListContainer.append(li);
  li.prepend(icon);
}

playList.forEach(el => createTrack(el.title));

function highlightActiveTrack() {
  const list = document.querySelectorAll('li.play-item');
  list.forEach(el => el.classList.remove('item-active'));
  list[playNum].classList.add('item-active');
}

audio.addEventListener('timeupdate', loopPlaylist);

function loopPlaylist() {
  if (audio.currentTime >= audio.duration) {
    playNext();
  }
}

audio.addEventListener('timeupdate', changeAudioProgress);

function changeAudioProgress() {
  const percentage = (audio.currentTime / audio.duration) * 100;
  audioProgress.style.background = `linear-gradient(to right, #dcc659 0%, #dcc659 ${percentage}%, #fff ${percentage}%, #fff 100%)`;
}

audioProgress.addEventListener('click', rewindAudio);
audioProgress.addEventListener('mousemove', (e) => isMouseDown && rewindAudio(e));
audioProgress.addEventListener('mousedown', () => isMouseDown = true);
audioProgress.addEventListener('mouseup', () => isMouseDown = false);

function rewindAudio(e) {
  const time = (e.offsetX / audioProgress.offsetWidth) * audio.duration;
  audio.currentTime = time;
}

audioVol.addEventListener('click', changeAudioVolume);
audioVol.addEventListener('mousemove', (e) => isMouseDown && changeAudioVolume(e));
audioVol.addEventListener('mousedown', () => isMouseDown = true);
audioVol.addEventListener('mouseup', () => isMouseDown = false);

function changeAudioVolume() {
  audio.volume = audioVol.value;
  audio.muted = false;
  if (audio.volume == 0) {
    volBtn.classList.remove('fa-volume-up');
    volBtn.classList.add('fa-volume-mute');
  } else {
    volBtn.classList.remove('fa-volume-mute');
    volBtn.classList.add('fa-volume-up');
  }
}

changeAudioVolume();

audio.addEventListener('timeupdate', showTimeProgress);

function showTimeProgress() {
  const time = document.querySelector('.progress span');
  const durMin = Math.floor(audio.duration / 60);
  const durSec = Math.round(audio.duration - (durMin * 60)).toString().padStart(2, '0');

  const curMin = Math.floor(audio.currentTime / 60);
  const curSec = Math.round(audio.currentTime - (curMin * 60)).toString().padStart(2, '0');

  if (!isNaN(durMin)) {
    time.textContent = `${curMin}:${curSec} / ${durMin}:${durSec}`;
  }
}

volBtn.addEventListener('click', muteAudio);

function muteAudio() {
  if (audio.muted) {
    audio.muted = false;
    volBtn.classList.remove('fa-volume-mute');
    volBtn.classList.add('fa-volume-up');
  } else {
    audio.muted = true;
    volBtn.classList.remove('fa-volume-up');
    volBtn.classList.add('fa-volume-mute');
  }
}

audio.addEventListener('timeupdate', showPlayableTrackName);

function showPlayableTrackName() {
  trackName.innerText = playList[playNum].title;
}

const playListItems = document.querySelectorAll('li.play-item');

function changeListIcon() {
  playListItems.forEach(track => {
    const trackIcon = track.querySelector('i');

    if (isPlay && track.classList.contains('item-active')) {
      trackIcon.classList.remove('fa-play-circle');
      trackIcon.classList.add('fa-pause-circle');
    } else {
      trackIcon.classList.remove('fa-pause-circle');
      trackIcon.classList.add('fa-play-circle');
    }
  });
}

function playListAudio() {
  playListItems.forEach((track, i) => {
    track.addEventListener('click', (e) => {
      if (e.target.classList.contains('item-active') || e.target.classList.contains('fa-pause-circle')) {
        playNum = i;
        playAudio();
      } else {
        playNum = i;
        isPlay = false;
        playAudio();
      }
    });
  });
}

playListAudio();

langSelect.addEventListener('change', () => appLanguage = langSelect.value);
langSelect.addEventListener('change', translateApp);

function translateApp() {
  showTime();
  getTimeOfDay();
  getWeather();
  getQuote();
  settingsTranslation();
}

async function getLinkToImage() {
  const bgNum = randomNum.toString().padStart(2, '0');

  let url;
  let imgLink;
  let tag;

  if (tags.length !== 0) {
    tag = tags.join(',');
  } else {
    tag = getTimeOfDay();
  }

  if (picSource === 'unsplash') {
    url = `https://api.unsplash.com/photos/random?query=${tag}&client_id=7ujidxk950M1vbghIqHgUXaODWIEEKDKilnv7eeiWJU`;
    const res = await fetch(url);
    const data = await res.json();
    imgLink = data.urls.regular;
  }
  if (picSource === 'flickr') {
    url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9ff3c0b8944f4f287cb74c77ca1ed047&tags=${tag}&tag_mode=any&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    imgLink = data.photos.photo[randomNum].url_l;
  }
  if (picSource === 'github') {
    imgLink = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${getTimeOfDay()}/${bgNum}.jpg`;
  }

  return imgLink;
}

picOptions.addEventListener('change', () => {
  picSource = picOptions.value;
  setBg();
});

tagInput.addEventListener('keydown', addTag);

function addTag(e) {
  if (e.key === 'Enter') {
    let tag = e.target.value.replace(/\s+/g, ' ');

    if (tag.length > 1 && !tags.includes(tag)) {
      if (tags.length < 4) {
        tags.push(tag);
        createTag(tag);
      }
    }
    e.target.value = '';
  }
}

function createTag(tag) {
  let liTag = `<li>${tag}<span class="close-tag">&#10005;</span></li>`;

  tagList.insertAdjacentHTML('afterbegin', liTag);

  setBg();
}

tagList.addEventListener('click', function (e) {
  if (e.target.classList.contains('close-tag')) {
    removeTag(e);
  }
});

function removeTag(e) {
  let thisTag = e.target.parentElement.textContent.slice(0, -1);
  let index = tags.indexOf(thisTag);
  tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
  e.target.parentElement.remove();
  setBg();
}

settingsIcon.addEventListener('click', showSettings);

function showSettings() {
  settingsIcon.classList.toggle('active-icon');
  settingsIcon.previousElementSibling.classList.toggle('show-settings');
}

body.addEventListener('click', hideElement);

function hideElement(e) {
  if (!e.target.closest('.settings')) {
    settingsIcon.previousElementSibling.classList.remove('show-settings');
  }
}

function settingsTranslation() {
  settingsBlock.querySelector('.language p').innerText = translation.settings.language[appLanguage];
  settingsBlock.querySelector('.picture__options p').innerText = translation.settings.picSource[appLanguage];
  settingsBlock.querySelector('.picture__tags-header>p').innerText = translation.settings.tags[appLanguage];
  settingsBlock.querySelector('.picture__tags>p').innerText = translation.settings.tagsHowTo[appLanguage];
  settingsBlock.querySelector('.picture__tags>p+p').innerText = translation.settings.tagsSources[appLanguage];
}

settingsTranslation();