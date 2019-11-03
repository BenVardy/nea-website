import { MDCSlider } from '@material/slider';

import './slider.scss';

export default class Slider {

    public className: string;
    public onChange?: (value: number) => void;
    public label: string;

    public minValue: string;
    public maxValue: string;
    public currentValue: string;

    private mdcSlider: MDCSlider;

    private sliderContainer: HTMLElement;

    public constructor() {
        this.className = '';
        this.label = 'Slider';

        // Init current value with min value
        this.minValue = this.currentValue = '0';
        this.maxValue = '4';

        this.handleChange = this.handleChange.bind(this);

        this.sliderContainer = document.createElement('div');
        this.sliderContainer.classList.add('slider');

        // Set up slider
        let sliderElem = document.createElement('div');
        sliderElem.classList.add('mdc-slider', 'mdc-slider--discrete');
        if (this.className !== '') sliderElem.classList.add(this.className);
        sliderElem.tabIndex = 0;

        // Set mdc values
        sliderElem.setAttribute('role', 'slider');
        sliderElem.setAttribute('aria-valuemin', this.minValue);
        sliderElem.setAttribute('aria-valuemax', this.maxValue);
        // Set the start value to the min
        // this.sliderElem.setAttribute('aria-valuenow', this.currentValue);
        sliderElem.setAttribute('aria-label', this.label);

        let sliderTrackContainer = document.createElement('div');
        sliderTrackContainer.classList.add('mdc-slider__track-container');

        let sliderTrack = document.createElement('div');
        sliderTrack.classList.add('mdc-slider__track');

        sliderTrackContainer.appendChild(sliderTrack);
        sliderElem.appendChild(sliderTrackContainer);

        let sliderThumbContainer = document.createElement('div');
        sliderThumbContainer.classList.add('mdc-slider__thumb-container');

        let sliderPin = document.createElement('div');
        sliderPin.classList.add('mdc-slider__pin');

        let sliderPinValueMarker = document.createElement('span');
        sliderPinValueMarker.classList.add('mdc-slider__pin-value-marker');

        sliderPin.appendChild(sliderPinValueMarker);
        sliderThumbContainer.appendChild(sliderPin);

        let sliderThumb = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        sliderThumb.classList.add('mdc-slider__thumb');
        sliderThumb.setAttribute('width', '21');
        sliderThumb.setAttribute('height', '21');

        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '10.5');
        circle.setAttribute('cy', '10.5');
        circle.setAttribute('r', '7.875');

        sliderThumb.appendChild(circle);
        sliderThumbContainer.appendChild(sliderThumb);

        let sliderFocusRing = document.createElement('div');
        sliderFocusRing.classList.add('mdc-slider__focus-ring');

        sliderThumbContainer.appendChild(sliderFocusRing);
        sliderElem.appendChild(sliderThumbContainer);

        this.sliderContainer.appendChild(sliderElem);

        this.mdcSlider = new MDCSlider(sliderElem);
        this.mdcSlider.listen('MDCSlider:change', this.handleChange);
    }

    public render(): HTMLElement {
        // this.sliderElem.setAttribute('aria-valuenow', this.currentValue);

        return this.sliderContainer;
    }

    private handleChange(): void {
        // this.currentValue = this.mdcSlider.value.toString();

        if (this.onChange) {
            this.onChange(this.mdcSlider.value);
        }
    }
}
