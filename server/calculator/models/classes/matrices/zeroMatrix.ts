import Matrix from '../matrix';

/**
 * A zero matrix of size n
 */
export default class ZeroMatrix extends Matrix {
    // Methods

    /**
     * Creates a new Zero Matrix
     * @param n The size of the matrix
     */
    public constructor(n: number) {
        super(new Array(n).fill(new Array(n).fill(0)));
    }
}
