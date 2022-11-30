function mult( a, b, n, k, m ) {
    let c = new Array(n);
    for ( let i = 0; i < n; i ++ ) {
        c[i] = new Float64Array(m);
        for ( let j = 0; j < m; j ++ ) {
            for ( let _k = 0; _k < k; _k ++ ) {
                c[i][j] += a[i][_k] * b[_k][j];
            }
        }
    }
    return c;
}

function act( A, v, n, m ) {
    let c = new Float64Array(n);
    for ( let i = 0; i < n; i ++ ) {
        for ( let j = 0; j < m; j ++ ) {
            c[i] += A[i][j] * v[j];
        }
    }
    return c;
}

function act_left( v, A, n, m ) {
    let c = new Float64Array(n);
    for ( let i = 0; i < n; i ++ ) {
        for ( let j = 0; j < m; j ++ ) {
            c[i] += v[i] * A[i][j];
        }
    }
    return c;
}


/**
 * Calculates the Cholesky decomposition for a hermitian square matrix
 *
 * Adapted from http://www.seas.ucla.edu/~vandenbe/133A/lectures/chol.pdf
 */
function cholesky_sqrt ( mat, n ) {
    let i,j;
    let R = new Array(n);
    let _mat = new Array(n);
    for (i = 0; i < n; i ++ ) {
        R[i] = new Float64Array(n);
        _mat[i] = new Float64Array(n);
        for (j = 0; j < n; j ++ ) {
            _mat[i][j] = mat[i][j];
        }
    }
    _cholesky_step( _mat, R, n, 0 );
    return R;
}


function _cholesky_step( mat, R, n, i ) {
    let _i,_j;
    // A[i:n][i:n] - R[i-1,i:n]^T R[i-1,i:n]
    if ( i !== 0 ) {
        let temp;
        for ( _i = i; _i < n; _i ++ ) {
            mat[_i][_i] -= R[i-1][_i]*R[i-1][_i];
            for ( _j = _i+1; _j < n; _j ++ ) {
                temp = R[i-1][_i]*R[i-1][_j];
                mat[_i][_j] -= temp;
                mat[_j][_i] -= temp;
            }
        }
    }
    // Check for positive definiteness (unless the entire row is zeros, in which case
    // leave the whole row in R as zeros
    if ( mat[i][i] === 0 ) {
        for (let val of mat[i].slice(i+1)) {
            if (val !== 0) throw new Error("Cannot decompose non-positive definite matrix");
        }
    } else if ( mat[i][i] < -1e-8 ) { // allow for fp error
        throw new Error("Cannot decompose non-positive definite matrix");
    } else {
    // if ( mat[i][i] < 0 ) console.warn("cannot decompose");
        R[i][i] = Math.sqrt(Math.abs( mat[i][i] ));
        let invR = 1/R[i][i];
        for ( _i = i + 1; _i < n; _i ++ ) {
            R[i][_i] = mat[i][_i] * invR;
            // R[_i][i] = mat[_i][i] * invR
        }
    }

    if ( i + 1 < n ) {
        _cholesky_step( mat, R, n, i + 1 );
    }
}

function inv_upper_right( R, n ) {
    let i,j,k;
    let U = new Array(n);
    for ( i = 0; i < n; i ++ ) {
        U[i] = new Float64Array(n);
        U[i][i] = 1/R[i][i];
    }
    if ( n < 2 ) return U;
    for ( i = n-2; i >= 0; i -- ) {
        for ( j = n-1; j > i; j -- ) {
            for ( k = j; k > i; k -- ) {
                // console.log(`U${i+1}${j+1} -= R${i+1}${k+1}(${R[i][k]}) U${k+1}${j+1}(${U[i][k]})`);
                U[i][j] -= R[i][k] * U[k][j];
            }
            U[i][j] *= U[i][i];
        }
    }
    return U;
}
function inv_lower_left( L, n ) {
    let i,j,k;
    let U = new Array(n);
    for ( i = 0; i < n; i ++ ) {
        U[i] = new Float64Array(n);
        U[i][i] = 1/L[i][i];
    }
    for ( i = 1; i < n; i ++ ) {
        for ( j = 0; j < i; j ++ ) {
            for ( k = j; k < i; k ++ ) {
                // console.log(`U${i+1}${j+1} -= L${i+1}${k+1} U${k+1}${j+1}`);
                U[i][j] -= L[i][k] * U[k][j];
            }
            U[i][j] *= U[i][i];
        }
    }
    return U;
}

/**
 * Calculates the inverse of a (symmetric, positive definate) matrix using cholesky decomposition
 */
function inv_cholesky( mat, n, upper_rights ) {
    let R = cholesky_sqrt( mat, n );
    return _inv_cholesky( R, n, upper_rights );
}
function _inv_cholesky( R, n, upper_rights ) {
    let I = new Array(n);
    let i,j,k;
    for ( i = 0; i < n; i ++ ) {
        I[i] = new Float64Array(n);
    }
    let U = inv_upper_right( R, n );
    for ( i = 0; i < n; i ++ ) {
        for ( k = i; k < n; k ++ ) {
            I[i][i] += U[i][k] * U[i][k];
        }
        for ( j = i+1; j < n; j ++ ) {
            for ( k = j; k < n; k ++ ) { // only need to start at k, since U[j][k]=0 for k < j
                I[i][j] += U[i][k] * U[j][k];
            }
            I[j][i] = I[i][j];
        }
    }
    if ( upper_rights ) return { inv:I, iur:U, ur:R };
    return I;
}

function dot( a, b, n ) {
    let res = 0;
    let i;
    for ( i = 0; i < n; i ++ ) {
        res += a[i] * b[i];
    }
    return res;
}
function sq_norm( vec, n ) {
    return dot(vec, vec, n);
}
function norm( vec, n ) {
    return Math.sqrt(sq_norm( vec, n ));
}
function cross ( a, b, n ) {
    if ( a.length === 2 ) {
        return a[0]*b[1] - a[1]*b[0];
    }
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ];
}

module.exports = exports = {
    cross : cross,
    norm : norm,
    sq_norm : sq_norm,
    dot : dot,
    inv_cholesky : inv_cholesky,
    cholesky_sqrt : cholesky_sqrt,
    inv_upper_right : inv_lower_left,
    act : act,
    act_left : act_left
};
