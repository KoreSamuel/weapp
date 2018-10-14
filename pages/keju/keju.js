// pages/keju/keju.js
const list = require('./data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: '',
    answer: []
  },

  /**
   * 获取输入内容
   */
  inputChangeHandle: function(e) {
    this.setData({
      input: e.detail.value
    });
  },
  /**
   * 搜索
   */
  search: function() {
    const input = this.data.input;
    if (input) {
      if (input.includes('、')) {
        this.poemJudge(input);
      } else {
        this.elseJudge(input);
      }
    }
  },

  /**
   * 诗词判断
   */
  poemJudge: function(input) {
    const wordArr = input.split('、');
    const answer = [];
    // console.log(list.filter(item => item[0].includes('、')), wordArr)
    list.filter(item => item[0].includes('、')).filter(item => {
      const q = item[0];
      if (wordArr.every(word => q.includes(word))) {
        answer.push(item)
      }
    });
    this.setData({
      answer
    })
  },

  elseJudge: function(input) {
    const answer = [];
    list.filter((item, index) => {
      const q = item[0];
      if (q.includes(input)) {
        answer.push(item);
      }
    });
    this.setData({
      answer
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})