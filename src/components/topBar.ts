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

    public constructor(history: History) {
        super();
        this.root.classList.add('top-bar');

        let indexButton = new Button({
            innerHTML: 'Calculator',
            clickHandler: () => {
                if (history.location.pathname !== '/') {
                    history.push('/');
                }
            }
        });
        this.root.appendChild(indexButton.render());

        let questionsButton = new Button({
            innerHTML: 'Questions',
            clickHandler: () => {
                if (history.location.pathname !== '/questions') {
                    history.push('/questions');
                }
            }
        });
        this.root.appendChild(questionsButton.render());
    }
}
