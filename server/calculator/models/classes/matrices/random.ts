import Matrix from '../matrix';

/**
 * A random matrix
 */
export default class RandomMatrix extends Matrix {
    // Methods

    /**
     * Creates a new Random matrix
     * @param rows The number of rows
     * @param cols The number of columns
     * @param max The highest number in the matrix
     * @param decPlaces The number of decimal places (default 0)
     */
    public constructor(rows: number, cols: number, max: number, decPlaces?: number) {
        if (decPlaces === undefined) decPlaces = 0;
        const multTenDecPlaces: number = Math.pow(10, decPlaces);

        let newArr: number[][] = new Array(rows).fill([]).map(() => new Array(cols).fill(0));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                newArr[i][j] = Math.floor(Math.random() * (max + 1) * multTenDecPlaces) / multTenDecPlaces;
            }
        }

        super(newArr);
    }
}
