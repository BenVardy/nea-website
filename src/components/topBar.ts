import { History } from 'history';

import './topBar.scss';

export default function TopBar(history: History): HTMLElement {
    let topBar = document.createElement('div');
    topBar.className = 'top-bar';

    let indexButton = document.createElement('div');
    indexButton.className = 'button';
    indexButton.innerHTML = 'Calculator';
    indexButton.addEventListener('click', () => {
        if (history.location.pathname !== '/') {
            history.push('/');
        }
    });
    topBar.appendChild(indexButton);

    let questionsButton = document.createElement('div');
    questionsButton.className = 'button';
    questionsButton.innerHTML = 'Questions';
    questionsButton.addEventListener('click', () => {
        if (history.location.pathname !== '/questions') {
            history.push('/questions');
        }
    });
    topBar.appendChild(questionsButton);

    return topBar;
}
