import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/api"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import Alert from "../../components/Alert/Alert"
import { MapPin, Eye, EyeOff, LogIn } from "lucide-react"
import styles from "./Login.module.css"

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const res = await api.post("/auth/login/", formData);
            localStorage.setItem("accessToken", res.data.access);
            localStorage.setItem("refreshToken", res.data.refresh);
            navigate('/dashboard');
        }
        catch (err) {
            setError("Login failed. Check your credentials.")
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        if (error) setError("")
    }

    return (
        <main className={styles.loginMain}>
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <div className={styles.logoContainer}>
                        <img src="logo.png" className={styles.logoImage} />
                    </div>
                    <Card>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Sign in</h2>
                            <p className={styles.cardDescription}>Enter your credentials to access your account</p>
                        </div>
                        <div className={styles.cardContent}>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                {error && (
                                    <Alert variant="error">
                                        <p>{error}</p>
                                    </Alert>
                                )}

                                <div className={styles.formGroup}>
                                    <label htmlFor="username" className={styles.label}>
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="password" className={styles.label}>
                                        Password
                                    </label>
                                    <div className={styles.passwordWrapper}>
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            required
                                            disabled={isLoading}
                                            className={styles.passwordInput}
                                        />
                                        <button
                                            type="button"
                                            className={styles.passwordToggle}
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className={styles.submitButton} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <div className={styles.spinner} />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className={styles.buttonIcon} />
                                            Sign in
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className={styles.registerPrompt}>
                                <span>Don't have an account? </span>
                                <Link to="/register" className={styles.link}>
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    )
}

export default Login
