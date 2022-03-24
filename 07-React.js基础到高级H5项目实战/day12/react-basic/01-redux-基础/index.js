import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
/* 
  react-redux的使用步骤
    1. 安装 yarn add react-redux
    2. 导入Provider组件 并且使用Provider组件包裹App组件
    3. 在任意的子组件中都可以获取到store
*/

ReactDom.render(
  <Provider store={store}>
    <App></App>
  </Provider>,
  document.getElementById('root')
)
