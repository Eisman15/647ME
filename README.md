# IFN647 — Interactive Exam Trainer

A self-contained, browser-based practice exam for **IFN647 Advanced Information Retrieval** (QUT). Every question is rebuilt from the course reviewer (weeks 2–12) and lecture set, organised into the five course modules. It mirrors the real exam format: **13 questions / 45 marks** (Q1–5 short answer, Q6–13 problem-solving, some Python).

## Features
- **49 practice items** across all 5 modules — concept "which is FALSE" traps, true/false, hand-calculations, short answer and Python code.
- **Instant marking** with tolerant numeric matching (accepts `0.667`, `2/3`, `66.7%`, etc.) and worked step-by-step solutions.
- **Self-graded** short-answer / code questions with explicit "marks are for hitting…" checklists.
- **Mock exam mode** — pulls a fresh 13-question paper in exam order (5 short + 8 problem-solving).
- **Live IR-style HUD** — marks won, accuracy, attempted — with progress saved in your browser (`localStorage`).
- Filter by module or question type; shuffle; reset.
- Maths rendered with MathJax; no build step, no dependencies to install.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page structure + styling |
| `exam-data.js` | The question bank |
| `exam.js` | App logic (rendering, marking, scoring, persistence) |

## Run it locally
Just open `index.html` in a browser — or serve the folder:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages
1. Create a new repository and upload these three files (keep them in the repo root).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select your branch (e.g. `main`) and folder **/ (root)**, then **Save**.
5. After a minute, your trainer is live at `https://<your-username>.github.io/<repo-name>/`.

## Adding or editing questions
Open `exam-data.js` and add an object to the `BANK` array. Supported `kind` values:
- `mc` — multiple choice: `options`, `correct` (index), `explain`
- `tf` — true/false: `answer` (boolean), `explain`
- `calc` — numeric: `accept` (array of acceptable answers), `steps`, `model`
- `short` / `code` — self-graded: `model`, optional `keypoints` and `notes`

Common fields: `id`, `module` (1–5), `week`, `marks`, `diff`, `prompt`. Wrap maths in `\( … \)`.

---
*Practice aid only — always verify against the official course resources.*
