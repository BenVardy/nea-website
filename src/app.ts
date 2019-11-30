import { createBrowserHistory, Location } from 'history';
import fontLoader from 'webfontloader';

import TopBar from './components/topBar';
import Four0Four from './views/404';
import Index from './views/index';
import Questions from './views/questions';

import 'katex/dist/katex.min.css';
import './app.scss';

const history = createBrowserHistory();

let root = document.getElementById('root');
if (!root) throw Error('No Root set in html');

// Commented due to code changed for client-only
// root.appendChild(new TopBar(history).render());

let pageRoot = document.createElement('div');
pageRoot.className = 'page';
root.appendChild(pageRoot);

let footer = document.createElement('footer');
footer.innerText = 'By Ben Vardy';

root.appendChild(footer);

// The main rooter for the website
function onUrlChange(location: Location): void {
    pageRoot.innerHTML = '';
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

fontLoader.load({
    custom: {
        families: ['KaTeX_Size1', 'KaTeX_Size3', 'KaTeX_Size4', 'KaTeX_Math'],
        urls: ['/main.css']
    }
});
