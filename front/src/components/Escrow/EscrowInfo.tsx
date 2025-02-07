import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useState, useEffect } from "react";
import { DepositFundsButton } from "../Funds/DepositFundsButton.tsx"
import * as EscrowService from "../../services/EscrowService.ts";
import styles from "../../styles/EscrowInfo.module.css"
import EscrowStatusTimeline from "./EscrowStatusTimeline.tsx";

interface EscrowInfoProps {
    escrowAddress: string;
}

export function EscrowInfo({ escrowAddress }: EscrowInfoProps) {
    const eAddress = escrowAddress as `0x${string}`;
    const { address } = useAccount();
    const [isSeller, setIsSeller] = useState(false);
    const [isBuyer, setIsBuyer] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const { seller, loadingSeller } = EscrowService.getSeller(eAddress);
    const { buyer, loadingBuyer } = EscrowService.getBuyer(eAddress);
    const { status, loadingStatus } = EscrowService.getStatus(eAddress);
    const { value, loadingValue } = EscrowService.getValue(eAddress);
    const { loadingValidation, loadingValidationStatus } = EscrowService.getLoadingValidation(eAddress);
    const { fundsDepositedData, loadingFundsDeposited } = EscrowService.getFundsDeposited(eAddress);

    const fundsDeposited = fundsDepositedData as boolean ?? false;

    useEffect(() => {
        if (address === buyer) {
            setIsBuyer(true);
        }
        if (address === seller) {
            setIsSeller(true);
        }
    }, [address, buyer, seller]);

    const { validateLoading, isPending: isValidating, isError: isValidationError } = EscrowService.useValidateLoading(eAddress);
    const { changeStatus, isPending: isChangingStatus, isError: isChangeStatusError } = EscrowService.useChangeStatus(eAddress, status);
    const { cancelTransaction, isPending: isCancelling, isError: isCancelError } = EscrowService.useCancelTransaction(eAddress);

    const isLoading = loadingSeller || loadingBuyer || loadingStatus || loadingValue || loadingValidationStatus || loadingFundsDeposited;

    return (
        <div className={styles.escrowinfo}>
            <h3>Contrat Escrow : {escrowAddress}</h3>
            {isLoading ? (
                <p>Chargement des détails...</p>
            ) : (
                <div>
                    <p><strong>Vendeur :</strong> {seller as string}</p>
                    <p><strong>Acheteur :</strong> {buyer as string}</p>
                    <p><strong>Valeur :</strong> {formatEther(value || BigInt(0))} ETH</p>
                    <p><strong>Validation du Chargement :</strong> {loadingValidation ? "✅ Validé" : "❌ Non validé"}</p>
                    <EscrowStatusTimeline status={Number(status)} />
                    {fundsDeposited && (isBuyer || isSeller) && Number(status) < 2 && (
                        <div>
                            <input
                                type="text"
                                placeholder="Motif de l'annulation"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                            <button onClick={() => cancelTransaction(cancelReason)} disabled={isCancelling}>
                                {isCancelling ? "Annulation en cours..." : "Annuler la transaction"}
                            </button>
                        </div>
                    )}
                    {isBuyer && !fundsDeposited && (
                        <DepositFundsButton
                            escrowAddress={eAddress}
                            value={value as bigint}
                        />
                    )}
                    {!fundsDeposited && isSeller && Number(status) === 0 && (
                        <p><strong>En attente du dépôt de fond de l'acheteur...</strong></p>
                    )}
                    {fundsDeposited && isSeller && Number(status) === 0 && (
                        <button onClick={changeStatus} disabled={isChangingStatus}>
                            {isChangingStatus ? "Changement en cours..." : "Changer le statut"}
                        </button>
                    )}
                    {isBuyer && Number(status) === 1 && (
                        <button onClick={validateLoading} disabled={isValidating}>
                            {isValidating ? "Validation en cours..." : "Valider le chargement"}
                        </button>
                    )}
                    {isBuyer && Number(status) > 1 && Number(status) < 4 && (
                        <button onClick={changeStatus} disabled={isChangingStatus}>
                            {isChangingStatus ? "Changement en cours..." : "Changer le statut"}
                        </button>
                    )}
                    {isChangeStatusError && <p style={{color: "red"}}>Erreur lors du changement de statut</p>}
                    {isValidationError && <p style={{ color: "red" }}>Erreur lors de la validation du chargement</p>}
                    {isCancelError && <p style={{ color: "red" }}>Erreur lors de l'annulation de la transaction</p>}
                </div>
            )}
        </div>
    );
}
