"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { bulkImportMembers, ImportMemberData } from "@/actions/admin/member-import-actions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Loader2,
  Users,
  Database
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SECURITY } from "@/lib/constants";

interface MemberImportClientProps {
  branchId: string | null;
  branches?: any[];
}

export function MemberImportClient({ branchId: initialBranchId, branches = [] }: MemberImportClientProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId || "");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    total: number;
    success: number;
    failed: number;
    duplicates: number;
    errors: string[];
  } | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);
    setResults(null);

    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        processData(jsonData);
      };
      reader.readAsBinaryString(file);
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          processData(results.data);
        },
        error: (error) => {
          toast.error("Failed to parse CSV: " + error.message);
          setIsProcessing(false);
        }
      });
    }
  };

  const processData = async (data: any[]) => {
    if (!data || data.length === 0) {
      toast.error("The file is empty or invalid");
      setIsProcessing(false);
      return;
    }

    // Normalize keys (remove spaces, BOM, non-alphanumeric, to lowercase)
    const normalizedData = data.map(item => {
      const normalized: any = {};
      Object.keys(item).forEach(key => {
        // Remove BOM and other non-visible characters, then clean
        const cleanKey = key.toString().replace(/[^\x20-\x7E]/g, '').trim().replace(/\s+/g, '').toLowerCase();
        
        // Map common variations to our expected keys
        if (cleanKey === "firstname" || cleanKey === "first_name" || cleanKey === "name") {
          normalized.firstName = item[key];
        } else if (cleanKey === "lastname" || cleanKey === "last_name" || cleanKey === "surname") {
          normalized.lastName = item[key];
        } else if (cleanKey === "email" || cleanKey === "emailaddress") {
          normalized.email = item[key];
        } else if (cleanKey === "phone" || cleanKey === "mobile" || cleanKey === "contact") {
          normalized.phone = item[key];
        } else if (cleanKey === "gender" || cleanKey === "sex") {
          normalized.gender = item[key];
        } else if (cleanKey === "dateofbirth" || cleanKey === "dob" || cleanKey === "birthdate") {
          normalized.dateOfBirth = item[key];
        } else if (cleanKey === "bloodgroup" || cleanKey === "bloodtype") {
          normalized.bloodGroup = item[key];
        } else if (cleanKey === "address") {
          normalized.address = item[key];
        } else if (cleanKey === "city") {
          normalized.city = item[key];
        } else if (cleanKey === "state") {
          normalized.state = item[key];
        } else if (cleanKey === "pincode" || cleanKey === "zip" || cleanKey === "postalcode") {
          normalized.pincode = item[key];
        }
      });
      return normalized;
    });

    // Check if mandatory headers were found in the data (check at least one row)
    const hasMandatory = normalizedData.some(row => row.firstName && row.lastName && row.email);
    
    if (!hasMandatory) {
      toast.error("Could not detect mandatory columns (First Name, Last Name, Email). Please check your file headers.");
      setIsProcessing(false);
      return;
    }

    setProgress(30);
    
    try {
      if (!selectedBranchId) {
        toast.error("Please select a target branch first");
        setIsProcessing(false);
        return;
      }
      const response = await bulkImportMembers(normalizedData, selectedBranchId);
      
      if (response.success && response.results) {
        setResults(response.results);
        setProgress(100);
        toast.success(`Import complete: ${response.results.success} added, ${response.results.duplicates} skipped`);
      } else {
        toast.error(response.error || "Import failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during import");
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    multiple: false,
    disabled: isProcessing
  });

  const downloadTemplate = () => {
    const headers = "firstName,lastName,email,phone,gender,dateOfBirth,bloodGroup,address,city,state,pincode\n";
    const sample = "John,Doe,john@example.com,9876543210,MALE,1990-01-01,O+,123 Main St,Mumbai,Maharashtra,400001\n";
    const blob = new Blob([headers + sample], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "member_import_template.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Users className="h-6 w-6 text-primary" />
                Bulk Member Import
              </CardTitle>
              <CardDescription>
                Onboard thousands of members instantly via CSV or Excel.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {branches.length > 0 && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="branch-select" className="text-xs font-bold whitespace-nowrap">Target Branch:</Label>
                  <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                    <SelectTrigger id="branch-select" className="w-[200px] bg-muted/30 h-9">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all
              ${isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}
              ${isProcessing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="font-semibold">Processing Records...</p>
                    <p className="text-sm text-muted-foreground">Please wait, do not refresh the page.</p>
                  </div>
                  <Progress value={progress} className="h-2 w-64" />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center gap-4"
                >
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      {isDragActive ? "Drop the file here" : "Click or drag CSV/Excel file to upload"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Maximum 5,000 members per import for optimal speed.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4"
            >
              <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-background/50 p-4 shadow-sm">
                <Database className="mb-2 h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{results.total}</span>
                <span className="text-xs font-medium uppercase text-muted-foreground">Total Analyzed</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-background/50 p-4 shadow-sm">
                <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-500" />
                <span className="text-2xl font-bold text-emerald-500">{results.success}</span>
                <span className="text-xs font-medium uppercase text-muted-foreground">Successfully Added</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-background/50 p-4 shadow-sm">
                <Users className="mb-2 h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-amber-500">{results.duplicates}</span>
                <span className="text-xs font-medium uppercase text-muted-foreground">Existing/Skipped</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-background/50 p-4 shadow-sm">
                <AlertCircle className="mb-2 h-5 w-5 text-rose-500" />
                <span className="text-2xl font-bold text-rose-500">{results.failed}</span>
                <span className="text-xs font-medium uppercase text-muted-foreground">Failed Records</span>
              </div>
            </motion.div>
          )}

          {results && results.errors.length > 0 && (
            <div className="mt-6 rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-rose-500">
                <AlertCircle className="h-4 w-4" />
                Error Summary
              </h4>
              <ul className="max-h-32 space-y-1 overflow-y-auto text-sm text-muted-foreground">
                {results.errors.slice(0, 10).map((err, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-rose-500" />
                    {err}
                  </li>
                ))}
                {results.errors.length > 10 && (
                  <li className="italic text-muted-foreground">
                    and {results.errors.length - 10} more errors...
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">CSV Formatting Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5 shrink-0">Required</Badge>
              <p><span className="font-semibold text-foreground">firstName, lastName, email</span> are mandatory for every row.</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5 shrink-0">Optional</Badge>
              <p>phone, gender (MALE/FEMALE), dateOfBirth (YYYY-MM-DD), address, city, state, pincode.</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5 shrink-0">Constraint</Badge>
              <p>Emails and Phone numbers must be unique across the entire portal.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Post-Import Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>1. Members can log in using their email and their randomly generated temporary password.</p>
            <p>2. They will be prompted to update their profile and set a custom password on their first login.</p>
            <p>3. All imported members are assigned to the currently selected branch.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
