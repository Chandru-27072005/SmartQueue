const exportBtn=document.getElementById("exportBtn");
const searchInput=document.getElementById("searchInput");
const statusFilter=document.getElementById("statusFilter");

const adminBookingList=document.getElementById("adminBookingList");
const adminEmptyState=document.getElementById("adminEmptyState");

const adminTotalBookings=document.getElementById("adminTotalBookings");
const adminWaitingCount=document.getElementById("adminWaitingCount");
const adminServingToken=document.getElementById("adminServingToken");
const adminCompletedCount=document.getElementById("adminCompletedCount");

const nextTokenBtn=document.getElementById("nextTokenBtn");
const logoutBtn=document.getElementById("logoutBtn");
const resetDataBtn=document.getElementById("resetDataBtn");

const API_URL="http://smartqueue-uiy3.onrender.com/api/bookings";

async function getBookings(){

    try{

        const response=await fetch(API_URL);
        const result=await response.json();

        if(result.success){

            return result.data.sort(
                (a,b)=>new Date(a.createdAt)-new Date(b.createdAt)
            );

        }

        return [];

    }catch(error){

        console.log(error);
        return [];

    }

}

async function updateStatus(id,status){

    try{

        const response=await fetch(`${API_URL}/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                status
            })

        });

        const result=await response.json();

        if(result.success){

            renderAdminDashboard();

        }

    }catch(error){

        console.log(error);

    }

}

async function deleteBooking(id){

    if(!confirm("Delete this booking?")){
        return;
    }

    try{

        const response=await fetch(`${API_URL}/${id}`,{

            method:"DELETE"

        });

        const result=await response.json();

        if(result.success){

            renderAdminDashboard();

        }

    }catch(error){

        console.log(error);

    }

}
async function renderAdminDashboard(){

    const bookings=await getBookings();

    let filteredBookings=[...bookings];

    if(searchInput){

        const search=searchInput.value.toLowerCase().trim();

        if(search){

            filteredBookings=filteredBookings.filter(item=>

                item.token.toLowerCase().includes(search) ||

                item.name.toLowerCase().includes(search) ||

                item.phone.includes(search)

            );

        }

    }

    if(statusFilter){

        const status=statusFilter.value;

        if(status!=="All"){

            filteredBookings=filteredBookings.filter(
                item=>item.status===status
            );

        }

    }

    adminBookingList.innerHTML="";

    if(bookings.length===0){

        adminEmptyState.classList.remove("hidden");

        adminTotalBookings.textContent="0";
        adminWaitingCount.textContent="0";
        adminServingToken.textContent="--";
        adminCompletedCount.textContent="0";

        return;

    }

    adminEmptyState.classList.add("hidden");

    const waitingBookings=bookings.filter(
        item=>item.status==="Waiting"
    );

    const servingBookings=bookings.filter(
        item=>item.status==="Serving"
    );

    const completedBookings=bookings.filter(
        item=>item.status==="Completed"
    );

    renderChart(waitingBookings,servingBookings,completedBookings);

    adminTotalBookings.textContent=bookings.length;
    adminWaitingCount.textContent=waitingBookings.length;
    adminCompletedCount.textContent=completedBookings.length;

    adminServingToken.textContent=
    servingBookings.length>0
    ? servingBookings[0].token
    : "--";

    filteredBookings.forEach(booking=>{

        const status=booking.status||"Waiting";

        let statusClass="status-waiting";

        if(status==="Serving"){
            statusClass="status-serving";
        }

        if(status==="Completed"){
            statusClass="status-completed";
        }

        let position="-";
        let waitTime="--";

        if(status==="Serving"){

            position="Now";
            waitTime="0 mins";

        }

        if(status==="Waiting"){

            position=waitingBookings.findIndex(
                item=>item._id===booking._id
            )+1;

            waitTime=`${position*10} mins`;

        }

        const card=document.createElement("div");

        card.className="admin-booking-card";

        card.innerHTML=`
        <div class="booking-card-top">

    <div>

        <h3 class="booking-token">${booking.token}</h3>

        <p class="booking-name">${booking.name}</p>

    </div>

    <span class="status-badge ${statusClass}">
        ${status}
    </span>

</div>

<div class="booking-details">

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
        <p>Queue Position</p>
        <h4>${position}</h4>
    </div>

    <div class="detail-box">
        <p>Estimated Wait</p>
        <h4>${waitTime}</h4>
    </div>

</div>

<div class="booking-actions">

    <button class="small-btn serve-btn"
        onclick="updateStatus('${booking._id}','Serving')">
        Start
    </button>

    <button class="small-btn complete-btn"
        onclick="updateStatus('${booking._id}','Completed')">
        Complete
    </button>

    <button class="small-btn skip-btn"
        onclick="deleteBooking('${booking._id}')">
        Delete
    </button>

</div>

`;

        adminBookingList.appendChild(card);

    });

}
async function callNextToken(){

    const bookings=await getBookings();

    const serving=bookings.find(item=>item.status==="Serving");

    if(serving){

        await updateStatus(serving._id,"Completed");

    }

    const latestBookings=await getBookings();

    const waiting=latestBookings.find(item=>item.status==="Waiting");

    if(waiting){

        await updateStatus(waiting._id,"Serving");

    }

    renderAdminDashboard();

}

if(nextTokenBtn){

    nextTokenBtn.addEventListener("click",callNextToken);

}

if(logoutBtn){

    logoutBtn.addEventListener("click",()=>{

        localStorage.removeItem("smartQueueAdminLoggedIn");

        window.location.href="admin-login.html";

    });

}

if(searchInput){

    searchInput.addEventListener("input",renderAdminDashboard);

}

if(statusFilter){

    statusFilter.addEventListener("change",renderAdminDashboard);

}

if(resetDataBtn){

    resetDataBtn.addEventListener("click",()=>{

        alert("Reset Data feature can be connected to backend later.");

    });

}

renderAdminDashboard();

setInterval(renderAdminDashboard,5000);
if(exportBtn){

    exportBtn.addEventListener("click",()=>{

        window.open(
            "http://smartqueue-uiy3.onrender.com/api/bookings/export",
            "_blank"
        );

    });

}
let queueChart;

function renderChart(waiting,serving,completed){

    const ctx=document.getElementById("queueChart");

    if(!ctx) return;

    if(queueChart){
        queueChart.destroy();
    }

    queueChart=new Chart(ctx,{

        type:"bar",

        data:{

            labels:["Waiting","Serving","Completed"],

            datasets:[{

                label:"Bookings",

                data:[
                    waiting.length,
                    serving.length,
                    completed.length
                ],

                backgroundColor:[
                    "#f59e0b",
                    "#3b82f6",
                    "#22c55e"
                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

}
