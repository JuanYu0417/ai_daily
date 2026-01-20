# AI Daily Trend Collector
AI Daily is a fully automated tool for tracking AI technology trends. It utilizes GitHub Actions to daily fetch trending AI-related repositories (covering LLM, Agent, and Generative AI) from GitHub, leverages the Google Gemini model to generate bilingual summaries (English and Chinese), and ultimately compiles them into a Markdown daily report.

## Key Features

🔍 Smart Fetching: Automatically searches for trending GitHub repositories based on keywords (e.g., llm, agent, generative-ai).  
🤖 AI Summarization: Integrates the Google Gemini model (supports gemini-2.5-flash) to generate precise "Bilingual Summaries (English & Chinese)" and "Why it matters" for each repository.  
📝 Automatic Archiving: Automatically saves results as Markdown files (archived by date in the daily/ directory).  
📧 Email Notifications: Supports sending daily reports via SMTP (Work in Progress).  
⚙️ Flexible Configuration: Supports custom model versions (via environment variables) and search keywords.

## Tech Stack
Runtime: Node.js  
CI/CD: GitHub Actions (Cron Job)  
LLM Provider: Google Gemini API  
Data Source: GitHub Search API

## Quick Start

### Run Locally
Install Dependencies
```bash
npm install
```

Configure Environment Variables Create a .env file in the project root directory (refer to .env.example):

```javascript

# Required Configuration
GITHUB_TOKEN=your_github_pat_token
GEMINI_API_KEY=your_google_ai_studio_key

# Optional Configuration (Defaults to gemini-2.5-flash)
LLM_MODEL=gemini-2.5-flash

# Email Configuration (Ignore if email sending is not required)
FEATURE_EMAIL=
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=
```

Run the Script
```bash
npm start
```
### GitHub Actions Deployment (Recommended)

This project is designed to run automatically on GitHub.

- Fork this repository to your GitHub account.
- Go to repository Settings -> Secrets and variables -> Actions.  
- Click New repository secret to add the following secrets:  
  GEMINI_API_KEY: Your Google Gemini API Key  
  EMAIL_USER / EMAIL_PASS ... : (If email functionality is needed).

**Note**: GITHUB_TOKEN is automatically built-in by GitHub and does not need to be added manually.

**(Optional)** Click Variables to add configuration variables:

    LLM_MODEL: Set the model version, e.g., gemini-2.5-flash or gemini-1.5-pro.   
    If not set, the code defaults to gemini-2.5-flash.

Enable Workflow:

Go to the Actions tab and enable the AI Daily Calendar workflow. It will run automatically every day at 08:00 UTC.

### Project Structure

```text
ai-daily-calendar/    
├─ .github/    
│  └─ workflows/    
│       └─ daily.yml          # GitHub Actions automation workflows    
│
├─ src/  
│  ├─ index.js                  # Pipeline Orchestrator  
│  │
│  ├─ config/  
│  │  └─ default.json       # topics / stars / language  
│  │
│  ├─ collectors/  
│  │  └─ githubCollector.js # GitHub Search API  
│  │
│  ├─ processors/  
│  │  ├─ filter.js          
│  │  └─ rank.js
│  │
│  ├─ llm/  
│  │  ├─ prompt.js            # Gemini AI prompts  
│  │  └─ summarizer.js      # Gemini AI interface  
│  │
│  ├─ generators/  
│  │  ├─ markdown.js        # Markdown generators  
│  │  └─ email.js           # Email generators  
│  │
│  ├─ services/  
│  │  ├─ git.js             # commit & push  
│  │  └─ mailer.js          # SMTP (nodemailer)  
│  │
│  └─ utils/  
│     ├─ logger.js  
│     └─ date.js  
│
├─ daily/  
│  └─ 2026-01-15.md         # Archived daily Markdown reports  
│
├─ .env.example  
├─ package.json  
└─ README.mdaily  
```

## License

ISC
