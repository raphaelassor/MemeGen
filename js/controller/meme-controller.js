var gMainCanvas;
var gMainCtx;
var gEditCanvas;
var gEditCtx;
var gStartPos;
var gIsDrag;
var gIsResize;
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
    document.querySelector('.main-nav').addEventListener('click',()=>document.body.classList.remove('menu-open'))
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
            align: 'center',
            fontFamily:''
        }
    }
    else line = meme.lines[meme.selectedLineIdx]
    document.querySelector('.editor-container input[type="text"]').value = line.txt
    document.querySelector('.editor-container input[type="color"]').value = line.fillColor
    document.querySelector('.editor-container input[name="toggle-stroke"]').checked = line.isStroke
    document.querySelector(`.editor-container input[value="${line.align}"]`).checked = true;
    document.querySelector('.editor-container input[list="font-list"]').value = line.fontFamily


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
    const line = getSelectedObject()
    renderCanvas()
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
    doRemoveObject()
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
    updateSelectedLineIdx(-1);
    let meme = getMeme();
    meme.lines.forEach((line) => {
        drawText(line, gMainCtx)
    });
    meme.stickers.forEach(sticker => drawSticker(sticker,gMainCtx))
    const imgUrl = getMemeImgUrl()
    updateMemeDataUrl(imgUrl)
}

function onDownloadImg(elLink) {
    captureImgCanvas()
    elLink.href = getMemeImgUrl()
    drawImg(getMeme().selectedImgId)
    renderCanvas()
}
function onChangeFontFamily(family){
    setFontFamily(family);
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
        let viewWidth=(window.innerWidth>960)? 500:350;
        elContainer.style.width = `${viewWidth}px`;
        elContainer.style.height = `${(img.height * viewWidth) / img.width}px`

    }
    gEditCanvas.width = elContainer.offsetWidth
    gEditCanvas.height = elContainer.offsetHeight
    gMainCanvas.width = elContainer.offsetWidth
    gMainCanvas.height = elContainer.offsetHeight
    renderCanvas()
}
function renderCanvas(canvas = gEditCanvas, ctx = gEditCtx, ev) {
    let meme = getMeme();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    meme.lines.forEach(line => drawText(line, ctx));
    meme.stickers.forEach(sticker => drawSticker(sticker))
    if (!ev) return
    if (ev.type === 'resize') drawImg(meme.selectedImgId);
}
function drawImg(imgId) {
    const imgUrl = getImgURL(imgId)
    let img = new Image()
    img.src = imgUrl;
    resizeCanvas(img)
    img.onload = () => {
        gMainCtx.drawImage(img, 0, 0, gMainCanvas.width, gMainCanvas.height)
    }
}
function drawSticker(sticker,ctx=gEditCtx){
    drawStickerSelection(sticker)
    let stickerImg = new Image()
    stickerImg.src = sticker.stickerUrl;
   ctx.drawImage(stickerImg, sticker.pos.x,sticker.pos.y,sticker.stickerWidth,sticker.stickerHeight)
}
function drawText(line, ctx = gEditCtx) {
    const { x, y } = line.pos
    ctx.fillStyle = line.fillColor
    ctx.font = `${line.fontSize}px ${line.fontFamily}`
    ctx.textAlign = line.align
    if (line.isStroke) {
        ctx.lineWidth = line.strokeWidth
        ctx.strokeStyle='black'
        ctx.strokeText(line.txt, x, y)
    }
    // create function for selected object 
    if(line.isSelected && line.txt) drawLineSelection(line)
    ctx.fillText(line.txt, line.pos.x, line.pos.y)
}
function drawStickerSelection(sticker){
    if(!sticker.isSelected)return
    const {x,y}=sticker.pos;
    gEditCtx.beginPath()
   gEditCtx.rect(x - 5, y -5, sticker.stickerWidth + 10, sticker.stickerHeight + 10)
    gEditCtx.lineWidth = "2"
    gEditCtx.strokeStyle = 'white'
    gEditCtx.stroke()
    //Sizing Circle at the end
    gEditCtx.beginPath()
    gEditCtx.lineWidth = 6
    gEditCtx.arc(x+sticker.stickerWidth+5, y+sticker.stickerHeight + 5, 5, 0, 2 * Math.PI);
    gEditCtx.strokeStyle = 'white'
    gEditCtx.stroke();
    gEditCtx.fillStyle = 'blue'
    gEditCtx.fill()
}

