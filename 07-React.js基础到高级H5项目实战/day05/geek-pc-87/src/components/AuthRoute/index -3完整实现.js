/**
 * 封装一个 AuthRoute 组件，来实现登录访问控制
 * 也就是：
 *  1 判断用户是否登录
 *  2 如果登录了，就允许访问页面组件的内容
 *  3 如果没有登录，就跳转到登录页面，让用户登录
 *
 * 分析：因为在 SPA 中，任何一个页面都是通过路由（Route）来访问的，所以，路由是一个非常适合来进行
 *      登录访问控制的地方
 *      但是，路由中的 Route 是没有登录访问控制的功能的，所以，我们需要自己对 Route 进行
 *      封装，来实现这个功能
 *
 * 我们需要做到：
 *  1 保证 AuthRoute 鉴权路由的用法与原始 Route 用法完全一致，这样，可以减少学习成本
 */

import { Route } from 'react-router-dom'

import { isAuth } from '../../utils'

// 封装路由的 Route 组件
// Route 的用法：<Route exact path="/login" component={Login}></Route>
// AuthRoute 的用法：<AuthRoute exact path="/login" component={Login}></AuthRoute>
//
// 注意：因为现在 AuthRoute 组件可以觉得要不要渲染 component 组件
//      所以，我们需要对 component 属性，来进行特殊的处理

// const Home1 = () => {
//   return <div>Home1 组件</div>
// }

// // 渲染：
// <Home1 />
// const Home2 = Home1
// <Home2 />

// { component, ...rest } 表示：单独解构出 component 属性，剩余的所有其他属性，都放在 rest 中
// { component: Comp } 表示：在解构对象属性的同时，对属性进行重命名
const AuthRoute = ({ component: Comp, ...rest }) => {
  // const Comp = component
  return (
    <Route
      {...rest}
      // render 的值是一个回调函数
      render={props => {
        // props 参数：就是当前路由的信息
        // console.log('Route render props:', props)
        // *  1 判断用户是否登录 如果有 token 就说明登录了
        const isLogin = isAuth()
        if (isLogin) {
          // *  2 如果登录了，就允许访问页面组件的内容
          // return <Comp a="1" />
          // {...props} 就是将当前路由的信息，传递给组件
          // 这样，组件才能够通过 props 接收到路由信息
          return <Comp {...props} />
        }
        // *  3 如果没有登录，就跳转到登录页面，让用户登录
        props.history.push('/login')
      }}
    />
  )
}

export { AuthRoute }
