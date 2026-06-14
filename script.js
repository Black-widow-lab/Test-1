const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
}

const controls = [
  { id: "light1", type: "light" },
  { id: "light2", type: "light" },
  { id: "light3", type: "light" },
  { id: "light4", type: "light" },
  { id: "fan1", type: "fan" },
  { id: "fan2", type: "fan" },
  { id: "fan3", type: "fan" },
  { id: "fan4", type: "fan" }
];

const fanTimers = {};

function updateDeviceCounter() {

  const active = controls.filter(device => {
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

    card.classList.remove("fan-stopping");
    card.classList.add("fan-start");

    fanTimers[id] = setTimeout(() => {

      card.classList.remove("fan-start");
      card.classList.add("fan-running");

      delete fanTimers[id];

    }, 2000);

  } else {

    card.classList.remove("fan-start");
    card.classList.remove("fan-running");

    card.classList.add("fan-stopping");

    fanTimers[id] = setTimeout(() => {

      card.classList.remove("fan-stopping");

      delete fanTimers[id];

    }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  controls.forEach(device => {

    const checkbox = document.getElementById(device.id);

    if (!checkbox) {
      console.warn("Missing checkbox:", device.id);
      return;
    }

    checkbox.addEventListener("change", () => {

      const state = checkbox.checked;

      console.log(
        `${device.id} -> ${state ? "ON" : "OFF"}`
      );

      updateCardVisuals(
        device.id,
        state
      );

      updateDeviceCounter();
    });
  });

  const allOn = document.getElementById("allOn");

  if (allOn) {

    allOn.addEventListener("click", () => {

      controls.forEach(device => {

        const cb = document.getElementById(device.id);

        if (!cb) return;

        cb.checked = true;

        updateCardVisuals(
          device.id,
          true
        );
      });

      updateDeviceCounter();

      console.log("ALL ON");
    });
  }

  const allOff = document.getElementById("allOff");

  if (allOff) {

    allOff.addEventListener("click", () => {

      controls.forEach(device => {

        const cb = document.getElementById(device.id);

        if (!cb) return;

        cb.checked = false;

        updateCardVisuals(
          device.id,
          false
        );
      });

      updateDeviceCounter();

      console.log("ALL OFF");
    });
  }

  updateDeviceCounter();

  console.log("Fan Animation Ready");
});
