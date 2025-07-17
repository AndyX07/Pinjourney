import type React from "react"
import styles from "./Button.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "default", className, ...props }) => {
  const buttonClass = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${className || ""}
    ${props.disabled ? styles.disabled : ""}
  `

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  )
}

export default Button
