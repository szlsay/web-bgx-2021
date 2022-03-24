import { useSelector, useDispatch } from 'react-redux'
import { add } from './store/action'
export default function Child() {
  // 调用useStore就可以得到store对象
  // 调用useSelector 得到 store中数据
  // const store = useStore()
  const count = useSelector((state) => state)
  const dispatch = useDispatch()
  return (
    <div>
      <h3>我是子组件---点击了{count}次</h3>
      <button onClick={() => dispatch(add())}>修改</button>
    </div>
  )
}
