import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@creativelab147/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
