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
import { Car, Plus, Trash2, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

const YEARS = Array.from({ length: 36 }, (_, i) => (2025 - i).toString());

const MAKES = [
  "ACURA", "ALFA ROMEO", "ASTON MARTIN", "AUDI", "BENTLEY", "BMW", "BUICK", 
  "BYD", "CADILLAC", "CHEVROLET", "CHRYSLER", "DODGE", "FERRARI", "FIAT", 
  "FORD", "GENESIS", "GMC", "HONDA", "HYUNDAI", "INFINITI", "JAGUAR", 
  "JEEP", "KARMA", "KIA", "LAMBORGHINI", "LAND ROVER", "LEXUS", "LINCOLN", 
  "LOTUS", "LUCID", "MASERATI", "MAZDA", "MCLAREN", "MERCEDES BENZ", "MINI", 
  "MITSUBISHI", "NISSAN", "POLESTAR", "PORSCHE", "RAM", "RIVIAN", "ROLLS ROYCE", 
  "SUBARU", "TESLA", "TOYOTA", "VOLKSWAGEN", "VOLVO"
];

const MODELS_BY_MAKE: Record<string, string[]> = {
  "ACURA": ["ILX", "MDX", "RDX", "RLX", "TLX", "NSX", "Integra", "ZDX"],
  "ALFA ROMEO": ["Giulia", "Stelvio", "Tonale", "4C", "4C Spider"],
  "ASTON MARTIN": ["DB11", "DB12", "DBS", "Vantage", "DBX", "Valkyrie", "Valour", "Vanquish"],
  "AUDI": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron", "e-tron GT", "TT", "R8", "RS e-tron GT", "RS3", "RS5", "RS6", "RS7", "S3", "S4", "S5", "S6", "S7", "S8"],
  "BENTLEY": ["Bentayga", "Continental GT", "Flying Spur", "Mulliner", "Bacalar", "Batur"],
  "BMW": ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "iX", "iX1", "iX2", "iX3", "i4", "i5", "i7", "Z4", "M2", "M3", "M4", "M5", "M8", "XM"],
  "BUICK": ["Enclave", "Encore", "Encore GX", "Envision", "Envista", "LaCrosse", "Regal"],
  "BYD": ["Atto 3", "Han", "Tang", "Seal", "Dolphin", "Shark", "Yuan Plus", "Song Plus"],
  "CADILLAC": ["CT4", "CT5", "Escalade", "Escalade ESV", "Escalade IQ", "XT4", "XT5", "XT6", "LYRIQ", "OPTIQ", "CELESTIQ"],
  
  "CHEVROLET": [
    "Blazer", "Blazer EV", "Bolt", "Bolt EUV", "Camaro", "Colorado", "Corvette", "Corvette E-Ray", 
    "Equinox", "Equinox EV", "Express", "Malibu", "Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", 
    "Silverado EV", "Spark", "Suburban", "Tahoe", "Trailblazer", "Traverse", "Trax", "Montana"
  ],
  
  "CHRYSLER": [
    "300", "300C", "300S", "Pacifica", "Pacifica Hybrid", "Pacifica Pinnacle", 
    "Voyager", "Grand Voyager", "Town & Country", "Aspen", "200", "200C", 
    "200S", "Sebring", "PT Cruiser", "Airflow Concept"
  ],
  
  "DODGE": [
    "Challenger", "Charger", "Charger Daytona EV", "Durango", "Hornet", 
    "Journey", "Grand Caravan", "Viper", "Dart", "Nitro", "Avenger", 
    "Caliber", "Magnum", "Stealth", "Dakota", "Demon", "RAM"
  ],
  
  "FERRARI": ["296", "296 GTB", "296 GTS", "SF90", "SF90 Stradale", "SF90 Spider", "F8", "F8 Tributo", "F8 Spider", "Roma", "Portofino", "Portofino M", "812", "812 Superfast", "812 GTS", "Purosangue", "Daytona SP3"],
  
  "FIAT": [
    "500", "500X", "500e", "500L", "124 Spider", "500 Abarth", 
    "500C", "Tipo", "Panda", "Doblo", "Multipla", "Punto"
  ],
  
  "FORD": [
    "Bronco", "Bronco Sport", "Bronco Raptor", "EcoSport", "Edge", "Escape", "Evos", 
    "Expedition", "Explorer", "Explorer ST", "F-150", "F-150 Lightning", "F-150 Raptor", 
    "F-150 Raptor R", "F-250", "F-350", "F-450", "Maverick", "Mustang", "Mustang Dark Horse", 
    "Mustang GT", "Mustang Mach-E", "Ranger", "Ranger Raptor", "Super Duty", "Transit", 
    "Transit Connect", "Transit Custom", "Territory", "Puma", "GT", "Focus", "Fiesta"
  ],
  
  "GENESIS": ["G70", "G80", "G90", "GV60", "GV70", "GV80", "Electrified G80", "Electrified GV70", "Electrified GV80", "X Convertible Concept", "X Speedium Concept"],
  
  "GMC": [
    "Acadia", "Canyon", "Canyon AT4X", "Hummer EV Pickup", "Hummer EV SUV", 
    "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Sierra EV", "Terrain", 
    "Terrain AT4", "Yukon", "Yukon XL", "Yukon Denali", "Yukon Denali XL", "Savana"
  ],
  
  "HONDA": [
    "Accord", "Accord Hybrid", "Civic", "Civic Hatchback", "Civic Type R", "CR-V", 
    "CR-V Hybrid", "CR-Z", "Element", "Fit", "HR-V", "Insight", "Odyssey", "Passport", 
    "Pilot", "Pilot TrailSport", "Prelude", "Ridgeline", "Clarity", "Prologue", "e:Ny1", "ZR-V"
  ],
  
  "HYUNDAI": [
    "Accent", "Elantra", "Elantra N", "Elantra Hybrid", "Ioniq", "Ioniq 5", "Ioniq 5 N", 
    "Ioniq 6", "Ioniq 7", "Kona", "Kona Electric", "Kona N", "Palisade", "Santa Cruz", 
    "Santa Fe", "Santa Fe Hybrid", "Santa Fe PHEV", "Sonata", "Sonata Hybrid", "Tucson", 
    "Tucson Hybrid", "Tucson PHEV", "Venue", "Nexo", "Azera", "Veloster", "Veloster N", 
    "Staria", "Casper", "Creta", "Custo", "i10", "i20", "i30", "i40", "ix20", "ix35"
  ],
  
  "INFINITI": ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80", "QX30", "QX70", "Q70"],
  
  "JAGUAR": [
    "E-PACE", "F-PACE", "F-TYPE", "I-PACE", "XE", "XF", "XJ", 
    "SVR", "XK", "XJL", "XKR", "Project 8", "XJ220"
  ],
  
  "JEEP": [
    "Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Grand Cherokee 4xe", 
    "Grand Cherokee L", "Grand Wagoneer", "Renegade", "Wagoneer", "Wrangler", 
    "Wrangler 4xe", "Wrangler Rubicon 392", "Commander", "Avenger", "Liberty", 
    "Patriot", "Grand Commander", "Recon", "Meridian"
  ],
  
  "KARMA": ["GS-6", "Revero", "GSe-6", "GS-6E", "EREV", "Revero GT"],
  
  "KIA": [
    "Carnival", "EV3", "EV5", "EV6", "EV9", "Forte", "K3", "K5", "K8", "K9", 
    "Niro", "Niro EV", "Niro Hybrid", "Niro PHEV", "Rio", "Seltos", "Sorento", 
    "Sorento Hybrid", "Sorento PHEV", "Soul", "Soul EV", "Sportage", "Sportage Hybrid", 
    "Sportage PHEV", "Stinger", "Telluride", "Carnival", "Cadenza", "Optima", 
    "Picanto", "Ceed", "ProCeed", "Stonic", "Carens", "Ray", "Mohave", "Sonet"
  ],
  
  "LAMBORGHINI": ["Aventador", "Huracan", "Huracan Sterrato", "Urus", "Urus S", "Urus Performante", "Revuelto", "Countach LPI 800-4", "Sian", "Huracán Tecnica"],
  
  "LAND ROVER": [
    "Defender", "Defender 90", "Defender 110", "Defender 130", "Discovery", 
    "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", 
    "Range Rover Velar", "Range Rover SV", "Range Rover Electric", "Range Rover Sport SV", 
    "Freelander", "LR2", "LR3", "LR4"
  ],
  
  "LEXUS": [
    "ES", "ES 250", "ES 300h", "ES 350", "GX", "GX 550", "IS", "IS 300", "IS 350", 
    "IS 500", "LC", "LC 500", "LC 500h", "LS", "LS 500", "LS 500h", "LX", "LX 600", 
    "NX", "NX 250", "NX 350", "NX 350h", "NX 450h+", "RX", "RX 350", "RX 350h", 
    "RX 450h+", "RX 500h", "UX", "UX 200", "UX 250h", "RZ", "RZ 450e", 
    "TX", "TX 350", "TX 500h", "TX 550h+", "LFA", "RC", "RC F", "GS", "CT", "HS", "SC"
  ],
  
  "LINCOLN": [
    "Aviator", "Aviator Grand Touring", "Corsair", "Corsair Grand Touring", 
    "Nautilus", "Navigator", "Navigator L", "Star Concept", "MKZ", "Continental", 
    "MKX", "MKC", "MKT", "Town Car", "Zephyr"
  ],
  
  "LOTUS": ["Emira", "Evija", "Eletre", "Emeya", "Exige", "Elise", "Evora", "Type 135"],
  
  "LUCID": ["Air", "Air Pure", "Air Touring", "Air Grand Touring", "Air Sapphire", "Gravity"],
  
  "MASERATI": [
    "Ghibli", "Grecale", "Grecale Folgore", "GranTurismo", "GranTurismo Folgore", 
    "GranCabrio", "GranCabrio Folgore", "Levante", "MC20", "MC20 Cielo", "Quattroporte", 
    "Alfieri", "GranSport", "Barchetta", "Coupe", "Spyder"
  ],
  
  "MAZDA": [
    "CX-30", "CX-5", "CX-50", "CX-70", "CX-80", "CX-90", "Mazda3", "Mazda3 Hatchback", 
    "Mazda6", "MX-5 Miata", "MX-30", "MX-5 RF", "CX-3", "CX-60", "CX-7", "CX-9", 
    "RX-7", "RX-8", "MX-6", "Tribute", "Protege", "MPV", "Premacy", "BT-50"
  ],
  
  "MCLAREN": ["Artura", "720S", "765LT", "765LT Spider", "750S", "750S Spider", "GT", "Elva", "Senna", "Speedtail", "P1", "600LT", "620R", "570S", "540C", "12C", "MP4-12C"],
  
  "MERCEDES BENZ": [
    "A-Class", "AMG GT", "AMG GT 4-Door", "AMG GT Coupe", "AMG One", "AMG SL", 
    "B-Class", "C-Class", "C-Class Sedan", "C-Class Coupe", "C-Class Cabriolet", 
    "CLA", "CLE", "CLS", "E-Class", "E-Class Sedan", "E-Class Coupe", "E-Class Cabriolet", 
    "EQA", "EQB", "EQC", "EQE", "EQE SUV", "EQS", "EQS SUV", "EQV", "G-Class", "G-Class Electric", 
    "GLA", "GLB", "GLC", "GLC Coupe", "GLE", "GLE Coupe", "GLS", "Maybach EQS SUV", "Maybach GLS", 
    "Maybach S-Class", "S-Class", "SL", "SLC", "V-Class", "Vito", "X-Class"
  ],
  
  "MINI": [
    "Cooper", "Cooper S", "Cooper SE", "Clubman", "Countryman", "Countryman SE", 
    "Convertible", "Electric", "John Cooper Works", "JCW", "Hardtop 2 Door", 
    "Hardtop 4 Door", "Cooper 3-Door", "Cooper 5-Door", "Aceman", "Paceman", "Coupe", "Roadster"
  ],
  
  "MITSUBISHI": [
    "Eclipse Cross", "Mirage", "Mirage G4", "Outlander", "Outlander PHEV", 
    "Outlander Sport", "ASX", "Pajero", "Pajero Sport", "Triton", "Lancer", 
    "Lancer Evolution", "Galant", "i-MiEV", "Xpander", "L200", "Montero", "RVR"
  ],
  
  "NISSAN": [
    "Altima", "Ariya", "Armada", "Frontier", "GT-R", "Juke", "Kicks", "Leaf", 
    "Maxima", "Murano", "Pathfinder", "Qashqai", "Rogue", "Sentra", "Titan", 
    "Titan XD", "Versa", "Z", "370Z", "400Z", "X-Trail", "Terra", "Note", 
    "Patrol", "Serena", "Skyline", "Sylphy", "Magnite", "March", "Micra", "NV"
  ],
  
  "POLESTAR": ["Polestar 2", "Polestar 3", "Polestar 4", "Polestar 5", "Polestar 6", "Polestar Precept", "Polestar O₂"],
  
  "PORSCHE": [
    "911", "911 Carrera", "911 GT3", "911 GT3 RS", "911 Turbo", "911 Turbo S", 
    "718 Boxster", "718 Cayman", "Cayenne", "Cayenne Coupe", "Cayenne Turbo GT", 
    "Macan", "Macan Electric", "Panamera", "Taycan", "Taycan Cross Turismo", 
    "Taycan Sport Turismo", "918 Spyder", "Carrera GT", "Mission E", "Mission X"
  ],
  
  "RAM": [
    "1500", "1500 Classic", "1500 REV", "1500 TRX", "2500", "3500", "ProMaster", 
    "ProMaster City", "Dakota", "Ramcharger", "Heavy Duty", "Chassis Cab", 
    "Tradesman", "Rebel", "Limited", "Laramie", "Longhorn"
  ],
  
  "RIVIAN": ["R1T", "R1S", "R2", "R3", "R3X", "R4", "R5", "Commercial Van", "EDV", "EDV 700"],
  
  "ROLLS ROYCE": ["Cullinan", "Dawn", "Ghost", "Phantom", "Spectre", "Wraith", "Boat Tail", "Black Badge", "Silver Shadow", "Silver Wraith", "Corniche", "Camargue"],
  
  "SUBARU": [
    "Ascent", "BRZ", "Crosstrek", "Crosstrek Hybrid", "Forester", "Impreza", 
    "Legacy", "Outback", "Outback Wilderness", "Solterra", "WRX", "WRX STI", 
    "Baja", "Tribeca", "XV", "Levorg", "Exiga", "Sambar", "Alcyone", "SVX"
  ],
  
  "TESLA": [
    "Model 3", "Model 3 Highland", "Model S", "Model S Plaid", "Model X", 
    "Model X Plaid", "Model Y", "Cybertruck", "Roadster", "Semi", "Optimus Bot"
  ],
  
  "TOYOTA": [
    "4Runner", "86", "Avalon", "bZ3", "bZ3X", "bZ4X", "bZ5X", "Camry", "Camry Hybrid", 
    "Corolla", "Corolla Cross", "Corolla Cross Hybrid", "Corolla Hybrid", "Crown", 
    "Crown Signia", "GR86", "GR Corolla", "GR Supra", "Grand Highlander", "Highlander", 
    "Highlander Hybrid", "Land Cruiser", "Mirai", "Prius", "Prius Prime", "RAV4", 
    "RAV4 Hybrid", "RAV4 Prime", "Sequoia", "Sienna", "Supra", "Tacoma", "Tundra", 
    "Tundra Hybrid", "Venza", "Yaris", "C-HR", "Aygo", "Century", "Hilux", "Proace", 
    "Urban Cruiser", "Fortuner", "Innova", "Raize", "Alphard", "Celica", "MR2"
  ],
  
  "VOLKSWAGEN": [
    "Arteon", "Atlas", "Atlas Cross Sport", "Golf", "Golf GTI", "Golf R", "ID.3", 
    "ID.4", "ID.5", "ID.6", "ID.7", "ID. Buzz", "Jetta", "Jetta GLI", "Passat", 
    "Taos", "Tiguan", "Touareg", "Amarok", "California", "Caddy", "Crafter", 
    "Multivan", "Polo", "Scirocco", "Sharan", "T-Cross", "T-Roc", "Transporter", "Up"
  ],
  
  "VOLVO": [
    "C40 Recharge", "EX30", "EX90", "S60", "S60 Recharge", "S90", "S90 Recharge", 
    "V60", "V60 Cross Country", "V60 Recharge", "V90", "V90 Cross Country", 
    "XC40", "XC40 Recharge", "XC60", "XC60 Recharge", "XC90", "XC90 Recharge", 
    "Polestar 1", "S40", "V40", "C30", "C70", "XC70"
  ]
};

