import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Calendar, Camera, Mic, FileText } from "lucide-react";
import DiagnosisCard from "@/components/DiagnosisCard";
import type { Diagnosis } from "@shared/schema";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");

  const { data: diagnoses, isLoading } = useQuery<Diagnosis[]>({
    queryKey: ["/api/diagnoses"],
  });

  const filteredDiagnoses = diagnoses?.filter((diagnosis) => {
    const matchesSearch = !searchTerm || 
      diagnosis.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = !selectedSeverity || diagnosis.severity === selectedSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const getDiagnosisMethodIcon = (method: string) => {
    switch (method) {
      case "image":
        return <Camera className="text-blue-500" size={16} />;
      case "voice":
        return <Mic className="text-orange-500" size={16} />;
      case "text":
        return <FileText className="text-green-500" size={16} />;
      default:
        return <FileText className="text-gray-500" size={16} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High Risk":
        return "bg-red-500";
      case "Medium Risk":
        return "bg-orange-500";
      case "Low Risk":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const severityOptions = ["High Risk", "Medium Risk", "Low Risk"];

  return (
    <main className="pb-20 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Diagnosis History</h1>
        
        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by disease name or symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Severity Filter */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by Severity:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedSeverity === "" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedSeverity("")}
                  >
                    All
                  </Badge>
                  {severityOptions.map((severity) => (
                    <Badge
                      key={severity}
                      variant={selectedSeverity === severity ? "default" : "outline"}
                      className={`cursor-pointer ${selectedSeverity === severity ? getSeverityColor(severity) : ""}`}
                      onClick={() => setSelectedSeverity(severity)}
                    >
                      {severity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {diagnoses && diagnoses.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{diagnoses.length}</p>
                  <p className="text-sm text-gray-600">Total Diagnoses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {diagnoses.filter(d => d.severity === "High Risk").length}
                  </p>
                  <p className="text-sm text-gray-600">High Risk</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {diagnoses.filter(d => d.severity === "Medium Risk").length}
                  </p>
                  <p className="text-sm text-gray-600">Medium Risk</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {diagnoses.filter(d => d.severity === "Low Risk").length}
                  </p>
                  <p className="text-sm text-gray-600">Low Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnoses List */}
        <div>
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">Loading diagnosis history...</p>
              </CardContent>
            </Card>
          ) : filteredDiagnoses && filteredDiagnoses.length > 0 ? (
            <div className="space-y-4">
              {filteredDiagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="relative">
                  <DiagnosisCard diagnosis={diagnosis} showFullDetails />
                  {/* Method indicator */}
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-sm">
                    {getDiagnosisMethodIcon(diagnosis.diagnosisMethod)}
                    <span className="text-xs text-gray-600 capitalize">{diagnosis.diagnosisMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDiagnoses ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Search className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No diagnoses found matching your criteria.</p>
                  {searchTerm && (
                    <p className="text-sm text-gray-400 mt-2">
                      Try adjusting your search terms or filters.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No diagnosis history yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Start diagnosing your coffee plants to build your history.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
