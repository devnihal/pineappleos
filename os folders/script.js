const canvas=document.querySelector("#canvas");
canvas.width=window.innerWidth-25;
canvas.height=window.innerHeight-75;
const ctx = canvas.getContext("2d");
var drawing = false;
var color = "black";
var palopened = false;
var moretoolsopened = false;
var writing = false;
var pensize = 10;
var candrag = false;
var candraggal=true;
var candragter=false;
var mode = "pen";
var eraseroptopen = false;
var eraserSize=20;
var ctxvalue;
var fullssreen = false;
var listopen = false;
var canvasMax= true;
var terminalmax=true;
var winfocus = "gallery";
var topBeforeMinimized;
var leftBeforeMinimized;
var topBeforeMinimizedgal;
var leftBeforeMinimizedgal;
var topBeforeMinimizedter;
var leftBeforeMinimizedter;
var preimagedraggable = false;
var imgid=0;
var trash_image_id = 0;
var galimgcount=0;
var trashimgcount = 0;
// undo redo vaiables
var undo_array = [];
var undo_index = -1;
var redo_array = [];
var redo_index = -1;
var osbooted= false;
var galsavedheight;
var galsavedwidth;
var terminalsavedheight;
var terminalsavedwidth;
var draggingobj;
var batteryboxopened = false;
var gallerymax=false;
var bathrs;
var batmins;
var batsts;
var dateboxopen =false;
var syslistopen =false;
var canvasopened = false;
var galleryopened=false;
var terminalopened=false;
var terminalvars=[];
var toolpanelopen = true;
var candragimgpr = false;
hidecontext();
hidebat();


function crvar(varname,varvalue){
    this.varname=varname;
    this.varvalue=varvalue;
    terminalvars.push(this);
}

new crvar("%random%",Math.round(Math.random()*1000))


window.addEventListener("click",(e)=>{
    hidecontext();
    if(batteryboxopened && e.target!=document.querySelector(".battery_area") && e.target!=document.querySelector(".batterymain") && e.target!=document.querySelector(".battery_in")){
        hidebat();
    }
    if(dateboxopen && e.target!=document.querySelector(".date") && e.target!=document.querySelector(".hours") && e.target!=document.querySelector(".minutes")){
        hidedatebox();
    }
    if(listopen && e.target!=document.querySelector(".appopt")){
        hidelist();
    }
    if(syslistopen && e.target!=document.querySelector(".pinesvg") && e.target!=document.querySelector(".pinepath")){
        syslistclose();
    }
    
})

window.oncontextmenu=function(e){
    var icon = document.querySelector(".trssh_icon_home_page");
    var img = document.querySelector("img.trasimgic");
    if(e.target==icon || e.target==img){
        var context = document.querySelector(".clrearRecycleBinContextMenu");
        context.style.transform="scale(1)skew(0deg)";
        context.style.left="90px";
        return false;
    }
    else if(e.target==canvas){
        Alert(`X:${e.offsetX} \n Y:${e.offsetY}`)
        return false;
    }
    else{
        return false;
    }
}
canvas.addEventListener("mousedown",startDrawing)
canvas.addEventListener("mousemove",movedmouse)
canvas.addEventListener("mouseup",enddrawing)
canvas.addEventListener("mouseout",enddrawing2)
canvas.addEventListener("click",clickedCanvas)
window.addEventListener("keydown",checkkey)
window.addEventListener("keyup",()=>{
    candrag=false;
    candraggal=false;
})
document.querySelector(".container").addEventListener("mousedown",(e)=>{
    var objst = document.querySelector(".container").style.top.replace("px","");
    objst*=1;
    winfocus="canvas";
    writing=false;
    if(e.offsetY>0 && e.offsetY>50 && e.target!=canvas){
        candrag=true;
    }
    winfocus="canvas";
    document.querySelector(".container").style.zIndex=2;
    document.querySelector(".gallery_container").style.zIndex=0;
    document.querySelector(".terminal_container").style.zIndex=0;
})
document.querySelector(".gallery_container").addEventListener("mousedown",(e)=>{
    var objstgl = document.querySelector(".gallery_container").style.top.replace("px","");
    objstgl*=1;
    winfocus="gallery";
    writing=false;
    if(e.offsetY>0 && e.offsetY<50 && e.target==document.querySelector("#titlegal")){
        candraggal=true;
    }
    else{
        candraggal=false;
    }
    winfocus="gallery";
    document.querySelector(".gallery_container").style.zIndex=2;
    document.querySelector(".container").style.zIndex=0;
    document.querySelector(".terminal_container").style.zIndex=0;
})
document.querySelector(".imagePreview").addEventListener("mousedown",(e)=>{
    var objstgl = document.querySelector(".imagePreview");
    if(objstgl.style.top.includes("%")){
        objstgl = objstgl.style.top.replace("%","")
    }
    else{
        objstgl = objstgl.style.top.replace("px","")
    }
    objstgl*=1;
    console.log(e)
    if(e.offsetY>0 && e.offsetY<100){
        candragimgpr = true;
    }
    else{
        candragimgpr = false;
    }
})
document.querySelector(".imagePreview").addEventListener("mouseup",()=>{
    candragimgpr = false;
})
document.querySelector(".terminal_container").addEventListener("mousedown",(e)=>{
    var objstgl = document.querySelector(".terminal_container").style.top.replace("px","");
    objstgl*=1;
    winfocus="terminal";
    writing=true;
    if(e.clientY>objstgl && e.clientY<objstgl+50){
        candragter=true;
    }
    else{
        candragter=false
    }
    winfocus="terminal";
    document.querySelector(".terminal_container").style.zIndex=2;
    document.querySelector(".container").style.zIndex=0;
    document.querySelector(".gallery_container").style.zIndex=0;
})



ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle="white";
ctx.fillRect(0,0,canvas.width,canvas.height)

//startBlackScreen();

document.querySelector(".container").addEventListener("resize",()=>{
    var el = document.querySelector(".container");
    canvas.style.aspectRatio=el.style.width-5+"/"+el.style.height-70;
    canvas.width-el.style.width-5;
})

function checkkey(e){
    if(e.keyCode==66 && !writing){
        mode="pen";
        paltask();
    }
    else if(e.keyCode==69 && !writing && canvasMax){
        if(e.ctrlKey && e.shiftKey){
            ClearCanvas();
            return false;
        }
        erafun();
    }
    else if(e.keyCode==89 && canvasMax && !writing){
        if(e.ctrlKey){
            redo();
        }
    }
    else if(e.keyCode==90 && canvasMax && !writing){
        if(e.ctrlKey){
           undo();
        }
    }
    else if(e.keyCode==32){
        candrag=true;
        candraggal=true
    }
    else if(e.key=="+" && e.ctrlKey && canvasMax && e.shiftKey){
        addToGallery();
        return false;
    }
    else if(e.keyCode=="84" && !writing && canvasMax){
        toolpaneltask();
    }
}


function startDrawing(e){
    if(toolpanelopen){
        hidetoolpanel();
        Alert("Tool panel hided, press 'T' for opening")
    }
    redo_array=[];
    redo_index=-1;
    if(palopened)closepalette();
    if(eraseroptopen)erafun();
    if(moretoolsopened)hidemoretools();
    if(candrag)return;
    drawing=true;
    candrag=false;
    if(mode=="pen"){
        movedmouse(event)
    }
}

