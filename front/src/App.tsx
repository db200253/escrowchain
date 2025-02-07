import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import Escrow from "./components/Escrow/Escrow.tsx";
import styles from "./styles/index.module.css"
import Header from "./components/Header/Header.tsx";

const queryClient = new QueryClient()

export default function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <Header />
                <div className={`${styles.bg}`}></div>
                <div className={`${styles.bg} ${styles.bg2}`}></div>
                <div className={`${styles.bg} ${styles.bg3}`}></div>
                <div className="content">
                    <Escrow/>
                </div>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
