var gMainCanvas;
var gMainCtx;
var gEditCanvas;
var gEditCtx;
var gStartPos;
var gIsDrag;

function init() {
    renderGalleryPage();
    gMainCanvas = document.querySelector('.main-meme-canvas')
    gMainCtx = gMainCanvas.getContext('2d')
    gEditCanvas = document.querySelector('.edit-canvas')
    gEditCtx = gEditCanvas.getContext('2d');
}

function renderMemeEditPage(imgId) {
    drawImg(imgId);
    renderCanvas();
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
    updateColor(color)
    renderCanvas()
}

function onToggleStroke() {
    doToggleStroke();
    renderCanvas()
}
function onChangeStrokeSize(diff) {
    updateStrokeSize(diff)
    renderCanvas();
}
function onSaveMeme() {
    captureImgCanvas()
    saveMeme()
    drawImg(getMeme().selectedImgId)
}
function captureImgCanvas(){
    let meme = getMeme();
    meme.lines.forEach((line) => {
        drawText(line,gMainCtx)
    });
    const imgUrl=getMemeImgUrl()
    updateMemeDataUrl(imgUrl)
}

function onDownloadImg(elLink){
    captureImgCanvas()
    elLink.href=getMemeImgUrl()
    drawImg(getMeme().selectedImgId)
}
////--------------SHARE SHIT ------------------------//
function uploadImg(elForm, ev) {
    ev.preventDefault();
    captureImgCanvas()
    let imgUrl=getMemeImgUrl()
    drawImg(getMeme().selectedImgId)
    document.getElementById('imgData').value = imgUrl;
    // A function to be called if request succeeds
    function onSuccess(imgUrl) {
        uploadedImgUrl = encodeURIComponent(imgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${imgUrl}&t=${imgUrl}" title="Share on Facebook" target="_blank onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${imgUrl}&t=${imgUrl}'); return false;">">
           Share   
        </a>`
    }
    let inputVal = elForm.querySelector('input').value
    doUploadImg(elForm, onSuccess, inputVal);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    console.log('doUploadImg -> formData', formData)
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}
/////////-----------------------------------------------------
function onShare(elLink){
    captureImgCanvas()
   let imgUrl=getMemeImgUrl()
    // imgUrl=encodeURIComponent(imgUrl)
    elLink.href=`https://www.facebook.com/sharer/sharer.php?u=${imgUrl}&t=${imgUrl}`
    drawImg(getMeme().selectedImgId)
}
function getMemeImgUrl() {
    var imgContent = gMainCanvas.toDataURL('image/jpeg')
    return imgContent
}
//CANVAS MANIPLULATION
function drawImg(imgId) {
    gMainCtx.clearRect(0,0,gMainCanvas.width, gMainCanvas.height)
    const imgUrl = getImgURL(imgId)
    img = new Image()
    img.src = imgUrl;
    img.onload = () => {
        gMainCtx.drawImage(img, 0, 0, gMainCanvas.width, gMainCanvas.height)
    }
}
function renderCanvas(canvas=gEditCanvas,ctx=gEditCtx) {
    let meme = getMeme();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    meme.lines.forEach((line) => {
        drawText(line,ctx)
    });
    // if (meme.selectedLineIdx !== -1) drawSelect(meme.lines[meme.selectedLineIdx])

}
function drawText(line,ctx=gEditCtx) {
    ctx.fillStyle = line.fillColor
    ctx.font = `${line.fontSize}px ${line.fontFamily}`
    ctx.textAlign = line.align
    ctx.textBaseline = 'middle';
    if (line.isStroke) {
        ctx.strokeText(line.txt, line.pos.x, line.pos.y)
        ctx.lineWidth = line.strokeWidth
    }
    ctx.fillText(line.txt, line.pos.x, line.pos.y)
}

function drawSelect(selectedLine) {
    let textWidth = gEditCtx.measureText(selectedLine.txt).width;
    let textHeight = selectedLine.fontSize * 2
    let posY = selectedLine.pos.y - selectedLine.fontSize
    let posX = selectedLine.pos.x - textWidth / 2 - 50
    if (selectedLine.textAlign === 'left') posX = selectedLine.pos.x - 50
    else if (selectedLine.textAlign === 'right') posX = selectedLine.pos.x - textwidth - 50
    gEditCtx.beginPath()
    gEditCtx.rect(posX, posY, textWidth, textHeight)
    console.log({ posX, posY, textWidth, textHeight })
    gEditCtx.fillStyle = 'blue'
    gEditCtx.fillRect(posX, posY, textWidth, textHeight)
    gEditCtx.strokeStyle = 'black'
    gEditCtx.stroke()
    gEditCtx.closePath()
}

function onCanvasClick(ev) {
    const pos = getEvPos(ev)
    const meme = getMeme()
    let selectedIdx = meme.lines.findIndex(line => {
        let textWidth = gEditCtx.measureText(line.txt).width;
        if (!(pos.y > line.pos.y - line.fontSize
            && pos.y < line.pos.y + line.fontSize)) return false;
        else {
            if (line.textAlign === 'left') {
                return pos.x > line.pos.x - 50
                    && pos.x < line.pos.x + textWidth + 50
            }
            if (line.textAlign === 'right') {
                return pos.x < line.pos.x + 50
                    && pos.x > line.pos.x - textWidth - 50
            }
            return pos.x < line.pos.x + textWidth / 2 + 50
                && pos.x > line.pos.x - textWidth / 2 - 50
        }
    })

    if (selectedIdx === -1) return
    updateSelectedIdx(selectedIdx);
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


////GALLERY FUNCTIONS////////////

function onThumbnailMemeClick(imgId) {
    document.querySelector('.gallery-page').style.display = 'none';
    document.querySelector('.meme-page').style.display = 'block';
    setImg(imgId)
    renderMemeEditPage(imgId)
}
function onMoveToGallery() {
    document.querySelector('.gallery-page').style.display = 'block';
    document.querySelector('.meme-page').style.display = 'none';
    ocument.querySelector('.my-memes-page').style.display='none'
    resetMeme()
    renderGalleryPage();
}
function renderGalleryPage() {

    imgs = getImgs()
    let strHtml = imgs.map(img => {
        return `<img src="${img.url}" alt="" onclick="onThumbnailMemeClick(${img.id})"></img>`
    })
    document.querySelector('.gallery-container').innerHTML = strHtml.join();
}
//// MEMES PAGE FUNCTIONS//////

function onMoveToMemes() {
    const memes = getMemes()
    var imgs = getImgs()
    let strHtml = memes.map(meme => {
        let memeImg = imgs.find(img => img.id === meme.selectedImgId)
        return `<div class="meme-card">
        <img src="${meme.dataUrl}" alt="">
        <h2>${meme.lines[0].txt}</h2>
        <button onclick="onOpenMyMeme('${meme.id}')">Open</button>
    </div>`
    })
    document.querySelector('.my-memes-container').innerHTML = strHtml.join()
    document.querySelector('.gallery-page').style.display = 'none';
    document.querySelector('.meme-page').style.display = 'none';
    document.querySelector('.my-memes-page').style.display='block';
}

function onOpenMyMeme(memeId) {
    setMeme(memeId)
    const meme=getMeme()
    document.querySelector('.gallery-page').style.display = 'none';
    document.querySelector('.my-memes-page').style.display='none'
    document.querySelector('.meme-page').style.display = 'block';
    renderMemeEditPage(meme.selectedImgId)
}