import { ToastContentProps } from "react-toastify";
import styles from "./WarningToast.module.css";
import { MdClose, MdOutlineWarning } from "react-icons/md";

export default function WarningToast({ closeToast, isPaused, toastProps }: ToastContentProps) {
  const closeBtnRadius = 50;
  const closeBtnStrokeWidth = 5;
  console.log(toastProps.autoClose);

  return (
    <div className={styles["warning--contents"]}>
      <MdOutlineWarning className={styles["warning--leading-icon"]}/>
      <p className={"text-body"}>Complete the diagram before checking your work</p>
      <button 
        className={`btn btn--secondary ${styles["btn--close"]}`}
        onClick={() => closeToast()}
      >
        <svg 
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className={styles["close-ring"]}
        >
          <circle 
            cx="50"
            cy="50"
            r={closeBtnRadius - closeBtnStrokeWidth / 2}
            strokeWidth={closeBtnStrokeWidth}
            className={styles["close-ring--bg"]}
          />
          <circle
            cx="50"
            cy="50"
            r={closeBtnRadius - closeBtnStrokeWidth / 2}
            strokeWidth={closeBtnStrokeWidth}
            pathLength="100"
            className={styles["close-ring--fg"]}
            style={{
              animationDuration: `${toastProps.autoClose ? toastProps.autoClose : 0}ms`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
            onAnimationEnd={() => closeToast()}
          />
        </svg>
        <MdClose size={32} className={styles["close-btn-icon"]}/>
      </button>
    </div>
  );
}
