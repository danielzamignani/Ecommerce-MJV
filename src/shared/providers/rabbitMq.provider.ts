import { connect, Connection, Channel } from 'amqplib';

async function createConnection() {
  try {
    const connection = await connect({
      hostname: 'localhost',
      locale: 'pt-br',
      port: 5672,
      username: 'admin',
      password: 'admin',
    });
    return connection;
  } catch (err) {
    console.log(err);
  }
}

async function createPublishChannel(connection: Connection) {
  let publishChannel: Channel;

  try {
    publishChannel = await connection.createChannel();
  } catch (err) {
    console.log(err);
  }

  try {
    await publishChannel.assertQueue('loghttp', {
      durable: true,
      autoDelete: false,
    });
  } catch (err) {
    console.log(err);
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
