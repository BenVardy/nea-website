import { IQuestionButton } from '../types';

export const commands = {
    '[': 'Begin matrix',
    ']': 'End matrix',
    'Arrow Keys': 'Navigation',
    'Enter (In Matrix)': 'Return',
    'Enter': 'Execute',
    'eigen(M)': 'Finds the eigenvalues and eigenvectors of M',
    'det(M)': 'Returns the determinate of M',
    'diagonalize(M)': 'Diagonalizes M',
    'transpose(M)': 'Returns the transpose of M'
} as {
    [key: string]: string
};

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
