// images need to be in gallery service.
const MEMES_STORAGE='memes'
var gMeme = _createMeme();
var gMemes=_createMemes();

//----------GET--------------------
function getSelectedLineIdx() {
    return gMeme.selectedLineIdx;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
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
function updateSelectedIdx(idx) {
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
    updateSelectedIdx(gMeme.lines.length - 1)
    
}

function doRemoveLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
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
        dataUrl:''
    }
    return meme;
}
