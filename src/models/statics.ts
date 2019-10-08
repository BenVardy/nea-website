import { IQuestionButton } from '../types';

export const commands = {
    '[': 'Begin matrix',
    ']': 'End matrix',
    'Enter (In Matrix)': 'Return',
    'Enter': 'Execute'
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
    }
];