function drawLineSelection(line){
    let textWidth = gEditCtx.measureText(line.txt).width;
    const {x,y}=line.pos
    gEditCtx.beginPath()
    if (line.align === 'center') gEditCtx.rect(x - textWidth / 2 - 5, y + 5, textWidth + 10, -line.fontSize - 10)
    else if (line.align === 'left') gEditCtx.rect(x - 5, y + 5, textWidth + 10, -line.fontSize - 10)
    else if (line.align === 'right') gEditCtx.rect(x + 5, y + 5, -textWidth - 10, -line.fontSize - 10)
    gEditCtx.lineWidth = "2"
    gEditCtx.strokeStyle = 'white'
    gEditCtx.stroke()
}

function onCanvasClick(ev) {
    
    const pos = getEvPos(ev)
    const meme = getMeme()
    let selectedIdx = meme.lines.findIndex(line => isLineClicked(pos, line))
    updateSelectedLineIdx(selectedIdx);
    console.log(selectedIdx)
    if(selectedIdx === -1) {
        selectedIdx=meme.stickers.findIndex(sticker=> isStickerClicked(pos,sticker))
        updateSelectedStickerIdx(selectedIdx)
        if(selectedIdx!==-1) {
            if(isSizingClicked(pos,meme.stickers[meme.selectedStickerIdx])){
                gIsResize=true
                return;
            }
        }
    }
    else  updateSelectedStickerIdx(-1)
    renderCanvas()
    renderLineSettings()
    if (selectedIdx === -1) return
    startDragMove(pos)
}
function onFinishDrag() {
    gIsDrag = false;
    gIsResize=false
    document.body.style.cursor = 'auto'
    
}
function startDragMove(pos) {
    gIsDrag = true;
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}
function onDrag(ev) {
    if (!gIsDrag&&!gIsResize) return
    console.log('dragging')
    const {x,y} = getEvPos(ev)
    const obj = getSelectedObject();
    if(gIsDrag){
        const dX = x - gStartPos.x
        const dY = y - gStartPos.y
        obj.pos.x += dX
        obj.pos.y += dY
        gStartPos = {x,y}
    }
    
    else//it is in resizing mode 
    {
        obj.stickerWidth=x-obj.pos.x
        obj.stickerHeight=y-obj.pos.y
    }
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
        if (line.align === 'left') {
            console.log(line.pos.x,line.pos.y,'left')
            return x > line.pos.x - 10
            && x < line.pos.x + textWidth + 10
        }
        if (line.align === 'right') {
            console.log(line.pos.x,line.pos.y,'right')
            return x < line.pos.x + 10
            && x > line.pos.x - textWidth - 10
        }
      
        return x < line.pos.x + textWidth / 2 + 10
            && x > line.pos.x - textWidth / 2 - 10
    }
}
function isStickerClicked(pos,sticker){
    const width=sticker.stickerWidth
    const height=sticker.stickerHeight
    const{x,y}=pos
    return (x > sticker.pos.x - 10
            && x < sticker.pos.x + width+ 10)&&((y > sticker.pos.y 
                && y < sticker.pos.y + height+10))
}
function isSizingClicked(pos,sticker){
    const{x,y}=pos
    const endX=sticker.pos.x+sticker.stickerWidth
    const endY=sticker.pos.y +sticker.stickerHeight
    return (x > endX
        && x < endX+10)&&((y > endY - 5
            && y < sticker.pos.y + endY + 5))
}
// --------------- DRAG N DROP ----------//

function onDragImg(ev){
    ev.dataTransfer.setData('stickerUrl', ev.target.src)
    ev.dataTransfer.setData('stickerWidth',ev.target.width)
    ev.dataTransfer.setData('stickerHeight',ev.target.height)
}
function onDropImg(ev){
    const stickerUrl=ev.dataTransfer.getData('stickerUrl')
    const stickerWidth =+ev.dataTransfer.getData('stickerWidth')
    const stickerHeight=+ev.dataTransfer.getData('stickerHeight')
    const pos=getEvPos(ev)
    const isSelected=true
    const sticker={stickerUrl,pos,stickerWidth,stickerHeight,isSelected}
    addSticker(sticker)
    updateSelectedLineIdx(-1)
    drawSticker(sticker)
    renderCanvas();
    renderLineSettings()
   
}
function allowDrop(ev){
    ev.preventDefault()
}




////--------------SHARE ------------------------//
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
//---------------------Input Image------------------------//
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
   
}

function loadImageFromInput(ev, onImageReady) {
    // document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()
    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        addImg(img)
    }
    reader.readAsDataURL(ev.target.files[0])
    updateSelectedImgId(getImgs().length+1)
}
function renderImg(img) {
    gMainCtx.drawImage(img, 0, 0, gMainCanvas.width, gMainCanvas.height);
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