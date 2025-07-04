import Container from "@/components/Container";
import AddSection from "@/components/Projects/AddSection";
import ProjectsList from "@/components/Projects/ProjectsList";

const page = async () => {
  return (
    <Container>
      <AddSection />
      <ProjectsList type="project" />
    </Container>
  );
};

export default page;
