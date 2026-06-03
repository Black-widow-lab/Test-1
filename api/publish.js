import mqtt from 'mqtt';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  const { topic, message } = req.body;

  const client = mqtt.connect({
    host: process.env.MQTT_HOST,
    port: 8883,
    protocol: 'mqtts',
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD
  });

  client.on('connect', () => {

    client.publish(topic, message, {}, (err) => {

      client.end();

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status(200).json({
        success: true
      });

    });

  });

  client.on('error', (err) => {

    client.end();

    return res.status(500).json({
      success: false,
      error: err.message
    });

  });

}
