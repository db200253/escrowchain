import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { EscrowInfo } from "./EscrowInfo";
import { getUserEscrows } from "../../services/FactoryService.ts";
import EscrowForm from "./EscrowForm";
import styles from "../../styles/Escrow.module.css";
import { FaPlus, FaMinus, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Escrow = () => {
    const { address, isConnected } = useAccount();
    const [escrows, setEscrows] = useState<string[]>([]);
    const [expandedEscrow, setExpandedEscrow] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { data, isLoading, error } = getUserEscrows(address);

    useEffect(() => {
        if (data) {
            setEscrows([...data]);
        }
    }, [data]);

    if (!isConnected) {
        return (
            <div className={styles.escrowContainer}>
                <h2>Veuillez connecter votre portefeuille</h2>
            </div>
        );
    }

    if (error) {
        console.error("Contract read error:", error);
        return <p>Erreur lors de la récupération des escrows : {error.message}</p>;
    }

    return (
        <div className={styles.escrowContainer}>
            <div className={styles.header}>
                <h2>Mes Contrats</h2>
                <button className={styles.createButton} onClick={() => setShowForm(!showForm)}>
                    {showForm ? (
                        <>
                            <FaMinus/> Fermer
                        </>
                    ) : (
                        <>
                            <FaPlus/> Créer un contrat
                        </>
                    )}
                </button>

            </div>

            {showForm && <EscrowForm/>}

            {isLoading ? (
                <p>Chargement des contrats...</p>
            ) : escrows.length === 0 ? (
                <p>Aucun contrat trouvé</p>
            ) : (
                <ul className={styles.escrowList}>
                    {escrows.map((escrow) => (
                        <li key={escrow} className={styles.escrowItem}>
                            <div
                                className={styles.escrowHeader}
                                onClick={() => setExpandedEscrow(expandedEscrow === escrow ? null : escrow)}
                            >
                                <span>Contrat : {escrow}</span>
                                {expandedEscrow === escrow ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            {expandedEscrow === escrow && <EscrowInfo escrowAddress={escrow} />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Escrow;
