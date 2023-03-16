import './icons.js'
let endSecondTime;
class Player {
    constructor(node) {
        this.root = typeof node === 'string' ? document.querySelector(node) : node   //要么是字符串 要么是DOM节点 字符串就直接去找
        this.$ = selector => this.root.querySelector(selector)
        this.$$ = selector => this.root.querySelectorAll(selector)
        this.songList = [];
        this.currentIndex = 0;
        this.audio = new Audio();  //相当于在html插入一个<audio src=""></audio>标签
        this.start();
        this.bind();
        this.swiper();
        this.Arr = [];
    }

    start() {
        // https://karr.top/music-data/music-data/music-data.json
        fetch('https://music-data-1300042530.cos-website.ap-guangzhou.myqcloud.com/')
            .then(res => res.json())
            .then(data => {
                this.songList = data
                this.audio.src = this.songList[this.currentIndex].url
                this.loadLyricEndTime()
                this.getNews();
            })
    }

    loadLyricEndTime() {  // 把歌词结束时间渲染到进度条后
        this.audio.onloadeddata = () => {
            this.$('.time-end').innerText = this.secondChangeMinSec(this.audio.duration)
            endSecondTime = this.audio.duration
        }
    }
    secondChangeMinSec(val) { //把秒转换为分秒结构
        let minute = parseInt(val / 60)
        const minChangeSecond = (val / 60).toString()
        let second = parseInt(parseInt(minChangeSecond[2] + minChangeSecond[3]) * 0.6)
        if (minute < 10) {
            minute = minute.toString().padStart(2, '0')
        }
        if (second < 10) {
            second = second.toString().padStart(2, '0')
        }
        const loadTime = `${minute}:${second}`
        return loadTime
    }
    startTime(val) { //把秒转换为分秒结构
        let second = val * 1000
        let minute = second / 60
        return `${parseInt(minute).toString().padStart(2, '0')}:${parseInt(second).toString().padStart(2, '0')}`
    }
    getNews() {
        let timeAndLyrics = [];
        let time = [];
        let lyrics;
        this.$('.song-title').innerText = this.songList[this.currentIndex].title  //获取歌名
        this.$('.singer').innerText = this.songList[this.currentIndex].author  //获取歌手名
        fetch(this.songList[this.currentIndex].lyric)  //拿到歌词
            .then(res => res.text())
            .then(data => {
                data.split(/\s/).filter(str => str.match(/\[.+?\]/))
                    .forEach(item => {
                        lyrics = item.replace(/\[.+]/gm, '')  //筛选出歌词

                        item.match(/\[.+?\]/g)   //删选出时间戳，并转化为毫秒
                            .forEach(t => {
                                t = t.replace(/[\[\]]/g, '')
                                time = parseInt(t.slice(0, 2)) * 60 * 1000 + parseInt(t.slice(3, 5)) * 1000 + parseInt(t.slice(6)) //转成毫秒数

                                if (lyrics != '') {
                                    timeAndLyrics.push([time, lyrics])  //把时间戳和词 打包进数组
                                }
                            })
                    })
                this.$('.move').remove();   //删掉上一首残留的歌词节点
                let move1 = document.createElement('div')  //创建新的歌词节点加到页面上
                move1.className = 'move'
                document.querySelector('.lyrics-page').appendChild(move1)
                for (let i = 0; i < timeAndLyrics.length; i++) {   //把歌词渲染到页面
                    let p = document.createElement('p')
                    p.setAttribute('data-time', timeAndLyrics[i][0])
                    p.innerText = timeAndLyrics[i][1]
                    document.querySelector('.move').appendChild(p)
                }
                this.Arr = []
                const futureTime = this.$$('.move p')
                for (let i = 0; i < futureTime.length; i++) {
                    this.Arr.push(futureTime[i])
                }
            })
    }
    swiper() {
        
        let startX;
        let endX;
        let clock;
        let self = this;

        this.$('.page-effects').ontouchstart = function (e) {
            startX = e.touches[0].pageX
            console.log(startX)
        }
        this.$(".page-effects").ontouchmove = function (e) {
            if (clock) //假如clock存在
                clearInterval(clock)
            clock = setTimeout(() => {
                endX = e.touches[0].pageX;
                if (endX - startX > 20) {
                    this.classList.remove('page2')
                    this.classList.add('page1')
                    self.$('.ball2').classList.remove('current-ball')
                    self.$('.ball1').classList.add('current-ball')
                } else if (endX - startX < 20) {
                    this.classList.remove('page1')
                    this.classList.add('page2')
                    self.$('.ball1').classList.remove('current-ball')
                    self.$('.ball2').classList.add('current-ball')
                }
            }, 100);
        };
        console.log('shit')
    }

    setLineToCenter(node) {
        if(!node)return
        let offset = node.offsetTop - this.$('.lyrics-page').offsetHeight / 2;
        offset > 0 ? offset : 0;
        this.$('.move').style.transform = `translateY(-${offset}px)`  //操作transform语法
    }
    
    playSong() {
        this.audio.play()
        this.$('.btn-play-pause').querySelector('use')
            .setAttribute('xlink:href', '#icon-pause')
        this.$('.btn-play-pause').classList.remove('pause')
        this.$('.btn-play-pause').classList.add('playing')


    }

    pauseSong() {
        this.audio.pause()
        this.$('.btn-play-pause').querySelector('use')
            .setAttribute('xlink:href', '#icon-play')
        this.$('.btn-play-pause').classList.remove('playing')
        this.$('.btn-play-pause').classList.add('pause')
    }

    bind() {
        let self = this
        this.$('.btn-play-pause').onclick = function () {
            if (this.classList.contains('playing')) {
                self.pauseSong()
            } else if (this.classList.contains('pause')) {
                self.playSong()
            }
        }
        this.$('.btn-pre').onclick = function () {
            if (self.currentIndex <= self.songList.length - 1 && self.currentIndex > 0) {
                self.audio.src = self.songList[self.currentIndex -= 1].url
            } else {
                self.currentIndex = self.songList.length - 1;
                self.audio.src = self.songList[self.currentIndex].url
            }
            self.getNews()
            self.playSong()

        }
        this.$('.btn-next').onclick = function () {
            if (self.currentIndex < self.songList.length - 1) {
                self.audio.src = self.songList[self.currentIndex += 1].url
            } else {
                self.currentIndex = 0;
                self.audio.src = self.songList[self.currentIndex].url
            }
            self.getNews()
            self.playSong()
        }
        this.audio.ontimeupdate = () => {
            // console.log(parseInt(self.audio.currentTime*1000))
            self.locateLyric()
            self.setProgerssBar()
        }
    }

    setProgerssBar() {
        let percent = (this.audio.currentTime * 100 / this.audio.duration) + '%'
        this.$('.bar .progress').style.width = percent
        this.$('.time-start').innerText = this.startTime(this.audio.currentTime / 1000)
    }

    locateLyric() {
        const currentTime = parseInt(this.audio.currentTime * 1000)
        this.Arr.map(item => { item.classList.remove('current') })
        for (let i = 0; i < this.Arr.length; i++) {
            this.Arr[i].removeAttribute('class', 'current')
        }

        for (let i = 0; i < this.Arr.length; i++) {
            if (currentTime > parseInt(this.Arr[i].getAttribute('data-time'))
                && currentTime < parseInt(this.Arr[i + 1].getAttribute('data-time'))) {
                this.Arr[i].classList.add('current')
            }
        }
        this.setLineToCenter(this.$('.current'))
        
        this.$$('.lyric p')[0].innerText = this.$('.current').innerText
        
    }

}


new Player('#player')


