import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@creativelab147/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
