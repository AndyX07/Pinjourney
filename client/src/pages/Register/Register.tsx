import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import axios from "axios"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import Alert from "../../components/Alert/Alert"
import { MapPin, Eye, EyeOff, UserPlus, Mail, User, Lock } from "lucide-react"
import styles from "./Register.module.css"

const Register: React.FC = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.username) {
            newErrors.username = "Username is required"
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters"
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const validationRes = validateForm();
        if (Object.keys(validationRes).length > 0) {
            setErrors(validationRes);
            setIsLoading(false);
            return;
        }
        try {
            const res = await api.post("/users/register/", { "username": formData.username, "email": formData.email, "password": formData.password });
            const loginRes = await api.post("/auth/login/", { "username": formData.username, "password": formData.password });
            localStorage.setItem("accessToken", loginRes.data.access);
            localStorage.setItem("refreshToken", loginRes.data.refresh);
            navigate("/dashboard");
        }
        catch (err) {
            if (axios.isAxiosError(err) && err.response && typeof err.response.data === "object") {
                const errorData = err.response.data as Record<string, string[]>;
                const newErrors: Record<string, string> = {};

                for (const key in errorData) {
                    if (Array.isArray(errorData[key])) {
                        newErrors[key] = errorData[key][0];
                    }
                }

                setErrors(newErrors);
            } else {
                setErrors({ general: "An unexpected error occurred. Please try again." });
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.logoContainer}>
                    <div className={styles.logo} onClick={() => navigate("/")}>
                        <img src="logo.png" className={styles.logoImage} />
                    </div>
                </div>
                <Card>
                    <header className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Create account</h2>
                        <p className={styles.cardDescription}>Enter your information to create your account</p>
                    </header>
                    <div className={styles.cardContent}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {errors.general && (
                                <Alert variant="error">
                                    <p>{errors.general}</p>
                                </Alert>
                            )}

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email
                                </label>
                                <div className={styles.inputWithIcon}>
                                    <Mail className={styles.inputIcon} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className={styles.iconInput}
                                    />
                                </div>
                                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="username" className={styles.label}>
                                    Username
                                </label>
                                <div className={styles.inputWithIcon}>
                                    <User className={styles.inputIcon} />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className={styles.iconInput}
                                    />
                                </div>
                                {errors.username && <p className={styles.errorText}>{errors.username}</p>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>
                                    Password
                                </label>
                                <div className={styles.passwordWrapper}>
                                    <Lock className={styles.inputIcon} />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className={styles.iconInput}
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
                                {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>
                                    Confirm Password
                                </label>
                                <div className={styles.passwordWrapper}>
                                    <Lock className={styles.inputIcon} />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className={styles.iconInput}
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
                            </div>

                            <Button type="submit" className={styles.submitButton} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <div className={styles.spinner} />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className={styles.buttonIcon} />
                                        Create account
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className={styles.loginPrompt}>
                            <span>Already have an account? </span>
                            <span className={styles.link} onClick={() => navigate("/login")}>
                                Sign in
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Register
