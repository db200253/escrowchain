import {useReadContract, useWriteContract} from "wagmi";
import {EscrowConfig} from "../components/Escrow/EscrowConfig.ts";
import {parseEther} from "viem";

function getSeller(eAddress: `0x${string}`) {
    const { data: seller, isLoading: loadingSeller } = useReadContract({
        address: eAddress,
        abi: EscrowConfig.abiEscrow,
        functionName: "getSeller",
    });

    return { seller, loadingSeller };
}

function getBuyer(eAddress: `0x${string}`) {
    const { data: buyer, isLoading: loadingBuyer } = useReadContract({
        address: eAddress,
        abi: EscrowConfig.abiEscrow,
        functionName: "getBuyer",
    });

    return { buyer, loadingBuyer };
}

function getStatus(eAddress: `0x${string}`) {
    const { data: status, isLoading: loadingStatus } = useReadContract({
        address: eAddress,
        abi: EscrowConfig.abiEscrow,
        functionName: "getStatus",
    });

    return { status, loadingStatus };
}

function getValue(eAddress: `0x${string}`) {
    const { data: value, isLoading: loadingValue } = useReadContract({
        address: eAddress,
        abi: EscrowConfig.abiEscrow,
        functionName: "getValue",
    });

    return { value, loadingValue };
}

function getLoadingValidation(eAddress: `0x${string}`) {
    const { data: loadingValidation, isLoading: loadingValidationStatus } = useReadContract({
        address: eAddress,
        abi: EscrowConfig.abiEscrow,
        functionName: "getLoadingValidation",
    });

    return { loadingValidation, loadingValidationStatus };
}

function getFundsDeposited(eAddress: `0x${string}`) {
    const { data: fundsDepositedData, isLoading: loadingFundsDeposited } = useReadContract({
        address: eAddress,
        abi: EscrowConfig.abiEscrow,
        functionName: "getFundsDeposited",
    });

    return { fundsDepositedData, loadingFundsDeposited };
}

function useValidateLoading(eAddress: `0x${string}`) {
    const { writeContract, isPending, isError } = useWriteContract();

    const validateLoading = () => {
        try {
            writeContract({
                address: eAddress,
                abi: EscrowConfig.abiEscrow,
                functionName: "validateLoading",
            });

            writeContract({
                address: eAddress,
                abi: EscrowConfig.abiEscrow,
                functionName: "releaseFunds",
            });
        } catch (error) {
            console.error("Erreur lors de la validation du chargement:", error);
        }
    };

    return { validateLoading, isPending, isError };
}

function useChangeStatus(eAddress: `0x${string}`, status: number | undefined) {
    const { writeContract, isPending, isError } = useWriteContract();

    const changeStatus = () => {
        try {
            writeContract({
                address: eAddress,
                abi: EscrowConfig.abiEscrow,
                functionName: "setStatus",
                args: [Number(status) + 1] as readonly [number],
            });
        } catch (error) {
            console.error("Erreur lors du changement de statut:", error);
        }
    };

    return { changeStatus, isPending, isError };
}

function useCancelTransaction(eAddress: `0x${string}`) {
    const { writeContract, isPending, isError } = useWriteContract();

    const cancelTransaction = (cancelReason: string) => {
        if (!cancelReason) {
            alert("Veuillez entrer une raison pour l'annulation.");
            return;
        }

        try {
            writeContract({
                address: eAddress,
                abi: EscrowConfig.abiEscrow,
                functionName: "cancelTransaction",
                args: [eAddress, cancelReason],
            });
        } catch (error) {
            console.error("Erreur lors de l'annulation de la transaction:", error);
        }
    };

    return { cancelTransaction, isPending, isError };
}

function useCreateEscrow(seller: string, buyer: string, value: string) {
    const { writeContract, isPending, isError } = useWriteContract();

    const createEscrow = () => {
        if (!seller || !buyer || !value) return alert("Veuillez remplir tous les champs");

        try {
            writeContract({
                address: EscrowConfig.address,
                abi: EscrowConfig.abiFactory,
                functionName: "createEscrow",
                args: [seller as `0x${string}`, buyer as `0x${string}`, parseEther(value)],
            });
        } catch (error) {
            console.error("Erreur lors de la création du contrat :", error);
        }
    };

    return { createEscrow, isPending, isError };
}

export {
    getSeller,
    getBuyer,
    getStatus,
    getValue,
    getLoadingValidation,
    getFundsDeposited,
    useValidateLoading,
    useChangeStatus,
    useCancelTransaction,
    useCreateEscrow
}