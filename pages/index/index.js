Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: '',
    todos: [],
    leftCnt: 0,
    allFinished: false,
    logs: []
  },
  
  /**
   * 保存数据到storage
   */
  save: function() {
    wx.setStorageSync('todo_list', this.data.todos);
    wx.setStorageSync('todo_logs', this.data.logs);
  },

  /**
   * 获取输入内容
   */
  inputChangeHandle: function (e) {
    this.setData({
        input: e.detail.value
    });
  },

  /**
   * 添加任务函数
   */
  addTodoHandle: function () {
    if (!this.data.input || !this.data.input.trim()) {
        return false;
    }

    let todos = this.data.todos;
    todos.push({
        name: this.data.input,
        finished: false
    });

    let logs = this.data.logs;
    logs.push({
        timestamp: +new Date(),
        action: 'Add',
        name: this.data.input
    });

    this.setData({
        input: '',
        todos: todos,
        leftCnt: this.data.leftCnt + 1,
        logs: logs
    });

    this.save();
  },

  /**
   * toggle任务函数
   */
  toggleTodoHandle: function (e) {
      const index = e.currentTarget.dataset.index;
      let todos = this.data.todos;
      todos[index].finished = !todos[index].finished;

      let logs = this.data.logs;
      logs.push({
          timestamp: +new Date(),
          action: todos[index].finished ? 'Finished' : 'Restart',
          name: todos[index].name
      });
      this.setData({
          todos: todos,
          leftCnt: this.data.leftCnt + (todos[index].finished ? -1 : 1),
          logs: logs
      });
      
      this.save();
  },

  /**
   * 删除任务函数
   */
  removeTodoHandle: function (e) {
      const index = e.currentTarget.dataset.index;
      let todos = this.data.todos;
      let remove = todos.splice(index, 1)[0];
      let logs = this.data.logs;

      logs.push({
          timestamp: +new Date(),
          action: 'Remove',
          name: remove.name
      });
      this.setData({
          todos: todos,
          leftCnt: this.data.leftCnt - (remove.finished ? 0 : 1),
          logs: logs
      });

      this.save();
  },

  /**
   * toggle所有任务函数
   */
  toggleAllHandle: function(e) {
    this.data.allFinished = !this.data.allFinished;
    let todos = this.data.todos;

    for (let i = todos.length - 1; i >= 0; i--) {
        todos[i].finished = this.data.allFinished;
    }

    let logs = this.data.logs;
    logs.push({
        timestamp: +new Date(),
        action: this.data.allFinished ? 'Finish' : 'Restart',
        name: 'All todos'
    });

    this.setData({
        todos: todos,
        leftCnt: this.data.allFinished ? 0 : todos.length,
        logs: logs
    });

    this.save();
  },
  /**
   * 清理完成任务函数
   */
  clearFinishedHandle: function (e) {
    let todos = this.data.todos;
    let remains = [];

    for (let i = 0; i < todos.lengthl; i++) {
        todos[i].finished || remains.push(todos[i]);
    }

    let logs = this.data.logs;
    logs.push({
        timestamp: +new Date(),
        action: 'Clear',
        name: 'Finished todos'
    });

    this.setData({
        todos: remains,
        logs: logs
    });

    this.save();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let todos = wx.getStorageSync('todo_list');
    if (todos && todos.length) {
        let leftCnt = todos.filter(item => !item.finished).length;
        this.setData({
            todos: todos,
            leftCnt: leftCnt
        });
    }
    let logs = wx.getStorageSync('todo_logs');
    if (logs && logs.length) {
        this.setData({
            logs: logs
        });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})