import { Ticket } from '../ticket';

it('test the implementation of optimistics concurrency control', async () => {
  // crete an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // save the ticket to the database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 10 });

  // savev the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  // crete an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
