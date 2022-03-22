import { Component, createRef } from 'react'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  message
  // message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { http } from '../../utils'

// 导入封装好的 Channel 组件
import Channel from '../../components/Channel'

import 'react-quill/dist/quill.snow.css'
import './index.scss'
class ArticlePublish extends Component {
  state = {
    // 文章详情数据
    article: {},

    // 封面图片的选中值
    selectedValue: 1,

    // 图片上传对应图片列表
    fileList: [
      // {
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      // }
    ]
  }

  // 是否为编辑
  isEdit = typeof this.props.match.params.id !== 'undefined'

  // 1. 创建一个 ref 对象
  formRef = createRef()

  componentDidMount() {
    // 通过 判断 id 是否为 undefined 来区分是否有id
    // if (typeof this.props.match.params.id !== 'undefined') {
    //   this.getArticleById()
    // }

    // if (this.isEdit) {
    //   this.getArticleById()
    // }

    // 简化：
    this.isEdit && this.getArticleById()
  }

  async getArticleById() {
    // 从 路由信息 中获取到 路由参数 id 的值
    const id = this.props.match.params.id
    const res = await http.get(`/mp/articles/${id}`)

    // 1. 从文章详情接口返回的数据中，拿到 `cover` 数据（ 这里面有我们需要的图片地址 ）
    const { cover } = res.data.data
    // console.log('cover', cover)
    const { images, type } = cover
    // 2. 利用数据格式的转换，来将 cover 中的数据，转化为 fileList 需要的数据格式
    // images -> ["http://geek.itheima.net/resources/images/94.jpg"]
    // fileList -> [ { url } ]
    const fileList = images.map(url => {
      return {
        url
      }
    })
    // console.log(fileList)
    // 3 使用转化后的数据，更新为 fileList 状态
    this.setState({
      article: {
        ...res.data.data,
        // 因为 Form.Item 中需要这个数据，所以，此处直接将 type 添加给 article
        type
      },
      // 已上传图片的数据
      fileList,

      // 注意：通过接口拿到 type（ 也就是图片可选择数量 ），用它来更新 selectedValue 状态
      //      这样，才能让 Upload 中 maxCount 是正确的！！！
      selectedValue: type
    })

    // instance 实例
    const formInstance = this.formRef.current
    formInstance.setFieldsValue({
      ...res.data.data,
      // 因为 Form.Item 中需要这个数据，所以，此处直接将 type 添加给 article
      type
    })
  }

  // 表单提交
  // 1. 直接在 Form 表单的 onFinish 事件处理程序中，来获取到表单中的所有数据
  // 2. 将拿到的表单数据，按照接口的要求，来进行数据格式化
  // 3. 将格式化后的数据，传递给接口
  // 4. 根据接口返回的数据，做出相应的处理
  onFinish = values => {
    // 直接调用封装好的方法
    this.save(values, false)
  }

  // 处理封面
  // 1. 给 Radio 绑定 `onChange` 事件
  // 2. 在 onChange 中，拿到当前选中项的值
  // 3. 根据不同的选中项进行不同的处理
  //  3.1 如果是单图（1），要展示上传图片组件，此时，只能上传一张图片
  //  3.2 如果是三图（3），要展示上传图片组件，此时，可以上传三张图片
  //  3.3 如果是无图（0），不展示上传图片组件
  // 因为这个数据，要控制页面内容的展示和隐藏，所以，此处，我们将选中值添加为组件的状态
  // 将来，通过状态来控制页面中内容的展示或隐藏
  changeImageType = e => {
    // console.log('changeImageType', e)
    const selectedValue = e.target.value

    // console.log('选中项的值', selectedValue)
    this.setState({
      selectedValue
    })
  }

  // 上传图片的方法的参数，是一个对象（data）
  uploadImages = data => {
    // console.log('Upload onChange', data)
    // if (data.file.status === 'removed') {
    //   // 删除
    //   console.log('删除：')
    //   // 只需要将当前图片，从 fileList 中移除即可
    // } else {
    //   // 注意：onChange 只触发一次的问题，需要不管什么情况下，都要更新 fileList
    //   this.setState({
    //     fileList: [...data.fileList]
    //   })
    // }
    // const status = data.file.status

    // if (status === 'done') {
    //   // 图片上传完成
    //   console.log(data)
    //   const urls = data.fileList.map(item => {
    //     // console.log(item.response.data.url)
    //     return item.response.data.url
    //   })

    //   console.log('上传图片的地址：', urls)
    // }

    this.setState({
      fileList: [...data.fileList]
    })
  }

