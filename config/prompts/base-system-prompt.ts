// @/config/prompts/base-system-prompt.ts
// Auto-generated file - Last updated: 2025-10-24T17:28:27.567Z

import { SystemPromptCollection } from "@/types/system-prompt-types";
import { appConfig } from "@/config/appConfig";

// ============ SYSTEM PROMPT LIMITS CONFIGURATION ============
export const SYSTEM_PROMPT_MAX_TOKENS = 35000;
export const SYSTEM_PROMPT_WARNING_THRESHOLD = 32000;

// ============ SAMMARY PROMPT CONFIGURATION ============
export const AI_SUMMARY_SYSTEM_INSTRUCTION = `You are a specialized content analyzer and summarizer. Your task is to transform full web page content into semantically rich, search-optimized summaries.

## Core Principles

### 1. Semantic Preservation
- Extract and preserve ALL key semantic nodes (facts, data, solutions, methods)
- Maintain logical flow and relationships between concepts
- Remove filler words, redundant phrases, and decorative language
- Eliminate repetitive explanations while keeping unique insights

### 2. Content Compression Rules
- Keep ALL links and resource references EXACTLY as provided (1:1 preservation)
- Compress explanations and conclusions to minimum viable length while preserving full meaning
- Remove meta-descriptions like "in this article" or "we will discuss"
- Eliminate emotional language and marketing fluff
- Keep technical terms, numbers, dates, and specific details intact

### 3. Link and Resource Handling
**CRITICAL**: Preserve ALL links, URLs, and resource references EXACTLY:
- External links: Keep full URLs unchanged
- Internal links: Preserve relative paths
- Resource names: Keep original names and descriptions
- Contact information: Preserve emails, phones, addresses

### 4. Output Structure

Generate summary in this format:

**Summary Content:**
[Compressed semantic content preserving all key nodes, facts, and logical connections. Include all links and resources inline where they appear in context.]

**Metadata:**
- Intent: [Primary user intent the page addresses - be specific]
- Taxonomy: [Content classification - be precise]
- Audience: [Target audience characteristics]
- Keywords: [5 highest-frequency, most relevant keywords from content]

## Examples

### Bad Summary (avoid):
"This article discusses various aspects of transportation documentation. It provides information about how to properly fill out forms and explains the importance of compliance..."

### Good Summary:
"Transportation waybill (путевой лист) requirements 2025: mandatory fields include driver name, vehicle registration, route, timestamps. GIBDD inspection requires medical examination mark, technical inspection signature. Fines for violations: 500-1000 RUB (individual), 5000-10000 RUB (legal entity). Electronic waybills accepted since Sept 2024 via certified platforms: [list platforms]. Full guide: https://example.com/waybills

Metadata:
- Intent: Learn waybill requirements and avoid fines
- Taxonomy: Transportation compliance, legal documentation
- Audience: Fleet managers, transport company owners, drivers
- Keywords: путевой лист, requirements, GIBDD, electronic waybills, compliance"

## Processing Instructions

1. Read entire page content
2. Identify all semantic nodes (concepts, facts, solutions)
3. Extract and preserve ALL links and resources
4. Remove redundancy and filler
5. Compress explanations while keeping meaning
6. Generate metadata
7. Return structured output

Focus on creating summaries that enable chatbot to:
- Quickly identify page relevance to user query
- Extract page URL for full content access
- Understand key concepts without reading full page
- Match user intent with page content`;

// ============ CUSTOM BASE INSTRUCTION (highest priority) ============
export const CUSTOM_BASE_INSTRUCTION = `You are an AI consultant chatbot for ${appConfig.short_name}.

# Company Information
- Company Name: ${appConfig.name}
- Description: ${appConfig.description}
- Website: ${appConfig.url}

# Your Role and Responsibilities
Your primary purpose is to assist clients by providing accurate and helpful answers to their questions based on the internal knowledge base provided below.

## Guidelines for Interaction

### Core Principles
- Always maintain a professional, friendly, and courteous tone
- Remain polite and respectful even if users are rude or confrontational
- Provide clear, concise, and relevant responses
- Focus on topics directly related to the company and the knowledge base

### Knowledge Usage
- Base your responses primarily on the internal knowledge base below
- You may supplement answers with general AI knowledge when it enhances understanding within the context of the organization
- Always ensure additional information aligns with company activities and the knowledge base context

### Communication Standards
- Be attentive, caring, and helpful in all interactions
- Keep responses focused and on-topic to optimize token usage
- Avoid lengthy discussions on unrelated or arbitrary topics
- Do not discuss technical implementation details of the chatbot itself

### Ethical Standards
- Uphold high moral and cultural standards in all communications
- Never engage with provocative or inappropriate requests
- Strictly avoid any topics prohibited by law or company policy
- Maintain professionalism regardless of user behavior

### Response Format
- Provide direct answers to user questions
- Use the knowledge base as your primary information source
- Keep responses relevant to the company's scope of services
- Be concise while ensuring completeness

Remember: Your goal is to represent ${appConfig.short_name} professionally while helping users find the information they need efficiently and effectively.`;


// ============ INTERNAL COMPANY KNOWLEDGE BASE (manually managed) ============
// This section is imported from a separate file and included in the final prompt
// If the file is missing, this will be an empty string (project won't break)
let internalKnowledgeBase = "";
let internalKnowledgeTokens = 0;

try {
  const { INTERNAL_COMPANY_KNOWLEDGE_BASE, INTERNAL_COMPANY_KNOWLEDGE_BASE_TOKENS } = require("./internal-company-knowledge-base");
  internalKnowledgeBase = INTERNAL_COMPANY_KNOWLEDGE_BASE || "";
  internalKnowledgeTokens = INTERNAL_COMPANY_KNOWLEDGE_BASE_TOKENS || 0;
} catch (error) {
  console.warn("[Config] internal-company-knowledge-base.ts not found or invalid. Continuing without it.");
}

export const INTERNAL_COMPANY_KB = internalKnowledgeBase;
export const INTERNAL_COMPANY_KB_TOKENS = internalKnowledgeTokens;


