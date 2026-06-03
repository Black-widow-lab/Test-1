async function sendCommand(command){

try{

```
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
```

}
catch(error){

```
console.error(error);
```

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

console.log("RGB1:",color.hexString);

});

picker2.on("color:change",function(color){

console.log("RGB2:",color.hexString);

});

document.getElementById("led1").addEventListener("change",function(){

if(this.checked){

```
sendCommand("led1on");
```

}else{

```
sendCommand("led1off");
```

}

});

document.getElementById("led2").addEventListener("change",function(){

if(this.checked){

```
sendCommand("led2on");
```

}else{

```
sendCommand("led2off");
```

}

});

document.getElementById("led3").addEventListener("change",function(){

if(this.checked){

```
sendCommand("led3on");
```

}else{

```
sendCommand("led3off");
```

}

});

document.getElementById("led4").addEventListener("change",function(){

if(this.checked){

```
sendCommand("led4on");
```

}else{

```
sendCommand("led4off");
```

}

});

document.getElementById("led5").addEventListener("change",function(){

if(this.checked){

```
sendCommand("led5on");
```

}else{

```
sendCommand("led5off");
```

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