const TRIMS_BY_MODEL: Record<string, string[]> = {
  "MDX": ["Base", "Technology", "A-Spec", "Advance", "Type S", "Type S Advance"],
  "RDX": ["Base", "Technology", "A-Spec", "Advance", "PMC Edition"],
  "TLX": ["Base", "Technology", "A-Spec", "Advance", "Type S", "Type S Performance"],
  "Integra": ["Base", "A-Spec", "A-Spec Technology", "Type S"],
  
  "A4": ["Premium", "Premium Plus", "Prestige", "S4 Premium Plus", "S4 Prestige", "RS4"],
  "Q5": ["Premium", "Premium Plus", "Prestige", "SQ5 Premium Plus", "SQ5 Prestige", "Q5 Sportback", "SQ5 Sportback"],
  "A6": ["Premium", "Premium Plus", "Prestige", "S6 Premium Plus", "S6 Prestige", "RS6 Avant"],
  "Q7": ["Premium", "Premium Plus", "Prestige", "SQ7 Premium Plus", "SQ7 Prestige"],
  "e-tron": ["Premium", "Premium Plus", "Prestige", "S", "GT", "RS GT"],
  
  "3 Series": ["330i", "330i xDrive", "330e", "330e xDrive", "M340i", "M340i xDrive", "M3", "M3 Competition", "M3 CS"],
  "5 Series": ["530i", "530i xDrive", "540i", "540i xDrive", "550i", "550i xDrive", "M5", "M5 Competition", "M5 CS"],
  "X5": ["sDrive40i", "xDrive40i", "xDrive45e", "M50i", "X5 M", "X5 M Competition", "X5 M First Edition"],
  "7 Series": ["740i", "740i xDrive", "760i xDrive", "i7 eDrive50", "i7 xDrive60", "i7 M70"],
  "i4": ["eDrive35", "eDrive40", "xDrive40", "M50"],
  "iX": ["xDrive40", "xDrive50", "M60"],
  
  "Silverado 1500": ["WT", "Custom", "Custom Trail Boss", "LT", "RST", "LT Trail Boss", "LTZ", "High Country", "ZR2", "ZR2 Bison", "Trim not listed"],
  "Silverado 2500HD": ["WT", "Custom", "LT", "LTZ", "High Country", "ZR2", "Trim not listed"],
  "Silverado 3500HD": ["WT", "LT", "LTZ", "High Country", "Trim not listed"],
  "Silverado EV": ["WT", "RST", "Trail Boss", "First Edition", "Trim not listed"],
  "Equinox": ["LS", "LT", "RS", "Premier", "LT EV", "RS EV", "Premier EV", "Trim not listed"],
  "Corvette": ["Stingray 1LT", "Stingray 2LT", "Stingray 3LT", "Z06 1LZ", "Z06 2LZ", "Z06 3LZ", "Grand Sport", "ZR1", "E-Ray", "Trim not listed"],
  "Tahoe": ["LS", "LT", "RST", "Z71", "Premier", "High Country", "Trim not listed"],
  "Blazer": ["LT", "RS", "Premier", "SS", "EV LT", "EV RS", "EV SS", "Trim not listed"],
  "Camaro": ["LS", "LT", "LT1", "SS", "ZL1", "Trim not listed"],
  "Colorado": ["WT", "LT", "Z71", "Trail Boss", "ZR2", "ZR2 Bison", "Trim not listed"],
  "Malibu": ["LS", "RS", "LT", "Premier", "Trim not listed"],
  "Suburban": ["LS", "LT", "RST", "Z71", "Premier", "High Country", "Trim not listed"],
  "Trailblazer": ["LS", "LT", "ACTIV", "RS", "Trim not listed"],
  "Traverse": ["LS", "LT", "RS", "Premier", "High Country", "Trim not listed"],
  "Bolt": ["1LT", "2LT", "Trim not listed"],
  "Bolt EUV": ["LT", "Premier", "Redline Edition", "Trim not listed"],
  
  "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor", "Raptor R", "Lightning Pro", "Lightning XLT", "Lightning Lariat", "Lightning Platinum", "Trim not listed"],
  "F-250": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Trim not listed"],
  "F-350": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Trim not listed"],
  "Mustang": ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Mach 1", "Mach 1 Premium", "Shelby GT500", "Dark Horse", "Dark Horse Premium", "Trim not listed"],
  "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor", "Heritage Edition", "Heritage Limited Edition", "Trim not listed"],
  "Explorer": ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "King Ranch", "Platinum", "Trim not listed"],
  "Maverick": ["XL", "XLT", "Lariat", "Tremor", "Hybrid", "EcoBoost", "Trim not listed"],
  "Escape": ["S", "SE", "SEL", "Titanium", "ST-Line", "PHEV", "Trim not listed"],
  "Edge": ["SE", "SEL", "ST-Line", "Titanium", "ST", "Trim not listed"],
  "Expedition": ["XL", "XLT", "Limited", "King Ranch", "Platinum", "Timberline", "Trim not listed"],
  "Mustang Mach-E": ["Select", "Premium", "California Route 1", "GT", "GT Performance", "Trim not listed"],
  "Ranger": ["XL", "XLT", "Lariat", "Tremor", "Raptor", "Splash", "Trim not listed"],
  
  "Accord": ["LX", "Sport", "Sport SE", "EX-L", "Sport 2.0T", "Touring", "Hybrid Sport", "Hybrid EX-L", "Hybrid Touring", "Trim not listed"],
  "Civic": ["LX", "Sport", "EX", "EX-L", "Touring", "Si", "Type R", "Type R Limited Edition", "Type R Touring", "Trim not listed"],
  "Civic Type R": ["Base", "Limited Edition", "Touring", "Trim not listed"],
  "CR-V": ["LX", "EX", "EX-L", "Sport", "Sport Touring", "Hybrid EX", "Hybrid EX-L", "Hybrid Sport", "Hybrid Sport Touring", "Trim not listed"],
  "Pilot": ["LX", "Sport", "EX-L", "TrailSport", "Touring", "Elite", "Black Edition", "Trim not listed"],
  "HR-V": ["LX", "Sport", "EX", "EX-L", "Trim not listed"],
  "Odyssey": ["LX", "EX", "EX-L", "Touring", "Elite", "Trim not listed"],
  "Ridgeline": ["Sport", "RTL", "RTL-E", "Black Edition", "TrailSport", "Trim not listed"],
  "Passport": ["EX-L", "TrailSport", "Elite", "Trim not listed"],
  "Fit": ["LX", "Sport", "EX", "EX-L", "Trim not listed"],
  "Insight": ["LX", "EX", "Touring", "Trim not listed"],
  
  "Elantra": ["SE", "SEL", "N Line", "Limited", "N", "Hybrid Blue", "Hybrid Limited", "Trim not listed"],
  "Elantra N": ["Base", "DCT", "Manual", "Trim not listed"],
  "Sonata": ["SE", "SEL", "SEL Plus", "N Line", "Limited", "Hybrid Blue", "Hybrid SEL", "Hybrid Limited", "Trim not listed"],
  "Tucson": ["SE", "SEL", "XRT", "N Line", "Limited", "Hybrid Blue", "Hybrid SEL", "Hybrid Limited", "PHEV SEL", "PHEV Limited", "Trim not listed"],
  "Santa Fe": ["SE", "SEL", "XRT", "Limited", "Calligraphy", "Hybrid Blue", "Hybrid SEL Premium", "Hybrid Limited", "PHEV SEL", "PHEV Limited", "Trim not listed"],
  "Palisade": ["SE", "SEL", "XRT", "Limited", "Calligraphy", "Trim not listed"],
  "Kona": ["SE", "SEL", "N Line", "Limited", "N", "Electric SEL", "Electric Limited", "Trim not listed"],
  "Ioniq 5": ["SE", "SE Long Range", "SEL", "Limited", "N", "Trim not listed"],
  "Ioniq 6": ["SE", "SE Long Range", "SEL", "Limited", "Trim not listed"],
  "Santa Cruz": ["SE", "SEL", "SEL Premium", "Limited", "Night", "Trim not listed"],
  "Venue": ["SE", "SEL", "Limited", "Denim", "Trim not listed"],
  "Accent": ["SE", "SEL", "Limited", "Trim not listed"],
  
  "Telluride": ["LX", "S", "EX", "SX", "X-Line", "X-Pro", "SX Prestige", "Trim not listed"],
  "Sorento": ["LX", "S", "EX", "SX", "SX Prestige", "X-Line", "Hybrid EX", "Hybrid SX Prestige", "PHEV SX", "PHEV SX Prestige", "Trim not listed"],
  "Sportage": ["LX", "EX", "SX", "SX Prestige", "X-Line", "X-Pro", "Hybrid LX", "Hybrid EX", "Hybrid SX Prestige", "PHEV X-Line", "PHEV X-Line Prestige", "Trim not listed"],
  "K5": ["LX", "LXS", "GT-Line", "EX", "GT", "Trim not listed"],
  "Forte": ["FE", "LXS", "GT-Line", "GT", "GT Manual", "Trim not listed"],
  "Soul": ["LX", "S", "GT-Line", "EX", "Turbo", "Trim not listed"],
  "Seltos": ["LX", "S", "EX", "SX", "X-Line", "Nightfall", "Trim not listed"],
  "Carnival": ["LX", "EX", "SX", "SX Prestige", "Trim not listed"],
  "Stinger": ["GT-Line", "GT1", "GT2", "Trim not listed"],
  "EV6": ["Light", "Wind", "GT-Line", "GT", "Trim not listed"],
  "EV9": ["Light", "Wind", "Land", "GT-Line", "Trim not listed"],
  "Niro": ["LX", "EX", "SX", "Hybrid", "PHEV", "EV", "Trim not listed"],
  "Rio": ["LX", "S", "GT-Line", "Trim not listed"],
  
  "Altima": ["S", "SV", "SR", "SL", "SR VC-Turbo", "Platinum", "Edition ONE", "SR Midnight Edition", "Trim not listed"],
  "Rogue": ["S", "SV", "SL", "Platinum", "Hybrid SV", "Hybrid SL", "Hybrid Platinum", "Midnight Edition", "Trim not listed"],
  "Pathfinder": ["S", "SV", "SL", "Platinum", "Rock Creek", "Rock Creek SV", "Rock Creek SL", "Trim not listed"],
  "Frontier": ["S", "SV", "PRO-X", "PRO-4X", "SL", "Midnight Edition", "Desert Runner", "Trim not listed"],
  "Z": ["Sport", "Performance", "NISMO", "Proto Spec", "Type T", "Type S", "Trim not listed"],
  "Leaf": ["S", "SV", "SV Plus", "SL Plus", "Trim not listed"],
  "Sentra": ["S", "SV", "SR", "SR Midnight Edition", "NISMO", "Trim not listed"],
  "Titan": ["S", "SV", "PRO-4X", "Platinum Reserve", "Trim not listed"],
  "Armada": ["S", "SV", "SL", "Platinum", "Midnight Edition", "Trim not listed"],
  "Kicks": ["S", "SV", "SR", "Trim not listed"],
  "Maxima": ["SV", "SR", "Platinum", "40th Anniversary Edition", "Trim not listed"],
  "Murano": ["S", "SV", "SL", "Platinum", "Midnight Edition", "Trim not listed"],
  "Versa": ["S", "SV", "SR", "Trim not listed"],
  "GT-R": ["Premium", "T-Spec", "NISMO", "NISMO Special Edition", "Trim not listed"],
  "Ariya": ["Engage", "Engage+", "Evolve+", "Empower+", "Platinum+", "Trim not listed"],
  
  "Camry": ["LE", "SE", "SE Nightshade", "XLE", "XSE", "TRD", "Hybrid LE", "Hybrid SE", "Hybrid SE Nightshade", "Hybrid XLE", "Hybrid XSE", "Trim not listed"],
  "RAV4": ["LE", "XLE", "XLE Premium", "Adventure", "TRD Off-Road", "Limited", "Hybrid LE", "Hybrid XLE", "Hybrid XLE Premium", "Hybrid XSE", "Hybrid Limited", "Prime SE", "Prime XSE", "Prime XSE Premium", "Trim not listed"],
  "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "TRD Pro", "Trail Edition", "PreRunner", "SR5 V6", "TRD Sport V6", "TRD Off-Road V6", "Limited V6", "TrailHunter", "Trim not listed"],
  "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794 Edition", "TRD Pro", "Capstone", "SR5 TRD Sport", "SR5 TRD Off-Road", "Limited TRD Off-Road", "Hybrid Limited", "Hybrid Platinum", "Hybrid TRD Pro", "Hybrid Capstone", "Trim not listed"],
  "Corolla": ["L", "LE", "SE", "XLE", "XSE", "Apex Edition", "Nightshade", "Hybrid LE", "Hybrid SE", "Hybrid XLE", "GR Corolla Core", "GR Corolla Circuit", "Trim not listed"],
  "4Runner": ["SR5", "SR5 Premium", "TRD Sport", "TRD Off-Road", "TRD Off-Road Premium", "Limited", "TRD Pro", "40th Anniversary Special Edition", "Trim not listed"],
  "Highlander": ["L", "LE", "XLE", "XSE", "Limited", "Platinum", "Bronze Edition", "Hybrid LE", "Hybrid XLE", "Hybrid Limited", "Hybrid Platinum", "Grand Highlander", "Trim not listed"],
  "Prius": ["LE", "XLE", "Limited", "Nightshade Edition", "Prime LE", "Prime XLE", "Prime Limited", "Trim not listed"],
  "Sienna": ["LE", "XLE", "XSE", "Limited", "Platinum", "Woodland Special Edition", "25th Anniversary Edition", "Trim not listed"],
  "GR Supra": ["2.0", "3.0", "3.0 Premium", "A91-CF Edition", "45th Anniversary Edition", "Trim not listed"],
  "Corolla Cross": ["L", "LE", "XLE", "SE", "Nightshade", "Hybrid S", "Hybrid SE", "Hybrid XSE", "Trim not listed"],
  "bZ4X": ["XLE", "Limited", "Trim not listed"],
  "Land Cruiser": ["GR Sport", "First Edition", "1958", "Trim not listed"],
  "Sequoia": ["SR5", "Limited", "Platinum", "TRD Pro", "Capstone", "Trim not listed"],
  "Crown": ["XLE", "Limited", "Platinum", "Trim not listed"],
  "Venza": ["LE", "XLE", "Limited", "Nightshade", "Trim not listed"],
  
  "Wrangler": ["Sport", "Sport S", "Willys Sport", "Willys", "Sahara", "Rubicon", "Rubicon 392", "4xe Sahara", "4xe Rubicon", "High Altitude", "Freedom Edition"],
  "Grand Cherokee": ["Laredo", "Altitude", "Limited", "Trailhawk", "Overland", "Summit", "Summit Reserve", "SRT", "Trackhawk", "4xe Limited", "4xe Trailhawk", "4xe Overland", "4xe Summit", "4xe Summit Reserve"],
  "Gladiator": ["Sport", "Willys Sport", "Sport S", "Willys", "Mojave", "Rubicon", "High Altitude", "Farout", "Rubicon X"],
  "Cherokee": ["Latitude", "Latitude Plus", "Latitude Lux", "Trailhawk", "Limited", "High Altitude"],
  "Compass": ["Sport", "Latitude", "Latitude Lux", "Trailhawk", "Limited", "High Altitude"],
  
  "RX": ["RX 350", "RX 350 F Sport", "RX 350L", "RX 450h", "RX 450h F Sport", "RX 500h", "RX 450h+", "RX 350h", "RX 350 F Sport Handling"],
  "ES": ["ES 250", "ES 250 F Sport", "ES 350", "ES 350 F Sport", "ES 300h", "ES 300h F Sport", "ES 300h Luxury", "ES 300h Ultra Luxury"],
  "NX": ["NX 250", "NX 350", "NX 350h", "NX 450h+", "NX 350 F Sport", "NX 450h+ F Sport"],
  "LS": ["LS 500", "LS 500 F Sport", "LS 500h", "LS 500h F Sport"],
  "LX": ["LX 600", "LX 600 Premium", "LX 600 F Sport", "LX 600 Luxury", "LX 600 Ultra Luxury"],
  
  "C-Class": ["C 300", "C 300 4MATIC", "AMG C 43", "AMG C 63", "AMG C 63 S", "C 300e", "C 350e"],
  "E-Class": ["E 350", "E 350 4MATIC", "E 450", "E 450 4MATIC", "AMG E 53", "AMG E 63 S", "E 350e", "E 450e"],
  "S-Class": ["S 500", "S 500 4MATIC", "S 580", "S 580 4MATIC", "AMG S 63", "Maybach S 580", "Maybach S 680"],
  "GLE": ["GLE 350", "GLE 350 4MATIC", "GLE 450 4MATIC", "GLE 580 4MATIC", "AMG GLE 53", "AMG GLE 63 S", "GLE 350e", "GLE 400e"],
  "EQS": ["EQS 450+", "EQS 580 4MATIC", "AMG EQS 53", "EQS SUV 450+", "EQS SUV 580 4MATIC"],
  
  "Model 3": ["Standard Range", "Long Range", "Performance", "RWD", "AWD", "Long Range AWD"],
  "Model Y": ["RWD", "Long Range", "Performance", "Long Range AWD"],
  "Model S": ["Standard Range", "Long Range", "Plaid", "Plaid+"],
  "Model X": ["Long Range", "Plaid"],
  "Cybertruck": ["RWD", "Dual Motor AWD", "Tri Motor AWD", "Cyberbeast"],
  
  "Outback": ["Base", "Premium", "Onyx Edition", "Onyx Edition XT", "Limited", "Touring", "Wilderness", "Limited XT", "Touring XT"],
  "Forester": ["Base", "Premium", "Sport", "Limited", "Touring", "Wilderness", "Wilderness Touring"],
  "Crosstrek": ["Base", "Premium", "Sport", "Limited", "Hybrid", "Wilderness", "Special Edition"],
  "WRX": ["Base", "Premium", "Limited", "GT", "STI", "STI Limited", "STI Series.White"],
  "BRZ": ["Premium", "Limited", "tS", "Series.Yellow", "Series.Gray", "Series.White"]
};

