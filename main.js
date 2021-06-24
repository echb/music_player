const playPause = document.querySelector('.playPause')
const before = document.querySelector('.before')
const after = document.querySelector('.after')
const albumBtn = document.querySelector('.albumBtn')
const song = document.querySelector('.song')
const songsListToolBar = document.querySelector('.songs')
const totalTime = document.querySelector('.totalTime')
const alctualTime = document.querySelector('.alctualTime')
const volume = document.querySelector('#volume')
const volumeIcon = document.querySelector('#volumeIcon')
const play = 'https://iconoir.com/source/icons/pause-outline.svg'
const pause = 'https://iconoir.com/source/icons/play-outline.svg'
const prevIcon = 'https://iconoir.com/source/icons/skip-prev-outline.svg'
const nextIcon = 'https://iconoir.com/source/icons/skip-next-outline.svg'
const albumIcon = 'https://iconoir.com/source/icons/album-list.svg'
let listSongs

let darkModeToggle = false

let dataJson
let state = 0
let autoPlay = false
let nextSong = false

function getDbStartChanges() {
  fetch('./audioDb.json')
    .then(response => response.json())
    .then(data => dataJson = data)
    .then(() => {
      // CREATE ELEMENTS ON MENU
      createSongListMenu()
      updateMenuQueryList()
      songParameters()
      // BUTTONS
      changeSongByButtons()
      playPauseHandle()
      // CLICK ON SONG
      changeSongByClickList()
      // PLAYLIST
      setColorToActiveSong()
      // DARKMODE
      darkModeFn()
      // TESTS
    });
}
getDbStartChanges()

// BEGINS QUERY LIST OF MENU
function updateMenuQueryList() {
  listSongs = document.querySelectorAll('.songs li')
}
// ENDS QUERY LIST OF MENU

function changeSongByButtons() {
  handleAfter()
  handleBefore()
  changeSongSrcBeforeAfter()
}

function autoplayToTrue() {
  song.setAttribute('autoplay', true)
}

// BEGINS BUTTONS
function setPrevNextAlbumIcons() {
  before.setAttribute('src', prevIcon)
  after.setAttribute('src', nextIcon)
  albumBtn.setAttribute('src', albumIcon)
}
setPrevNextAlbumIcons()

function volumeFn() {
  volume.value = song.volume * 100
  volume.addEventListener('click', () => {
    song.volume = volume.value / 100
  })
}
volumeFn()

function playPauseHandle() {
  playPause.setAttribute('src', pause)
  playPause.addEventListener('click', () => {
    if (song.paused) {
      playPause.setAttribute('src', play)
      song.play()
    } else {
      playPause.setAttribute('src', pause)
      song.pause()
    }
  })
}

function changeSongSrcBeforeAfter() {
  song.setAttribute('src', `./${dataJson[state].src}`)
  if (autoPlay) {
    autoplayToTrue()
  }
}

function handleAfter() {
  after.addEventListener('click', () => {
    if (song.paused) {
      playPause.setAttribute('src', play)
    }

    state++
    if (state >= dataJson.length) {
      state = 0
    }
    autoPlay = true
    changeSongSrcBeforeAfter()
  })
}

function handleBefore() {
  before.addEventListener('click', () => {
    if (song.paused) {
      playPause.setAttribute('src', play)
    }

    state--
    if (state < 0) {
      state = dataJson.length - 1
    }
    autoPlay = true
    changeSongSrcBeforeAfter()
  })
}
// ENDS BUTTONS

// BEGINS QUERY SONGS
function createSongListMenu() {
  dataJson.forEach(song => {
    // CREATE ELEMENTS
    const songLi = document.createElement('li')
    const songDiv = document.createElement('div')
    const songSong = document.createElement('p')
    const songArtist = document.createElement('p')
    const songImg = document.createElement('img')

    // ELEMENTS SET CONTENT
    songSong.textContent = song.song
    songArtist.textContent = song.artist
    songImg.setAttribute('src', song.img)

    // ELEMENT SET DATA
    songLi.setAttribute('data-state', song.id)

    // ELEMENTS SET CLASS
    songSong.classList.add('songSong')
    songArtist.classList.add('songArtist')
    songImg.classList.add('songImg')

    // SET LIST ON UL
    songLi.appendChild(songImg)
    songDiv.appendChild(songSong)
    songDiv.appendChild(songArtist)
    songLi.appendChild(songDiv)
    songsListToolBar.appendChild(songLi)
  });
}
// ENDS QUERY SONGS

// BEGINS FUNCTIONALITY TO MENU
const playlist = document.querySelector('.playlist')
const menuContainer = document.querySelector('.menuContainer')
const menuList = document.querySelector('menu[type="toolbar"]')

function activePlaylistMenuClass() {
  playlist.addEventListener('click', () => {
    menuList.classList.toggle('playlistActive')
    menuContainer.classList.toggle('menuContainerActive')
  })
}
activePlaylistMenuClass()

