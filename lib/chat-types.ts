export type MessageRole = "user" | "agent" | "system";
export type MessageType = 
  | "text" 
  | "plan" 
  | "step-update" 
  | "approval-request" 
  | "approval-actions"
  | "merchant-actions"
  | "merchant-task" 
  | "success" 
  | "thinking";

export type Message = {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: number;
  thinkingTime?: number; // milliseconds
  data?: {
    steps?: Step[];
    stepId?: string;
    status?: StepStatus;
    requiresAction?: boolean;
    thinkingDetails?: string[]; // what agent "considered"
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
  result?: string; // e.g., "Bank connected • First National Bank"
};

// Initial steps for missing transfer flow
export const createInitialSteps = (): Step[] => [
  {
    id: "verify-bank",
    number: 1,
    title: "Verify linked bank account",
    description: "Checking your bank connection health and authentication...",
    status: "pending",
    duration: 2200,
    result: "Bank connected • First National Bank"
  },
  {
    id: "check-transfers",
    number: 2,
    title: "Review recent transfers",
    description: "Comparing settlement queue with bank's pending depo...",
    status: "pending",
    duration: 2800,
    result: "Found 3 transfers in past 7 days"
  },
  {
    id: "check-processing",
    number: 3,
    title: "Check processing windows",
    description: "Analyzing weekend, holiday, and bank-specific delays...",
    status: "pending",
    duration: 2400,
    result: "Weekend delay detected"
  },
  {
    id: "requeue-transfer",
    number: 4,
    title: "Requeue the transfer",
    description: "Submitting a request to attempt the transfer again...",
    status: "pending",
    requiresApproval: true,
    result: "Transfer requeue initiated"
  },
  {
    id: "merchant-confirm",
    number: 5,
    title: "Merchant bank confirmation",
    description: "Manual step required: open bank app and confirm pending...",
    status: "pending",
    requiresMerchantAction: true,
    result: "Deposit confirmed by merchant"
  },
  {
    id: "resolution",
    number: 6,
    title: "Resolution summary",
    description: "Transfer requeued. Estimated deposit on Oct 25.",
    status: "pending",
    duration: 0,
    result: "Resolution complete"
  }
];

