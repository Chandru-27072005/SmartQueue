const reportTotal=document.getElementById("reportTotal");
const reportWaiting=document.getElementById("reportWaiting");
const reportServing=document.getElementById("reportServing");
const reportCompleted=document.getElementById("reportCompleted");
const reportSkipped=document.getElementById("reportSkipped");
const reportCrowd=document.getElementById("reportCrowd");
const serviceReportList=document.getElementById("serviceReportList");
const recentBookingsList=document.getElementById("recentBookingsList");

function getBookings(){
  return JSON.parse(localStorage.getItem("smartQueueBookings"))||[];
}

function getCrowdLabel(waitingCount){
  if(waitingCount<=3) return "Low";
  if(waitingCount<=7) return "Medium";
  return "High";
}

function renderReports(){
  const bookings=getBookings();

  const waiting=bookings.filter(item=>item.status==="Waiting").length;
  const serving=bookings.filter(item=>item.status==="Serving").length;
  const completed=bookings.filter(item=>item.status==="Completed").length;
  const skipped=bookings.filter(item=>item.status==="Skipped").length;

  reportTotal.textContent=bookings.length;
  reportWaiting.textContent=waiting;
  reportServing.textContent=serving;
  reportCompleted.textContent=completed;
  reportSkipped.textContent=skipped;
  reportCrowd.textContent=getCrowdLabel(waiting+serving);

  const serviceCounts={};

  bookings.forEach(booking=>{
    if(serviceCounts[booking.service]){
      serviceCounts[booking.service]++;
    }else{
      serviceCounts[booking.service]=1;
    }
  });

  serviceReportList.innerHTML="";
  if(bookings.length===0){
    serviceReportList.innerHTML=`<div class="service-item"><p>No service data available</p><h4>0</h4></div>`;
  }else{
    Object.keys(serviceCounts).forEach(service=>{
      const item=document.createElement("div");
      item.className="service-item";
      item.innerHTML=`
        <p>${service}</p>
        <h4>${serviceCounts[service]}</h4>
      `;
      serviceReportList.appendChild(item);
    });
  }

  recentBookingsList.innerHTML="";
  const recentBookings=bookings.slice().reverse().slice(0,5);

  if(recentBookings.length===0){
    recentBookingsList.innerHTML=`<div class="recent-item"><h4>No recent bookings</h4><p>Please create a booking first.</p></div>`;
  }else{
    recentBookings.forEach(booking=>{
      const item=document.createElement("div");
      item.className="recent-item";
      item.innerHTML=`
        <h4>${booking.tokenNumber} - ${booking.name}</h4>
        <p>${booking.service} | ${booking.date} | ${booking.status}</p>
      `;
      recentBookingsList.appendChild(item);
    });
  }
}

renderReports();