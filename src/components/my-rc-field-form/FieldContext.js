import React, { createContext } from 'react'
// context 创建context对象

const FieldContext = React.createContext()

export default FieldContext

//2 通过Provider传递参数

//3. 后代消费value

// 1.contextType   类组件，只能订阅单一context来源
// 2.useContext    只能用在函数组件或者自定义Hook中
// 3.Consumer
