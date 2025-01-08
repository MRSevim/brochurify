"use client";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { Editor, Frame, Element } from "@craftjs/core";
import Container from "@/components/BuilderComponents/Container";
import Button from "@/components/BuilderComponents/Button";

export default function Builder() {
  return (
    <div className="overflow-x-hidden h-screen-header-excluded relative">
      {/*       <Editor resolver={{ Button, Container }}>
        <Frame>
          <Element is={Container} canvas>
            <Element is={Container} canvas>
              <Button />
            </Element>
            <Element is={Container} canvas>
              <Button />
            </Element>
          </Element>
        </Frame>
      </Editor> */}
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
