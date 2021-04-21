'use strict'
let gSearchBy;
var gKeywordsMap = {'happy': 6,'angry': 1 , 'funny':1}
var gImgs = [
    { id: 1, url: './img/meme-imgs/1.jpg', keywords: ['happy','angry'] },
    { id: 2, url: './img/meme-imgs/2.jpg', keywords: ['happy','nice'] },
    { id: 3, url: './img/meme-imgs/3.jpg', keywords: ['happy','funny'] },
    { id: 4, url: './img/meme-imgs/4.jpg', keywords: ['happy','political','nice'] },
    { id: 5, url: './img/5.jpg', keywords: ['happy'] },
    { id: 6, url: './img/6.jpg', keywords: ['happy'] },
    { id: 8, url: './img/8.jpg', keywords: ['happy'] },
    
];


function getImgs(){
    if(!gSearchBy)return gImgs;
    return gImgs.filter(img=>{
       return img.keywords.some(keyword=>{
           if(keyword.indexOf(gSearchBy)===-1) return false
           return true
       })
    })
}
function getImgURL(imgId) {
    const img = gImgs.find((img) =>{
        return img.id === imgId

    } )
    return img.url
}
function setSearchBy(searchVal){
    gSearchBy=searchVal
}
function getKeywordsMap(){
  return gKeywordsMap;
}

function updateKeywordsMap(kW){
    gKeywordsMap[kW]++;
}