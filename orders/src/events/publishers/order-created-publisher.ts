import { Publisher, OrderCreatedEvent, Subjects } from '@creativelab147/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
