import { JmsStatusMessage } from './jms-status-message';
import { JmsStatus } from './jms-status'; // Adjust import path if needed

describe('JmsStatusMessage', () => {
  it('should create an instance', () => {
    const mockStatus = JmsStatus.FILM_PROCESSOR_COMPLETED; // Use a valid enum value or mock object
    const mockFilm = {} as any;
    const mockTiming = 0;
    const mockStatusValue = 'OK';

    expect(new JmsStatusMessage(mockStatus, mockFilm, mockTiming, mockStatusValue)).toBeTruthy();
  });
});
