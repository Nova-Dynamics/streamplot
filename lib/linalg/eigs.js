/**
 * Adapted from math.js
 */


const config = {
    epsilon : 1e-16
};

// get max off-diagonal value from Upper Diagonal
function getAij (Mij) {
    const N = Mij.length;
    let maxMij = 0;
    let maxIJ = [0, 1];
    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
            if (Math.abs(maxMij) < Math.abs(Mij[i][j])) {
                maxMij = Math.abs(Mij[i][j]);
                maxIJ = [i, j];
            }
        }
    }
    return [maxIJ, maxMij];
}

// get angle
function getTheta (aii, ajj, aij) {
    const denom = (ajj - aii);
    if (Math.abs(denom) <= config.epsilon) {
        return Math.PI / 4.0;
    } else {
        return 0.5 * Math.atan(2.0 * aij / (ajj - aii));
    }
}

// update matrix
function x1 (Hij, theta, i, j) {
    const N = Hij.length;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const c2 = c * c;
    const s2 = s * s;
    const Aki = new Float64Array(N);
    const Akj = new Float64Array(N);
    //  Aii
    const Aii = c2 * Hij[i][i] - 2 * c * s * Hij[i][j] + s2 * Hij[j][j];
    const Ajj = s2 * Hij[i][i] + 2 * c * s * Hij[i][j] + c2 * Hij[j][j];
    // 0  to i
    for (let k = 0; k < N; k++) {
        Aki[k] = c * Hij[i][k] - s * Hij[j][k];
        Akj[k] = s * Hij[i][k] + c * Hij[j][k];
    }
    // Modify Hij
    Hij[i][i] = Aii;
    Hij[j][j] = Ajj;
    Hij[i][j] = 0;
    Hij[j][i] = 0;
    // 0  to i
    for (let k = 0; k < N; k++) {
        if (k !== i && k !== j) {
            Hij[i][k] = Aki[k];
            Hij[k][i] = Aki[k];
            Hij[j][k] = Akj[k];
            Hij[k][j] = Akj[k];
        }
    }
    return Hij;
}
// update eigvec
function Sij1 (Sij, theta, i, j) {
    const N = Sij.length;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const Ski = new Float64Array(N);
    const Skj = new Float64Array(N);
    for (let k = 0; k < N; k++) {
        Ski[k] = c * Sij[k][i] - s * Sij[k][j];
        Skj[k] = s * Sij[k][i] + c * Sij[k][j];
    }
    for (let k = 0; k < N; k++) {
        Sij[k][i] = Ski[k];
        Sij[k][j] = Skj[k];
    }
    return Sij;
}

/**
 * Get the eigenvalues and eigenvectors of a real symmetric matrix
 *
 * I.e. get e,W such that: A = W^T * diag(e) * W
 *
 * returns [e,W] where the columns of W are the vecs for each e
 */
function diag (x, precision) {
    p = precision === undefined ? config.epsilon : precision;
    let n = x.length;
    const e0 = Math.abs(p / n);
    let psi;
    let Sij = new Array(n);
    // Sij is Identity Matrix
    for (let i = 0; i < n; i++) {
        Sij[i] = new Float64Array(n);
        Sij[i][i] = 1.0;
    }

    // initial error
    let Vab = getAij(x);
    while (Math.abs(Vab[1]) >= Math.abs(e0)) {
        const i = Vab[0][0];
        const j = Vab[0][1];
        psi = getTheta(x[i][i], x[j][j], x[i][j]);
        x = x1(x, psi, i, j);
        Sij = Sij1(Sij, psi, i, j);
        Vab = getAij(x);
    }
    const Ei = new Float64Array(n, 0); // eigenvalues
    for (let i = 0; i < n; i++) {
        Ei[i] = x[i][i];
    }
    return [Ei, Sij];
}

exports = module.exports = { diag : diag };
