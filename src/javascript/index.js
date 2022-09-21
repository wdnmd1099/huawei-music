import './icons.js'
console.log()
// function $(selector){        完全等价于下面的
//     return document.querySelector(selector)
// }
const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)

class Player{
    constructor(node){
        this.root = typeof node === 'string' ? $(node) : node   //要么是字符串 要么是DOM节点 字符串就直接去找
        this.songList = [];
        this.currentIndex = 0;
        this.audio = new Audio();  //相当于在html插入一个<audio src=""></audio>标签
        this.start();
        this.bind();

    }

    start(){
        console.log(this.root.querySelector('.btn-play-pause'))
        fetch('https://jirengu.github.io/data-mock/huawei-music/music-list.json')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.songList = data 
                this.audio.src  =  this.songList[this.currentIndex].url
            })
    }

    bind(){
        let self = this
        console.log(this)
        this.root.querySelector('.btn-play-pause').onclick = function(){
           if(this.classList.contains('playing')){
            self.pauseSong()
            console.log(this.classList)
            this.classList.remove('playing')
            this.classList.add('pause')
            this.querySelector('use').setAttribute('xlink:href','#icon-play')
           }else if(this.classList.contains('pause')){
            self.playSong()
            this.classList.remove('pause')
            this.classList.add('playing')
            //this.querySelector('use').setAttribute('xlink:href','#icon-pause')
           } 
        } 
        this.root.querySelector('.btn-pre').onclick = function(){
            if(self.currentIndex<=self.songList.length-1 && self.currentIndex>0){
                self.audio.src  =  self.songList[self.currentIndex-=1].url
            }else{
                self.currentIndex=self.songList.length-1;
                self.audio.src  =  self.songList[self.currentIndex].url
            }
            self.playSong()
            console.log(self.songList[self.currentIndex].title)
        }
        this.root.querySelector('.btn-next').onclick = function(){
            if(self.currentIndex<self.songList.length-1){
                self.audio.src  =  self.songList[self.currentIndex+=1].url
            }else{
                self.currentIndex=0;
                self.audio.src  =  self.songList[self.currentIndex].url
            }
            self.playSong()
            console.log(self.songList[self.currentIndex].title)
        }
    }

    playSong(){
        this.audio.play()
        $('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-pause')  
    }
    pauseSong(){    
        this.audio.pause()
        $('.btn-play-pause').querySelector('use')
        .setAttribute('xlink:href','#icon-play')  
    }


}


new Player('#player')