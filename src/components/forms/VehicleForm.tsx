
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

// Updated year range to include 2025
const YEARS = Array.from({ length: 36 }, (_, i) => (2025 - i).toString());

// Updated car makes list
const MAKES = [
  "ACURA", "ALFA ROMEO", "ASTON MARTIN", "AUDI", "BENTLEY", "BMW", "BUICK", 
  "BYD", "CADILLAC", "CHEVROLET", "CHRYSLER", "DODGE", "FERRARI", "FIAT", 
  "FORD", "GENESIS", "GMC", "HONDA", "HYUNDAI", "INFINITI", "JAGUAR", 
  "JEEP", "KARMA", "KIA", "LAMBORGHINI", "LAND ROVER", "LEXUS", "LINCOLN", 
  "LOTUS", "MASERATI", "MAZDA", "MCLAREN", "MERCEDES BENZ", "MINI", 
  "MITSUBISHI", "NISSAN", "PORSCHE", "RAM", "ROLLS ROYCE", "SMART", 
  "SUBARU", "TESLA", "TOYOTA"
];

// Expanded models by make
const MODELS_BY_MAKE: Record<string, string[]> = {
  "ACURA": ["ILX", "MDX", "RDX", "RLX", "TLX", "NSX", "Integra"],
  "ALFA ROMEO": ["Giulia", "Stelvio", "Tonale", "4C"],
  "ASTON MARTIN": ["DB11", "DB12", "DBS", "Vantage", "DBX", "Valkyrie"],
  "AUDI": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8"],
  "BENTLEY": ["Bentayga", "Continental GT", "Flying Spur", "Mulliner"],
  "BMW": ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X3", "X5", "X7", "iX", "i4", "i7", "Z4", "M2", "M3", "M4", "M5"],
  "BUICK": ["Enclave", "Encore", "Envision", "LaCrosse", "Regal"],
  "BYD": ["Atto 3", "Han", "Tang", "Seal", "Dolphin"],
  "CADILLAC": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "LYRIQ", "CELESTIQ"],
  "CHEVROLET": ["Blazer", "Bolt", "Camaro", "Colorado", "Corvette", "Equinox", "Malibu", "Silverado", "Suburban", "Tahoe", "Trailblazer", "Traverse"],
  "CHRYSLER": ["300", "Pacifica", "Voyager"],
  "DODGE": ["Challenger", "Charger", "Durango", "Hornet"],
  "FERRARI": ["296", "SF90", "F8", "Roma", "Portofino", "812", "Purosangue"],
  "FIAT": ["500", "500X"],
  "FORD": ["Bronco", "EcoSport", "Edge", "Escape", "Expedition", "Explorer", "F-150", "F-250", "Maverick", "Mustang", "Mustang Mach-E", "Ranger", "Transit"],
  "GENESIS": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "GMC": ["Acadia", "Canyon", "Hummer EV", "Sierra", "Terrain", "Yukon"],
  "HONDA": ["Accord", "Civic", "CR-V", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Ridgeline"],
  "HYUNDAI": ["Elantra", "Ioniq", "Ioniq 5", "Ioniq 6", "Kona", "Palisade", "Santa Cruz", "Santa Fe", "Sonata", "Tucson", "Venue"],
  "INFINITI": ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
  "JAGUAR": ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "XE", "XF"],
  "JEEP": ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wagoneer", "Wrangler"],
  "KARMA": ["GS-6", "Revero", "GSe-6"],
  "KIA": ["Carnival", "EV6", "Forte", "K5", "Niro", "Rio", "Seltos", "Sorento", "Soul", "Sportage", "Stinger", "Telluride"],
  "LAMBORGHINI": ["Aventador", "Huracan", "Urus", "Revuelto"],
  "LAND ROVER": ["Defender", "Discovery", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  "LEXUS": ["ES", "GX", "IS", "LC", "LS", "LX", "NX", "RX", "UX", "RZ"],
  "LINCOLN": ["Aviator", "Corsair", "Nautilus", "Navigator"],
  "LOTUS": ["Emira", "Evija", "Eletre"],
  "MASERATI": ["Ghibli", "Grecale", "Levante", "MC20", "Quattroporte"],
  "MAZDA": ["CX-30", "CX-5", "CX-9", "CX-50", "CX-90", "Mazda3", "Mazda6", "MX-5 Miata"],
  "MCLAREN": ["Artura", "720S", "765LT", "GT"],
  "MERCEDES BENZ": ["A-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "EQE", "EQS", "G-Class", "AMG GT"],
  "MINI": ["Cooper", "Clubman", "Countryman", "Convertible", "Electric"],
  "MITSUBISHI": ["Eclipse Cross", "Mirage", "Outlander", "Outlander Sport"],
  "NISSAN": ["Altima", "Armada", "Frontier", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa"],
  "PORSCHE": ["911", "718 Boxster", "718 Cayman", "Cayenne", "Macan", "Panamera", "Taycan"],
  "RAM": ["1500", "2500", "3500", "ProMaster"],
  "ROLLS ROYCE": ["Cullinan", "Dawn", "Ghost", "Phantom", "Spectre", "Wraith"],
  "SMART": ["EQ fortwo"],
  "SUBARU": ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "Solterra", "WRX"],
  "TESLA": ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  "TOYOTA": ["4Runner", "86", "Avalon", "bZ4X", "Camry", "Corolla", "Highlander", "Land Cruiser", "Mirai", "Prius", "RAV4", "Sequoia", "Sienna", "Supra", "Tacoma", "Tundra", "Venza"]
};

// Extended trims by model
const TRIMS_BY_MODEL: Record<string, string[]> = {
  // Acura
  "MDX": ["Base", "Technology", "A-Spec", "Advance", "Type S"],
  "RDX": ["Base", "Technology", "A-Spec", "Advance"],
  
  // Audi
  "A4": ["Premium", "Premium Plus", "Prestige", "S4"],
  "Q5": ["Premium", "Premium Plus", "Prestige", "SQ5"],
  
  // BMW
  "3 Series": ["330i", "330e", "M340i", "M3"],
  "X5": ["sDrive40i", "xDrive40i", "xDrive45e", "M50i", "X5M"],
  
  // Chevrolet
  "Silverado": ["WT", "Custom", "LT", "RST", "LTZ", "High Country", "ZR2"],
  "Equinox": ["LS", "LT", "RS", "Premier"],
  "Corvette": ["Stingray", "Z06", "Grand Sport", "ZR1"],
  
  // Ford
  "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Raptor", "Tremor"],
  "Mustang": ["EcoBoost", "GT", "Mach 1", "Shelby GT500", "Dark Horse"],
  "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor"],
  
  // Honda
  "Accord": ["LX", "Sport", "Sport SE", "EX-L", "Sport 2.0T", "Touring", "Hybrid"],
  "Civic": ["LX", "Sport", "EX", "Touring", "Si", "Type R"],
  "CR-V": ["LX", "EX", "EX-L", "Sport", "Sport Touring", "Hybrid"],
  
  // Jeep
  "Wrangler": ["Sport", "Sport S", "Sahara", "Rubicon", "Rubicon 392", "4xe"],
  "Grand Cherokee": ["Laredo", "Limited", "Trailhawk", "Overland", "Summit", "SRT", "Trackhawk"],
  
  // Lexus
  "RX": ["RX 350", "RX 350 F Sport", "RX 350L", "RX 450h", "RX 450h F Sport", "RX 500h"],
  "ES": ["ES 250", "ES 350", "ES 300h", "F Sport"],
  
  // Mercedes-Benz
  "C-Class": ["C 300", "C 300 4MATIC", "AMG C 43", "AMG C 63", "AMG C 63 S"],
  "E-Class": ["E 350", "E 450", "AMG E 53", "AMG E 63 S"],
  
  // Tesla
  "Model 3": ["Standard Range", "Long Range", "Performance"],
  "Model Y": ["Long Range", "Performance"],
  
  // Toyota
  "Camry": ["LE", "SE", "XLE", "XSE", "TRD", "Hybrid LE", "Hybrid SE", "Hybrid XLE"],
  "RAV4": ["LE", "XLE", "XLE Premium", "Adventure", "TRD Off-Road", "Limited", "Hybrid LE", "Hybrid XLE", "Hybrid XSE", "Hybrid Limited", "Prime SE", "Prime XSE"],
  "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "TRD Pro"],
  "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794 Edition", "TRD Pro", "Capstone"],
  
  // Subaru
  "Outback": ["Base", "Premium", "Onyx Edition", "Limited", "Touring", "Wilderness"],
  "Forester": ["Base", "Premium", "Sport", "Limited", "Touring", "Wilderness"],
  
  // Many more trims can be added for other models
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
