
import { useQuoteForm } from "@/context/QuoteFormContext";
import { cn } from "@/lib/utils";

const ProgressBar = () => {
  const { formData, goToStep } = useQuoteForm();
  const { currentStep } = formData;
  
  const steps = [
    { number: 1, label: "Vehicles" },
    { number: 2, label: "Drivers" },
    { number: 3, label: "Coverage" },
    { number: 4, label: "Contact" },
  ];

  const calculateProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  return (
    <div className="mb-8">
      <div className="relative pt-1">
        <div className="flex mb-2 justify-between">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="text-center"
              onClick={() => {
                // Allow clicking on completed steps or the next step
                if (step.number <= currentStep || step.number === currentStep + 1) {
                  goToStep(step.number);
                }
              }}
            >
              <div
                className={cn(
                  "w-9 h-9 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-all duration-300",
                  step.number === currentStep
                    ? "bg-insurance-primary text-white"
                    : step.number < currentStep
                    ? "bg-insurance-secondary text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step.number < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div
                className={cn(
                  "mt-2 text-sm",
                  step.number <= currentStep ? "text-insurance-primary font-medium" : "text-gray-500"
                )}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
        <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
          <div
            style={{ width: `${calculateProgress()}%` }}
            className="step-indicator bg-insurance-secondary transition-all duration-300"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
