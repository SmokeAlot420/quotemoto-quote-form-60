
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="insurance-gradient-bg min-h-screen py-8 md:py-16">
      <div className="container px-4 max-w-3xl mx-auto">
        <div className="insurance-form-container p-8 text-center">
          <ShieldCheck className="h-16 w-16 mx-auto text-insurance-primary mb-6" />
          
          <h1 className="text-3xl md:text-4xl font-bold text-insurance-text mb-4">
            Thank You for Your Quote Request!
          </h1>
          
          <div className="bg-insurance-background p-6 rounded-lg mb-8">
            <p className="text-xl mb-4">
              Your request has been received and we're working on your personalized quote.
            </p>
            
            <div className="text-left mb-6">
              <h2 className="text-xl font-medium mb-3">What happens next?</h2>
              <ol className="list-decimal ml-5 space-y-2 text-insurance-text-light">
                <li>One of our licensed agents will review your information.</li>
                <li>We'll prepare a personalized quote based on your needs.</li>
                <li>You'll receive your quote via email shortly.</li>
                <li>An agent may call you to discuss your coverage options.</li>
              </ol>
            </div>
            
            <div className="p-4 border border-insurance-primary rounded-md bg-blue-50 text-insurance-primary mt-6">
              <p className="font-medium">
                Have questions? Call us directly at (888) 555-MOTO
              </p>
            </div>
          </div>
          
          <Link to="/">
            <Button
              variant="outline"
              className="border-insurance-primary text-insurance-primary hover:bg-insurance-primary hover:text-white"
            >
              <ArrowLeft size={16} className="mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
