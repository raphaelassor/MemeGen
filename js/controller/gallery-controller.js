function renderGalleryPage() {
    imgs = getImgs()
    let strHtml;
    if(!imgs.length) strHtml='<h4>Sorry, no Memes To present. feel free to upload a meme</h4>'
    else {
        strHtml = imgs.map(img => {
        return `<img src="${img.url}" alt="" onclick="onThumbnailMemeClick(${img.id})"></img>`
    }).join('')
}
    document.querySelector('.gallery-container').innerHTML = strHtml;
    renderKeywordBox()
}

function onSearchGallery(searchVal){
    setSearchBy(searchVal);
    renderGalleryPage();
}

function renderKeywordBox(){
   let keywordsMap= getKeywordsMap()
   let strHtml='';
   for(let kW in keywordsMap){
       let fontSize=(keywordsMap[kW]>8)? 40:keywordsMap[kW]*5;
       strHtml+=`<span style="font-size:${fontSize}px" onclick=onKeywordsClick('${kW}')>${kW} </span>`
   }
   document.querySelector('.keyword-box').innerHTML=strHtml
}

function onKeywordsClick(kW){
    updateKeywordsMap(kW)
    document.querySelector('.search-container input').value=kW;
    onSearchGallery(kW)
}