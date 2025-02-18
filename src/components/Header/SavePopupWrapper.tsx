import { useAppSelector } from "@/redux/hooks";
import SuccessAlert from "../SuccessAlert";
const SavePopupWrapper = () => {
  const savePopup = useAppSelector((state) => state.popup.savePopup);

  return (
    <>
      {savePopup && (
        <div className="ms-3">
          <SuccessAlert
            text={savePopup === "saving" ? "Saving..." : "Saved locally!"}
          />
        </div>
      )}
    </>
  );
};

export default SavePopupWrapper;
