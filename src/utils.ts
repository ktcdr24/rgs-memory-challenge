const utils = {
  /*
      Create an array based on a numeric size property.
      Example: createArray(5) => [0, 1, 2, 3, 4]
    */
  createArray: (size: number): number[] =>
    Array.from({ length: size }, (_, i) => i),

  /*
      Pick random elements from origArray up to sampleSize
      And use them to form a new array.
      Example: sampleArray([9, 12, 4, 7, 5], 3) => [12, 7, 5]
    */
  sampleArray: (origArray: number[], sampleSize: number): number[] => {
    const copy = origArray.slice(0);
    const sample = [];
    for (let i = 0; i < sampleSize && i < copy.length; i++) {
      const index = Math.floor(Math.random() * copy.length);
      sample.push(copy.splice(index, 1)[0]);
    }
    return sample;
  },

  /*
      Given a srcArray and a crossArray, Count how many elements
      in srcArray exist or do not exist in crossArray.
      Returns an array with the 2 counts.
      Example: arrayCrossCounts([0, 1, 2, 3, 4], [1, 3, 5]) => [2, 3]
    */
  arrayCrossCounts: (srcArray: number[], crossArray: number[]): number[] => {
    let includeCount = 0;
    let excludeCount = 0;
    srcLoop: for (let s = 0; s < srcArray.length; s++) {
      for (let c = 0; c < crossArray.length; c++) {
        if (crossArray[c] === srcArray[s]) {
          includeCount += 1;
          continue srcLoop;
        }
      }
      excludeCount += 1;
    }
    return [includeCount, excludeCount];
  },
};

export default utils;
