var gMainCanvas;
var gMainCtx;
var gEditCanvas;
var gEditCtx;
var gStartPos;
var gIsDrag;
// var gStickerSrc;
// var gIsStickerDrag;
let gTouchEvs = ['touchstart', 'touchend', 'touchmove']

function init() {
    renderGalleryPage();
    gMainCanvas = document.querySelector('.main-meme-canvas')
    gMainCtx = gMainCanvas.getContext('2d')
    gEditCanvas = document.querySelector('.edit-canvas')
    gEditCtx = gEditCanvas.getContext('2d');
    addListeners();
    // resizeCanvas();
}

function addListeners() {
    gEditCanvas.addEventListener('touchstart', onCanvasClick)
    gEditCanvas.addEventListener('touchmove', onDrag)
    gEditCanvas.addEventListener('touchend', onFinishDrag)
    window.addEventListener('resize', ev => {
        resizeCanvas()
        renderCanvas(gEditCanvas, gEditCtx, ev)
    })
    // document.querySelectorAll('.sticker-container img').forEach(img=>{
    //     img.addEventListener('dragstart', )
    //     img.addEventListener('dragend', )
    //     img.addEventListener('dragstart', )
    // })

}

function renderMemeEditPage(imgId) {
    renderLineSettings()
    resizeCanvas()
    drawImg(imgId);
    renderCanvas();
}
function renderLineSettings() {
    const meme = getMeme()
    let line;
    //none selected-default settings
    if (meme.selectedLineIdx === -1) {
        line = {
            txt: '',
            fillColor: '#ffffff',
            isStroke: false,
            align: 'center'
        }
    }
    else line = meme.lines[meme.selectedLineIdx]
    document.querySelector('.editor-container input[type="text"]').value = line.txt
    document.querySelector('.editor-container input[type="color"]').value = line.fillColor
    document.querySelector('.editor-container input[name="toggle-stroke"]').checked = line.isStroke
    document.querySelector(`.editor-container form input[value="${line.align}"]`).checked = true;


}
// USER CALLS 

function onInputText(textInput) {
    let lineIdx = getSelectedLineIdx()
    if (lineIdx === -1) lineIdx = 0
    updateMemeText(textInput, lineIdx)
    renderCanvas()
}
function onAddLine() {
    doAddLine(gEditCanvas)
    const line = getSelectedLine()
    drawText(line)
    renderLineSettings()
    document.querySelector('.editor-container input[type="text"]').value = ''

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
    console.log(document.querySelector('.editor-container input[name="toggle-stroke"]').checked)
    doToggleStroke(document.querySelector('.editor-container input[name="toggle-stroke"]').checked);
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
    renderCanvas()
}
function captureImgCanvas() {
    updateSelectedIdx(-1);
    let meme = getMeme();
    meme.lines.forEach((line) => {
        drawText(line, gMainCtx)
    });
    const imgUrl = getMemeImgUrl()
    updateMemeDataUrl(imgUrl)
}

function onDownloadImg(elLink) {
    captureImgCanvas()
    elLink.href = getMemeImgUrl()
    drawImg(getMeme().selectedImgId)
    renderCanvas()
}

function getMemeImgUrl() {
    var imgContent = gMainCanvas.toDataURL('image/jpeg')
    return imgContent
}
//CANVAS MANIPLULATION
function resizeCanvas(img) {
    let elContainer = document.querySelector('.main-meme-container');
    if (img) {
        let viewWidth=(window.innerWidth>960)? 450:300;
        elContainer.style.width = `${viewWidth}px`;
        elContainer.style.height = `${(img.height * viewWidth) / img.width}px`

    }
    
    gEditCanvas.width = elContainer.offsetWidth
    gEditCanvas.height = elContainer.offsetHeight
    gMainCanvas.width = elContainer.offsetWidth
    gMainCanvas.height = elContainer.offsetHeight


}
function drawImg(imgId) {
    gMainCtx.clearRect(0, 0, gMainCanvas.width, gMainCanvas.height)
    const imgUrl = getImgURL(imgId)
    let img = new Image()
    img.src = imgUrl;
    resizeCanvas(img)
    img.onload = () => {
        gMainCtx.drawImage(img, 0, 0, gMainCanvas.width, gMainCanvas.height)
    }
}
function renderCanvas(canvas = gEditCanvas, ctx = gEditCtx, ev) {
    let meme = getMeme();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    meme.lines.forEach((line) => {
        drawText(line, ctx)
    });

    // if (meme.selectedLineIdx !== -1) drawSelect(meme.lines[meme.selectedLineIdx])
    if (!ev) return
    if (ev.type === 'resize') drawImg(meme.selectedImgId);
}
function drawText(line, ctx = gEditCtx) {
    const { x, y } = line.pos
    ctx.fillStyle = line.fillColor
    ctx.font = `${line.fontSize}px ${line.fontFamily}`
    ctx.textAlign = line.align
    if (line.isStroke) {
        ctx.lineWidth = line.strokeWidth
        ctx.strokeText(line.txt, x, y)
    }
    if (line.isSelected && line.txt) {
        let textWidth = gEditCtx.measureText(line.txt).width;
        ctx.beginPath()
        if (line.align === 'center') ctx.rect(x - textWidth / 2 - 5, y + 5, textWidth + 10, -line.fontSize - 10)
        else if (line.align === 'left') ctx.rect(x - 5, y + 5, textWidth + 10, -line.fontSize - 10)
        else if (line.align === 'right') ctx.rect(x + 5, y + 5, -textWidth - 10, -line.fontSize - 10)
        ctx.strokeStyle = 'white'
        ctx.stroke()
    }
    ctx.fillText(line.txt, line.pos.x, line.pos.y)
}

