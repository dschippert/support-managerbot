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

      {/* Failed transfer details */}
      <div className="px-3 border flex items-center" style={{ borderColor: '#E3E3E3', backgroundColor: '#FBFBFB', height: '48px', borderRadius: '12px' }}>
        <div className="flex items-center justify-between text-sm w-full">
          <span className="text-gray-900">
            <span className="font-semibold">$4,719.57</span>
            <span className="font-normal text-gray-600"> on Oct 15, 2025</span>
          </span>
          <span className="inline-flex items-center gap-1 text-red-600">
            ⚠ Reversed by bank
          </span>
        </div>
      </div>

      {/* Additional text before "Here's what I'll do" */}
      <div>
        <p className="text-sm text-gray-900 leading-relaxed">
          I can start a new ACH to get it back on track.
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
