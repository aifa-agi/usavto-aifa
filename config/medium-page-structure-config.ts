// @/config/medium-page-structure-config.ts

import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

export const MEDIUM_CONTENT_STRUCTURE: RootContentStructure[] = [
  // Introduction section
  {
    id: "h2-1",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 5-7 section-level keywords that introduce the topic and set context for child elements",
    ],
    taxonomy: "Guide | Section overview",
    attention: "Establish clear value and context in the opening.",
    intent: "Introduce the topic, frame the core message, and prepare readers for detailed content.",
    audiences: "General business audience and decision-makers; level: beginner-to-intermediate.",
    selfPrompt:
      "Create an H2 introduction section that establishes the topic, communicates immediate value, and sets expectations. Use clear, accessible language. Naturally integrate the listed keywords without stuffing. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
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
        keywords: ["Generate 2-3 introductory keywords aligned with the H2 topic."],
        taxonomy: "Supporting | Intro paragraph",
        attention: "Hook readers with clear, immediate value.",
        intent: "Set context and explain why this topic matters to the audience.",
        audiences: "General business audience; level: beginner-to-intermediate.",
        selfPrompt:
          "Write an introductory paragraph that clearly explains the topic scope and its relevance. Use specific, actionable language. Naturally integrate the provided keywords. Respect minWords/maxWords in additionalData. Generate the necessary content here.",
        additionalData: {
          minWords: 100,
          maxWords: 180,
          actualContent: "",
        },
      },
      {
        id: "p-1-2",
        tag: "p",
        keywords: ["Generate 2-3 supporting keywords that deepen the introduction."],
        taxonomy: "Supporting | Context paragraph",
        attention: "Provide concrete context or a relatable scenario.",
        intent: "Expand on the introduction with a specific angle or use case.",
        audiences: "Practitioners and managers; level: intermediate.",
        selfPrompt:
          "Write a context-building paragraph that introduces one concrete scenario, challenge, or application. Be specific and practical. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
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
    keywords: [
      "Generate 5-7 section-level keywords focused on technical concepts and foundational knowledge",
    ],
    taxonomy: "Guide | Technical foundation",
    attention: "Explain core technical concepts with clarity and precision.",
    intent: "Provide foundational technical knowledge that readers can build upon.",
    audiences: "Technical practitioners and implementers; level: intermediate-to-advanced.",
    selfPrompt:
      "Create an H2 section that establishes technical foundations with clear explanations, practical examples, and structured content. Use precise terminology while remaining accessible. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
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
        keywords: ["Generate 2-3 foundational keywords tied to core concepts."],
        taxonomy: "Supporting | Foundation paragraph",
        attention: "Define key concepts clearly and concisely.",
        intent: "Establish core technical understanding before diving deeper.",
        audiences: "Technical practitioners; level: intermediate.",
        selfPrompt:
          "Write a foundational paragraph that defines key concepts with clarity and precision. Use concrete examples where helpful. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 80,
          maxWords: 150,
          actualContent: "",
        },
      },
      {
        id: "p-2-2-3",
        tag: "p",
        keywords: ["Generate 1 transition keyword."],
        taxonomy: "Transitional | Micro-bridge",
        attention: "Smoothly transition to the data presentation.",
        intent: "Provide a brief bridge to the upcoming table.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a concise transition sentence that introduces the table or data comparison. Be brief and purposeful. Generate the necessary content here.",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "table-2-2-4",
        tag: "table",
        keywords: ["Generate 2-4 comparison or data-focused keywords."],
        taxonomy: "Data | Comparison table",
        attention: "Present technical comparisons or metrics clearly.",
        intent: "Provide scannable, structured data that supports the technical foundation.",
        audiences: "Analytical and technical readers; level: intermediate.",
        selfPrompt:
          "Create a compact comparison or data table with clear headers and well-organized rows. Define the meaning of each column. Keep the content within word constraints while ensuring clarity. Generate the necessary content here.",
        additionalData: {
          minWords: 80,
          maxWords: 160,
          actualContent: "",
        },
      },
      {
        id: "h3-2-2",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this subsection)."],
        taxonomy: "Guide | Technical subsection",
        attention: "Focus on a specific technical angle or component.",
        intent: "Drill down into a particular aspect of the technical foundation.",
        audiences: "Technical practitioners; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that explores a specific technical angle within the parent H2 context. Provide detailed, actionable information. Avoid overlap with sibling content. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-2-1",
            tag: "p",
            keywords: ["Generate 2-3 explanation-focused keywords."],
            taxonomy: "Supporting | Technical explanation",
            attention: "Explain the technical mechanism or approach clearly.",
            intent: "Clarify how or why this technical aspect works.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Write an explanatory paragraph that clarifies the technical mechanism, including concrete examples or scenarios. Keep it practical and precise. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 130,
              actualContent: "",
            },
          },
          {
            id: "ul-2-2-2",
            tag: "ul",
            keywords: ["Generate 2-3 checklist or feature keywords."],
            taxonomy: "List | Technical features",
            attention: "Highlight key features or requirements in a scannable format.",
            intent: "List 3-5 important technical features or requirements.",
            audiences: "Technical practitioners; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 3-5 concise items highlighting key technical features or requirements. One sentence per item. Ensure clarity and non-redundancy. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "p-2-2-3",
            tag: "p",
            keywords: ["Generate 2-3 outcome or implication keywords."],
            taxonomy: "Supporting | Technical implication",
            attention: "Highlight practical implications or outcomes.",
            intent: "Explain what these technical features mean for implementation.",
            audiences: "Practitioners and decision-makers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that explains the practical implications or outcomes of the technical features discussed. Be specific about benefits or constraints. Respect min/max words. Generate the necessary content here.",
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
    keywords: [
      "Generate 5-7 section-level keywords focused on implementation, process, and practical application",
    ],
    taxonomy: "Guide | Implementation section",
    attention: "Provide clear, actionable implementation guidance.",
    intent: "Guide readers through the practical implementation process with concrete steps.",
    audiences: "Implementers and technical practitioners; level: intermediate-to-advanced.",
    selfPrompt:
      "Create an H2 section that provides comprehensive implementation guidance with clear steps, practical examples, and code where appropriate. Structure the content for easy follow-along. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
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
        keywords: ["Generate 2-3 implementation-focused keywords."],
        taxonomy: "Supporting | Implementation intro",
        attention: "Set clear expectations for the implementation process.",
        intent: "Introduce the implementation approach and key considerations.",
        audiences: "Implementers; level: intermediate.",
        selfPrompt:
          "Write an introductory paragraph that frames the implementation process, highlighting key considerations and prerequisites. Be practical and specific. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 90,
          maxWords: 170,
          actualContent: "",
        },
      },
      {
        id: "h3-3-2",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this implementation step)."],
        taxonomy: "Guide | Implementation subsection",
        attention: "Focus on a specific implementation phase or component.",
        intent: "Detail a particular implementation step with practical guidance.",
        audiences: "Hands-on implementers; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that details a specific implementation step or phase. Include ordered steps, code examples, and practical tips. Avoid overlap with sibling content. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 180,
          maxWords: 280,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-2-1",
            tag: "p",
            keywords: ["Generate 2-3 step-specific keywords."],
            taxonomy: "Supporting | Step explanation",
            attention: "Explain what this implementation step achieves.",
            intent: "Clarify the purpose and outcome of this implementation phase.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that explains the purpose and expected outcome of this implementation step. Include context on why this step matters. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "ol-3-2-2",
            tag: "ol",
            keywords: ["Generate 2-3 procedural keywords."],
            taxonomy: "List | Ordered steps",
            attention: "Provide a clear, sequential procedure.",
            intent: "List 3-5 ordered steps for this implementation phase.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Create an ordered list with 3-5 sequential steps in logical order. Keep items concise, actionable, and imperative. Ensure clear progression. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 50,
              maxWords: 90,
              actualContent: "",
            },
          },
          {
            id: "code-3-2-3",
            tag: "code",
            keywords: ["Generate 1-2 technology or syntax keywords."],
            taxonomy: "Technical | Code example",
            attention: "Demonstrate with a practical code snippet.",
            intent: "Illustrate the implementation step with working code.",
            audiences: "Developers; level: intermediate-to-advanced.",
            selfPrompt:
              "Provide a concise code example or snippet that illustrates this implementation step. Include brief inline comments if helpful. Keep it minimal and self-explanatory. Respect min/max words. Generate the necessary content here.",
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
    keywords: [
      "Generate 5-7 FAQ-related keywords tied to common user questions and concerns",
    ],
    taxonomy: "FAQ | Q&A section",
    attention: "Anticipate and answer the most pressing user questions.",
    intent: "Address common questions with clear, helpful answers.",
    audiences: "Prospects, users, and decision-makers; level: beginner-to-intermediate.",
    selfPrompt:
      "This FAQ H2 section is designed for generating relevant questions and answers. Adopt the user's perspective by analyzing existing content and understanding the target audience. Generate four high-impact questions that would be most interesting and useful within the context of the topic. Organize each question under an H3 heading with a well-crafted answer. Avoid repeating content from other sections. Respect min/max words per element. Generate the necessary content here.",
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
        keywords: ["Generate 2-3 FAQ-intro keywords."],
        taxonomy: "Supporting | FAQ intro",
        attention: "Set expectations for the FAQ format and utility.",
        intent: "Briefly introduce how the FAQ helps users find quick answers.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a short introductory paragraph that explains the purpose of the FAQ section and how to use it. Keep it clear and user-centric. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 70,
          maxWords: 130,
          actualContent: "",
        },
      },
      {
        id: "h3-FAQ-1",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords aligned with user concerns."],
        taxonomy: "FAQ | Question heading",
        attention: "Formulate a highly relevant, commonly asked question.",
        intent: "Ask a question that reflects a top user concern or blocker.",
        audiences: "Prospects and users; level: beginner-to-intermediate.",
        selfPrompt:
          "Create an H3 question that reflects a common, high-priority user concern derived from the page topic and audience needs. Keep it direct, specific, and natural. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-1-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a clear, concise answer in 1-2 paragraphs.",
            intent: "Deliver a precise, user-friendly answer that resolves the question.",
            audiences: "Beginners and prospects; level: beginner-to-intermediate.",
            selfPrompt:
              "Write a clear, concise answer that directly addresses the question. Use plain, helpful language. Include one concrete example or constraint if applicable. Respect min/max words. Generate the necessary content here.",
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
        keywords: ["Generate 3-5 question-specific keywords for a distinct user concern."],
        taxonomy: "FAQ | Question heading",
        attention: "Pose a distinct, high-value question.",
        intent: "Ask a different question that addresses another common concern.",
        audiences: "Prospects and users; level: beginner-to-intermediate.",
        selfPrompt:
          "Create an H3 question that is distinct from the first and addresses a different top-priority user concern. Keep it clear, specific, and natural. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-2-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Answer clearly and helpfully.",
            intent: "Resolve the question with clarity and precision.",
            audiences: "Beginners and prospects; level: beginner-to-intermediate.",
            selfPrompt:
              "Write a clear, concise answer that resolves the question without ambiguity. Use simple, practical language. Respect min/max words. Generate the necessary content here.",
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
        keywords: ["Generate 3-5 question-specific keywords for a technical or decision-making concern."],
        taxonomy: "FAQ | Question heading",
        attention: "Address a technical or decision-blocking question.",
        intent: "Ask a question that helps users overcome a final hesitation.",
        audiences: "Decision-makers and technical users; level: intermediate.",
        selfPrompt:
          "Create an H3 question that addresses a common technical concern or decision-making blocker. Keep it targeted and distinct from prior questions. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-3-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a reassuring, specific answer.",
            intent: "Help readers confidently move forward with their decision.",
            audiences: "Decision-makers; level: intermediate.",
            selfPrompt:
              "Write a reassuring answer that resolves the concern with specifics (benefits, constraints, or examples). Keep it practical and concise. Respect min/max words. Generate the necessary content here.",
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
        keywords: ["Generate 3-5 question-specific keywords for an advanced or edge-case concern."],
        taxonomy: "FAQ | Question heading",
        attention: "Cover an advanced or edge-case scenario.",
        intent: "Ask a question that addresses a less common but important concern.",
        audiences: "Advanced users and specialists; level: intermediate-to-advanced.",
        selfPrompt:
          "Create an H3 question that covers an advanced scenario or edge case that power users might encounter. Keep it specific and valuable. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 220,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-4-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a detailed, expert-level answer.",
            intent: "Address the advanced concern with depth and precision.",
            audiences: "Advanced users; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a detailed answer that addresses the advanced scenario with precision. Include technical details or caveats as needed. Respect min/max words. Generate the necessary content here.",
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
    keywords: [
      "Generate 5-7 section-level keywords focused on synthesis, key takeaways, and next steps",
    ],
    taxonomy: "Guide | Summary and conclusion",
    attention: "Synthesize key points and guide readers toward action.",
    intent: "Summarize the main takeaways and provide clear next steps.",
    audiences: "All readers; level: general-to-intermediate.",
    selfPrompt:
      "Create an H2 summary section that synthesizes the key points from the page, reinforces the main value proposition, and suggests clear next steps or actions. Be concise and actionable. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
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
        keywords: ["Generate 2-3 summary-focused keywords."],
        taxonomy: "Supporting | Summary paragraph",
        attention: "Recap the main value and key insights concisely.",
        intent: "Summarize the core message and reinforce value.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a summary paragraph that recaps the main value and key insights from the page. Keep it concise and reinforcing. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 80,
          maxWords: 150,
          actualContent: "",
        },
      },
      {
        id: "table-5-3",
        tag: "table",
        keywords: ["Generate 2-4 comparison or summary-data keywords."],
        taxonomy: "Data | Summary table",
        attention: "Present key takeaways or comparisons in a scannable format.",
        intent: "Provide a compact, structured summary of key points or options.",
        audiences: "Decision-makers and analysts; level: intermediate.",
        selfPrompt:
          "Create a compact summary table that presents key takeaways, comparisons, or options with clear headers. Keep the content organized and within word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 80,
          maxWords: 160,
          actualContent: "",
        },
      },
      {
        id: "ul-5-2",
        tag: "ul",
        keywords: ["Generate 2-3 takeaway or action keywords."],
        taxonomy: "List | Key takeaways",
        attention: "Highlight 3-5 key takeaways in a scannable list.",
        intent: "Provide a bullet list of the most important points or actions.",
        audiences: "Busy readers; level: general.",
        selfPrompt:
          "Create an unordered list with 3-5 key takeaways or action items. One sentence per item, clear and actionable. Avoid redundancy and maintain consistent style. Respect word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 50,
          maxWords: 90,
          actualContent: "",
        },
      },
      {
        id: "p-5-3",
        tag: "p",
        keywords: ["Generate 2-3 next-step or CTA keywords."],
        taxonomy: "Supporting | Call-to-action",
        attention: "Guide readers toward the next logical step.",
        intent: "Suggest clear next actions or resources for further engagement.",
        audiences: "Engaged readers; level: general-to-intermediate.",
        selfPrompt:
          "Write a closing paragraph that suggests clear next steps, resources, or calls-to-action for readers who want to proceed. Keep it practical and encouraging. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 70,
          maxWords: 130,
          actualContent: "",
        },
      },
    ],
  },
];
