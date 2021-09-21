const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const progress = $('#progress')

const app = {
    isPlaying: false,
    currentIndex: 0,
    songs: [
        {
            id: 0,
            name: 'Cưới đi',
            single: '2T, ChangC',
            path: './assets/music/CuoiDi.mp3',
            image: './assets/image/anh1.jpg'
        },
        {
            id: 1,
            name: 'Răng khôn',
            single: 'Phí Phương Anh, RIN9',
            path: './assets/music/RangKhon.mp3',
            image: './assets/image/anh2.jpg'
        },
        {
            id: 2,
            name: 'Chỉ muốn bên em lúc này',
            single: 'Jiki X, Huy Vạc',
            path: './assets/music/ChiMuonBenEmLucNay.mp3',
            image: './assets/image/anh3.jpg'
        },
        {
            id: 3,
            name: 'Sài gòn đau lòng quá',
            single: 'Hứa Kim Tuyền, Hoàng Duyên',
            path: './assets/music/SaiGonDauLongQua.mp3',
            image: './assets/image/anh4.jpg'
        },
        {
            id: 4,
            name: 'Tình yêu màu hồng',
            single: 'Hồ Văn Quý, Xám',
            path: './assets/music/TinhYeuMauHong.mp3',
            image: './assets/image/anh5.jpg'
        }
    ],
    render: function () {
        currentIndex = this.currentIndex
        const htmls = this.songs.map(function (song, index) {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                    <div class="thumb"
                    style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.single}</p>
                </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    handleEvent: function () {
        const _this = this
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }
        nextBtn.onclick = function () {
            if (_this.currentIndex++ >= _this.songs.length - 1) {
                _this.currentIndex = 0
            }
            // _this.currentIndex++
            _this.loadCurrentSong()
            _this.render();
            _this.scrollToActiveSong();
            audio.play();
        }
        prevBtn.onclick = function () {
            if (_this.currentIndex-- <= 0) {
                _this.currentIndex = _this.songs.length - 1
            }
            _this.loadCurrentSong()
            _this.render();
            audio.play();
        }
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        randomBtn.onclick = function () {
            randomBtn.classList.toggle('active')
        }
        repeatBtn.onclick = function () {
            repeatBtn.classList.toggle('active')
        }
        audio.onended = function () {
            nextBtn.click();
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100; // nhân 100 để đổi ra phần trăm
                progress.value = progressPercent; // gán giá trị thanh rang = thời lượng phần trăm hiện tại của bài hát
            }
        }
        // xử lý khi tua
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        playlist.onclick = function (e) {
           const songNode = e.target.closest('.song:not(active)')
        //    if (songNode || e.target.closest('.option')) {
            //    xử lý khi click vào
            if (songNode) {
                _this.currentIndex = Number(songNode.getAttribute('data-index'));
                _this.render();
                 _this.loadCurrentSong();
                 audio.play();
            }
        //    }
        }
    },
    // nextSong: function () {
    //     this.currentIndex ++;
    //     this.currentSong();
    // },
    scrollToActiveSong: function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
    },
    scrollToTop: function () {
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth + 'px'
            cd.style.opacity = newCdWidth / cdWidth
        }
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    start: function() {
        this.render();
        this.scrollToTop();
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvent();
    }
}
app.start();