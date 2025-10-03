// @/config/compact-page-structure-config.ts

import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Enhanced Compact content structure template
 * Total word count: ~1,500-2,100 words
 * Rich structure with diverse content blocks for SEO optimization
 * 350% increase in content blocks while maintaining 4 main h2 sections
 */
export const COMPACT_CONTENT_STRUCTURE: RootContentStructure[] = [
  // Introduction section
  {
    id: "h2-1",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 300,
      maxWords: 450,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-1-1",
        tag: "p",
        additionalData: {
          minWords: 90,
          maxWords: 160,
          actualContent: "",
        },
      },
      {
        id: "p-1-2",
        tag: "p",
        additionalData: {
          minWords: 70,
          maxWords: 130,
          actualContent: "",
        },
      },
      {
        id: "p-1-3",
        tag: "p",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "blockquote-1-4",
        tag: "blockquote",
        additionalData: {
          minWords: 25,
          maxWords: 45,
          actualContent: "",
        },
      },
      {
        id: "p-1-5",
        tag: "p",
        additionalData: {
          minWords: 60,
          maxWords: 110,
          actualContent: "",
        },
      },
      {
        id: "ul-1-6",
        tag: "ul",
        additionalData: {
          minWords: 40,
          maxWords: 70,
          actualContent: "",
        },
      },
    ],
  },

  // Main Content section
  {
    id: "h2-2",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 550,
      maxWords: 750,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-2-1",
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 140,
          actualContent: "",
        },
      },
      {
        id: "p-2-2",
        tag: "p",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "h3-2-3",
        tag: "h3",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-3-1",
            tag: "p",
            additionalData: {
              minWords: 75,
              maxWords: 130,
              actualContent: "",
            },
          },
          {
            id: "ul-2-3-2",
            tag: "ul",
            additionalData: {
              minWords: 50,
              maxWords: 85,
              actualContent: "",
            },
          },
          {
            id: "p-2-3-3",
            tag: "p",
            additionalData: {
              minWords: 65,
              maxWords: 115,
              actualContent: "",
            },
          },
          {
            id: "code-2-3-4",
            tag: "code",
            additionalData: {
              minWords: 20,
              maxWords: 45,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-2-4",
        tag: "h3",
        additionalData: {
          minWords: 280,
          maxWords: 400,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-4-1",
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 120,
              actualContent: "",
            },
          },
          {
            id: "table-2-4-2",
            tag: "table",
            additionalData: {
              minWords: 90,
              maxWords: 150,
              actualContent: "",
            },
          },
          {
            id: "p-2-4-3",
            tag: "p",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            id: "h4-2-4-4",
            tag: "h4",
            additionalData: {
              minWords: 130,
              maxWords: 200,
              actualContent: "",
            },
            realContentStructure: [
              {
                id: "p-2-4-4-1",
                tag: "p",
                additionalData: {
                  minWords: 60,
                  maxWords: 105,
                  actualContent: "",
                },
              },
              {
                id: "ol-2-4-4-2",
                tag: "ol",
                additionalData: {
                  minWords: 45,
                  maxWords: 75,
                  actualContent: "",
                },
              },
              {
                id: "blockquote-2-4-4-3",
                tag: "blockquote",
                additionalData: {
                  minWords: 20,
                  maxWords: 40,
                  actualContent: "",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // FAQ section
  {
    id: "h2-3",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "This FAQ section is designed for generating relevant questions and answers. To create meaningful questions, you should adopt the perspective of the user, which requires analyzing the existing content and understanding the target audience. Consider what three questions would be most interesting and useful for users within the context of the given topic. Then, generate those three questions and organize each one under an h3 heading, ensuring that each question is paired with a well-crafted answer.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 350,
      maxWords: 500,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-3-1",
        tag: "p",
        additionalData: {
          minWords: 70,
          maxWords: 120,
          actualContent: "",
        },
      },
      {
        id: "h3-3-2",
        tag: "h3",
        additionalData: {
          minWords: 160,
          maxWords: 240,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-2-1",
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 120,
              actualContent: "",
            },
          },
          {
            id: "ul-3-2-2",
            tag: "ul",
            additionalData: {
              minWords: 35,
              maxWords: 60,
              actualContent: "",
            },
          },
          {
            id: "p-3-2-3",
            tag: "p",
            additionalData: {
              minWords: 50,
              maxWords: 90,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-3-3",
        tag: "h3",
        additionalData: {
          minWords: 160,
          maxWords: 240,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-3-1",
            tag: "p",
            additionalData: {
              minWords: 65,
              maxWords: 115,
              actualContent: "",
            },
          },
          {
            id: "code-3-3-2",
            tag: "code",
            additionalData: {
              minWords: 20,
              maxWords: 40,
              actualContent: "",
            },
          },
          {
            id: "p-3-3-3",
            tag: "p",
            additionalData: {
              minWords: 55,
              maxWords: 100,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-3-4",
        tag: "h3",
        additionalData: {
          minWords: 160,
          maxWords: 240,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-4-1",
            tag: "p",
            additionalData: {
              minWords: 75,
              maxWords: 130,
              actualContent: "",
            },
          },
          {
            id: "ol-3-4-2",
            tag: "ol",
            additionalData: {
              minWords: 40,
              maxWords: 70,
              actualContent: "",
            },
          },
          {
            id: "p-3-4-3",
            tag: "p",
            additionalData: {
              minWords: 45,
              maxWords: 80,
              actualContent: "",
            },
          },
        ],
      },
    ],
  }
];
