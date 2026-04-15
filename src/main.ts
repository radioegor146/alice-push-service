import { connect } from 'mqtt'
import fs from 'node:fs'

import { getEnvironment } from './environment'
import { getLogger } from './logger'

const logger = getLogger()
const environment = getEnvironment()

const client = connect(environment.MQTT_URL, {
  ca: [fs.readFileSync(environment.MQTT_CA_CERTIFICATE_PATH)]
})

client.on('connect', () => {
  logger.info('Connected to MQTT')

  client.subscribe(environment.MQTT_TOPIC, error => {
    if (error) {
      logger.info(`Subscribed to ${environment.MQTT_TOPIC}`)
    }
  })
})

client.on('error', error => {
  logger.warn(`MQTT error: ${error}`)
})

client.on('message', (_, payload) => {
  const text = payload.toString('utf8')
  fetch(environment.PUSH_API_ENDPOINT, {
    body: JSON.stringify({
      eventText: text
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).catch(error => {
    logger.error(`Failed to push event: ${error}`)
  })
})