function movedmouse(e){
    if(candrag)return;
    if(!drawing)return;
    var loacalpost = document.querySelector(".container").style.top.replace("px","");
    loacalpost*=1;
    var loacalposl = document.querySelector(".container").style.left.replace("px","");
    loacalposl*=1;
    if(mode=="eraser"){
        ctx.strokeStyle="white";
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth=eraserSize;
        ctx.lineTo(e.clientX-canvas.offsetLeft-loacalposl,e.clientY-canvas.offsetTop-loacalpost);
        ctx.stroke();
    }
    else{
        ctx.strokeStyle=color;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth=pensize;
        ctx.lineTo(e.clientX-canvas.offsetLeft-loacalposl,e.clientY-canvas.offsetTop-loacalpost)
        ctx.stroke();
    }
}

function enddrawing(e){
    drawing=false;
    candrag=true;
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height))
    undo_index++;
    ctx.beginPath()
}
canvas.addEventListener("dblclick",(e)=>{
    if(e.offsetX<100){
        showtoolpanel();
        return;
    }
})
function enddrawing2(e){
    if(drawing){    
        undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height))
        undo_index++;
    }
    drawing=false;
    candrag=false;
    ctx.beginPath()
}

function clickedCanvas(e){
    var userX = e.clientX;
    var userY = e.clientY;
    return;
}
window.addEventListener("resize",windowResized)

function windowResized(){
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    undo_index++;
    canvas.width=window.innerWidth-25;
    canvas.height=window.innerHeight-75;
    if(undo_index<0)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.putImageData(undo_array[undo_index],0,0)
    document.querySelector(".container").style.aspectRatio=window.innerWidth+"/"+window.innerHeight;
}
function erafun(){
    if(palopened==true)closepalette();
    if(moretoolsopened==true)hidemoretools();
    if(eraseroptopen){
        eraserclose();
    }
    else{
        eraseropen();
    }
}

function changePenColor(el){
    color=el.style.backgroundColor;
}

function closepalette(){
    var colsel = document.querySelector(".color_panel");
    colsel.style.transform="scale(0)translateX(-100%)skew(25deg)";
    colsel.style.left="-500px";
    colsel.style.top="0px";
    palopened=false;
}
function openpal(){
    var colsel = document.querySelector(".color_panel");
    colsel.style.transform="scale(1)translateX(0%)skew(0deg)";
    colsel.style.left="90px";
    colsel.style.top="80px";
    palopened=true;
    mode="pen"
    showtoolpanel()
}


function eraserclose(){
    eraseroptopen=false;
    var erpal= document.querySelector(".eraser_opts").style;
    erpal.transform="translate(-100%,-100%)scale(3)";
    erpal.left="-500px";
}
function eraseropen(){
    mode='eraser';
    eraseroptopen=true;
    var erpal= document.querySelector(".eraser_opts").style;
    erpal.transform="translate(0px,0px)scale(1)";
    erpal.left="90px";
    showtoolpanel();
}

function paltask(){
    if(eraseropen)eraserclose();
    if(moretoolsopened)hidemoretools();
    if(!palopened){
        openpal();
    }
    else{
        closepalette();
    }
}

new dragElement(document.querySelector(".container"));
new dragElement(document.querySelector(".gallery_container"));
new dragElement(document.querySelector(".imagePreview"));
new dragElement(document.querySelector(".terminal_container"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    var objst = document.querySelector(".container").style.top.replace("px","");
    objst*=1;
    if(e.clientY>objst && e.clientY<objst+50){
        candrag=true;
    }
    e = e || window.event;
    // e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if(winfocus=="canvas"){
        if(candrag==true){
            if(e.clientY<5){
                document.querySelector(".container").style.top = 5 + "px";
                document.querySelector(".container").style.left = (document.querySelector(".container").offsetLeft - pos1) + "px";
            }
            else{
                document.querySelector(".container").style.top = (document.querySelector(".container").offsetTop - pos2) + "px";
                document.querySelector(".container").style.left = (document.querySelector(".container").offsetLeft - pos1) + "px";
            }
        }
    }
    else if(winfocus=="gallery"){
        if(candraggal==true){
           if(e.clientY<5){
            document.querySelector(".gallery_container").style.top = 5 + "px";
            document.querySelector(".gallery_container").style.left = (document.querySelector(".gallery_container").offsetLeft - pos1) + "px";
           }
           else{
            document.querySelector(".gallery_container").style.top = (document.querySelector(".gallery_container").offsetTop - pos2) + "px";
            document.querySelector(".gallery_container").style.left = (document.querySelector(".gallery_container").offsetLeft - pos1) + "px";
           }
        }
        else if(candragimgpr){
            document.querySelector(".imagePreview").style.top = (document.querySelector(".imagePreview").offsetTop - pos2) + "px";
            document.querySelector(".imagePreview").style.left = (document.querySelector(".imagePreview").offsetLeft - pos1) + "px";
        }
    }
    else if(winfocus=="terminal"){
        if(candragter==true){
            if(e.clientY<5){
                document.querySelector(".terminal_container").style.top = 5 + "px";
                document.querySelector(".terminal_container").style.left = (document.querySelector(".terminal_container").offsetLeft - pos1) + "px";
            }
            else{
                document.querySelector(".terminal_container").style.top = (document.querySelector(".terminal_container").offsetTop - pos2) + "px";
                document.querySelector(".terminal_container").style.left = (document.querySelector(".terminal_container").offsetLeft - pos1) + "px";
            }
        }
    }
  }

  function closeDragElement(e) {
      candrag=false;
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}





function minimizeWindow(){
    var elem = document.querySelector(".container");
    var icon = document.querySelector(".appicon");
    topBeforeMinimized=elem.style.top.replace("px","");
    leftBeforeMinimized=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform='scale(0)';
    elem.style.left=`100%`;
    icon.style.transform="scale(1)";
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    canvasMax=false;
}
function closewindow(){
    var elem = document.querySelector(".container");
    var icon = document.querySelector(".appicon");
    topBeforeMinimized=elem.style.top.replace("px","");
    leftBeforeMinimized=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform='scale(0)';
    elem.style.left=`100%`;
    icon.style.animationName="exit--ic";
    icon.addEventListener("animationend",()=>{
        icon.remove();
    })
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    canvasMax=false;
    canvasopened=false;
    ClearCanvassys();
    
}
function maximizeWindow(){
    winfocus="canvas";
    if(!canvasopened){
        document.querySelector(".recapplist").innerHTML+=`<div onclick="canvastask()" class="appicon"></div>`;
        canvasopened=true;
    }
    var elem = document.querySelector(".container");
    elem.style.transition="0.5s";
    var icon = document.querySelector(".appicon");
    elem.style.transform='scale(1)';
    elem.style.top="10px"
    elem.style.left=leftBeforeMinimized+"px";
    elem.style.top=topBeforeMinimized+"px";
    icon.style.transform="scale(1)";
    canvasMax=true;
    writing=false;
    document.querySelector(".container").style.zIndex=2;
    document.querySelector(".gallery_container").style.zIndex=0;
    elem.ontransitionend = function(){
        elem.style.transition="none";
        winfocus="canvas";
    }
    document.querySelector(".container").style.zIndex=2;
    document.querySelector(".gallery_container").style.zIndex=0;
    document.querySelector(".terminal_container").style.zIndex=0;
}
function canvastask(){
    if(canvasMax){
        minimizeWindow();
    }else{
        maximizeWindow();
    }
}