  // uploadImages = (...rest) => {
  //   console.log(rest)
  // }

  // 存入草稿
  saveDraft = async () => {
    // 1. 给存入草稿按钮绑定点击事件
    // 2. 在事件中，拿到表单中的数据
    // 通过 ref 来获取表单中所有元素的值
    // 注意： validateFields() 方法，会触发 Form 表单的校验
    //      如果校验成功了，可以直接通过返回值 values 拿到表单中的数据
    //      如果校验失败了，因为页面中直接在 Form 中已经提示了错误信息，所以，代码中不用做任何处理
    try {
      const values = await this.formRef.current.validateFields()
      // 直接调用封装好的方法
      this.save(values, true)
    } catch (e) {}
  }

  // 封装保存数据的方法 - 用来实现文章的编辑、发布以及相应的存入草稿功能
  save = async (values, isDraft) => {
    const id = this.props.match.params.id
    const { type, ...restValues } = values
    const { fileList } = this.state
    const images = fileList.map(item => {
      if (item.url) {
        return item.url
      }
      return item.response.data.url
    })
    const cover = {
      type: type,
      images
    }
    const data = {
      ...restValues,
      cover
    }

    let url = ''
    let msg = ''

    if (this.isEdit) {
      // 编辑时
      if (isDraft) {
        // 草稿
        url = `/mp/articles/${id}?draft=true`
        msg = '存入草稿成功'
      } else {
        // 非草稿
        url = `/mp/articles/${id}`
        msg = '修改成功'
      }
      const res = await http.put(url, data)

      if (res.data.message.toLowerCase() === 'ok') {
        message.success(msg, 1)
      }
    } else {
      // 发布时
      if (isDraft) {
        // 草稿
        url = '/mp/articles?draft=true'
        msg = '存入草稿成功'
      } else {
        url = '/mp/articles'
        msg = '发布成功'
      }

      const res = await http.post(url, data)
      if (res.data.message.toLowerCase() === 'ok') {
        message.success(msg, 1)
      }
    }
  }

  render() {
    const { selectedValue, fileList } = this.state

    return (
      <div>
        <Card
          title={
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {this.isEdit ? '修改文章' : '发布文章'}
              </Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          {/* span 表示占用了 4 格，一共 24 格 */}
          <Form
            ref={this.formRef}
            labelCol={{ span: 4 }}
            initialValues={{ type: 1, content: '' }}
            onFinish={this.onFinish}
          >
            {/* <Form.Item hidden name="id">
              <Input type="hidden" />
            </Form.Item> */}
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入文章标题' }]}
            >
              <Input placeholder="请输入文章标题" style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label="频道"
              name="channel_id"
              rules={[{ required: true, message: '请选择文章频道' }]}
            >
              <Channel width={400} />
            </Form.Item>

            <Form.Item label="封面">
              <Form.Item name="type">
                <Radio.Group onChange={this.changeImageType}>
                  <Radio value={1}>单图</Radio>
                  <Radio value={3}>三图</Radio>
                  <Radio value={0}>无图</Radio>
                  {/* <Radio value={-1}>自动</Radio> */}
                </Radio.Group>
              </Form.Item>

              {/* 上传图片组件 */}
              {selectedValue !== 0 && (
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList
                  maxCount={selectedValue}
                  action="http://geek.itheima.net/v1_0/upload"
                  onChange={this.uploadImages}
                  fileList={fileList}
                >
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined />
                  </div>
                </Upload>
              )}
            </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: '请输入文章内容' }]}
            >
              <ReactQuill
                className="publish-quill"
                theme="snow"
                placeholder="请输入文章内容"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size="large" type="primary" htmlType="submit">
                  {this.isEdit ? '修改文章' : '发布文章'}
                </Button>
                <Button size="large" onClick={this.saveDraft}>
                  存入草稿
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default ArticlePublish
