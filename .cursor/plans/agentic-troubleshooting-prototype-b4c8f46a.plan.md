<!-- b4c8f46a-eaf1-4f5c-b648-48276aea9e50 62198a71-5a28-48eb-9583-14cc5526e50f -->
# Agentic Troubleshooting Flow Prototype

## Architecture Overview

Build `/troubleshoot/missing-transfer` route with dual-mode operation (interactive + auto-play), localStorage persistence, and Cursor-inspired agent UI within the existing dashboard theme.

## Success Criteria

- Auto-play demo completes start-to-resolution in ≤90 seconds
- 100% of steps expose Explain, Pause, and Undo controls
- Full audit log with structured events, timestamps, and JSON export

## Explicit Out-of-Scope

- No real bank API calls or actual transfer modifications
- No PII handling or authentication
- Single scripted flow only (missing transfer scenario)
- No multi-issue routing or dynamic conversation trees

## Audit & Instrumentation

Track these events in the ledger:

- `flow_started`, `step_started`, `step_completed`, `step_paused`, `step_resumed`
- `approval_requested`, `approval_granted`, `approval_denied`
- `merchant_task_started`, `merchant_task_completed`, `merchant_task_skipped`
- `step_undone`, `autoplay_toggled`, `flow_completed`, `flow_reset`

## Implementation Steps

### 1. Create Core Types and Mock Data

Create `lib/agent-types.ts` with production-ready types:

```typescript
export type StepStatus = "planned" | "working" | "paused" | "needs_approval" | "waiting_merchant" | "done" | "undone";

export type Step = {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  reversible: boolean;
  requiresApproval?: boolean;
  requiresMerchantAction?: boolean;
  explain?: string;
};

export type LedgerEntry = {
  ts: number;
  event: string;
  stepId?: string;
  meta?: Record<string, unknown>;
};

export type Flow = {
  id: "missing-transfer";
  title: string;
  steps: Step[];
  mode: "interactive" | "autoplay";
  startedAt?: number;
  completedAt?: number;
  ledger: LedgerEntry[];
};

export const LS_KEY = "sq_agent_flow_v1";
```

Mock the 7-step scripted flow:

1. Draft plan
2. Verify linked bank
3. Review recent transfers
4. Check processing windows
5. Requeue transfer (requires approval)
6. Merchant bank check (requires merchant action)
7. Summary + audit log

### 2. Build Agent Step Card Component

Create `components/agent/AgentStepCard.tsx`:

- Visual states: progress spinner, checkmark, alert icon
- Status pill display (In Progress / Completed / Needs Approval / Awaiting Merchant)
- Action buttons: Approve, Decline, Undo, Pause, Explain
- Expandable explanation panel
- Smooth fade/slide animations using Tailwind
- Match dashboard dark theme (#1a1a1a cards, #2a2a2a accents)

### 3. Build Progress Timeline Component

Create `components/agent/ProgressTimeline.tsx`:

- Left gutter display showing all steps at a glance
- Step numbering (1-6) with connecting lines
- Current step highlight
- Completed steps with checkmarks
- Click to jump to step (in interactive mode)

### 4. Create Agent Control Bar

Create `components/agent/AgentControlBar.tsx`:

- Auto-play toggle switch with label
- Playback speed selector (0.5x, 1x, 2x) for demos
- Global pause button
- Reset conversation button
- "View Transcript" button for audit log

### 5. Build Main Troubleshooting Page

Create `app/troubleshoot/missing-transfer/page.tsx`:

- Reuse sidebar from main dashboard (`app/page.tsx` lines 53-131)
- Header with "Troubleshooting: Missing Transfer" title
- Center content area with agent conversation flow
- AgentControlBar at top
- ProgressTimeline in left gutter
- Sequential rendering of AgentStepCard components
- State management using React hooks

### 6. Implement State Management Logic

Within `app/troubleshoot/missing-transfer/page.tsx`:

- `useState` for conversation state
- `useEffect` for localStorage persistence (key: `agent-conversation-state`)
- Auto-play logic with `setTimeout` for step progression (2-4 second delays)
- Handle user actions: approve, decline, undo, pause, explain
- Undo stack maintaining action history

### 7. Create the 6-Phase Conversation Flow

Implement the exact flow from specification:

1. Diagnosis start: "I'll check your recent transfers..."
2. Fetching data: "Checking linked bank account… verifying settlement times…"
3. Decision point (approval): "I can contact your bank to confirm ACH status. Proceed?"
4. Merchant task: "Please open your bank app to confirm deposits..."
5. Undo demo: User clicks undo → "Bank verification cancelled"
6. Resolution: "Transfer found. Delay caused by weekend processing..."

### 8. Build Transcript Modal

Create `components/agent/TranscriptModal.tsx`:

- Overlay modal showing audit log
- Timestamped action list
- Step details with user approvals/declines
- Export button (copies to clipboard)
- Close with ESC key

### 9. Add Navigation Entry Point

Update `app/page.tsx`:

- Add "Troubleshoot transfer" card in the main content area
- Match styling of existing cards (lines 242-409)
- Use AlertCircle or HelpCircle icon
- Link to `/troubleshoot/missing-transfer`

### 10. Polish and Refinements

- Add micro-interactions (hover states, smooth transitions)
- Ensure keyboard accessibility (Tab navigation, Enter to confirm)
- Test auto-play timing for demo narrative flow
- Add loading skeletons for step transitions
- Verify localStorage persists across refresh

## Key Technical Decisions

**State Architecture**: Single source of truth in parent component, props down to children, callbacks up for actions.

**Styling**: Maintain dashboard dark theme (#0a0a0a background, #1a1a1a cards, #2a2a2a buttons) but add agent-specific elements (status pills with color coding: blue=working, green=completed, yellow=approval, purple=merchant action).

**Animations**: Use Tailwind transitions with framer-motion for step entrance (optional, can use CSS only).

**Mock Timing**: Auto-play delays should feel realistic (2s for data fetch, 1s for simple checks, 4s for "analysis" steps).

## Files to Create

- `lib/agent-types.ts`
- `components/agent/AgentStepCard.tsx`
- `components/agent/ProgressTimeline.tsx`
- `components/agent/AgentControlBar.tsx`
- `components/agent/TranscriptModal.tsx`
- `app/troubleshoot/missing-transfer/page.tsx`

## Files to Modify

- `app/page.tsx` (add navigation card)

### To-dos

- [ ] Create agent types and mock conversation data in lib/agent-types.ts
- [ ] Build AgentStepCard component with all action buttons and states
- [ ] Create ProgressTimeline component for step overview
- [ ] Build AgentControlBar with auto-play toggle and controls
- [ ] Create troubleshooting page with state management and localStorage
- [ ] Implement 6-phase conversation flow with auto-play logic
- [ ] Build TranscriptModal for audit log display
- [ ] Add troubleshooting card to main dashboard page
- [ ] Add animations, keyboard accessibility, and final refinements