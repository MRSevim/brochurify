import Container from "@/components/Container";
import ProjectsList from "@/components/Projects/ProjectsList";
import AddSection from "@/components/Templates/AddSection";

const page = () => {
  return (
    <Container>
      <AddSection />
      <ProjectsList type="template" />
    </Container>
  );
};

export default page;
