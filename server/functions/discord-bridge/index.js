import axios from 'axios';

const WEBHOOK_MAP = {
  alerts: process.env.DISCORD_WEBHOOK_ALERTS,
  errors: process.env.DISCORD_WEBHOOK_ERRORS,
  uptime: process.env.DISCORD_WEBHOOK_UPTIME
};

export const discordBridge = async (req, res) => {
  const channel = req.query.channel;
  const webhookUrl = WEBHOOK_MAP[channel];

  if (!webhookUrl) {
    return res.status(400).send('Invalid channel');
  }

  // Parse GCP Incident
  const incident = req.body.incident;
  
  if (!incident) {
    return res.status(200).send('No incident data');
  }

  // Format Discord Embed
  const embed = {
    title: incident.policy_name || 'Monitoring Alert',
    description: incident.summary || 'No description provided.',
    color: incident.state === 'open' ? 0xff0000 : 0x00ff00,
    fields: [{ name: "URL", value: incident.url || 'N/A' }]
  };

  try {
    await axios.post(webhookUrl, { embeds: [embed] });
    res.status(200).send('Sent');
  } catch (error) {
    console.error('Error sending to Discord:', error);
    res.status(500).send('Failed to send');
  }
};
