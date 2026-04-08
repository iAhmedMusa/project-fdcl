const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Products' },
    { num: 3, label: 'Photos' },
    { num: 4, label: 'Review' },
];

export default function StepIndicator({ current }) {
    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2">
            {steps.map((step, i) => {
                const isCompleted = current > step.num;
                const isCurrent = current === step.num;

                return (
                    <div key={step.num} className="flex items-center gap-1 sm:gap-2">
                        {/* Circle */}
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-9 sm:w-9 sm:text-sm ${
                                isCompleted
                                    ? 'bg-gold text-navy'
                                    : isCurrent
                                      ? 'bg-gold text-navy'
                                      : 'border border-white/20 text-white/40'
                            }`}
                        >
                            {isCompleted ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            ) : (
                                step.num
                            )}
                        </div>
                        {/* Label (hidden on small screens) */}
                        <span
                            className={`hidden text-xs font-medium sm:inline ${
                                isCurrent || isCompleted ? 'text-white' : 'text-white/40'
                            }`}
                        >
                            {step.label}
                        </span>
                        {/* Connector */}
                        {i < steps.length - 1 && (
                            <div
                                className={`h-px w-6 sm:w-10 ${
                                    isCompleted ? 'bg-gold' : 'bg-white/10'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