function setFullScreen(){
    var elem =document.documentElement;
    if(!fullssreen){
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
        else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } 
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        setTimeout(() => {
                window.addEventListener("fullscreenchange",()=>{
                    shutdown();
                    window.location.reload();
                })
        }, 50);
        fullssreen = true;
    }
    else{
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullssreen = false;
    }
}

//undo redo functions 

function undo(){
    if(undo_index<=0){
        if(undo_index==0){
            redo_array.push(undo_array[0]);
            redo_index++;
        }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="#ffffff";
        ctx.fillRect(0,0,canvas.width,canvas.height)
        undo_index=-1;
        undo_array=[];
    }
    else{
        redo_array.push(undo_array[undo_index])
        redo_index++;
        undo_array.pop();
        undo_index--;
        ctx.putImageData(undo_array[undo_index],0,0);
    }
}

function redo(){
    if(redo_index<0){
        redo_array=[];
        redo_index=-1;
    }
    else if(redo_index==0){
        ctx.putImageData(redo_array[redo_index],0,0)
        undo_array.push(redo_array[0])
        undo_index++;
        redo_array=[];
        redo_index=-1;
    }
    else{
        ctx.putImageData(redo_array[redo_index],0,0)
        undo_array.push(redo_array[redo_index])
        undo_index++;
        redo_array.pop()
        redo_index--;     
    }
}


function ClearCanvas(){
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    undo_index++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    undo_index++;
    Alert("Canvas Cleared!")
}
function ClearCanvassys(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    undo_array=[];
    undo_index=-1;
}


function showlist(){
    var list = document.querySelector(".applist");
    list.style.height="auto";
    list.style.top=50+"px";
    listopen=true;
}
function hidelist(){
    var list = document.querySelector(".applist");
    list.style.height="auto";
    list.style.top=-500+"px";
    listopen=false;
}

function listtask(){
    if(listopen){
        hidelist();
    }
    else{
        showlist();
    }
}

function showmoretools(){
    var case_box = document.querySelector(".more_tools");
    case_box.style.left="100px";
    case_box.style.transform="scale(1)skew(0deg)";
    moretoolsopened=true;
}
function hidemoretools(){
    var case_box = document.querySelector(".more_tools");
    case_box.style.left="-500px";
    case_box.style.transform="scale(0)skew(45deg)";
    moretoolsopened=false;
}

function moretask(){
    if(eraseropen)eraserclose();
    if(palopened)closepalette();
    if(moretoolsopened){
        hidemoretools();
    }
    else{
        showmoretools();
    }
}

function minimizegallery(){
    gallerymax=false;
    var elem = document.querySelector(".gallery_container");
    var icon =  document.querySelector(".appicon2");
    topBeforeMinimizedgal=elem.style.top.replace("px","");
    leftBeforeMinimizedgal=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    // elem.style.top="calc(100vh - 90px)";
    elem.style.left=`100%`;
    elem.style.transform='scale(0)';
    icon.style.transform="scale(1)";
    galsavedheight=elem.style.height.replace("px","");
    galsavedwidth=elem.style.width.replace("px","");
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
}
function closegallery(){
    gallerymax=false;
    var elem = document.querySelector(".gallery_container");
    var icon = document.querySelector(".appicon2");
    topBeforeMinimizedgal=elem.style.top.replace("px","");
    leftBeforeMinimizedgal=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform='scale(0)';
    elem.style.left=`100%`;
    icon.style.animationName="exit--ic";
    icon.addEventListener("animationend",()=>{
        icon.remove();
    })
    galsavedheight=elem.style.height.replace("px","");
    galsavedwidth=elem.style.width.replace("px","");
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    galleryopened=false;
}
function maximizegallery(){
    if(!galleryopened){
        document.querySelector(".recapplist").innerHTML+=`<div class="appicon2" onclick="gallerytask()"></div>`;
        galleryopened=true;
    }
    gallerymax=true;
    writing=false;
    winfocus="gallery";
    var elem = document.querySelector(".gallery_container");
    elem.style.transition="0.5s";
    var icon = document.querySelector(".appicon2");
    elem.style.transform='scale(1)';
    elem.style.top="10px";
    elem.style.height=galsavedheight+"px";
    elem.style.width=galsavedwidth+"px";
    elem.style.left=leftBeforeMinimizedgal+"px";
    elem.style.top=topBeforeMinimizedgal+"px";
    icon.style.transform="scale(1)";
    document.querySelector(".gallery_container").style.zIndex=2;
    document.querySelector(".container").style.zIndex=0;
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    document.querySelector(".container").style.zIndex=0;
    document.querySelector(".gallery_container").style.zIndex=2;
    document.querySelector(".terminal_container").style.zIndex=0;
}

function gallerytask(){
    if(gallerymax){
        minimizegallery();
    }
    else{
        image_folder_show();
        maximizegallery();
    }
}

function preimageopen(el){
    var box = document.querySelector(".imagePreview");
    box.style.transition="0.5s";
    var image = document.querySelector(".preimage");
    image.src = el.src;
    box.style.left=50+"%";
    box.style.width="50%";
    box.style.transform="translate(-50%,-50%)skew(0deg)scale(1)";
    setTimeout(() => {
        box.style.transition="none";
    }, 500);
}
function preimageclose(){
    var box = document.querySelector(".imagePreview");
    box.style.transition="0.5s";
    box.style.left=-150+"%";
    box.style.transform="translate(-50%,-50%)skew(80deg)scale(0)";
    setTimeout(() => {
        box.style.transition="none";
    }, 500);
}


function addToGallery(){
    imgid++;
    galimgcount++;
    if(galimgcount==1){
        document.querySelector(".atmes").style.display="none";
    }
    var img_url = canvas.toDataURL("image/png");
    var gal = document.querySelector(".doc_show");
    gal.innerHTML+=` <div draggable="true" ondragstart="imgfiledrag(event)"   class="imagecont" id="img${imgid}holder">
    <img onclick="preimageopen(this)" id='img${imgid}' src="${img_url}" draggable='false' class="disimage" alt="">
    <h1 class="dnldbtnar">
        <svg width="30" height="30" fill="var(--theme-white)" title="Delete Image" onclick="putToTrash(img${imgid}.id);" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        <svg onclick='dnld(img${imgid})'  width="30" title="Download Image" height="30" fill="var(--theme-white)" class='downloadbtn' viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
    </h1>

</div>`;
Alert("Added To Gallery");
}

function imgfiledrag(ev){
    ev.dataTransfer.setData("text",ev.target.id.replace("holder",""));
}
function imgfileallowDrop(ev) {
    ev.preventDefault();
}
function imgfiledrop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    putToTrash(data)
}
function dnld(bt){
    var a = document.createElement("a");
    a.href=document.querySelector("#"+bt.id).src;
    a.download="images.png";
    a.click();
    Alert("Downloading...")
}

function download(){
    var img= canvas.toDataURL("images/png");
    var a = document.createElement("a");
    a.href=img;
    a.download="images.png";
    a.click();
    Alert("Downloading...")
}

