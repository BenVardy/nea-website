import './button.scss';

export default class Button {
    public text: string;
    public className: string;
    public clickHandler?: (e: MouseEvent) => void;

    public constructor() {
        this.text = '';
        this.className = '';
    }

    public render(): HTMLElement {
        let buttonElem = document.createElement('div');
        buttonElem.className = `button ${this.className}`;

        buttonElem.addEventListener('click', (e: MouseEvent) => {
            let circle = document.createElement('div');
            buttonElem.appendChild(circle);

            let d: number = Math.max(buttonElem.clientWidth, buttonElem.clientHeight);
            circle.style.width = circle.style.height = d + 'px';

            let rect = buttonElem.getBoundingClientRect();
            circle.style.left = e.clientX - rect.left - d / 2 + 'px';
            circle.style.top = e.clientY - rect.top - d / 2 + 'px';

            circle.className = 'ripple';
        });

        if (this.clickHandler) buttonElem.addEventListener('click', this.clickHandler);

        buttonElem.innerHTML = this.text;

        return buttonElem;
    }
}
