import React, { useRef } from 'react'
import { startCase } from 'lodash'
import { Icon } from './Icon'

type IconButtonProps = {
  className?: string
  modalClick?: Function
  name: string
  onClick?: Function
  text?: string
  textAfter?: boolean
  textClassName?: string
  tooltip: string
}

export const IconButton: React.FC<IconButtonProps> = (props) => {
  const {
    className,
    modalClick,
    name,
    onClick,
    text,
    textAfter = false,
    textClassName,
    tooltip,
  } = props

  const btnRef = useRef(null)

  const handleClick = (_e: React.MouseEvent<HTMLElement>) => {
    modalClick && modalClick(btnRef)
    onClick && onClick()
  }

  const butt = () => (
    <React.Fragment>
      {!textAfter && text && (
        <p className={`icon-button__text ${textClassName}`}>{text}</p>
      )}
      <Icon name={name} className={`icon-button__icon ${className}`} />
      {textAfter && text && (
        <p className={`icon-button__text ${textClassName}`}>{text}</p>
      )}
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <button
        title={tooltip ? tooltip : startCase(name)}
        className="icon-button no-print"
        onClick={handleClick}
        ref={btnRef}
      >
        {butt()}
      </button>
    </React.Fragment>
  )
}
