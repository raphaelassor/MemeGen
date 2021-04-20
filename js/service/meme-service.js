// images need to be in gallery service.
var gImgs = [{ id: 1, url: './img/1.jpg', keywords: ['happy'] }];
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I never eat Falafel',
        align: 'center',
        fillColor: 'white',
        isStorke:false,
        strokeWidth:5,
        fontSize: 40,
        fontFamily: 'Impact',
        pos: {
            x: 250,
            y: 50,
        }
    }]
}
//----------GET--------------------
function getSelectedLineIdx() {
    return gMeme.selectedLineIdx;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}
function getImgURL(imgID) {
    const img = gImgs.find((img) => img.id === imgID)
    return img.url
}

function getMeme() {
    return gMeme;
}

//--------UPDATE---------------
function updateMemeText(textInput, lineIdx) {
    gMeme.lines[lineIdx].txt = textInput;
}
function updateSelectedIdx(idx){
    gMeme.selectedLineIdx =idx
}
function selectLine(selectedLine) {
    gMeme.selectedLineIdx = gMeme.lines.findIndex(line=>line.txt===selectedLine.txt)
    console.log('selected idx===',gMeme.selectedLineIdx )
}

function updateAlign(align,canvasWidth){
    let posX;
    switch(align){
        case 'right':posX=canvasWidth-20;
        break;
        case 'left' : posX=20;
        break;
        default: posX=canvasWidth/2
    }
    gMeme.lines[gMeme.selectedLineIdx].pos.x=posX
    gMeme.lines[gMeme.selectedLineIdx].align=align;
}

function updateFontSize(diff){
    gMeme.lines[gMeme.selectedLineIdx].fontSize+=diff*2
}
function udateColor(color){
    gMeme.lines[gMeme.selectedLineIdx].fillColor=color;
}
function updateStrokeSize(diff){
    gMeme.lines[gMeme.selectedLineIdx].strokeWidth+=diff
}
//------DO-----

function doAddLine() {
    let posY;
    switch (gMeme.lines.length) {
        case 0: posY = 50
            break;
        case 1: posY = 450
            break;
        default: posY = 220
    }
    let line = {
        txt: 'Type A Funny Line',
        size: 20,
        align: 'center',
        fillColor: 'white',
        isStorke:false,
        strokeWidth:5,
        fontSize: 40,
        fontFamily: 'Impact',
        pos: {
            x: 250,
            y: posY,
        }
    }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function doRemoveLine(){
    gMeme.lines.splice(gMeme.selectedLineIdx,1)
}

function doToggleStroke(){
    gMeme.lines[gMeme.selectedLineIdx].isStroke= (gMeme.lines[gMeme.selectedLineIdx].isStroke)? false:true;
}
