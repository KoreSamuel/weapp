const app = getApp();

const Game = require('./game.js');

const INIT_SIZE = 4;

/**
 * 获取移动方向
 * 根据手指touchstart,touchend滑动的距离判断
 * x判断左右，y判断上下
 */
const getDirect = (x, y) => {
    if (!x && !y) return 'stoped'
    if (Math.abs(x) > Math.abs(y)) {
        return x > 0 ? 'left' : 'right';
    } else {
        return y > 0 ? 'up' : 'down';
    }
};

Page({
    data: {
        score: 0,  // 存放单次总分
        windowWidth: 0, // 窗口宽度
        windowHeight: 0, // 窗口高度
        gameWidth: 0, // 游戏窗口宽度
        cells: [], // 网格位置
        cellSize: 0,  // 单个格子大小比例
        matrix: [], // 数字矩阵
        bestScore: 0 // 最高分
    }, 
    onLoad() {
        let data = wx.getStorageSync('_cur_game_data_');
        let bestScore = wx.getStorageSync('_best_score_');
        if (bestScore) {
            this.setData({
                bestScore
            });
        }
        // 存在缓存数据则继续开始游戏
        if (data) {
            this._reload(data);
        }
        // 否则获取系统信息，新启游戏
        else {
            const success = info => {
                const { windowWidth, windowHeight } = info;
                let gameWidth = Math.min(windowWidth - 20, windowHeight - 140 - 20);
                let { score, cells, cellSize, matrix, bestScore } = this._mode(INIT_SIZE, gameWidth);

                this.setData({
                    windowWidth,
                    windowHeight,
                    gameWidth,
                    cells,
                    cellSize,
                    score,
                    matrix,
                    bestScore
                });
            };
            wx.getSystemInfo({ success });
        }
    },

    onShareAppMessage: function () {
        return {
            title: '一个简单的2048小游戏',
            path: '/pages/2048/2048',
            success: function (res) {
                console.log(res)
            },
            fail: function (res) {
               console.log(res)
            }
        }
    },
    /**
     * 初始化游戏信息
     * 分数，格子大小，布局位置，数字矩阵
     */
    _mode(n, gameWidth) {
        this._game = this._game || new Game(n, gameWidth);

        let score = 0;
        let bestScore = 0;
        let cellSize = 100 / n;
        let cells = [];
        let index = 0;
        let game = this._game;
        let matrix = game.setMatrix(n);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                cells.push({
                    index,
                    row: i,
                    col: j
                });
                index++;
            }
        }

        return { score, cells, cellSize, matrix, bestScore};
    },
    /**
     * 起点
     */
    touchStart(evt) {
        const { clientX, clientY } = evt.changedTouches[0]
        this.pointA = {
            x: clientX,
            y: clientY,
        }

    },

    /**
     * 终点，并获取方向
     */
    touchEnd(evt) {
        const { clientX, clientY } = evt.changedTouches[0]
        this.pointB = {
            x: clientX,
            y: clientY,
        }

        let x = this.pointA.x - this.pointB.x;
        let y = this.pointA.y - this.pointB.y;

        let direct = getDirect(x, y);

        // 没有移动则不触发
        if (x || y) {
            // 一次移动增加的分数
            const scoreAdd = this._game.move(direct);

            // 总分
            const score = this.data.score + scoreAdd;

            let bestScore = 0;

            if (score > this.data.bestScore) {
                bestScore = score;
            }

            // 更新分数
            this.setData({
                scoreAdd,
                score,
                bestScore
            });

            // 更新数据矩阵，并将数据保存
            setTimeout(() => {
                this.setData({
                    matrix: this._game.value
                })

                setTimeout(() => {
                    this._save();
                }, 10)
            }, 80);
        }

    },

    /**
     * 游戏重置
     */
    Reset() {
        let matrix = this._game.reset()
        this.setData({
            matrix,
            score: 0,
        })
    },

    _save() {
        wx.setStorage({ key: '_cur_game_data_', data: this.data })
    },

    /**
     * 重启
     */
    _reload(data) {
        this._game = Game.restart({
            matrix: data.matrix,
            panelWidth: data.gameWidth,
            size: data.matrix.length,
        })

        this.setData(data)
    },
})