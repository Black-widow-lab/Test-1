const tg = window.Telegram.WebApp;
tg.expand();

const controls = [
  { id: "light1", topic: "home/light1" },
  { id: "light2", topic: "home/light2" },
  { id: "light3", topic: "home/light3" },
  { id: "light4", topic: "home/light4" },
  { id: "fan1", topic: "home/fan1" },
  { id: "fan2", topic: "home/fan2" },
  { id: "fan3", topic: "home/fan3" },
  { id: "fan4", topic: "home/fan4" }
];

async function sendMQTT(topic, message) {
  console.log("Publishing MQTT message:", { topic, message });

  try {
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
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json().catch(() => null);
    console.log("MQTT publish successful:", result);
    return result;
  } catch (error) {
    console.error("MQTT publish failed:", error);
    throw error;
  }
}

function setAllCheckboxes(checked) {
  controls.forEach(({ id }) => {
    const checkbox = document.getElementById(id);

    if (!checkbox) {
      console.warn(`Checkbox not found: ${id}`);
      return;
    }

    checkbox.checked = checked;
  });
}

function initializeControls() {
  controls.forEach(({ id, topic }) => {
    const checkbox = document.getElementById(id);

    if (!checkbox) {
      console.warn(`Checkbox not found: ${id}`);
      return;
    }

    checkbox.addEventListener("change", async () => {
      const message = checkbox.checked ? "ON" : "OFF";

      console.log(`${id} changed: ${message}`);

      try {
        await sendMQTT(topic, message);
      } catch (error) {
        checkbox.checked = !checkbox.checked;
        console.error(`${id} reverted due to publish error`);
      }
    });
  });
}

function initializeAllButtons() {
  const allOnButton = document.getElementById("allOn");
  const allOffButton = document.getElementById("allOff");

  if (allOnButton) {
    allOnButton.addEventListener("click", async () => {
      console.log("ALL ON clicked");

      setAllCheckboxes(true);

      try {
        await sendMQTT("home/all", "ON");
      } catch (error) {
        console.error("ALL ON publish failed:", error);
      }
    });
  } else {
    console.warn('Button not found: allOn');
  }

  if (allOffButton) {
    allOffButton.addEventListener("click", async () => {
      console.log("ALL OFF clicked");

      setAllCheckboxes(false);

      try {
        await sendMQTT("home/all", "OFF");
      } catch (error) {
        console.error("ALL OFF publish failed:", error);
      }
    });
  } else {
    console.warn('Button not found: allOff');
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Telegram Mini App initialized");

  initializeControls();
  initializeAllButtons();
});
