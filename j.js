let inpone=document.querySelector(".inp1");
let inptwo=document.querySelector(".inp2");
let area=document.querySelector(".textarea");
let submit=document.querySelector(".submit");
let url;
submit.addEventListener("click",function(dets){
    dets.preventDefault();
    url=`https://api.github.com/repos/${inpone.value.trim()}/${inptwo.value.trim()}/readme`;
    fetch(url)
    .then(response=>response.json())
    .then(data=>{
        const decodedContent = atob(data.content)
        area.innerHTML=JSON.stringify(decodedContent.replace(/\n/g,"</br>"  ));
    })
    .catch(err=>area.innerHTML=err);
});
