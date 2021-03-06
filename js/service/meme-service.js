// images need to be in gallery service.
const MEMES_STORAGE='memes'
var gMeme = _createMeme();
var gMemes=_createMemes();

//----------GET--------------------
function getSelectedLineIdx() {
    return gMeme.selectedLineIdx;
}

function getSelectedObject() {
    let idx=getSelectedLineIdx()
    if (idx===-1){
        idx=getSelectedStickerIdx();
        console.log(gMeme.stickers[idx])
        return gMeme.stickers[idx]
    } 
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getSelectedStickerIdx(){
    return gMeme.selectedStickerIdx;
}
function getMeme() {
    return gMeme;
}

function getMemes(){
    return gMemes;
}
//--------UPDATE---------------
function updateMemeText(textInput, lineIdx) {
    gMeme.lines[lineIdx].txt = textInput;
}
function updateSelectedLineIdx(idx) {
    gMeme.lines.forEach(line=>line.isSelected=false)
    if(idx!==-1)gMeme.lines[idx].isSelected=true
    gMeme.selectedLineIdx = idx;
    
}
function selectLine(selectedLine) {
    gMeme.selectedLineIdx = gMeme.lines.findIndex(line => line.txt === selectedLine.txt)
    console.log('selected idx===', gMeme.selectedLineIdx)
}

function updateAlign(align, canvasWidth) {
    let posX;
    switch (align) {
        case 'right': posX = canvasWidth - 20;
            break;
        case 'left': posX = 20;
            break;
        default: posX = canvasWidth / 2
    }
    gMeme.lines[gMeme.selectedLineIdx].pos.x = posX
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}

function updateFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].fontSize += diff * 2
}
function updateColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = color;
}
function updateStrokeSize(diff) {
    if(!gMeme.lines[gMeme.selectedLineIdx].isStroke) return
    gMeme.lines[gMeme.selectedLineIdx].strokeWidth += diff
}
function updateMemeDataUrl(imgUrl){
    gMeme.dataUrl=imgUrl
}
function updateSelectedStickerIdx(idx){
    gMeme.stickers.forEach(sticker=>sticker.isSelected=false)
    if(idx!==-1)gMeme.stickers[idx].isSelected=true
    gMeme.selectedStickerIdx=idx;
}
function updateSelectedImgId(id){
    gMeme.selectedImgId=id
}
//------DO-----

function setMeme(memeId){
   const memeidx= gMemes.findIndex(meme=>memeId===meme.id)
    gMeme= JSON.parse(JSON.stringify(gMemes[memeidx]))
}

function doAddLine(canvas) {
    let posY;
    switch (gMeme.lines.length) {
        case 0: posY = 50
            break;
        case 1: posY = canvas.height-50
            break;
        default: posY = canvas.height/2
    }
    let line = {
        txt: 'Type A Funny Line',
        size: 20,
        align: 'center',
        fillColor: '#ffffff',
        isStroke: false,
        isSelected:true,
        strokeWidth: 7,
        fontSize: 40,
        fontFamily: 'Impact',
        pos: {
            x: canvas.width/2,
            y: posY,
        }
    }
    gMeme.lines.push(line)
    updateSelectedLineIdx(gMeme.lines.length - 1)
    
}

function doRemoveObject() {
    if(gMeme.selectedLineIdx!==-1)gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if(gMeme.selectedStickerIdx!==-1) gMeme.stickers.splice(gMeme.selectedStickerIdx, 1)
}

function doToggleStroke(isStroke) {
    gMeme.lines[gMeme.selectedLineIdx].isStroke = isStroke
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId;
    
}

function saveMeme(){
    const memeIdx=gMemes.findIndex(meme=>{
        return meme.id===gMeme.id
    })
    if (memeIdx===-1) gMemes.push(gMeme)
    else  gMemes.splice(memeIdx,1,gMeme)
    saveToStorage(MEMES_STORAGE,gMemes);
    console.log(gMemes)
}
function resetMeme(){
    gMeme=_createMeme();
}
function setFontFamily(family){
    gMeme.lines[gMeme.selectedLineIdx].fontFamily=family
}
function addSticker(sticker){
    gMeme.stickers.push(sticker)
    updateSelectedStickerIdx(gMeme.stickers.length-1)
    console.log(gMeme.selectedStickerIdx)
    
}
//------------------------------LOCAL FUNCTIONS---------------------//

function _createMemes() {
    //get from local storage
    let memes=loadFromStorage(MEMES_STORAGE);
    if(!memes)memes=[];
    return memes;
}
function _createMeme() {
    let meme = {
        id:makeId(),
        selectedImgId: 0,
        selectedImgUrl:'',
        selectedLineIdx: 0,
        selectedStickerIdx:-1,
        lines: [{
            txt: '',
            align: 'center',
            fillColor: '#ffffff',
            isStroke: false,
            strokeWidth: 7,
            fontSize: 40,
            isSelected:true,
            fontFamily: 'Impact',
            pos: {
                x: 200,
                y: 50,
            }
        }],
        stickers:[],
        dataUrl:''
    }
    return meme;
}
