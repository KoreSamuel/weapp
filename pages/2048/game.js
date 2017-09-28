function Game(size, w) {
    // 单例
    if (!(this instanceof Game)) {
        return new Game(size, w);
    }
    this._w = w;
}
/**
 * 重起游戏
 */
Game.restart = function ({ w, matrix, size }) {
    let game = new Game(size, w);
    game._init(size);
    game._matrix = matrix;
    return game;
}



Game.prototype = {
    get value() {
        return this._matrix;
    },

    _init(size) {
        this._size = size;
        this._gridWidth = this._w / size;
        this._matrix = [];
        let row = size;
        // 初始化矩阵为数据0
        while (row--) {
            let col = size;
            let rows = [];
            while (col--) {
                rows.push(0);
            }
            this._matrix.push(rows);
        }
    },
    /**
     * 设置数字
     */
    setNumber() {
        let matrix = this._matrix;
        let size = this._size;
        let empty_grids = [];

        // 找到没有数字的位置，并放到empty_grids数组中
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                (matrix[i][j] === 0) && empty_grids.push({
                    row: i,
                    col: j,
                })
            }
        }
        
        // 如果有空的位置，则随机生成数字，存放到矩阵中，控制一下生成2或者4的几率
        if (empty_grids.length) {
            let index = Math.floor(Math.random() * empty_grids.length);
            let value = Math.random() > 0.75 ? 4 : 2;

            let empty = empty_grids[index];
            matrix[empty.row][empty.col] = value;
        }
    },

    /**
     * 手指滑动方向
     */
    move(direct) {
        let size = this._size;
        let gridWidth = this._gridWidth;
        let score = 0;

        /**
         * 处理滑动时数字的合并，以向左为例
         * 1、右边数字大于0，左边数字等于0，则将左边数字替换成右边，并将右边设置为0
         * 2、右边数字大于0，左边数字等于右边，则左边*2，并将右边设置为0；不等于则跳过
         * 返回移动过程中增加的分数
         */
        function merge(get, set) {
            let score = 0;
            for (let i = 0; i < size; i++) {
                let valueI = get(i);
                for (let j = i + 1; j < size; j++) {
                    let valueJ = get(j);

                    if (valueJ > 0) {
                        if (valueI === 0) {
                            valueI = set(i, valueJ);
                            set(j, 0);
                            continue;
                        } else {
                            if (valueI === valueJ) {
                                set(i, valueJ * 2);
                                set(j, 0);
                                score += valueJ * 2;
                            }
                            break;
                        }
                    }
                }
            }
            return score;
        }
        /**
         * 方向处理
         */
        switch (direct) {
            case 'left':
                for (let r = 0; r < size; r++) {
                    score += merge(index => {
                        return this._matrix[r][index];
                    }, (index, value) => {
                        return this._matrix[r][index] = value;
                    });
                }
                break;
            case 'right':
                for (let r = 0; r < size; r++) {
                    score += merge(index => {
                        return this._matrix[r][size - index - 1];
                    }, (index, value) => {
                        return this._matrix[r][size - index - 1] = value;
                    });
                }
                break;
            case 'up':
                for (let c = 0; c < size; c++) {
                    score += merge(index => {
                        return this._matrix[index][c];
                    }, (index, value) => {
                        return this._matrix[index][c] = value;
                    });
                }
                break;
            case 'down':
                for (let c = 0; c < size; c++) {
                    score += merge(index => {
                        return this._matrix[size - index - 1][c];
                    }, (index, value) => {
                        return this._matrix[size - index - 1][c] = value;
                    });
                }
                break;
        }
        // 每次移动后新产生一个数字
        this.setNumber();
        return score;
    },

    /**
     * 重置游戏，将矩阵数字清空，设置为0
     */
    reset() {
        let size = this._size;
        let row = size;

        while (row--) {
            let col = size;
            while (col--) {
                this._matrix[row][col] = 0;
            }
        }
        // 重置游戏后需要在矩阵中产生一个新数字
        this.setNumber();
        return this._matrix;
    },

    setMatrix(size) {
        this._init(size);
        this.setNumber();
        return this._matrix;
    }

}


module.exports = Game;