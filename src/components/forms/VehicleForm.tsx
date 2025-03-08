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

// Extended trims by model with more comprehensive options
const TRIMS_BY_MODEL: Record<string, string[]> = {
  // Acura
  "MDX": ["Base", "Technology", "A-Spec", "Advance", "Type S", "Type S Advance"],
  "RDX": ["Base", "Technology", "A-Spec", "Advance", "PMC Edition"],
  "TLX": ["Base", "Technology", "A-Spec", "Advance", "Type S", "Type S Performance"],
  "Integra": ["Base", "A-Spec", "A-Spec Technology", "Type S"],
  
  // Audi
  "A4": ["Premium", "Premium Plus", "Prestige", "S4 Premium Plus", "S4 Prestige", "RS4"],
  "Q5": ["Premium", "Premium Plus", "Prestige", "SQ5 Premium Plus", "SQ5 Prestige", "Q5 Sportback", "SQ5 Sportback"],
  "A6": ["Premium", "Premium Plus", "Prestige", "S6 Premium Plus", "S6 Prestige", "RS6 Avant"],
  "Q7": ["Premium", "Premium Plus", "Prestige", "SQ7 Premium Plus", "SQ7 Prestige"],
  "e-tron": ["Premium", "Premium Plus", "Prestige", "S", "GT", "RS GT"],
  
  // BMW
  "3 Series": ["330i", "330i xDrive", "330e", "330e xDrive", "M340i", "M340i xDrive", "M3", "M3 Competition", "M3 CS"],
  "5 Series": ["530i", "530i xDrive", "540i", "540i xDrive", "550i", "550i xDrive", "M5", "M5 Competition", "M5 CS"],
  "X5": ["sDrive40i", "xDrive40i", "xDrive45e", "M50i", "X5 M", "X5 M Competition", "X5 M First Edition"],
  "7 Series": ["740i", "740i xDrive", "760i xDrive", "i7 eDrive50", "i7 xDrive60", "i7 M70"],
  "i4": ["eDrive35", "eDrive40", "xDrive40", "M50"],
  "iX": ["xDrive40", "xDrive50", "M60"],
  
  // Chevrolet
  "Silverado": ["WT", "Custom", "Custom Trail Boss", "LT", "RST", "LT Trail Boss", "LTZ", "High Country", "ZR2", "ZR2 Bison"],
  "Equinox": ["LS", "LT", "RS", "Premier", "LT EV", "RS EV", "Premier EV"],
  "Corvette": ["Stingray 1LT", "Stingray 2LT", "Stingray 3LT", "Z06 1LZ", "Z06 2LZ", "Z06 3LZ", "Grand Sport", "ZR1", "E-Ray"],
  "Tahoe": ["LS", "LT", "RST", "Z71", "Premier", "High Country"],
  "Blazer": ["LT", "RS", "Premier", "SS", "EV LT", "EV RS", "EV SS"],
  
  // Ford
  "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor", "Raptor R", "Lightning Pro", "Lightning XLT", "Lightning Lariat", "Lightning Platinum"],
  "Mustang": ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Mach 1", "Mach 1 Premium", "Shelby GT500", "Dark Horse", "Dark Horse Premium"],
  "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor", "Heritage Edition", "Heritage Limited Edition"],
  "Explorer": ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "King Ranch", "Platinum"],
  "Maverick": ["XL", "XLT", "Lariat", "Tremor", "Hybrid", "EcoBoost"],
  
  // Honda
  "Accord": ["LX", "Sport", "Sport SE", "EX-L", "Sport 2.0T", "Touring", "Hybrid Sport", "Hybrid EX-L", "Hybrid Touring"],
  "Civic": ["LX", "Sport", "EX", "EX-L", "Touring", "Si", "Type R", "Type R Limited Edition", "Type R Touring"],
  "CR-V": ["LX", "EX", "EX-L", "Sport", "Sport Touring", "Hybrid EX", "Hybrid EX-L", "Hybrid Sport", "Hybrid Sport Touring"],
  "Pilot": ["LX", "Sport", "EX-L", "TrailSport", "Touring", "Elite", "Black Edition"],
  "HR-V": ["LX", "Sport", "EX", "EX-L"],
  
  // Jeep
  "Wrangler": ["Sport", "Sport S", "Willys Sport", "Willys", "Sahara", "Rubicon", "Rubicon 392", "4xe Sahara", "4xe Rubicon", "High Altitude", "Freedom Edition"],
  "Grand Cherokee": ["Laredo", "Altitude", "Limited", "Trailhawk", "Overland", "Summit", "Summit Reserve", "SRT", "Trackhawk", "4xe Limited", "4xe Trailhawk", "4xe Overland", "4xe Summit", "4xe Summit Reserve"],
  "Gladiator": ["Sport", "Willys Sport", "Sport S", "Willys", "Mojave", "Rubicon", "High Altitude", "Farout", "Rubicon X"],
  "Cherokee": ["Latitude", "Latitude Plus", "Latitude Lux", "Trailhawk", "Limited", "High Altitude"],
  "Compass": ["Sport", "Latitude", "Latitude Lux", "Trailhawk", "Limited", "High Altitude"],
  
  // Lexus
  "RX": ["RX 350", "RX 350 F Sport", "RX 350L", "RX 450h", "RX 450h F Sport", "RX 500h", "RX 450h+", "RX 350h", "RX 350 F Sport Handling"],
  "ES": ["ES 250", "ES 250 F Sport", "ES 350", "ES 350 F Sport", "ES 300h", "ES 300h F Sport", "ES 300h Luxury", "ES 300h Ultra Luxury"],
  "NX": ["NX 250", "NX 350", "NX 350h", "NX 450h+", "NX 350 F Sport", "NX 450h+ F Sport"],
  "LS": ["LS 500", "LS 500 F Sport", "LS 500h", "LS 500h F Sport"],
  "LX": ["LX 600", "LX 600 Premium", "LX 600 F Sport", "LX 600 Luxury", "LX 600 Ultra Luxury"],
  
  // Mercedes-Benz
  "C-Class": ["C 300", "C 300 4MATIC", "AMG C 43", "AMG C 63", "AMG C 63 S", "C 300e", "C 350e"],
  "E-Class": ["E 350", "E 350 4MATIC", "E 450", "E 450 4MATIC", "AMG E 53", "AMG E 63 S", "E 350e", "E 450e"],
  "S-Class": ["S 500", "S 500 4MATIC", "S 580", "S 580 4MATIC", "AMG S 63", "Maybach S 580", "Maybach S 680"],
  "GLE": ["GLE 350", "GLE 350 4MATIC", "GLE 450 4MATIC", "GLE 580 4MATIC", "AMG GLE 53", "AMG GLE 63 S", "GLE 350e", "GLE 400e"],
  "EQS": ["EQS 450+", "EQS 580 4MATIC", "AMG EQS 53", "EQS SUV 450+", "EQS SUV 580 4MATIC"],
  
  // Tesla
  "Model 3": ["Standard Range", "Long Range", "Performance", "RWD", "AWD", "Long Range AWD"],
  "Model Y": ["RWD", "Long Range", "Performance", "Long Range AWD"],
  "Model S": ["Standard Range", "Long Range", "Plaid", "Plaid+"],
  "Model X": ["Long Range", "Plaid"],
  "Cybertruck": ["RWD", "Dual Motor AWD", "Tri Motor AWD", "Cyberbeast"],
  
  // Toyota
  "Camry": ["LE", "SE", "SE Nightshade", "XLE", "XSE", "TRD", "Hybrid LE", "Hybrid SE", "Hybrid SE Nightshade", "Hybrid XLE", "Hybrid XSE"],
  "RAV4": ["LE", "XLE", "XLE Premium", "Adventure", "TRD Off-Road", "Limited", "Hybrid LE", "Hybrid XLE", "Hybrid XLE Premium", "Hybrid XSE", "Hybrid Limited", "Prime SE", "Prime XSE", "Prime XSE Premium"],
  "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "TRD Pro", "Trail Edition", "PreRunner", "SR5 V6", "TRD Sport V6", "TRD Off-Road V6", "Limited V6", "TrailHunter"],
  "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794 Edition", "TRD Pro", "Capstone", "SR5 TRD Sport", "SR5 TRD Off-Road", "Limited TRD Off-Road", "Hybrid Limited", "Hybrid Platinum", "Hybrid TRD Pro", "Hybrid Capstone"],
  "Prius": ["LE", "XLE", "Limited", "Nightshade Edition", "Prime LE", "Prime XLE", "Prime Limited"],
  "4Runner": ["SR5", "SR5 Premium", "TRD Sport", "TRD Off-Road", "TRD Off-Road Premium", "Limited", "TRD Pro", "40th Anniversary Special Edition"],
  
  // Subaru
  "Outback": ["Base", "Premium", "Onyx Edition", "Onyx Edition XT", "Limited", "Touring", "Wilderness", "Limited XT", "Touring XT"],
  "Forester": ["Base", "Premium", "Sport", "Limited", "Touring", "Wilderness", "Wilderness Touring"],
  "Crosstrek": ["Base", "Premium", "Sport", "Limited", "Hybrid", "Wilderness", "Special Edition"],
  "WRX": ["Base", "Premium", "Limited", "GT", "STI", "STI Limited", "STI Series.White"],
  "BRZ": ["Premium", "Limited", "tS", "Series.Yellow", "Series.Gray", "Series.White"],
  
  // Nissan
  "Altima": ["S", "SV", "SR", "SL", "SR VC-Turbo", "Platinum", "Edition ONE"],
  "Rogue": ["S", "SV", "SL", "Platinum", "Hybrid SV", "Hybrid SL", "Hybrid Platinum"],
  "Pathfinder": ["S", "SV", "SL", "Platinum", "Rock Creek", "Rock Creek SV", "Rock Creek SL"],
  "Frontier": ["S", "SV", "PRO-X", "PRO-4X", "SL", "Midnight Edition", "Desert Runner"],
  "Z": ["Sport", "Performance", "NISMO", "Proto Spec", "Type T", "Type S"]
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
