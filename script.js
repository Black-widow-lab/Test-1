const tg = window.Telegram?.WebApp;

if (tg) {
tg.expand();
}

const devices = [
{ id: "light1", type: "light", topic: "home/light1" },
{ id: "light2", type: "light", topic: "home/light2" },
{ id: "light3", type: "light", topic: "home/light3" },
{ id: "light4", type: "light", topic: "home/light4" },
{ id: "fan1", type: "fan", topic: "home/fan1" },
{ id: "fan2", type: "fan", topic: "home/fan2" },
{ id: "fan3", type: "fan", topic: "home/fan3" },
{ id: "fan4", type: "fan", topic: "home/fan4" }
];

const fanTimers = {};

async function sendMQTT(topic, message) {

const response = await fetch("/api/publish", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
topic,
message
})
});

if (!response.ok) {
throw new Error(`MQTT publish failed: ${response.status}`);
}

return response.json().catch(() => null);
}

function updateDeviceCounter() {

const active = devices.filter(device => {
const el = document.getElementById(device.id);
return el && el.checked;
}).length;

const counter = document.getElementById("activeCount");

if (counter) {
counter.textContent = `${active} / 8`;
}
}

function stopFanTimer(id) {

if (fanTimers[id]) {
clearTimeout(fanTimers[id]);
delete fanTimers[id];
}
}

function updateCardVisuals(id, state) {

const checkbox = document.getElementById(id);

if (!checkbox) return;

const card = checkbox.closest(".device-card");

if (!card) return;

if (state) {
card.classList.add("active");
} else {
card.classList.remove("active");
}

if (!id.startsWith("fan")) {
return;
}

stopFanTimer(id);

if (state) {

```
card.classList.remove("fan-stopping");
card.classList.add("fan-start");

fanTimers[id] = setTimeout(() => {

  card.classList.remove("fan-start");
  card.classList.add("fan-running");

  delete fanTimers[id];

}, 2000);
```

} else {

```
card.classList.remove("fan-start");
card.classList.remove("fan-running");

card.classList.add("fan-stopping");

fanTimers[id] = setTimeout(() => {

  card.classList.remove("fan-stopping");

  delete fanTimers[id];

}, 2000);
```

}
}

async function handleDevice(device, checkbox) {

const state = checkbox.checked;

updateCardVisuals(device.id, state);
updateDeviceCounter();

try {

```
await sendMQTT(
  device.topic,
  state ? "ON" : "OFF"
);
```

} catch (error) {

```
console.error(error);

checkbox.checked = !state;

updateCardVisuals(
  device.id,
  !state
);

updateDeviceCounter();
```

}
}

document.addEventListener("DOMContentLoaded", () => {

devices.forEach(device => {

```
const checkbox =
  document.getElementById(device.id);

if (!checkbox) return;

checkbox.addEventListener(
  "change",
  () => handleDevice(device, checkbox)
);
```

});

document
.getElementById("allOn")
?.addEventListener("click", async () => {

```
  devices.forEach(device => {

    const cb =
      document.getElementById(device.id);

    if (!cb) return;

    cb.checked = true;

    updateCardVisuals(
      device.id,
      true
    );
  });

  updateDeviceCounter();

  try {
    await sendMQTT(
      "home/all",
      "ON"
    );
  } catch (e) {
    console.error(e);
  }
});
```

document
.getElementById("allOff")
?.addEventListener("click", async () => {

```
  devices.forEach(device => {

    const cb =
      document.getElementById(device.id);

    if (!cb) return;

    cb.checked = false;

    updateCardVisuals(
      device.id,
      false
    );
  });

  updateDeviceCounter();

  try {
    await sendMQTT(
      "home/all",
      "OFF"
    );
  } catch (e) {
    console.error(e);
  }
});
```

updateDeviceCounter();
});
