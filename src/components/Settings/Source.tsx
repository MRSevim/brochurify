import BottomLine from "../BottomLine";
import SecondaryTitle from "../SecondaryTitle";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";

const Source = () => {
  return (
    <ToggleVisibilityWrapper title="Source">
      <div className="relative pb-2 mb-2">
        <SecondaryTitle title="Source url" />

        <p>Logic to be implemented</p>
        <BottomLine />
      </div>
    </ToggleVisibilityWrapper>
  );
};

export default Source;
