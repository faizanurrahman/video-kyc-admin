import { AtleastTwoDigitPipe } from './atleast-two-digit.pipe';

describe('AtleastTwoDigitPipe', () => {
  it('create an instance', () => {
    const pipe = new AtleastTwoDigitPipe();
    expect(pipe).toBeTruthy();
  });
});
