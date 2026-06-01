const picker1 = new iro.ColorPicker("#picker1",{

width:220,

color:"#ff0000"

});

const picker2 = new iro.ColorPicker("#picker2",{

width:220,

color:"#00ff00"

});

picker1.on("color:change",function(color){

console.log(
"RGB1:",
color.hexString
);

});

picker2.on("color:change",function(color){

console.log(
"RGB2:",
color.hexString
);

});

document
.querySelectorAll("input")
.forEach(toggle=>{

toggle.addEventListener(
"change",
()=>{

console.log(
toggle.id,
toggle.checked
?
"ON"
:
"OFF"
);

});

});

document
.getElementById("allOn")
.addEventListener(
"click",
()=>{

document
.querySelectorAll(
'input[type="checkbox"]'
)
.forEach(
t=>t.checked=true
);

});

document
.getElementById("allOff")
.addEventListener(
"click",
()=>{

document
.querySelectorAll(
'input[type="checkbox"]'
)
.forEach(
t=>t.checked=false
);

});