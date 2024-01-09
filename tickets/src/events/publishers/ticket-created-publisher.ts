import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@creativelab147/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
