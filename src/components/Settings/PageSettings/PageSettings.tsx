import Seo from "../Seo";
import SizingAndBorder from "../SizingAndBorder";

const PageSettings = () => {
  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-light text-center mb-2">
        Settings For The Whole Page
      </h1>

      <SizingAndBorder />
      <Seo />
    </div>
  );
};

export default PageSettings;