// ============ DYNAMIC KNOWLEDGE BASE (auto-generated from pages) ============
export const systemPromptData: SystemPromptCollection = [
  {
    "id": "y6rma1thtgda26zl5ogwzl3x",
    "title": "Какую машину купить для работы в такси комфорт в 2025?",
    "description": "Узнайте, какую машину купить для работы в такси комфорт в 2025 году! Обзор лучших моделей, советы по выбору и секреты успешного заработка.",
    "keywords": [
      "какую машину купить для работы в такси комфорт"
    ],
    "href": "/blog/kakuyu-mashinu-kupit-dlya-raboty-v-taksi-komfort",
    "content": "**Summary Content:**\nВыбор автомобиля для работы в такси комфорт в 2025 году требует учета ключевых критериев: комфорт пассажиров, экономичность и надежность. Автомобиль должен обеспечивать просторный салон, качественную отделку и современные системы безопасности. Экономичность, включая низкий расход топлива и доступность запчастей, снижает эксплуатационные расходы и увеличивает прибыль. Надежность транспортного средства минимизирует риски простоев и внеплановых ремонтов, что особенно важно в условиях городского трафика. Важно также соответствие автомобиля требованиям лицензирования и технического контроля для легальной эксплуатации. Рекомендуемые модели: Toyota Camry (расход 7.5 л/100 км, высокая надежность), Hyundai Elantra (6.8 л/100 км, современные системы безопасности), Skoda Octavia (6.5 л/100 км, удобный салон) и KIA K5 (7.0 л/100 км, комфортная подвеска). Правильное оформление документов и регулярный технический контроль критически важны для успешной работы. Методология выбора включает анализ требований, изучение рынка, тест-драйв и проверку документации. Соблюдение новых законодательных норм, касающихся безопасности и технического состояния, гарантирует легальную работу и повышает доверие клиентов. Полный обзор доступен на сайте: https://putevye-listy.ru/blog/kakuyu-mashinu-kupit-dlya-raboty-v-taksi-komfort\n\n**Metadata:**\n- Intent: Узнать, какую машину купить для работы в такси комфорт\n- Taxonomy: Автомобильный рынок, такси, выбор автомобиля\n- Audience: Водители такси, владельцы автопарков\n- Keywords: такси комфорт, выбор автомобиля, экономичность, надежность, комфорт",
    "tokenCount": 390
  }
];

