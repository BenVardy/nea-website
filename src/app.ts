import { createBrowserHistory, Location } from 'history';

import TopBar from './components/topBar';
import Four0Four from './views/404';
import Index from './views/index';
import Questions from './views/questions';

import 'katex/dist/katex.min.css';
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
        case '/questions':
            // tslint:disable-next-line: no-unused-expression
            new Questions(pageRoot);
            break;
        default:
            Four0Four(pageRoot);
            break;
    }
}

const unlisten = history.listen(onUrlChange);
onUrlChange(history.location);
