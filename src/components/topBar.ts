import { History } from 'history';

import './topBar.scss';

export function TopBar(history: History): HTMLElement {
    let topBar = document.createElement('div');
    topBar.className = 'top-bar';

    let indexButton = document.createElement('div');
    indexButton.className = 'nav-button';
    indexButton.innerHTML = 'Calculator';
    indexButton.addEventListener('click', () => {
        if (history.location.pathname !== '/') {
            history.push('/');
        }
    });
    topBar.appendChild(indexButton);

    let questionsButton = document.createElement('div');
    questionsButton.className = 'nav-button';
    questionsButton.innerHTML = 'Questions';
    questionsButton.addEventListener('click', () => {
        if (history.location.pathname !== '/questions') {
            history.push('/questions');
        }
    });
    topBar.appendChild(questionsButton);

    return topBar;
}
