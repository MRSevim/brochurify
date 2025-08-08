import Icon from "../Icon";

const features = [
  {
    title: "Speed",
    explanation:
      "Design your one page website with premade templates, through the drag and drop editor and responsive builder and go live for free.",
  },
  {
    title: "Ease of Use",
    explanation:
      "No coding required. Easily build professional-looking, responsive websites with intuitive interface and numerous customization tools.",
  },
  {
    title: "Customization",
    explanation:
      "Tweak parts of your website with content editing, seo related configurations and style edits.",
  },
];

const Features = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-8 my-20">
      {features.map((feature) => (
        <FeatureWrapper key={feature.title}>
          <HeaderDiv>
            <IconComp type="ev-front" />
            <HeaderSpan>{feature.title}</HeaderSpan>
          </HeaderDiv>
          <p>{feature.explanation}</p>
        </FeatureWrapper>
      ))}
    </div>
  );
};

const IconComp = ({ type }: { type: string }) => {
  return <Icon type={type} size="30px" title={type} />;
};

const FeatureWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-5 text-center bg-background text-text rounded-lg">
      {children}
    </div>
  );
};

const HeaderDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-2 flex items-center justify-center">{children}</div>
  );
};

const HeaderSpan = ({ children }: { children: React.ReactNode }) => {
  return <span className="ms-3 font-semibold">{children}</span>;
};

export default Features;
