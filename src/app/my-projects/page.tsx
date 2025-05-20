import Container from "@/components/Container";
import AddSection from "@/components/Projects/AddSection";
import ProjectsList from "@/components/Projects/ProjectsList";

const page = () => {
  return (
    <Container>
      <AddSection />
      <ProjectsList />
    </Container>
  );
};

export default page;
