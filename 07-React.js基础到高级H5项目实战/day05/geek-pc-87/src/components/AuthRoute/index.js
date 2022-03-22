// Redirect 重定向，也就是路由跳转的组件
import { Route, Redirect } from 'react-router-dom'

import { isAuth } from '../../utils'

// 用法： <AuthRoute path="/home" component={Layout}></AuthRoute>
const AuthRoute = ({ component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      // render 可以在不创建一个额外组件的情况下，帮我们渲染一些内容
      // render 方法用来实现内联的渲染，也就是直接通过回调函数的返回值来指定渲染的内容
      //        所以，推荐大家不管什么情况下，都要保证这个回调函数是有返回值的
      render={props => {
        // props 可以拿到当前路由的信息
        // console.log(props.location)

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
        // 注意：push 方法的第二个参数就是 state，所以，直接传递对象，不需要再嵌套一个 state！
        // props.history.push('/login', {
        //   from: props.location.pathname
        // })
        // return null

        return (
          <Redirect
            to={{
              pathname: '/login',
              // state 表示路由跳转时携带的额外的数据
              // 此处，我们通过 from 属性，来将当前页面的地址传递给了 登录页面
              state: { from: props.location.pathname }
            }}
          />
        )
      }}
    />
  )
}

export { AuthRoute }
