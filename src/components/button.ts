import ComponentBase from './ComponentBase';

import './button.scss';

export default class Button extends ComponentBase {

    public constructor(options?: {[P in keyof Button]?: Button[P]}) {
        super(options);

        this.root.classList.add('button');

        this.root.addEventListener('click', (e: MouseEvent) => {
            let circle = document.createElement('div');
            this.root.appendChild(circle);

            let d: number = Math.max(this.root.clientWidth, this.root.clientHeight);
            circle.style.width = circle.style.height = d + 'px';

            let rect = this.root.getBoundingClientRect();
            circle.style.left = e.clientX - rect.left - d / 2 + 'px';
            circle.style.top = e.clientY - rect.top - d / 2 + 'px';

            circle.className = 'ripple';
        });

        if (this.clickHandler) this.root.addEventListener('click', this.clickHandler);

        this.root.innerHTML = this.innerHTML || '';
    }
}
