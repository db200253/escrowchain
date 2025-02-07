import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import styles from "../styles/Header.module.css";

export function Account() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

    return (
        <div className={styles.accountContainer}>
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
            {address && (
                <div>
                    {ensName ? `${ensName} (${address})` : address}
                </div>
            )}
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
    );
}
