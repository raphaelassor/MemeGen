var gMainCanvas;
var gMainCtx;
var gEditCanvas;
var gEditCtx;
var gStartPos;
var gIsDrag;

function init() {
    gMainCanvas = document.querySelector('.main-meme-canvas')
    gMainCtx = gMainCanvas.getContext('2d')
    gEditCanvas = document.querySelector('.edit-canvas')
    gEditCtx = gEditCanvas.getContext('2d');
    drawImg(gMainCanvas);
}
// USER CALLS 

function onInputText(textInput) {
    const lineIdx = getSelectedLineIdx()
    updateMemeText(textInput, lineIdx)

    renderCanvas()
}
function onAddLine() {
    doAddLine()
    const line = getSelectedLine()
    console.log(line)
    drawText(line)

}
function onChangeAlign(align) {
    updateAlign(align, gEditCanvas.width);
    renderCanvas();
}
function onChangeFontSize(diff) {
    updateFontSize(diff)
    renderCanvas()
}
function onRemove() {
    doRemoveLine()
    renderCanvas()
}
function onChangeColor(color) {
    doChangeColor(color)
    renderCanvas()
}

function onToggleStroke() {
    doToggleStroke();
    renderCanvas()
}
function onChangeStrokeSize(diff){
    updateStrokeSize(diff)
    renderCanvas();
}

//CANVAS MANIPLULATION
function drawImg(canvas) {
    const imgUrl = getImgURL(1)
    img = new Image()
    img.src = imgUrl;
    img.onload = () => {
        gMainCtx.drawImage(img, 0, 0, gMainCanvas.width, gMainCanvas.height)
    }
}
function renderCanvas() {
    let meme = getMeme();
    gEditCtx.clearRect(0, 0, gEditCanvas.width, gEditCanvas.height)
    meme.lines.forEach((line) => {
        drawText(line)
    });

}
function drawText(line) {
    gEditCtx.fillStyle = line.fillColor
    gEditCtx.font = `${line.fontSize}px ${line.fontFamily}`
    gEditCtx.textAlign = line.align
    gEditCanvas.textBaseline = 'middle';
    if (line.isStroke) {
        gEditCtx.strokeText(line.txt, line.pos.x, line.pos.y)
        gEditCtx.lineWidth = line.strokeWidth
    }
    gEditCtx.fillText(line.txt, line.pos.x, line.pos.y)
}

function onCanvasClick(ev) {
    const pos = getEvPos(ev)
    const meme = getMeme()
    let selectedIdx = meme.lines.findIndex(line => {
        let textwidth=gEditCtx.measureText(line.txt).width;
        if( ! (pos.y > line.pos.y - line.fontSize
            && pos.y < line.pos.y + line.fontSize)) return false;
        else{
            if(line.textAlign==='left'){
                return pos.x > line.pos.x-50
                && pos.x < line.pos.x + textwidth+50
            }
            if(line.textAlign==='right'){
                return pos.x < line.pos.x+50
                && pos.x > line.pos.x - textwidth-50
            }
            return pos.x < line.pos.x+textwidth/2+50
            && pos.x > line.pos.x - textwidth/2-50
        }   
    })
    if (selectedIdx === -1) return
    updateSelectedIdx(selectedIdx);
    console.log(selectedIdx)
    startDrag(pos)
}
function onFinishDrag(ev) {
    // if(ev.type==='touchend') ev.preventDefault();
    gIsDrag = false;
    document.body.style.cursor = 'auto'
}
function startDrag(pos) {
    gIsDrag = true;
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}
function onDrag(ev) {
    if (!gIsDrag) return
    const pos = getEvPos(ev)
    const dX = pos.x - gStartPos.x
    const dY = pos.y - gStartPos.y
    const line = getSelectedLine();
    line.pos.x += dX
    line.pos.y += dY
    console.log(gEditCtx.measureText(line.txt))
    gStartPos = pos
    renderCanvas()
}
function getEvPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // if (gTouchEvs.includes(ev.type)) {
    //     ev.preventDefault()
    //     ev = ev.changedTouches[0]
    //     pos = {
    //         x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
    //         y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
    //     }
    // }
    return pos
}
