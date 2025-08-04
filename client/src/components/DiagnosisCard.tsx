import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, AlertTriangle, Camera, Brain } from "lucide-react";
import type { Diagnosis } from "@shared/schema";

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  showFullDetails?: boolean;
}

export default function DiagnosisCard({ diagnosis, showFullDetails = false }: DiagnosisCardProps) {
  const [isExpanded, setIsExpanded] = useState(showFullDetails);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High Risk":
        return "bg-red-500 text-white";
      case "Medium Risk":
        return "bg-orange-500 text-white";
      case "Low Risk":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Disease Image Placeholder */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {diagnosis.imageUrl ? (
              <img 
                src={diagnosis.imageUrl} 
                alt="Disease symptoms" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <AlertTriangle className="text-gray-400" size={24} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">{diagnosis.diseaseName}</h3>
              <Badge className={`text-xs px-2 py-1 ${getSeverityColor(diagnosis.severity)}`}>
                {diagnosis.severity}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{diagnosis.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formatDate(diagnosis.createdAt)}
                </div>
                {diagnosis.diagnosisMethod === "image" && (
                  <div className="flex items-center">
                    <Camera size={12} className="mr-1 text-blue-500" />
                    <span className="text-blue-600">AI Vision</span>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary text-sm font-medium"
              >
                {isExpanded ? (
                  <>
                    Hide Details <ChevronUp className="ml-1" size={16} />
                  </>
                ) : (
                  <>
                    View Treatment <ChevronDown className="ml-1" size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            {/* AI Confidence and Analysis (for image-based diagnoses) */}
            {diagnosis.diagnosisMethod === "image" && diagnosis.confidence && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <Brain className="mr-2" size={16} />
                    AI Analysis Confidence
                  </h4>
                  <span className="text-sm font-medium text-blue-700">
                    {Math.round(parseFloat(diagnosis.confidence) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={parseFloat(diagnosis.confidence) * 100} 
                  className="h-2 mb-2"
                />
                {diagnosis.analysisNotes && (
                  <p className="text-xs text-blue-700">{diagnosis.analysisNotes}</p>
                )}
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Symptoms Described:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {diagnosis.symptoms}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Recommended Treatment:</h4>
              <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                {diagnosis.treatment}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Prevention Tips:</h4>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                {diagnosis.prevention}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Diagnosis Method: {diagnosis.diagnosisMethod}</span>
              <span>Created: {new Date(diagnosis.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
