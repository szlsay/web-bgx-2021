// Redirect 重定向，也就是路由跳转的组件
import { Route, Redirect } from 'react-router-dom'

import { isAuth } from '../../utils'

// 用法： <AuthRoute path="/home" component={Layout}></AuthRoute>
const AuthRoute = ({ component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      // render 可以在不创建一个额外组件的情况下，帮我们渲染一些内容
      render={props => {
        // props 可以拿到当前路由的信息

        // 判断有没有登录
        const isLogin = isAuth()
        if (isLogin) {
          // 登录
          // 为了让组件能够通过 props 拿到路由相关信息，所以，此处需要将路由的信息
          // 传递给组件，组件才能拿到
          return <Comp {...props} />
          // return <div>123</div>
        }
        // 未登录，跳转到登录页面
        // props.history.push('/login')
        return <Redirect to={{ pathname: '/login' }} />
      }}
    />
  )
}

export { AuthRoute }
