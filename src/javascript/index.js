import './icons.js'
console.log()
// function $(selector){        完全等价于下面的
//     return document.querySelector(selector)
// }
const $1 = selector => document.querySelector(selector)
const $$1 = selector => document.querySelectorAll(selector)
let cpZZZ = [];
let lastTime = 0
let musicCurrentTime = 100
let clearTimer = false
let inPlaySong = false
let unInPlaySong = true
class Player{
    constructor(node){
        this.root = typeof node === 'string' ? document.querySelector(node) : node   //要么是字符串 要么是DOM节点 字符串就直接去找
        this.$ = selector => this.root.querySelector(selector)
        this.$$ = selector => this.root.querySelectorAll(selector)
        this.songList = [];
        this.currentIndex = 0;
        this.audio = new Audio();  //相当于在html插入一个<audio src=""></audio>标签
        this.start();
        this.bind();
        this.swiper();
        // this.setLineToCenter(document.querySelector('.shit'))
        // this.geCiGunDong()
    } 

    start(){
        // console.log(this.$('.btn-play-pause'))
        fetch('https://karr.top/music-data/music-data/music-data.json')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.songList = data 
                this.audio.src  =  this.songList[this.currentIndex].url
                this.getNews();
            })
    }

    swiper(){
        let startX;
        let endX;
        let clock;
        let self = this;

         this.$('.page-effects').ontouchstart = function(e){
            startX =  e.touches[0].pageX
         }
         this.$(".page-effects").ontouchmove = function (e) {
           if(clock) //假如clock存在
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
          
    }

    
    bind(){
        let self = this
        // console.log(this)
        this.$('.btn-play-pause').onclick = function(){
           if(this.classList.contains('playing')){
            self.pauseSong()
           }else if(this.classList.contains('pause')){
            self.playSong()
           } 
        } 
        this.$('.btn-pre').onclick = function(){
            if(self.currentIndex<=self.songList.length-1 && self.currentIndex>0){
                self.audio.src  =  self.songList[self.currentIndex-=1].url
            }else{
                self.currentIndex=self.songList.length-1;
                self.audio.src  =  self.songList[self.currentIndex].url
            }
            if(inPlaySong === true){ //不在播放就不清timer，暂时这样写，有bug再修
                clearTimer = true
                console.log('inPlaySong',inPlaySong)
            }
            if(unInPlaySong === false){
                clearTimer = true
                console.log('unInPlaySong',unInPlaySong)
            }
            self.getNews()
            self.playSong()
            
            
        }
        this.$('.btn-next').onclick = function(){
            if(self.currentIndex<self.songList.length-1){
                self.audio.src  =  self.songList[self.currentIndex+=1].url
            }else{
                self.currentIndex=0;
                self.audio.src  =  self.songList[self.currentIndex].url
            }
            // console.log(inPlaySong,'inplay')
            // clearTimer = true
            // console.log(inPlaySong)
            if(inPlaySong === true){ //不在播放就不清timer，暂时这样写，有bug再修
                clearTimer = true
                console.log('inPlaySong',inPlaySong)
            }
            if(unInPlaySong === false){
                clearTimer = true
                console.log('unInPlaySong',unInPlaySong)
            }
            console.log('下一首')
            self.getNews()
            self.playSong()
            
            console.log(self.songList[self.currentIndex].title)
        }
       


    }
    playSong(){
        // console.log(cpZZZ)
        this.audio.play()
        this.$('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-pause')
        this.$('.btn-play-pause').classList.remove('pause')
        this.$('.btn-play-pause').classList.add('playing')
        unInPlaySong = false
        inPlaySong = true
        let lyricListArray = []  // 真正最后筛选的歌词数组
        musicCurrentTime = 100
        clearInterval(timer)
        let x =[]
        let x1 = 0
        let timer = setInterval(()=>{
            x1 += 1
            if(x1 < 2){
                console.log(122)
                const lyricList =  document.getElementsByTagName('p')
                for(let i = 0;i<lyricList.length;i++){
                    if( lyricList[i].className === ''){
                        if(lyricList[i].innerHTML != ''){
                            lyricListArray.push(lyricList[i])
                            // console.log(lyricListArray[0],lyricList[i])
                        }
                    }
                }
              
            }
            musicCurrentTime += 500
            cpZZZ.find(item => {
            if(musicCurrentTime > item[0]){
                x=[]
                x.push(item)
            }
        })
            // console.log(x[x.length-1],musicCurrentTime,x1)
            lyricListArray.find((item)=>{ 
                if(x[x.length-1][0].toString() === item.getAttribute('data-time')){ //等于html里的歌词的data-time 就加个样式
                    item.setAttribute('class','shit')
                }
                if(x[x.length-1][0].toString() != item.getAttribute('data-time')){
                    item.removeAttribute('class','shit')
                }
            })
            // console.log(clearTimer,123)
            setTimeout(() => {
                this.setLineToCenter()
            }, 0);
            
        if(clearTimer === true){
            clearTimer = false
            inPlaySong = false
            console.log('已停止2222')
            clearInterval(timer)
        }
            
        if(musicCurrentTime > lastTime ){
            console.log('已停止')
            clearInterval(timer)
          }
        },500)

       


    }
    pauseSong(){   
        clearTimer = true
        this.audio.pause()
        this.$('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-play')  
        this.$('.btn-play-pause').classList.remove('playing')
        this.$('.btn-play-pause').classList.add('pause')
    }

    getNews(){
        let ZZZ = [];
        let time = [] ;
        let ci ;
        let test;
        this.$('.song-title').innerText = this.songList[this.currentIndex].title  //获取歌名
        this.$('.singer').innerText = this.songList[this.currentIndex].author  //获取歌手名
        fetch(this.songList[this.currentIndex].lyric)  //拿到歌词
            .then(res => res.text())    
            .then(data => {
                //console.log(data)
             test =data.split(/\s/).filter(str => str.match(/\[.+?\]/))   
            .forEach(X => {
            ci =  X.replace(/\[.+]/gm,'')  //筛选出歌词

            X.match(/\[.+?\]/g)   //删选出时间戳，并转化为毫秒
            .forEach(t=>{ 
             t = t.replace(/[\[\]]/g,'')   
             time = parseInt(t.slice(0,2))*60*1000 + parseInt(t.slice(3,5))*1000 + parseInt(t.slice(6)) //转成毫秒数
            
             if(ci != ''){
                ZZZ.push([time, ci])  //把时间戳和词 打包进数组
             }
        })
        })
        cpZZZ = ZZZ 
        this.$('.move').remove();   //删掉上一首残留的歌词节点
        let move1 = document.createElement('div')  //创建新的歌词节点加到页面上
        move1.className = 'move' 
        document.querySelector('.lyrics-page').appendChild(move1)
        for(let i=0;i<ZZZ.length;i++){   //把歌词渲染到页面
                    let p = document.createElement('p')
                    p.setAttribute('data-time', ZZZ[i][0])
                    if( i === (ZZZ.length-1)){
                        lastTime =  ZZZ[i][0]
                    }
                    // if( i===0 ) {
                    //     p.setAttribute('class', 'shit')
                    // }
                    p.innerText=ZZZ[i][1]
                    document.querySelector('.move').appendChild(p)
                }
            })
    }

    setLineToCenter(){
        const x2 = document.querySelector('.shit')
       let offset = x2.offsetTop - this.$('.lyrics-page').offsetHeight / 2 ;
        offset > 0 ? offset : 0 ; 
        this.$('.move').style.transform = `translateY(-${offset}px)`  //操作transform语法
    }


    geCiGunDong(){
        console.log($1('.last-time'))
        console.log(lastTime)
    }




    
}


new Player('#player')


