import Container from "@/components/Container";
import ProjectsList from "@/features/projects/components/ProjectsList";
import AddSection from "@/features/projects/components/Templates/AddSection";

const page = () => {
  return (
    <Container>
      <AddSection />
      <ProjectsList type="template" />
    </Container>
  );
};

export default page;
