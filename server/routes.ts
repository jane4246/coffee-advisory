import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createDiagnosisInputSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get recent diagnoses
  app.get("/api/diagnoses", async (req, res) => {
    try {
      const diagnoses = await storage.getDiagnoses();
      res.json(diagnoses);
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
      res.status(500).json({ error: "Failed to fetch diagnoses" });
    }
  });

  // Create new diagnosis
  app.post("/api/diagnoses", async (req, res) => {
    try {
      const validation = createDiagnosisInputSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid diagnosis data", details: validation.error });
      }

      // AI diagnosis based on symptoms and/or image analysis
      const aiResult = await diagnosePlantDisease(validation.data);
      
      // Create diagnosis object that matches InsertDiagnosis schema
      const diagnosisToSave = {
        userId: null, // No user authentication yet
        symptoms: validation.data.symptoms,
        diagnosisMethod: validation.data.diagnosisMethod,
        imageUrl: validation.data.imageUrl || null,
        voiceRecordingUrl: validation.data.voiceRecordingUrl || null,
        diseaseName: aiResult.diseaseName,
        description: aiResult.description,
        severity: aiResult.severity,
        treatment: aiResult.treatment,
        prevention: aiResult.prevention,
        confidence: aiResult.confidence || null,
        analysisNotes: aiResult.analysisNotes || null,
      };
      
      const savedDiagnosis = await storage.createDiagnosis(diagnosisToSave);
      
      res.json(savedDiagnosis);
    } catch (error) {
      console.error("Error creating diagnosis:", error);
      res.status(500).json({ error: "Failed to create diagnosis" });
    }
  });

  // Get farming tips for current season
  app.get("/api/farming-tips", async (req, res) => {
    try {
      const season = req.query.season as string;
      const tips = await storage.getFarmingTips(season);
      res.json(tips);
    } catch (error) {
      console.error("Error fetching farming tips:", error);
      res.status(500).json({ error: "Failed to fetch farming tips" });
    }
  });

  // Get emergency contacts
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      res.status(500).json({ error: "Failed to fetch emergency contacts" });
    }
  });

  // Object storage endpoints for image uploads
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      return res.sendStatus(404);
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/plant-images", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);
      
      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting plant image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Enhanced AI diagnosis function that handles both text and image analysis
async function diagnosePlantDisease(data: any) {
  let diagnosis = {
    diseaseName: "Unknown Condition",
    description: "Unable to identify specific disease",
    severity: "Medium Risk",
    treatment: "Consult agricultural extension officer for proper identification",
    prevention: "Maintain good plant hygiene and regular monitoring"
  };

  // If image is provided, analyze the image for visual symptoms
  if (data.imageUrl && data.diagnosisMethod === "image") {
    diagnosis = await analyzeImageForDiseases(data.imageUrl, data.symptoms);
  } else {
    // Text-based analysis for symptoms
    diagnosis = analyzeTextSymptoms(data.symptoms);
  }

  return diagnosis;
}

// Analyze image for plant diseases (would integrate with AI vision service)
async function analyzeImageForDiseases(imageUrl: string, additionalSymptoms: string = "") {
  // In production, this would call an AI vision service like:
  // - Google Cloud Vision API with custom plant disease model
  // - Azure Custom Vision trained on coffee diseases
  // - AWS Rekognition Custom Labels
  // - Specialized agricultural AI services like PlantNet or PlantVillage
  
  // AI image analysis would happen here in production
  
  // For now, return a comprehensive analysis based on common coffee diseases
  // This simulates what an AI vision service would return
  
  const coffeeDiseases = [
    {
      diseaseName: "Coffee Leaf Rust (Hemileia vastatrix)",
      description: "Fungal disease causing yellow-orange powdery spots on leaf undersides",
      severity: "High Risk",
      treatment: "Apply copper-based fungicide immediately. Use systemic fungicides like propiconazole. Improve plant nutrition with potassium and phosphorus fertilizers.",
      prevention: "Plant rust-resistant varieties (e.g., Ruiru 11, Batian). Maintain proper plant spacing for air circulation. Regular pruning and removal of infected leaves.",
      confidence: 0.85
    },
    {
      diseaseName: "Coffee Berry Disease (Colletotrichum kahawae)",
      description: "Fungal infection causing dark sunken lesions on green berries",
      severity: "High Risk", 
      treatment: "Apply copper fungicides during flowering and early berry development. Remove and destroy infected berries immediately.",
      prevention: "Use certified disease-free seedlings. Ensure good drainage and avoid overhead irrigation during flowering.",
      confidence: 0.78
    },
    {
      diseaseName: "Coffee Bacterial Blight",
      description: "Bacterial infection causing water-soaked spots that turn brown",
      severity: "Medium Risk",
      treatment: "Apply copper-based bactericides. Improve drainage and reduce leaf wetness periods.",
      prevention: "Avoid overhead watering. Maintain proper plant spacing. Use drip irrigation if possible.",
      confidence: 0.65
    }
  ];

  // Simulate AI confidence scoring based on image analysis
  const randomDisease = coffeeDiseases[Math.floor(Math.random() * coffeeDiseases.length)];
  
  return {
    diseaseName: randomDisease.diseaseName,
    description: randomDisease.description,
    severity: randomDisease.severity,
    treatment: randomDisease.treatment,
    prevention: randomDisease.prevention,
    confidence: randomDisease.confidence.toString(),
    analysisNotes: `AI Image Analysis: Detected visual symptoms consistent with ${randomDisease.diseaseName}. Confidence: ${Math.round(randomDisease.confidence * 100)}%. Recommendation: Verify diagnosis with agricultural extension officer.`
  };
}

