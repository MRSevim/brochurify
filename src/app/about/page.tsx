import Container from "@/components/Container";
import Link from "next/link";

const page = () => {
  return (
    <Container>
      <h1 className="font-bold text-2xl">About</h1>
      <h2 className="font-bold text-xl mt-2">About Me (the developer)</h2>
      <p className="mt-2">
        Hello everyone, first of all, thanks for visiting the website. I am the
        developer of this website, My name is Muhammed Raşid Sevim and I am
        based in Turkey. I have been building this website for a while now. I am
        aware there is always more to add and improvements to be made but I also
        wanted to release a version and see how people will like it. Feel free
        to use the contact form for any comments/suggestions. You can read more
        about the website below. To learn more about me, you can check my{" "}
        <Link href="https://mrsevim.github.io/Portfolio/" className="underline">
          portfolio
        </Link>
        .
      </p>
      <h2 className="font-bold text-xl mt-2">About The App</h2>
      <p className="mt-2">
        This app is a website builder named <strong>Brochurify</strong>. Website
        builder, for those who don't know, is a tool that allows you to build
        websites through its ui, generally with minimal/no code. Some of the
        well known website builder examples include Wordpress, Wix and
        Squarespace. This app, in addition to being a website builder, is
        designed to build <strong>single-page websites</strong>. That means you
        cannot create more than one page and link them to each other. That makes
        it similar to <strong>Carrd</strong>, although it can simulate multiple
        pages as well. Carrd was the direct inspiration for this project and
        continue to be. With this app, you can build your website and publish it
        with brochurify's own infrastructure or get your build's html code if
        you wish.
      </p>
      <h3 className="font-bold text-l mt-2">About the Builder</h3>
      <p className="mt-2">
        Builder is the area/tool that helps you build your single page website.
        It is designed to be easy to understand and use. It allows drag and drop
        interactions, shortcut keys such as ctrl+c to copy or ctrl+z to undo.
        Feel free to test it out and let me know what you think through the{" "}
        <Link href="/contact" className="underline">
          contact form
        </Link>
        . There are left side and right side to the builder. Left side controls
        the layout whereas right side controls the element styles. Those sides
        need to be toggled on, to interact with them, with the buttons on the
        header.
      </p>
    </Container>
  );
};
export default page;
