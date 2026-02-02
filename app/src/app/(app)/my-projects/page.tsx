import Container from "@/components/Container";
import AddSection from "@/features/projects/components/AddSection";
import ProjectsList from "@/features/projects/components/ProjectsList";

const page = async () => {
  return (
    <Container>
      <AddSection />
      <ProjectsList type="project" />
    </Container>
  );
};

export default page;
