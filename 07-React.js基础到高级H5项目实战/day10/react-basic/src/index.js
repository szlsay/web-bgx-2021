import { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'
function App() {
  const [list, setList] = useState([])
  useEffect(() => {
    let isCancel = false
    const getList = async () => {
      const res = await axios.get('http://geek.itheima.net/v1_0/channels')
      if (isCancel) return
      setList(res.data.data.channels)
    }
    getList()
    return () => {
      // 取消请求
      isCancel = true
    }
  }, [])

  return (
    <div>
      <h1>频道列表</h1>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}

ReactDom.render(<App></App>, document.getElementById('root'))
