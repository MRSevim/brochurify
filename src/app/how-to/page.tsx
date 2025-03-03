import Container from "@/components/Container";
import Link from "next/link";

const page = () => {
  return (
    <Container>
      <h1 className="font-bold text-2xl">
        What Is The Builder And How to Use It?
      </h1>
      <h2 className="font-bold text-xl mt-2">What Is The Builder?</h2>
      <p className="mt-2">
        The builder is a tool that allows users to build brochure like website
        structures without writing code. People that don't know anything about
        web development as well as people that know html+css can use this tool.
        User then can download the structure they build as html file and use it
        wherever they wish, to host it somewhere etc.
      </p>
      <h2 className="font-bold text-xl mt-2">How To Use The Builder?</h2>
      <p className="mt-2">
        The builder consists of 3 main parts, layout view, which is at the left
        side, main editor area which is at the center and settings area which is
        at the right side. Layout view and settings are not visible by default.
        They need to be toggled by clicking on their corresponding buttons after
        navigating to builder.
      </p>
      <h3 className="font-bold text-l mt-2">Layout View</h3>
      <p className="mt-2">
        Layout view allows user to view their layout in structured manner.
        Elements there can be dragged/dropped, deleted, toggled to see their
        child elements and copied and pasted. Element can be clicked to make it
        active. Active elements can be changed in terms of its settings and are
        used as add location. Below and above the element can be clicked also to
        make it add location. Adding a new element adds it to the add location.
        Some of these actions, such as clicking to make active, selecting add
        location, copying/pasting and dragging/dropping can be directly done in
        the editor as well.
      </p>
      <h3 className="font-bold text-l mt-2">Settings</h3>
      <p className="mt-2">
        Settings exist so that user can change the look and behaviour of the
        active element. There are various settings that can be added, removed,
        toggled etc. Some of these settings contain some text that explain what
        they do. All of these settings correspond to css properties and rules.
        Settings show the active element's properties. There can only be one
        active element in the editor so settings can only edit that element's
        properties at one time. If no active element is selected, it shows
        pagewise settings, which is related the whole html page that is created
        during editing.
      </p>
      <h3 className="font-bold text-l mt-2">Elements</h3>
      <p className="mt-1">
        <span className="font-bold">Container:</span> This element is there so
        that content is restricted to certain maximum width and pushed to the
        center for both wide and narrow screens. This element can have children.
      </p>
      <p className="mt-1">
        <span className="font-bold">Button:</span> This element is there so that
        end user can click and go to the destination link. It corresponds to
        button tag in html. This element can have children.
      </p>
      <p className="mt-1">
        <span className="font-bold">Row:</span> This element is there so that
        content is lined up in a row and aligned accordingly. This element can
        have children.
      </p>
      <p className="mt-1">
        <span className="font-bold">Column:</span> This element is there so that
        row elements can have main children. This element should be used inside
        the row as immediate children. This element can have children.
      </p>
      <p className="mt-1">
        <span className="font-bold">Text:</span> This element is there so that
        user can insert text content and edit it. It allows a lot of text
        editing, including adding tables, quotes, code etc. This element is
        built thanks to the{" "}
        <Link target="__blank" href="https://tiptap.dev/" className="underline">
          {" "}
          Tiptap text editor
        </Link>
        .
      </p>
      <p className="mt-1">
        <span className="font-bold">Image/Audio/Video:</span> These element are
        there so that user can insert those into their html build. They all
        correspond to the existing html tags, namely; img, video and audio.
      </p>
      <p className="mt-1">
        <span className="font-bold">Divider:</span> This element is there to
        divide content with a line. It corresponds to hr tag in html.
      </p>
      <p className="mt-1">
        <span className="font-bold">Icon:</span> This element is there so user
        can add icons to their build. It corresponds to i tag in html. Final
        html contains Bootstrap cdn so that these will be visible.
      </p>
      <p className="mt-1">
        <span className="font-bold">Fixed:</span> This element is there so that
        user can position it inside other elements that can have children. Once
        placed, it will be positioned relative to its parent container, based on
        its, left, right, top and bottom values. This element corresponds to
        absolute positioned element in css. This element can have children.
      </p>
      <h3 className="font-bold text-l mt-2">Common Element Behaviour</h3>
      <p className="mt-1">
        All elements have default settings that are present when they are added
        to the editor, however most of them can be changed. Setting a percent
        width/height to the element is related to its parent. For percent
        width/height to apply correctly, parent and all grandparents have to
        have set width/height applied to them other than auto or none. All
        elements also behave in inline-block manner. So when a new element
        added, it is added right next to the last element in the editor and
        elements won't take the full available width by default but applying
        width and height to them will work. Content elements such as text and
        image should be structured inside rows and columns to control their
        place on a page and align them accordingly.
      </p>
    </Container>
  );
};
export default page;