function deleteitem(delitem){
    galimgcount--;
    if(galimgcount<1){
        document.querySelector(".atmes").style.display="flex";
    }
    document.getElementById(delitem.id).remove();
}



function putToTrash(el){
    trash_image_id++;
    trashimgcount++;
    galimgcount--;
    if(trashimgcount>0){
        document.querySelector(".trasimgic").src="./os folders/trash not empty.png";
    }
    if(trashimgcount==1){
        document.querySelector(".atmestrash").style.display="none";
    }
    if(galimgcount<1){
        document.querySelector(".atmes").style.display="flex";
    }
    var image = document.getElementById(el);
    document.querySelector(".trash_show").innerHTML+=`
    <div class="imageconttrsh" id="trash${trash_image_id}holder">
        <img  src="${image.src}"  id="trash${trash_image_id}" class="trashimage" alt="">
        <h1 class="recover">
        <svg width="30" height="30" fill="var(--theme-white)" title="Delete Image" onclick="deleteper(trash${trash_image_id})" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
            <svg onclick="recover(trash${trash_image_id})" width="30" height="30" fill="var(--theme-white)" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                <path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
        </h1>

    </div>
    `;
    document.getElementById(`${image.id}holder`).remove();
    Alert("Deleted Successfully")
}
function clearGallery(){
    if(galimgcount>0){
        Confirm.open({
            title:"Are You Sure?",
            message:"This File Will Be Deleted Permanently And Not Be Abled To Recover!",
            okText:"Ok",
            cancelText:"Cancel",
            onOk:()=>{
                galimgcount=-1;
                var galimgages = document.querySelectorAll(".imagecont");
                for(i=0;i<galimgages.length;i++){
                    galimgages[i].remove();
                }
                galimgcount=0;
                document.querySelector(".atmes").style.display="flex";
                Alert("Deleted All Files Successfully!")
            },
            onCancel:()=>{
                return;
            }
        });
    }
    else{
        Alert("Nothing in gallery!")
    }
}

function recover(el){
    var recimg = document.getElementById(el);
    imgid++;
    galimgcount++;
    trashimgcount--;
    if(galimgcount==1){
        document.querySelector(".atmes").style.display="none";
    }
    if(trashimgcount<1){
        document.querySelector(".atmestrash").style.display="flex";
        document.querySelector(".trasimgic").src="./os folders/trash empty.png";
    }
    var img_url = el.src;
    var gal = document.querySelector(".doc_show");
    gal.innerHTML+=` <div draggable="true" ondragstart="imgfiledrag(event)" class="imagecont" id="img${imgid}holder">
    <img onclick="preimageopen(this)" id='img${imgid}' src="${img_url}" draggable='false' class="disimage" alt="">
    <h1 class="dnldbtnar">
        <svg width="30" height="30" fill="var(--theme-white)" title="Delete Image" onclick="putToTrash(img${imgid}.id)" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        <svg onclick='dnld(img${imgid})'  width="30" title="Download Image" height="30" fill="var(--theme-white)" class='downloadbtn' viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
    </h1>

</div>`;
document.getElementById(el.id+"holder").remove();
}

function image_folder_show(){
    document.querySelector(".trash_show").style.display="none";
    document.querySelector(".doc_show").style.display="block";
}

function trash_folder_show(){
    document.querySelector(".trash_show").style.display="block";
    document.querySelector(".doc_show").style.display="none";
}

function deleteper(el){
    Confirm.open({
        title:"Are You Sure?",
        message:"This File Will Be Deleted Permanently!",
        okText:"Ok",
        cancelText:"Cancel",
        onOk:()=>{
            trashimgcount--;
            if(trashimgcount<1){
                document.querySelector(".atmestrash").style.display="flex";
                document.querySelector(".trasimgic").src="./os folders/trash empty.png";
            }
            document.getElementById(el.id+"holder").remove()
            Alert("Deleted Permanently!");
        },
        onCancel:()=>{return false;}
    });
}


function opentrash(){
    trash_folder_show();
    maximizegallery();
}




const Confirm = {
    open(options){
        options = Object.assign({},{
            title:"",
            message:"",
            okText:"OK",
            cancelText:"Cancel",
            onOk:function() {},
            onCancel: function() {}
        },options);

        const html = `
            <div class="confirm">
            <div class="confirm__window">
                <div class="confirm__titlebar">
                    <span class="confirm__title">${options.title}</span>
                    <svg width="30" height="30" class="confirm__close--btn" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </div>
                <div class="confirm__content">
                    ${options.message}
                </div>
                <div class="confirm__buttons">
                    <button class="confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
                    <button class="confirm__button confirm__button--cancel ">${options.cancelText}</button>
                </div>
            </div>
        </div>
        `;
        const template = document.createElement("template");
        template.innerHTML=html;
        const confirmElement = template.content.querySelector(".confirm");
        const btnclose = template.content.querySelector(".confirm__close--btn");
        const btnok = template.content.querySelector(".confirm__button--ok");
        const btncancel = template.content.querySelector(".confirm__button--cancel");
        btnok.addEventListener("click",()=>{
            options.onOk();
            this._close(confirmElement)
        })
        btncancel.addEventListener("click",()=>{
            options.onCancel();
                this._close(confirmElement)
        })
        btnclose.addEventListener("click",()=>{
            options.onCancel();
                this._close(confirmElement)
        })
        document.body.appendChild(template.content);
    },
    _close(confirmElement){
        confirmElement.classList.add("confirm--close");
        confirmElement.addEventListener("animationend",()=>{
            document.body.removeChild(confirmElement);
        });
    }
}


function cleartrash(){
    var trshimg = document.querySelectorAll(".imageconttrsh");
if(trshimg.length<1){
    Alert("Nothing To Clear In Trash")
}
else{
    Confirm.open({
        title:"Are You Sure?",
        message:`These ${trashimgcount} File(s) Will Be Deleted Permanently!`,
        okText:"Ok",
        cancelText:"Cancel",
        onOk:()=>{
            for(var i = 0; i<trshimg.length;i++){
                trshimg[i].remove();
            }
            document.querySelector(".atmestrash").style.display="flex";
            document.querySelector(".trasimgic").src="./os folders/trash empty.png";
            trashimgcount=0;
            Alert("Trash Cleared")
        },
        onCancel:()=>{return false;}
    });
}
}

function hidecontext(){
    var context = document.querySelector(".clrearRecycleBinContextMenu");
    context.style.transform="scale(0)skew(45deg)";
    context.style.left="15px";
}


function syslisttask(){
    if(syslistopen){
        syslistclose();
    }
    else{
        syslistopeni();
    }
}

function syslistopeni(){
    var list = document.querySelector(".syslist");
    list.style.height="auto";
    list.style.top=50+"px";
    syslistopen=true;
}

function syslistclose(){
    var list = document.querySelector(".syslist");
    list.style.height="auto";
    list.style.top=-100+"px";
    listopen=false;
    syslistopen=false;
}

window.addEventListener("load",()=>{
    document.querySelector(".entry").style.display="none";
    var osdt = navigator.appVersion;
    osdt.toString();
    if(osdt.includes("Windows") || osdt.includes("Linux")){
        document.querySelector(".devicetype").style.display="none";
    }
})


