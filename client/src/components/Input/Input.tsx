import type React from "react"
import styles from "./Input.module.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return <input className={`${styles.input} ${props.disabled ? styles.disabled : ""} ${className || ""}`} {...props} />
}

export default Input
