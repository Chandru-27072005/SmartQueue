const themeToggle=document.getElementById("themeToggle");

if(localStorage.getItem("smartQueueTheme")==="dark"){
  document.body.classList.add("dark");
  if(themeToggle){
    themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';
  }
}

if(themeToggle){
  themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
      localStorage.setItem("smartQueueTheme","dark");
      themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';
    }else{
      localStorage.setItem("smartQueueTheme","light");
      themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';
    }
  });
}
async function loadLiveQueue(){

    try{

        const response=await fetch("http://localhost:3000/api/bookings");
        const result=await response.json();

        if(!result.success) return;

        const bookings=result.data;

        const serving=bookings.find(item=>item.status==="Serving");
        const waiting=bookings.filter(item=>item.status==="Waiting");

        document.getElementById("currentToken").textContent=
            serving ? serving.token : "--";

        document.getElementById("waitingCount").textContent=
            waiting.length;

        document.getElementById("avgWait").textContent=
            `${waiting.length*10} mins`;

        document.getElementById("progressBar").style.width=
            `${Math.min(waiting.length*10,100)}%`;

    }catch(error){

        console.log(error);

    }

}

loadLiveQueue();

setInterval(loadLiveQueue,5000);