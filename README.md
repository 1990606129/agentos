# AgentOS — Real Estate Platform Prototype

A complete, original real-estate / agent-OS web platform built as a **marketing prototype**. Inspired by the structure of a modern brokerage tech stack (an "Agent OS" with command center, AI co-pilot, community hub, global referral, virtual world, and CRM of choice), rebuilt from scratch under neutral demo branding.

> **Demo data only.** Listings, agents, and prices are realistic but fictional. Not real MLS data. Not affiliated with any brokerage.

## Live site

Deployed via GitHub Pages — temp URL added after deploy.

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero + search, featured listings, Agent OS section, agent recruiting CTA |
| Browse listings | `listings.html` | Filter by city, type, beds, price; sort; save favorites |
| Listing detail | `listing.html?id=` | Gallery, specs, features, map, AI offer guidance, agent card |
| Agent OS | `tech.html` | All six products (MyAgentOS, MIRA, Community Hub, Global Referral, Virtual World, CRM of Choice) + App Hub |
| Find an agent | `agents.html` | Searchable agent directory |
| Agent profile | `agent.html?id=` | Stats, bio, social, listings, referral CTA |
| Sell | `sell.html` | Instant home-value estimator |
| Join | `join.html` | Commission model, equity, academy, application form |
| About | `about.html` | Company, values, careers, contact |
| Log in / Sign up | `login.html`, `signup.html` | Working client-side auth |
| Dashboard | `dashboard.html` | MyAgentOS command center (gated): KPIs, pipeline, production, saved homes, MIRA chat |

## Demo login

- **Email:** `demo@agentos.demo`
- **Password:** `demo1234`

(Or create a new account — stored locally in your browser.)

## Architecture

Pure static site — runs anywhere, deploys to GitHub Pages with zero build step.

```
agentos-site/
├── index.html, listings.html, listing.html, tech.html,
│   agents.html, agent.html, sell.html, join.html, about.html,
│   login.html, signup.html, dashboard.html, 404.html
└── assets/
    ├── css/styles.css      # shared design system
    └── js/
        ├── data.js         # seed: 24 listings + 12 agents
        ├── db.js           # data layer over localStorage (single seam to swap for a real backend)
        ├── auth.js         # session helpers for gated pages
        └── app.js          # shared nav/footer + listing-card rendering
```

### Swapping in a real backend

`assets/js/db.js` is the only file that touches data storage. Keep the method
signatures (`DB.listings()`, `DB.login()`, `DB.toggleFavorite()`, …) and replace
the bodies with calls to Supabase / Postgres / a REST API to go production.

## Run locally

```bash
cd agentos-site
python3 -m http.server 8080
# open http://localhost:8080
```

---

© 2026 AgentOS — marketing prototype. Demo data, not real listings. Equal Housing Opportunity.
