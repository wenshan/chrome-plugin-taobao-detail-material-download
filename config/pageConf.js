module.exports = {
  main: { // 必须需要 main 入口
    entry: 'src/pages/index',
    template: 'public/index.html',
    filename: 'index', // 输出为 index.html，默认主入口
  },
  background: {
    entry: 'src/pages/background/index',
  },
  content: {
    entry: 'src/pages/content/index',
  },
  imgePage: {
    entry: 'src/pages/imgePage/index',
    template: 'src/pages/imgePage/index.html',
  },
  popup: {
    entry: 'src/pages/popup/index',
    template: 'public/index.html',
  },
};
