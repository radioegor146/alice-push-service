import 'dotenv'
import { z } from 'zod'

const environmentType = z.object({
  MQTT_TOPIC: z.string().default('bus/services/alice/event'),
  MQTT_URL: z.url().default('mqtts://test:test@mqtt.int.bksp.in:8883'),
  PUSH_API_ENDPOINT: z.url().default('http://server:31116/push'),
})

export type Environment = z.infer<typeof environmentType>

export function getEnvironment (): Environment {
  return environmentType.parse(process.env)
}
