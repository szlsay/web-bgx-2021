import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
class App extends PureComponent {
  state = {
    msg: 'hello',
    user: {
      name: 'zs',
      age: 18,
    },
  }
  render() {
    console.log('render')
    return (
      <div>
        <h1>app组件--{this.state.msg}</h1>
        <div>
          {this.state.user.name} - {this.state.user.age}
        </div>
        <button onClick={this.handleClick}>修改</button>
      </div>
    )
  }
  handleClick = () => {
    // this.setState({
    //   msg: 'world',
    // })
    // this.state.user.age = 20
    this.setState({})
  }
}

// 渲染组件
ReactDOM.render(<App />, document.getElementById('root'))
