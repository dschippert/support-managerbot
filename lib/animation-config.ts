export const TIMINGS = {
  // Message animations
  messageEnter: 300,
  messageStagger: 120,
  typingIndicator: 500,
  thinkingBadge: 200,
  
  // Agent thinking delays (randomized for realism)
  thinkingMin: 2500,
  thinkingMax: 4500,
  
  // Step execution
  quickStep: 1800,  // e.g., "Checking connection"
  mediumStep: 2800, // e.g., "Analyzing transfers"
  longStep: 3800,   // e.g., "Processing request"
  
  // Status updates
  statusMessageDelay: 1200,
  statusTransition: 400,
  
  // Interactions
  buttonHover: 200,
  buttonClick: 150,
  checkboxCheck: 500,
  
  // Transitions
  dashboardFade: 400,
  inputSlide: 500,
  scrollSmooth: 400,
};

export const EASING = {
  entrance: "ease-out",
  exit: "ease-in",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// Thinking time generator (random but realistic)
export const getThinkingTime = () => {
  return Math.floor(Math.random() * (TIMINGS.thinkingMax - TIMINGS.thinkingMin) + TIMINGS.thinkingMin);
};

// Generate random thinking details
export const getThinkingDetails = (context: string): string[] => {
  const details: Record<string, string[]> = {
    initial: [
      "Checking account permissions",
      "Analyzing transaction history", 
      "Comparing settlement patterns",
      "Reviewing bank connection status"
    ],
    planning: [
      "Identifying troubleshooting steps",
      "Prioritizing diagnostic checks",
      "Estimating resolution time",
      "Preparing status updates"
    ],
    analyzing: [
      "Comparing transfer timestamps",
      "Checking processing windows",
      "Validating bank schedules",
      "Cross-referencing settlement data"
    ],
    finalizing: [
      "Confirming transfer status",
      "Preparing resolution summary",
      "Generating audit log",
      "Calculating deposit timeline"
    ]
  };
  
  return details[context] || details.initial;
};

