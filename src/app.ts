import { createBrowserHistory, Location } from 'history';

import { TopBar } from './components/topBar';
import Index from './views/index';

import './app.scss';

const history = createBrowserHistory();

let root = document.getElementById('root');
if (!root) throw Error('No Root set in html');

root.appendChild(TopBar(history));

let pageRoot = document.createElement('div');
pageRoot.className = 'page';
root.appendChild(pageRoot);

function onUrlChange(location: Location): void {
    switch (location.pathname) {
        case '/':
            // tslint:disable-next-line: no-unused-expression
            new Index(pageRoot);
            break;
        default:
            pageRoot.innerHTML = '404 Page Not found';
    }
}

const unlisten = history.listen(onUrlChange);
onUrlChange(history.location);
