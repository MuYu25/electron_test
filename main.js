const { app, BrowserWindow } = require('electron');

function createWindow() {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 你的 React 应用构建目录，例如：'./path/to/your-react-build'
  const startUrl = `file://${__dirname}/build/index.html`;

  // 加载起始页
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);