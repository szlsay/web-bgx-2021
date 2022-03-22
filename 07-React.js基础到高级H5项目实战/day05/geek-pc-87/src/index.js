import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'

// 注意：导入样式文件的顺序，先导入 antd 的样式，再倒入自己的样式
//      这样，才能够保证能够覆盖 antd 的样式
// 导入 antd 组件库的样式
import 'antd/dist/antd.css'
// 全局样式
import './index.css'
// App 根组件
import App from './App'

// 配置 antd 的国际化语言，也就是设置为全局中文
// moment 包：用来专门处理 日期 的包
import 'moment/locale/zh-cn'
import locale from 'antd/lib/locale/zh_CN'

ReactDOM.render(
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
)
