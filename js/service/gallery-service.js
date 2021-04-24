'use strict'
let gSearchBy;
var gImgs = [
    { id: 1, url: './img/meme-imgs/1.jpg', keywords: ['funny', 'princess'] },
    { id: 2, url: './img/meme-imgs/2.jpg', keywords: ['trump','mad'] },
    { id: 3, url: './img/meme-imgs/3.jpg', keywords: ['happy', 'funny', 'dogs', 'cute'] },
    { id: 4, url: './img/meme-imgs/4.jpg', keywords: ['angry', 'funny', 'cute'] },
    { id: 5, url: './img/meme-imgs/5.jpg', keywords: ['angry', 'funny', 'cute'] },
    { id: 6, url: './img/meme-imgs/6.jpg', keywords: ['dog', 'baby', 'cute', 'funny'] },
    { id: 7, url: './img/meme-imgs/7.jpg', keywords: ['funny', 'clown'] },
    { id: 8, url: './img/meme-imgs/8.jpg', keywords: ['baby', 'cute', 'happy'] },
    { id: 9, url: './img/meme-imgs/9.jpg', keywords: ['funny', 'nostalgic'] },
    { id: 10, url: './img/meme-imgs/10.jpg', keywords: ['angry', 'funny', 'nostalgic'] },
    { id: 11, url: './img/meme-imgs/11.jpg', keywords: ['funny', 'classic'] },
    { id: 12, url: './img/meme-imgs/12.jpg', keywords: ['movie', 'austin powers'] },
    { id: 13, url: './img/meme-imgs/13.jpg', keywords: ['happy'] },
    { id: 14, url: './img/meme-imgs/14.jpg', keywords: ['trump', 'angry'] },
    { id: 15, url: './img/meme-imgs/15.jpg', keywords: ['happy', 'cute'] },
];
var gKeywordsMap = _createKwMap()
console.log(gKeywordsMap)


function getImgs() {
    if (!gSearchBy) return gImgs;
    return gImgs.filter(img => {
        return img.keywords.some(keyword => {
            if (keyword.indexOf(gSearchBy) === -1) return false
            return true
        })
    })
}
function getImgURL(imgId) {
    const img = gImgs.find((img) => {
        return img.id === imgId

    })
    return img.url
}
function setSearchBy(searchVal) {
    gSearchBy = searchVal
}
function getKeywordsMap() {
    return gKeywordsMap;
}

function updateKeywordsMap(kW) {
    gKeywordsMap[kW]++;
}

function _createKwMap() {
    let allKeywords = []
     gImgs.forEach(img=>{
         img.keywords.forEach(kw => allKeywords.push(kw))
     })
 
    console.log(allKeywords)
  let keywordsMap=  allKeywords.reduce((acc, kw) => {
        if(acc[kw] >=1) acc[kw]++;
        else acc[kw] = 1 ;
        return acc;
    }, {})
    console.log(keywordsMap)
return keywordsMap;
}
function addImg(img){
    const newImg={
        id:gImgs.length+1,
        url:img.src,
        keywords:[]
    }
    gImgs.push(newImg)
    console.log(newImg.url)
}