function onCanvasClick(ev) {
    console.log('touchDown')
    const pos = getEvPos(ev)
    const meme = getMeme()
    let selectedIdx = meme.lines.findIndex(line => isLineClicked(pos, line))
    updateSelectedIdx(selectedIdx);
    renderCanvas()
    renderLineSettings()
    if (selectedIdx === -1) return
    startDrag(pos)
}
function onFinishDrag(ev) {
    console.log('on finish')
    // if(ev.type==='touchend') ev.preventDefault();
    gIsDrag = false;
    document.body.style.cursor = 'auto'
    // if (gIsStickerDrag) {
    //     const{x,y}=getEvPos(ev)
    //     img = new Image()
    //     img.src = gStickerSrc;
    //     img.onload = () => {
    //         gEditCtx.drawImage(img, x, y, gEditCanvas.width, gEditCanvas.height)
    //     }
    //     gIsStickerDrag=false;
    //     gStickerSrc='';
    // }
}
function startDrag(pos) {
    gIsDrag = true;
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}
function onDrag(ev) {
    if (!gIsDrag) return
    console.log('dragging')
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
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function isLineClicked(pos, line) {

    let textWidth = gEditCtx.measureText(line.txt).width;
    const { x, y } = pos
    if (!(y > line.pos.y - line.fontSize
        && y < line.pos.y + line.fontSize)) return false;
    else {
        if (line.textAlign === 'left') {
            return x > line.pos.x - 10
                && x < line.pos.x + textWidth + 10
        }
        if (line.textAlign === 'right') {
            return x < line.pos.x + 10
                && x > line.pos.x - textWidth - 10
        }
        return x < line.pos.x + textWidth / 2 + 10
            && x > line.pos.x - textWidth / 2 - 10
    }
}



////--------------SHARE SHIT ------------------------//
function uploadImg(elForm, ev) {
    ev.preventDefault();
    captureImgCanvas()
    let imgUrl = getMemeImgUrl()
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

////GALLERY FUNCTIONS////////////

function onThumbnailMemeClick(imgId) {
    document.querySelector('.gallery-page').style.display = 'none';
    document.querySelector('.meme-page').style.display = 'block';
    setImg(imgId)
    renderMemeEditPage(imgId)
}
function onMoveToGallery() {
    document.querySelector('.gallery-page').style.display = 'flex';
    document.querySelector('.meme-page').style.display = 'none';
    document.querySelector('.my-memes-page').style.display = 'none'
    resetMeme()
    renderGalleryPage();
}

//// MEMES PAGE FUNCTIONS//////

function onMoveToMemes() {
    const memes = getMemes()
    var imgs = getImgs()
    let strHtml = memes.map(meme => {
        let memeImg = imgs.find(img => img.id === meme.selectedImgId)
        return `<div class="meme-card">
        <img src="${meme.dataUrl}" alt="">
        <button class="btn-open" onclick="onOpenMyMeme('${meme.id}')">Open</button>
    </div>`
    })
    document.querySelector('.my-memes-container').innerHTML = strHtml.join('')
    document.querySelector('.gallery-page').style.display = 'none';
    document.querySelector('.meme-page').style.display = 'none';
    document.querySelector('.my-memes-page').style.display = 'block';
}

function onOpenMyMeme(memeId) {
    setMeme(memeId)
    const meme = getMeme()
    document.querySelector('.gallery-page').style.display = 'none';
    document.querySelector('.my-memes-page').style.display = 'none'
    document.querySelector('.meme-page').style.display = 'block';
    renderMemeEditPage(meme.selectedImgId)
}