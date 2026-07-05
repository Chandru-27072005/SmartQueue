const queueList=document.getElementById("queueList");
const emptyState=document.getElementById("emptyState");

const totalBookings=document.getElementById("totalBookings");
const waitingCount=document.getElementById("waitingCount");
const completedCount=document.getElementById("completedCount");
const averageWait=document.getElementById("averageWait");

const currentToken=document.getElementById("currentToken");
const crowdLevel=document.getElementById("crowdLevel");

const API_URL="http://localhost:3000/api/bookings";

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

function getCrowdLevel(waiting){

    if(waiting<=3){

        return{
            text:"Low Crowd",
            className:"low"
        };

    }

    if(waiting<=7){

        return{
            text:"Medium Crowd",
            className:"medium"
        };

    }

    return{

        text:"High Crowd",

        className:"high"

    };

}

async function renderQueue(){

    const bookings=await getBookings();

    queueList.innerHTML="";

    if(bookings.length===0){

        emptyState.classList.remove("hidden");

        totalBookings.textContent="0";
        waitingCount.textContent="0";
        completedCount.textContent="0";
        averageWait.textContent="0 mins";

        currentToken.textContent="--";

        crowdLevel.textContent="Low Crowd";
        crowdLevel.className="crowd-badge low";

        return;

    }

    emptyState.classList.add("hidden");

    const waitingBookings=bookings.filter(
        item=>item.status==="Waiting"
    );

    const servingBookings=bookings.filter(
        item=>item.status==="Serving"
    );

    const completedBookings=bookings.filter(
        item=>item.status==="Completed"
    );

    totalBookings.textContent=bookings.length;

    waitingCount.textContent=waitingBookings.length;

    completedCount.textContent=completedBookings.length;

    averageWait.textContent=
    `${(waitingBookings.length+servingBookings.length)*10} mins`;

    if(servingBookings.length>0){

        currentToken.textContent=servingBookings[0].token;

    }else if(waitingBookings.length>0){

        currentToken.textContent=waitingBookings[0].token;

    }else{

        currentToken.textContent="--";

    }

    const crowd=getCrowdLevel(
        waitingBookings.length+servingBookings.length
    );

    crowdLevel.textContent=crowd.text;

    crowdLevel.className=`crowd-badge ${crowd.className}`;

    bookings.forEach(booking=>{

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

            position=
            waitingBookings.findIndex(
                item=>item._id===booking._id
            )+1;

            waitTime=`${position*10} mins`;

        }

        const queueItem=document.createElement("div");

        queueItem.className="queue-item";

        queueItem.innerHTML=`
        <div class="queue-top">

    <div>

        <h3 class="queue-token">${booking.token}</h3>

        <p class="queue-name">${booking.name}</p>

    </div>

    <span class="status-badge ${statusClass}">
        ${status}
    </span>

</div>

<div class="queue-details">

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

`;

        queueList.appendChild(queueItem);

    });

}

renderQueue();

setInterval(renderQueue,5000);