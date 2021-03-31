import { PdfMaker } from './pdf-maker';

describe('PdfMaker', () => {
  it('should create an instance', () => {
    expect(new PdfMaker()).toBeTruthy();
  });
});
