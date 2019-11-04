import { ILabelTypePair, ISliderInfo } from '../types';

/**
 * The commands to display in the usage table
 */
export const commands = {
    '[': 'Begin matrix',
    ']': 'End matrix',
    'Arrow Keys': 'Navigation',
    'Enter (In Matrix)': 'Return',
    'Enter': 'Execute',
    'eigen(M)': 'Finds the eigenvalues and eigenvectors of M',
    'det(M)': 'Returns the determinate of M',
    'diagonalize(M)': 'Diagonalizes M',
    'transpose(M)': 'Returns the transpose of M',
    'tr(M)': 'Returns the trace of M'
} as {
    [key: string]: string
};

/**
 * Question buttons
 */
export const buttons: ILabelTypePair[] = [
    {
        label: 'Matrix Multiplication',
        type: 'matrixmult'
    },
    {
        label: 'Matrix Add',
        type: 'matrixadd'
    },
    {
        label: 'Eigenthings',
        type: 'eigen'
    }
];

export const sliders: ISliderInfo[] = [
    {
        label: 'Rows',
        type: 'noRows',
    },
    {
        label: 'Columns',
        type: 'noCols'
    },
    {
        label: 'Max number in matrix',
        type: 'maxNo',
        minValue: '1',
        maxValue: '20',
        defaultValue: '10'
    }
];
