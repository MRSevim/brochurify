import { useAppSelector } from "@/lib/redux/hooks";
import Alert from "../Alert";

const SavePopupWrapper = () => {
  const savePopup = useAppSelector((state) => state.popup.savePopup);

  return (
    <>
      {savePopup && (
        <div className="ms-2">
          <Alert text={savePopup} />
        </div>
      )}
    </>
  );
};

export default SavePopupWrapper;
