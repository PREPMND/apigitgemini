let inpone=document.querySelector(".inp1");
let inptwo=document.querySelector(".inp2");
let area=document.querySelector(".textarea");
let submit=document.querySelector(".submit");
let na_me=document.querySelector(".name");
let img=document.querySelector(".navq img");
let url;
let urlq;
submit.addEventListener("click",function(dets){
    dets.preventDefault();
    url=`https://api.github.com/repos/${inpone.value.trim()}/${inptwo.value.trim()}/readme`;
    
    fetch(url)
    .then(response=>response.json())
    .then(data=>{
        const decodedContent = atob(data.content)
        const suitableContent=marked.parse(decodedContent);
        area.innerHTML=JSON.stringify(suitableContent.replace(/\n/g,"</br>").replace(/"""/g," "));
    })
    .catch(err=>area.innerHTML=err);
    urlq = `https://api.github.com/users/${inpone.value.trim()}`;
    fetch(urlq)
    .then(response=>response.json())
    .then(data=>{
        na_me.innerHTML = JSON.stringify(data.name);
        img.classList.add("img")
        img.setAttribute("src",data.avatar_url) 
    })
    .catch(error => {
        na_me.innerHTML = "INVALID USERNAME-OR SOMEISSUES";
  });
});
