import Matrix from '../matrix';

/**
 * An identity matrix of size n
 */
export default class Identity extends Matrix {
    // Methods

    /**
     * Creates a new Identity matrix
     * @param n The size of the Identity matrix
     */
    public constructor(n: number) {
        let newArr: number[][] = new Array(n).fill(new Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            newArr[i][i] = 1;
        }

        super(newArr);
    }
}
