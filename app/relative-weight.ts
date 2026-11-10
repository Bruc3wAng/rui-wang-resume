type Matrix = readonly (readonly number[])[];
const tolerance = 1e-10;
const dot = (a: readonly number[], b: readonly number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const square = (n: number, make: (i: number, j: number) => number) =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => make(i, j)));

// Separate regression check: R = LLᵀ, R² = ‖L⁻¹r‖². This does not use the
// eigenvectors or allocations from the relative-weight calculation below.
function regressionR2(correlations: Matrix, outcome: readonly number[]) {
  const n = outcome.length, lower = square(n, () => 0), solved = Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const value = correlations[i][j] - dot(lower[i].slice(0, j), lower[j].slice(0, j));
      if (i === j && value <= tolerance) throw new RangeError("Predictor correlations must be positive definite");
      lower[i][j] = i === j ? Math.sqrt(value) : value / lower[j][j];
    }
    solved[i] = (outcome[i] - dot(lower[i].slice(0, i), solved.slice(0, i))) / lower[i][i];
  }
  const r2 = dot(solved, solved);
  if (r2 > 1 + tolerance) throw new RangeError("Outcome and predictor correlations are incompatible");
  return Math.min(r2, 1);
}

function symmetricEigen(matrix: Matrix) {
  const n = matrix.length, diagonal = matrix.map(row => [...row]), vectors = square(n, (i, j) => Number(i === j));
  for (let iteration = 0; iteration < 50 * n * n; iteration++) {
    let p = 0, q = 0, max = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (Math.abs(diagonal[i][j]) > max) { p = i; q = j; max = Math.abs(diagonal[i][j]); }
    }
    if (max < 1e-14) return { eigenvalues: diagonal.map((row, i) => row[i]), vectors };
    const a = diagonal[p][p], b = diagonal[q][q], f = diagonal[p][q];
    const angle = Math.atan2(2 * f, b - a) / 2, c = Math.cos(angle), s = Math.sin(angle);
    for (let k = 0; k < n; k++) {
      if (k !== p && k !== q) {
        const u = diagonal[k][p], v = diagonal[k][q];
        diagonal[k][p] = diagonal[p][k] = c * u - s * v;
        diagonal[k][q] = diagonal[q][k] = s * u + c * v;
      }
      const u = vectors[k][p], v = vectors[k][q];
      vectors[k][p] = c * u - s * v;
      vectors[k][q] = s * u + c * v;
    }
    diagonal[p][p] = c * c * a - 2 * c * s * f + s * s * b;
    diagonal[q][q] = s * s * a + 2 * c * s * f + c * c * b;
    diagonal[p][q] = diagonal[q][p] = 0;
  }
  throw new RangeError("Symmetric decomposition did not converge");
}

// Johnson (2000): Λ = R^(1/2), β = Λ⁻¹r, εᵢ = Σⱼ Λᵢⱼ²βⱼ².
// Inputs are correlations, not respondent records. Allocation is descriptive,
// not a causal effect, significance test or prediction for an intervention.
export function johnsonRelativeWeights(correlations: Matrix, outcome: readonly number[]) {
  const n = outcome.length;
  const isCorrelation = (value: number) => Number.isFinite(value) && Math.abs(value) <= 1;
  if (!n || correlations.length !== n || !outcome.every(isCorrelation) ||
      !correlations.every((row, i) => row.length === n && row[i] === 1 && row.every(isCorrelation)) ||
      correlations.some((row, i) => row.some((value, j) => value !== correlations[j][i]))) {
    throw new RangeError("Expected a symmetric predictor correlation matrix and outcome correlations");
  }
  const r2 = regressionR2(correlations, outcome);
  const { eigenvalues, vectors } = symmetricEigen(correlations);
  if (eigenvalues.some(value => value <= tolerance)) throw new RangeError("Predictor correlations are too close to singular");
  const roots = eigenvalues.map(Math.sqrt);
  const lambda = square(n, (i, j) => vectors[i].reduce((sum, value, k) => sum + value * roots[k] * vectors[j][k], 0));
  const projected = roots.map((root, k) => dot(vectors.map(row => row[k]), outcome) / root);
  const betaSquared = vectors.map(row => dot(row, projected) ** 2);
  const raw = lambda.map(row => dot(row.map(value => value ** 2), betaSquared));
  const rawTotal = raw.reduce((sum, value) => sum + value, 0);
  if (Math.abs(rawTotal - r2) > tolerance) throw new RangeError("Relative weights do not reconcile to model R²");
  return { r2, raw, rawTotal, share: raw.map(value => r2 > tolerance ? value / r2 * 100 : null) };
}

export const relativeWeightFragment = "#example-relative-weights";
export const relativeWeightPractice = "research-analysis";
export const relativeWeightOutput = { study: "content-tracking", output: "cross-market-report" } as const;
export const weightFactors = [
  { code: "A", zh: "内容丰富度", en: "Content variety" },
  { code: "B", zh: "推荐贴合度", en: "Recommendation relevance" },
  { code: "C", zh: "使用顺畅度", en: "Ease of use" },
  { code: "D", zh: "信息可信度", en: "Information credibility" },
] as const;
export const satisfactionCorrelations = [0.54, 0.51, 0.47, 0.29] as const;
const correlationOrder = [...satisfactionCorrelations.keys()].sort((a, b) => Math.abs(satisfactionCorrelations[b]) - Math.abs(satisfactionCorrelations[a]));

export const weightScenarios = ([
  { id: "low", overlap: .15, zh: "低重叠", en: "Low overlap" },
  { id: "high", overlap: .82, zh: "高重叠", en: "High overlap" },
] as const).map(scenario => {
  // Constructed examples isolate one change: the correlation between A and B.
  const predictors = square(weightFactors.length, (i, j) => i === j ? 1 : i + j === 1 ? scenario.overlap : 0);
  const result = johnsonRelativeWeights(predictors, satisfactionCorrelations);
  const order = [...result.raw.keys()].sort((a, b) => result.raw[b] - result.raw[a]);
  const rows = order.map((index, i) => {
    const share = result.share[index];
    if (share === null) throw new RangeError("The worked example must explain some variance");
    return { factor: weightFactors[index], index, correlation: satisfactionCorrelations[index], correlationRank: correlationOrder.indexOf(index) + 1, weightRank: i + 1, share, raw: result.raw[index] };
  });
  return { ...scenario, predictors, result, rows };
});
