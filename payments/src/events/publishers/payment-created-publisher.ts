import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@creativelab147/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
