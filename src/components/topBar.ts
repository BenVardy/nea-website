import { History } from 'history';

import Button from './button';
import ComponentBase from './ComponentBase';

import './topBar.scss';

export default class TopBar extends ComponentBase {

    // Stop properties being assigned that can't be
    public className: never;
    public label: never;
    public innerHTML: never;
    public clickHandler: never;
    public changeHandler: never;

    public constructor() {
        super();
        this.root.classList.add('top-bar');

        // The client-only app does not have routing :(
        // let indexButton = new Button({
        //     innerHTML: 'Calculator',
        //     clickHandler: () => {
        //         if (history.location.pathname !== '/') {
        //             history.push('/');
        //         }
        //     }
        // });
        // this.root.appendChild(indexButton.render());

        // let questionsButton = new Button({
        //     innerHTML: 'Questions',
        //     clickHandler: () => {
        //         if (history.location.pathname !== '/questions') {
        //             history.push('/questions');
        //         }
        //     }
        // });
        // this.root.appendChild(questionsButton.render());

        let text = document.createElement('span');
        text.classList.add('title-text');
        text.innerText = 'Matrix Calculator';
        this.root.appendChild(text);
    }
}
