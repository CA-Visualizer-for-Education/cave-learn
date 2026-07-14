import { ToastContentProps } from "react-toastify";
import styles from "./WarningToast.module.css";
import { MdClose, MdOutlineWarning } from "react-icons/md";

export default function WarningToast({ closeToast }: ToastContentProps) {
  return (
    <div className={styles["warning--contents"]}>
      <MdOutlineWarning className={styles["warning--leading-icon"]}/>
      <p className={"text-body"}>Complete the diagram before checking your work</p>
      <button 
        className={`btn btn--secondary ${styles["btn--close"]}`}
        onClick={() => closeToast()}
      >
        <MdClose size={32}/>
      </button>
    </div>
  );
}