function changeSongByClickList() {
  listSongs.forEach((listSong) => {
    listSong.addEventListener('click', () => {
      state = listSong.getAttribute('data-state')
      song.setAttribute('src', `./${dataJson[state].src}`)
      playPause.setAttribute('src', play)
      autoplayToTrue()
    })
  })
}

function setColorToActiveSong() {
  const listSongActive = document.querySelector(`li[data-state="${state}"]`)
  const stateValidate = listSongActive.getAttribute('data-state')

  addRemoveClassToListMenu(listSongActive, stateValidate)

}

function addRemoveClassToListMenu(listSongActive, stateValidate) {
  listSongs.forEach((song) => {
    if (darkModeToggle) {
      listSongActive.classList.remove('selectedSong')
      song.classList.remove('selectedSongDark')
    } else {
      listSongActive.classList.remove('selectedSongDark')
      song.classList.remove('selectedSong')
    }
  })
  if (stateValidate == stateValidate) {
    if (darkModeToggle) {
      listSongActive.classList.add('selectedSongDark')
    } else {
      listSongActive.classList.add('selectedSong')
    }
  }
}
// ENDS FUNCTIONALITY TO MENU

// BEGINS HANDLE ALL VIEW OF NEW INPUT (PLAYER)
function songParameters() {
  const songProgress = document.querySelector('#songProgress')
  songProgress.value = 0
  updateSetSongParameters(songProgress)
  setSongParameters(songProgress)
  updateTimeOfSongProgressClick()
}

function setSongParameters(songProgress) {
  song.onloadedmetadata = () => {
    songProgress.setAttribute('max', song.duration)
    let durationMin = Math.floor(song.duration / 60)
    let durationSec = Math.round(song.duration - (durationMin * 60))
    totalTime.textContent = `0${durationMin}:${durationSec}`
    alctualTime.textContent = '0:0'
    setContentToCard()
  }
}

function setContentToCard() {
  const imageAlbum = document.querySelector('#imageAlbum')
  const songName = document.querySelector('#songName')
  const songArtist = document.querySelector('#songArtist')

  imageAlbum.setAttribute('src', `${dataJson[state].img}`)
  songArtist.textContent = `${dataJson[state].artist}`
  songName.textContent = `${dataJson[state].song}`
}

function updateSetSongParameters(songProgress) {
  song.addEventListener('timeupdate', () => {
    songProgress.value = song.currentTime
    alctualTime.textContent = '0' + Math.floor(song.currentTime / 60) + ':' + Math.round(song.currentTime % 60)
    return
  })
}

function updateTimeOfSongProgressClick() {
  songProgress.addEventListener('click', () => {
    timeToLine()
    updateSetSongParameters(songProgress)
    if (song.paused) {
      playPause.setAttribute('src', play)
      song.play()
    }
  })
}

function timeToLine() {
  song.currentTime = parseInt(songProgress.value)
}
// ENDS HANDLE ALL VIEW OF NEW INPUT (PLAYER) 

// BEGINS SET COUNTER AND WATCH IF SONG ENDS
song.addEventListener('ended', () => {
  if (song.ended) {
    state++
    if (state >= dataJson.length) {
      state = 0
    }
    changeSongSrcBeforeAfter()
    autoplayToTrue()
  }
  return
})

// ENDS SET COUNTER AND WATCH IF SONG ENDS

// BEGINS SET OBSERVER TO CHANGES 
const observer = new MutationObserver(() => {
  setColorToActiveSong()
});

observer.observe((song), {
  attributes: true
})
// ENDS SET OBSERVER TO CHANGES

volumeIcon.addEventListener('click', () => {
  volume.classList.toggle('volumeAction')
})
volume.addEventListener('mouseout', () => {
  volume.classList.remove('volumeAction')
})


// BEGINS DARK MODE
const darkToggleBtn = document.querySelector('.darkToggleBtn')
const darkModeBody = document.querySelector('body')
const darkModeMenu = document.querySelector('.menuContainer menu')
const darkModeIcons = document.querySelectorAll('.before, .playPause, .after, .albumBtn, #volumeIcon')

function darkModeFn() {
  const darkModeSongsHover = document.querySelectorAll('.songs li')
  darkToggleBtn.addEventListener('click', () => {
    darkModeToggle = !darkModeToggle
    setColorToActiveSong()
    toggleHoverColorMenuSongs(darkModeSongsHover)
    toggleDarkMode()
  })
}


function toggleDarkMode() {
  if (darkModeToggle) {
    darkToggleBtn.setAttribute('src', 'https://iconoir.com/source/icons/light-bulb-off.svg')
  } else {
    darkToggleBtn.setAttribute('src', 'https://iconoir.com/source/icons/light-bulb-on.svg')
  }
  darkToggleBtn.classList.toggle('darkToggleBtnActive')
  darkModeBody.classList.toggle('darkModeBody')
  darkModeMenu.classList.toggle('darkModeMenu')
  darkModeIcons.forEach((item) => {
    item.classList.toggle('darkModeIcons')
  })
}

function toggleHoverColorMenuSongs(darkModeSongsHover) {
  darkModeSongsHover.forEach((item) => {
    item.classList.toggle('songOverDark')
  })
}
// ENDS DARK MODE
