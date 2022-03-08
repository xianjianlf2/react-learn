import React, { useRef } from 'react'

class FormStore {
  constructor() {
    //state仓库
    this.store = {}
    // 实例
    this.fieldEntities = []
    this.callbacks = {}
  }

  setCallbacks = (newCallbacks) => {
    this.callbacks = {
      ...this.callbacks,
      ...newCallbacks,
    }
  }

  // 订阅和取消订阅   监听和取消监听
  registerFieldEntities = (field) => {
    this.fieldEntities.push(field)

    // 取消订阅
    return () => {
      this.fieldEntities = this.fieldEntities.filter((_f) => _f != field)

      delete this.store[field.props.name]
    }
  }
  //get
  getFieldsValue = () => {
    return { ...this.store }
  }

  getFieldValue = (name) => {
    return this.store[name]
  }

  //ser {username:123}
  setFieldsValue = (newStore) => {
    this.store = {
      ...this.store,
      ...newStore,
    }

    // 组件没有更新
    // 订阅对应的组件更新
    // 组件卸载时取消订阅

    this.fieldEntities.forEach((_f) => {
      Object.keys(newStore).forEach((key) => {
        if (key === _f.props.name) {
          _f.onStoreChange()
        }
      })
    })
  }

  validate = () => {
    let err = []

    // TODO 校验
    return err
  }

  submit = () => {
    let err = this.validate()
    if (err.length === 0) {
      // 校验通过
      // onFinish
      this.callbacks.onFinish(this.getFieldsValue())
    } else {
      // 校验不通过
      // onFinishFailed
      this.callbacks.onFinishFailed(err, this.getFieldsValue())
    }
  }

  getForm = () => {
    return {
      getFieldsValue: this.getFieldsValue,
      getFieldValue: this.getFieldValue,
      setFieldsValue: this.setFieldsValue,
      registerFieldEntities: this.registerFieldEntities,
      submit: this.submit,
      setCallbacks: this.setCallbacks,
    }
  }
}

export default function useForm(form) {
  const formRef = useRef()
  //把getFrom存起来，目的  保证组件每次更新用的都是这个getForm
  if (!formRef.current) {
    if (form) {
      formRef.current = form
    } else {
      const formStore = new FormStore()
      formRef.current = formStore.getForm()
    }
  }

  return [formRef.current]
}
