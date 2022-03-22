import { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Table,
  Tag,
  Space,
  Modal,
  message
} from 'antd'

import defaultImage from '../../assets/images/defaultImage.png'
import Channel from '../../components/Channel'
// import './index.scss'
import { http } from '../../utils'

const { RangePicker } = DatePicker
const { confirm } = Modal

// 通过对象来优化if/switch
// 使用方式：articleStatus[0] => { text: '草稿', color: '' }
const articleStatus = {
  0: { text: '草稿', color: 'gold' },
  1: { text: '待审核', color: 'lime' },
  2: { text: '审核通过', color: 'green' },
  3: { text: '审核失败', color: 'red' }
}

class ArticleList extends Component {
  state = {
    // 文章列表数据
    articles: {}
  }

  // {"id" ,"title" ,"status" ,"comment_count":0,"pubdate" ,"cover":{"type":3,"images":["http://geek.itheima.net/resources/images/80.jpg","http://geek.itheima.net/resources/images/79.jpg","http://geek.itheima.net/resources/images/47.jpg"]},"like_count" ,"read_count" }
  // 表格的配置项
  columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      // 此处，data 拿到的数据时 dataIndex 对应的数据，
      // 比如，此处拿到的就是 cover 的数据
      render: data => {
        // console.log('封面数据：', data)
        return (
          <img
            src={data.images[0] || defaultImage}
            alt=""
            width={200}
            height={150}
          />
        )
      }
    },
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => {
        const tagObj = articleStatus[data]
        return <Tag color={tagObj.color}>{tagObj.text}</Tag>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      // 如果配置中没有 dataIndex，此时， render 获取到的 data 为：整行数据
      render: data => {
        // console.log('操作', data.id)
        return (
          <Space>
            {/* 编辑按钮 */}
            {/* <Link to={`/home/publish?id=${data.id}`}>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              ></Button>
            </Link> */}

            {/* to="/home/publish/8192" */}
            <Link to={`/home/publish/${data.id}`}>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              ></Button>
            </Link>
            {/* 删除按钮 */}
            <Button
              type="primary"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                // 通过手动调用 this.deleteArticle 函数，来手动给该函数传递 id 参数
                this.deleteArticle(data.id)
              }}
            ></Button>
          </Space>
        )
      }
    }
  ]

  // 删除文章
  // 1. 给删除按钮绑定点击事件
  // 2. 在点击事件中，拿到当前要删除项的 id ，然后，弹窗让用户确认是否删除
  // 3. 用户点击取消，不作任何处理
  // 4. 用户点击确认，发送请求，删除该 id 对应的数据
  // 5. 重新调用获取文章列表数据的接口，获取删除后的数据
  deleteArticle = id => {
    // console.log(id)
    confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该文章, 是否继续?',
      // 注意：此处，需要使用箭头函数，否则，会有 this 指向的问题
      onOk: async () => {
        // console.log('OK')
        // try {
        // 4. 用户点击确认，发送请求，删除该 id 对应的数据
        const res = await http.delete(`/mp/articles/${id}`)
        // console.log('删除文章', res)
        if (res.data.message === 'OK') {
          // 提供删除成功
          message.success('删除成功', 0.6)
          // 5. 重新调用获取文章列表数据的接口，获取删除后的数据
          this.getList({
            ...this.queryParams,
            // 给 page 设置默认值，也就是，如果没有切换分页，就获取第一页的数据
            page: this.page || 1
          })
        }
        // } catch (e) {}
      }
      // onCancel() {
      //   // 取消按钮的回调
      //   console.log('Cancel')
      // }
    })
  }

  componentDidMount() {
    this.getArticles()
  }

  // 获取文章列表数据
  async getArticles() {
    this.getList()
  }

  // Form 的 提交事件
  query = async values => {
    // 表单中拿到的数据，无法直接作为接口的参数来使用，所以，需要对数据做处理
    const { status, channel_id, date } = values
    const queryParams = {}

    // 先处理状态：不传为全部，全部这一项的值为 -1
    if (status !== -1) {
      queryParams.status = status
    }

    // 处理频道
    if (channel_id) {
      queryParams.channel_id = channel_id
    }

    // 处理日期
    if (date) {
      // begin_pubdate
      const begin_pubdate = date[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
      // end_pubdate
      const end_pubdate = date[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
      queryParams.begin_pubdate = begin_pubdate
      queryParams.end_pubdate = end_pubdate
    }

    // 将筛选数据，存储到 this 中
    this.queryParams = queryParams

    // 调用封装好的方法
    this.getList(queryParams)
  }

  // 创建一个方法，用来封装 获取文章列表数据 的功能
  // 参数的默认值：params = {}
  // async getList(params = {}) {
  async getList(params) {
    // 参数默认值的原始写法
    params = params || {}
    const res = await http.get('/mp/articles', {
      params
    })
    this.setState({
      articles: res.data.data
    })
  }

  // 切换分页
  // 两种情况：
  //  1 如果没有筛选数据，直接传入 page 和 pageSize 即可
  //  2 如果有筛选数据，分页应该是基于筛选后的数据，进行分页，此时，就得拿到表单中的筛选数据，再传入 page 和 pageSize 才可以了
  // 所以，为了代码的实现，我们直接不管什么情况下，都拿到 表单的筛选数据，
  // 只不过，如果没有筛选数据，拿到一个空对象，有筛选数据，就拿到筛选数据
  changePage = (page, pageSize) => {
    // console.log(page, pageSize)
    // 1 拿到表单中的筛选数据
    // console.log('表单中的筛选数据', this.queryParams)
    // 2 组装请求参数
    const params = {
      ...this.queryParams,
      page,
      per_page: pageSize
    }

    // 将当前页存储到 this 中，这样，其他方法中就可以拿到 page
    this.page = page

    // 3 发请求拿数据
    this.getList(params)
  }

  render() {
    const {
      articles: { page, per_page, results, total_count }
    } = this.state

    return (
      <div>
        <Card
          title={
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>内容管理</Breadcrumb.Item>
            </Breadcrumb>
          }
          style={{ marginBottom: 20 }}
        >
          <Form
            initialValues={{
              status: -1
            }}
            onFinish={this.query}
          >
            <Form.Item label="状态" name="status">
              <Radio.Group>
                <Radio value={-1}>全部</Radio>
                <Radio value={0}>草稿</Radio>
                <Radio value={1}>待审核</Radio>
                <Radio value={2}>审核通过</Radio>
                <Radio value={3}>审核失败</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="频道" name="channel_id">
              <Channel width={200} />
            </Form.Item>

            <Form.Item label="日期" name="date">
              <RangePicker />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                筛选
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title={`根据筛选条件共查询到 ${total_count} 条结果：`}>
          {/* rowKey 表示使用数据源中的哪一个属性来作为 key 值 */}
          {/* 也就是：使用 results 数组中的每一项（{ id, title, ... }） 中的 id 这一项来作为 key 值 */}
          <Table
            columns={this.columns}
            dataSource={results}
            rowKey="id"
            pagination={{
              position: ['bottomCenter'],
              current: page,
              pageSize: per_page,
              total: total_count,
              // 每页大小 或者 页码 改变时，触发的事件
              onChange: this.changePage
            }}
          />
        </Card>
      </div>
    )
  }
}

export default ArticleList