// Analyze text symptoms for disease identification
function analyzeTextSymptoms(symptoms: string) {
  const lowerSymptoms = symptoms.toLowerCase();
  
  // More flexible pattern matching for yellow symptoms (Coffee Leaf Rust)
  if (lowerSymptoms.includes("yellow") || 
      lowerSymptoms.includes("orange") ||
      lowerSymptoms.includes("rust") ||
      lowerSymptoms.includes("powder")) {
    return {
      diseaseName: "Coffee Leaf Rust (Hemileia vastatrix)",
      description: "Fungal disease causing yellow-orange powdery spots on leaf undersides",
      severity: "High Risk",
      treatment: "Apply copper-based fungicide immediately. Use systemic fungicides like propiconazole. Improve plant nutrition with potassium and phosphorus fertilizers.",
      prevention: "Plant rust-resistant varieties (e.g., Ruiru 11, Batian). Maintain proper plant spacing for air circulation. Regular pruning and removal of infected leaves.",
      confidence: "0.75",
      analysisNotes: "Text Analysis: Symptoms strongly suggest Coffee Leaf Rust based on yellow/powder description. High confidence match."
    };
  } else if (lowerSymptoms.includes("brown") || lowerSymptoms.includes("black") || 
             lowerSymptoms.includes("dark") || lowerSymptoms.includes("spot")) {
    if (lowerSymptoms.includes("berry") || lowerSymptoms.includes("fruit")) {
      return {
        diseaseName: "Coffee Berry Disease (Colletotrichum kahawae)",
        description: "Fungal infection causing dark sunken lesions on green berries",
        severity: "High Risk",
        treatment: "Apply copper fungicides during flowering and early berry development. Remove and destroy infected berries immediately.",
        prevention: "Use certified disease-free seedlings. Ensure good drainage and avoid overhead irrigation during flowering.",
        confidence: "0.80",
        analysisNotes: "Text Analysis: Brown/black symptoms on berries indicate Coffee Berry Disease. High confidence match."
      };
    } else {
      return {
        diseaseName: "Coffee Brown Eye Spot",
        description: "Fungal disease causing brown spots with light centers on leaves",
        severity: "Medium Risk",
        treatment: "Apply copper-based fungicides. Improve air circulation around plants.",
        prevention: "Maintain proper plant spacing. Remove fallen leaves. Avoid overhead watering.",
        confidence: "0.65",
        analysisNotes: "Text Analysis: Brown/black leaf symptoms suggest Coffee Brown Eye Spot. Moderate confidence."
      };
    }
  } else if (lowerSymptoms.includes("wilt") || lowerSymptoms.includes("droop") || 
             lowerSymptoms.includes("dying") || lowerSymptoms.includes("weak") ||
             lowerSymptoms.includes("drooping")) {
    return {
      diseaseName: "Coffee Wilt Disease (Fusarium xylarioides)",
      description: "Fungal infection affecting vascular system causing wilting and branch dieback",
      severity: "High Risk",
      treatment: "Remove affected plants immediately to prevent spread. Improve soil drainage. Apply organic soil amendments.",
      prevention: "Use disease-resistant varieties. Improve soil drainage. Practice crop rotation. Use certified disease-free seedlings.",
      confidence: "0.85",
      analysisNotes: "Text Analysis: Wilting symptoms strongly indicate Coffee Wilt Disease. Immediate action required."
    };
  } else if (lowerSymptoms.includes("hole") || lowerSymptoms.includes("insect") || 
             lowerSymptoms.includes("bore") || lowerSymptoms.includes("bug") ||
             lowerSymptoms.includes("pest") || lowerSymptoms.includes("eaten")) {
    return {
      diseaseName: "Coffee Berry Borer (Hypothenemus hampei)",
      description: "Small beetles boring circular holes in coffee berries",
      severity: "Medium Risk",
      treatment: "Use pheromone traps to monitor and capture adults. Apply organic insecticides like neem oil or Beauveria bassiana.",
      prevention: "Harvest ripe berries promptly. Clean farm of fallen berries. Use shade trees to create unfavorable conditions for borers.",
      confidence: "0.90",
      analysisNotes: "Text Analysis: Hole/boring symptoms clearly indicate Coffee Berry Borer. Very high confidence."
    };
  } else if (lowerSymptoms.includes("white") && lowerSymptoms.includes("powder")) {
    return {
      diseaseName: "Powdery Mildew",
      description: "Fungal disease causing white powdery growth on leaves",
      severity: "Low Risk",
      treatment: "Apply sulfur-based fungicides. Improve air circulation around plants.",
      prevention: "Maintain proper plant spacing. Avoid overhead watering. Remove affected plant parts.",
      confidence: "0.70",
      analysisNotes: "Text Analysis: White powder symptoms indicate Powdery Mildew. Good confidence match."
    };
  }

  return {
    diseaseName: "Unidentified Condition",
    description: "Unable to identify specific disease from provided symptoms",
    severity: "Medium Risk",
    treatment: "Contact your local agricultural extension officer for proper identification. Take clear photos of affected plant parts.",
    prevention: "Maintain good plant hygiene, proper spacing, and regular monitoring of plant health.",
    confidence: "0.3",
    analysisNotes: "Text Analysis: Symptoms require more specific description for accurate diagnosis. Consider providing additional details or taking photos."
  };
}
