export type StepStatus = 
  | "planned" 
  | "working" 
  | "paused" 
  | "needs_approval" 
  | "waiting_merchant" 
  | "done" 
  | "undone";

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

// Mock scripted flow for missing transfer troubleshooting
export const createInitialFlow = (): Flow => ({
  id: "missing-transfer",
  title: "Troubleshoot Missing Transfer",
  mode: "interactive",
  steps: [
    {
      id: "plan",
      title: "Draft plan",
      description: "I'll outline the steps to locate your missing transfer. You can pause, undo, or stop at any point.",
      status: "planned",
      reversible: true,
      explain: "Plans are cheap; alignment is not. I want to make sure you understand what I'm about to do before I start."
    },
    {
      id: "bank-link",
      title: "Verify linked bank",
      description: "Checking your bank connection health and authentication status...",
      status: "planned",
      reversible: true,
      explain: "If the link is broken, nothing else matters. This step confirms I can see your bank account details."
    },
    {
      id: "transfers",
      title: "Review recent transfers",
      description: "Comparing Square settlement queue with your bank's pending deposits...",
      status: "planned",
      reversible: true,
      explain: "I'm looking at transfers initiated in the last 7 days to identify which one might be missing."
    },
    {
      id: "processing-window",
      title: "Check processing windows",
      description: "Analyzing weekend, holiday, and bank-specific delays...",
      status: "planned",
      reversible: true,
      explain: "Banks don't process ACH transfers on weekends or holidays. This checks if timing explains the delay."
    },
    {
      id: "requeue",
      title: "Requeue transfer",
      description: "Submit a re-disbursement request for the missing transfer.",
      status: "planned",
      reversible: true,
      requiresApproval: true,
      explain: "This touches money movement. I'll log the change and provide one-click undo if needed."
    },
    {
      id: "merchant-check",
      title: "Merchant bank confirmation",
      description: "Please open your bank app and confirm you see a pending ACH deposit from Square.",
      status: "planned",
      reversible: true,
      requiresMerchantAction: true,
      explain: "Human-in-the-loop confirmation. I need you to verify the deposit is showing up on your bank's end."
    },
    {
      id: "summary",
      title: "Resolution summary",
      description: "Transfer located and successfully requeued. Estimated deposit by Oct 22.",
      status: "planned",
      reversible: true,
      explain: "Final summary with outcome, next steps, and full audit log export."
    }
  ],
  ledger: []
});

// Auto-play timing configuration (in milliseconds)
export const AUTO_PLAY_TIMINGS = {
  plan: 1500,
  "bank-link": 2000,
  transfers: 2500,
  "processing-window": 2000,
  requeue: 1500, // approval wait time
  "merchant-check": 2500, // merchant task wait time
  summary: 1800
} as const;

