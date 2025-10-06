// @/config/medium-page-structure-config.ts

import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Medium-sized content structure template
 * Total word count: ~900-1,800 words
 * Proportionally reduced sections while maintaining core structure
 */
export const MEDIUM_CONTENT_STRUCTURE: RootContentStructure[] = [
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
      minWords: 150,
      maxWords: 250,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-1-1",
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 180,
          actualContent: "",
        },
      },
      {
        id: "p-1-2",
        tag: "p",
        additionalData: {
          minWords: 60,
          maxWords: 120,
          actualContent: "",
        },
      },
    ],
  },

  // Technical Foundation section
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
      minWords: 250,
      maxWords: 400,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-2-1",
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 150,
          actualContent: "",
        },
      },
      {
            id: "p-2-2-3",
            tag: "p",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            id: "table-2-2-4",
            tag: "table",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
      {
        id: "h3-2-2",
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-2-1",
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 130,
              actualContent: "",
            },
          },
          {
            id: "ul-2-2-2",
            tag: "ul",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "p-2-2-3",
            tag: "p",
            additionalData: {
              minWords: 60,
              maxWords: 100,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Implementation Process section
  {
    id: "h2-3",
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
        id: "p-3-1",
        tag: "p",
        additionalData: {
          minWords: 90,
          maxWords: 170,
          actualContent: "",
        },
      },
      {
        id: "h3-3-2",
        tag: "h3",
        additionalData: {
          minWords: 180,
          maxWords: 280,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-2-1",
            tag: "p",
            additionalData: {
              minWords: 75,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "ol-3-2-2",
            tag: "ol",
            additionalData: {
              minWords: 50,
              maxWords: 90,
              actualContent: "",
            },
          },
          {
            id: "code-3-2-3",
            tag: "code",
            additionalData: {
              minWords: 20,
              maxWords: 50,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // FAQ section
  {
    id: "FAQ",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "This FAQ section is designed for generating relevant questions and answers. To create meaningful questions, you should adopt the perspective of the user, which requires analyzing the existing content and understanding the target audience. Consider what four questions would be most interesting and useful for users within the context of the given topic. Then, generate those four questions and organize each one under an h3 heading, ensuring that each question is paired with a well-crafted answer.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 300,
      maxWords: 450,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-FAQ",
        tag: "p",
        additionalData: {
          minWords: 70,
          maxWords: 130,
          actualContent: "",
        },
      },
      {
        id: "h3-FAQ-1",
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-1-1",
            tag: "p",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "FAQ-2",
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-2-1",
            tag: "p",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "FAQ-3",
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-3-1",
            tag: "p",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "FAQ-4",
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-4-1",
            tag: "p",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Summary section
  {
    id: "h2-5",
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
      minWords: 200,
      maxWords: 300,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-5-1",
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 150,
          actualContent: "",
        },
      },
      {
            id: "table-5-3",
            tag: "table",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
      {
        id: "ul-5-2",
        tag: "ul",
        additionalData: {
          minWords: 50,
          maxWords: 90,
          actualContent: "",
        },
      },
      {
        id: "p-5-3",
        tag: "p",
        additionalData: {
          minWords: 70,
          maxWords: 130,
          actualContent: "",
        },
      },
    ],
  },
];