function startBlackScreen(){
setTimeout(() => {
        var els = document.querySelectorAll(".blackscreentitlecharel");
        for(i=0;i<els.length;i++){
            els[i].classList.add("blackscreentitlechar")
        }
        els[0].addEventListener("animationend",()=>{
            setTimeout(() => {
               var els = document.querySelectorAll(".blackscreentitlecharel");
                document.querySelector(".blackscreen").style.backgroundColor="#ffffff";
                for(i=0;i<els.length;i++){
                    els[i].style.stroke="#000000";
                }
                setTimeout(() => {
                    document.querySelector(".blackscreen").classList.add("blackscreen--close");
                    document.querySelector(".blackscreen--close").addEventListener("animationend",()=>{
                        document.querySelector(".blackscreen").style.display="none";
                        document.querySelector(".fullholder").style.display="block";
                    })
                }, 10000);
                
           }, 500);
        });
}, 1500);
}


function powerbtnclicked(el){
    setFullScreen();
    document.querySelector(".power_button").style.fill="#37ff00";
    document.querySelector(".powerTitle").style.display="none";
    setTimeout(() => {
        el.classList.add("power_button--close")
        el.addEventListener("animationend",()=>{
            el.style.display="none";
            startBlackScreen();
        })
}, 5000);
}


function shutdown(){
    var screen = document.querySelector(".shutdownscreen");
    var els = document.querySelectorAll(".shutdownscreentitlechar");
    screen.style.display="block";
    setTimeout(() => {
setTimeout(() => {
            screen.style.opacity="100%";
            for(i=0;i<els.length;i++){
                els[i].classList.add("shutdownscreentitlecharend")
            }
            els[0].addEventListener("animationend",()=>{
                screen.innerHTML="";
            })
            setTimeout(() => {
                setFullScreen();
            }, 8000);
}, 500);
    }, 1000);
}





