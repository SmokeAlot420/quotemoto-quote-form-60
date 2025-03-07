
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/components/ui/toast";

// Types for our form data
export type VehicleUsage = "Personal" | "Business" | "Rideshare";
export type LicenseStatus = "Valid" | "Suspended" | "Expired" | "Permit";
export type CoverageType = "Minimum State Required" | "Full Coverage" | "Custom";
export type DeductibleAmount = "$250" | "$500" | "$1,000";

export interface Vehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  trim?: string;
  usage: VehicleUsage;
}

export interface Driver {
  id: string;
  age: string;
  licenseStatus: LicenseStatus;
  hasIncidents: boolean;
}

export interface Coverage {
  vehicleId: string;
  type: CoverageType;
  deductible: DeductibleAmount;
  uninsuredMotorist: boolean;
  roadsideAssistance: boolean;
  rentalReimbursement: boolean;
  sr22Filing: boolean;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zipCode: string;
}

export interface QuoteFormData {
  vehicles: Vehicle[];
  drivers: Driver[];
  coverages: Coverage[];
  contactInfo: ContactInfo;
  currentStep: number;
}

// Initial state for our form data
const initialState: QuoteFormData = {
  vehicles: [
    {
      id: "vehicle-1",
      year: "",
      make: "",
      model: "",
      trim: "",
      usage: "Personal",
    },
  ],
  drivers: [
    {
      id: "driver-1",
      age: "",
      licenseStatus: "Valid",
      hasIncidents: false,
    },
  ],
  coverages: [
    {
      vehicleId: "vehicle-1",
      type: "Minimum State Required",
      deductible: "$500",
      uninsuredMotorist: false,
      roadsideAssistance: false,
      rentalReimbursement: false,
      sr22Filing: false,
    },
  ],
  contactInfo: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    zipCode: "",
  },
  currentStep: 1,
};

// Context setup
interface QuoteFormContextType {
  formData: QuoteFormData;
  setFormData: React.Dispatch<React.SetStateAction<QuoteFormData>>;
  addVehicle: () => void;
  removeVehicle: (id: string) => void;
  addDriver: () => void;
  removeDriver: (id: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitForm: () => void;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => void;
  updateDriver: (id: string, driverData: Partial<Driver>) => void;
  updateCoverage: (vehicleId: string, coverageData: Partial<Coverage>) => void;
  updateContactInfo: (data: Partial<ContactInfo>) => void;
}

const QuoteFormContext = createContext<QuoteFormContextType | undefined>(undefined);

export const QuoteFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<QuoteFormData>(initialState);

  // Add a new vehicle with a unique ID
  const addVehicle = () => {
    const newId = `vehicle-${formData.vehicles.length + 1}`;
    const newVehicle: Vehicle = {
      id: newId,
      year: "",
      make: "",
      model: "",
      trim: "",
      usage: "Personal",
    };
    
    // Add default coverage for this vehicle
    const newCoverage: Coverage = {
      vehicleId: newId,
      type: "Minimum State Required",
      deductible: "$500",
      uninsuredMotorist: false,
      roadsideAssistance: false,
      rentalReimbursement: false,
      sr22Filing: false,
    };

    setFormData((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle],
      coverages: [...prev.coverages, newCoverage],
    }));
  };

  // Remove a vehicle and its associated coverage
  const removeVehicle = (id: string) => {
    if (formData.vehicles.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one vehicle.",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((v) => v.id !== id),
      coverages: prev.coverages.filter((c) => c.vehicleId !== id),
    }));
  };

  // Add a new driver with a unique ID
  const addDriver = () => {
    const newId = `driver-${formData.drivers.length + 1}`;
    const newDriver: Driver = {
      id: newId,
      age: "",
      licenseStatus: "Valid",
      hasIncidents: false,
    };

    setFormData((prev) => ({
      ...prev,
      drivers: [...prev.drivers, newDriver],
    }));
  };

  // Remove a driver
  const removeDriver = (id: string) => {
    if (formData.drivers.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one driver.",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      drivers: prev.drivers.filter((d) => d.id !== id),
    }));
  };

  // Navigation functions
  const nextStep = () => {
    const maxSteps = 4; // Total number of steps
    if (formData.currentStep < maxSteps) {
      setFormData((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  };

  const prevStep = () => {
    if (formData.currentStep > 1) {
      setFormData((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setFormData((prev) => ({
        ...prev,
        currentStep: step,
      }));
    }
  };

  // Update functions for each data type
  const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => {
    setFormData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...vehicleData } : vehicle
      ),
    }));
  };

  const updateDriver = (id: string, driverData: Partial<Driver>) => {
    setFormData((prev) => ({
      ...prev,
      drivers: prev.drivers.map((driver) =>
        driver.id === id ? { ...driver, ...driverData } : driver
      ),
    }));
  };

  const updateCoverage = (vehicleId: string, coverageData: Partial<Coverage>) => {
    setFormData((prev) => ({
      ...prev,
      coverages: prev.coverages.map((coverage) =>
        coverage.vehicleId === vehicleId ? { ...coverage, ...coverageData } : coverage
      ),
    }));
  };

  const updateContactInfo = (data: Partial<ContactInfo>) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        ...data,
      },
    }));
  };

  // Form submission function
  const submitForm = () => {
    console.log("Form submitted:", formData);
    // In a real application, this would send the data to an API
    toast({
      title: "Quote Request Sent!",
      description: "One of our agents will contact you shortly.",
    });

    // Redirect to thank you page or do something else
    setTimeout(() => {
      window.location.href = "/thank-you";
    }, 1500);
  };

  const value = {
    formData,
    setFormData,
    addVehicle,
    removeVehicle,
    addDriver,
    removeDriver,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    updateVehicle,
    updateDriver,
    updateCoverage,
    updateContactInfo,
  };

  return <QuoteFormContext.Provider value={value}>{children}</QuoteFormContext.Provider>;
};

// Custom hook to use the QuoteForm context
export const useQuoteForm = () => {
  const context = useContext(QuoteFormContext);
  if (context === undefined) {
    throw new Error("useQuoteForm must be used within a QuoteFormProvider");
  }
  return context;
};
