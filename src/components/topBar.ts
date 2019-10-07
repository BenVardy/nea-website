import { History } from 'history';

import Button from './button';

import './topBar.scss';

export default function TopBar(history: History): HTMLElement {
    let topBar = document.createElement('div');
    topBar.className = 'top-bar';

    let indexButton = new Button();
    indexButton.text = 'Calculator';
    indexButton.clickHandler = () => {
        if (history.location.pathname !== '/') {
            history.push('/');
        }
    };
    topBar.appendChild(indexButton.render());

    let questionsButton = new Button();
    questionsButton.text = 'Questions';
    questionsButton.clickHandler = () => {
        if (history.location.pathname !== '/questions') {
            history.push('/questions');
        }
    };
    topBar.appendChild(questionsButton.render());

    return topBar;
}
