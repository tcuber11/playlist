$(function ()
{
  var playerTrack = $("#player-track"),bgArtwork = $('#bg-artwork'),bgArtworkUrl,albumName = $('#album-name'),trackName = $('#track-name'),albumArt = $('#album-art'),sArea = $('#s-area'),seekBar = $('#seek-bar'),trackTime = $('#track-time'),insTime = $('#ins-time'),sHover = $('#s-hover'),playPauseButton = $("#play-pause-button"),i = playPauseButton.find('i'),tProgress = $('#current-time'),tTime = $('#track-length'),seekT,seekLoc,seekBarPos,cM,ctMinutes,ctSeconds,curMinutes,curSeconds,durMinutes,durSeconds,playProgress,bTime,nTime = 0,buffInterval = null,tFlag = false,albums = ['Dawn', 'Me & You', 'Electro Boy', 'Home', 'Proxy (Original Mix)'],trackNames = ['Skylike - Dawn', 'Alex Skrindo - Me & You', 'Kaaze - Electro Boy', 'Jordan Schor - Home', 'Martin Garrix - Proxy'],albumArtworks = ['_1', '_2', '_3', '_4', '_5'],trackUrl = ['https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3', 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/1.mp3', 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3', 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3', 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3'],playPreviousTrackButton = $('#play-previous'),playNextTrackButton = $('#play-next'),currIndex = -1;

  function playPause()
  {
    setTimeout(function ()
    {
      if (audio.paused)
      {
        playerTrack.addClass('active');
        albumArt.addClass('active');
        checkBuffering();
        i.attr('class', 'fas fa-pause');
        audio.play();
      } else

      {
        playerTrack.removeClass('active');
        albumArt.removeClass('active');
        clearInterval(buffInterval);
        albumArt.removeClass('buffering');
        i.attr('class', 'fas fa-play');
        audio.pause();
      }
    }, 300);
  }


  function showHover(event)
  {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0)
    return;

    if (ctMinutes < 0 || ctSeconds < 0)
    return;

    if (ctMinutes < 10)
    ctMinutes = '0' + ctMinutes;
    if (ctSeconds < 10)
    ctSeconds = '0' + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds))
    insTime.text('--:--');else

    insTime.text(ctMinutes + ':' + ctSeconds);

    insTime.css({ 'left': seekT, 'margin-left': '-21px' }).fadeIn(0);

  }

  function hideHover()
  {
    sHover.width(0);
    insTime.text('00:00').css({ 'left': '0px', 'margin-left': '0px' }).fadeOut(0);
  }

  function playFromClickedPos()
  {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime()
  {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag)
    {
      tFlag = true;
      trackTime.addClass('active');
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = audio.currentTime / audio.duration * 100;

    if (curMinutes < 10)
    curMinutes = '0' + curMinutes;
    if (curSeconds < 10)
    curSeconds = '0' + curSeconds;

    if (durMinutes < 10)
    durMinutes = '0' + durMinutes;
    if (durSeconds < 10)
    durSeconds = '0' + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds))
    tProgress.text('00:00');else

    tProgress.text(curMinutes + ':' + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds))
    tTime.text('00:00');else

    tTime.text(durMinutes + ':' + durSeconds);

    if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds))
    trackTime.removeClass('active');else

    trackTime.addClass('active');


    seekBar.width(playProgress + '%');

    if (playProgress == 100)
    {
      i.attr('class', 'fa fa-play');
      seekBar.width(0);
      tProgress.text('00:00');
      albumArt.removeClass('buffering').removeClass('active');
      clearInterval(buffInterval);
    }
  }

  function checkBuffering()
  {
    clearInterval(buffInterval);
    buffInterval = setInterval(function ()
    {
      if (nTime == 0 || bTime - nTime > 1000)
      albumArt.addClass('buffering');else

      albumArt.removeClass('buffering');

      bTime = new Date();
      bTime = bTime.getTime();

    }, 100);
  }

  function selectTrack(flag)
  {
    if (flag == 0 || flag == 1)
    ++currIndex;else

    --currIndex;

    if (currIndex > -1 && currIndex < albumArtworks.length)
    {
      if (flag == 0)
      i.attr('class', 'fa fa-play');else

      {
        albumArt.removeClass('buffering');
        i.attr('class', 'fa fa-pause');
      }

      seekBar.width(0);
      trackTime.removeClass('active');
      tProgress.text('00:00');
      tTime.text('00:00');

      currAlbum = albums[currIndex];
      currTrackName = trackNames[currIndex];
      currArtwork = albumArtworks[currIndex];

      audio.src = trackUrl[currIndex];

      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();

      if (flag != 0)
      {
        audio.play();
        playerTrack.addClass('active');
        albumArt.addClass('active');

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find('img.active').removeClass('active');
      $('#' + currArtwork).addClass('active');

      bgArtworkUrl = $('#' + currArtwork).attr('src');

      bgArtwork.css({ 'background-image': 'url(' + bgArtworkUrl + ')' });
    } else

    {
      if (flag == 0 || flag == 1)
      --currIndex;else

      ++currIndex;
    }
  }

  function initPlayer()
  {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.on('click', playPause);

    sArea.mousemove(function (event) {showHover(event);});

    sArea.mouseout(hideHover);

    sArea.on('click', playFromClickedPos);

    $(audio).on('timeupdate', updateCurrTime);

    playPreviousTrackButton.on('click', function () {selectTrack(-1);});
    playNextTrackButton.on('click', function () {selectTrack(1);});
  }

  initPlayer();
});


