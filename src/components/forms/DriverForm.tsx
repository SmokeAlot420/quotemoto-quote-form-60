
import { useQuoteForm, Driver, LicenseStatus } from "@/context/QuoteFormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";

// Generate age options from 18 to 75+
const AGE_OPTIONS = [
  ...Array.from({ length: 58 }, (_, i) => (i + 18).toString()),
  "76+",
];

const DriverForm = () => {
  const { formData, updateDriver, addDriver, removeDriver, nextStep, prevStep } = useQuoteForm();
  const { drivers } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateDrivers = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    drivers.forEach((driver) => {
      if (!driver.age) {
        newErrors[`${driver.id}-age`] = "Age is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step button
  const handleNext = () => {
    if (validateDrivers()) {
      nextStep();
    }
  };

  return (
    <div className="form-section-appear">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-insurance-text mb-2">Driver Information</h2>
        <p className="text-insurance-text-light">Please provide details for each driver in your household.</p>
      </div>

      {drivers.map((driver, index) => (
        <Card key={driver.id} className="mb-6 border-insurance-accent shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <User className="mr-2 text-insurance-primary" />
                <h3 className="text-lg font-medium">Driver {index + 1}</h3>
              </div>
              {drivers.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDriver(driver.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${driver.id}-age`}>Age</Label>
                <Select
                  value={driver.age}
                  onValueChange={(value) => updateDriver(driver.id, { age: value })}
                >
                  <SelectTrigger id={`${driver.id}-age`} className={errors[`${driver.id}-age`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Age" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_OPTIONS.map((age) => (
                      <SelectItem key={age} value={age}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`${driver.id}-age`] && (
                  <p className="text-xs text-red-500">{errors[`${driver.id}-age`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${driver.id}-licenseStatus`}>License Status</Label>
                <Select
                  value={driver.licenseStatus}
                  onValueChange={(value) => updateDriver(driver.id, { licenseStatus: value as LicenseStatus })}
                >
                  <SelectTrigger id={`${driver.id}-licenseStatus`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Valid">Valid</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Permit">Permit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${driver.id}-incidents`} className="text-base">
                    Any Accidents, Tickets, or DUI in the Last 3 Years?
                  </Label>
                  <Switch
                    id={`${driver.id}-incidents`}
                    checked={driver.hasIncidents}
                    onCheckedChange={(checked) => updateDriver(driver.id, { hasIncidents: checked })}
                  />
                </div>
                {driver.hasIncidents && (
                  <p className="text-sm text-amber-600 mt-2">
                    Having incidents may affect your quote. Our agent will discuss options with you.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            className="border-gray-300"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          
          <Button
            variant="outline"
            onClick={addDriver}
            className="border-insurance-primary text-insurance-primary hover:bg-insurance-primary hover:text-white"
          >
            <Plus size={16} className="mr-2" />
            Add Another Driver
          </Button>
        </div>

        <Button 
          onClick={handleNext}
          className="bg-insurance-primary hover:bg-insurance-primary/90"
        >
          Continue to Coverage
        </Button>
      </div>
    </div>
  );
};

export default DriverForm;
