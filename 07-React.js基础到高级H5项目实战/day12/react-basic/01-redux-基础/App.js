// react和redux没有关系
import Child from './Child'
export default function App() {
  return (
    <div>
      <h1>根组件</h1>
      <div>我被点击了0次</div>

      <hr />
      <Child></Child>
    </div>
  )
}
