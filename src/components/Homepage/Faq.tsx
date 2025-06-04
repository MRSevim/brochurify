"use client";
import React, { useEffect, useRef, useState } from "react";
import Icon from "../Icon";

const questions = [
  {
    question: "Do I need to know how to code?",
    body: "No. It helps, but you can build everything visually through the overlay without writing a single line of code.",
  },
  {
    question: "Is my website responsive on mobile devices?",
    body: "Yes, but you'll need to configure it by setting different widths for tablet and mobile views.",
  },
  {
    question: "Can I export my website as HTML and CSS?",
    body: "Yes. Use the download button on the top-left corner to get the HTML of your website.",
  },
  {
    question: "What happens if I reach my project limit?",
    body: "You won’t be able to create new projects unless you delete existing ones or upgrade your plan.",
  },
  {
    question: "Can I use my own fonts or images?",
    body: "You can upload images, but only if you have a subscription. Custom fonts are not yet supported.",
  },
  {
    question: "How do I publish my website?",
    body: "After logging in and creating a project, click the 'Publish' button at the top-right when you're ready.",
  },
  {
    question: "Can I preview my website before publishing?",
    body: "Yes, you can preview your website live at any time while editing without needing to publish it.",
  },
  {
    question: "Can I undo mistakes while editing?",
    body: "Yes, there's an undo button in the editor to revert changes. You can also press ctrl+z to undo last change.",
  },
  {
    question:
      "I tried out the builder without logging in, Can I use that to publish my website?",
    body: "Yes, there's an import button on the top left of the builder. You can click that and import your local work to your project and publish it.",
  },
];

type ActiveType = number | null;
const Faq = () => {
  const [active, setActive] = useState<ActiveType>(null);
  return (
    <div className="my-25">
      <div className="w-full bg-slate p-4">
        <h3 className="font-semibold text-xl text-center mb-2">
          Some Questions You Might Ask
        </h3>
        {questions.map((question, i) => (
          <Question
            key={i}
            id={i}
            active={active}
            setActive={setActive}
            question={question.question}
            body={question.body}
          />
        ))}
      </div>
    </div>
  );
};

const Question = ({
  id,
  question,
  body,
  active,
  setActive,
}: {
  id: number;
  question: string;
  body: string;
  active: ActiveType;
  setActive: React.Dispatch<React.SetStateAction<ActiveType>>;
}) => {
  const expanded = active === id;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setActive((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = expanded
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
    }
  }, [expanded]);

  return (
    <>
      <button
        className={`p-3 my-1 flex items-center justify-between w-full bg-background text-text rounded-lg cursor-pointer ${
          expanded ? "border border-gray" : ""
        }`}
        onClick={handleClick}
      >
        {question}
        <Icon
          type={expanded ? "chevron-up" : "chevron-down"}
          title="toggle"
          size="24px"
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{ height: "0px" }}
      >
        <div className="p-4">{body}</div>
      </div>
    </>
  );
};

export default Faq;
