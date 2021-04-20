var gImgs = [
    { id: 1, url: './img/1.jpg', keywords: ['happy'] },
    { id: 2, url: './img/2.jpg', keywords: ['happy'] },
    { id: 3, url: './img/3.jpg', keywords: ['happy'] },
    { id: 4, url: './img/4.jpg', keywords: ['happy'] },
    { id: 5, url: './img/5.jpg', keywords: ['happy'] },
    { id: 6, url: './img/6.jpg', keywords: ['happy'] },
    
];


function getImgs(){
    return gImgs;
}
function getImgURL(imgId) {
    const img = gImgs.find((img) =>{
        console.log(img.id,'img.id')
        console.log(imgId,'imgId')
        return img.id === imgId

    } )
    return img.url
}