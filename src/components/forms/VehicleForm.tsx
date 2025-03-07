
import { useQuoteForm, Vehicle, VehicleUsage } from "@/context/QuoteFormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

// Mock data - in a real app these would come from an API
const YEARS = Array.from({ length: 35 }, (_, i) => (2024 - i).toString());
const MAKES = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Kia", "Hyundai"];
const MODELS_BY_MAKE: Record<string, string[]> = {
  Toyota: ["Corolla", "Camry", "RAV4", "Highlander", "Prius"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  Ford: ["F-150", "Escape", "Explorer", "Mustang", "Focus"],
  Chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe", "Traverse"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
  Audi: ["A4", "A6", "Q5", "Q7", "A8"],
  Kia: ["Forte", "Optima", "Sorento", "Sportage", "Telluride"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade"],
};

const TRIMS_BY_MODEL: Record<string, string[]> = {
  Corolla: ["L", "LE", "SE", "XLE", "XSE"],
  Camry: ["L", "LE", "SE", "XLE", "XSE"],
  Civic: ["LX", "Sport", "EX", "Touring"],
  Accord: ["LX", "Sport", "EX", "Touring"],
  Mustang: ["EcoBoost", "GT", "Mach 1", "Shelby GT500"],
  // More trims can be added here
};

const VehicleForm = () => {
  const { formData, updateVehicle, addVehicle, removeVehicle, nextStep } = useQuoteForm();
  const { vehicles } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateVehicles = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    vehicles.forEach((vehicle) => {
      if (!vehicle.year) {
        newErrors[`${vehicle.id}-year`] = "Year is required";
        isValid = false;
      }
      if (!vehicle.make) {
        newErrors[`${vehicle.id}-make`] = "Make is required";
        isValid = false;
      }
      if (!vehicle.model) {
        newErrors[`${vehicle.id}-model`] = "Model is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step button
  const handleNext = () => {
    if (validateVehicles()) {
      nextStep();
    }
  };

  // Get available models based on selected make
  const getModelsForMake = (make: string) => {
    return make ? MODELS_BY_MAKE[make] || [] : [];
  };

  // Get available trims based on selected model
  const getTrimsForModel = (model: string) => {
    return model ? TRIMS_BY_MODEL[model] || [] : [];
  };

  return (
    <div className="form-section-appear">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-insurance-text mb-2">Vehicle Information</h2>
        <p className="text-insurance-text-light">Please provide details for each vehicle you'd like to insure.</p>
      </div>

      {vehicles.map((vehicle, index) => (
        <Card key={vehicle.id} className="mb-6 border-insurance-accent shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Car className="mr-2 text-insurance-primary" />
                <h3 className="text-lg font-medium">Vehicle {index + 1}</h3>
              </div>
              {vehicles.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVehicle(vehicle.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${vehicle.id}-year`}>Year</Label>
                <Select
                  value={vehicle.year}
                  onValueChange={(value) => updateVehicle(vehicle.id, { year: value })}
                >
                  <SelectTrigger id={`${vehicle.id}-year`} className={errors[`${vehicle.id}-year`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`${vehicle.id}-year`] && (
                  <p className="text-xs text-red-500">{errors[`${vehicle.id}-year`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${vehicle.id}-make`}>Make</Label>
                <Select
                  value={vehicle.make}
                  onValueChange={(value) => {
                    // When make changes, reset model and trim
                    updateVehicle(vehicle.id, { make: value, model: "", trim: "" });
                  }}
                >
                  <SelectTrigger id={`${vehicle.id}-make`} className={errors[`${vehicle.id}-make`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAKES.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`${vehicle.id}-make`] && (
                  <p className="text-xs text-red-500">{errors[`${vehicle.id}-make`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${vehicle.id}-model`}>Model</Label>
                <Select
                  value={vehicle.model}
                  onValueChange={(value) => {
                    // When model changes, reset trim
                    updateVehicle(vehicle.id, { model: value, trim: "" });
                  }}
                  disabled={!vehicle.make}
                >
                  <SelectTrigger id={`${vehicle.id}-model`} className={errors[`${vehicle.id}-model`] ? "border-red-500" : ""}>
                    <SelectValue placeholder={vehicle.make ? "Select Model" : "Select Make First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getModelsForMake(vehicle.make).map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`${vehicle.id}-model`] && (
                  <p className="text-xs text-red-500">{errors[`${vehicle.id}-model`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${vehicle.id}-trim`}>Trim (Optional)</Label>
                <Select
                  value={vehicle.trim || ""}
                  onValueChange={(value) => updateVehicle(vehicle.id, { trim: value })}
                  disabled={!vehicle.model}
                >
                  <SelectTrigger id={`${vehicle.id}-trim`}>
                    <SelectValue placeholder={vehicle.model ? "Select Trim" : "Select Model First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getTrimsForModel(vehicle.model).map((trim) => (
                      <SelectItem key={trim} value={trim}>
                        {trim}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`${vehicle.id}-usage`}>Vehicle Usage</Label>
                <Select
                  value={vehicle.usage}
                  onValueChange={(value) => updateVehicle(vehicle.id, { usage: value as VehicleUsage })}
                >
                  <SelectTrigger id={`${vehicle.id}-usage`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Rideshare">Rideshare (Uber, Lyft, etc.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={addVehicle}
          className="border-insurance-primary text-insurance-primary hover:bg-insurance-primary hover:text-white"
        >
          <Plus size={16} className="mr-2" />
          Add Another Vehicle
        </Button>

        <Button 
          onClick={handleNext}
          className="bg-insurance-primary hover:bg-insurance-primary/90"
        >
          Continue to Drivers
        </Button>
      </div>
    </div>
  );
};

export default VehicleForm;
