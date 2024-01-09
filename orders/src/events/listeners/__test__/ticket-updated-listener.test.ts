import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@creativelab147/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketCreatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new title',
    price: 999,
    userId: 'asfasdfsd',
  };

  // Create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // return all of this stuff (ticket, listener, data, msg)
  return { ticket, listener, data, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the messages', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('it does not acks the message if it is a skipped version or out of order', async () => {
  const { msg, data, ticket, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
