import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Link } from "wouter";
import { 
  Camera, 
  Mic, 
  Search, 
  Calendar, 
  CloudSun, 
  Leaf, 
  Check, 
  AlertTriangle, 
  Info,
  Phone,
  Users,
  Hospital,
  Edit3
} from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import VoiceRecorder from "@/components/VoiceRecorder";
import DiagnosisCard from "@/components/DiagnosisCard";
import type { Diagnosis, FarmingTip, EmergencyContact } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

export default function Home() {
  const [symptomDescription, setSymptomDescription] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: diagnoses, isLoading: diagnosesLoading } = useQuery<Diagnosis[]>({
    queryKey: ["/api/diagnoses"],
  });

  const { data: farmingTips, isLoading: tipsLoading } = useQuery<FarmingTip[]>({
    queryKey: ["/api/farming-tips", "flowering"],
  });

  const { data: emergencyContacts, isLoading: contactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
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
      
      // Automatically analyze the uploaded image
      await handleImageAnalysis(objectPath);
    }
  };

  const handleImageAnalysis = async (imageUrl: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: "Image uploaded for analysis",
          diagnosisMethod: "image",
          imageUrl: imageUrl,
        }),
      });
      
      if (response.ok) {
        // Refresh diagnoses list to show new result
        window.location.reload();
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceAnalysis = async (transcript: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: transcript,
          diagnosisMethod: "voice",
          voiceRecordingUrl: null,
        }),
      });
      
      if (response.ok) {
        // Refresh diagnoses list to show new result
        window.location.reload();
      }
    } catch (error) {
      console.error("Error analyzing voice:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptomDescription.trim()) return;
    
    try {
      const response = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptomDescription,
          diagnosisMethod: "text",
          imageUrl: uploadedImageUrl || null,
        }),
      });
      
      if (response.ok) {
        // Reset form
        setSymptomDescription("");
        setUploadedImageUrl("");
        // Refresh diagnoses list
        window.location.reload();
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case "extension":
        return <Phone className="text-primary" size={20} />;
      case "cooperative":
        return <Users className="text-secondary" size={20} />;
      case "veterinary":
        return <Hospital className="text-red-500" size={20} />;
      default:
        return <Phone className="text-primary" size={20} />;
    }
  };

  return (
    <main className="pb-20">
      {/* Install App Banner */}
      <section className="p-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-4 mb-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">📱 Install on Your Phone</h2>
              <p className="text-sm opacity-90">Get offline access and faster diagnosis</p>
            </div>
            <Button 
              className="bg-white text-green-600 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg"
              onClick={() => {
                // Try to trigger PWA install prompt
                if (window.deferredPrompt) {
                  window.deferredPrompt.prompt();
                } else {
                  // Show manual install instructions
                  alert(`To install this app on your Android:

📱 Chrome Browser:
1. Tap menu (3 dots) in top-right
2. Look for "Install app" or "Add to Home screen" 
3. Tap it and confirm

📱 Alternative:
- Look for install icon ⬇️ in address bar
- Firefox: Menu → "Install"
- Samsung Internet: Menu → "Add to Home screen"

The app will appear on your home screen like WhatsApp or other apps!`);
                }
              }}
            >
              Install Now
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Diagnosis Section */}
      <section className="p-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-stethoscope text-primary mr-3"></i>
            Quick Diagnosis
          </h2>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <Camera className="text-3xl text-gray-400 mb-3 mx-auto" size={48} />
              <h3 className="font-medium text-gray-700 mb-2">Upload Plant Photo</h3>
              <p className="text-sm text-gray-500 mb-3">Take or upload a photo of affected plant parts</p>
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
              {uploadedImageUrl && !isAnalyzing && (
                <p className="text-sm text-green-600 mt-2">✓ Image uploaded and analyzed successfully</p>
              )}
              {isAnalyzing && (
                <p className="text-sm text-blue-600 mt-2">🔍 Analyzing your coffee plant image...</p>
              )}
            </div>

            {/* Voice Recording */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Mic className="text-3xl text-orange-500 mb-3 mx-auto" size={48} />
              <h3 className="font-medium text-gray-700 mb-2">Voice Description</h3>
              <p className="text-sm text-gray-500 mb-4">Describe symptoms in your local language</p>
              <VoiceRecorder onRecordingComplete={handleVoiceAnalysis} />
              {isAnalyzing && (
                <p className="text-sm text-blue-600 mt-2">🎙️ Processing voice recording and analyzing symptoms...</p>
              )}
            </div>

            {/* Text Input */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <Edit3 className="text-secondary mr-2" size={20} />
                Describe the Problem
              </h3>
              <Textarea 
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                rows={4} 
                placeholder="Describe what you're seeing on your coffee plants..."
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
              />
              <Button 
                onClick={handleAnalyzeSymptoms}
                className="mt-3 bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-colors"
                disabled={!symptomDescription.trim()}
              >
                <Search className="mr-2" size={16} />
                Analyze Symptoms
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Diagnosis Results */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Diagnosis</h2>
        
        {diagnosesLoading ? (
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-500">Loading diagnoses...</p>
          </div>
        ) : diagnoses && diagnoses.length > 0 ? (
          diagnoses.slice(0, 3).map((diagnosis) => (
            <DiagnosisCard key={diagnosis.id} diagnosis={diagnosis} />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-500">No diagnoses yet. Start by describing your coffee plant symptoms above.</p>
          </div>
        )}
      </section>

      {/* Farming Guidance */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Farming Guidance</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Link href="/guide">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <Calendar className="text-2xl text-primary mb-3 mx-auto" size={32} />
                <h3 className="font-medium text-gray-800 mb-1">Seasonal Calendar</h3>
                <p className="text-xs text-gray-600">Planting & harvest times</p>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <CloudSun className="text-2xl text-orange-500 mb-3 mx-auto" size={32} />
              <h3 className="font-medium text-gray-800 mb-1">Weather Advice</h3>
              <p className="text-xs text-gray-600">Current conditions</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Season Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Leaf className="text-secondary mr-2" size={20} />
            Current Season: Flowering Period
          </h3>
          
          {tipsLoading ? (
            <p className="text-gray-500">Loading tips...</p>
          ) : farmingTips && farmingTips.length > 0 ? (
            <div className="space-y-4">
              {farmingTips.map((tip) => (
                <div key={tip.id} className="flex items-start space-x-3">
                  <div className={`rounded-full p-2 mt-1 ${
                    tip.priority === "high" ? "bg-green-500" : 
                    tip.priority === "medium" ? "bg-orange-500" : "bg-blue-500"
                  } text-white`}>
                    {tip.priority === "high" ? <Check size={12} /> :
                     tip.priority === "medium" ? <AlertTriangle size={12} /> : <Info size={12} />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No seasonal tips available.</p>
          )}
        </div>
      </section>

      {/* Prevention Tips */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Prevention Tips</h2>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <div className="border-l-4 border-secondary pl-4">
              <h4 className="font-medium text-gray-800 mb-1">Proper Plant Spacing</h4>
              <p className="text-sm text-gray-600">Maintain 2-3 meters between coffee trees to improve air circulation and reduce fungal diseases</p>
            </div>
            
            <div className="border-l-4 border-secondary pl-4">
              <h4 className="font-medium text-gray-800 mb-1">Regular Pruning</h4>
              <p className="text-sm text-gray-600">Remove dead branches and suckers to prevent pest infestations</p>
            </div>
            
            <div className="border-l-4 border-secondary pl-4">
              <h4 className="font-medium text-gray-800 mb-1">Organic Mulching</h4>
              <p className="text-sm text-gray-600">Use coffee pulp and banana leaves to retain moisture and suppress weeds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contacts</h2>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          {contactsLoading ? (
            <p className="text-gray-500">Loading contacts...</p>
          ) : emergencyContacts && emergencyContacts.length > 0 ? (
            <div className="space-y-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getContactIcon(contact.contactType)}
                    <div>
                      <h4 className="font-medium text-gray-800">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.organization}</p>
                    </div>
                  </div>
                  <Button 
                    className={`px-3 py-1 text-sm ${
                      contact.contactType === "extension" ? "bg-primary hover:bg-green-700" :
                      contact.contactType === "cooperative" ? "bg-secondary hover:bg-green-500" :
                      "bg-red-500 hover:bg-red-600"
                    } text-white`}
                    onClick={() => window.open(`tel:${contact.phoneNumber}`)}
                  >
                    {contact.contactType === "veterinary" ? "Emergency" : 
                     contact.contactType === "cooperative" ? "Contact" : "Call Now"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No emergency contacts available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