var thehours = new Date().getHours();
var themessage;
var thequotes;
var morning = 'Good morning, Ivell <br>' + "I hope you have a wonderful day";
var afternoon = 'Good afternoon, Ivell <br>' + "Enjoy the blessings it offers you and be thankful always";
var evening = 'Good evening, Ivell <br>' + "Have a nice time";
var night = 'Good night, Ivell <br>' + "May tomorrow be sunny and full of joy";

if (thehours >= 0 && thehours < 12) {
  themessage = morning;
} else if (thehours >= 12 && thehours < 18) {
  themessage = afternoon;
} else if (thehours >= 18 && thehours < 22) {
  themessage = evening;
} else if (thehours >= 22 && thehours < 24) {
  themessage = night;
}

$('.greeting').append(themessage);

function updateTime() {
  const currentTime = new Date();
  let hour = currentTime.getHours();
  let minute = currentTime.getMinutes();
  let second = currentTime.getSeconds();

  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }

  document.getElementById('hour').innerHTML = hour + " :";document.getElementById('minute').innerHTML = minute + " :";document.getElementById('second').innerHTML = second;
}

updateTime();
setInterval(updateTime);

const {
  gsap: { registerPlugin, set, to, timeline },
  MorphSVGPlugin,
  Draggable } =
window;
registerPlugin(MorphSVGPlugin);

// Used to calculate distance of "tug"
let startX;
let startY;

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3') };

const STATE = {
  ON: false };

const CORD_DURATION = 0.1;

const CORDS = document.querySelectorAll('.toggle-scene__cord');
const HIT = document.querySelector('.toggle-scene__hit-spot');
const DUMMY = document.querySelector('.toggle-scene__dummy-cord');
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
const PROXY = document.createElement('div');
// set init position
const ENDX = DUMMY_CORD.getAttribute('x2');
const ENDY = DUMMY_CORD.getAttribute('y2');
const RESET = () => {
  set(PROXY, {
    x: ENDX,
    y: ENDY });

};

RESET();

const CORD_TL = timeline({
  paused: true,
  onStart: () => {
    STATE.ON = !STATE.ON;
    set(document.documentElement, { '--on': STATE.ON ? 1 : 0 });
    set(DUMMY, { display: 'none' });
    set(CORDS[0], { display: 'block' });
    AUDIO.CLICK.play();
  },
  onComplete: () => {
    set(DUMMY, { display: 'block' });
    set(CORDS[0], { display: 'none' });
    RESET();
  } });


for (let i = 1; i < CORDS.length; i++) {
  CORD_TL.add(
  to(CORDS[0], {
    morphSVG: CORDS[i],
    duration: CORD_DURATION,
    repeat: 1,
    yoyo: true }));


}

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: e => {
    startX = e.x;
    startY = e.y;
  },
  onDrag: function () {
    set(DUMMY_CORD, {
      attr: {
        x2: this.x,
        y2: this.y } });


  },
  onRelease: function (e) {
    const DISTX = Math.abs(e.x - startX);
    const DISTY = Math.abs(e.y - startY);
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
    to(DUMMY_CORD, {
      attr: { x2: ENDX, y2: ENDY },
      duration: CORD_DURATION,
      onComplete: () => {
        if (TRAVELLED > 50) {
          CORD_TL.restart();
        } else {
          RESET();
        }
      } });

  } });