//logs.js
const util = require('../../utils/util.js');
Page({
  data: {
    logs: []
  },
  onShow: function () {
    let logs = wx.getStorageSync('todo_logs');
    if (logs && logs.length) {
        this.setData({
            logs: logs.reverse()
        });
    }
  }
})
