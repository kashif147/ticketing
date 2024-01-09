import { OrderCreatedEvent, OrderStatus } from '@creativelab147/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //Create an instance of a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: 'asdfg;lkjh',
  });
  await ticket.save();

  //Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdfg;lkjh',
    expiresAt: '',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // ack the message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('ack the message', async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