// ============ FINAL COMBINED PROMPT ============
export const BUSINESS_KNOWLEDGE_BASE = `--- Internal Company Knowledge Base ---

БАЗА ЗНАНИЙ - ОТВЕТЫ НА ВОПРОСЫ О БИЗНЕСЕ:

# **US AUTO Knowledge Base for AI Chatbot Prompt**

## **1. Company History and Evolution**

From Consulting to Digital Platform  
US AUTO originated as a transportation consulting firm specializing in route documentation support for transport organizations. The founding team had deep roots in the transport sector, operating their own taxi fleet and providing VIP taxi driver training. The company became an Uber partner and achieved leading position in Moscow taxi services.

Educational Development  
For driver training, US AUTO Academy was created, later establishing the Capital Institute for Training Specialists (SIPS), which received licensing in 2019. The institute focuses on professional development for construction organizations and road safety specialists.

Digital Transformation  
Accumulated practical experience in commercial transport led to transitioning from manual processes to digital solutions. This resulted in creating the US AUTO cloud platform, enabling clients to independently generate route documents.

Implementation Results  
After connecting first clients, multiple efficiency confirmations were obtained:

* TransLogistic company reduced fines for overdue documents by 85%, saving over 1.2 million rubles  
* CityTaxi taxi fleet reduced vehicle downtime by 20%  
* Autoinvoice decreased administrative costs by 30%  
* CenterTrans accelerated trip planning by 40%

Current Status  
The platform serves over 1,200 companies, providing:

* 15% workforce efficiency improvement  
* 14% operational cost reduction  
* Automatic generation of 1000+ documents per minute

## **2. Company Founders and Professional Background**

Maxim Yuryevich Batmanov - CEO/Project Leader

* Education: Academy of Economic Security (2001-2006), Russian Academy of Justice (2008-2012)  
* Experience: CEO of machine learning DLP system (2015-2023), Founder & CEO of intelligent ERP system for fleet management (2023-present)  
* Achievement: Attracted first 400 clients within 12 months after launch

Daniil Alexandrovich Manukov - Marketing/Digital Marketing Specialist

* Education: State University of Management, Skolkovo Startup Academy  
* Experience: IT startup HOTY owner since 2015, attracted over 7 million rubles in investments

Marat Mansurovich Shagivaleev - Technical Director (CTO)

* Education: Moscow State University of Food Production (2006)  
* Experience: Launched US AUTO product (2022), developed indicator constructor for AVSTRADE platform (2020), 5+ years in high-load systems design

Alexander Nikolaevich Strilchuk - Senior Backend Developer

* Education: Don State Technical University (2013)  
* Experience: BETCITY high-load services development (2020-2022), 16+ years backend development experience

Philipp Andreevich Emelyanov - Product Manager

* Education: Moscow State Agroengineering University, Academy of Labor and Social Relations  
* Experience: Joined US AUTO (2024), conducted 500+ expert client meetings

Konstantin Alexandrovich Koshechkin - Scientific Advisor

* Education: Doctor of Science (2022), multiple degrees in biological sciences and pharmacy  
* Experience: CDO/CDTO certified, 12 software patents, IT company EQUANTICS co-founder

## **3. Company Mission and 5-10 Year Vision**

Mission  
Transform commercial fleet management from complex, costly tasks into simple, transparent, predictable processes. Provide Russian businesses with technological cloud solutions that automate routine tasks, eliminate operational losses, and give managers complete control over every vehicle and driver.

Vision (2030)  
Become the integral standard for commercial transport management in Russia and CIS countries, creating a unified digital ecosystem for all logistics chain participants. By 2030, US AUTO envisions an intelligent platform that:

* Uses AI for risk prediction and automatic real-time route optimization  
* Integrates with government and financial services for seamless fleet management  
* Ensures maximum profitability through predictive analytics and machine learning

Strategic Development Directions

* Electronic documentation - complete transition to electronic route sheets  
* Telemedicine - remote pre-trip and post-trip medical examinations  
* Transport monitoring - navigation and telemetric data collection  
* AI analytics - predictive maintenance and route optimization

## **4. Core Company Values**

Maximum Transparency and Honesty

* Honest capability assessment with clear system explanations  
* Transparent pricing without hidden fees  
* Open reporting with immediate incident notifications  
* Direct communication using benefits and facts

Client as Partner, Not Customer

* Deep logistics understanding of client pain points and goals  
* Partnership approach with complete problem-solving  
* Joint development through active feedback collection  
* Expert fleet optimization consulting

Responsibility and Reliability

* 24/7 system guarantee with platform availability  
* Data security with zero information loss  
* Deadline compliance with promise fulfillment  
* Confidentiality with impeccable data handling

Proactivity and Need Anticipation

* Error prevention through system guidance  
* Advance update notifications  
* Data-driven analytical insights  
* Active implementation support

Simplicity and Technology Focus

* Intuitive product requiring minimal training  
* Simple processes for easy onboarding and support  
* Modern communication technologies  
* Clear documentation with practical examples

## **5. Staff Count and Organizational Structure**

Team Size  
Over 20 employees work across various divisions within the US AUTO project.

Group Structure  
US AUTO is part of a company group united by making transport more efficient and personnel more qualified:

* US AUTO (brand "USAUTO") - transport consulting and IT solutions  
* Capital Institute for Training Specialists (SIPS) - licensed educational organization (2019)  
* LLC "Profite" - IT company developing software

Organizational Structure

* General Director - strategic leadership  
* Technical Director (CTO) - technical leadership and architecture  
* Product Manager - product management and client requirements  
* Development Team - frontend (Next.js), backend (PHP Laravel, Java Spring)  
* Marketing and Sales - digital marketing and business development  
* Scientific Leadership - research and innovation

## **6. Geographic Presence in Russia**

Current Presence

* Moscow and Moscow region - main operational region  
* Three Moscow offices - administrative and operational centers  
* Market impact currently limited to Moscow and Moscow region

Russian Expansion Plans

* By end 2025: Remote sales capability throughout Russia  
* Focus on federal regions through telemedicine and electronic route sheets  
* Target audience: Transport companies of all sizes across Russian territory

Technological Readiness  
Cloud platform architecture enables remote client servicing without physical regional presence.

## **7. International Expansion Plans**

Immediate Plans

* CIS Countries: Planned expansion to Commonwealth markets  
* Belarus: Considered priority direction  
* Possible products: International expansion may use adapted products for local legislation

Strategic Considerations

* Development depends on regulatory environments in target countries  
* Product adaptation required for local documentation requirements  
* Partnership agreements with local operators under consideration

Long-term Perspective  
By 2030, the company plans to become the commercial transport management standard not only in Russia but also in CIS countries, creating a unified digital ecosystem for the region.

## **8. Company Contacts**

Contact Information

* Email: soft@sipsmos.ru  
* Phone: +7 495 1263948  
* Addresses: Moscow, 4th Magistralnaya Street, building 11, structure 2, office 217, room 3\\2; Moscow, Varshavskoye Highway, 143; Moscow, Zelenodolskaya Street, 3k2, office 525

Legal Entity  
LLC "PROFITE" INN 9714052498 KPP 771401001 OGRN 1247700441636, providing IT services and software licensing. LLC "Profite" owns USAUTO software rights, included in Russian software registry (entry №26461, February 12, 2025).

## **9. Detailed USAUTO System Functions and Client Problem Solutions**

System Overview  
USAUTO is a comprehensive cloud platform with seven main modules, each solving specific transport company problems through integrated functionality.

Route Sheets Module  
Solves manual route sheet creation problems through:

* Constructor with three databases: organization, transport, drivers  
* Quick document creation (30 seconds vs 10-15 minutes manual)  
* Templates and mass printing capabilities  
* Error elimination through automatic field validation  
* Medical personnel and controller integration  
* Automatic transfer to 5 mandatory safety journals  
* Route planning with loading/unloading addresses  
* Accounting integration for fuel write-offs

Fines Module  
Addresses multiple fine source consolidation:

* GIBDD (traffic violations), MADI (documentation violations), Mosgortekhnadzor (size violations)  
* Centralized fine tracking from all sources  
* Stage monitoring (preferential, regular, FSSP)  
* 50% savings through timely preferential payment  
* XML file generation for bank-client systems  
* Example: Lawn parking fine 3,000 rubles becomes 13,000 rubles with FSSP fees vs 1,500 rubles preferential payment

Notification System Module  
Monitors document expiration dates:

* Digital document reference with automatic monitoring  
* Timely notifications to operators  
* Prevention of expired document operations

Electronic Route Sheets Module  
Enables paperless documentation:

* QR codes on driver mobile devices  
* Physical medical/technical inspections still required  
* GIBDD inspector reads QR code with special device  
* Contains medical examination, technical control, vehicle, organization, and driver data

Telemedicine Module  
Provides remote medical examinations:

* Certified medical equipment installation at client sites  
* Pressure, temperature, alcohol testing measurements  
* Real medical center data transmission  
* Remote medical staff confirmation  
* Sticker issuance with examination information  
* NOOR (National Organization of Employers Union) integration  
* Government registry data transmission

## **10. Additional Services Beyond Core Software**

Medical Services

* Remote telemedicine: Certified equipment installation at client offices enabling on-site driver medical examinations  
* Medical services outsourcing: Pre-trip examinations at US AUTO medical center for clients without medical personnel

Technical Services

* Controller services outsourcing: Technical vehicle inspections and readiness confirmation  
* On-site technical control: Controller visits to client locations for pre-trip technical inspections

Legal Services

* Professional fine disputes: Staff lawyers providing remote dispute resolution (20% commission from disputed fine amount, e.g., 200 rubles from 1,000 ruble fine)  
* Licensing assistance: Support for passenger transport license applications

Educational Services

* Capital Institute for Training Specialists (SIPS) training:  
  * Vehicle release controller  
  * Road safety and instruction supervisor  
  * Automobile and urban transport dispatcher

Auxiliary Services

* Route sheet printing: Monthly blank preparation and delivery  
* Specialized stamps: Medical organization license number stamps for time savings and error prevention  
* Comprehensive documentation support: Diagnostic cards, medical certificates, driver cards, passenger transport regulations consulting

Integrated Approach Benefits  
All additional services integrate with main software, providing unified ecosystem for complete fleet management aspects, regulatory compliance guarantee, time and resource savings, and professional qualified specialist services.

## **11. Industries and Business Types Using USAUTO Solutions**

Key Eligibility Criteria  
Solutions suit any organization with vehicles registered to LLC or individual entrepreneurs requiring properly issued route sheets. Maximum efficiency achieved with minimum 5 vehicles, though smaller fleets and individual transport operators (e.g., taxi drivers) are also served.

Primary Transport Sectors

Freight Transport

* Segment includes up to 2 million vehicles with high regulatory burden  
* Requirements: route documentation control, driver work/rest monitoring, fuel operations, medical examinations  
* Typical client characteristics: companies handling freight across Russia, 20+ trucks, transport director decision-maker (35-50 years)  
* Growth projected for 2026-2027 due to logistics digitalization

Courier Services

* Express delivery, courier services, "last mile" logistics operators serving B2C and B2B clients  
* Requirements: high automation, corporate system integration, operational analytics, administrative cost reduction  
* Average fleet size: 15-20 vehicles for urban goods and services delivery

Passenger Transport

* Taxi services: from large fleets (100+ vehicles) to individual drivers, including aggregator partners  
* Bus transport: regular and irregular routes with enhanced safety and documentation requirements  
* Corporate and specialized passenger transport services

Non-Transport Industries with Vehicle Fleets

Medical Organizations

* Medical centers with owned vehicles: ambulances, medical transport, service vehicles  
* Special requirements: strict driver medical examination protocols

Wholesale Companies, Construction, Manufacturing

* Fleet sizes vary from service vehicles to specialized equipment  
* Requirements: logistics operations support, remote site operations

Universal Application  
Any organization regardless of industry sector can use USAUTO if they own registered vehicles (LLC/IP designation in vehicle registration) and are legally obligated to maintain route documentation per Russian legislation.

## **12. Principal Competitive Advantages**

Comprehensive Service Integration  
Unlike competitors limited to document template creation, USAUTO provides complete medical staff and controllers under contract, owns medical facilities with officially employed staff ensuring full document quality responsibility, offers legal representation in disputes with regulatory authorities, and maintains three Moscow offices for direct consultation and medical examinations.

Advanced Electronic Route Sheets (ERS) Technology

* Complete legally significant document lifecycle: creation, editing, deletion, search, filtering, action logging  
* Six XML titles per GOST with cryptographic protection (digital signature, PKI) and automatic GIS EPD registration  
* Adaptive signing logic automatically configuring validation routes, title sets, and signing conditions based on transport type and regulations (competitors use fixed templates only)  
* Telemetry-based auto-generation reducing dispatcher workload by 80% through monitoring module integration

Unique Telemedicine Module  
USAUTO is the only system offering fully integrated telemedicine component within ERP platform, managing examination results with video recording of procedures and biometric identity verification, compliance with Federal Tax Service Order № ЕД-7-26/116@ requirements.

Revolutionary Architecture

* Event-driven model via Kafka/RabbitMQ event bus with real-time component interaction (medical examination, ERS, monitoring)  
* Prevents data falsification through cross-module connectivity, eliminating manual editing and process duplication  
* Centralized REST API covering full functionality: ERS, medical examinations, telematics, organizations, drivers, fines, reporting  
* Microservice architecture enabling horizontal scaling and customization flexibility

Superior User Experience  
Intuitive interface requiring only three clicks for system mastery, consolidated services in single interface (route documentation and fines), unified databases for drivers, organizations, and vehicles.

Economic Efficiency  
Subscription model pricing lower than individual medical center rates for single examinations, ensuring service stability throughout paid period.

## **13. Development Technologies**

Technical Stack

* Frontend: JavaScript (Next.js framework)  
* Backend: PHP (Laravel framework) and Java (Spring framework)  
* Operating System: Linux Debian

## **14. Annual Revenue and Key Financial Indicators**

Monthly Performance Data (2025)

| Month | Client Base Growth | Total Clients | Revenue (RUB) |
| :---- | :---- | :---- | :---- |
| January | 127 | - | 1,090,000 |
| February | 231 | 358 | 2,843,000 |
| March | 99 | 457 | 3,144,000 |
| April | 179 | 636 | 4,350,000 |
| May | 133 | 769 | 5,281,000 |
| June | 79 | 848 | 5,468,352 |

The data shows consistent revenue growth and expanding client base throughout 2025.

## **15. External System Integrations**

Integration Philosophy  
No public API with ready documentation for independent client integration. Instead, USAUTO practices personalized integration development based on client requests, ensuring maximum alignment with specific business processes.

Supported System Types

* Enterprise Management Systems: 1C integration (most common in Russia) for synchronizing driver, vehicle, route sheet, and financial operation data  
* Banking Systems: Automated financial operations for fuel, fines, maintenance, and operational expenses  
* Specialized Solutions: Transport monitoring systems, fuel management solutions, logistics planning platforms, maintenance services  
* ERP Systems: Various ERP platform connections creating unified information environment

Implementation Process

1. Client request initiation defining specific systems and required data exchange functionality  
2. Technical evaluation and planning by USAUTO team analyzing feasibility, complexity, and timeframes  
3. Individual solution discussion accounting for specific requirements, limitations, and desired interaction results

Personalized Approach Advantages  
Maximum needs alignment without standard API limitations, direct development team contact ensuring rapid response, flexible architectural solutions optimized for each specific case.

## **16. Platform Access Formats**

Current Access Method  
Platform provides functionality exclusively through adaptive web interface optimized for various device types and screen sizes.

Mobile Application Status  
No native mobile applications for iOS or Android currently available. Users cannot download specialized apps from App Store or Google Play Market. Strategic decision reflects focus on universal web solution working across any platform without separate version development and maintenance.

Adaptive Web Interface

* Cross-platform accessibility: Full functionality via any modern web browser on desktops, laptops, tablets, smartphones without OS restrictions  
* Responsive design: Automatic element positioning, button sizing, and navigation menu adaptation for different screen sizes ensuring comfortable use on large monitors and mobile devices

## **17. Ideal Customer Profiles**

Base Segment Evolution  
Current ideal client: companies with up to 50 vehicles representing optimal balance between fleet management complexity and digital solution implementation efficiency, primarily in Moscow region for complete service provision including physical medical staff presence.

Segment Transformation with New Services  
Electronic Route Sheets Segment: Large corporate and government clients with 100-1000+ vehicles including state companies, government-participated enterprises, freight/passenger transport, and dangerous goods (HAZMAT) companies requiring enhanced documentation and control.

Telemedicine Product Segment: Companies with own infrastructure including territories, warehouse assets, vehicle storage facilities requiring on-site medical equipment installation for 50+ vehicle fleets with loading/unloading areas and effective telemedicine implementation infrastructure.

Strategic Multi-segment Model  
Platform architecture enables personalized solutions for small Moscow-region transport companies with basic needs and large state/commercial operators with complex automation, control, and specialized telemedicine requirements.

## **18. Major Client Success Cases**

Industrial Plant Case Study  
Challenge: Large industrial facility located far from urban centers with special security access systems and significant vehicle concentration (trucks, specialized equipment, service vehicles). Remote location created logistical complexities for mandatory pre-shift and post-shift medical examinations.

Solution: Telemedicine equipment installation directly on facility territory creating compliant medical facility without building permanent medical infrastructure. On-site pre-trip and post-trip medical examinations using USAUTO equipment including all required diagnostic procedures per legislation.

Integration: Telemedicine complex integrated with transport management and facility access control systems enabling automatic medical compliance monitoring and documentation generation.

Results Achieved:

* Simplified medical control processes with reduced examination time  
* Eliminated need to leave facility for medical examinations  
* Reduced vehicle downtime and increased effective driver working time  
* Decreased transportation costs for medical facility visits  
* 100% regulatory compliance eliminating violation risks

Strategic Significance: Demonstrates USAUTO's adaptability to specific client conditions including remote locations, special security regimes, and high-volume transport flows. Confirms platform scalability for large enterprises without quality or efficiency reduction.

Replication Potential: Solution applicable to construction projects in remote areas, industrial enterprises with own territories and significant transport flows, and large logistics/distribution centers with concentrated vehicles and drivers.

## **19. Core Problems USAUTO Solves for Transport Companies**

Strategic Business Process Optimization  
USAUTO helps optimize complex business processes and increase client earnings through comprehensive digital solutions creating synergistic effects from process integration, systematic automation approach building unified digital ecosystem where each process is interconnected and optimized for maximum enterprise efficiency.

Document Management Revolution

* Digital document flow: Centralized storage, rapid search, version control for all enterprise documents  
* Transport release acceleration: Automated pre-trip procedures including driver document verification, vehicle technical condition, medical clearance significantly reducing downtime and increasing fleet utilization coefficient

Intelligent Fine Management

* Automated responsibility distribution: System automatically determines responsible parties and generates corresponding documentation for fine allocation by vehicles and employees  
* Accounting simplification: Automated distribution enables faster fine payments and driver fine deductions, eliminating manual processing and reducing calculation errors  
* Practical savings example: Lawn parking fine 3,000 rubles becomes 13,000 rubles with bailiff fees vs 1,500 rubles with preferential payment

Smart Monitoring and Logistics

* Vehicle movement control: Real-time fleet status monitoring enabling operational response to logistics changes  
* Route optimization: Enhanced route quality based on current vehicle location, traffic conditions, cargo specifics resulting in significant fuel and delivery time savings  
* Real-time monitoring: Live vehicle tracking with traffic corrections enabling program-based loading/unloading adjustments

Accounting Process Revolution

* Automated payment operations: Mass fine export functionality for bank-client system uploads  
* Human resource savings: Mass processing significantly reduces payment creation labor with rapid export, upload, and payment generation  
* Payment execution control: Complete transparency and financial operation controllability through bank-client confirmation documents

Comprehensive Implementation Effect  
Platform module integration creates multiplicative effects where single process optimization automatically improves related operation efficiency, leading to radical overall enterprise productivity improvement and management model transformation toward new digital maturity and operational efficiency levels.

## **21. [Content Gap - Section Not Present in Sequential Order]**

Based on the source document structure, section 21 appears to be missing or renumbered in the original knowledge base. The document continues with other numbered sections.

## **22. [Content Gap - Section Not Present in Sequential Order]**

This section is not present in the sequential numbering of the original document.

## **23. Client Collaboration Duration with System**

Average Partnership Length  
Clients typically maintain long-term relationships with USAUTO, with average collaboration cycles of one year, indicating high service value and platform effectiveness for transport enterprise operations.

Long-term Relationship Factors

* Comprehensive solutions: USAUTO provides complete ecosystem rather than individual functions, creating high switching costs and encouraging long-term partnerships  
* Continuous development: Platform constantly adds new modules and capabilities, providing clients access to modern solutions without changing technology providers  
* Personalized approach: Individual client attention and solution adaptation create high loyalty levels

Economic Justification  
Annual collaboration cycles align with subscription service models ensuring stable service costs and predictable operational expenses. One-year duration enables clients to fully realize implemented solution potential and achieve measurable return on investment.

Expansion Potential  
Annual cycles often become foundation for longer partnerships as clients evaluate all system advantages and become interested in continued collaboration development, naturally extending through expanded module usage.

## **24. [Content Gap - Section Not Present in Sequential Order]**

This section is not present in the original document sequence.

## **25. Tariff Plan Structure**

Modular Pricing Approach  
Each service direction has individual tariff grids reflecting platform module specifics and enabling clients to pay only for functions necessary for operational activities.

Route Sheets Module Pricing  
Special tariff grid considers vehicle quantity and subscription period, ensuring fair pricing proportional to system usage scale.

Integrated Services  
Fine management tools and toll road monitoring are included in standard subscription at no additional cost when connecting route sheets module. Future development may introduce separate tariffs enabling standalone module connection without route sheets.

## **26. Client Cost Formation**

Pricing Factors

* Vehicle quantity: Service costs determined by client's vehicle count ensuring fair cost distribution proportional to fleet size and system usage intensity  
* Subscription term: Significant discounts offered for subscription duration. Clients choose payment periods: 1, 3, 6, or 12 months. Longer payment periods provide greater cost savings

Scalable Pricing Model  
Pricing structure accommodates various enterprise financial cycles with progressive discounts encouraging long-term planning.

## **27. Free Trial Period and Demo Version**

Testing Capabilities  
Free trial period available for system functionality familiarization. Clients can examine personal cabinet interface and evaluate usability.

Demo Version Limitations  
Demo accounts exclude medical staff and vehicle control specialists. Users can explore program interface, input organization/transport/driver information, but route sheet creation is limited to maximum one week duration.

Evaluation Process  
Trial version enables comprehensive platform assessment before commitment while maintaining core functionality restrictions to protect service integrity.

## **28. Additional Services**

Optional Services Available

* Documentation supplies: Specialized stamps ensuring complete regulatory compliance for processed documents  
* Legal services: Lawyer services for fine disputes, particularly valuable for enterprises with large vehicle fleets where fine disputes have significant financial impact

Service Integration  
Additional services complement core platform functionality providing comprehensive fleet management solution.

## **29. Discount System**

Volume Discounts  
Primary business model includes additional discounts for increased vehicle quantities registered in the program, incentivizing large enterprises toward comprehensive platform utilization.

Long-term Contract Benefits  
Discounts provided based on client-selected payment periods. Longer periods generate greater discounts, creating mutually beneficial conditions for sustained cooperation.

Progressive Discount Structure  
Discount system rewards both fleet size and commitment duration, supporting USAUTO's strategic partnership development approach.

## **30. Service Payment System**

Flexible Payment Periods  
Service payment occurs according to client-selected periods based on individual financial capabilities, ensuring maximum adaptation to various enterprise financial cycles.

Economic Advantages of Long-term Payment  
Extended payment periods reduce subscription costs. This approach encourages client long-term planning and provides USAUTO stable cash flow for platform development.

Payment Flexibility Benefits

* Adaptation to enterprise budget cycles  
* Predictable operational expenses  
* Financial planning optimization  
* Incentivized long-term commitments

## **31. Technical Support**

Included Support Services  
Technical support is included in base cost without separate payment requirements, ensuring clients receive necessary assistance without additional financial burden.

Comprehensive Service Philosophy  
Support inclusion in base pricing reflects USAUTO's philosophy of providing complete service where clients receive comprehensive solutions with full accompaniment rather than standalone software products.

Support Coverage  
24/7 platform availability with multi-channel technical assistance including email, phone, and remote assistance capabilities ensuring continuous operational support.

## **32. System Requirements**

Internet Access  
Any stable network connection sufficient for cloud-based operations.

Browser Compatibility  
Modern Chrome, Edge, Safari, or Firefox with TLS 1.3 support ensuring secure data transmission and optimal platform performance.

Document Printing  
Local or network printer for route sheet output. Future development targets smartphone QR-code reading capability enabling completely paperless workflow scenarios.

Minimal Infrastructure Needs  
Platform designed for immediate deployment without extensive client-side technical infrastructure, supporting rapid implementation across diverse organizational environments.

## **33. Data Protection**

Russian Federation Compliance  
Platform fully complies with Russian personal data storage and processing requirements (Federal Law 152-FZ) and industry-specific GOST standards ensuring complete regulatory alignment.

Technical Security Measures

* Data centers certified to ISO/IEC 27001 standards  
* All communication channels encrypted using TLS 1.3  
* Data at rest protected with AES-256 encryption  
* Skolkovo resident status imposing additional information security obligations and regular security audits

Comprehensive Protection Framework  
Multi-layer security architecture combining regulatory compliance, international certification standards, and enhanced resident requirements providing enterprise-grade data protection.

## **34. Offline Functionality**

Cloud-Based Architecture  
Platform operates exclusively in cloud environment; offline mode is not supported due to real-time integration requirements and centralized data processing needs.

Contingency Support  
During connectivity loss, technical support can remotely generate PDF route sheet forms and deliver them to clients for printing, ensuring operational continuity during network interruptions.

Online Dependency Rationale  
Cloud-first design enables real-time compliance monitoring, automatic updates, and centralized service delivery while maintaining data integrity and regulatory compliance.

## **35. Data Backup and Recovery**

Backup Strategy  
Detailed backup procedures disclosed under NDA agreements, ensuring comprehensive data protection while maintaining competitive confidentiality.

Recovery Specifications

* Daily incremental backups with weekly full copies to geographically distributed facilities  
* Critical database recovery time ≤15 minutes  
* Recovery Point Objective (RPO) of 5 minutes through near-real-time replication  
* Multi-site redundancy ensuring data availability during localized incidents

Enterprise-Grade Reliability  
Backup infrastructure designed to exceed industry standards with minimal data loss potential and rapid recovery capabilities supporting business continuity requirements.

## **36. Availability Guarantees (Uptime)**

Service Level Agreement  
Contractual commitment to 24×7 availability with target SLA of 99.5% uptime ensuring consistent service accessibility for client operations.

Maintenance Windows  
Brief update periods scheduled during nighttime hours to minimize operational impact. Hot-fix procedures enable most users to experience uninterrupted service during incident response.

High Availability Architecture  
Infrastructure designed to maintain service continuity through redundant systems, automated failover capabilities, and proactive monitoring ensuring minimal service disruption.

## **37. Technical Support Channels**

Multi-Channel Support Structure

| Channel | Response Time | Schedule |
| :---- | :---- | :---- |
| Written requests (help-desk, email) | ≤15 minutes for critical issues | 24×7 |
| Phone support | ≤60 seconds | Monday-Friday 09:00-18:00 (MSK) |
| Remote assistance (AnyDesk/SSH) | By agreement | 24×7 for emergencies |

Tiered Response System  
Critical issues receive immediate attention with comprehensive coverage ensuring rapid problem resolution. Standard support maintains professional response times during business hours with emergency escalation capabilities.

Remote Resolution Capability  
Direct system access enables technical staff to resolve issues without client intervention, minimizing downtime and ensuring efficient problem resolution.

## **38. Infrastructure and Data Location**

Primary Infrastructure

* Main facility: Commercial Tier III data center in Moscow region  
* Backup facility: Same-class data center in Central Federal District  
* Virtualized servers on Kubernetes clusters  
* Storage: Ceph-S3 with S3-compatible cloud backup within Russian Federation

Data Sovereignty  
Physical disks and tapes stored exclusively within Russian Federation territory. Data export outside Russia prohibited by security policy ensuring complete compliance with data localization requirements.

Scalable Architecture  
Kubernetes-based infrastructure enables horizontal scaling and efficient resource utilization while maintaining data sovereignty and regulatory compliance.

## **39. Legal Compliance**

Comprehensive Regulatory Adherence  
Platform fully complies with:

* Federal Law 152-FZ "On Personal Data" + FSTEK Order №55 (PD processing level 2)  
* Federal Tax Service Order № ЕД-7-26/116@ covering electronic route sheets and telemedicine  
* GOST R 57580.1-2017 for financial data security and Ministry of Transport ERS methodologies

Multi-Standard Compliance  
Integrated compliance framework addressing personal data protection, tax reporting requirements, financial security standards, and transport-specific regulations ensuring complete legal alignment.

Regulatory Updates  
Platform automatically incorporates regulatory changes ensuring continuous compliance without client intervention or system disruption.

## **40. System Implementation Process**

Enterprise Registration

1. Client submits enterprise card (OGRN, INN, contact details, authorized representatives)  
2. USAUTO manager creates organization record within 1 business day, prepares contract and user agreement  
3. Documents signed in-person or accepted online through personal cabinet; automatic account activation

Personal Cabinet Configuration

* Post-activation web interface access  
* Initial setup (organizations, drivers, vehicles) supported by client service specialist via Zoom/Teams or on-site sessions  
* Optional data entry assistance by USAUTO specialists (complimentary for standard volumes, separately priced for large datasets)

Full-Scale Launch Timeline

* Basic training and operational deployment: 10-15 minutes enabling immediate route sheet creation and fine management  
* Complete reference data population (50+ vehicles, 100+ drivers): Several hours to 1 business day depending on operator skills; USAUTO assistance available with individual scheduling

Training Format Options

| Format | Description | Materials |
| :---- | :---- | :---- |
| In-person | Office session with hands-on demonstration | Printed quick guide |
| Remote | Zoom/Teams webinar with recording | PDF manual, FAQ references |
| Self-learning | Video instructions and interactive interface guidance | LMS playlist on portal |

Data Migration Support

* CSV/Excel import for vehicles, drivers, contractors, and historical fines  
* Complex integrations (SOAP/REST-API from third-party TMS systems) via custom connector scripts  
* Full-service migration with technical specifications and acceptance documentation  
* Data accuracy verification with formal transfer documentation

Post-Implementation Support

* Hotline 09:00-18:00 MSK: Live voice support for immediate issue resolution  
* 24×7 Help-desk/chat: Critical tickets (Category A) ≤15 minutes response; standard tickets ≤1 hour  
* Remote assistance: AnyDesk/SSH access for incident resolution without client participation

Consulting and Process Optimization  
Expert consultation included covering:

* Ministry of Transport and Federal Tax Service regulations (ERS, telemedicine, hazardous materials)  
* Route optimization and vehicle downtime reduction  
* Fine cost reduction and automated accounting payment processes  
* Consultation included in base SLA during implementation; ad-hoc availability post-launch without additional charges

## **41. Full-Scale Launch Timeline**

Basic Training and Deployment  
10-15 minutes required for basic training and operational deployment. Users become capable of creating route sheets and managing fines immediately after this brief introduction.

Complete Reference Data Population  
Full reference database completion (50+ vehicles, 100+ drivers) depends on operator skill level: ranges from several hours to 1 business day. When delegated to USAUTO specialists, timeline negotiated individually based on data volume and complexity.

Rapid Implementation Philosophy  
System designed for immediate productivity with minimal learning curve, enabling organizations to begin benefiting from platform capabilities within minutes of activation.

## **42. Personnel Training Formats**

Training Options Available

| Format | Description | Materials Provided |
| :---- | :---- | :---- |
| In-person | Office session during contract signing with hands-on demonstration | Printed quick guide |
| Remote | Webinar via Zoom/Teams with session recording | PDF manual, referenced FAQ |
| Self-learning | Video instructions and interactive interface hints | LMS playlist on portal |

Flexible Learning Approach  
Multiple training formats accommodate different organizational preferences and learning styles, ensuring effective knowledge transfer regardless of client location or scheduling constraints.

Comprehensive Support Materials  
Each format includes appropriate documentation and reference materials enabling continued learning and problem resolution post-training.

## **43. Historical Data Migration**

Standard Import Capabilities  
Platform supports CSV/Excel import for vehicle lists, drivers, contractors, and historical fine archives, enabling rapid data transition from existing systems.

Advanced Integration Support  
For complex scenarios involving SOAP/REST-API connections with third-party TMS systems, custom connector scripts provided. Integration team performs comprehensive "turnkey" migration according to agreed technical specifications.

Data Validation Process  
Migration accuracy verification completed through formal acceptance documentation ensuring complete and correct data transfer.

Migration Scope  
Comprehensive data migration covers all essential operational information enabling seamless transition without operational disruption or data loss.

## **44. Post-Implementation Technical Support**

Multi-Channel Support Structure

* Voice hotline 09:00-18:00 MSK: Live issue resolution during business hours  
* 24×7 Help-desk/chat widget: Critical tickets (Category A) ≤15 minutes response; standard tickets ≤1 hour response  
* Remote assistance capability: AnyDesk/SSH connections enable direct system fixes without client involvement during incidents

Proactive Support Model  
Technical staff can connect remotely and perform system repairs without client participation, minimizing downtime and ensuring efficient problem resolution.

Graduated Response System  
Support structure prioritizes critical issues while maintaining professional service levels for all support categories.

## **45. Consulting and Process Optimization**

Expert Consultation Areas  
USAUTO provides specialized consulting covering:

* Ministry of Transport and Federal Tax Service regulations (electronic route sheets, telemedicine, hazardous materials transport)  
* Route optimization and vehicle downtime reduction strategies  
* Fine cost reduction and automated accounting payment processes

Service Integration  
Consulting included in base SLA during implementation phase and available ad-hoc post-launch without additional charges, ensuring continuous optimization support.

Regulatory Expertise  
Deep knowledge of transport regulations and compliance requirements enables clients to navigate complex regulatory environments with professional guidance.

## **46. Development Roadmap (Next 2-3 Years)**

Client Base Growth Ambition  
Target: Increase portfolio to 20,000 organizations (10× growth from current 2,000+). Strategy focuses on expansion into adjacent transport and logistics segments from small carriers to government operators.

Product Line Expansion

* Documentation 4.0: Complete legally significant electronic route sheets with automatic trip closure via telemetry  
* Unified Fine Management: Independent service module with separate pricing structure  
* Native Monitoring: Built-in GPS tracking, fuel monitoring, and technical condition tracking without external integrations  
* Smart Telemedicine: Remote medical examination complexes with biometrics and contactless QR access  
* 99% Needs Coverage: Comprehensive solution covering virtually all transport department tasks from maintenance planning to fuel card management

Innovation Focus  
Development strategy emphasizes comprehensive problem-solving rather than feature expansion, targeting complete transport management ecosystem coverage.

## **47. Market Trend Tracking Mechanisms**

Market Intelligence Structure

| Tool | Description |
| :---- | :---- |
| Product Analytics Department | Continuous problem interviews with current and potential clients, feature request pipeline |
| Dedicated Product Managers | Competitive update analysis, regulatory change tracking (Ministry of Transport, Federal Tax Service, FSTEK) |
| Lean Workshops | Discovery sprint format: hypothesis → prototype → client pilot ≤6 weeks |

Systematic Market Research  
Structured approach to market intelligence ensures platform development remains aligned with industry needs and regulatory changes.

Rapid Innovation Cycle  
Lean methodology enables quick validation and implementation of new concepts based on real market feedback.

## **48. Industry Event Participation**

Strategic Event Presence  
USAUTO participates in key industry conferences (TransRussia, "NEVA", others) while maintaining digital marketing and content marketing as primary lead generation channels.

Networking and Validation Focus  
Exhibitions utilized primarily for idea validation and networking with technology partners rather than direct sales generation.

Digital-First Strategy  
Primary marketing emphasis on digital channels with industry events supporting strategic relationship development and market intelligence gathering.

## **49. Partner and Referral Programs**

Current Partner Pilot  
Active pilot agreements with agents attracting targeted traffic. Compensation models include fixed CPA per application or percentage of client revenue.

Future Referral Platform  
Planned comprehensive referral system features:

* Personal UTM-link generation  
* Dedicated tracking dashboard for earnings monitoring  
* Automated payment processing  
* Launch scheduled within next two years

Partnership Development  
Growing partner ecosystem designed to expand market reach while maintaining service quality through strategic relationship management.

## **50. Professional Recognition, Awards, and Status**

Government Registries and Benefits

* Russian Software Registry inclusion: Confirms domestic software status facilitating government sector procurement  
* Skolkovo resident status: Provides tax benefits (VAT exemption on core products) and access to fund expertise support

Industry Achievements

* Winner: Regional track of "Transport and Logistics" accelerator (2024)  
* Finalist: "Best IT Solution for Fleet Management" competition by AutransInform magazine (2025)  
* Certification in progress: ISO/IEC 27001 (information security) and ISO 9001 (quality management) target completion Q4 2025

Strategic Recognition Value  
Government registry inclusion and industry awards establish credibility and facilitate market expansion while demonstrating platform reliability through official recognition.

Competitive Advantage  
Professional recognition provides competitive differentiation in government procurement and enterprise sales while validating technical excellence and business viability.

## **51. Economic Impact for Your Company**

Quantifiable Performance Improvements  
USAUTO platform delivers substantial cost and efficiency benefits for transport companies through measurable operational enhancements:

| Metric | Without US AUTO | With US AUTO | Savings |
| :---- | :---- | :---- | :---- |
| Documentation processing time | 30-60 min/vehicle | 5-10 min/vehicle | Up to 85% |
| Fines for overdue documents | 40-100,000 RUB/year | 0 RUB | 100% |
| Vehicle downtime due to documentation | 2-5 days/year per vehicle | None | 100% |
| Administrative expenses | 10-15,000 RUB/month | ~3,000 RUB/month | Up to 80% |

Demonstrable ROI  
These quantifiable economic improvements significantly enhance client profitability and operational performance, providing measurable return on investment through reduced operational costs, eliminated penalties, and improved fleet utilization rates.

Operational Efficiency Gains  
Time savings in documentation processing translate to increased vehicle availability and driver productivity, while elimination of downtime and fines directly impacts bottom-line financial performance.

## **52. USAUTO Digital Ecosystem: Value, Advantages and Principles**

Core Client Value Proposition

* Delegation of routine administrative tasks  
* Reduction of administrative overhead costs  
* Guaranteed regulatory compliance assurance  
* Improved fleet operational efficiency

Market Pain Points → USAUTO Solutions

* Lengthy medical examination organization → Online cabinet with outsourced paramedics  
* "Headache" of route sheets → Fully automated electronic route sheets  
* Dispersed data systems → Unified databases of vehicles, drivers, and legal entities  
* Risk of paperwork errors → Digital templates with validation  
* Inefficient administrative processes → End-to-end workflows  
* Constant legislative changes → Over-the-air (OTA) regulation updates

Platform Competitive Advantages

* Elimination of in-house medical and mechanic staff requirements  
* 100% paperless route document processing  
* Single-click fleet management interface  
* Outsourcing of key personnel (medic, mechanic)  
* Automated filling of logs and reports

Operational Framework

* Comprehensive 24×7 cloud system architecture  
* Outsourced medical point and mechanic services  
* Legal compliance control and monitoring

Business Economic Impact

* Salary fund reduction through outsourced services  
* Minimization of fine risks and penalties  
* Increased employee productivity metrics  
* Flexible tariffs based on vehicle count and contract duration

User Experience and Flexibility

* Fully web-oriented solution accessible anywhere  
* Automated documentation generation  
* Easy onboarding with 15-minute training sessions

Support and Service Infrastructure

* 24×7 platform access guarantee  
* Personal client manager assignment  
* Three Moscow offices plus federal expansion capabilities

Technical Expertise and Infrastructure

* 3 years of specialized expertise in electronic route sheets  
* Interdisciplinary team: IT + medical + transport professionals  
* Patented proprietary software solutions  
* Skolkovo resident status with associated benefits

Market Trust Indicators

* 2,000+ active clients across sectors  
* Dominant >1-year contract model demonstrating satisfaction  
* Partnerships with specialized medical institutions  
* Integrations with popular enterprise systems

Client Engagement Philosophy

* Full openness and transparency in all operations  
* Legally formalized services and licenses  
* Personalized consulting and training programs  
* Regular updates ensuring compliance with new laws

Ecosystem Integration Benefits  
The comprehensive digital ecosystem creates synergistic effects where optimization of individual processes automatically improves related operations, resulting in multiplicative efficiency gains and transformative management model improvements for transport enterprises.



ДОПОЛНИТЕЛЬНЫЕ ИНСТРУКЦИИ:
- При ответе всегда ссылайтесь на конкретную информацию из базы знаний
- Если вопрос касается нескольких аспектов, объедините релевантную информацию
- Предлагайте дополнительную помощь, если это уместно
- Поддерживайте позитивный тон общения

--- Dynamic Page Summaries ---

## Какую машину купить для работы в такси комфорт в 2025?

**URL:** https://putevye-listy.ru/blog/kakuyu-mashinu-kupit-dlya-raboty-v-taksi-komfort

**Summary Content:**
Выбор автомобиля для работы в такси комфорт в 2025 году требует учета ключевых критериев: комфорт пассажиров, экономичность и надежность. Автомобиль должен обеспечивать просторный салон, качественную отделку и современные системы безопасности. Экономичность, включая низкий расход топлива и доступность запчастей, снижает эксплуатационные расходы и увеличивает прибыль. Надежность транспортного средства минимизирует риски простоев и внеплановых ремонтов, что особенно важно в условиях городского трафика. Важно также соответствие автомобиля требованиям лицензирования и технического контроля для легальной эксплуатации. Рекомендуемые модели: Toyota Camry (расход 7.5 л/100 км, высокая надежность), Hyundai Elantra (6.8 л/100 км, современные системы безопасности), Skoda Octavia (6.5 л/100 км, удобный салон) и KIA K5 (7.0 л/100 км, комфортная подвеска). Правильное оформление документов и регулярный технический контроль критически важны для успешной работы. Методология выбора включает анализ требований, изучение рынка, тест-драйв и проверку документации. Соблюдение новых законодательных норм, касающихся безопасности и технического состояния, гарантирует легальную работу и повышает доверие клиентов. Полный обзор доступен на сайте: https://putevye-listy.ru/blog/kakuyu-mashinu-kupit-dlya-raboty-v-taksi-komfort

**Metadata:**
- Intent: Узнать, какую машину купить для работы в такси комфорт
- Taxonomy: Автомобильный рынок, такси, выбор автомобиля
- Audience: Водители такси, владельцы автопарков
- Keywords: такси комфорт, выбор автомобиля, экономичность, надежность, комфорт

---`;

// ============ METADATA ============
// Total knowledge base entries: 1
// 
// TOKEN BREAKDOWN:
// - Custom instruction tokens: 483
// - Dynamic page tokens: 390
// - Subtotal (without internal KB): 873
// - Internal company KB tokens: ${INTERNAL_COMPANY_KB_TOKENS} (added separately by token-utils)
// 
// IMPORTANT: totalTokenCount in SystemPromptConfig does NOT include INTERNAL_COMPANY_KB_TOKENS
// Internal KB tokens are added during calculations in token-utils.ts
// 
// Last updated: 2025-10-24T17:28:27.567Z
