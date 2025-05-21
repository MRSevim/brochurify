import { useAppSelector } from "@/redux/hooks";
import SuccessAlert from "../SuccessAlert";

const SavePopupWrapper = () => {
  const savePopup = useAppSelector((state) => state.popup.savePopup);

  return (
    <>
      {savePopup && (
        <div className="ms-2">
          <SuccessAlert text={savePopup} />
        </div>
      )}
    </>
  );
};

export default SavePopupWrapper;
