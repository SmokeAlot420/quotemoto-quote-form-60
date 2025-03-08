
import { useQuoteForm, Coverage, CoverageType, DeductibleAmount } from "@/context/QuoteFormContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield } from "lucide-react";
import { useState } from "react";

const CoverageForm = () => {
  const { formData, updateCoverage, nextStep, prevStep } = useQuoteForm();
  const { vehicles, coverages } = formData;
  const [activeVehicle, setActiveVehicle] = useState(vehicles[0]?.id || "");

  // Get the coverage for the active vehicle
  const getActiveCoverage = () => {
    return coverages.find((cov) => cov.vehicleId === activeVehicle) || coverages[0];
  };

  // Handle next step button
  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="form-section-appear">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-insurance-text mb-2">Coverage Preferences</h2>
        <p className="text-insurance-text-light">Customize coverage for each of your vehicles.</p>
      </div>

      {vehicles.length > 1 ? (
        <Tabs defaultValue={vehicles[0]?.id} onValueChange={setActiveVehicle}>
          <TabsList className="w-full mb-6">
            {vehicles.map((vehicle) => (
              <TabsTrigger key={vehicle.id} value={vehicle.id} className="flex-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {vehicles.map((vehicle) => {
            const coverage = coverages.find((cov) => cov.vehicleId === vehicle.id);
            if (!coverage) return null;

            return (
              <TabsContent key={vehicle.id} value={vehicle.id}>
                <CoverageCard 
                  vehicle={vehicle} 
                  coverage={coverage} 
                  updateCoverage={updateCoverage} 
                />
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <CoverageCard 
          vehicle={vehicles[0]} 
          coverage={coverages[0]} 
          updateCoverage={updateCoverage} 
        />
      )}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          className="border-gray-300"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <Button 
          onClick={handleNext}
          className="bg-insurance-primary hover:bg-insurance-primary/90"
        >
          Continue to Contact Info
        </Button>
      </div>
    </div>
  );
};

interface CoverageCardProps {
  vehicle: {
    id: string;
    year: string;
    make: string;
    model: string;
    trim?: string;
  };
  coverage: Coverage;
  updateCoverage: (vehicleId: string, coverageData: Partial<Coverage>) => void;
}

const CoverageCard = ({ vehicle, coverage, updateCoverage }: CoverageCardProps) => {
  return (
    <Card className="mb-6 border-insurance-accent shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Shield className="mr-2 text-insurance-primary" />
          <h3 className="text-lg font-medium">
            Coverage for {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${vehicle.id}-coverage-type`}>Coverage Type</Label>
            <Select
              value={coverage.type}
              onValueChange={(value) => updateCoverage(vehicle.id, { type: value as CoverageType })}
            >
              <SelectTrigger id={`${vehicle.id}-coverage-type`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Minimum State Required">Minimum State Required</SelectItem>
                <SelectItem value="Full Coverage">Full Coverage</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {coverage.type === "Minimum State Required" && (
              <p className="text-sm text-amber-600">
                This provides the minimum coverage required by law, but may not fully protect you in all situations.
              </p>
            )}
          </div>

          {/* Only show deductible if coverage type is not "Minimum State Required" */}
          {coverage.type !== "Minimum State Required" && (
            <div className="space-y-2">
              <Label htmlFor={`${vehicle.id}-deductible`}>Deductible Amount</Label>
              <Select
                value={coverage.deductible}
                onValueChange={(value) => updateCoverage(vehicle.id, { deductible: value as DeductibleAmount })}
              >
                <SelectTrigger id={`${vehicle.id}-deductible`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$250">$250</SelectItem>
                  <SelectItem value="$500">$500</SelectItem>
                  <SelectItem value="$1,000">$1,000</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                A lower deductible means you'll pay less out of pocket in the event of a claim, but your premium may be higher.
              </p>
            </div>
          )}

          <div className="md:col-span-2">
            <h4 className="font-medium mb-3">Additional Coverages</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <Label htmlFor={`${vehicle.id}-uninsured`} className="cursor-pointer">
                  Uninsured Motorist Protection
                </Label>
                <Switch
                  id={`${vehicle.id}-uninsured`}
                  checked={coverage.uninsuredMotorist}
                  onCheckedChange={(checked) => updateCoverage(vehicle.id, { uninsuredMotorist: checked })}
                />
              </div>

              <div className="flex items-center justify-between border p-3 rounded-md">
                <Label htmlFor={`${vehicle.id}-roadside`} className="cursor-pointer">
                  Roadside Assistance
                </Label>
                <Switch
                  id={`${vehicle.id}-roadside`}
                  checked={coverage.roadsideAssistance}
                  onCheckedChange={(checked) => updateCoverage(vehicle.id, { roadsideAssistance: checked })}
                />
              </div>

              <div className="flex items-center justify-between border p-3 rounded-md">
                <Label htmlFor={`${vehicle.id}-rental`} className="cursor-pointer">
                  Rental Car Reimbursement
                </Label>
                <Switch
                  id={`${vehicle.id}-rental`}
                  checked={coverage.rentalReimbursement}
                  onCheckedChange={(checked) => updateCoverage(vehicle.id, { rentalReimbursement: checked })}
                />
              </div>

              <div className="flex items-center justify-between border p-3 rounded-md">
                <Label htmlFor={`${vehicle.id}-sr22`} className="cursor-pointer">
                  SR-22 Filing Needed
                </Label>
                <Switch
                  id={`${vehicle.id}-sr22`}
                  checked={coverage.sr22Filing}
                  onCheckedChange={(checked) => updateCoverage(vehicle.id, { sr22Filing: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverageForm;
