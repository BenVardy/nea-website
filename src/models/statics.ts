import { IQuestionButton } from '../types';

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
export const buttons: IQuestionButton[] = [
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
