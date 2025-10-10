// @/config/compact-page-structure-config.ts

import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";


export const COMPACT_CONTENT_STRUCTURE: RootContentStructure[] = [
  // Introduction section
  {
    id: "h2-1",
    tag: "h2",
    classification: "semantic",
    keywords: [
      // High-level prompting for keywords (kept explicit for consistency)
      "Generate 5-7 section-level keywords inherited by children",
    ],
    taxonomy: "Guide | Section overview",
    attention: "Set clear context and value in one sentence.",
    intent: "Introduce the topic and prepare readers for the main takeaways.",
    audiences: "Decision-makers and practitioners; level: intermediate.",
    selfPrompt:
      "Create the H2 section overview that frames the page topic, states the value, and aligns with user intent. Provide a strong, succinct setup and ensure a logical transition into subsequent subsections. Naturally integrate the listed keywords without stuffing. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
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
        keywords: ["Generate 2-3 relevant keywords for this introductory paragraph."],
        taxonomy: "Supporting | Intro paragraph",
        attention: "Hook readers with a concrete benefit.",
        intent: "Set immediate context and clarify why this matters.",
        audiences: "General business audience; level: beginner-to-intermediate.",
        selfPrompt:
          "Write an introductory paragraph that cleanly explains the scope and value of the topic. Use actionable, specific statements and avoid fluff. Naturally integrate the provided keywords. Respect minWords/maxWords in additionalData. Generate the necessary content here.",
        additionalData: {
          minWords: 90,
          maxWords: 160,
          actualContent: "",
        },
      },
      {
        id: "p-1-2",
        tag: "p",
        keywords: ["Generate 2-3 supporting keywords aligned with the main topic."],
        taxonomy: "Supporting | Context paragraph",
        attention: "Highlight a pressing pain point.",
        intent: "Deepen context with one concrete angle or use case.",
        audiences: "Practitioners and managers; level: intermediate.",
        selfPrompt:
          "Write a context-building paragraph that introduces one concrete angle (challenge, scenario, or use case). Be specific and useful. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 70,
          maxWords: 130,
          actualContent: "",
        },
      },
      {
        id: "p-1-3",
        tag: "p",
        keywords: ["Generate 1-2 transition keywords."],
        taxonomy: "Transitional | Separator",
        attention: "Smoothly transition to the next idea.",
        intent: "Provide a brief transition or micro-summary.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a short transition line (separator) to guide readers to the next block. Keep it concise and purposeful. Generate the necessary content here.",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "blockquote-1-4",
        tag: "blockquote",
        keywords: ["Generate 1-2 keywords tied to authority or evidence."],
        taxonomy: "Supporting | Evidence quote",
        attention: "Deliver a proof point or expert angle.",
        intent: "Reinforce credibility with a relevant quote.",
        audiences: "Skeptical readers; level: intermediate.",
        selfPrompt:
          "Insert a concise, relevant quote that reinforces the section’s claim. Prefer Internal KB as the source; if unavailable, use External KB. One to two sentences. Cite the perspective (internal expertise or external insight). Respect word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 25,
          maxWords: 45,
          actualContent: "",
        },
      },
      {
        id: "p-1-5",
        tag: "p",
        keywords: ["Generate 2-3 value-centric keywords."],
        taxonomy: "Supporting | Value paragraph",
        attention: "State a clear, user-centric value.",
        intent: "Summarize the benefit and set up the next section.",
        audiences: "Decision-makers; level: intermediate.",
        selfPrompt:
          "Write a value-focused paragraph that summarizes what readers gain and prepares them for the next part. Keep it concrete and relevant. Respect minWords/maxWords. Generate the necessary content here.",
        additionalData: {
          minWords: 60,
          maxWords: 110,
          actualContent: "",
        },
      },
      {
        id: "ul-1-6",
        tag: "ul",
        keywords: ["Generate 2-3 list-related keywords."],
        taxonomy: "List | Key takeaways",
        attention: "Make the content scannable.",
        intent: "Provide 3–5 concise, actionable bullets.",
        audiences: "Busy readers; level: general.",
        selfPrompt:
          "Create a concise unordered list with 3–5 items. Each item should be one sentence and deliver a practical takeaway. Avoid redundancy and keep a consistent style. Respect word constraints. Generate the necessary content here.",
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
    keywords: [
      "Generate 5-7 section-level keywords to guide h3/h4 children.",
    ],
    taxonomy: "Guide | Core section",
    attention: "Focus on concrete, high-value insights.",
    intent: "Deliver the main body of actionable, expert information.",
    audiences: "Practitioners and technical stakeholders; level: intermediate-to-advanced.",
    selfPrompt:
      "Create the core H2 section that delivers actionable, specific, and data-backed insights. Structure content for clarity and depth. Avoid overlap with previous sections. Integrate keywords naturally. Respect minWords/maxWords. Generate the necessary content here.",
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
        keywords: ["Generate 2-3 supporting keywords for this body paragraph."],
        taxonomy: "Supporting | Body paragraph",
        attention: "Lead with a specific, useful claim.",
        intent: "Explain a key concept or mechanism clearly.",
        audiences: "Practitioners; level: intermediate.",
        selfPrompt:
          "Write a body paragraph that explains one key concept with clarity and usefulness. Use concrete examples where helpful. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 80,
          maxWords: 140,
          actualContent: "",
        },
      },
      {
        id: "p-2-2",
        tag: "p",
        keywords: ["Generate 1 transition keyword."],
        taxonomy: "Transitional | Micro-bridge",
        attention: "Maintain flow between ideas.",
        intent: "Provide a short bridge to the next subsection.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a short transitional sentence that smoothly connects ideas. Be concise and purposeful. Generate the necessary content here.",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "h3-2-3",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific)."],
        taxonomy: "Guide | Subsection",
        attention: "Define a sharp, unique angle.",
        intent: "Expand the parent H2 with a focused subtopic.",
        audiences: "Practitioners; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that expands the parent H2 with a unique, sharply defined angle. Avoid overlapping with sibling subsections. State the micro-intent and expected outcomes. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-3-1",
            tag: "p",
            keywords: ["Generate 2-3 micro-intent keywords."],
            taxonomy: "Supporting | Explanation",
            attention: "Clarify ‘how’ or ‘why’ directly.",
            intent: "Explain the key idea with a concrete example.",
            audiences: "Hands-on implementers; level: intermediate.",
            selfPrompt:
              "Write an explanatory paragraph that clarifies how/why this subtopic matters, including one concrete example. Keep it practical. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 130,
              actualContent: "",
            },
          },
          {
            id: "ul-2-3-2",
            tag: "ul",
            keywords: ["Generate 2-3 checklist-style keywords."],
            taxonomy: "List | Action steps",
            attention: "Make a compact, actionable checklist.",
            intent: "List 3–5 steps or tips readers can apply.",
            audiences: "Practitioners; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 3–5 concise, actionable steps or tips. One sentence per item, imperative style. Ensure non-overlapping items. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 50,
              maxWords: 85,
              actualContent: "",
            },
          },
          {
            id: "p-2-3-3",
            tag: "p",
            keywords: ["Generate 2-3 result-focused keywords."],
            taxonomy: "Supporting | Outcome",
            attention: "Highlight expected outcomes or metrics.",
            intent: "Show what success looks like for this subtopic.",
            audiences: "Outcome-driven readers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that describes expected outcomes or metrics that indicate success. Be specific and measurable when possible. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 65,
              maxWords: 115,
              actualContent: "",
            },
          },
          {
            id: "code-2-3-4",
            tag: "code",
            keywords: ["Generate 1-2 technology-related keywords."],
            taxonomy: "Technical | Code example",
            attention: "Demonstrate with a concise code snippet.",
            intent: "Illustrate the concept via code or pseudo-code.",
            audiences: "Developers and technical practitioners; level: intermediate.",
            selfPrompt:
              "Provide a short code example or pseudo-code illustrating the concept. Keep it minimal and self-explanatory. Add a brief inline comment if useful. Respect min/max words. Generate the necessary content here.",
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
        keywords: ["Generate 4-6 keywords (inherit 2 from H2, add 2-4 specific to this angle)."],
        taxonomy: "Guide | Subsection",
        attention: "State a distinct, practical angle.",
        intent: "Cover a different but complementary facet of the H2.",
        audiences: "Practitioners; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection with a distinct, practical angle that complements the previous subsection without overlap. Clearly state the micro-intent and constraints. Integrate keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 280,
          maxWords: 400,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-4-1",
            tag: "p",
            keywords: ["Generate 2-3 clarity-focused keywords."],
            taxonomy: "Supporting | Clarification",
            attention: "Explain a key nuance succinctly.",
            intent: "Clarify a nuance or constraint of this subtopic.",
            audiences: "Practitioners; level: intermediate.",
            selfPrompt:
              "Write a paragraph that clarifies a key nuance, limitation, or boundary condition of this subtopic. Keep it specific and helpful. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 120,
              actualContent: "",
            },
          },
          {
            id: "table-2-4-2",
            tag: "table",
            keywords: ["Generate 2-4 comparison/data keywords."],
            taxonomy: "Data | Comparison table",
            attention: "Summarize comparisons or metrics clearly.",
            intent: "Present compact, scannable data with headers.",
            audiences: "Analytical readers; level: intermediate.",
            selfPrompt:
              "Create a compact comparison/data table with clear headers. Define the meaning of each column and keep the total size within word constraints. Summarize insights succinctly. Generate the necessary content here.",
            additionalData: {
              minWords: 90,
              maxWords: 150,
              actualContent: "",
            },
          },
          {
            id: "p-2-4-3",
            tag: "p",
            keywords: ["Generate 1 transition keyword."],
            taxonomy: "Transitional | Micro-bridge",
            attention: "Maintain flow within the subsection.",
            intent: "Provide a short bridge to the nested H4.",
            audiences: "All readers; level: general.",
            selfPrompt:
              "Write a concise transition to introduce the nested H4 topic. Be brief and purposeful. Generate the necessary content here.",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            id: "h4-2-4-4",
            tag: "h4",
            keywords: ["Generate 3-5 keywords (inherit 1-2 from H3, add 2-3 specific)."],
            taxonomy: "Guide | Nested subtopic",
            attention: "Focus on a tightly scoped subtopic.",
            intent: "Drill down into one precise angle of the H3.",
            audiences: "Practitioners; level: intermediate-to-advanced.",
            selfPrompt:
              "Develop an H4 subtopic that is tightly scoped to the H3. Provide a single, focused angle with clear value. Avoid overlap with sibling content. Respect word limits. Generate the necessary content here.",
            additionalData: {
              minWords: 130,
              maxWords: 200,
              actualContent: "",
            },
            realContentStructure: [
              {
                id: "p-2-4-4-1",
                tag: "p",
                keywords: ["Generate 2-3 micro-detail keywords."],
                taxonomy: "Supporting | Micro-detail",
                attention: "Explain one fine-grained detail.",
                intent: "Illuminate a detail crucial to implementation.",
                audiences: "Hands-on implementers; level: intermediate.",
                selfPrompt:
                  "Write a paragraph explaining one fine-grained detail of the H4 subtopic. Keep it practical and specific. Respect word constraints. Generate the necessary content here.",
                additionalData: {
                  minWords: 60,
                  maxWords: 105,
                  actualContent: "",
                },
              },
              {
                id: "ol-2-4-4-2",
                tag: "ol",
                keywords: ["Generate 2-3 stepwise keywords."],
                taxonomy: "List | Ordered steps",
                attention: "Provide a short, ordered procedure.",
                intent: "List 3–5 steps in logical order.",
                audiences: "Implementers; level: intermediate.",
                selfPrompt:
                  "Create an ordered list with 3–5 steps in a logical progression. Keep items concise and precise. Respect word constraints. Generate the necessary content here.",
                additionalData: {
                  minWords: 45,
                  maxWords: 75,
                  actualContent: "",
                },
              },
              {
                id: "blockquote-2-4-4-3",
                tag: "blockquote",
                keywords: ["Generate 1-2 evidence keywords."],
                taxonomy: "Supporting | Expert quote",
                attention: "Use a targeted, credibility-boosting quote.",
                intent: "Reinforce the H4 point with authority.",
                audiences: "Skeptical readers; level: intermediate.",
                selfPrompt:
                  "Insert a short, targeted quote that reinforces the H4’s claim. Prefer Internal KB; use External KB if needed. One to two sentences. Respect constraints. Generate the necessary content here.",
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
    id: "FAQ",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 5-7 FAQ-related keywords tied to user intent.",
    ],
    taxonomy: "FAQ | Q&A section",
    attention: "Anticipate top questions and answer succinctly.",
    intent: "Address the most pressing user questions with clarity.",
    audiences: "Prospects and users; level: beginner-to-intermediate.",
    selfPrompt:
      "This FAQ H2 introduces a focused Q&A area. Generate 3 high-impact questions aligned with the page topic and audience needs. Each question must be an H3 with a concise answer paragraph beneath. Avoid repeating content from other sections. Respect min/max words per element. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 350,
      maxWords: 500,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-FAQ",
        tag: "p",
        keywords: ["Generate 2-3 FAQ-intro keywords."],
        taxonomy: "Supporting | FAQ intro",
        attention: "Set expectations for the Q&A format.",
        intent: "Briefly introduce how the FAQ helps users.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a short paragraph introducing the FAQ purpose and how to use it. Keep it clear and user-centric. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 70,
          maxWords: 120,
          actualContent: "",
        },
      },
      {
        id: "h3-FAQ-1",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords."],
        taxonomy: "FAQ | Question heading",
        attention: "Formulate a highly relevant question.",
        intent: "Ask a common, high-impact user question.",
        audiences: "Prospects and users; level: beginner.",
        selfPrompt:
          "Create an H3 question that reflects a common, high-impact concern derived from the page topic and audience. Keep it direct and specific. Generate the necessary content here.",
        additionalData: {
          minWords: 160,
          maxWords: 240,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-1-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Answer clearly in 1–2 short paragraphs.",
            intent: "Provide a precise, user-friendly answer.",
            audiences: "Beginners; level: beginner-to-intermediate.",
            selfPrompt:
              "Write a concise answer that directly addresses the question. Use plain, helpful language. Include one concrete example or constraint if applicable. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-2",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords."],
        taxonomy: "FAQ | Question heading",
        attention: "Pose another top-priority user question.",
        intent: "Ask a distinct question that avoids overlap.",
        audiences: "Prospects and users; level: beginner-to-intermediate.",
        selfPrompt:
          "Create an H3 question that is distinct from the first and addresses another top-priority concern. Keep it clear and specific. Generate the necessary content here.",
        additionalData: {
          minWords: 160,
          maxWords: 240,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-2-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Deliver a concise, useful answer.",
            intent: "Resolve the question with clarity and precision.",
            audiences: "Beginners; level: beginner-to-intermediate.",
            selfPrompt:
              "Write a clear, concise answer that resolves the question without ambiguity. Use simple language and practical framing. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 65,
              maxWords: 115,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-3",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords."],
        taxonomy: "FAQ | Question heading",
        attention: "Focus on a decision-making blocker.",
        intent: "Ask a question that addresses a final hesitation.",
        audiences: "Prospects; level: beginner-to-intermediate.",
        selfPrompt:
          "Create an H3 question that addresses a common blocker or hesitation before conversion. Keep it targeted and distinct from prior questions. Generate the necessary content here.",
        additionalData: {
          minWords: 160,
          maxWords: 240,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-3-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a reassuring, specific answer.",
            intent: "Help readers confidently move forward.",
            audiences: "Prospects; level: beginner-to-intermediate.",
            selfPrompt:
              "Write a reassuring answer that resolves the hesitation with specifics (benefits, constraints, or example). Keep it practical and concise. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 130,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },
];
