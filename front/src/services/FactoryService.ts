import { EscrowConfig } from "../components/Escrow/EscrowConfig.ts";
import {useReadContract} from "wagmi";

export function getUserEscrows(address: `0x${string}` | undefined){
    const safeAddress = address as `0x${string}` | undefined;

    const {data, isLoading, error} = useReadContract({
        address: EscrowConfig.address,
        abi: EscrowConfig.abiFactory,
        functionName: "getUserEscrows",
        args: safeAddress ? [safeAddress] : undefined,
    });

    return {data, isLoading, error};
}