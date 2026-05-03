# SuccessCasting Session Resume — 2026-05-03

## Current production state
- Project: `/opt/successcasting-factory`
- Repo: `https://github.com/Geowahaha/successcasting.com.git`
- Branch: `main`
- Production server: `root@43.128.75.149`
- Docker service: `factory-api`
- Latest production health check before session close: `healthy`

## Latest completed work
Implemented and deployed the back-office AI Improvement Agent requested by the user.

Latest pushed commit before this handoff note:
- `358b32a feat: add AI answer improvement agent`

This handoff note itself should be committed after creation as:
- `docs(handoff): save SuccessCasting AI improvement agent resume`

## What the AI Improvement Agent does
The backend now has a dedicated role/skill:
- `successcasting-ai-improvement-agent`
- status: `active`

It runs after customer chat turns and stores quality analysis for each answer:
- detects answers that are not smart enough
- detects off-target or stale-context answers
- detects generic repeated contact/lead-capture answers
- flags unsupported price/delivery/warranty/certainty claims
- checks whether the answer is grounded in existing KB
- creates human-review/pending suggestions instead of auto-inserting unverified facts

Important principle:
- Fact-only / no guessing / no hallucination.
- New knowledge suggestions stay `pending_review` until approved. Do not auto-promote generated content into production KB.

## New DB tables
Added in `app/main.py` via `init_db()`:
- `ai_agent_skills`
- `ai_improvement_reviews`
- `ai_knowledge_improvement_suggestions`

Also creates `agent_tasks` entries with:
- `task_type = ai_answer_quality_review`

## Topic-boxed knowledge design
The improvement agent classifies each turn into topic boxes so retrieval stays light and precise:
- `pulley`
- `material`
- `process`
- `rfq`
- `pricing_policy`
- `delivery_policy`
- `document_drawing`
- `maintenance_failure`
- `contact_sales`
- `general`

## Scores stored per review
`ai_improvement_reviews` stores:
- `answer_quality_score`
- `relevance_score`
- `grounding_score`
- `completeness_score`
- `hallucination_risk`
- `off_target_risk`
- `non_smart_risk`
- `needs_human_review`
- `topic_box`
- `issue_tags_json`
- `evidence_json`

## Admin/internal endpoint added
- `GET /api/admin/ai-improvement/reviews?limit=...`

Internal verification returned:
```json
{
  "status": "ready",
  "agent": "successcasting-ai-improvement-agent",
  "reviews": 3,
  "suggestions": 3,
  "skills": 1
}
```

## Latest live verification
Browser live chat test against:
- `https://www.successcasting.com/?v=improvement-agent`

Test message:
- `มู่เลย์ร่อง A กับ B ต่างกันยังไง ใช้กับโรงสีข้าวแบบไหน`

Result:
- HTTP 200
- mode: `local-brain`
- answer was relevant to A/B pulley groove and rice mill context
- review stored after chat

Latest DB verification after browser test:
```json
{
  "ai_agent_skills": 1,
  "ai_improvement_reviews": 7,
  "ai_knowledge_improvement_suggestions": 4,
  "latest_skill": [
    {
      "skill_slug": "successcasting-ai-improvement-agent",
      "status": "active"
    }
  ],
  "latest_review": [
    {
      "topic_box": "pulley",
      "answer_quality_score": 91,
      "needs_human_review": 0
    }
  ]
}
```

## Deploy commands already run
After code patch:
```bash
cd /opt/successcasting-factory
python3 -m py_compile app/main.py
docker-compose build factory-api
docker rm -f factory-api
docker-compose up -d factory-api
# waited until factory-api health = healthy
```

## Git state before this handoff note
Latest commits:
```text
358b32a feat: add AI answer improvement agent
88d5f6d fix: suppress repeated chat welcome in active sessions
752d4df feat: add pulley expert knowledge and marketplace chat links
e099e97 fix: prioritize current chat intent over stale RFQ memory
```

Untracked backup/assets remain and were intentionally not cleaned:
```text
.env.bak.20260502085853
.env.bak.20260502101436
.env.bak.20260502101511
.env.bak.20260502101608
.env.bak.20260502105036
app/success-logo3.png
app/video-fly.mp4
backups/
docker-compose.yml.bak.20260502101436
```

Do not cleanup these unless the user explicitly approves. Earlier cleanup was blocked.

## Next time user returns
Recommended quick resume steps:
1. Read this file: `docs/handoff/SUCCESSCASTING_SESSION_RESUME_2026-05-03.md`
2. Verify current production health:
   ```bash
   ssh -i /home/factory/.ssh/hermes_key -o StrictHostKeyChecking=no root@43.128.75.149 'docker inspect -f "{{.State.Health.Status}}" factory-api'
   ```
3. Check latest git:
   ```bash
   ssh -i /home/factory/.ssh/hermes_key -o StrictHostKeyChecking=no root@43.128.75.149 'cd /opt/successcasting-factory && git log --oneline -5 && git status --short'
   ```
4. If continuing the improvement agent work, focus on:
   - admin UI for reviewing `ai_knowledge_improvement_suggestions`
   - approval workflow to promote verified facts into `ai_knowledge_documents`
   - better external research pipeline with citations/source URLs
   - per-topic KB boxes and retrieval weighting

## Secrets policy
Never print or commit tokens, passwords, API keys, LINE secrets, GitHub tokens, Cloudflare keys, or admin credentials. Use `[REDACTED]` only.
