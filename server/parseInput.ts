import exprMap from './calculator/exprMap';
import { TCalc } from './types';

import { Matrix, Vector } from './calculator/models/';

/**
 * Joins multiple regular expressions into one with or-s
 *
 * @param regex The regex to join
 */
function joinRegex(...regex: RegExp[]): RegExp {
    return new RegExp(regex.map(item => item.source).join('|'), 'gi');
}

/**
 * Parses a calculation
 *
 * @param input The un-parsed input
 */
export default function parseInput(input: string): TCalc[] {
    const NUMBER_REGEX: RegExp = /(-1)|[\d\.]+(e-?\d+)?/;
    const EXPR_REGEX: RegExp = /[a-z*+/\^]+/i;
    const MATRIX_REGEX: RegExp = /\[(\[(-?[\d\.]+(e-?\d+)?,?)+\],?)+\]/;
    // same as matrix but with only 1 inner array
    const VECTOR_REGEX: RegExp = /\[(\[-?[\d\.]+(e-?\d+)?,?\],?)+\]/;
    const BRACKET_REGEX: RegExp = /[\(\)]/;

    let partsArr: string[] | null = input
        .replace(/\s/g, '')
        // -n = -1 * n
        .replace(/-(?![^\[]*\])/g, '+-1*')
        // Remove a plus if it is at the start of a statement
        .replace(/(?<=^|\()\+/g, '')
        .replace(/([\d\]\)])([\(\[])/g, '$1*$2')
        .match(joinRegex(
            NUMBER_REGEX,
            EXPR_REGEX,
            MATRIX_REGEX,
            BRACKET_REGEX
        ));

    console.log(partsArr);

    if (!partsArr) throw new Error('Invalid Calculation');

    let calc: TCalc[] = partsArr.map(item => {
        // Vector must come first as matrix will also match vectors
        if (item.match(VECTOR_REGEX)) {
            return {
                type: 'vector',
                // Regex means that there will only be 1 inner array
                data: new Vector(JSON.parse(item).map((row: number[]) => row[0]))
            };
        } else if (item.match(MATRIX_REGEX)) {
            return {
                type: 'matrix',
                data: new Matrix(JSON.parse(item))
            };
        } else if (item.match(NUMBER_REGEX)) {
            return {
                type: 'no',
                data: +item
            };
        } else if (item.match(EXPR_REGEX)) {
            if (!Object.keys(exprMap).includes(item)) throw new Error(`'${item}' is an invalid expression`);
            return {
                type: 'expr',
                data: exprMap[item]
            };
        } else {
            return {
                type: 'bracket',
                data: item
            };
        }
    });

    return calc;
}
