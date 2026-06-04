async function sendMQTT(topic, message)
{
  try
  {
    const response = await fetch('/api/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: topic,
        message: message
      })
    });

    const data = await response.json();

    console.log(data);
  }
  catch(error)
  {
    console.error(error);
  }
}    

const tg = window.Telegram.WebApp;

tg.expand();

console.log("Telegram User:");

console.log(tg.initDataUnsafe.user);
async function sendCommand(command){

try{


const response = await fetch('/api/sendcommand',{

  method:'POST',

  headers:{
    'Content-Type':'application/json'
  },

  body:JSON.stringify({
    command:command
  })

});

const data = await response.json();

console.log(data);


}
catch(error){


console.error(error);


}

}

const picker1 = new iro.ColorPicker("#picker1",{

width:220,

color:"#ff0000"

});

const picker2 = new iro.ColorPicker("#picker2",{

width:220,

color:"#00ff00"

});

picker1.on("color:change",function(color){
   sendMQTT(
    "home/rgb1",
    color.hexString.replace("#","")
  );

});


picker2.on("color:change", function(color){

  sendMQTT(
    "home/rgb2",
    color.hexString.replace("#","")
  );

});

document.getElementById("led1").addEventListener("change",function(){

if(this.checked){


sendMQTT("home/led1","ON");


}else{


sendMQTT("home/led1","OFF");


}

});

document.getElementById("led2").addEventListener("change",function(){

if(this.checked){


sendMQTT("home/led2","ON");


}else{


sendMQTT("home/led2","OFF");


}

});

document.getElementById("led3").addEventListener("change",function(){

if(this.checked){


sendMQTT("home/led3","ON");


}else{


sendMQTT("home/led3","OFF");


}

});

document.getElementById("led4").addEventListener("change",function(){

if(this.checked){


sendMQTT("home/led4","ON");

}else{


sendMQTT("home/led4","OFF");

}

});

document.getElementById("led5").addEventListener("change",function(){

if(this.checked){


sendMQTT("home/led5","ON");

}else{


sendMQTT("home/led1","OFF");

}

});

document.getElementById("allOn").addEventListener("click",()=>{

document
.querySelectorAll('input[type="checkbox"]')
.forEach(t=>t.checked=true);

sendCommand("allledson");

});

document.getElementById("allOff").addEventListener("click",()=>{

document
.querySelectorAll('input[type="checkbox"]')
.forEach(t=>t.checked=false);

sendCommand("allledsoff");

});
