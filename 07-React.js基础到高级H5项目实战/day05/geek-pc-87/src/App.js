// lazy 懒
import { lazy, Suspense } from 'react'
import { Router, Route, Redirect } from 'react-router-dom'

import { history } from './utils/history'

import './App.css'

// 在 App 组件中配置路由
import { AuthRoute } from './components/AuthRoute'

// 导入页面组件
// import Login from './pages/Login'
// import Layout from './pages/Layout'
const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import('./pages/Layout'))

const App = () => {
  return (
    // 自定义 history
    <Router history={history}>
      {/* 如果 动态加载的组件还没有加载出来，此时，就展示 fallback 中的内容，此处就是 loading */}
      {/* 如果 动态加载的组件加载完成了，此时，就展示组件的内容，loading 就消失了 */}
      <Suspense
        fallback={
          <div
            style={{
              textAlign: 'center',
              marginTop: 200
            }}
          >
            loading...
          </div>
        }
      >
        <div className="app">
          {/*
            默认路由，推荐添加一个 exact 精确匹配

            如果没有登录，应该进入登录页面
            如果登录了，应该展示后台首页

            通过分析，实际上，直接访问 /home 后台首页即可
            因为：后台首页（/home） 是通过 AuthRoute 鉴权路由组件来配置的，这个鉴权路由组件中
            已经处理过登录的判断了，所以，只要访问 /home 就会自动跳转到相应的页面
          */}
          <Route exact path="/" render={() => <Redirect to="/home" />}></Route>

          {/* 配置路由 */}
          <Route path="/login" component={Login}></Route>

          {/* 测试 AuthRoute 组件 */}
          <AuthRoute path="/home" component={Layout}></AuthRoute>
        </div>
      </Suspense>
    </Router>
  )
}

export default App
