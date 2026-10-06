# Exam Portal — Practice Smarter. Perform Better.

**Exam Portal** is a production-quality Computer Based Test (CBT) practice platform built for competitive examination aspirants (SSC, Banking, Railways, UPSC/State PSCs, Entrance Exams).

It allows students and teachers to upload MCQ question papers in **PDF**, **Word (DOC/DOCX)**, or **Text** formats, automatically extracts questions, options, and answer keys, and converts them into an interactive, real-time CBT mock test experience.

---

## 🌟 Key Features

1. **Document Upload & Smart MCQ Extraction**
   - Direct PDF, DOCX, DOC, and raw text upload.
   - Robust pattern recognition for multiple MCQ formats (Standard A/B/C/D, (1)/(2)/(3)/(4), separate answer keys, solutions).
   - Extraction confidence scoring (`High confidence`, `Needs review`).

2. **Interactive Question Validation & Review**
   - In-browser editor to refine question text, options, and correct answers before generating the test.
   - Add custom questions, reorder, or remove items.

3. **Configurable Exam Engine**
   - Custom test duration with real-time countdown timer.
   - Question subset selection (All, 25, 50, 75, 100, Custom).
   - Marks per question (+1, +2, +3, +4).
   - Configurable negative marking (-0.25, -0.33, -0.5, -1.0).
   - Random question order and option shuffling.

4. **Authentic CBT Exam Interface**
   - Modeled after real competitive examinations (SSC CGL / IBPS / RRB).
   - Dynamic Question Palette with real status colors:
     - 🟢 **Answered** (Green)
     - 🔴 **Not Answered** (Red)
     - 🟣 **Marked for Review** (Purple)
     - 🔵 **Answered & Marked for Review** (Indigo with purple border)
     - ⚪ **Not Visited** (Grey)
   - Real-time countdown timer with 10m, 5m, and 1m warnings.
   - Automatic submission on timer expiration.
   - Continuous autosave and session recovery on browser refresh.

5. **Instant Result Processing & Scoring Engine**
   - Precise competitive exam score calculation with negative marking deductions.
   - Accuracy rate, speed metrics (average time per question), and scorecards.
   - Question distribution chart (Correct, Incorrect, Unanswered).
   - Filterable question-wise review with detailed solution explanations.

6. **Comprehensive Test Library & History**
   - Full history of all attempts with score trends.
   - Retake functionality creating new attempt records.
   - Duplicate, edit, and delete created mock exams.
   - Dark mode & light mode toggle.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or pnpm / yarn

### Installation
```bash
# Clone the repository and navigate to folder
cd exam_portal

# Install dependencies
npm install

# Run unit tests for scoring logic
npm test

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture & File Structure

```text
exam_portal/
├── app/
│   ├── api/
│   │   └── documents/
│   │       ├── upload/route.ts      # Multi-format document parser endpoint
│   │       └── sample/route.ts      # Sample question papers endpoint
│   ├── create/
│   │   ├── page.tsx                 # Drag & drop upload & processing
│   │   ├── review/page.tsx          # Question validation & editing
│   │   └── setup/page.tsx           # Duration & negative marking config
│   ├── dashboard/
│   │   └── page.tsx                 # User workspace & quick actions
│   ├── exam/
│   │   └── [examId]/
│   │       ├── instructions/page.tsx # Mock test instructions & CBT rules
│   │       └── page.tsx             # Core CBT test interface & palette
│   ├── exams/
│   │   └── page.tsx                 # "My Exams" library
│   ├── history/
│   │   └── page.tsx                 # Attempt history & score records
│   ├── profile/
│   │   └── page.tsx                 # Candidate preferences & stats
│   ├── globals.css                  # Design system & CBT status styles
│   ├── layout.tsx                   # Main layout & Toast provider
│   └── page.tsx                     # Product landing page
├── components/
│   ├── exam/
│   │   └── SubmitModal.tsx          # Submission confirmation summary modal
│   ├── Navbar.tsx                   # Top navigation with dark mode toggle
│   ├── Footer.tsx                   # Platform footer
│   ├── ThemeToggle.tsx              # Dark/light theme switcher
│   └── Toast.tsx                    # Non-intrusive toast notifications
├── lib/
│   ├── parser/
│   │   └── extractor.ts             # Heuristic regex & format normalizer
│   ├── scoring/
│   │   └── engine.ts                # Score, negative penalty & accuracy engine
│   └── storage/
│       ├── localStore.ts            # Client-safe state & session sync
│       └── mockData.ts              # Pre-packaged competitive exam papers
├── tests/
│   └── scoring.test.js              # Unit tests for scoring engine
└── types/
    └── index.ts                     # TypeScript definitions
```

---

## 🧪 Testing

Run test suite:
```bash
npm test
```

---

## 📄 License
MIT License. Created for competitive exam practice.
