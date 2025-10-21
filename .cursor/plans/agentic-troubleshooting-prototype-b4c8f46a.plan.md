<!-- b4c8f46a-eaf1-4f5c-b648-48276aea9e50 62198a71-5a28-48eb-9583-14cc5526e50f -->
# Chat-Based Agentic Troubleshooting Prototype

## Overview

Build an inline chat experience where the agent converses with the user directly on the dashboard. The agent autonomously works through troubleshooting steps with rich micro-interactions, loading states, and animations that make the experience feel real and responsive.

## Success Criteria

- Chat conversation completes in ≤90 seconds in auto-mode
- Every agent action has a visible animation or loading state
- Smooth transitions make the agent feel "alive" and working
- User approval gates feel natural and conversational
- Full audit log with structured events and export

## Explicit Out-of-Scope

- No real bank API calls or actual transfer modifications
- No PII handling or authentication  
- Single scripted flow only (missing transfer scenario)
- No multi-issue routing or dynamic conversation trees

## Experience Flow

**Initial State**: Dashboard with search input at top

**User Action**: Types "My transfer is missing" and submits

**Transitions**:
1. Dashboard cards fade out and scroll up (0.3s)
2. User message appears as bubble on right side (0.2s slide-in)
3. Input field smoothly slides to bottom of viewport (0.4s ease-out)
4. Typing indicator appears (animated dots)
5. Agent message appears: "I'll help you locate that transfer..."
6. Plan card fades in with 5-6 numbered steps (0.5s staggered)
7. Each step executes with micro-animations:
   - Status changes from → to ⏳ to ✓
   - Text updates ("Checking...", "Found!", "Complete")
   - Progress indicators for longer steps
   - Smooth color transitions
8. Approval gates: agent pauses, shows buttons, waits
9. Merchant tasks: conversational prompt with checkbox
10. Resolution: success message with summary

## Core Animation Patterns

### Message Entrance
- Slide up + fade in (200ms ease-out)
- Stagger multiple messages by 100ms each
- Bounce on final position (subtle spring)

### Typing Indicator
- 3 animated dots
- Pulse animation (0.6s loop)
- Appears 300ms before message

### Step Status Changes
- Icon morph animation (spinner → checkmark)
- Color transition (blue → green, 300ms)
- Scale pulse on completion (1.0 → 1.05 → 1.0)

### Loading States
- Skeleton shimmer for text being "generated"
- Progress bars for multi-second operations
- Spinner rotation with easing

### User Interaction
- Button hover: scale(1.02) + brightness increase
- Click: scale(0.98) ripple effect
- Checkbox: checkmark draw animation (400ms)

## Implementation Plan

### 1. Create Chat Message System

**File**: `lib/chat-types.ts`

```typescript
export type MessageRole = "user" | "agent" | "system";
export type MessageType = "text" | "plan" | "step-update" | "approval-request" | "merchant-task" | "success";

export type Message = {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: number;
  data?: {
    steps?: Step[];
    stepId?: string;
    status?: StepStatus;
    requiresAction?: boolean;
  };
};

export type StepStatus = "pending" | "working" | "complete" | "failed";

export type Step = {
  id: string;
  number: number;
  title: string;
  description: string;
  status: StepStatus;
  duration?: number; // estimated ms
  requiresApproval?: boolean;
  requiresMerchantAction?: boolean;
};
```

### 2. Build Chat Message Components

**File**: `components/chat/ChatMessage.tsx`
- User message bubble (right-aligned, gray background)
- Agent message bubble (left-aligned, subtle border)
- Typing indicator component
- Smooth entrance animations

**File**: `components/chat/PlanCard.tsx`
- Numbered step list
- Each step shows icon (→ pending, ⏳ working, ✓ complete)
- Expandable descriptions
- Staggered entrance animation

**File**: `components/chat/StepProgress.tsx`
- Inline status updates within messages
- Progress bar for long operations
- Animated icon transitions
- Text that updates ("Checking..." → "Found 3 transfers")

**File**: `components/chat/ApprovalPrompt.tsx`
- Conversational approval request
- "Approve" and "Decline" buttons
- Button hover/click animations
- Disabled state after selection

**File**: `components/chat/MerchantTask.tsx`
- Friendly prompt ("Please check your bank app...")
- Checkbox with label "I've confirmed"
- Checkmark draw animation on complete
- Continue button (enabled after check)

### 3. Build Chat Container

**File**: `components/chat/ChatContainer.tsx`

**Layout**:
```
┌─────────────────────────────┐
│   Dashboard Cards (fade)   │
├─────────────────────────────┤
│                             │
│   Chat Messages             │
│   - User bubble             │
│   - Agent response          │
│   - Plan card               │
│   - Step updates            │
│   - Approval gates          │
│   (auto-scroll to bottom)   │
│                             │
├─────────────────────────────┤
│   Input (fixed bottom)      │
│   [Ask anything...] [Send]  │
└─────────────────────────────┘
```

**Features**:
- Auto-scroll as messages appear
- Smooth scroll behavior (300ms)
- Message list with proper spacing
- Ref management for scroll anchor

### 4. Update Main Dashboard Page

**File**: `app/page.tsx`

**State Management**:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [isAgentWorking, setIsAgentWorking

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