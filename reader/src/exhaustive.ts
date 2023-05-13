/**
 * Small function for compile-time checking that switch statements or if/else chains are exhaustive.
 */
export function exhaustive(_input: never): never {
    throw new Error("How did you get here?");
}
