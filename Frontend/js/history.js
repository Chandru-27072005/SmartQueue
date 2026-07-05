const historyList=document.getElementById("historyList");
const historyEmptyState=document.getElementById("historyEmptyState");
const searchInput=document.getElementById("searchInput");
const statusFilter=document.getElementById("statusFilter");

function getBookings(){
  return JSON.parse(localStorage.getItem("smartQueueBookings"))||[];
}

function getStatusClass(status){
  if(status==="Serving") return "status-serving";
  if(status==="Completed") return "status-completed";
  if(status==="Skipped") return "status-skipped";
  return "status-waiting";
}

function renderHistory(){
  const searchValue=searchInput.value.trim().toLowerCase();
  const selectedStatus=statusFilter.value;
  const bookings=getBookings();

  const filteredBookings=bookings.filter(booking=>{
    const matchesSearch=
      booking.name.toLowerCase().includes(searchValue) ||
      booking.phone.toLowerCase().includes(searchValue) ||
      booking.tokenNumber.toLowerCase().includes(searchValue);

    const matchesStatus=
      selectedStatus==="All" || booking.status===selectedStatus;

    return matchesSearch && matchesStatus;
  });

  historyList.innerHTML="";

  if(filteredBookings.length===0){
    historyEmptyState.classList.remove("hidden");
    return;
  }

  historyEmptyState.classList.add("hidden");

  filteredBookings.slice().reverse().forEach(booking=>{
    const card=document.createElement("div");
    card.className="history-card";
    card.innerHTML=`
      <div class="history-top">
        <div>
          <h3 class="history-token">${booking.tokenNumber}</h3>
          <p class="history-name">${booking.name}</p>
        </div>
        <span class="status-badge ${getStatusClass(booking.status)}">${booking.status}</span>
      </div>

      <div class="history-details">
        <div class="detail-box">
          <p>Phone</p>
          <h4>${booking.phone}</h4>
        </div>
        <div class="detail-box">
          <p>Service</p>
          <h4>${booking.service}</h4>
        </div>
        <div class="detail-box">
          <p>Date</p>
          <h4>${booking.date}</h4>
        </div>
        <div class="detail-box">
          <p>Slot</p>
          <h4>${booking.slot}</h4>
        </div>
        <div class="detail-box">
          <p>Booked At</p>
          <h4>${booking.bookingTime || "-"}</h4>
        </div>
      </div>
    `;
    historyList.appendChild(card);
  });
}

searchInput.addEventListener("input",renderHistory);
statusFilter.addEventListener("change",renderHistory);

renderHistory();