function batteryupdate(){
    var batteryel = document.querySelector(".battery_in")
    navigator.getBattery().then(function(battery) {
        batteryel.style.width=`calc(${battery.level*100+"%"} - 4px)`;
        document.querySelector(".batteryperc").textContent=battery.level*100+"%";
        document.querySelector(".battery_det_perc").textContent=battery.level*100+"%";
        if(battery.level*100>=100 && battery.charging){
            Alert("battery fully charged!")
        }
        if(battery.charging){
            batsts="Charging";
            bathrs = Math.floor(battery.chargingTime / 60/60);
            batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
            if(bathrs!=Infinity){
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
            else{
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
            }
        }
        else{
            document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
            if(bathrs!=Infinity){
                batsts="Discharging";
                bathrs = Math.floor(battery.dischargingTime / 60/60);
                batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
        }
        if(!battery.charging){
            if(battery.dischargingTime!=Infinity){
                bathrs = Math.floor(battery.dischargingTime / 60/60);
                batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
            else{
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
            }
        }
        else{
            if(battery.chargingTime!=Infinity){
                bathrs = Math.floor(battery.chargingTime / 60/60);
                batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
            else{
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
            }
        }
        if(battery.charging){
            document.querySelector(".charging_battery").style.display="block";
        }
        else{
            document.querySelector(".charging_battery").style.display="none";
        }
        // ... and any subsequent updates.
        battery.onlevelchange = function() {
            batteryel.style.width=`calc(${battery.level*100+"%"} - 4px)`;
            document.querySelector(".batteryperc").textContent=battery.level*100+"%";
            document.querySelector(".battery_det_perc").textContent=battery.level*100+"%";
            if(battery.level*100>=100){
                Alert("battery fully charged!")
            }
            else if(battery.level*100<45){
                Confirm.open({
                    title:"Battery Low",
                    message:`your battery is ${battery.level*100}. wanna shutdown?`,
                    okText:"shutdown",
                    cancelText:"I will manage (¬_¬ )",
                    onOk:()=>{
                        Alert("shutting down");
                        shutdown()
                     },
                    onCancel:()=>{return false;}
                });
            }
            if(!battery.charging){
                if(battery.dischargingTime!=Infinity){
                    bathrs = Math.floor(battery.dischargingTime / 60/60);
                    batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                    document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
                }
                else{
                    document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                }
            }
            else{
                if(battery.chargingTime!=Infinity){
                    bathrs = Math.floor(battery.chargingTime / 60/60);
                    batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                    document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
                }
                else{
                    document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                }
            }
        };
        battery.onchargingchange = function () {
            if(battery.charging){
                document.querySelector(".charging_battery").style.display="block";
                batsts="Charging";
                bathrs = Math.floor(battery.chargingTime / 60/60);
                batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                battery.onchargingtimechange = function(){
                    batsts="Charging";
                    bathrs = Math.floor(battery.chargingTime / 60/60);
                    batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                    document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                }
          }
          else{
              document.querySelector(".charging_battery").style.display="none";
              batsts="Discharging";
              bathrs = Math.floor(battery.dischargingTime / 60/60);
              batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
              document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;(${battery.level*100}%&nbsp;Available)`;
              battery.ondischargingtimechange=function(){
                batsts="Discharging";
                bathrs = Math.floor(battery.dischargingTime / 60/60);
                batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)`;
              }
          }
        }
      });
}
batteryupdate();
up_date();

function up_date(){
    var minarea = document.querySelector(".minutes")
    var hrarea = document.querySelector(".hours")
    // var secarea = document.querySelector(".seconds")
    var date = new Date();
    var minutes = date.getMinutes().toString();
    var hours=date.getHours().toString();
    if(minutes.length==1){
        minarea.textContent="0"+date.getMinutes();
    }
    else{
        minarea.textContent=date.getMinutes();
    }
    if(hours.length==1){
        hrarea.textContent="0"+date.getHours();
    }
    else{
        hrarea.textContent=date.getHours();
    }

    setTimeout(up_date,1)
}


function hidebat(){
    var batel = document.querySelector(".batter_date_details");
    batel.style.transform="translateX(-100%)skew(45deg)scale(0)";
    batel.style.top=-50+"px";
    batteryboxopened=false;
}
function showbat(){
    var batel = document.querySelector(".batter_date_details");
    batel.style.transform="translateX(-100%)skew(0deg)scale(1)";
    batel.style.top=50+"px";
    batteryboxopened=true;
}
function batboxtask(){
    if(batteryboxopened){
        hidebat();
    }
    else{
        showbat();
    }
}


datetime();
function datetime(){
    var time = new Date();
    var timearea = document.querySelector(".time");
    var dateaea = document.querySelector(".datedet");
    var dayarea= document.querySelector(".daywhich");
    var daytype = time.getDay();
    var hours = time.getHours().toString();
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var datem = time.getDate();
    var month = time.getMonth();
    var year = time.getFullYear()
    switch(daytype){
        case 1:
            daytype="Monday";
            break;
        case 2:
            daytype="Tuesday";
            break;
        case 3:
            daytype="Wednessday";
            break;
        case 4:
            daytype="Thusday";
            break;
        case 5:
            daytype="Friday";
            break;
        case 6:
            daytype="Saturday";
            break;
        case 7:
            daytype="Sunday";
            break;
        default:
            daytype="Funday";
            break;
    }
    switch(month){
        case 0:
            month="January";
            break;
        case 1:
            month="February";
            break;
        case 2:
            month="March";
            break;
        case 3:
            month="April";
            break;
        case 4:
            month="May";
            break;
        case 5:
            month="June";
            break;
        case 6:
            month="July";
            break;
        case 7:
            month="August";
            break;
        case 8:
            month="Spetember";
            break;
        case 9:
            month="October";
            break;
        case 10:
            month="November";
            break;
        case 11:
            month="December";
            break;
        default:
            month="Erron";
            break;
    }
    if(hours.length==1){
        hours="0"+time.getHours().toString()
    }
    if(minutes.length==1){
        minutes="0"+time.getMinutes().toString()
    }
    if(seconds.length==1){
        seconds="0"+time.getSeconds().toString()
    }
    timearea.innerHTML=`${hours}:${minutes}:${seconds}`;
    dateaea.innerHTML=`${datem}&nbsp;${month}&nbsp;${year}`;
    dayarea.innerHTML=daytype;
    setTimeout(datetime,1)
}

hidedatebox();

function hidedatebox(){
    var datebox= document.querySelector(".date_area");
    dateboxopen=false;
    datebox.style.transform="translateX(0%)scale(0)skew(45deg)";
    datebox.style.top=-100+"px";
}
function showdatebox(){
    var datebox= document.querySelector(".date_area");
    dateboxopen=true;
    datebox.style.transform="translateX(-100%)scale(1)skew(0deg)";
    datebox.style.top=50+"px";
}
function dateboxtask(){
    if(dateboxopen){
        hidedatebox();
    }
    else{
        showdatebox();
    }
}


function Alert(mess){
    var bt = document.createElement("div");
    bt.classList.add("botmes");
    bt.textContent=mess;
    bt.addEventListener("animationend",()=>{
        bt.remove();
    })
    document.body.appendChild(bt);
}


function checkkeyter(e,el){
    if(e.keyCode==13){
        excecuteterminalcode()
    }
}

function excecuteterminalcode(){
    var tercode = document.querySelector(".tertype").textContent;
    var bodyter = document.querySelector(".terzone");
    tercode = tercode.replace(/&/g,"&amp;")
    tercode = tercode.replace(/</g,"&lt;")
    tercode = tercode.replace(/>/g,"&gt;")
    if(tercode.substring(0,5)=="shout"){
        var  repler = tercode.replace("shout","");
        for(i=0;i<terminalvars.length;i++){
            repler=repler.replaceAll(terminalvars[i].varname,terminalvars[i].varvalue)
        }
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>${repler}`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="setmode(night)"){
        nightmode();
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>mode changed to daymode`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="setmode(day)"){
        daymode();
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>mode changed to nightmode`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode.substring(0,3)=="set"){
        var mercode=tercode;
        tercode=tercode.replace("set ","");
        tercode=tercode.split("=");
        var mermode = tercode[0];
        if(mermode[mermode.length-1]==" "){
            mermode=mermode.split("");
            mermode.pop();
            mermode = mermode.join("");
            tercode[0]=mermode;
        }
        mermode=tercode[1];
        if(mermode[0]==" "){
            mermode=mermode.split("");
            mermode.shift();
            mermode = mermode.join("");
            tercode[1]=mermode;
        }
        if(tercode[0].includes(" ")){
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${mercode}<br/>syntax error in nameing (try removing white spaces!) "${tercode[0]}"`;
            document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
            setTimeout(() => {
                document.querySelector('.tertype').focus()
            }, 50);
            return;
        }
        var indexoftervar = terminalvars.findIndex(e=>e.varname==`%${tercode[0]}%`)
       if(indexoftervar  == (-1) ){
        new crvar(`%${tercode[0].replace(/ /g,"")}%`,tercode[1]);
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${mercode}<br/>setted ${tercode[0]} to "${tercode[1]}"`;
    }
    else{
        terminalvars[indexoftervar].varvalue=tercode[1]
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${mercode}<br/>changed ${tercode[0]} as "${tercode[1]}"`;
       }
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    // else if(tercode=="breakos()"){
    //     document.querySelector("#linkos").href="";
    //     bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>broke os!`;
    //     document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" contenteditable spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)"></span><br/>`;
    //     setTimeout(() => {
    //         document.querySelector('.tertype').focus()
    //     }, 50);
    //     setTimeout(() => {
    //         bodyter.innerHTML+=`<br/><br/>root:/user/common/$-<br/>update date time error!`;
    //         document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype"  spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)"></span><br/>`;
    //         setTimeout(() => {
    //             bodyter.innerHTML+=`<br/><br/>root:/user/common/$-<br/>shutting down device!`;
    //             setTimeout(() => {
    //                 shutdown();
    //                 setTimeout(() => {
    //                     document.querySelector("#linkos").href="./os folders/style.css";
    //                 }, 2200);
    //             }, 5000);
    //         }, 3000);
    //     }, 1500);
    // }
    else if(tercode=="cls"){
        bodyter.innerHTML=``;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="gallery()"){
        image_folder_show()
        maximizegallery();
        minimizegallery();
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>gallery opened!`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode.substring(0,4)=="calc"){
        try{
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode} <br/> ${eval(tercode.replace("calc",""))}`;
        }
        catch(err){
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode} <br/> an error occured >_<`;
        }
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="terminal.close"){
        closeTerminal();
    }
    else if(tercode.substring(0,4)=="spam"){
        document.querySelector(".pre_text").innerHTML="";
        spamcode = tercode;
        spamcode = spamcode.replace("spam","");
        var bdtr = document.querySelector(".terminal_body");
        var spamc = 0;
        if(spamcode[0]=="(" && spamcode[spamcode.length-1]==")"){
            spamcode = spamcode.split("");
            spamcode.pop();
            spamcode.shift();
            spamcode = spamcode.join("");
            spamcode = spamcode.split(",")
            if(spamcode.length < 2 || spamcode.length > 2){
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>syntax error<br/>syntax: spamm({message},{number of times})`;
                document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
                setTimeout(() => {
                    document.querySelector('.tertype').focus()
                }, 50);
                return;
            }
            else{
                var spamtimes = spamcode[1];
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>starting!`;
                spam()
                function spam(){
                    spamc++;
                    var spammes = spamcode[0];
                    spammes = spammes.replaceAll("$times$",spamc)
                    spammes = spammes.replaceAll("$comma$",",")
                    for(i=0;i<terminalvars.length;i++){
                        spammes=spammes.replaceAll(terminalvars[i].varname,terminalvars[i].varvalue)
                    }
                    bodyter.innerHTML+=`<br/>${spammes}`;
                    if(spamtimes>1){
                        spamtimes--;
                        bdtr.scrollTo(0,bdtr.scrollHeight)
                        setTimeout(spam,100)
                    }
                    else{
                        bodyter.innerHTML+=`<br/>completed :)`;
                        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
                        setTimeout(() => {
                            document.querySelector('.tertype').focus()
                        }, 50);
                        return;
                    }
                }
            }
        }
        else{
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>syntax error<br/>syntax: spamm({message},{number of times})`;
            document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
            setTimeout(() => {
                document.querySelector('.tertype').focus()
            }, 50);
            return;
        }
    }
    else if(tercode=="shutdown()"){
        shutdown();
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>shutting down device!`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode.substring(0,5)=="timer"){
        document.querySelector(".pre_text").innerHTML="";
        if(tercode.lastIndexOf(")") == tercode.length-1){
            var time = tercode.replace("timer(","")
            time = time.split("")
            time.pop();
            time = time.join("");
            time = parseInt(time)
            if(Number.isInteger(time)){
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>starting timer`;
                timest(time)
                function timest(val){
                    var bdtr = document.querySelector(".terminal_body");
                    if(val==0){
                        bodyter.innerHTML+=`<br/>Timer ended!`;
                        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
                        setTimeout(() => {
                            document.querySelector('.tertype').focus()
                            bdtr.scrollTo(0,bdtr.scrollHeight+50)
                        }, 50);
                    }
                    else{
                        bodyter.innerHTML+=`<br/>${val}`;
                        val--;
                        setTimeout(() => {
                            bdtr.scrollTo(0,bdtr.scrollHeight)
                            timest(val);
                        }, 1000);
                    }
                }
            }
            else{
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>invalid`;
                document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
            }
        }
        else{
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>Syntax error!`;
            document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
        }
    }
    else if(tercode.substring(0,7)=="gallery"){
        tercode = tercode.replace("gallery","")
        if(galleryopened){
            if(tercode.toLowerCase()=="/ucanvas"){
                image_folder_show();
                maximizegallery()
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>`;
            }
            else if(tercode.toLowerCase()=="/trash"){
                trash_folder_show();
                maximizegallery()
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>`;
            }
            else if(tercode.toLowerCase()=="/close"){
                closegallery();
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>gallery closed`;
            }
            else if(tercode.toLowerCase()=="/trash.clear"){
                cleartrash();
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>command exited :)`;
            }
            else if(tercode.toLowerCase()=="/ucanvas.clear"){
                clearGallery();
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$- ${tercode}<br/>command exited :)`;
            }
        }
        else{
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>gallery is not opened <br/>type "gallery()" for opening gallery`;
            document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
            setTimeout(() => {
                document.querySelector('.tertype').focus()
            }, 50);
        }
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="new"){
        document.querySelector(".terminal_body").innerHTML=`        <div class="terzone">
        Pineapple OS Terminal version 1.0.0.25<br/>
        Type "help()" for all commands. type "info?" for more information <br>
    </div><br/>
            <div class="typing_area">
            <span class="pre_text">
                <br/><br/>root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span>
            </span>
        </div>`;
        document.querySelector(".pre_text").innerHTML=`<br/>root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }

    else if(tercode=="destroy()"){
        Confirm.open({
            title:"Are You Sure?",
            message:"This function may harm your device!",
            okText:"Continue",
            cancelText:"I'm Not sure",
            onOk:()=>{
                setTimeout(() => {
                    for(i=0;i<Infinity;i++){
                        Alert("Destroying")
                    }
                }, 1500);
            },
            onCancel:()=>{Alert("Exited Code")}
        });
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>Code Exited`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="help()"){
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/><br/>
        shout - to print something<br/>
        syntax: shout \{something\}<br/><br/>
        cls - to clear terminal<br/>
        new - to start new terminal
        <br/>
        calc() - to do mathematical operation<br/>
        syntax: calc({mathematical expression})<br/>
        timer() - for starting timer<br/>
        time.today - to get todays date<br/>
        time.now - to get current time<br/>
        timer() - to start timer.<br/>
        syntax: timer({seconds]})<br/><br/>
        <br/>
        <u>Handling files</u><br/>
        gallery/{file name} - to open file<br/>
        gallery/{file name}.clear - clear all files in that folder<br/><br/><br/>
        info? - for more information.
        `;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode.substring(0,5)=="time."){
        tercode=tercode.replace("time.","");
        var fundate = new Date();
        if(tercode=="today"){
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-time.today<br/>${fundate.getDate()}-${fundate.getMonth()-1}-${fundate.getFullYear()}`;
        }
        else if(tercode=="now"){
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-time.now<br/>${fundate.getHours()}:${fundate.getMinutes()}:${fundate.getSeconds()}`;
        }
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="close()"){
        closeTerminal();
    }
        else if(tercode==""){
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-`;
            document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
            setTimeout(() => {
                document.querySelector('.tertype').focus()
            }, 50);
        }
    else if(tercode.substring(0,7)=="canvas/"){
        if(canvasopened){
            var canvascode = tercode.replace("canvas/","");
            if(canvascode=="close"){
                closewindow();
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>canvas closed!`;
            }
            else if(canvascode=="open"){
                topBeforeMinimized=5;
                leftBeforeMinimized=5;
                maximizeWindow();
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>canvas opened!`;
            }
            else if(canvascode=="clear"){
                ClearCanvassys();
            }
            else if(canvascode.substring(0,8)=="pencolor"){
                canvascode = canvascode.replace("pencolor","");
                //(color)
                if(canvascode[0]=="(" && canvascode[canvascode.length-1]==")"){
                    canvascode = canvascode.split("")
                    canvascode.pop();
                    canvascode.shift();
                    canvascode = canvascode.join("");
                    color = canvascode;
                    mode="pen";
                    bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>pen color changed!`;
                }
                else{
                    bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>syntax error!<br/> syntax : pencolor({color})`;
                }
            }
            else if(canvascode.substring(0,8)=="drawRect"){
                var messcanrect=toDrawRect(canvascode);
                if(messcanrect==true){
                    bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>drawing completed!`;
                }
                else{
                    bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>${messcanrect}`;
                }
            }
            else if(canvascode.substring(0,10)=="strokeRect"){
                var messcanrect=toStrokeRect(canvascode);
                if(messcanrect==true){
                    bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>drawing completed!`;
                }
                else{
                    bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>${messcanrect}`;
                }
            }
            else if(canvascode=="toGallery"){
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>added to gallery :)`;
                addToGallery();
            }
            else{
                bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>"${tercode}" is not a command`;
            }
            document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
            setTimeout(() => {
                document.querySelector('.tertype').focus()
            }, 50);
        }
        else{
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>canvas is not opened <br/>type "canvas()" for opening canvas`;
            document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
            setTimeout(() => {
                document.querySelector('.tertype').focus()
            }, 50);
        }
    }
    else if(tercode=="canvas()"){
        maximizeWindow();
        minimizeWindow();
        writing=true;
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>canvas opened!`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode=="info?"){
        var agedt = new Date();
        var ageyear =  agedt.getFullYear();
        var age = (ageyear-2005);
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>Name:Pineapple OS<br/>Version:1.0.0.75<br/>developer:Mohammed Nihal<br/><a class="ui-link" href="mailto:mnaaksd2@gmail.com">contact developer</a>`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else if(tercode.substring(0,5)=="color"){
        var tercolchange = setcolortermial(tercode.replace("color",""))
        if(tercolchange==true){
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>"`;
        }
        else{
            bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>"${tercolchange}`;
        }
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
    else{
        bodyter.innerHTML+=`<br/><br/>root:/user/common/$-${tercode}<br/>"${tercode}" is not an command`;
        document.querySelector(".pre_text").innerHTML=`root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span><br/>`;
        setTimeout(() => {
            document.querySelector('.tertype').focus()
        }, 50);
    }
}










