export const TIMINGS = {
  // Message animations
  messageEnter: 200,
  messageStagger: 100,
  typingIndicator: 300,
  thinkingBadge: 150,
  
  // Agent thinking delays (randomized for realism)
  thinkingMin: 2000,
  thinkingMax: 6000,
  
  // Step execution
  quickStep: 1500,  // e.g., "Checking connection"
  mediumStep: 2500, // e.g., "Analyzing transfers"
  longStep: 3500,   // e.g., "Processing request"
  
  // Status updates
  statusMessageDelay: 800,
  statusTransition: 300,
  
  // Interactions
  buttonHover: 150,
  buttonClick: 100,
  checkboxCheck: 400,
  
  // Transitions
  dashboardFade: 300,
  inputSlide: 400,
  scrollSmooth: 300,
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

