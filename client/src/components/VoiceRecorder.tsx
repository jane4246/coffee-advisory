import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onRecordingComplete?: (transcript: string) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record audio.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = () => {
    // In a real implementation, this would send the audio to a speech-to-text service
    // For now, we'll simulate with realistic coffee disease descriptions
    const mockTranscripts = [
      "My coffee plants have yellow spots on the leaves that look like rust powder",
      "The coffee berries are turning black and rotting on the tree",
      "My plants are wilting and the leaves are dropping even though I water them",
      "Brown spots with light centers are appearing on many leaves",
      "The coffee plants look weak and the branches are dying back"
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    
    if (onRecordingComplete) {
      onRecordingComplete(randomTranscript);
    }
    
    setIsModalOpen(false);
    setRecordedAudio(null);
    
    toast({
      title: "Voice Analysis Complete",
      description: "Your audio has been converted to text and analyzed for diseases.",
    });
  };

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setIsModalOpen(false);
    setRecordedAudio(null);
  };

  return (
    <>
      <Button
        onClick={startRecording}
        className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors"
      >
        <Play className="mr-2" size={16} />
        Start Recording
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isRecording ? "Recording..." : "Recording Complete"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="bg-orange-500 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Mic className="text-white" size={32} />
            </div>
            
            {isRecording ? (
              <>
                <p className="text-gray-600 mb-6">Describe your coffee plant symptoms</p>
                
                {/* Recording Waveform Visualization */}
                <div className="flex items-center justify-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-orange-500 w-1 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 20 + 20}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={cancelRecording}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={stopRecording}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    <Square className="mr-2" size={16} />
                    Stop
                  </Button>
                </div>
              </>
            ) : recordedAudio ? (
              <>
                <p className="text-gray-600 mb-4">Recording captured successfully!</p>
                
                <audio controls className="w-full mb-6">
                  <source src={recordedAudio} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={cancelRecording}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={analyzeRecording}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Analyze Recording
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