function minimizeTerminal(){
    var elem = document.querySelector(".terminal_container");
    var icon = document.querySelector(".appicon3");
    topBeforeMinimizedter=elem.style.top.replace("px","");
    leftBeforeMinimizedter=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform='scale(0)';
    elem.style.left=`100%`;
    terminalsavedheight=elem.style.height.replace("px","");
    terminalsavedwidth=elem.style.width.replace("px","");
    icon.style.transform="scale(1)";
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    terminalmax=false;
    writing=false;
}
function closeTerminal(){
    var elem = document.querySelector(".terminal_container");
    var icon = document.querySelector(".appicon3");
    topBeforeMinimizedter=5;
    leftBeforeMinimizedter=5;
    elem.style.transition="0.5s";
    elem.style.transform='scale(0)';
    elem.style.left=`100%`;
    icon.style.animationName="exit--ic";
    icon.addEventListener("animationend",()=>{
        icon.remove();
    })
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    terminalmax=false;
    terminalopened=false;
    writing=false;
    clearterminal();
    
}
function maximizeTerminal(){
    winfocus="terinal";
    if(!terminalopened){
        document.querySelector(".recapplist").innerHTML+=`<div onclick="terminaltask()" class="appicon3"></div>`;
        document.querySelector(".terminal_body").innerHTML=`        <div class="terzone">
        Pineapple OS Terminal version 1.0.0.25<br/>
        Type "help()" for all commands. type "info?" for more information <br>
    </div><br/>
    <div class="typing_area">
        <span class="pre_text">
            <br/>root:/user/common/$- <span class="tertype" spellcheck="false" autocomplete="off" autofocus="true" onkeydown="checkkeyter(event,this)" contenteditable="true"></span>
        </span>
    </div>`;
        terminalopened=true;
    }

    writing=true;
    var elem = document.querySelector(".terminal_container");
    elem.style.transition="0.5s";
    var icon = document.querySelector(".appicon3");
    elem.style.transform='scale(1)';
    elem.style.height=terminalsavedheight+"px";
    elem.style.width=terminalsavedwidth+"px";
    elem.style.left=leftBeforeMinimizedter+"px";
    elem.style.top=topBeforeMinimizedter+"px";
    icon.style.transform="scale(1)";
    document.querySelector(".container").style.zIndex=2;
    document.querySelector(".gallery_container").style.zIndex=0;
    elem.ontransitionend = function(){
        elem.style.transition="none";
        winfocus="terminal";
    }
    terminalmax=true;
    document.querySelector(".container").style.zIndex=0;
    document.querySelector(".gallery_container").style.zIndex=0;
    document.querySelector(".terminal_container").style.zIndex=2;
}
function terminaltask(){
    if(terminalmax){
        minimizeTerminal();
    }else{
        maximizeTerminal();
    }
}





