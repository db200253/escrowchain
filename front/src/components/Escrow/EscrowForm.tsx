import { useState } from "react";
import styles from "../../styles/EscrowForm.module.css";
import * as EscrowService from "../../services/EscrowService.ts";

const EscrowForm = () => {
    const [seller, setSeller] = useState("");
    const [buyer, setBuyer] = useState("");
    const [value, setValue] = useState("");

    const { createEscrow, isPending: isCreating, isError: isCreatingError } = EscrowService.useCreateEscrow(seller, buyer, value);

    return (
        <div className={styles.escrowform}>
            <h2>Créer un Escrow</h2>
            <input
                type="text"
                placeholder="Adresse Vendeur"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
            />
            <input
                type="text"
                placeholder="Adresse Acheteur"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
            />
            <input
                type="text"
                placeholder="Valeur (ETH)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={createEscrow} disabled={isCreating}>
                {isCreating ? "Création en cours..." : "Créer"}
            </button>
            {isCreatingError && <p className={styles.error}>Erreur lors de la transaction</p>}
        </div>
    );
};

export default EscrowForm;
