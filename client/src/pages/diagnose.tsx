import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Mic, Search, Edit3, Brain } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import VoiceRecorder from "@/components/VoiceRecorder";
import DiagnosisCard from "@/components/DiagnosisCard";
import type { Diagnosis } from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import { useToast } from "@/hooks/use-toast";

export default function Diagnose() {
  const [symptomDescription, setSymptomDescription] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: diagnoses, isLoading } = useQuery<Diagnosis[]>({
    queryKey: ["/api/diagnoses"],
  });

  const diagnosisMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create diagnosis");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diagnoses"] });
      setSymptomDescription("");
      setUploadedImageUrl("");
      toast({
        title: "Diagnosis Complete",
        description: "Your coffee plant has been analyzed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const { uploadURL } = await response.json();
    return {
      method: "PUT" as const,
      url: uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful[0]) {
      const uploadURL = result.successful[0].uploadURL as string;
      const response = await fetch("/api/plant-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL: uploadURL }),
      });
      const { objectPath } = await response.json();
      setUploadedImageUrl(objectPath);
      toast({
        title: "Image Ready for AI Analysis",
        description: "Your plant photo is ready. The AI will analyze it when you submit for diagnosis.",
      });
    }
  };

  const handleAnalyzeSymptoms = () => {
    if (!symptomDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe the symptoms you're observing.",
        variant: "destructive",
      });
      return;
    }
    
    diagnosisMutation.mutate({
      symptoms: symptomDescription,
      diagnosisMethod: uploadedImageUrl ? "image" : "text",
      imageUrl: uploadedImageUrl || null,
    });
  };

  const handleVoiceRecordingComplete = (transcript: string) => {
    diagnosisMutation.mutate({
      symptoms: transcript,
      diagnosisMethod: "voice",
      voiceRecordingUrl: null, // Voice recordings would be stored separately
    });
  };

  return (
    <main className="pb-20 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Plant Diagnosis</h1>
        
        {/* Diagnosis Input Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">How can we help diagnose your coffee plant?</h2>
            
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Camera className="text-gray-400 mb-3 mx-auto" size={48} />
                <h3 className="font-medium text-gray-700 mb-2">AI Plant Disease Detection</h3>
                
                {/* AI Analysis Banner */}
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 text-left">
                  <div className="flex items-start space-x-2">
                    <Brain className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Advanced AI Vision Analysis</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Our AI system analyzes your plant photos to identify diseases with high accuracy. 
                        Take clear photos of affected leaves, berries, or stems for best results.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">Take a clear photo of the affected plant parts</p>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={10485760}
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  buttonClassName="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Camera className="mr-2" size={16} />
                  Choose Photo
                </ObjectUploader>
                {uploadedImageUrl && (
                  <p className="text-sm text-green-600 mt-2">✓ Image uploaded successfully</p>
                )}
              </div>

              {/* Voice Recording */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Mic className="text-orange-500 mb-3 mx-auto" size={48} />
                <h3 className="font-medium text-gray-700 mb-2">Voice Description</h3>
                <p className="text-sm text-gray-500 mb-4">Describe symptoms in your local language</p>
                <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
              </div>

              {/* Text Input */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Edit3 className="text-secondary mr-2" size={20} />
                  Describe the Problem
                </h3>
                <Textarea 
                  className="w-full mb-4" 
                  rows={4} 
                  placeholder="Describe what you're seeing on your coffee plants... (e.g., brown spots on leaves, wilting branches, insects)"
                  value={symptomDescription}
                  onChange={(e) => setSymptomDescription(e.target.value)}
                />
                <Button 
                  onClick={handleAnalyzeSymptoms}
                  className="bg-secondary text-white hover:bg-green-500"
                  disabled={!symptomDescription.trim() || diagnosisMutation.isPending}
                >
                  <Search className="mr-2" size={16} />
                  {diagnosisMutation.isPending ? "Analyzing..." : "Analyze Symptoms"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Previous Diagnoses</h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">Loading diagnoses...</p>
              </CardContent>
            </Card>
          ) : diagnoses && diagnoses.length > 0 ? (
            <div className="space-y-4">
              {diagnoses.map((diagnosis) => (
                <DiagnosisCard key={diagnosis.id} diagnosis={diagnosis} showFullDetails />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500 text-center">No diagnoses yet. Start by describing your coffee plant symptoms above.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
