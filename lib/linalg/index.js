// const { SVD } = require('svd-js')
const { diag } = require('./eigs.js');

class Matrix {
    constructor(data) {
        this.data = data;
        this.n = data.length;
        this.m = data[0].length;
    }


    to_diag() {
        let vec = [];
        for(let i of [...Array(Math.min(this.n,this.m))]) {
            vec.push(this.data[i][i]);
        }
        return vec;
    }

    to_array() {
        return this.data;
    }

    dot(other) {
        if (other.n === undefined || other.m == undefined) { throw new Error('argument is not a Matrix'); }
        if (this.m !== other.n) { throw new Error(`cannot multiply ${this.n}x${this.m} with ${other.n}x${other.m}`); }
        let data = [...Array(this.n)].map(a=> [...Array(other.m)].map(b=> 0.0));
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < other.m; j++) {
                for (let k = 0; k < this.m; k++) {
                    data[i][j] += this.data[i][k]*other.data[k][j];
                }
            }
        }
        if (this.n === 1 && other.m === 1) { return data[0][0]; }
        return new Matrix(data);
    }

    add(other) {
        if (typeof(other) === "number") {

            // Make a hard copy
            let data = JSON.parse(JSON.stringify(this.data));
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.m; j++) {
                    data[i][j] += other;
                }
            }

            return new Matrix(data);
        } else if (other.n !== undefined && other.m != undefined) {
            if (other.n !== this.n || other.m !== this.m) throw new Error(`cannot add matricies ${this.n}x${this.m} and ${other.n}x${other.m}`);

            // Make a hard copy
            let data = JSON.parse(JSON.stringify(this.data));
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.m; j++) {
                    data[i][j] += other.data[i][j];
                }
            }

            return new Matrix(data);
        } else {
            throw new Error(`cannot add object: '${other.constructor.name}' to Matrix`);
        }
    }

    sub(other) {
        if (typeof(other) === "number") {

            // Make a hard copy
            let data = JSON.parse(JSON.stringify(this.data));
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.m; j++) {
                    data[i][j] -= other;
                }
            }

            return new Matrix(data);
        } else if (other.n !== undefined && other.m != undefined) {
            if (other.n !== this.n || other.m !== this.m) throw new Error(`cannot add matricies ${this.n}x${this.m} and ${other.n}x${other.m}`);

            // Make a hard copy
            let data = JSON.parse(JSON.stringify(this.data));
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.m; j++) {
                    data[i][j] -= other.data[i][j];
                }
            }

            return new Matrix(data);
        } else {
            throw new Error(`cannot add object: '${other.constructor.name}' to Matrix`);
        }
    }

    neg() {
    // Make a hard copy
        let data = JSON.parse(JSON.stringify(this.data));
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.m; j++) {
                data[i][j] = -data[i][j];
            }
        }

        return new Matrix(data);
    }

    T() {
        let data = [...Array(this.m)].map(a=> [...Array(this.n)].map(b=> 0.0));
        for (let i = 0; i < this.n; i++) {
            for (let j=0; j < this.m; j++) {
                data[j][i] = +this.data[i][j];
            }
        }
        return new Matrix(data);
    }

    // svd() {
    //   let {u,v,q} = SVD(this.data);
    //   return {u : new Matrix(u), vt: new Matrix(v), q : q}
    // }

    eig( precision ) {
        if (this.n !== this.m) throw new Error('cannot diagonalize non-square matrix');
        // let { u, vt, q } = this.svd();
        let [e,W] =  diag( this.data, precision );
        return { values : e, vecs : new Matrix(W) };
    }

    inv() {
    // let { u, vt, q } = this.svd();
        let { values, vecs } = this.eig();
        let qinv = [];
        values.forEach(val => {
            if (val === 0.0) throw new Error('cannot invert singular matrix');
            qinv.push(1/val);
        });
        return W.T().dot(this.constructor.diag(qinv).dot(W));
    }

    det() {
    // let { u, vt, q } = this.svd();
        let { values, vecs } = this.eig();
        return values.reduce((acc, cur) => cur * acc, 1.0);
    }

    column(i, as_vector=true) {
        if (this.data[0][i] === undefined) throw new Error(`cannot get column "${i}"`);
        if (as_vector) return this.data.map(r => r[i]);
        return this.constructor.column(this.data.map(r => r[i]));
    }
    row(i, as_vector=true) {
        if (this.data[i] === undefined) throw new Error(`cannot get column "${i}"`);
        if (as_vector) return this.data[i];
        return this.constructor.row(this.data[i]);
    }


    static column(vec) {
        if (!this.is_vec_array(vec)) throw new Error("argument is not a 1d vec array");
        let data = vec.map(e => [e]);
        return new this(data);
    }
    static row(vec) {
        if (!this.is_vec_array(vec)) throw new Error("argument is not a 1d vec array");
        return new this([vec]);
    }
    static diag(vec) {
        if (!this.is_vec_array(vec)) throw new Error("argument is not a 1d vec array");
        let data = [...Array(vec.length)].map(a=> [...Array(vec.length)].map((b) => 0.0));
        vec.forEach((v,i) => { data[i][i] = v; });
        return new this(data);
    }
    static array(data) {
        if (!this.is_matrix_array(data)) throw new Error("argument is not a 2d matrix array");
        return new this(data);
    }
    static eye(n) {
        return this.diag([...Array(n)].map(e=> 1.0));
    }
    static zeros(n,m) {
        m = m ? m : n;
        let data = [...Array(n)].map(e => [...Array(m)].map(e => 0.0));
        return new this(data);
    }

    static is_vec_array(obj) {
        if (
            obj.length === undefined || obj.length === 0
        ) { return false; }

        let containsnumbers = true;
        obj.forEach(val => {
            containsnumbers = containsnumbers && (typeof(val) === "number");
        });

        return containsnumbers;
    }

    static is_matrix_array(obj) {
        if (
            obj.length === undefined || obj.length === 0
        ) { return false; }

        if (
            obj[0].length === undefined || obj.length === 0
        ) { return false; }

        let is_square = true;
        let containsnumbers = true;
        let row_len = obj[0].length;
        obj.forEach(r => {
            is_square = is_square && !(r.length === undefined || r.length !== row_len);
            r.forEach(val => {
                containsnumbers = containsnumbers && (typeof(val) === "number");
            });
        });

        return is_square && containsnumbers;
    }
}

module.exports = exports = Matrix;
