import type React from "react"
import styles from "./Alert.module.css"

interface AlertProps {
  children: React.ReactNode
  variant?: "default" | "error" | "warning" | "success" | "info"
  className?: string
}

const Alert: React.FC<AlertProps> = ({ children, variant = "default", className }) => {
  return <div className={`${styles.alert} ${styles[variant]} ${className || ""}`}>{children}</div>
}

export default Alert
