import { createElement, FunctionComponent, useRef } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

// modal中用到context时不要使用，静态方法之痛 https://ant-design.antgroup.com/docs/blog/why-not-static-cn
const useModal = <T,>(component: FunctionComponent<T>) => {
  const elRef = useRef<HTMLDivElement | null>()

  const openModal = (modalProps: T) => {
    elRef.current = document.createElement('div')
    document.body.appendChild(elRef.current)
    const el = createElement(component, modalProps)
    render(el, elRef.current)
  }

  const closeModal = () => {
    elRef.current && unmountComponentAtNode(elRef.current) && document.body.removeChild(elRef.current)
    elRef.current = null
  }

  return {
    openModal,
    closeModal,
  }
}

export default useModal
