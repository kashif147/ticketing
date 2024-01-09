import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@creativelab147/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  static publish: any;
}
