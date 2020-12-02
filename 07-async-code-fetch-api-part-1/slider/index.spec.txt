import Slider from './index.js';

describe('async-code-fetch-api-part-1/slider', () => {
  let slider;

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 200,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 200,
      };
    });

    slider = new Slider();

    jest
    .spyOn(slider.element, 'offsetWidth', 'get')
    .mockImplementation(() => 200);

    document.body.append(slider.element);
  });

  afterEach(() => {
    slider.destroy();
    slider = null;
  });

  it("should be rendered correctly", () => {
    expect(slider.element).toBeInTheDocument();
    expect(slider.element).toBeVisible();
  });

  it('should have ability to move slider to start boundary', () => {
    const thumb = slider.element.querySelector('.thumb');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const move = new MouseEvent('pointermove', {
      clientX: 0,
      bubbles: true
    });

    thumb.dispatchEvent(down);
    thumb.dispatchEvent(move);

    expect(thumb).toHaveStyle(`left: 0px`);
  });

  it('should have ability to move slider to end boundary', () => {
    const thumb = slider.element.querySelector('.thumb');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const move = new MouseEvent('pointermove', {
      clientX: 200,
      bubbles: true
    });

    thumb.dispatchEvent(down);
    thumb.dispatchEvent(move);

    expect(thumb).toHaveStyle(`left: 200px`);
  });

  it('should have ability to be destroyed', () => {
    slider.destroy();

    expect(slider.element).not.toBeInTheDocument();
  });
});