maximizeWindow();
maximizegallery();
maximizeTerminal();
closewindow();
closegallery();
closeTerminal();




function clearterminal(){
    terminalvars=[];
    new crvar("%random%",Math.round(Math.random()*1000)+1000)
}

function toDrawRect(code){
    //drawRect(0,0,50,50,red)
    code = code.replace("drawRect(","");
    code = code.split("")
    if(code[code.length-1]==")"){
        code.pop();
        code = code.join("");
        code = code.split(",");
        if(code.length<5){
            return "syntax:drawRect(startX,startY,width,height,fillColor)";
        }
        else{
            try{
                for(i=0;i<code.length;i++){
                    code[i] = code[i].replaceAll("ch",canvas.height);
                    code[i] = code[i].replaceAll("cw",canvas.width);
                if(i!=4){
                    code[i] = parseInt(eval(code[i]))
                }
                }
                ctx.fillStyle=code[4];
                ctx.fillRect(code[0],code[1],code[2],code[3]);
                undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
                undo_index++;
                return true;
            }
            catch(err){
                return err;
            }
        }
    }
    else{
        mess="Syntax error!";
        return mess;
    }
}
function toStrokeRect(code){
    //drawRect(0,0,50,50,red)
    code = code.replace("strokeRect(","");
    code = code.split("")
    if(code[code.length-1]==")"){
        code.pop();
        code = code.join("");
        code = code.split(",");
        if(code.length<6){
            return "syntax:strokeRect(startX,startY,width,height,fillColor,stokeWidth)";
        }
        else{
            try{
                for(i=0;i<code.length;i++){
                    code[i] = code[i].replaceAll("ch",canvas.height);
                    code[i] = code[i].replaceAll("cw",canvas.width);
                    if(i!=4){
                        code[i] = parseInt(eval(code[i]))
                    }
                }
                ctx.strokeStyle=code[4];
                ctx.lineWidth=code[5];
                ctx.strokeRect(code[0],code[1],code[2],code[3]);
                undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
                undo_index++;
                return true;
            }
            catch(err){
                return err;
            }
        }
    }
    else{
        mess="Syntax error!";
        return mess;
    }
}

function toolpaneltask(){
    if(toolpanelopen){
        hidetoolpanel();
    }
    else{
        showtoolpanel();
    }
}

function hidetoolpanel(){
    if(palopened)closepalette();
    if(eraseropen)eraserclose();
    var panel = document.querySelector(".tools_panel");
    panel.style.left="-100px";
    toolpanelopen=false;
}
function showtoolpanel(){
    var panel = document.querySelector(".tools_panel");
    panel.style.left="10px";
    toolpanelopen=true;
}


function setcolortermial(colorcode){
    parseInt(colorcode)
    var colorcodeex = 0;
    console.log(colorcode)
    switch(colorcode){
        case 0:
            colorcodeex="#00ff00";//green
            break;
        case 1:
            colorcodeex="#ff0000";//red
            break;
        case 2:
            colorcodeex="#0000ff";//blue
            break;
        case 3:
            colorcodeex="#00ff97";//aqua
            break;
        case 4:
            colorcodeex="##7f00ff";//purple
            break;
        case 5:
            colorcodeex="#ffffff";//white
            break;
        case 6:
            colorcodeex="#c800ff";//pink
            break;
        case 7:
            colorcodeex="#ff7500";//orange
            break;
        case 8:
            colorcodeex="#ffeb00";//yellow
            break;
        case 9:
            colorcodeex="#858585";//grey
            break;
        default:
            colorcodeex="err";
            break;
    }
    if(colorcodeex!="err"){
        var d = document.querySelector(":root")
        d.style.setProperty("--terminal-theme-color","#0000ff")
        return true;
    }
    else{
        return `color code error!<br/><u>Color codes</u><br/>
        0-green<br/>
        1-green<br/>
        2-green<br/>
        3-green<br/>
        4-green<br/>
        5-green<br/>
        6-green<br/>
        7-green<br/>
        8-green<br/>
        9-green<br/>
        syntax: color {code}
        `;
    }
}


function daymode(){
    var d = document.querySelector(":root")
    d.style.setProperty("--theme-active-color","#f1f1f1")
    d.style.setProperty("--theme-color","#ffffff")
    d.style.setProperty("--theme-white","#000000")
}

function nightmode(){
    var d = document.querySelector(":root")
    d.style.setProperty("--theme-active-color","#4a4a4a")
    d.style.setProperty("--theme-color","#0b0c15")
    d.style.setProperty("--theme-white","#ffffff")
}

