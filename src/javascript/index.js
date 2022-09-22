import './icons.js'
console.log()
// function $(selector){        完全等价于下面的
//     return document.querySelector(selector)
// }
const $1 = selector => document.querySelector(selector)
const $$1 = selector => document.querySelectorAll(selector)

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
    }

    start(){
        console.log(this.$('.btn-play-pause'))
        fetch('https://jirengu.github.io/data-mock/huawei-music/music-list.json')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.songList = data 
                this.audio.src  =  this.songList[this.currentIndex].url
                this.getNews();
            })
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
            self.playSong()
            self.getNews()
        }
        this.$('.btn-next').onclick = function(){
            if(self.currentIndex<self.songList.length-1){
                self.audio.src  =  self.songList[self.currentIndex+=1].url
            }else{
                self.currentIndex=0;
                self.audio.src  =  self.songList[self.currentIndex].url
            }
            self.playSong()
            self.getNews()
            console.log(self.songList[self.currentIndex].title)
        }
       


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

    playSong(){
        this.audio.play()
        this.$('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-pause')
        this.$('.btn-play-pause').classList.remove('pause')
        this.$('.btn-play-pause').classList.add('playing')
    }
    pauseSong(){    
        this.audio.pause()
        this.$('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-play')  
        this.$('.btn-play-pause').classList.remove('playing')
        this.$('.btn-play-pause').classList.add('pause')
    }

    getNews(){
        this.$('.song-title').innerText = this.songList[this.currentIndex].title
        this.$('.singer').innerText = this.songList[this.currentIndex].author
    }

}


new Player('#player')


