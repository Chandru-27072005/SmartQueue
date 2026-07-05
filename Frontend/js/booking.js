const bookingForm=document.getElementById("bookingForm");
const customerName=document.getElementById("customerName");
const phoneNumber=document.getElementById("phoneNumber");
const serviceType=document.getElementById("serviceType");
const bookingDate=document.getElementById("bookingDate");
const timeSlot=document.getElementById("timeSlot");
const notes=document.getElementById("notes");

const nameError=document.getElementById("nameError");
const phoneError=document.getElementById("phoneError");
const serviceError=document.getElementById("serviceError");
const dateError=document.getElementById("dateError");
const slotError=document.getElementById("slotError");

const successMessage=document.getElementById("successMessage");
const tokenCard=document.getElementById("tokenCard");

const displayTokenNumber=document.getElementById("displayTokenNumber");
const displayName=document.getElementById("displayName");
const displayPhone=document.getElementById("displayPhone");
const displayService=document.getElementById("displayService");
const displayDate=document.getElementById("displayDate");
const displaySlot=document.getElementById("displaySlot");
const displayWait=document.getElementById("displayWait");

const today=new Date().toISOString().split("T")[0];
bookingDate.min=today;

function clearErrors(){

    nameError.textContent="";
    phoneError.textContent="";
    serviceError.textContent="";
    dateError.textContent="";
    slotError.textContent="";

}

function validateForm(){

    clearErrors();

    let isValid=true;

    if(customerName.value.trim()===""){
        nameError.textContent="Please enter your name";
        isValid=false;
    }

    const phoneValue=phoneNumber.value.trim();

    if(phoneValue===""){
        phoneError.textContent="Please enter phone number";
        isValid=false;
    }
    else if(!/^[0-9]{10}$/.test(phoneValue)){
        phoneError.textContent="Phone number must be 10 digits";
        isValid=false;
    }

    if(serviceType.value===""){
        serviceError.textContent="Please select a service";
        isValid=false;
    }

    if(bookingDate.value===""){
        dateError.textContent="Please select booking date";
        isValid=false;
    }

    if(timeSlot.value===""){
        slotError.textContent="Please select a time slot";
        isValid=false;
    }

    return isValid;

}

function showTokenDetails(booking){

    successMessage.textContent=`Booking Successful! Your Token Number is ${booking.tokenNumber}`;
    successMessage.classList.remove("hidden");

    displayTokenNumber.textContent=booking.tokenNumber;
    displayName.textContent=booking.name;
    displayPhone.textContent=booking.phone;
    displayService.textContent=booking.service;
    displayDate.textContent=booking.date;
    displaySlot.textContent=booking.slot;
    displayWait.textContent=`${booking.estimatedWait} mins`;

    tokenCard.classList.remove("hidden");

    tokenCard.scrollIntoView({
        behavior:"smooth"
    });

}
bookingForm.addEventListener("submit",async function(e){

    e.preventDefault();

    if(!validateForm()){
        return;
    }

    const bookingData={

        name:customerName.value.trim(),
        phone:phoneNumber.value.trim(),
        service:serviceType.value,
        date:bookingDate.value,
        slot:timeSlot.value,
        notes:notes.value.trim()

    };

    try{

        const response=await fetch("http://localhost:3000/api/bookings",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(bookingData)

        });

        const result=await response.json();

        if(result.success){

            const booking=result.booking;

            showTokenDetails({

                tokenNumber:booking.token,
                name:booking.name,
                phone:booking.phone,
                service:booking.service,
                date:booking.date,
                slot:booking.slot,
                estimatedWait:10

            });

            bookingForm.reset();
            bookingDate.min=today;

        }else{

            alert(result.message);

        }

    }catch(error){

        console.error(error);
        alert("Cannot connect to backend");

    }

});