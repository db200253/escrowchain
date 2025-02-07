import styles from "../../styles/Header.module.css";
import ConnectWallet from "../ConnectWallet.tsx";
import { FaCogs } from 'react-icons/fa';

const Header = () => {
    return (
        <>
            <header className={styles.headerContainer}>
                <div className={styles.logoContainer}>
                    <FaCogs size={75} color="white" />
                    <span className={styles.appName}>EscrowChain</span>
                </div>
                <ConnectWallet/>
            </header>
            <div className={styles.headerSpacing}></div>
        </>
    );
};

export default Header;
