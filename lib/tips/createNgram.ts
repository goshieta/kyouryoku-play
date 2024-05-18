export default function createNGrams(
  input: string,
  n: number
): { [key: string]: true } {
  const ngrams: { [key: string]: true } = {};

  for (let i = 0; i <= input.length - n; i++) {
    const ngram = input.substring(i, i + n);
    ngrams[ngram] = true;
  }

  return ngrams;
}
