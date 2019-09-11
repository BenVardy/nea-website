import Vector from '../vector';

/**
 * A zero vector
 */
export default class ZeroVector extends Vector {
    /**
     * Creates a new zero vector
     * @param n The size of the vector
     */
    public constructor(n: number) {
        super(new Array(n).fill(0));
    }
}
