require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE = process.env.QUEUE_NAME || 'email_queue';

async function simulateWelcomeEmail(student) {
  console.log(`[Consumer] Enviando correo de bienvenida a: ${student.email} (${student.name}) — curso: ${student.course}...`);
  await new Promise(r => setTimeout(r, 1500));
  console.log(`[Consumer] ✔ Correo de bienvenida enviado a ${student.email}`);
}

async function simulateWaitlistNotification(student) {
  console.log(`[Consumer] Enviando notificación de lista de espera a: ${student.email} (${student.name}) — curso: ${student.course}...`);
  await new Promise(r => setTimeout(r, 1500));
  console.log(`[Consumer] ✔ Notificación de lista de espera enviada a ${student.email}`);
}

async function startConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  channel.prefetch(1);

  console.log(`[Consumer] Esperando mensajes en la cola "${QUEUE}"...`);

  channel.consume(QUEUE, async (msg) => {
    if (msg === null) return;

    try {
      const content = JSON.parse(msg.content.toString());
      console.log('[Consumer] Mensaje recibido:', content);

      switch (content.type) {
        case 'NEW_STUDENT':
          await simulateWelcomeEmail(content.student);
          channel.ack(msg);
          break;

        case 'WAITLIST':
          await simulateWaitlistNotification(content.student);
          channel.ack(msg);
          break;

        default:
          console.warn('[Consumer] Tipo desconocido. Descartando.');
          channel.ack(msg);
      }
    } catch (err) {
      console.error('[Consumer] Error procesando mensaje:', err.message);
      channel.nack(msg, false, false);
    }
  }, { noAck: false });
}

startConsumer().catch(err => {
  console.error('[Consumer] Error al iniciar:', err.message);
  process.exit(1);
});
