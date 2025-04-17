import { v4 as uuidv4 } from "uuid";
import { Layout } from "./Types";
import { getDefaultStyle } from "./Helpers";

export const initialLayout: Layout[] = [
  {
    id: uuidv4(),
    type: "container",
    props: {
      style: getDefaultStyle("container"),
      child: [
        {
          id: uuidv4(),
          type: "row",
          props: {
            style: getDefaultStyle("row"),
            child: [
              {
                id: uuidv4(),
                type: "column",
                props: {
                  style: getDefaultStyle("column"),

                  child: [
                    {
                      id: uuidv4(),
                      type: "text",
                      props: {
                        style: getDefaultStyle("text"),

                        text: "<h1><span >I am a text</span></h1>",
                      },
                    },
                    {
                      id: uuidv4(),
                      type: "text",
                      props: {
                        style: getDefaultStyle("text"),
                        text: "<p><strong>Lorem Ipsum</strong><span> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</span></p>",
                      },
                    },
                  ],
                },
              },
              {
                id: uuidv4(),
                type: "column",
                props: {
                  style: getDefaultStyle("column"),
                  child: [
                    {
                      id: uuidv4(),
                      type: "image",
                      props: {
                        style: getDefaultStyle("image"),
                        src: "/placeholder-image.jpg",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: uuidv4(),
          type: "row",
          props: {
            style: getDefaultStyle("row"),
            child: [
              {
                id: uuidv4(),
                type: "column",
                props: {
                  style: getDefaultStyle("column"),
                  child: [
                    {
                      id: uuidv4(),
                      type: "button",
                      props: {
                        style: getDefaultStyle("button"),
                        child: [
                          {
                            id: uuidv4(),
                            type: "icon",
                            props: {
                              iconType: "alarm-fill",
                              style: getDefaultStyle("icon"),
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                id: uuidv4(),
                type: "column",
                props: {
                  style: getDefaultStyle("column"),
                  child: [
                    {
                      id: uuidv4(),
                      type: "text",
                      props: {
                        style: getDefaultStyle("text"),
                        text: "I am a text",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: uuidv4(),
          type: "fixed",
          props: {
            style: getDefaultStyle("fixed"),
            child: [
              {
                id: uuidv4(),
                type: "icon",
                props: {
                  iconType: "1-circle-fill",
                  style: getDefaultStyle("icon"),
                },
              },
            ],
          },
        },
      ],
    },
  },
];
