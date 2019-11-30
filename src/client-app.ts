import fontLoader from 'webfontloader';

import TopBar from './components/topBar';
import Index from './views/index';

import 'katex/dist/katex.min.css';
import './app.scss';

let root = document.getElementById('root');
if (!root) throw Error('No Root set in html');

root.appendChild(new TopBar().render());

let pageRoot = document.createElement('div');
pageRoot.className = 'page';
root.appendChild(pageRoot);

let footer = document.createElement('footer');
footer.innerText = 'By Ben Vardy';

root.appendChild(footer);

// tslint:disable-next-line: no-unused-expression
new Index(pageRoot);

fontLoader.load({
    custom: {
        families: ['KaTeX_Size1', 'KaTeX_Size3', 'KaTeX_Size4', 'KaTeX_Math'],
        urls: ['./main.css']
    }
});