const VehicleForm = () => {
  const { formData, updateVehicle, addVehicle, removeVehicle, nextStep } = useQuoteForm();
  const { vehicles } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTrim, setCustomTrim] = useState<Record<string, string>>({});

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

  const handleNext = () => {
    if (validateVehicles()) {
      nextStep();
    }
  };

  const getModelsForMake = (make: string) => {
    return make ? MODELS_BY_MAKE[make] || [] : [];
  };

  const getTrimsForModel = (model: string) => {
    const modelTrims = model ? TRIMS_BY_MODEL[model] || [] : [];
    
    if (modelTrims.length === 0 || !modelTrims.includes("Trim not listed")) {
      return [...modelTrims, "Trim not listed"];
    }
    
    return modelTrims;
  };

  const handleCustomTrimChange = (vehicleId: string, value: string) => {
    setCustomTrim(prev => ({...prev, [vehicleId]: value}));
    updateVehicle(vehicleId, { trim: value });
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
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <Label htmlFor={`${vehicle.id}-year`} className="mb-1 block">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={vehicle.year}
                  onValueChange={(value) => updateVehicle(vehicle.id, { year: value })}
                >
                  <SelectTrigger id={`${vehicle.id}-year`} className={errors[`${vehicle.id}-year`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select year" />
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
                  <p className="text-red-500 text-sm mt-1">{errors[`${vehicle.id}-year`]}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor={`${vehicle.id}-make`} className="mb-1 block">
                  Make <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={vehicle.make}
                  onValueChange={(value) => {
                    updateVehicle(vehicle.id, { make: value, model: "", trim: "" });
                  }}
                >
                  <SelectTrigger id={`${vehicle.id}-make`} className={errors[`${vehicle.id}-make`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select make" />
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
                  <p className="text-red-500 text-sm mt-1">{errors[`${vehicle.id}-make`]}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor={`${vehicle.id}-model`} className="mb-1 block">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={vehicle.model}
                  onValueChange={(value) => {
                    updateVehicle(vehicle.id, { model: value, trim: "" });
                    setCustomTrim(prev => ({ ...prev, [vehicle.id]: "" }));
                  }}
                  disabled={!vehicle.make}
                >
                  <SelectTrigger id={`${vehicle.id}-model`} className={errors[`${vehicle.id}-model`] ? "border-red-500" : ""}>
                    <SelectValue placeholder={vehicle.make ? "Select model" : "Select make first"} />
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
                  <p className="text-red-500 text-sm mt-1">{errors[`${vehicle.id}-model`]}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor={`${vehicle.id}-trim`} className="mb-1 block">
                  Trim (Optional)
                </Label>
                <Select
                  value={vehicle.trim || ""}
                  onValueChange={(value) => {
                    if (value === "Trim not listed") {
                      updateVehicle(vehicle.id, { trim: "" });
                      setCustomTrim(prev => ({ ...prev, [vehicle.id]: "" }));
                    } else {
                      updateVehicle(vehicle.id, { trim: value });
                      setCustomTrim(prev => ({ ...prev, [vehicle.id]: "" }));
                    }
                  }}
                  disabled={!vehicle.model}
                >
                  <SelectTrigger id={`${vehicle.id}-trim`}>
                    <SelectValue placeholder={vehicle.model ? "Select trim (optional)" : "Select model first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getTrimsForModel(vehicle.model).map((trim) => (
                      <SelectItem key={trim} value={trim}>
                        {trim}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {vehicle.trim === "Trim not listed" && (
                  <div className="mt-2">
                    <Input
                      id={`${vehicle.id}-custom-trim`}
                      placeholder="Enter your trim"
                      value={customTrim[vehicle.id] || ""}
                      onChange={(e) => handleCustomTrimChange(vehicle.id, e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="form-group md:col-span-2">
                <Label htmlFor={`${vehicle.id}-usage`} className="mb-1 block">
                  Vehicle Usage <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Select
                    value={vehicle.usage}
                    onValueChange={(value) => updateVehicle(vehicle.id, { usage: value as VehicleUsage })}
                  >
                    <SelectTrigger id={`${vehicle.id}-usage`}>
                      <SelectValue placeholder="Select usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Rideshare">Rideshare (Uber, Lyft, etc.)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="ml-2">
                    <HelpCircle 
                      className="h-5 w-5 text-insurance-text-light cursor-help" 
                      aria-label="How you primarily use this vehicle will affect your quote." 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          className="text-insurance-text border-insurance-accent hover:bg-insurance-accent/10"
          onClick={() => addVehicle()}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Another Vehicle
        </Button>
        <Button 
          type="button"
          className="bg-insurance-primary hover:bg-insurance-primary/90"
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default VehicleForm;
