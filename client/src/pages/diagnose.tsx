import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Mic, Search, Edit3, Brain } from "lucide-react";
import VoiceRecorder from "@/components/VoiceRecorder";
import DiagnosisCard from "@/components/DiagnosisCard";
import type { Diagnosis } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Use the environment variable you configured on Render for the AI backend URL.
const H5_BACKEND_URL = import.meta.env.VITE_H5_BACKEND_URL;

export default function Diagnose() {
  const [symptomDescription, setSymptomDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      setImageFile(null); // Clear the image file
      toast({
        title: "Diagnosis Complete",
        description: "Your coffee plant has been analyzed successfully.",
      });
    },
    onError: (error) => {
      console.error("Diagnosis mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    },
  });

  // New function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      toast({
        title: "Image Selected",
        description: `${event.target.files[0].name} is ready for AI analysis.`,
      });
    }
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptomDescription.trim() && !imageFile) {
      toast({
        title: "Missing Information",
        description: "Please describe the symptoms or upload an image.",
        variant: "destructive",
      });
      return;
    }
    
    let aiPrediction = "No image provided for AI analysis.";
    if (imageFile) {
      // Create a FormData object to send the image file directly
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        if (!H5_BACKEND_URL) {
          throw new Error("AI backend URL is not configured.");
        }
        
        const apiResponse = await fetch(`${H5_BACKEND_URL}/predict`, {
          method: 'POST',
          body: formData,
        });

        if (!apiResponse.ok) {
          throw new Error('AI analysis failed. Server returned an error.');
        }

        const data = await apiResponse.json();
        aiPrediction = data.prediction;

      } catch (error) {
        console.error("Error during AI analysis:", error);
        toast({
          title: "AI Analysis Failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
        return;
      }
    }

    diagnosisMutation.mutate({
      symptoms: symptomDescription,
      diagnosisMethod: imageFile ? "image" : "text",
      imageUrl: null, // No image URL, as it's not saved to storage
      // The `aiPrediction` from the Python backend is now saved as the `diseaseName`.
      diseaseName: aiPrediction,
    });
  };

  const handleVoiceRecordingComplete = (transcript: string) => {
    diagnosisMutation.mutate({
      symptoms: transcript,
      diagnosisMethod: "voice",
      voiceRecordingUrl: null,
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
              {/* Image Upload - now with a simple file input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Camera className="text-gray-400 mb-3 mx-auto" size={48} />
                <h3 className="font-medium text-gray-700 mb-2">AI Plant Disease Detection</h3>
                
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
                <div className="relative">
                  <Button asChild className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Camera className="mr-2" size={16} />
                      Choose Photo
                    </label>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </div>
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">✓ {imageFile.name} is ready</p>
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
                  disabled={!symptomDescription.trim() && !imageFile || diagnosisMutation.isPending}
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
