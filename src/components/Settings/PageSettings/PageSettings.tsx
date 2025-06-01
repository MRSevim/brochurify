import Analytics from "./Analytics";
import Seo from "./Seo";
import Styles from "./Styles";
import Variables from "./Variables";
import WebsiteIcon from "./WebsiteIcon";

const PageSettings = () => {
  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-center mb-2">
        Settings For The Whole Page
      </h1>

      <Seo />
      <Variables />
      <Styles />
      <WebsiteIcon />
      <Analytics />
    </div>
  );
};

export default PageSettings;
