import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
} from '@creativelab147/common';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Completed,
    });

    await order.save();

    msg.ack();
  }
}
