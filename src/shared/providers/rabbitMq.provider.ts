import { connect, Connection, Channel } from 'amqplib';
import {
  rabbitMqHost,
  rabbitMqPassword,
  rabbitMqPort,
  rabbitMqQueue,
  rabbitMqUsername,
} from '../configs/rabbitMq.config';

async function createConnection() {
  try {
    const connection = await connect({
      hostname: rabbitMqHost,
      locale: 'pt-br',
      port: rabbitMqPort,
      username: rabbitMqUsername,
      password: rabbitMqPassword,
    });
    return connection;
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
}

async function createPublishChannel(connection: Connection) {
  let publishChannel: Channel;

  try {
    publishChannel = await connection.createChannel();
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  try {
    await publishChannel.assertQueue(rabbitMqQueue, {
      durable: true,
      autoDelete: false,
    });
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  return publishChannel;
}

export const RabbitProvider = [
  {
    provide: 'RABBIT_CONNECTION',
    useFactory: async () => {
      return await createConnection();
    },
  },
  {
    provide: 'RABBIT_PUBLISH_CHANNEL',
    useFactory: async (connection: Connection) => {
      return await createPublishChannel(connection);
    },
    inject: ['RABBIT_CONNECTION'],
  },
];
