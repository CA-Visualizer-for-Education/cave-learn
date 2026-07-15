import { ToastContentProps } from "react-toastify";
import styles from "./WarningToast.module.css";
import { MdClose } from "react-icons/md";
import { IconType } from "react-icons";

interface BaseProps {
  text: string;
}

interface WithIconProps extends BaseProps {
  Icon: IconType,
  iconColor: string,
}

interface WithoutIconProps extends BaseProps {
  Icon?: null,
  iconColor?: null,
}

type WarningToastData = WithIconProps | WithoutIconProps;

export default function WarningToast(
  {
    data,
    closeToast,
    isPaused,
    toastProps,
  }: ToastContentProps<WarningToastData>,
) {
  const closeBtnRadius = 50;
  const closeBtnStrokeWidth = 5;

  return (
    <div className={styles["warning-contents"]}>
      <div className={styles["warning-icon-text-group"]}>
        {
          data.Icon
            && data.iconColor
            && <data.Icon color={data.iconColor} className={styles["warning-icon"]}/>
        }
        <p className={"text-body"}>{data.text}</p>
      </div>
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
              animationDuration: `${
                typeof toastProps.autoClose === "number"
                  ? toastProps.autoClose
                  : 0
              }ms`,
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
