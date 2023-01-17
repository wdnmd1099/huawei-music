import './icons.js'
console.log()
// function $(selector){        完全等价于下面的
//     return document.querySelector(selector)
// }
const $1 = selector => document.querySelector(selector)
const $$1 = selector => document.querySelectorAll(selector)
let lastTime = 0
let endSecondTime ;
let nextSong = false
let clearLyricMoving = false
let pauseSong = false
let saveLyricTime = undefined
let saveLyricStartTime = {minute:0,second:0,currentSecondTime:0}
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
                this.loadLyricEndTime()
                this.getNews();
            })
    }
    

    lyricMove(time){
        let currentSecondTime = time | 50
        let futureTime
        const lyricMoving = setInterval(()=>{
            if( pauseSong === true){ // 如果暂停状态存在，记录当前歌词读到的时间，暴露出去
                saveLyricTime = currentSecondTime
                clearInterval(lyricMoving)
                return 
            }
            currentSecondTime += 100
            const pElementList = $$1('.move p')
        for(let i = 0; i<pElementList.length ; i++){
            futureTime = pElementList[i].getAttribute('data-time')
            if( currentSecondTime > parseInt(futureTime) ){ //当前时间大于data-time的时间
                if(i!=0){
                    pElementList[i-1].removeAttribute('class') //删掉当前后面的class
                }
                if(i===0){
                    pElementList[0].setAttribute('class','currentLyric') //把第一个p元素加class，方便歌词滚动函数跑
                }
             pElementList[i].setAttribute('class','currentLyric') //对当前p元素加class
            }
        }
        if(clearLyricMoving === true){
            clearLyricMoving = false
            for(let i = 0; i<pElementList.length ; i++){
                pElementList[i].removeAttribute('class')
            }
            clearInterval(lyricMoving)
            return
       }
        this.setLineToCenter($1('.currentLyric'))
        },100)
    }

    


    
    getNews(){
        let ZZZ = [];
        let time = [] ;
        let ci ;
        this.$('.song-title').innerText = this.songList[this.currentIndex].title  //获取歌名
        this.$('.singer').innerText = this.songList[this.currentIndex].author  //获取歌手名
        fetch(this.songList[this.currentIndex].lyric)  //拿到歌词
            .then(res => res.text())    
            .then(data => {
                //console.log(data)
             data.split(/\s/).filter(str => str.match(/\[.+?\]/))   
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
                    p.innerText=ZZZ[i][1]
                    document.querySelector('.move').appendChild(p)
                }
            })
    }
    loadLyricEndTime(){  // 把歌词结束时间渲染到进度条后
        this.audio.onloadeddata = ()=>{
            $1('.time-end').innerText = this.secondChangeMinSec(this.audio.duration)
            endSecondTime = this.audio.duration
        }
    }






































    playSong(){
        this.audio.play()
        this.$('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-pause')
        this.$('.btn-play-pause').classList.remove('pause')
        this.$('.btn-play-pause').classList.add('playing')
        
        if( pauseSong === true){
            pauseSong = false
            this.lyricMove(saveLyricTime)
            this.loadLyricStartTime(saveLyricStartTime)
            return
        }
        this.loadLyricStartTime()
        this.lyricMove()
    }
    pauseSong(){   
        pauseSong = true
        this.audio.pause()
        this.$('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-play')  
        this.$('.btn-play-pause').classList.remove('playing')
        this.$('.btn-play-pause').classList.add('pause')
    }
    bind(){
        let self = this
        console.log(this)
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
            nextSong = true
            clearLyricMoving = true
            self.getNews()
            setTimeout(()=>{
                self.playSong()
            },110)
            
        }
        this.$('.btn-next').onclick = function(){
            if(self.currentIndex<self.songList.length-1){
                self.audio.src  =  self.songList[self.currentIndex+=1].url
            }else{
                self.currentIndex=0;
                self.audio.src  =  self.songList[self.currentIndex].url
            }
            nextSong = true
            clearLyricMoving = true
            self.getNews()
            setTimeout(()=>{
                self.playSong()
            },110)
           
            
            console.log(self.songList[self.currentIndex].title)
        }
    }
    loadLyricStartTime(Time){   // 当前歌曲时间
        // console.log(Time)
        let minute = 0
        let second = 0
        let currentSecondTime = 0
        if(Time){
            minute = Time.minute
            second = Time.second
            currentSecondTime = Time.currentSecondTime
        }
        let x = 0
        const goingTime = setInterval(() => {
            x+=1
            if( pauseSong === true){
                saveLyricStartTime = {minute:minute,second:second,currentSecondTime:currentSecondTime}
                clearInterval(goingTime)
                return
            }
            if( x === 10 ){
                x=0
                second += 1
                currentSecondTime += 1
            }
            
            if(second > 60){
                minute += 1
                second = 0
            }
            const currentTime = `${minute.toString().padStart(2,'0')}:${second.toString().padStart(2,'0')}`
            // console.log(currentTime)
            $1('.time-start').innerText = currentTime
            this.barMoving(currentSecondTime)
            if(currentTime === $1('.time-end').innerText){ //歌曲结束时解除计时器
                clearInterval(goingTime)
            }
            if(nextSong === true){
                nextSong = false
                clearInterval(goingTime)
            }
        }, 100);
    }




































    secondChangeMinSec(val){ //把秒转换为分秒结构
        let minute = parseInt(val/60) 
        const minChangeSecond = (val/60).toString()
        let second = parseInt(parseInt(minChangeSecond[2]+minChangeSecond[3]) * 0.6)
        if(minute < 10){
           minute =  minute.toString().padStart(2,'0')
        }
        if(second < 10){
            second =  second.padStart(2,'0')
        }
        const loadTime = `${minute}:${second}`
        return loadTime
    }

    barMoving(currentSecondTime){ // 进度条按当前歌曲时间移动
        this.$('.progress').style.width = (`${parseInt(currentSecondTime / endSecondTime  * 100)}%`)
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

    
   

    setLineToCenter(node){
       let offset = node.offsetTop - this.$('.lyrics-page').offsetHeight / 2 ;
        offset > 0 ? offset : 0 ; 
        this.$('.move').style.transform = `translateY(-${offset}px)`  //操作transform语法
    }


    geCiGunDong(){
        console.log($1('.last-time'))
        console.log(lastTime)
    }




    
}


new Player('#player')


