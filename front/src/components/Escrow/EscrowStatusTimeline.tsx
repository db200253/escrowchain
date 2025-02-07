import { FaCheckCircle, FaHourglassHalf, FaShip, FaBoxOpen, FaTimesCircle } from "react-icons/fa";
import styles from "../../styles/EscrowInfo.module.css";

const EscrowStatusTimeline = ({ status }: { status: number }) => {
    const steps = [
        { id: 0, label: "Sent", icon: <FaCheckCircle className={styles.icon} /> },
        { id: 1, label: "Loading", icon: <FaHourglassHalf className={styles.icon} /> },
        { id: 2, label: "Transport", icon: <FaShip className={styles.icon} /> },
        { id: 3, label: "Unloading", icon: <FaBoxOpen className={styles.icon} /> },
        { id: 4, label: "Received", icon: <FaCheckCircle className={styles.icon} /> },
    ];

    if (status === 5) {
        return (
            <div className={styles.statusTimeline}>
                <div className={`${styles.statusStep} ${styles.cancelled}`}>
                    <FaTimesCircle className={styles.icon} />
                    <span className={styles.stepText}>Cancelled</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.statusTimeline}>
            {steps.map((step) => (
                <div
                    key={step.id}
                    className={`${styles.statusStep} ${status > step.id ? styles.completed : status === step.id ? styles.current : ""}`}
                >
                    {step.icon}
                    <span className={styles.stepText}>{step.label}</span>
                </div>
            ))}
        </div>
    );
};

export default EscrowStatusTimeline;
