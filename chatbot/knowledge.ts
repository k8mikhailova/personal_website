/**
 * ASK KATE — KNOWLEDGE BASE (temporary, version 0)
 *
 * Everything the chatbot is allowed to know about Kate. It is sent to the model
 * with every request, so:
 *   - Only include information that is fine to be public.
 *   - No personal contact details, private conversations, application history,
 *     or confidential company/client information.
 *   - Keep it reasonably short (a few pages at most) to keep each request cheap.
 *
 * This is a small placeholder built from Kate's starting facts plus details that
 * are already published on the portfolio site. Replace or expand any section
 * freely; it's plain Markdown inside a template string. The model is told to
 * treat anything not written here as unknown.
 */
export const knowledge = `
## Education
- B.S. in Computer Science, University of California, Santa Cruz (Baskin School of Engineering). Graduated spring 2026 (June 2026).
- Studied abroad at Alliance Manchester Business School, University of Manchester (September 2024 – January 2025). Coursework there included Operations Management, Business Analytics, Strategy, Digital Transformation, and Marketing Analytics.

## Experience

### InfoMomentum — Founder / AI & Automation Specialist (Jan 2024 – Jul 2026)
- A small marketing business Kate founded during college, focused on performance marketing, CRM automation, and AI tools.
- Built and maintained CRM systems and automations, connecting different tools through APIs and Zapier.
- Set up email and SMS workflows, managed integrations, and tested that data moved correctly between systems.
- Built and experimented with AI agents for ad performance reporting and for checking email sequences for errors.

### Antforce.AI — AI Solutions & Marketing Intern (Mar 2026 – Jun 2026)
- Worked with a team on AI productivity tools, content workflows, and analytics.
- Worked on an AI-powered Marketing Hub for content creation and SEO/GEO workflows, including organizing the information and context the system used.
- Built a live analytics dashboard her manager used daily, making reporting turnaround roughly 4x faster.
- Worked on internal AI productivity tools: automated meeting summaries, executive-assistant agents using OpenClaw, and reusable Claude skills.
- This team work is separate from Kate's independent Marketing Intelligence Hub project.

### Overture Maps Foundation — Data Engineering / AI Intern (Jan 2026 – Mar 2026)
- Used Python, SQL, pandas, and DuckDB to analyze large datasets and investigate inconsistencies in place information.
- Tested rule-based and machine-learning-assisted approaches for resolving conflicting attributes.
- Led parts of the testing process; the team's accuracy improved from 64% to 83%.
- Code: https://github.com/project-terraforma/ResolvePOI-Attribute-Conflation
- A detailed case study is planned but not published yet.

### Arcadian Investments — Software Engineering Intern (Jul 2024 – Sep 2024)
- Built StockAdvisor (see Projects).

### Women of Color on the Move — Security Analyst Volunteer (Aug 2026 – present)
- Recently started volunteering to learn more about protecting software, systems, and data.
- No completed security projects to describe yet.

## Projects

### StockAdvisor
- A Python/Streamlit stock-analysis application built during the Arcadian Investments internship.
- Retrieves financial market data through an API, scores stocks, runs historical strategy simulations, and sends automated email reports.
- Live demo: https://stockadvisor.streamlit.app/
- Video demo: https://youtu.be/vEshZVmSw44
- Code: https://github.com/k8mikhailova/StockAdvisor

### Marketing Intelligence Hub
- An independent prototype (not built for an InfoMomentum client) that analyzes marketing performance, customer signals, and creative opportunities, and uses AI agent workflows to suggest experiments.
- Built with Python and Streamlit. All of its data is simulated.
- Live demo: https://kate-marketing-intelligence.streamlit.app/
- Code: https://github.com/k8mikhailova/marketing_hub

## Skills and tools
- Software development: Python, SQL, Git, REST APIs, Streamlit.
- Data and evaluation: pandas, DuckDB, data processing, data validation, model evaluation.
- AI and automation: LLM applications, AI agent workflows, prompt engineering, workflow automation.
- Engineering and integration: system integration, testing and debugging, rapid prototyping, requirements gathering, technical documentation.

## Interests
- Kate is interested in work that combines software, AI, data, business problems, and experimentation.

## Portfolio site
- Home page (/): introduction, experience timeline with projects, skills, and education.
- About page (/about): a more personal introduction and photos.
- Contact page (/contact): the way to get in touch with Kate, plus her resume.
`.trim()
