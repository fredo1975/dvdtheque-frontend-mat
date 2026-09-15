import { OrigineLabelPipe } from './origine-label.pipe';
import { Origine } from '../model/origine';

describe('OrigineLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new OrigineLabelPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the readable label for each origine', () => {
    const pipe = new OrigineLabelPipe();
    expect(pipe.transform(Origine.EN_SALLE)).toBe('En salle');
    expect(pipe.transform(Origine.GOOGLE_PLAY)).toBe('Google Play');
    expect(pipe.transform(Origine.CANAL_PLUS)).toBe('Canal+');
    expect(pipe.transform(Origine.DISNEY_PLUS)).toBe('Disney+');
    expect(pipe.transform(Origine.DVD)).toBe('DVD');
  });

  it('should return an empty string when origine is null or undefined', () => {
    const pipe = new OrigineLabelPipe();
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});