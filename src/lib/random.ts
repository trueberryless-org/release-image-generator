const LCG_MULTIPLIER = 9301;
const LCG_INCREMENT = 49297;
const LCG_MODULUS = 233280;

export const SEED_SPACE = LCG_MODULUS;

export function createRandom(seed: number) {
  let state = Math.abs(seed);

  return () => {
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS;

    return state / LCG_MODULUS;
  };
}

export function randomSeed() {
  const [value = 0] = crypto.getRandomValues(new Uint32Array(1));

  return value % SEED_SPACE;
}
