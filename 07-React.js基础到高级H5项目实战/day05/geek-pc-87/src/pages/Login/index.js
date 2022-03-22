import { Form, Input, Button, Checkbox, message } from 'antd'

// 导入创建的 http
// import { http } from '../../utils/http'
// import { setToken } from '../../utils/token'
import { http, setToken } from '../../utils'

import './index.scss'

// 导入图片文件
import logo from '../../assets/images/logo.png'

// 1 表单校验
//  antd 的 Form 组件默认支持表单校验

const Login = ({ history, location }) => {
  const onFinish = async values => {
    // values 是一个对象
    // { mobile, code, remember } 也就是整个表单中所有项的值
    // console.log('表单校验成功：', values)
    const { code, mobile } = values

    // 可以通过 try-catch 来捕获代码中的错误、异常
    // 如果一段代码中可能会存在错误，那么，我们就可以
    // 使用 try-catch 来处理代码，让代码不是直接报错
    // 而是通过正确的方式来处理这个错误！！！
    try {
      // try 里面来放可能会出现错误的代码
      // 说明：此处的路径会在内部，与我们配置好的 baseURL 拼接到一块，来得到完整的接口路径
      const res = await http.post('/authorizations', {
        mobile,
        code
      })

      // console.log('登录结果：', res)
      // 登录成功：
      // 1 将 token 保存到 本地缓存 localStorage 中
      // localStorage.setItem('geek_pc_token_87', res.data.data.token)
      setToken(res.data.data.token)

      // 第一个参数：表示提示内容
      // 第二个参数：提示展示的时间长度，单位是：秒
      // 第三个参数：是一个回调，这个回调会在 提示关闭后 执行
      message.success('登录成功', 1, () => {
        // 2 跳转到后台首页
        //  通过路由的 编程式导航 来实现
        // history.push('/home')
        console.log('location', location)
        // 更严谨、用户体验更好的方式：
        // 判断 location.state 中是否有值
        if (location.state) {
          // 有值
          // 如果有值，就跳回到用户上一次访问的页面中
          history.push(location.state.from)
        } else {
          // 没有值
          // 如果没有值，说明就是普通的直接登录，此时，就直接跳转到后台首页
          history.push('/home')
        }
      })
    } catch (error) {
      // 捕获错误、异常，然后，在此处就可以根据错误，来处理错误
      // console.dir(error)
      // console.dir(error.response.data.message)
      message.warning(error.response.data.message, 1)
    }

    // console.log('这句代码打印了吗？？？')
  }

  return (
    <div className="login">
      <div className="login-wrapper">
        <div>
          <img className="login-logo" src={logo} alt="" />
        </div>

        <Form
          className="login-form"
          // 给表单项设置默认值
          initialValues={{
            remember: true,
            mobile: '13388886666',
            // code 的类型应该是一个 字符串，否则，接口会报错
            code: '246810'
          }}
          // 注意：这个事件是在表单校验成功后调用的
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="mobile"
            // 配置表单校验规则
            rules={[
              // required 表示表单项为必填项
              { required: true, message: '请输入手机号码' },
              // 注意：此处的配置，仅仅是给出一个校验，不会限制输入的长度
              // { max: 11, message: '手机号码格式不正确' },
              // len 表示这一项的长度
              // message 表示该校验规则失败时，展示给用户的提示
              // { len: 11, message: '手机号码长度为11位' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确' }
            ]}
          >
            {/* maxLength 限制文本框中输入内容的长度 */}
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              { required: true, message: '请输入验证码' },
              {
                pattern: /^\d{6}$/,
                message: '请输入正确的验证码'
              }
            ]}
          >
            <Input placeholder="请输入验证码" maxLength={6} />
          </Form.Item>
          {/* 注意：Form.Item 配合 表单元素 来使用时，应该 一个 Form.Item 只能有一个唯一的表单元素子节点 */}
          {/* <Form.Item> */}
          {/* 
            Form.Item 中有一个属性叫做 noStyle 表示不添加样式
            去掉 noStyle 表示默认是有样式的
          */}
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
          </Form.Item>
          {/* </Form.Item> */}

          <Form.Item>
            {/* 注意：该 按钮 的类型为 submit，所以，才可以触发表单的校验、提交 */}
            {/* 是通过 htmlType="submit" 属性来指定的 */}
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
