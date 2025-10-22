"use client";

interface ApprovalPromptProps {
  title: string;
  description: string;
  details?: string[];
  onApprove?: () => void;
  onDecline?: () => void;
  approveLabel?: string;
  declineLabel?: string;
}

export function ApprovalPrompt({ 
  title, 
  description, 
  details, 
  onApprove, 
  onDecline,
  approveLabel,
  declineLabel
}: ApprovalPromptProps) {

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-900 leading-relaxed">
          {title ? `${title}. ` : ''}{description}
        </p>
      </div>

      {details && details.length > 0 && (
        <div className="space-y-2 ml-0">
          <p className="text-sm text-gray-900">Here's what I'll do:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            {details.map((detail, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-900 leading-relaxed">
          If that sounds good, I'll go ahead and make these changes.
        </p>
      </div>

      {/* Actions moved outside bubble in ChatContainer */}
    </div>
  );
}
