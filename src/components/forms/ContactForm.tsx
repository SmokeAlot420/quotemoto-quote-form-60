
import { useQuoteForm } from "@/context/QuoteFormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

const ContactForm = () => {
  const { formData, updateContactInfo, prevStep, submitForm } = useQuoteForm();
  const { contactInfo } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate first name
    if (!contactInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    // Validate last name
    if (!contactInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Validate phone number (simple validation)
    const phoneRegex = /^\d{10}$/;
    const cleanedPhone = contactInfo.phone.replace(/[^\d]/g, "");
    if (!cleanedPhone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(cleanedPhone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactInfo.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(contactInfo.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate ZIP code (simple 5-digit US ZIP)
    const zipRegex = /^\d{5}$/;
    if (!contactInfo.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
      isValid = false;
    } else if (!zipRegex.test(contactInfo.zipCode)) {
      newErrors.zipCode = "Please enter a valid 5-digit ZIP code";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContactInfo()) {
      submitForm();
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof contactInfo, value: string) => {
    updateContactInfo({ [field]: value });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="form-section-appear">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-insurance-text mb-2">Contact Information</h2>
        <p className="text-insurance-text-light">
          We're almost done! Please provide your contact details to get your personalized quote.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className={errors.firstName ? "text-red-500" : ""}>
              First Name
            </Label>
            <Input
              id="firstName"
              value={contactInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className={errors.lastName ? "text-red-500" : ""}>
              Last Name
            </Label>
            <Input
              id="lastName"
              value={contactInfo.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className={errors.phone ? "text-red-500" : ""}>
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 555-5555"
              value={contactInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="youremail@example.com"
              value={contactInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode" className={errors.zipCode ? "text-red-500" : ""}>
              ZIP Code
            </Label>
            <Input
              id="zipCode"
              placeholder="12345"
              value={contactInfo.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className={errors.zipCode ? "border-red-500" : ""}
              maxLength={5}
            />
            {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-6">
            By submitting this form, you agree to our privacy policy and consent to be contacted about insurance products. 
            Message and data rates may apply. Message frequency varies. Reply STOP to opt-out.
          </p>
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="border-gray-300"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>

            <Button
              type="submit"
              className="bg-insurance-primary hover:bg-insurance-primary/90"
            >
              <Send size={16} className="mr-2" />
              Get My Free Quote
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
