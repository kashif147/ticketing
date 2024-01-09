import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@creativelab147/common';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // throw error if order ticket not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // update the ticket with the corresponding orderId
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    // ack the message
    msg.ack();
  }
}
