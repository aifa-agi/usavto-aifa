// @/config/default-page-structure-config.ts

import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

export const DEFAULT_CONTENT_STRUCTURE: RootContentStructure[] = [
  // Introduction section
  {
    id: "h2-1",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 5-7 section-level keywords that introduce the topic, establish context, and set the foundation for the entire page",
    ],
    taxonomy: "Guide | Section overview",
    attention: "Establish clear value and compelling context from the first sentence.",
    intent: "Introduce the topic comprehensively, communicate core value, and prepare readers for in-depth exploration.",
    audiences: "General business audience, decision-makers, and practitioners; level: beginner-to-intermediate.",
    selfPrompt:
      "Create an H2 introduction section that establishes the topic with clarity and impact. Frame the core message, state the value proposition, and set expectations for what follows. Use accessible language while maintaining authority. Naturally integrate the listed keywords without stuffing. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 200,
      maxWords: 350,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-1-1",
        tag: "p",
        keywords: ["Generate 2-3 introductory keywords that hook readers and establish immediate relevance."],
        taxonomy: "Supporting | Hook paragraph",
        attention: "Capture attention with a strong, specific opening statement.",
        intent: "Hook readers immediately and establish why this topic matters now.",
        audiences: "General business audience; level: beginner-to-intermediate.",
        selfPrompt:
          "Write a compelling opening paragraph that hooks readers with specific value and relevance. Lead with impact, avoid generic statements. Naturally integrate the provided keywords. Respect minWords/maxWords in additionalData. Generate the necessary content here.",
        additionalData: {
          minWords: 120,
          maxWords: 250,
          actualContent: "",
        },
      },
      {
        id: "p-1-2",
        tag: "p",
        keywords: ["Generate 2-3 context-building keywords that expand the introduction."],
        taxonomy: "Supporting | Context paragraph",
        attention: "Provide concrete context with a relatable scenario or challenge.",
        intent: "Deepen context by introducing a specific angle, use case, or common challenge.",
        audiences: "Practitioners and managers; level: intermediate.",
        selfPrompt:
          "Write a context-building paragraph that expands on the opening with a concrete scenario, challenge, or application. Be specific and relatable. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 80,
          maxWords: 180,
          actualContent: "",
        },
      },
      {
        id: "p-1-3",
        tag: "p",
        keywords: ["Generate 1 transition keyword."],
        taxonomy: "Transitional | Micro-bridge",
        attention: "Smoothly transition to supporting evidence.",
        intent: "Provide a brief bridge to the upcoming blockquote.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a concise transition sentence that introduces the following quote or evidence. Be brief and purposeful. Generate the necessary content here.",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "blockquote-1-4",
        tag: "blockquote",
        keywords: ["Generate 1-2 authority or evidence keywords."],
        taxonomy: "Supporting | Evidence quote",
        attention: "Deliver a proof point or expert perspective.",
        intent: "Reinforce credibility and value with a relevant, authoritative quote.",
        audiences: "Skeptical readers and decision-makers; level: intermediate.",
        selfPrompt:
          "Insert a concise, relevant quote that reinforces the introduction's key message. Prefer Internal KB as the source; if unavailable, use External KB. One to two sentences. Cite the perspective (internal expertise or external insight). Respect word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 25,
          maxWords: 50,
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
      "Generate 5-7 section-level keywords focused on technical foundations, core concepts, and fundamental principles",
    ],
    taxonomy: "Guide | Technical foundation",
    attention: "Explain foundational concepts with precision and clarity.",
    intent: "Establish comprehensive technical foundations that readers can build upon throughout the page.",
    audiences: "Technical practitioners, developers, and implementers; level: intermediate-to-advanced.",
    selfPrompt:
      "Create an H2 section that establishes robust technical foundations with clear explanations, structured subsections, practical examples, and data. Use precise terminology while maintaining accessibility. Organize content for progressive understanding. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 400,
      maxWords: 600,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-2-1",
        tag: "p",
        keywords: ["Generate 2-3 foundational keywords tied to core technical concepts."],
        taxonomy: "Supporting | Foundation paragraph",
        attention: "Define key technical concepts clearly and authoritatively.",
        intent: "Establish core technical understanding before exploring subsections.",
        audiences: "Technical practitioners; level: intermediate.",
        selfPrompt:
          "Write a foundational paragraph that defines key technical concepts with precision and clarity. Use concrete examples and analogies where helpful. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "h3-2-2",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this technical subsection)."],
        taxonomy: "Guide | Technical subsection",
        attention: "Focus on a specific technical component or principle.",
        intent: "Explore a particular technical aspect in depth with structured content and data.",
        audiences: "Technical practitioners; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that explores a specific technical component or principle within the parent H2 context. Provide detailed explanations, data comparisons, and practical insights. Avoid overlap with sibling subsections. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-2-1",
            tag: "p",
            keywords: ["Generate 2-3 explanation-focused keywords."],
            taxonomy: "Supporting | Technical explanation",
            attention: "Explain the technical mechanism with clarity and depth.",
            intent: "Clarify how or why this technical aspect functions.",
            audiences: "Implementers and developers; level: intermediate.",
            selfPrompt:
              "Write an explanatory paragraph that clarifies the technical mechanism or principle, including concrete examples or scenarios. Keep it precise and actionable. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "p-2-2-2",
            tag: "p",
            keywords: ["Generate 2-3 detail-oriented keywords."],
            taxonomy: "Supporting | Technical detail",
            attention: "Provide additional technical detail or nuance.",
            intent: "Expand on the explanation with important details or constraints.",
            audiences: "Technical practitioners; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a paragraph that expands on the technical explanation with important details, constraints, or nuances. Be specific and thorough. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
            id: "p-2-2-3",
            tag: "p",
            keywords: ["Generate 1 transition keyword."],
            taxonomy: "Transitional | Micro-bridge",
            attention: "Smoothly transition to the data presentation.",
            intent: "Provide a brief bridge to the upcoming table or comparison.",
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
            attention: "Present technical comparisons or specifications clearly.",
            intent: "Provide scannable, structured data that supports the technical explanation.",
            audiences: "Analytical and technical readers; level: intermediate.",
            selfPrompt:
              "Create a compact comparison or data table with clear headers and well-organized rows. Define the meaning of each column and row category. Keep the content within word constraints while ensuring clarity and completeness. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-2-3",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this practical application angle)."],
        taxonomy: "Guide | Application subsection",
        attention: "Focus on practical application and implementation.",
        intent: "Demonstrate how to apply the technical foundation in practice.",
        audiences: "Implementers and developers; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that demonstrates practical application of the technical foundation. Include code examples, actionable lists, and outcome-focused content. Avoid overlap with sibling subsections. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-3-1",
            tag: "p",
            keywords: ["Generate 2-3 application-focused keywords."],
            taxonomy: "Supporting | Application explanation",
            attention: "Explain how to apply the concept in practice.",
            intent: "Clarify the practical application with concrete guidance.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that explains how to apply the technical concept in practice, including specific scenarios or use cases. Be actionable and concrete. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "ul-2-3-2",
            tag: "ul",
            keywords: ["Generate 2-3 checklist or best-practice keywords."],
            taxonomy: "List | Best practices",
            attention: "Provide actionable best practices in a scannable format.",
            intent: "List 3-5 key best practices or considerations for application.",
            audiences: "Practitioners; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 3-5 concise best practices or key considerations for applying the concept. One sentence per item, imperative style. Ensure clarity and non-redundancy. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "code-2-3-3",
            tag: "code",
            keywords: ["Generate 1-2 technology or syntax keywords."],
            taxonomy: "Technical | Code example",
            attention: "Demonstrate with a practical code snippet.",
            intent: "Illustrate the application with working code or pseudo-code.",
            audiences: "Developers and technical implementers; level: intermediate-to-advanced.",
            selfPrompt:
              "Provide a concise code example or snippet that illustrates the practical application. Include brief inline comments if helpful. Keep it minimal, relevant, and self-explanatory. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 20,
              maxWords: 50,
              actualContent: "",
            },
          },
          {
            id: "p-2-3-4",
            tag: "p",
            keywords: ["Generate 2-3 outcome or result keywords."],
            taxonomy: "Supporting | Outcome",
            attention: "Highlight expected outcomes or benefits.",
            intent: "Explain what results or benefits to expect from this application.",
            audiences: "Outcome-driven readers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that describes expected outcomes, benefits, or results from applying this approach. Be specific and measurable where possible. Respect min/max words. Generate the necessary content here.",
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

  // Implementation Process section
  {
    id: "h2-3",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 5-7 section-level keywords focused on implementation methodology, step-by-step processes, and practical execution",
    ],
    taxonomy: "Guide | Implementation section",
    attention: "Provide comprehensive, actionable implementation guidance with clear structure.",
    intent: "Guide readers through the complete implementation process with detailed steps, code examples, and nested subsections.",
    audiences: "Implementers, developers, and technical practitioners; level: intermediate-to-advanced.",
    selfPrompt:
      "Create an H2 section that provides comprehensive implementation guidance with clear methodology, step-by-step processes, nested subsections, code examples, and practical tips. Structure the content for easy follow-along and progressive complexity. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 500,
      maxWords: 750,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-3-1",
        tag: "p",
        keywords: ["Generate 1 transition keyword."],
        taxonomy: "Transitional | Section opener",
        attention: "Introduce the implementation section clearly.",
        intent: "Provide a brief opening that sets context for the implementation process.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a brief opening sentence that introduces the implementation section and what readers will learn. Be concise and clear. Generate the necessary content here.",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "p-3-2",
        tag: "p",
        keywords: ["Generate 2-3 implementation-framing keywords."],
        taxonomy: "Supporting | Implementation intro",
        attention: "Set clear expectations for the implementation approach.",
        intent: "Introduce the implementation methodology, key phases, and prerequisites.",
        audiences: "Implementers; level: intermediate.",
        selfPrompt:
          "Write an introductory paragraph that frames the implementation process, highlighting the overall approach, key phases, and prerequisites. Be practical and specific. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 110,
          maxWords: 220,
          actualContent: "",
        },
      },
      {
        id: "h3-3-3",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this implementation phase)."],
        taxonomy: "Guide | Implementation subsection",
        attention: "Focus on a specific implementation phase with detailed guidance.",
        intent: "Detail a particular implementation phase with ordered steps, code, and nested subtopics.",
        audiences: "Hands-on implementers and developers; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that details a specific implementation phase or component. Include ordered procedural steps, code examples, and nested H4 for complex subtopics. Avoid overlap with sibling content. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 350,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-3-1",
            tag: "p",
            keywords: ["Generate 2-3 phase-specific keywords."],
            taxonomy: "Supporting | Phase explanation",
            attention: "Explain what this implementation phase achieves and why it matters.",
            intent: "Clarify the purpose, scope, and expected outcome of this phase.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that explains the purpose and expected outcome of this implementation phase. Include context on why this phase is important in the overall process. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
          {
            id: "ol-3-3-2",
            tag: "ol",
            keywords: ["Generate 2-3 procedural keywords."],
            taxonomy: "List | Ordered steps",
            attention: "Provide a clear, sequential procedure for this phase.",
            intent: "List 3-5 ordered steps for executing this implementation phase.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Create an ordered list with 3-5 sequential steps in logical order for this phase. Keep items concise, actionable, and imperative. Ensure clear progression. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 50,
              maxWords: 100,
              actualContent: "",
            },
          },
          {
            id: "h4-3-3-3",
            tag: "h4",
            keywords: ["Generate 3-5 keywords (inherit 1-2 from H3, add 2-3 specific to this nested subtopic)."],
            taxonomy: "Guide | Nested subtopic",
            attention: "Drill down into a tightly scoped technical subtopic within the phase.",
            intent: "Explore a specific, complex aspect of the implementation phase in detail.",
            audiences: "Advanced implementers and developers; level: intermediate-to-advanced.",
            selfPrompt:
              "Develop an H4 subtopic that drills down into a specific, complex aspect of the H3 implementation phase. Provide detailed explanation, code examples, and practical guidance. Avoid overlap with sibling content. Respect word limits. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 200,
              actualContent: "",
            },
            realContentStructure: [
              {
                id: "p-3-3-3-1",
                tag: "p",
                keywords: ["Generate 2-3 micro-detail keywords."],
                taxonomy: "Supporting | Detailed explanation",
                attention: "Explain the technical detail with precision and depth.",
                intent: "Clarify a fine-grained technical detail crucial to successful implementation.",
                audiences: "Hands-on implementers; level: intermediate-to-advanced.",
                selfPrompt:
                  "Write a paragraph explaining a fine-grained technical detail of the H4 subtopic. Be precise, thorough, and practical. Include constraints or gotchas if relevant. Respect word constraints. Generate the necessary content here.",
                additionalData: {
                  minWords: 75,
                  maxWords: 150,
                  actualContent: "",
                },
              },
              {
                id: "code-3-3-3-2",
                tag: "code",
                keywords: ["Generate 1-2 technology or implementation keywords."],
                taxonomy: "Technical | Code example",
                attention: "Demonstrate the subtopic with a practical code snippet.",
                intent: "Illustrate the detailed concept with working code or advanced pseudo-code.",
                audiences: "Developers; level: intermediate-to-advanced.",
                selfPrompt:
                  "Provide a code example or snippet that illustrates the H4 subtopic in practice. Include inline comments for complex logic. Keep it focused and self-explanatory. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 25,
                  maxWords: 60,
                  actualContent: "",
                },
              },
              {
                id: "p-3-3-3-3",
                tag: "p",
                keywords: ["Generate 2-3 implication or outcome keywords."],
                taxonomy: "Supporting | Technical implication",
                attention: "Highlight implications, outcomes, or best practices.",
                intent: "Explain what this implementation detail means for overall success.",
                audiences: "Outcome-driven implementers; level: intermediate.",
                selfPrompt:
                  "Write a paragraph that explains the implications or outcomes of implementing this detail correctly. Include best practices or warnings if applicable. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 65,
                  maxWords: 130,
                  actualContent: "",
                },
              },
            ],
          },
        ],
      },
      {
        id: "h3-3-4",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this complementary implementation angle)."],
        taxonomy: "Guide | Implementation subsection",
        attention: "Cover a complementary implementation aspect with practical guidance.",
        intent: "Address a different but related implementation concern with steps and evidence.",
        audiences: "Implementers and practitioners; level: intermediate.",
        selfPrompt:
          "Develop an H3 subsection that addresses a complementary implementation aspect distinct from the previous subsection. Include practical guidance, ordered steps, and expert quotes. Avoid overlap. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-4-1",
            tag: "p",
            keywords: ["Generate 2-3 aspect-specific keywords."],
            taxonomy: "Supporting | Aspect explanation",
            attention: "Explain this complementary implementation aspect clearly.",
            intent: "Clarify what this aspect covers and why it's important.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that explains this complementary implementation aspect, its purpose, and importance. Be clear and actionable. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 95,
              maxWords: 190,
              actualContent: "",
            },
          },
          {
            id: "blockquote-3-4-2",
            tag: "blockquote",
            keywords: ["Generate 1-2 expert or evidence keywords."],
            taxonomy: "Supporting | Expert quote",
            attention: "Use a targeted, credibility-boosting quote.",
            intent: "Reinforce the implementation guidance with expert perspective.",
            audiences: "Skeptical readers and decision-makers; level: intermediate.",
            selfPrompt:
              "Insert a short, targeted quote that reinforces this implementation aspect's value or approach. Prefer Internal KB; use External KB if needed. One to two sentences. Respect constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 20,
              maxWords: 45,
              actualContent: "",
            },
          },
          {
            id: "ol-3-4-3",
            tag: "ol",
            keywords: ["Generate 2-3 procedural keywords."],
            taxonomy: "List | Ordered steps",
            attention: "Provide sequential implementation steps.",
            intent: "List 3-5 ordered steps for this implementation aspect.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Create an ordered list with 3-5 sequential steps for this implementation aspect. Keep items concise, actionable, and imperative. Ensure logical progression. Respect word constraints. Generate the necessary content here.",
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

  // Advanced Topics section
  {
    id: "h2-4",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 5-7 section-level keywords focused on advanced concepts, optimization, edge cases, and expert-level techniques",
    ],
    taxonomy: "Guide | Advanced topics",
    attention: "Provide expert-level guidance on advanced concepts and optimizations.",
    intent: "Cover advanced topics, optimizations, edge cases, and expert techniques for sophisticated users.",
    audiences: "Advanced practitioners, technical experts, and power users; level: advanced.",
    selfPrompt:
      "Create an H2 section that covers advanced topics with depth and sophistication. Include complex subsections, expert insights, optimization techniques, and edge-case handling. Use precise technical language while maintaining clarity. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 450,
      maxWords: 650,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-4-1",
        tag: "p",
        keywords: ["Generate 2-3 advanced-topic introduction keywords."],
        taxonomy: "Supporting | Advanced intro",
        attention: "Set context for advanced topics and prerequisites.",
        intent: "Introduce the advanced section and establish prerequisite knowledge.",
        audiences: "Advanced users; level: advanced.",
        selfPrompt:
          "Write an introductory paragraph that frames the advanced topics section, establishes prerequisites, and sets expectations. Be precise and expert-oriented. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "h3-4-2",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this advanced subtopic)."],
        taxonomy: "Guide | Advanced subsection",
        attention: "Focus on a specific advanced concept or optimization technique.",
        intent: "Explore an advanced concept in depth with technical detail and practical guidance.",
        audiences: "Advanced practitioners; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection that explores a specific advanced concept or optimization technique. Provide detailed explanations, practical lists, and expert insights. Avoid overlap with sibling subsections. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-4-2-1",
            tag: "p",
            keywords: ["Generate 1 transition keyword."],
            taxonomy: "Transitional | Micro-bridge",
            attention: "Introduce the advanced subtopic smoothly.",
            intent: "Provide a brief transition to the detailed explanation.",
            audiences: "All readers; level: general.",
            selfPrompt:
              "Write a concise transition sentence that introduces the advanced subtopic. Be brief and purposeful. Generate the necessary content here.",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            id: "p-4-2-2",
            tag: "p",
            keywords: ["Generate 2-3 advanced-concept keywords."],
            taxonomy: "Supporting | Advanced explanation",
            attention: "Explain the advanced concept with precision and depth.",
            intent: "Clarify how this advanced concept works and when to apply it.",
            audiences: "Advanced practitioners; level: advanced.",
            selfPrompt:
              "Write a paragraph that explains the advanced concept with technical precision. Include complex details, constraints, and application scenarios. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
            id: "p-4-2-3",
            tag: "p",
            keywords: ["Generate 2-3 optimization or performance keywords."],
            taxonomy: "Supporting | Optimization detail",
            attention: "Provide optimization guidance or performance considerations.",
            intent: "Explain how to optimize or what performance characteristics to expect.",
            audiences: "Performance-focused users; level: advanced.",
            selfPrompt:
              "Write a paragraph that details optimization techniques or performance considerations for this advanced concept. Be specific with metrics or constraints where possible. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
          {
            id: "ul-4-2-4",
            tag: "ul",
            keywords: ["Generate 2-3 advanced-checklist keywords."],
            taxonomy: "List | Advanced considerations",
            attention: "Highlight key considerations or gotchas in a scannable format.",
            intent: "List 3-5 important advanced considerations, edge cases, or gotchas.",
            audiences: "Expert users; level: advanced.",
            selfPrompt:
              "Create an unordered list with 3-5 advanced considerations, edge cases, or gotchas. One sentence per item, technical and precise. Ensure non-redundancy. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 45,
              maxWords: 90,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-4-3",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to this distinct advanced angle)."],
        taxonomy: "Guide | Advanced subsection",
        attention: "Cover a distinct advanced topic or edge-case scenario.",
        intent: "Address a different advanced concern with depth and expert evidence.",
        audiences: "Advanced practitioners and specialists; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection that addresses a distinct advanced topic or edge-case scenario. Include detailed explanations, ordered guidance, and expert quotes. Avoid overlap with sibling content. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 250,
          maxWords: 350,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-4-3-1",
            tag: "p",
            keywords: ["Generate 2-3 edge-case or scenario keywords."],
            taxonomy: "Supporting | Advanced scenario",
            attention: "Explain a complex scenario or edge case in detail.",
            intent: "Clarify when and how this advanced scenario applies.",
            audiences: "Specialists; level: advanced.",
            selfPrompt:
              "Write a paragraph that explains a complex scenario or edge case in detail. Include conditions, constraints, and application contexts. Be thorough and precise. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "p-4-3-2",
            tag: "p",
            keywords: ["Generate 2-3 solution or mitigation keywords."],
            taxonomy: "Supporting | Solution detail",
            attention: "Provide solution approaches or mitigation strategies.",
            intent: "Explain how to handle or mitigate the advanced scenario.",
            audiences: "Problem-solvers; level: advanced.",
            selfPrompt:
              "Write a paragraph that details solution approaches or mitigation strategies for the advanced scenario. Be specific and actionable. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "ol-4-3-3",
            tag: "ol",
            keywords: ["Generate 2-3 procedural or diagnostic keywords."],
            taxonomy: "List | Ordered steps",
            attention: "Provide sequential steps for handling this advanced case.",
            intent: "List 3-5 ordered steps or diagnostic procedures.",
            audiences: "Advanced implementers; level: advanced.",
            selfPrompt:
              "Create an ordered list with 3-5 sequential steps or diagnostic procedures for this advanced case. Keep items precise, technical, and imperative. Ensure logical flow. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 55,
              maxWords: 110,
              actualContent: "",
            },
          },
          {
            id: "blockquote-4-3-4",
            tag: "blockquote",
            keywords: ["Generate 1-2 expert or authority keywords."],
            taxonomy: "Supporting | Expert quote",
            attention: "Reinforce with expert perspective or research insight.",
            intent: "Provide authoritative backing for the advanced guidance.",
            audiences: "Skeptical experts; level: advanced.",
            selfPrompt:
              "Insert a concise expert quote or research insight that reinforces the advanced guidance. Prefer Internal KB; use External KB if needed. One to two sentences. Respect constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 18,
              maxWords: 40,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Monitoring and Maintenance section
  {
    id: "h2-5",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 5-7 section-level keywords focused on ongoing monitoring, maintenance practices, troubleshooting, and lifecycle management",
    ],
    taxonomy: "Guide | Operations and maintenance",
    attention: "Provide comprehensive guidance on ongoing operations and maintenance.",
    intent: "Cover monitoring strategies, maintenance best practices, troubleshooting, and lifecycle management.",
    audiences: "Operations teams, maintainers, and long-term practitioners; level: intermediate-to-advanced.",
    selfPrompt:
      "Create an H2 section that covers ongoing monitoring, maintenance practices, troubleshooting approaches, and lifecycle management. Include practical checklists and detailed subsections. Use operational language while maintaining technical accuracy. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 400,
      maxWords: 550,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-5-1",
        tag: "p",
        keywords: ["Generate 2-3 operations-focused keywords."],
        taxonomy: "Supporting | Operations intro",
        attention: "Set context for ongoing operational responsibilities.",
        intent: "Introduce the importance of monitoring and maintenance for long-term success.",
        audiences: "Operations teams; level: intermediate.",
        selfPrompt:
          "Write an introductory paragraph that frames the monitoring and maintenance section, emphasizing long-term operational success. Be practical and responsibility-focused. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 105,
          maxWords: 210,
          actualContent: "",
        },
      },
      {
        id: "p-5-2",
        tag: "p",
        keywords: ["Generate 1 transition keyword."],
        taxonomy: "Transitional | Micro-bridge",
        attention: "Transition to detailed monitoring guidance.",
        intent: "Provide a brief bridge to the monitoring subsection.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a concise transition sentence that introduces the monitoring subsection. Be brief and clear. Generate the necessary content here.",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "h3-5-3",
        tag: "h3",
        keywords: ["Generate 4-6 keywords (inherit 2 from parent H2, add 2-4 specific to monitoring practices)."],
        taxonomy: "Guide | Monitoring subsection",
        attention: "Focus on specific monitoring strategies and best practices.",
        intent: "Detail monitoring approaches, key metrics, and actionable checklists.",
        audiences: "Operations teams and maintainers; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that details monitoring strategies, key metrics to track, and best practices. Include practical checklists and outcome-focused guidance. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-5-3-1",
            tag: "p",
            keywords: ["Generate 2-3 monitoring-specific keywords."],
            taxonomy: "Supporting | Monitoring explanation",
            attention: "Explain what to monitor and why it matters.",
            intent: "Clarify the monitoring approach and key indicators.",
            audiences: "Operations teams; level: intermediate.",
            selfPrompt:
              "Write a paragraph that explains the monitoring approach, key indicators to track, and why they matter for operational health. Be specific and metric-oriented. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "ul-5-3-2",
            tag: "ul",
            keywords: ["Generate 2-3 checklist or metric keywords."],
            taxonomy: "List | Monitoring checklist",
            attention: "Provide a scannable monitoring checklist.",
            intent: "List 3-5 key metrics or monitoring practices.",
            audiences: "Operations teams; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 3-5 key metrics or monitoring practices. One sentence per item, clear and actionable. Ensure non-redundancy and practical utility. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "p-5-3-3",
            tag: "p",
            keywords: ["Generate 2-3 outcome or maintenance keywords."],
            taxonomy: "Supporting | Maintenance guidance",
            attention: "Provide ongoing maintenance recommendations.",
            intent: "Explain maintenance practices and their expected outcomes.",
            audiences: "Maintainers; level: intermediate.",
            selfPrompt:
              "Write a paragraph that details ongoing maintenance practices and their expected outcomes or benefits. Be specific about frequency and impact. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 140,
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
      "Generate 5-7 FAQ-related keywords tied to common user questions, concerns, and decision-making blockers",
    ],
    taxonomy: "FAQ | Q&A section",
    attention: "Anticipate and answer the most pressing user questions comprehensively.",
    intent: "Address common questions with clear, helpful answers across beginner to advanced levels.",
    audiences: "Prospects, users, decision-makers, and technical stakeholders; level: beginner-to-advanced.",
    selfPrompt:
      "This FAQ H2 section is designed for generating relevant questions and answers. Adopt the user's perspective by analyzing existing content and understanding the target audience. Generate six high-impact questions that would be most interesting and useful within the context of the topic, covering beginner, intermediate, and advanced concerns. Organize each question under an H3 heading with a well-crafted answer. Avoid repeating content from other sections. Respect min/max words per element. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 450,
      maxWords: 600,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-FAQ",
        tag: "p",
        keywords: ["Generate 2-3 FAQ-intro keywords."],
        taxonomy: "Supporting | FAQ intro",
        attention: "Set expectations for the FAQ format and comprehensive coverage.",
        intent: "Introduce the FAQ section and how it helps users find quick, authoritative answers.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write an introductory paragraph that explains the purpose and organization of the FAQ section. Emphasize comprehensive coverage from basic to advanced questions. Keep it clear and user-centric. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 95,
          maxWords: 190,
          actualContent: "",
        },
      },
      {
        id: "h3-FAQ-1",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for a fundamental beginner question."],
        taxonomy: "FAQ | Question heading",
        attention: "Formulate a highly relevant beginner question.",
        intent: "Ask a foundational question that beginners commonly have.",
        audiences: "Beginners and prospects; level: beginner.",
        selfPrompt:
          "Create an H3 question that reflects a foundational, beginner-level concern derived from the page topic. Keep it direct, clear, and natural. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-1-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a clear, beginner-friendly answer.",
            intent: "Deliver a precise answer that resolves the beginner question with accessible language.",
            audiences: "Beginners; level: beginner.",
            selfPrompt:
              "Write a clear, beginner-friendly answer that directly addresses the question. Use simple language, concrete examples, and avoid jargon. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-2",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for a practical intermediate question."],
        taxonomy: "FAQ | Question heading",
        attention: "Pose a practical intermediate-level question.",
        intent: "Ask a question that intermediate users commonly encounter.",
        audiences: "Practitioners; level: intermediate.",
        selfPrompt:
          "Create an H3 question that addresses a practical, intermediate-level concern distinct from the first. Keep it specific and relevant. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-2-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Answer with practical, actionable guidance.",
            intent: "Resolve the intermediate question with clarity and practical examples.",
            audiences: "Practitioners; level: intermediate.",
            selfPrompt:
              "Write a practical answer that resolves the intermediate question with actionable guidance and examples. Use clear, professional language. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-3",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for a technical or implementation question."],
        taxonomy: "FAQ | Question heading",
        attention: "Address a technical implementation question.",
        intent: "Ask a question about technical implementation details.",
        audiences: "Technical implementers; level: intermediate-to-advanced.",
        selfPrompt:
          "Create an H3 question that addresses a technical implementation concern. Keep it targeted and distinct from prior questions. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-3-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a technically precise answer.",
            intent: "Resolve the technical question with detailed, accurate information.",
            audiences: "Technical implementers; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a technically precise answer that resolves the implementation question with details and constraints. Use appropriate technical terminology. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-4",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for a decision-making or business question."],
        taxonomy: "FAQ | Question heading",
        attention: "Focus on a decision-making blocker or business concern.",
        intent: "Ask a question that helps decision-makers overcome hesitation.",
        audiences: "Decision-makers; level: intermediate.",
        selfPrompt:
          "Create an H3 question that addresses a common business or decision-making concern. Keep it strategic and valuable. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-4-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a reassuring, strategic answer.",
            intent: "Help decision-makers confidently move forward with informed clarity.",
            audiences: "Decision-makers; level: intermediate.",
            selfPrompt:
              "Write a reassuring answer that resolves the business concern with strategic insights, benefits, and constraints. Keep it practical and confidence-building. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-5",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for an advanced or optimization question."],
        taxonomy: "FAQ | Question heading",
        attention: "Cover an advanced optimization or performance question.",
        intent: "Ask a question about advanced optimization or performance concerns.",
        audiences: "Advanced users and performance specialists; level: advanced.",
        selfPrompt:
          "Create an H3 question that covers an advanced optimization or performance concern. Keep it specific and expert-oriented. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-5-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide an expert-level, optimization-focused answer.",
            intent: "Address the advanced concern with depth, metrics, and best practices.",
            audiences: "Advanced users; level: advanced.",
            selfPrompt:
              "Write an expert-level answer that addresses the optimization question with depth, specific metrics, and best practices. Use precise technical language. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-6",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for a troubleshooting or edge-case question."],
        taxonomy: "FAQ | Question heading",
        attention: "Address a troubleshooting or edge-case scenario.",
        intent: "Ask a question about handling problems or edge cases.",
        audiences: "Troubleshooters and support teams; level: intermediate-to-advanced.",
        selfPrompt:
          "Create an H3 question that addresses a common troubleshooting scenario or edge case. Keep it practical and solution-oriented. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-6-1",
            tag: "p",
            keywords: ["Generate 2-3 answer-focused keywords."],
            taxonomy: "FAQ | Answer",
            attention: "Provide a solution-oriented troubleshooting answer.",
            intent: "Help readers resolve the problem or handle the edge case effectively.",
            audiences: "Troubleshooters; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a solution-oriented answer that helps readers troubleshoot or handle the edge case. Include diagnostic steps or workarounds where applicable. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Summary section
  {
    id: "h2-7",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 5-7 section-level keywords focused on synthesis, summary, key takeaways, comparisons, and calls-to-action",
    ],
    taxonomy: "Guide | Summary and conclusion",
    attention: "Synthesize key points comprehensively and guide readers toward next steps.",
    intent: "Summarize the main insights, provide comparative data, highlight key takeaways, and suggest clear next actions.",
    audiences: "All readers; level: general-to-intermediate.",
    selfPrompt:
      "Create an H2 summary section that synthesizes the key points from the entire page, presents comparative data in tables, reinforces the main value proposition with expert quotes, and suggests clear next steps or calls-to-action. Be comprehensive yet concise. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 300,
      maxWords: 450,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-7-1",
        tag: "p",
        keywords: ["Generate 2-3 summary-opening keywords."],
        taxonomy: "Supporting | Summary intro",
        attention: "Open the summary with a clear synthesis of the core message.",
        intent: "Recap the main value and purpose concisely.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write an opening paragraph that recaps the main value and core message of the page. Keep it clear, reinforcing, and synthesizing. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 60,
          maxWords: 240,
          actualContent: "",
        },
      },
      {
        id: "p-7-2",
        tag: "p",
        keywords: ["Generate 2-3 insight or reflection keywords."],
        taxonomy: "Supporting | Summary reflection",
        attention: "Provide reflective insights or broader implications.",
        intent: "Highlight broader implications or reflective insights from the content.",
        audiences: "Decision-makers and strategic thinkers; level: intermediate.",
        selfPrompt:
          "Write a paragraph that provides reflective insights or highlights broader implications of the content. Be thoughtful and strategic. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "table-6-2-2",
        tag: "table",
        keywords: ["Generate 2-4 comparison or summary-data keywords."],
        taxonomy: "Data | Summary table",
        attention: "Present key comparisons or summary data in a scannable format.",
        intent: "Provide a comprehensive comparison table or summary of key points, options, or metrics.",
        audiences: "Decision-makers and analysts; level: intermediate.",
        selfPrompt:
          "Create a comprehensive summary table that presents key comparisons, options, or metrics with clear headers and well-organized data. Ensure the table synthesizes important information from the page. Keep content within word constraints while ensuring completeness. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
      },
      {
        id: "ul-7-3",
        tag: "ul",
        keywords: ["Generate 2-3 takeaway or action keywords."],
        taxonomy: "List | Key takeaways",
        attention: "Highlight 3-5 key takeaways in a scannable list.",
        intent: "Provide a bullet list of the most important points or actions readers should remember.",
        audiences: "Busy readers and decision-makers; level: general.",
        selfPrompt:
          "Create an unordered list with 3-5 key takeaways or must-remember points. One sentence per item, clear and impactful. Avoid redundancy and maintain consistent style. Respect word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 60,
          maxWords: 120,
          actualContent: "",
        },
      },
      {
        id: "p-7-4",
        tag: "p",
        keywords: ["Generate 2-3 next-step or CTA keywords."],
        taxonomy: "Supporting | Call-to-action",
        attention: "Guide readers toward clear, actionable next steps.",
        intent: "Suggest specific next actions, resources, or engagement opportunities.",
        audiences: "Engaged readers and prospects; level: general-to-intermediate.",
        selfPrompt:
          "Write a closing paragraph that suggests clear, specific next steps, resources, or calls-to-action for readers who want to proceed or learn more. Keep it practical, encouraging, and actionable. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 80,
          maxWords: 160,
          actualContent: "",
        },
      },
      {
        id: "blockquote-7-5",
        tag: "blockquote",
        keywords: ["Generate 1-2 inspirational or authority keywords."],
        taxonomy: "Supporting | Closing quote",
        attention: "End with an impactful, memorable quote.",
        intent: "Reinforce the summary with a final authoritative or inspirational quote.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Insert a final, impactful quote that reinforces the page's core message or inspires action. Prefer Internal KB; use External KB if needed. One to two sentences. Keep it memorable and relevant. Respect constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 15,
          maxWords: 35,
          actualContent: "",
        },
      },
    ],
  },
];
