/**
 * Expose all the questions as an object
 */

import * as Questions from './questionsRoot';

let output: {[key: string]: typeof Questions.MatrixAdd} = {};

Object.entries(Questions).forEach(([name, TQuestion]) => {
    const question = TQuestion;

    output[name.toLowerCase()] = question;
});

export default output;
