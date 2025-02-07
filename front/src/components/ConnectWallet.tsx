import { useAccount } from "wagmi";
import { Account } from "./Account";
import { WalletOptions } from "./WalletOptions";
import styles from "../styles/Header.module.css";

export default function ConnectWallet() {
    const { isConnected } = useAccount();
    return (
        <div className={styles.connectWalletContainer}>
            {isConnected ? <Account /> : <WalletOptions />}
        </div>
    );
}
