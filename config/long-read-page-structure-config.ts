// @/config/long-read-page-structure-config.ts

import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

export const LONG_READ_CONTENT_STRUCTURE: RootContentStructure[] = [
  // 1. Comprehensive Introduction section
  {
    id: "h2-1",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords that comprehensively introduce the topic, establish deep context, historical background, and set comprehensive expectations for an in-depth exploration",
    ],
    taxonomy: "Guide | Comprehensive overview",
    attention: "Establish authoritative context and compelling value from the opening sentence with depth and sophistication.",
    intent: "Provide a comprehensive introduction that covers historical context, current relevance, core value proposition, and prepares readers for an extensive, expert-level exploration.",
    audiences: "Decision-makers, senior practitioners, researchers, and strategic thinkers; level: intermediate-to-advanced.",
    selfPrompt:
      "Create a comprehensive H2 introduction section that establishes the topic with exceptional depth and authority. Cover historical evolution, current landscape, strategic importance, and core value proposition. Frame complex concepts accessibly while maintaining sophistication. Naturally integrate the listed keywords without stuffing. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 500,
      maxWords: 750,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-1-1",
        tag: "p",
        keywords: ["Generate 3-4 powerful hook keywords that establish immediate authority and relevance."],
        taxonomy: "Supporting | Authority hook",
        attention: "Open with an authoritative, data-backed statement that commands attention.",
        intent: "Establish immediate credibility and relevance with compelling evidence or insight.",
        audiences: "Senior decision-makers; level: intermediate-to-advanced.",
        selfPrompt:
          "Write a powerful opening paragraph that hooks readers with authoritative insights, compelling data, or strategic perspective. Lead with impact and specificity. Naturally integrate the provided keywords. Respect minWords/maxWords in additionalData. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 280,
          actualContent: "",
        },
      },
      {
        id: "p-1-2",
        tag: "p",
        keywords: ["Generate 3-4 historical or contextual keywords."],
        taxonomy: "Supporting | Historical context",
        attention: "Provide historical evolution and contextual background.",
        intent: "Establish how the topic evolved and why it matters in the current landscape.",
        audiences: "Strategic thinkers and researchers; level: intermediate-to-advanced.",
        selfPrompt:
          "Write a context-building paragraph that traces the historical evolution of the topic and explains its current strategic importance. Be specific with timelines and milestones where relevant. Integrate keywords naturally. Respect min/max word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 120,
          maxWords: 240,
          actualContent: "",
        },
      },
      {
        id: "p-1-3",
        tag: "p",
        keywords: ["Generate 2-3 current-landscape keywords."],
        taxonomy: "Supporting | Current state",
        attention: "Explain the current state of the field with recent data or trends.",
        intent: "Orient readers to the present state with concrete data and trends.",
        audiences: "Practitioners and analysts; level: intermediate.",
        selfPrompt:
          "Write a paragraph that describes the current state of the field, including recent trends, adoption rates, or market dynamics. Use specific data points where possible. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "p-1-4",
        tag: "p",
        keywords: ["Generate 1 transition keyword."],
        taxonomy: "Transitional | Micro-bridge",
        attention: "Transition smoothly to expert evidence.",
        intent: "Introduce the upcoming expert quote or data point.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write a concise transition sentence that introduces expert evidence or authoritative perspective. Be brief and purposeful. Generate the necessary content here.",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "blockquote-1-5",
        tag: "blockquote",
        keywords: ["Generate 2-3 authority or expert keywords."],
        taxonomy: "Supporting | Expert evidence",
        attention: "Reinforce with high-authority expert perspective.",
        intent: "Establish credibility with a relevant, authoritative quote from recognized expert.",
        audiences: "Skeptical decision-makers; level: intermediate-to-advanced.",
        selfPrompt:
          "Insert a compelling, authoritative quote that reinforces the introduction's strategic message. Prefer Internal KB as the source; if unavailable, use External KB from recognized thought leaders. Two to three sentences maximum. Cite the source with title/affiliation. Respect word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 30,
          maxWords: 60,
          actualContent: "",
        },
      },
      {
        id: "p-1-6",
        tag: "p",
        keywords: ["Generate 3-4 value-proposition keywords."],
        taxonomy: "Supporting | Value synthesis",
        attention: "Synthesize the core value proposition clearly and compellingly.",
        intent: "Articulate why this topic matters and what readers will gain from this deep dive.",
        audiences: "All readers; level: intermediate.",
        selfPrompt:
          "Write a value-focused paragraph that synthesizes what readers will gain, why it matters strategically, and how this content provides unique depth. Be specific about outcomes and benefits. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 90,
          maxWords: 180,
          actualContent: "",
        },
      },
    ],
  },

  // 2. Foundational Concepts and Principles section
  {
    id: "h2-2",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on foundational concepts, core principles, theoretical frameworks, and fundamental understanding",
    ],
    taxonomy: "Guide | Foundational theory",
    attention: "Establish comprehensive foundational understanding with theoretical depth and practical relevance.",
    intent: "Provide deep foundational knowledge covering core concepts, principles, frameworks, and theoretical underpinnings that inform all subsequent content.",
    audiences: "Technical practitioners, academics, and serious learners; level: intermediate-to-advanced.",
    selfPrompt:
      "Create an H2 section that establishes comprehensive foundational concepts with theoretical depth, practical examples, structured subsections, and comparative data. Balance academic rigor with practical accessibility. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 600,
      maxWords: 850,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-2-1",
        tag: "p",
        keywords: ["Generate 3-4 foundational-framework keywords."],
        taxonomy: "Supporting | Framework introduction",
        attention: "Introduce the foundational framework or model that structures understanding.",
        intent: "Establish the conceptual framework that will guide the section.",
        audiences: "Serious learners; level: intermediate-to-advanced.",
        selfPrompt:
          "Write a paragraph that introduces the foundational framework or conceptual model. Explain its origins, structure, and why it's the best lens for understanding. Be authoritative yet accessible. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 130,
          maxWords: 260,
          actualContent: "",
        },
      },
      {
        id: "h3-2-2",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to core principles)."],
        taxonomy: "Guide | Core principles subsection",
        attention: "Explain core principles with precision, examples, and structured content.",
        intent: "Detail the fundamental principles that underpin the entire topic.",
        audiences: "Technical practitioners and academics; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection that explores core principles in depth. Use multiple paragraphs, lists, and tables to structure complex information clearly. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 350,
          maxWords: 500,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-2-1",
            tag: "p",
            keywords: ["Generate 3-4 principle-definition keywords."],
            taxonomy: "Supporting | Principle explanation",
            attention: "Define and explain the first core principle with clarity and depth.",
            intent: "Establish understanding of the first fundamental principle.",
            audiences: "Learners and practitioners; level: intermediate.",
            selfPrompt:
              "Write a paragraph that defines and explains a core principle with precision. Use concrete examples or analogies to clarify abstract concepts. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "p-2-2-2",
            tag: "p",
            keywords: ["Generate 3-4 second-principle keywords."],
            taxonomy: "Supporting | Principle expansion",
            attention: "Expand on a second related principle with examples.",
            intent: "Build on the first principle with complementary understanding.",
            audiences: "Practitioners; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a paragraph that expands on a second core principle, showing how it relates to or complements the first. Include practical implications. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
            id: "ul-2-2-3",
            tag: "ul",
            keywords: ["Generate 3-4 principle-summary keywords."],
            taxonomy: "List | Principle summary",
            attention: "Summarize key principles in a scannable format.",
            intent: "Provide a concise list of 4-6 fundamental principles for quick reference.",
            audiences: "All readers; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 4-6 fundamental principles. One sentence per item, clear and authoritative. Ensure comprehensive coverage and non-redundancy. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
          {
            id: "p-2-2-4",
            tag: "p",
            keywords: ["Generate 1 transition keyword."],
            taxonomy: "Transitional | Micro-bridge",
            attention: "Transition to comparative data presentation.",
            intent: "Introduce the upcoming comparison table.",
            audiences: "All readers; level: general.",
            selfPrompt:
              "Write a brief transition sentence that introduces the comparison table or framework analysis. Be concise. Generate the necessary content here.",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            id: "table-2-2-5",
            tag: "table",
            keywords: ["Generate 3-5 framework-comparison keywords."],
            taxonomy: "Data | Framework comparison",
            attention: "Present a comprehensive comparison of frameworks or approaches.",
            intent: "Provide structured comparison data that clarifies distinctions and trade-offs.",
            audiences: "Analytical readers; level: intermediate-to-advanced.",
            selfPrompt:
              "Create a comprehensive comparison table with clear headers comparing different frameworks, approaches, or principle interpretations. Include 4-6 rows with meaningful distinctions. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 220,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-2-3",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to theoretical models)."],
        taxonomy: "Guide | Theoretical models subsection",
        attention: "Present theoretical models with visual clarity and practical connection.",
        intent: "Explain theoretical models that provide deeper analytical frameworks.",
        audiences: "Academics and advanced practitioners; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection that presents theoretical models with depth and clarity. Use multiple paragraphs, structured lists, and code/pseudo-code where applicable. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 250,
          maxWords: 350,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-3-1",
            tag: "p",
            keywords: ["Generate 3-4 model-introduction keywords."],
            taxonomy: "Supporting | Model explanation",
            attention: "Introduce a key theoretical model with clarity.",
            intent: "Establish understanding of an important analytical or conceptual model.",
            audiences: "Advanced learners; level: advanced.",
            selfPrompt:
              "Write a paragraph that introduces and explains a key theoretical model. Define its components, purpose, and how it's applied. Use precise terminology. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
            id: "ol-2-3-2",
            tag: "ol",
            keywords: ["Generate 2-3 model-component keywords."],
            taxonomy: "List | Model components",
            attention: "Break down the model into ordered, logical components.",
            intent: "List the 4-6 key components or stages of the model in sequence.",
            audiences: "Structured learners; level: intermediate-to-advanced.",
            selfPrompt:
              "Create an ordered list with 4-6 components or stages of the theoretical model in logical sequence. Keep items clear and technically precise. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "blockquote-2-3-3",
            tag: "blockquote",
            keywords: ["Generate 1-2 academic or research keywords."],
            taxonomy: "Supporting | Academic citation",
            attention: "Reinforce the model with academic or research authority.",
            intent: "Provide scholarly backing for the theoretical framework.",
            audiences: "Academic readers; level: advanced.",
            selfPrompt:
              "Insert a scholarly quote or research finding that supports the theoretical model. Prefer Internal KB; use External KB from peer-reviewed sources if needed. Include proper citation. Respect constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 25,
              maxWords: 50,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // 3. Technical Architecture and Design section
  {
    id: "h2-3",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on technical architecture, system design, structural components, design patterns, and architectural decisions",
    ],
    taxonomy: "Guide | Technical architecture",
    attention: "Provide comprehensive technical architecture guidance with depth, clarity, and practical design insights.",
    intent: "Cover system architecture, design patterns, structural decisions, component relationships, and architectural trade-offs in depth.",
    audiences: "Architects, senior developers, and technical decision-makers; level: advanced.",
    selfPrompt:
      "Create an H2 section that provides comprehensive technical architecture and design guidance. Include detailed subsections on architecture patterns, component design, system structure, code examples, and design trade-offs. Use precise technical language while maintaining clarity. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 700,
      maxWords: 950,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-3-1",
        tag: "p",
        keywords: ["Generate 3-4 architecture-overview keywords."],
        taxonomy: "Supporting | Architecture introduction",
        attention: "Establish the architectural vision and high-level design philosophy.",
        intent: "Introduce the overall architectural approach and design philosophy.",
        audiences: "Technical decision-makers; level: advanced.",
        selfPrompt:
          "Write a paragraph that introduces the architectural approach, design philosophy, and high-level structure. Establish the 'why' behind architectural decisions. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 140,
          maxWords: 280,
          actualContent: "",
        },
      },
      {
        id: "h3-3-2",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to core architecture patterns)."],
        taxonomy: "Guide | Architecture patterns subsection",
        attention: "Detail core architectural patterns with examples and code.",
        intent: "Explain the fundamental architectural patterns used and why they were chosen.",
        audiences: "Architects and senior developers; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection that explores core architectural patterns in depth. Include pattern descriptions, code examples, trade-off analysis, and practical implementation guidance. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 400,
          maxWords: 550,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-2-1",
            tag: "p",
            keywords: ["Generate 3-4 pattern-description keywords."],
            taxonomy: "Supporting | Pattern explanation",
            attention: "Explain the first major architectural pattern with precision.",
            intent: "Establish clear understanding of a key architectural pattern.",
            audiences: "Senior developers; level: advanced.",
            selfPrompt:
              "Write a paragraph that explains a major architectural pattern, its purpose, structure, and when to use it. Be technically precise. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 240,
              actualContent: "",
            },
          },
          {
            id: "code-3-2-2",
            tag: "code",
            keywords: ["Generate 2-3 pattern-implementation keywords."],
            taxonomy: "Technical | Pattern code example",
            attention: "Demonstrate the pattern with clear, practical code.",
            intent: "Illustrate the architectural pattern with working code or detailed pseudo-code.",
            audiences: "Developers; level: advanced.",
            selfPrompt:
              "Provide a comprehensive code example that demonstrates the architectural pattern in practice. Include inline comments explaining key decisions. Keep it focused but complete enough to be instructive. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "p-3-2-3",
            tag: "p",
            keywords: ["Generate 3-4 trade-off or decision keywords."],
            taxonomy: "Supporting | Architectural trade-offs",
            attention: "Explain architectural trade-offs and decision rationale.",
            intent: "Clarify why this pattern was chosen and what trade-offs were considered.",
            audiences: "Architects and technical leaders; level: advanced.",
            selfPrompt:
              "Write a paragraph that explains the architectural trade-offs, alternatives considered, and rationale for choosing this pattern. Be honest about limitations. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
            id: "h4-3-2-4",
            tag: "h4",
            keywords: ["Generate 4-6 keywords (inherit 2 from H3, add 2-4 specific to component design)."],
            taxonomy: "Guide | Component design subtopic",
            attention: "Drill down into specific component-level design decisions.",
            intent: "Explore detailed component architecture within the broader pattern.",
            audiences: "Senior developers and architects; level: advanced.",
            selfPrompt:
              "Develop an H4 subtopic that explores component-level design within the architectural pattern. Include detailed explanations, code, and lists of design principles. Respect word limits. Generate the necessary content here.",
            additionalData: {
              minWords: 250,
              maxWords: 400,
              actualContent: "",
            },
            realContentStructure: [
              {
                id: "p-3-2-4-1",
                tag: "p",
                keywords: ["Generate 3-4 component-detail keywords."],
                taxonomy: "Supporting | Component explanation",
                attention: "Explain component responsibilities and interfaces.",
                intent: "Clarify how specific components are designed and why.",
                audiences: "Developers; level: advanced.",
                selfPrompt:
                  "Write a paragraph that explains component responsibilities, interfaces, and internal design. Be specific about API contracts and boundaries. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 90,
                  maxWords: 180,
                  actualContent: "",
                },
              },
              {
                id: "ul-3-2-4-2",
                tag: "ul",
                keywords: ["Generate 2-3 design-principle keywords."],
                taxonomy: "List | Design principles",
                attention: "List key component design principles.",
                intent: "Provide 4-6 design principles that guide component development.",
                audiences: "Developers; level: intermediate-to-advanced.",
                selfPrompt:
                  "Create an unordered list with 4-6 component design principles. One sentence per item, technical and actionable. Respect word constraints. Generate the necessary content here.",
                additionalData: {
                  minWords: 60,
                  maxWords: 120,
                  actualContent: "",
                },
              },
              {
                id: "code-3-2-4-3",
                tag: "code",
                keywords: ["Generate 1-2 component-implementation keywords."],
                taxonomy: "Technical | Component code",
                attention: "Show component implementation example.",
                intent: "Illustrate component design with code.",
                audiences: "Developers; level: advanced.",
                selfPrompt:
                  "Provide a code example showing component implementation or interface definition. Include comments for clarity. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 30,
                  maxWords: 70,
                  actualContent: "",
                },
              },
            ],
          },
          {
            id: "table-3-2-5",
            tag: "table",
            keywords: ["Generate 3-5 pattern-comparison keywords."],
            taxonomy: "Data | Pattern comparison",
            attention: "Compare architectural patterns systematically.",
            intent: "Provide a comparison table of related patterns or approaches.",
            audiences: "Architects; level: advanced.",
            selfPrompt:
              "Create a comparison table contrasting this pattern with alternatives. Include columns for trade-offs, use cases, and performance characteristics. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-3-3",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to system integration)."],
        taxonomy: "Guide | System integration subsection",
        attention: "Cover system integration points and inter-component communication.",
        intent: "Explain how components integrate and communicate within the architecture.",
        audiences: "Integration engineers and architects; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection on system integration, covering communication patterns, data flow, API contracts, and integration best practices. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 300,
          maxWords: 400,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-3-1",
            tag: "p",
            keywords: ["Generate 3-4 integration-approach keywords."],
            taxonomy: "Supporting | Integration explanation",
            attention: "Explain the integration strategy and communication patterns.",
            intent: "Clarify how system components integrate and communicate.",
            audiences: "Integration engineers; level: advanced.",
            selfPrompt:
              "Write a paragraph explaining the integration approach, communication patterns, and data flow between components. Be specific about protocols and contracts. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "ol-3-3-2",
            tag: "ol",
            keywords: ["Generate 2-3 integration-step keywords."],
            taxonomy: "List | Integration steps",
            attention: "Provide ordered integration steps or considerations.",
            intent: "List 4-6 key integration steps or checkpoints in sequence.",
            audiences: "Engineers; level: intermediate-to-advanced.",
            selfPrompt:
              "Create an ordered list with 4-6 integration steps or key considerations in logical order. Keep items clear and actionable. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "blockquote-3-3-3",
            tag: "blockquote",
            keywords: ["Generate 1-2 expert or best-practice keywords."],
            taxonomy: "Supporting | Integration best practice",
            attention: "Reinforce with expert integration guidance.",
            intent: "Provide authoritative integration advice or best practice.",
            audiences: "Architects; level: advanced.",
            selfPrompt:
              "Insert a quote or best-practice statement about integration from an expert source. Prefer Internal KB; use External KB if needed. Respect constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 25,
              maxWords: 50,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // 4. Implementation Methodology and Best Practices section
  {
    id: "h2-4",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on implementation methodology, step-by-step procedures, development workflow, best practices, and practical execution strategies",
    ],
    taxonomy: "Guide | Implementation methodology",
    attention: "Provide comprehensive, actionable implementation guidance with detailed methodology and best practices.",
    intent: "Guide readers through the complete implementation process with detailed methodology, workflows, code examples, best practices, and troubleshooting guidance.",
    audiences: "Implementers, developers, and technical practitioners; level: intermediate-to-advanced.",
    selfPrompt:
      "Create an H2 section that provides comprehensive implementation methodology with detailed workflows, step-by-step procedures, multiple code examples, best practices, and nested subsections for complex phases. Structure content for progressive complexity and practical utility. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 800,
      maxWords: 1100,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-4-1",
        tag: "p",
        keywords: ["Generate 3-4 methodology-overview keywords."],
        taxonomy: "Supporting | Methodology introduction",
        attention: "Establish the implementation methodology and overall approach.",
        intent: "Introduce the implementation methodology, key phases, and guiding principles.",
        audiences: "Implementers; level: intermediate.",
        selfPrompt:
          "Write a paragraph that introduces the implementation methodology, outlines key phases, and establishes guiding principles. Be comprehensive yet clear. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 150,
          maxWords: 300,
          actualContent: "",
        },
      },
      {
        id: "h3-4-2",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to preparation phase)."],
        taxonomy: "Guide | Preparation phase subsection",
        attention: "Detail the preparation and planning phase comprehensively.",
        intent: "Cover all preparation steps, prerequisites, planning activities, and setup procedures.",
        audiences: "Project leads and implementers; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection covering the preparation phase in depth. Include planning guidance, prerequisite checklists, setup procedures, and environment configuration. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 350,
          maxWords: 500,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-4-2-1",
            tag: "p",
            keywords: ["Generate 3-4 planning keywords."],
            taxonomy: "Supporting | Planning guidance",
            attention: "Explain planning considerations and prerequisites.",
            intent: "Clarify what needs to be planned and prepared before implementation.",
            audiences: "Project leads; level: intermediate.",
            selfPrompt:
              "Write a paragraph explaining planning considerations, prerequisites, and key decisions that must be made before starting implementation. Be thorough and practical. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 240,
              actualContent: "",
            },
          },
          {
            id: "ul-4-2-2",
            tag: "ul",
            keywords: ["Generate 2-3 prerequisite or checklist keywords."],
            taxonomy: "List | Prerequisites checklist",
            attention: "Provide a comprehensive prerequisites checklist.",
            intent: "List 5-7 essential prerequisites or preparation items.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 5-7 essential prerequisites, tools, or preparation steps. One sentence per item, clear and actionable. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "p-4-2-3",
            tag: "p",
            keywords: ["Generate 3-4 environment-setup keywords."],
            taxonomy: "Supporting | Environment setup",
            attention: "Explain environment configuration and setup procedures.",
            intent: "Guide readers through environment preparation and configuration.",
            audiences: "DevOps and implementers; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a paragraph detailing environment setup, configuration requirements, and initial preparation steps. Include specific commands or settings where relevant. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
            id: "code-4-2-4",
            tag: "code",
            keywords: ["Generate 1-2 setup or configuration keywords."],
            taxonomy: "Technical | Setup code",
            attention: "Provide setup code or configuration example.",
            intent: "Illustrate environment setup with code or configuration.",
            audiences: "Developers; level: intermediate.",
            selfPrompt:
              "Provide a code example showing environment setup, configuration file, or initialization script. Include comments for clarity. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 35,
              maxWords: 70,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-4-3",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to core implementation)."],
        taxonomy: "Guide | Core implementation subsection",
        attention: "Detail the core implementation phase with comprehensive guidance.",
        intent: "Provide step-by-step implementation guidance with code, nested subtopics, and best practices.",
        audiences: "Developers and implementers; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection covering core implementation with detailed steps, code examples, nested H4 for complex components, and best practices. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 450,
          maxWords: 600,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-4-3-1",
            tag: "p",
            keywords: ["Generate 3-4 implementation-overview keywords."],
            taxonomy: "Supporting | Implementation intro",
            attention: "Introduce the core implementation phase and approach.",
            intent: "Set context for the core implementation activities.",
            audiences: "Developers; level: intermediate.",
            selfPrompt:
              "Write a paragraph introducing the core implementation phase, the overall approach, and key components to be built. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
            id: "ol-4-3-2",
            tag: "ol",
            keywords: ["Generate 2-3 step-by-step keywords."],
            taxonomy: "List | Implementation steps",
            attention: "Provide ordered implementation steps.",
            intent: "List 5-7 sequential implementation steps.",
            audiences: "Implementers; level: intermediate.",
            selfPrompt:
              "Create an ordered list with 5-7 implementation steps in logical sequence. Keep items concise and actionable. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "h4-4-3-3",
            tag: "h4",
            keywords: ["Generate 4-6 keywords (inherit 2 from H3, add 2-4 specific to data layer)."],
            taxonomy: "Guide | Data layer implementation",
            attention: "Drill down into data layer implementation details.",
            intent: "Provide comprehensive guidance on implementing the data layer.",
            audiences: "Backend developers; level: intermediate-to-advanced.",
            selfPrompt:
              "Develop an H4 subtopic covering data layer implementation with detailed explanations, code examples, and best practices. Respect word limits. Generate the necessary content here.",
            additionalData: {
              minWords: 300,
              maxWords: 450,
              actualContent: "",
            },
            realContentStructure: [
              {
                id: "p-4-3-3-1",
                tag: "p",
                keywords: ["Generate 3-4 data-layer keywords."],
                taxonomy: "Supporting | Data layer explanation",
                attention: "Explain data layer design and implementation approach.",
                intent: "Clarify data layer architecture and implementation strategy.",
                audiences: "Backend developers; level: intermediate-to-advanced.",
                selfPrompt:
                  "Write a paragraph explaining data layer design, patterns, and implementation approach. Be technically detailed. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 110,
                  maxWords: 220,
                  actualContent: "",
                },
              },
              {
                id: "code-4-3-3-2",
                tag: "code",
                keywords: ["Generate 2-3 data-implementation keywords."],
                taxonomy: "Technical | Data layer code",
                attention: "Demonstrate data layer implementation with code.",
                intent: "Illustrate data layer patterns with working code.",
                audiences: "Developers; level: intermediate-to-advanced.",
                selfPrompt:
                  "Provide a comprehensive code example showing data layer implementation (models, repositories, or data access patterns). Include inline comments. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 50,
                  maxWords: 100,
                  actualContent: "",
                },
              },
              {
                id: "ul-4-3-3-3",
                tag: "ul",
                keywords: ["Generate 2-3 data best-practice keywords."],
                taxonomy: "List | Data best practices",
                attention: "List data layer best practices.",
                intent: "Provide 4-6 best practices for data layer implementation.",
                audiences: "Backend developers; level: intermediate.",
                selfPrompt:
                  "Create an unordered list with 4-6 data layer best practices. One sentence per item, technical and actionable. Respect word constraints. Generate the necessary content here.",
                additionalData: {
                  minWords: 60,
                  maxWords: 120,
                  actualContent: "",
                },
              },
              {
                id: "p-4-3-3-4",
                tag: "p",
                keywords: ["Generate 2-3 data-validation keywords."],
                taxonomy: "Supporting | Data validation",
                attention: "Explain data validation and integrity measures.",
                intent: "Cover validation, constraints, and data integrity approaches.",
                audiences: "Backend developers; level: intermediate.",
                selfPrompt:
                  "Write a paragraph about data validation, integrity constraints, and error handling in the data layer. Be specific about techniques. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 80,
                  maxWords: 160,
                  actualContent: "",
                },
              },
            ],
          },
          {
            id: "h4-4-3-4",
            tag: "h4",
            keywords: ["Generate 4-6 keywords (inherit 2 from H3, add 2-4 specific to business logic)."],
            taxonomy: "Guide | Business logic implementation",
            attention: "Cover business logic implementation comprehensively.",
            intent: "Detail business logic layer design and implementation.",
            audiences: "Full-stack developers; level: intermediate-to-advanced.",
            selfPrompt:
              "Develop an H4 subtopic on business logic implementation with patterns, code examples, and testing considerations. Respect word limits. Generate the necessary content here.",
            additionalData: {
              minWords: 200,
              maxWords: 350,
              actualContent: "",
            },
            realContentStructure: [
              {
                id: "p-4-3-4-1",
                tag: "p",
                keywords: ["Generate 3-4 business-logic keywords."],
                taxonomy: "Supporting | Business logic explanation",
                attention: "Explain business logic organization and patterns.",
                intent: "Clarify how business logic should be structured and implemented.",
                audiences: "Developers; level: intermediate.",
                selfPrompt:
                  "Write a paragraph explaining business logic organization, separation of concerns, and implementation patterns. Be practical and principle-driven. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 100,
                  maxWords: 200,
                  actualContent: "",
                },
              },
              {
                id: "code-4-3-4-2",
                tag: "code",
                keywords: ["Generate 1-2 business-logic keywords."],
                taxonomy: "Technical | Business logic code",
                attention: "Show business logic implementation example.",
                intent: "Illustrate business logic patterns with code.",
                audiences: "Developers; level: intermediate.",
                selfPrompt:
                  "Provide a code example demonstrating business logic implementation with proper separation and testability. Include comments. Respect min/max words. Generate the necessary content here.",
                additionalData: {
                  minWords: 40,
                  maxWords: 80,
                  actualContent: "",
                },
              },
              {
                id: "blockquote-4-3-4-3",
                tag: "blockquote",
                keywords: ["Generate 1-2 design-principle keywords."],
                taxonomy: "Supporting | Design principle",
                attention: "Reinforce with design principle or best practice quote.",
                intent: "Provide authoritative guidance on business logic design.",
                audiences: "Architects; level: intermediate-to-advanced.",
                selfPrompt:
                  "Insert a quote or principle about business logic design from an authoritative source. Prefer Internal KB. Respect constraints. Generate the necessary content here.",
                additionalData: {
                  minWords: 20,
                  maxWords: 45,
                  actualContent: "",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // 5. Performance Optimization and Scalability section
  {
    id: "h2-5",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on performance optimization, scalability strategies, efficiency improvements, resource management, and performance monitoring",
    ],
    taxonomy: "Guide | Performance and scalability",
    attention: "Provide expert-level guidance on optimization, scalability, and performance engineering.",
    intent: "Cover performance optimization techniques, scalability patterns, bottleneck identification, benchmarking, and monitoring strategies comprehensively.",
    audiences: "Performance engineers, architects, and senior developers; level: advanced.",
    selfPrompt:
      "Create an H2 section covering performance optimization and scalability with depth and technical rigor. Include optimization techniques, scalability patterns, benchmarking data, monitoring strategies, and code examples. Use precise technical language and quantitative metrics. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 650,
      maxWords: 900,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-5-1",
        tag: "p",
        keywords: ["Generate 3-4 performance-overview keywords."],
        taxonomy: "Supporting | Performance introduction",
        attention: "Establish performance goals and optimization philosophy.",
        intent: "Introduce performance considerations, goals, and the optimization mindset.",
        audiences: "Performance engineers; level: advanced.",
        selfPrompt:
          "Write a paragraph introducing performance goals, key metrics, and the overall optimization philosophy. Set clear performance targets and expectations. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 130,
          maxWords: 260,
          actualContent: "",
        },
      },
      {
        id: "h3-5-2",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to optimization techniques)."],
        taxonomy: "Guide | Optimization techniques subsection",
        attention: "Detail specific optimization techniques with measurable impact.",
        intent: "Provide actionable optimization techniques with code examples and performance data.",
        audiences: "Senior developers and performance engineers; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection covering specific optimization techniques with detailed explanations, code examples, performance comparisons, and quantitative results. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 400,
          maxWords: 550,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-5-2-1",
            tag: "p",
            keywords: ["Generate 3-4 technique-description keywords."],
            taxonomy: "Supporting | Technique explanation",
            attention: "Explain a major optimization technique with technical precision.",
            intent: "Detail a specific optimization technique and its performance impact.",
            audiences: "Performance engineers; level: advanced.",
            selfPrompt:
              "Write a paragraph explaining a major optimization technique, how it works, and what performance gains to expect. Include technical details and metrics. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "code-5-2-2",
            tag: "code",
            keywords: ["Generate 2-3 optimization-implementation keywords."],
            taxonomy: "Technical | Optimization code",
            attention: "Demonstrate the optimization with before/after code.",
            intent: "Show practical implementation of the optimization technique.",
            audiences: "Developers; level: advanced.",
            selfPrompt:
              "Provide a code example showing the optimization in practice, ideally with before/after comparison. Include comments highlighting the optimization. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 45,
              maxWords: 90,
              actualContent: "",
            },
          },
          {
            id: "table-5-2-3",
            tag: "table",
            keywords: ["Generate 3-5 benchmark or performance-data keywords."],
            taxonomy: "Data | Performance benchmark",
            attention: "Present quantitative performance data in structured format.",
            intent: "Provide benchmark results showing optimization impact.",
            audiences: "Data-driven engineers; level: advanced.",
            selfPrompt:
              "Create a performance benchmark table showing before/after metrics, percentage improvements, and test conditions. Include 4-6 meaningful metrics. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 240,
              actualContent: "",
            },
          },
          {
            id: "p-5-2-4",
            tag: "p",
            keywords: ["Generate 2-3 impact-analysis keywords."],
            taxonomy: "Supporting | Impact analysis",
            attention: "Analyze the performance impact and trade-offs.",
            intent: "Explain the real-world impact and any trade-offs of the optimization.",
            audiences: "Architects and performance engineers; level: advanced.",
            selfPrompt:
              "Write a paragraph analyzing the performance impact, resource utilization changes, and any trade-offs introduced by the optimization. Be balanced and honest. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-5-3",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to scalability patterns)."],
        taxonomy: "Guide | Scalability patterns subsection",
        attention: "Cover scalability strategies and patterns for growth.",
        intent: "Explain architectural patterns and strategies for scaling the system.",
        audiences: "Architects and infrastructure engineers; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection on scalability patterns covering horizontal/vertical scaling, caching strategies, load distribution, and capacity planning. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 350,
          maxWords: 450,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-5-3-1",
            tag: "p",
            keywords: ["Generate 3-4 scalability-strategy keywords."],
            taxonomy: "Supporting | Scalability explanation",
            attention: "Explain core scalability strategies and when to use them.",
            intent: "Clarify different scalability approaches and their applicability.",
            audiences: "Architects; level: advanced.",
            selfPrompt:
              "Write a paragraph explaining horizontal vs vertical scaling, when to use each, and architectural implications. Be strategic and technical. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 240,
              actualContent: "",
            },
          },
          {
            id: "ul-5-3-2",
            tag: "ul",
            keywords: ["Generate 2-3 scalability-pattern keywords."],
            taxonomy: "List | Scalability patterns",
            attention: "List key scalability patterns and techniques.",
            intent: "Provide 5-7 proven scalability patterns.",
            audiences: "Architects and engineers; level: advanced.",
            selfPrompt:
              "Create an unordered list with 5-7 scalability patterns or techniques. One sentence per item, technical and strategic. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "p-5-3-3",
            tag: "p",
            keywords: ["Generate 3-4 capacity-planning keywords."],
            taxonomy: "Supporting | Capacity planning",
            attention: "Discuss capacity planning and resource forecasting.",
            intent: "Explain how to plan for growth and capacity needs.",
            audiences: "Infrastructure planners; level: advanced.",
            selfPrompt:
              "Write a paragraph about capacity planning, growth forecasting, and resource provisioning strategies. Include metrics to track. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // 6. Security, Compliance, and Risk Management section
  {
    id: "h2-6",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on security practices, compliance requirements, risk mitigation, threat modeling, and security architecture",
    ],
    taxonomy: "Guide | Security and compliance",
    attention: "Provide comprehensive security guidance with practical implementations and compliance considerations.",
    intent: "Cover security architecture, threat mitigation, compliance requirements, security best practices, and risk management strategies.",
    audiences: "Security engineers, compliance officers, and architects; level: advanced.",
    selfPrompt:
      "Create an H2 section covering security, compliance, and risk management comprehensively. Include security patterns, threat mitigation strategies, compliance frameworks, code examples, and risk assessment methodologies. Use precise security terminology. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 600,
      maxWords: 850,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-6-1",
        tag: "p",
        keywords: ["Generate 3-4 security-overview keywords."],
        taxonomy: "Supporting | Security introduction",
        attention: "Establish security philosophy and principles.",
        intent: "Introduce the security approach, threat landscape, and guiding principles.",
        audiences: "Security engineers and architects; level: advanced.",
        selfPrompt:
          "Write a paragraph introducing the security philosophy, threat landscape, and core security principles that guide the implementation. Be strategic and risk-focused. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 140,
          maxWords: 280,
          actualContent: "",
        },
      },
      {
        id: "h3-6-2",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to threat mitigation)."],
        taxonomy: "Guide | Threat mitigation subsection",
        attention: "Detail threat mitigation strategies and security controls.",
        intent: "Cover common threats and how to mitigate them with specific controls.",
        audiences: "Security engineers; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection on threat mitigation covering common attack vectors, security controls, mitigation strategies, and implementation examples. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 350,
          maxWords: 500,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-6-2-1",
            tag: "p",
            keywords: ["Generate 3-4 threat-landscape keywords."],
            taxonomy: "Supporting | Threat analysis",
            attention: "Analyze the threat landscape and common attack vectors.",
            intent: "Identify and explain key security threats relevant to the implementation.",
            audiences: "Security analysts; level: advanced.",
            selfPrompt:
              "Write a paragraph analyzing the threat landscape, common attack vectors, and security risks specific to this context. Be specific and threat-focused. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "table-6-2-2",
            tag: "table",
            keywords: ["Generate 3-5 threat-control keywords."],
            taxonomy: "Data | Security controls matrix",
            attention: "Present threats and corresponding controls systematically.",
            intent: "Provide a threat-control mapping table.",
            audiences: "Security engineers; level: advanced.",
            selfPrompt:
              "Create a table mapping 5-7 threats to their corresponding security controls and mitigation strategies. Include threat severity and control effectiveness. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 130,
              maxWords: 260,
              actualContent: "",
            },
          },
          {
            id: "code-6-2-3",
            tag: "code",
            keywords: ["Generate 2-3 security-implementation keywords."],
            taxonomy: "Technical | Security code",
            attention: "Demonstrate security control implementation with code.",
            intent: "Show practical security implementation examples.",
            audiences: "Developers; level: intermediate-to-advanced.",
            selfPrompt:
              "Provide a code example demonstrating a key security control implementation (authentication, authorization, input validation, etc.). Include security-focused comments. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "ul-6-2-4",
            tag: "ul",
            keywords: ["Generate 2-3 security-best-practice keywords."],
            taxonomy: "List | Security best practices",
            attention: "List essential security best practices.",
            intent: "Provide 5-7 critical security best practices.",
            audiences: "All developers; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 5-7 essential security best practices. One sentence per item, actionable and security-focused. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-6-3",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to compliance)."],
        taxonomy: "Guide | Compliance subsection",
        attention: "Cover compliance requirements and frameworks.",
        intent: "Explain relevant compliance requirements and how to meet them.",
        audiences: "Compliance officers and architects; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection on compliance covering relevant frameworks (GDPR, HIPAA, SOC 2, etc.), requirements, documentation needs, and implementation guidance. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 300,
          maxWords: 400,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-6-3-1",
            tag: "p",
            keywords: ["Generate 3-4 compliance-framework keywords."],
            taxonomy: "Supporting | Compliance explanation",
            attention: "Explain relevant compliance frameworks and requirements.",
            intent: "Clarify which compliance frameworks apply and what they require.",
            audiences: "Compliance officers; level: advanced.",
            selfPrompt:
              "Write a paragraph explaining relevant compliance frameworks, their applicability, and key requirements. Be specific about obligations. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 240,
              actualContent: "",
            },
          },
          {
            id: "ol-6-3-2",
            tag: "ol",
            keywords: ["Generate 2-3 compliance-step keywords."],
            taxonomy: "List | Compliance checklist",
            attention: "Provide ordered compliance implementation steps.",
            intent: "List 5-7 steps for achieving compliance.",
            audiences: "Compliance implementers; level: intermediate-to-advanced.",
            selfPrompt:
              "Create an ordered list with 5-7 steps for implementing compliance requirements in logical sequence. Keep items clear and actionable. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "blockquote-6-3-3",
            tag: "blockquote",
            keywords: ["Generate 1-2 compliance or regulatory keywords."],
            taxonomy: "Supporting | Regulatory guidance",
            attention: "Provide authoritative compliance guidance or requirement quote.",
            intent: "Reinforce compliance requirements with authoritative source.",
            audiences: "Compliance officers; level: advanced.",
            selfPrompt:
              "Insert a quote or regulatory requirement from an authoritative compliance source or framework documentation. Prefer Internal KB; use External KB from official sources. Respect constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 25,
              maxWords: 50,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // 7. Real-World Case Studies and Applications section
  {
    id: "h2-7",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on real-world applications, case studies, industry examples, success stories, and practical lessons learned",
    ],
    taxonomy: "Guide | Case studies and applications",
    attention: "Provide concrete real-world examples and case studies with measurable outcomes.",
    intent: "Demonstrate practical application through detailed case studies, industry examples, success metrics, and lessons learned.",
    audiences: "Decision-makers, practitioners, and learners; level: intermediate.",
    selfPrompt:
      "Create an H2 section covering real-world case studies and applications with depth and practical insights. Include detailed case study analyses, success metrics, industry-specific applications, and lessons learned. Use storytelling and data to make examples compelling. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 550,
      maxWords: 750,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-7-1",
        tag: "p",
        keywords: ["Generate 3-4 case-study-intro keywords."],
        taxonomy: "Supporting | Case study introduction",
        attention: "Frame the value of real-world examples and case studies.",
        intent: "Introduce why case studies matter and what readers will learn.",
        audiences: "Decision-makers; level: intermediate.",
        selfPrompt:
          "Write a paragraph introducing the value of real-world case studies, what patterns emerge, and what readers can learn from practical applications. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 120,
          maxWords: 240,
          actualContent: "",
        },
      },
      {
        id: "h3-7-2",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to enterprise case study)."],
        taxonomy: "Guide | Enterprise case study subsection",
        attention: "Present a detailed enterprise-level case study with metrics.",
        intent: "Provide an in-depth case study showing enterprise implementation and results.",
        audiences: "Enterprise decision-makers; level: intermediate-to-advanced.",
        selfPrompt:
          "Develop an H3 subsection presenting a detailed enterprise case study with background, challenges, solution approach, implementation details, and quantifiable results. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 350,
          maxWords: 500,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-7-2-1",
            tag: "p",
            keywords: ["Generate 3-4 case-background keywords."],
            taxonomy: "Supporting | Case background",
            attention: "Establish case study context, company profile, and initial challenges.",
            intent: "Set the stage for the case study with relevant background.",
            audiences: "Business readers; level: intermediate.",
            selfPrompt:
              "Write a paragraph establishing the case study context: company profile, industry, scale, and initial challenges faced. Be specific with details. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
            id: "p-7-2-2",
            tag: "p",
            keywords: ["Generate 3-4 solution-approach keywords."],
            taxonomy: "Supporting | Solution description",
            attention: "Explain the solution approach and implementation strategy.",
            intent: "Detail how the problem was solved and what approach was taken.",
            audiences: "Practitioners; level: intermediate.",
            selfPrompt:
              "Write a paragraph explaining the solution approach, key decisions, implementation strategy, and timeline. Be specific about methods used. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "table-7-2-3",
            tag: "table",
            keywords: ["Generate 3-5 results or metrics keywords."],
            taxonomy: "Data | Results metrics",
            attention: "Present quantifiable results and success metrics.",
            intent: "Show before/after metrics demonstrating impact.",
            audiences: "Data-driven decision-makers; level: intermediate.",
            selfPrompt:
              "Create a results table showing before/after metrics, percentage improvements, and timeframes. Include 5-7 meaningful business or technical metrics. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 130,
              maxWords: 260,
              actualContent: "",
            },
          },
          {
            id: "blockquote-7-2-4",
            tag: "blockquote",
            keywords: ["Generate 1-2 testimonial or stakeholder keywords."],
            taxonomy: "Supporting | Stakeholder quote",
            attention: "Include stakeholder or executive quote about the results.",
            intent: "Reinforce the case study with firsthand perspective.",
            audiences: "Decision-makers; level: intermediate.",
            selfPrompt:
              "Insert a quote from a key stakeholder (executive, project lead, or user) reflecting on the success and impact. Prefer Internal KB. Respect constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 25,
              maxWords: 50,
              actualContent: "",
            },
          },
          {
            id: "ul-7-2-5",
            tag: "ul",
            keywords: ["Generate 2-3 lessons-learned keywords."],
            taxonomy: "List | Key lessons",
            attention: "List key lessons learned from the case study.",
            intent: "Provide 4-6 actionable lessons readers can apply.",
            audiences: "Practitioners; level: intermediate.",
            selfPrompt:
              "Create an unordered list with 4-6 key lessons learned from the case study. One sentence per item, actionable and insightful. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-7-3",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to startup/SMB case)."],
        taxonomy: "Guide | Startup case study subsection",
        attention: "Present a startup or SMB case study showing agility and innovation.",
        intent: "Provide a contrasting case study from a smaller, more agile organization.",
        audiences: "Startup founders and SMB leaders; level: intermediate.",
        selfPrompt:
          "Develop an H3 subsection presenting a startup or SMB case study highlighting agility, innovation, resource constraints, and creative solutions. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-7-3-1",
            tag: "p",
            keywords: ["Generate 3-4 startup-context keywords."],
            taxonomy: "Supporting | Startup case",
            attention: "Present startup context, challenges, and constraints.",
            intent: "Establish the startup case study with resource and scale context.",
            audiences: "Startup readers; level: intermediate.",
            selfPrompt:
              "Write a paragraph presenting a startup case study: company stage, constraints, challenges, and how they approached the problem differently than enterprises. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "p-7-3-2",
            tag: "p",
            keywords: ["Generate 2-3 innovation or outcome keywords."],
            taxonomy: "Supporting | Innovation outcome",
            attention: "Highlight innovative approach and results achieved.",
            intent: "Show creative solutions and measurable outcomes despite constraints.",
            audiences: "Innovators; level: intermediate.",
            selfPrompt:
              "Write a paragraph highlighting the innovative approach, creative solutions, and measurable results achieved. Include specific metrics. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // 8. Advanced Topics and Future Trends section
  {
    id: "h2-8",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on advanced topics, emerging trends, future developments, innovation horizons, and strategic evolution",
    ],
    taxonomy: "Guide | Advanced topics and future trends",
    attention: "Provide expert-level insights into advanced topics and strategic future trends.",
    intent: "Cover cutting-edge topics, emerging trends, future developments, research directions, and strategic implications for the field.",
    audiences: "Thought leaders, researchers, and strategic planners; level: advanced.",
    selfPrompt:
      "Create an H2 section covering advanced topics and future trends with strategic depth and forward-thinking analysis. Include emerging technologies, research directions, expert predictions, and strategic implications. Balance technical depth with accessibility. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 550,
      maxWords: 800,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-8-1",
        tag: "p",
        keywords: ["Generate 3-4 future-landscape keywords."],
        taxonomy: "Supporting | Future introduction",
        attention: "Frame the future landscape and emerging possibilities.",
        intent: "Introduce emerging trends and future developments in the field.",
        audiences: "Strategic thinkers; level: advanced.",
        selfPrompt:
          "Write a paragraph introducing the future landscape, emerging trends, and what developments are on the horizon. Be forward-thinking and strategic. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 130,
          maxWords: 260,
          actualContent: "",
        },
      },
      {
        id: "h3-8-2",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to emerging technologies)."],
        taxonomy: "Guide | Emerging technologies subsection",
        attention: "Explore emerging technologies and their potential impact.",
        intent: "Detail cutting-edge technologies and their implications for the field.",
        audiences: "Technology innovators; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection on emerging technologies covering new developments, experimental approaches, research directions, and potential transformative impacts. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 350,
          maxWords: 500,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-8-2-1",
            tag: "p",
            keywords: ["Generate 3-4 emerging-tech keywords."],
            taxonomy: "Supporting | Technology analysis",
            attention: "Analyze a key emerging technology and its potential.",
            intent: "Explain an emerging technology and how it could reshape the field.",
            audiences: "Technologists; level: advanced.",
            selfPrompt:
              "Write a paragraph analyzing an emerging technology, its current state, development trajectory, and potential impact on the field. Be analytical and evidence-based. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 120,
              maxWords: 240,
              actualContent: "",
            },
          },
          {
            id: "p-8-2-2",
            tag: "p",
            keywords: ["Generate 3-4 research-direction keywords."],
            taxonomy: "Supporting | Research trends",
            attention: "Discuss active research areas and breakthrough potential.",
            intent: "Highlight key research directions and innovation opportunities.",
            audiences: "Researchers and academics; level: advanced.",
            selfPrompt:
              "Write a paragraph discussing active research areas, breakthrough potential, and where innovation is heading. Include specific research initiatives if known. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "ul-8-2-3",
            tag: "ul",
            keywords: ["Generate 2-3 innovation-opportunity keywords."],
            taxonomy: "List | Innovation opportunities",
            attention: "List key innovation opportunities and potential breakthroughs.",
            intent: "Provide 5-7 specific areas ripe for innovation.",
            audiences: "Innovators and entrepreneurs; level: advanced.",
            selfPrompt:
              "Create an unordered list with 5-7 specific innovation opportunities or areas ripe for breakthrough. One sentence per item, forward-thinking. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "blockquote-8-2-4",
            tag: "blockquote",
            keywords: ["Generate 1-2 thought-leader or futurist keywords."],
            taxonomy: "Supporting | Expert prediction",
            attention: "Include thought leader perspective on future developments.",
            intent: "Reinforce future trends with expert prediction or analysis.",
            audiences: "Strategic thinkers; level: advanced.",
            selfPrompt:
              "Insert a quote from a thought leader or expert predicting future developments or offering strategic analysis. Prefer Internal KB; use External KB from recognized futurists. Respect constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 30,
              maxWords: 60,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-8-3",
        tag: "h3",
        keywords: ["Generate 5-7 keywords (inherit 2-3 from parent H2, add 3-4 specific to strategic implications)."],
        taxonomy: "Guide | Strategic implications subsection",
        attention: "Analyze strategic implications and preparedness strategies.",
        intent: "Explain how organizations should prepare for future developments.",
        audiences: "Strategic planners and executives; level: advanced.",
        selfPrompt:
          "Develop an H3 subsection on strategic implications covering how organizations should prepare, what capabilities to build, and strategic positioning for the future. Integrate inherited and specific keywords naturally. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-8-3-1",
            tag: "p",
            keywords: ["Generate 3-4 strategic-readiness keywords."],
            taxonomy: "Supporting | Strategic guidance",
            attention: "Provide strategic guidance on future preparedness.",
            intent: "Advise on how to strategically prepare for future developments.",
            audiences: "Executives and planners; level: advanced.",
            selfPrompt:
              "Write a paragraph providing strategic guidance on preparing for future developments, building necessary capabilities, and positioning for success. Be actionable and strategic. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "ol-8-3-2",
            tag: "ol",
            keywords: ["Generate 2-3 preparation-step keywords."],
            taxonomy: "List | Preparation steps",
            attention: "List strategic preparation steps in priority order.",
            intent: "Provide 5-7 ordered steps for strategic preparedness.",
            audiences: "Strategic implementers; level: advanced.",
            selfPrompt:
              "Create an ordered list with 5-7 strategic preparation steps organizations should take in priority order. Keep items clear and strategic. Respect word constraints. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // 9. FAQ section
  {
    id: "FAQ",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 FAQ-related keywords tied to comprehensive user questions across beginner, intermediate, advanced, and specialized concerns",
    ],
    taxonomy: "FAQ | Comprehensive Q&A section",
    attention: "Anticipate and answer user questions comprehensively across all skill levels and concerns.",
    intent: "Address common questions with clear, helpful answers spanning basic understanding through advanced implementation and strategic concerns.",
    audiences: "All readers from beginners to experts; level: beginner-to-advanced.",
    selfPrompt:
      "This FAQ H2 section is designed for comprehensive question coverage. Adopt diverse user perspectives by analyzing all preceding content and understanding audience needs across skill levels. Generate eight high-impact questions covering beginner basics, intermediate implementation, advanced optimization, troubleshooting, decision-making, compliance, and future readiness. Organize each question under an H3 heading with a well-crafted, comprehensive answer. Avoid repeating content from other sections. Respect min/max words per element. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 600,
      maxWords: 850,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-FAQ",
        tag: "p",
        keywords: ["Generate 2-3 FAQ-intro keywords."],
        taxonomy: "Supporting | FAQ intro",
        attention: "Set expectations for comprehensive FAQ coverage across levels.",
        intent: "Introduce the FAQ section's comprehensive scope and organization.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write an introductory paragraph explaining the FAQ's comprehensive coverage from basic to advanced questions, how it's organized by complexity, and how to use it effectively. Respect word limits. Generate the necessary content here.",
        additionalData: {
          minWords: 110,
          maxWords: 220,
          actualContent: "",
        },
      },
      {
        id: "h3-FAQ-1",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for foundational beginner question."],
        taxonomy: "FAQ | Beginner question heading",
        attention: "Formulate the most fundamental beginner question.",
        intent: "Ask the most basic, essential question beginners need answered.",
        audiences: "Complete beginners; level: beginner.",
        selfPrompt:
          "Create an H3 question that addresses the most foundational concern a complete beginner would have. Keep it simple and essential. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-1-1",
            tag: "p",
            keywords: ["Generate 2-3 beginner-answer keywords."],
            taxonomy: "FAQ | Beginner answer",
            attention: "Provide a crystal-clear beginner-friendly answer.",
            intent: "Deliver a simple, accessible answer that builds foundational understanding.",
            audiences: "Beginners; level: beginner.",
            selfPrompt:
              "Write a clear, beginner-friendly answer using simple language, concrete examples, and avoiding jargon. Build confidence and understanding. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-2",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for practical getting-started question."],
        taxonomy: "FAQ | Getting started question",
        attention: "Pose a practical getting-started question.",
        intent: "Ask how to begin or take first steps practically.",
        audiences: "Motivated beginners; level: beginner-to-intermediate.",
        selfPrompt:
          "Create an H3 question about getting started or first practical steps. Keep it actionable. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-2-1",
            tag: "p",
            keywords: ["Generate 2-3 getting-started keywords."],
            taxonomy: "FAQ | Getting started answer",
            attention: "Provide actionable first steps.",
            intent: "Give clear, practical guidance on how to begin.",
            audiences: "Beginners; level: beginner-to-intermediate.",
            selfPrompt:
              "Write an actionable answer with clear first steps, prerequisites, and initial guidance. Be encouraging and practical. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-3",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for intermediate implementation question."],
        taxonomy: "FAQ | Implementation question",
        attention: "Address a common intermediate implementation challenge.",
        intent: "Ask about a typical implementation hurdle or decision point.",
        audiences: "Intermediate practitioners; level: intermediate.",
        selfPrompt:
          "Create an H3 question addressing a common implementation challenge or decision that intermediate users face. Keep it specific. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-3-1",
            tag: "p",
            keywords: ["Generate 2-3 implementation-answer keywords."],
            taxonomy: "FAQ | Implementation answer",
            attention: "Provide practical implementation guidance.",
            intent: "Resolve the implementation question with detailed, actionable advice.",
            audiences: "Practitioners; level: intermediate.",
            selfPrompt:
              "Write a practical answer that resolves the implementation challenge with specific guidance, code snippets if helpful, and decision frameworks. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-4",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for advanced optimization question."],
        taxonomy: "FAQ | Advanced question",
        attention: "Cover an advanced optimization or performance question.",
        intent: "Ask about optimization, performance, or advanced technique.",
        audiences: "Advanced users; level: advanced.",
        selfPrompt:
          "Create an H3 question addressing an advanced optimization concern, performance issue, or expert-level technique. Keep it technical. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-4-1",
            tag: "p",
            keywords: ["Generate 2-3 advanced-answer keywords."],
            taxonomy: "FAQ | Advanced answer",
            attention: "Provide expert-level technical guidance.",
            intent: "Answer the advanced question with depth and technical precision.",
            audiences: "Advanced users; level: advanced.",
            selfPrompt:
              "Write an expert-level answer with technical depth, specific metrics, optimization techniques, and advanced considerations. Use appropriate technical terminology. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-5",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for troubleshooting question."],
        taxonomy: "FAQ | Troubleshooting question",
        attention: "Address a common troubleshooting or debugging scenario.",
        intent: "Ask about a frequent problem or error situation.",
        audiences: "Troubleshooters; level: intermediate-to-advanced.",
        selfPrompt:
          "Create an H3 question about a common problem, error, or troubleshooting scenario users encounter. Keep it problem-focused. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-5-1",
            tag: "p",
            keywords: ["Generate 2-3 troubleshooting-answer keywords."],
            taxonomy: "FAQ | Troubleshooting answer",
            attention: "Provide diagnostic and solution guidance.",
            intent: "Help readers diagnose and resolve the problem.",
            audiences: "Troubleshooters; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a troubleshooting answer with diagnostic steps, common causes, and solution approaches. Be systematic and solution-oriented. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-6",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for decision-making or ROI question."],
        taxonomy: "FAQ | Business question",
        attention: "Focus on a business or ROI decision-making question.",
        intent: "Ask about business value, ROI, or strategic justification.",
        audiences: "Decision-makers and executives; level: intermediate.",
        selfPrompt:
          "Create an H3 question addressing business value, ROI calculation, or strategic decision-making criteria. Keep it business-focused. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-6-1",
            tag: "p",
            keywords: ["Generate 2-3 business-answer keywords."],
            taxonomy: "FAQ | Business answer",
            attention: "Provide strategic and business-focused guidance.",
            intent: "Help decision-makers understand business value and make informed choices.",
            audiences: "Decision-makers; level: intermediate.",
            selfPrompt:
              "Write a business-focused answer with ROI considerations, strategic benefits, implementation costs, and decision frameworks. Be business-savvy. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-7",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for security or compliance question."],
        taxonomy: "FAQ | Security question",
        attention: "Address a security, privacy, or compliance concern.",
        intent: "Ask about security practices, compliance requirements, or risk management.",
        audiences: "Security-conscious users; level: intermediate-to-advanced.",
        selfPrompt:
          "Create an H3 question addressing security, privacy, compliance, or risk management concerns. Keep it security-focused. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-7-1",
            tag: "p",
            keywords: ["Generate 2-3 security-answer keywords."],
            taxonomy: "FAQ | Security answer",
            attention: "Provide security and compliance guidance.",
            intent: "Address the security or compliance concern with authoritative guidance.",
            audiences: "Security-conscious users; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a security-focused answer with best practices, compliance requirements, risk mitigation strategies, and authoritative references. Be security-conscious. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-FAQ-8",
        tag: "h3",
        keywords: ["Generate 3-5 question-specific keywords for future readiness question."],
        taxonomy: "FAQ | Future trends question",
        attention: "Cover a future-oriented or evolution question.",
        intent: "Ask about future developments, upgrade paths, or long-term strategy.",
        audiences: "Strategic planners; level: intermediate-to-advanced.",
        selfPrompt:
          "Create an H3 question about future developments, evolution, migration paths, or long-term strategic considerations. Keep it forward-thinking. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 320,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-FAQ-8-1",
            tag: "p",
            keywords: ["Generate 2-3 future-answer keywords."],
            taxonomy: "FAQ | Future answer",
            attention: "Provide forward-looking strategic guidance.",
            intent: "Help readers prepare for future developments and plan strategically.",
            audiences: "Strategic planners; level: intermediate-to-advanced.",
            selfPrompt:
              "Write a forward-looking answer addressing future trends, upgrade strategies, long-term planning, and strategic preparedness. Be strategic and future-focused. Respect min/max words. Generate the necessary content here.",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // 10. Comprehensive Summary and Next Steps section
  {
    id: "h2-9",
    tag: "h2",
    classification: "semantic",
    keywords: [
      "Generate 6-8 section-level keywords focused on synthesis, comprehensive summary, key insights, actionable takeaways, recommended actions, and strategic next steps",
    ],
    taxonomy: "Guide | Comprehensive conclusion",
    attention: "Synthesize the entire deep dive comprehensively and guide readers toward strategic action.",
    intent: "Provide a comprehensive summary synthesizing all major sections, highlighting key insights, presenting comparative data, offering actionable takeaways, and guiding readers toward strategic next steps.",
    audiences: "All readers; level: general-to-intermediate.",
    selfPrompt:
      "Create an H2 summary section that comprehensively synthesizes the entire long-read content. Recap key insights from all sections, present summary comparison tables, highlight must-remember takeaways, include inspirational expert quotes, and provide clear next steps with multiple pathways for different reader goals. Be comprehensive yet accessible. Naturally integrate the listed keywords. Respect minWords/maxWords from additionalData. Generate the necessary content here.",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 500,
      maxWords: 750,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-9-1",
        tag: "p",
        keywords: ["Generate 3-4 synthesis-opening keywords."],
        taxonomy: "Supporting | Summary synthesis",
        attention: "Open with a powerful synthesis of the entire journey.",
        intent: "Recap the comprehensive journey and reinforce core value.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Write an opening paragraph that synthesizes the entire long-read journey, major themes covered, and core value delivered. Be comprehensive yet concise. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 120,
          maxWords: 240,
          actualContent: "",
        },
      },
      {
        id: "p-9-2",
        tag: "p",
        keywords: ["Generate 3-4 key-insights keywords."],
        taxonomy: "Supporting | Key insights",
        attention: "Highlight the most important insights and discoveries.",
        intent: "Emphasize breakthrough insights and critical understanding gained.",
        audiences: "Strategic readers; level: intermediate.",
        selfPrompt:
          "Write a paragraph highlighting the most important insights, discoveries, and breakthroughs covered throughout the content. Be insight-focused. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "table-9-3",
        tag: "table",
        keywords: ["Generate 3-5 comparison or decision-framework keywords."],
        taxonomy: "Data | Summary decision table",
        attention: "Present a comprehensive decision framework or approach comparison.",
        intent: "Provide a summary table helping readers choose paths or approaches based on their context.",
        audiences: "Decision-makers; level: intermediate.",
        selfPrompt:
          "Create a comprehensive summary table comparing different approaches, implementation paths, or decision frameworks covered in the content. Include columns for context, approach, benefits, and considerations. Present 5-7 comparison rows that synthesize key decision points. Keep content within word constraints while ensuring completeness and utility. Generate the necessary content here.",
        additionalData: {
          minWords: 220,
          maxWords: 350,
          actualContent: "",
        },
      },
      {
        id: "ul-9-4",
        tag: "ul",
        keywords: ["Generate 3-4 key-takeaway or must-remember keywords."],
        taxonomy: "List | Essential takeaways",
        attention: "Distill the most critical takeaways into a scannable list.",
        intent: "Provide 6-8 must-remember points that readers should carry forward.",
        audiences: "All readers; level: general-to-intermediate.",
        selfPrompt:
          "Create an unordered list with 6-8 essential takeaways that synthesize the most important points from the entire long-read. One sentence per item, impactful and memorable. Cover diverse aspects: foundational concepts, implementation insights, optimization principles, security considerations, and strategic guidance. Avoid redundancy and ensure each takeaway delivers unique value. Respect word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 90,
          maxWords: 180,
          actualContent: "",
        },
      },
      {
        id: "p-9-5",
        tag: "p",
        keywords: ["Generate 3-4 next-steps or action-pathway keywords."],
        taxonomy: "Supporting | Action guidance",
        attention: "Guide readers toward their next steps with clear pathways.",
        intent: "Provide clear, actionable next steps tailored to different reader goals and contexts.",
        audiences: "Engaged readers and implementers; level: general-to-intermediate.",
        selfPrompt:
          "Write a comprehensive paragraph that guides readers toward next steps, offering multiple pathways based on different goals (learning more, starting implementation, optimizing existing systems, strategic planning). Be specific with resources, actions, and decision points. Make it encouraging and actionable. Respect min/max words. Generate the necessary content here.",
        additionalData: {
          minWords: 130,
          maxWords: 260,
          actualContent: "",
        },
      },
      {
        id: "blockquote-9-6",
        tag: "blockquote",
        keywords: ["Generate 1-2 inspirational or motivational keywords."],
        taxonomy: "Supporting | Closing inspiration",
        attention: "End with an inspirational, memorable quote that motivates action.",
        intent: "Provide a final inspirational message that reinforces value and encourages readers to act.",
        audiences: "All readers; level: general.",
        selfPrompt:
          "Insert a powerful, inspirational closing quote that reinforces the content's core message and motivates readers to take action on what they've learned. Prefer Internal KB as the source; if unavailable, use External KB from recognized thought leaders or practitioners. Two to three sentences maximum. Make it memorable and action-oriented. Cite the source with name and credentials. Respect word constraints. Generate the necessary content here.",
        additionalData: {
          minWords: 25,
          maxWords: 50,
          actualContent: "",
        },
      },
    ],
  },
];