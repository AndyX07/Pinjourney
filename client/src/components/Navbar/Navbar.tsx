import type React from "react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { MapPin, Plus, BarChart3, ImageIcon, Menu, X, LogOut, Search } from "lucide-react"
import Button from "../Button/Button"
import styles from "./Navbar.module.css"

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/trips", label: "Trips", icon: ImageIcon },
    { href: "/recommendation", label: "Recommendation", icon: Search }
  ]

  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate('/login');
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            <img src="/logo.png" />
          </Link>

          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`${styles.navLink} ${location.pathname === item.href ? styles.activeLink : ""}`}
              >
                <item.icon className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className={styles.navLink}>
              <LogOut className={styles.navIcon} />
              <span>Logout</span>
            </button>
          </nav>

          <Button variant="primary" className={styles.desktopAddButton}>
            <Link to="/add-trip" className={styles.buttonLink}>
              <Plus className={styles.buttonIcon} />
              Add Trip
            </Link>
          </Button>

          <div className={styles.mobileNav}>
            <Button variant="primary" size="sm" className={styles.mobileAddButton}>
              <Link to="/add-trip" className={styles.buttonLink}>
                <Plus className={styles.buttonIcon} />
              </Link>
            </Button>

            <button className={styles.menuButton} onClick={toggleMenu}>
              <Menu className={styles.menuIcon} />
              <span className={styles.srOnly}>Toggle menu</span>
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.backdrop} onClick={closeMenu} />
          <div className={styles.menuPanel}>
            <div className={styles.menuContainer}>
              <div className={styles.menuHeader}>
                <Link to="/" className={styles.logo} onClick={closeMenu}>
                  <MapPin className={styles.logoIcon} />
                  <span className={styles.logoText}>WanderLog</span>
                </Link>
                <button className={styles.closeButton} onClick={closeMenu}>
                  <X className={styles.closeIcon} />
                </button>
              </div>
              <nav className={styles.mobileMenuNav}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMenu}
                    className={`${styles.mobileNavLink} ${location.pathname === item.href ? styles.activeMobileLink : ""
                      }`}
                  >
                    <item.icon className={styles.mobileNavIcon} />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button onClick={handleLogout} className={styles.mobileNavLink}>
                  <LogOut className={styles.navIcon} />
                  <span>Logout</span>
                </button>
              </nav>
              <div className={styles.mobileActions}>
                <Button variant="primary" className={styles.mobileFullButton} onClick={closeMenu}>
                  <Link to="/add-trip" className={styles.buttonLink}>
                    <Plus className={styles.buttonIcon} />
                    Add New Trip
                  </Link>
                </Button>
              </div>
              <div className={styles.menuFooter}>
                <div className={styles.footerText}>
                  <p>Your travel journey mapped</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation
