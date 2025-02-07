import { useWriteContract } from "wagmi";
import { EscrowConfig } from "../Escrow/EscrowConfig";

interface DepositFundsButtonProps {
    escrowAddress: `0x${string}`;
    value: bigint;
}

export function DepositFundsButton({ escrowAddress, value }: DepositFundsButtonProps) {
    const { writeContract, isPending } = useWriteContract();

    const depositFunds = async () => {
        try {
            writeContract({
                address: escrowAddress,
                abi: EscrowConfig.abiEscrow,
                functionName: "depositFunds",
                value: BigInt(value ?? 0),
            });
        } catch (error) {
            console.error("Erreur lors du dépôt de fonds:", error);
        }
    };

    return (
        <button onClick={depositFunds} disabled={isPending}>
            {isPending ? "Dépôt en cours..." : "Déposer les fonds"}
        </button>
    );
}
