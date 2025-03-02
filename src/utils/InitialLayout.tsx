import { v4 as uuidv4 } from "uuid";
import { Layout } from "./Types";

export const initialLayout: Layout[] = [
  {
    id: uuidv4(),
    type: "container",
    props: {
      style: {
        "max-width": "1300px",
        margin: "0 auto",
        padding: "0 12px",
        height: "100%",
        width: "100%",
      },
      child: [
        {
          id: uuidv4(),
          type: "row",
          props: {
            style: {
              display: "flex",
              "flex-wrap": "wrap",
              width: "100%",
              margin: "10px 10px 10px 10px",
              padding: "10px 10px 10px 10px",
              "justify-content": "start",
              "align-items": "center",
              height: "60%",
              "@container (max-width: 768px)": {
                height: "auto",
              },
            },
            child: [
              {
                id: uuidv4(),
                type: "column",
                props: {
                  style: {
                    margin: "0px 0px 0px 0px",
                    padding: "0px 0px 0px 0px",
                    width: "60%",
                    "@container (max-width: 768px)": {
                      width: "100%",
                    },
                  },
                  child: [
                    {
                      id: uuidv4(),
                      type: "text",
                      props: {
                        style: {
                          margin: "10px 10px 10px 10px",
                          padding: "10px 10px 10px 10px",
                          width: "100%",
                        },
                        text: '<h1 style="text-align:center"><span style="font-size:41px">I am a text</span></h1>',
                      },
                    },
                    {
                      id: uuidv4(),
                      type: "text",
                      props: {
                        style: {
                          margin: "10px 10px 10px 10px",
                          padding: "10px 10px 10px 10px",
                        },
                        text: '<p><strong>Lorem Ipsum</strong><span style="color:rgb(0, 0, 0);font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</span></p>',
                      },
                    },
                  ],
                },
              },
              {
                id: uuidv4(),
                type: "column",
                props: {
                  style: {
                    margin: "0px 0px 0px 0px",
                    padding: "10px 10px 10px 10px",
                    width: "40%",
                    "@container (max-width: 768px)": {
                      width: "100%",
                    },
                    "text-align": "center",
                  },
                  child: [
                    {
                      id: uuidv4(),
                      type: "image",
                      props: {
                        style: {
                          width: "200px",
                          height: "200px",
                          margin: "0px 0px 0px 0px",
                          padding: "0px 0px 0px 0px",
                        },
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
            style: {
              display: "flex",
              "flex-wrap": "wrap",
              width: "100%",
              margin: "10px 10px 10px 10px",
              padding: "10px 10px 10px 10px",
              "justify-content": "center",
              "align-items": "center",
            },
            child: [
              {
                id: uuidv4(),
                type: "column",
                props: {
                  style: {
                    margin: "0px 0px 0px 0px",
                    padding: "10px 10px 10px 10px",
                  },
                  child: [
                    {
                      id: uuidv4(),
                      type: "button",
                      props: {
                        style: {
                          margin: "0px 0px 0px 0px",
                          padding: "10px 10px 10px 10px",
                          "background-color": "#c33232",
                          border: "0px solid #000000",
                          "border-radius": "50%",
                        },
                        child: [
                          {
                            id: uuidv4(),
                            type: "icon",
                            props: {
                              iconType: "alarm-fill",
                              style: {
                                "font-size": "25px",
                                "text-align": "center",
                                margin: "0px 0px 0px 0px",
                                padding: "0px 0px 0px 0px",
                                color: "#ffffff",
                              },
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
                  style: {
                    margin: "0px 0px 0px 0px",
                    padding: "10px 10px 10px 10px",
                  },
                  child: [
                    {
                      id: uuidv4(),
                      type: "text",
                      props: {
                        style: {
                          margin: "10px 10px 10px 10px",
                          padding: "10px 10px 10px 10px",
                        },
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
            style: {
              position: "absolute",
              width: "auto",
              height: "auto",
              margin: "10px 10px 10px 10px",
              padding: "0px 0px 0px 0px",
              bottom: "0px",
              right: "0px",
            },
            child: [
              {
                id: uuidv4(),
                type: "icon",
                props: {
                  iconType: "1-circle-fill",
                  style: {
                    "font-size": "25px",
                    "text-align": "center",
                    margin: "0px 0px 0px 0px",
                    padding: "0px 0px 0px 0px",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
];
