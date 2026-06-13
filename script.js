const tg = window.Telegram.WebApp;
tg.expand();

const relayTopics = [
  "home/relay1",
  "home/relay2",
  "home/relay3",
  "home/relay4",
  "home/relay5",
  "home/relay6",
  "home/relay7",
  "home/relay8"
];

const relayIds = [
  "relay1",
  "relay2",
  "relay3",
  "relay4",
  "relay5",
  "relay6",
  "relay7",
  "relay8"
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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log("MQTT message published successfully:", { topic, message });
  } catch (error) {
    console.error("MQTT publish failed:", error);
  }
}

function getRelayToggle(relayId) {
  return document.getElementById(relayId);
}

function setRelayToggle(relayId, checked) {
  const toggle = getRelayToggle(relayId);

  if (!toggle) {
    console.warn(`Relay toggle not found: ${relayId}`);
    return;
  }

  toggle.checked = checked;
}

function setupRelayToggles() {
  relayIds.forEach((relayId, index) => {
    const toggle = getRelayToggle(relayId);

    if (!toggle) {
      console.warn(`Relay toggle not found: ${relayId}`);
      return;
    }

    toggle.addEventListener("change", () => {
      const topic = relayTopics[index];
      const message = toggle.checked ? "ON" : "OFF";

      console.log(`${relayId} changed: ${message}`);
      sendMQTT(topic, message);
    });
  });
}

function setupAllButtons() {
  const allOnButton = document.getElementById("allOn");
  const allOffButton = document.getElementById("allOff");

  if (allOnButton) {
    allOnButton.addEventListener("click", () => {
      console.log("ALL ON clicked");

      relayIds.forEach((relayId) => {
        setRelayToggle(relayId, true);
      });

      sendMQTT("home/all", "ON");
    });
  } else {
    console.warn("Button not found: allOn");
  }

  if (allOffButton) {
    allOffButton.addEventListener("click", () => {
      console.log("ALL OFF clicked");

      relayIds.forEach((relayId) => {
        setRelayToggle(relayId, false);
      });

      sendMQTT("home/all", "OFF");
    });
  } else {
    console.warn("Button not found: allOff");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Telegram Mini App initialized");

  setupRelayToggles();
  setupAllButtons();
});
