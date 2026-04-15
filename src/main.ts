import { connect } from "mqtt"
import { getLogger } from "./logger"
import { getEnvironment } from "./environment"

const logger = getLogger()
const environment = getEnvironment()

const client = connect(environment.MQTT_URL)

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
    method: 'POST',
    body: JSON.stringify({
      eventText: text
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(error => {
    logger.error(`Failed to push event: ${error}`)
  })
})