import { Component } from 'react'
import { Select } from 'antd'
import { http } from '../../utils'

const { Option } = Select

class Channel extends Component {
  state = {
    channels: []
  }

  componentDidMount() {
    this.getChannles()
  }

  // 获取频道列表数据的方法
  async getChannles() {
    const res = await http.get('/channels')
    this.setState({
      channels: res.data.data.channels
    })
  }

  render() {
    const { channels } = this.state

    // 打印 props
    // console.log('Channel 组件', this.props)

    const { value, onChange, width } = this.props

    return (
      <Select
        value={value}
        onChange={onChange}
        placeholder="请选择文章频道"
        style={{ width }}
      >
        {channels.map(item => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    )
  }
}

export default Channel
