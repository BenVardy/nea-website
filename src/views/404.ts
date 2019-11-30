import katex from 'katex';

import Calculator from '../models/calculator';
import InputMatrix from '../models/inputMatrix';
import {IAPIResult, TSymbol} from '../types';

import four0Four from '../../server/offlineFunctions/404';

/**
 * A 404 page
 * @param pageRoot The root of the page
 */
export default function Four0Four(pageRoot: HTMLElement): void {
    four0Four()
    // .then(res => res.json())
    .then((json: IAPIResult[]) => {
        let results: TSymbol[] = json.map(res => {
            return new InputMatrix(
                JSON.parse(res.data).map((row: number[]) => (
                    row.map((data: number) => data.toString()
                )))
            );
        });

        results.splice(2, 0, '=');

        let latex = Calculator.toLatex(
            results,
            false,
            0,
            false
        );

        katex.render(latex, pageRoot);

        let message = document.createElement('div');
        message.innerHTML = 'Page not found';
        pageRoot.appendChild(message);
    })
    .catch(err => console.error(err));
}
