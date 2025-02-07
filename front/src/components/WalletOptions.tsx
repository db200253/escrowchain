import { useConnect } from 'wagmi';
import styles from "../styles/Header.module.css";

export function WalletOptions() {
    const { connectors, connect } = useConnect();

    return (
        <div className={styles.walletOptionsContainer}>
            {connectors.map((connector) => (
                <button key={connector.uid} onClick={() => connect({ connector })}>
                    {connector.name}
                </button>
            ))}
        </div>
    );
}
