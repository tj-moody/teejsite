import styles from "./header.module.css";

const Header = () => (
    <header className={styles.header}>
        <a href="/" className={styles.link}>
            teejsite
        </a>
    </header>
);

export default Header;
