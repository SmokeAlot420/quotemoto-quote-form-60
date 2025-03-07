
import { QuoteFormProvider, useQuoteForm } from "@/context/QuoteFormContext";
import ProgressBar from "@/components/forms/ProgressBar";
import VehicleForm from "@/components/forms/VehicleForm";
import DriverForm from "@/components/forms/DriverForm";
import CoverageForm from "@/components/forms/CoverageForm";
import ContactForm from "@/components/forms/ContactForm";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// This is the form container that will display the appropriate form based on the current step
const QuoteFormContainer = () => {
  const { formData } = useQuoteForm();
  const { currentStep } = formData;

  // Display the appropriate form based on the current step
  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return <VehicleForm />;
      case 2:
        return <DriverForm />;
      case 3:
        return <CoverageForm />;
      case 4:
        return <ContactForm />;
      default:
        return <VehicleForm />;
    }
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <ProgressBar />
      {renderForm()}
    </div>
  );
};

// Main page component
const Index = () => {
  return (
    <div className="insurance-gradient-bg min-h-screen py-8 md:py-12">
      <div className="container px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-insurance-text mb-4">
            Get a Quote – Fast & Easy Auto Insurance
          </h1>
          <p className="text-lg text-insurance-text-light max-w-2xl mx-auto">
            Save time and money on your auto insurance with QuoteMoto. Complete our simple form to get your personalized quote in minutes.
          </p>
        </header>

        <div className="insurance-form-container mx-auto p-4 md:p-8">
          <QuoteFormProvider>
            <QuoteFormContainer />
          </QuoteFormProvider>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center max-w-md">
            <ShieldCheck className="text-insurance-primary mb-3 h-8 w-8" />
            <h3 className="text-xl font-semibold mb-2">Why Choose QuoteMoto?</h3>
            <ul className="list-disc pl-5 text-insurance-text-light">
              <li>Customized coverage tailored to your needs</li>
              <li>Compare rates from multiple top-rated carriers</li>
              <li>Save up to 35% on your auto insurance</li>
              <li>Licensed agents ready to help 24/7</li>
            </ul>
            <Button 
              className="mt-4 bg-insurance-secondary hover:bg-insurance-secondary/90"
              onClick={() => {
                const formContainer = document.querySelector('.insurance-form-container');
                if (formContainer) {
                  formContainer.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Get Started Now
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md">
            <h3 className="text-xl font-semibold mb-3">Our Customers Say</h3>
            <div className="mb-4">
              <div className="flex text-yellow-400 mb-1">
                {'★'.repeat(5)}
              </div>
              <p className="italic text-insurance-text-light">
                "I saved over $500 a year with QuoteMoto! The form was easy to fill out and I had my quote in minutes. Highly recommend!"
              </p>
              <p className="mt-2 font-medium">— Sarah T.</p>
            </div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {'★'.repeat(5)}
              </div>
              <p className="italic text-insurance-text-light">
                "Great experience overall. The process was simple and the customer service was top-notch. I'll definitely be sticking with QuoteMoto."
              </p>
              <p className="mt-2 font-medium">— Michael R.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
