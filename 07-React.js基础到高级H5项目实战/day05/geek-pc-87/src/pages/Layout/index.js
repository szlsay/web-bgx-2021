import React, { Suspense } from 'react'
import { Layout, Menu, Popconfirm } from 'antd'
import {
  LogoutOutlined,
  HomeOutlined,
  DiffOutlined,
  EditOutlined
} from '@ant-design/icons'
import { Route, Link } from 'react-router-dom'
import { Component } from 'react'

import { http, removeToken } from '../../utils'

// import Home from '../Home'
// import ArticleList from '../ArticleList'
// import ArticlePublish from '../ArticlePublish'

import './index.scss'

const Home = React.lazy(() => import('../Home'))
const ArticleList = React.lazy(() => import('../ArticleList'))
const ArticlePublish = React.lazy(() => import('../ArticlePublish'))

const { Header, Content, Sider } = Layout

class LayoutHome extends Component {
  state = {
    // 用户名
    name: '',

    // 控制菜单高亮的状态
    selectedKey: ''
  }

  // 退出
  logout = () => {
    // 1 从本地缓存中删除 token
    // localStorage.removeItem('geek_pc_token_87')
    removeToken()
    // 2 返回登录页面
    console.log('Layout 组件的 props', this.props)
    this.props.history.push('/login')
  }

  // 获取用户信息
  async getUserInfo() {
    try {
      const res = await http.get('/user/profile', {
        // headers: {
        //   // 注意：需要添加 token 到请求头中，否则，调用接口失败
        //   Authorization: `Bearer ${getToken()}`
        // }
      })
      // console.log('个人信息：', res)
      this.setState({
        name: res.data.data.name
      })
    } catch (e) {}
  }

  componentDidMount() {
    // 注意：不要忘记在此处调用获取用户信息的方法
    this.getUserInfo()

    // console.log(this.props)
    let pathname = this.props.location.pathname
    if (pathname.startsWith('/home/publish')) {
      pathname = '/home/publish'
    }
    this.setState({
      selectedKey: pathname
    })
  }

  // prevProps 表示：上一次的 props
  // prevState 表示：上一次的 state
  componentDidUpdate(prevProps, prevState) {
    // console.log('上一次的 props', prevProps)
    // console.log('当前的 props', this.props)
    // 条件：路由地址改变了，再更新状态
    //      通过比较当前的 pathname 和 上一次的 pathname 就可以知道，路由地址是否改变了
    if (prevProps.location.pathname !== this.props.location.pathname) {
      let pathname = this.props.location.pathname
      // console.log(pathname)
      // 可以处理 /home/publish/8e368d67-e4ca-4f08-9433-29f5b9d85cdc 的情况
      if (pathname.startsWith('/home/publish')) {
        pathname = '/home/publish'
      }

      this.setState({
        selectedKey: pathname
      })
    }
  }

  render() {
    return (
      <Layout className="layout-wrapper">
        {/* 上方 - 标题 */}
        <Header className="header">
          <div className="layout-logo" />
          {/* 右侧内容 - 展示 */}
          <div className="user-info">
            <span>{this.state.name}</span>
            <Popconfirm
              title="是否确认退出？"
              onConfirm={this.logout}
              okText="确认"
              cancelText="取消"
            >
              <span className="logout">
                <LogoutOutlined /> 退出
              </span>
            </Popconfirm>
          </div>
        </Header>

        {/* 下方 - 内容 */}
        <Layout className="geek-layout">
          {/* 左侧 - 侧边栏菜单 */}
          <Sider width={200} className="site-layout-background">
            <Menu
              theme="dark"
              mode="inline"
              // defaultSelectedKeys 只对默认值生效，动态的 state 是无效的
              // defaultSelectedKeys={['/home']}
              // 如果数据是动态的（this.state.selectedKey），此时，应该使用 selectedKeys 属性
              selectedKeys={[this.state.selectedKey]}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="/home" icon={<HomeOutlined />}>
                <Link to="/home">数据概览</Link>
              </Menu.Item>
              <Menu.Item key="/home/list" icon={<DiffOutlined />}>
                <Link to="/home/list">内容管理</Link>
              </Menu.Item>
              <Menu.Item key="/home/publish" icon={<EditOutlined />}>
                <Link to="/home/publish">发布文章</Link>
              </Menu.Item>
            </Menu>
          </Sider>

          {/* 右侧 - 内容区域 */}
          {/* 添加 overflowY 实现区域滚动 */}
          <Layout style={{ padding: 24, overflowY: 'scroll' }}>
            <Content
              className="site-layout-background"
              // style={{
              //   padding: 24,
              //   margin: 0,
              //   minHeight: 280
              // }}
            >
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
                {/* 注意：嵌套路由的 path 可以和 父级路由的 path 相同 */}
                {/* 注意：此处需要添加一个 exact 精确匹配，这样，可以防止当 pathname 为 /home/list 也展示 /home 的内容 */}
                <Route exact path="/home" component={Home}></Route>
                <Route path="/home/list" component={ArticleList}></Route>
                {/* 
                :id 表示路有参数，将来就可以直接通过路由信息来拿到这个 id 参数了
              */}
                <Route
                  path="/home/publish/:id?"
                  component={ArticlePublish}
                ></Route>
              </Suspense>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default LayoutHome
