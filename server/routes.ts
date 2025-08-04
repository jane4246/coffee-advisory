import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDiagnosisSchema } from "@shared/schema";
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
      const validation = insertDiagnosisSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid diagnosis data", details: validation.error });
      }

      // Mock AI diagnosis based on symptoms
      const diagnosis = await mockDiagnosisAI(validation.data);
      const savedDiagnosis = await storage.createDiagnosis(diagnosis);
      
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

// Mock AI diagnosis function
async function mockDiagnosisAI(data: any) {
  // Simple keyword-based diagnosis simulation
  const symptoms = data.symptoms.toLowerCase();
  
  let diagnosis = {
    diseaseName: "Unknown Condition",
    description: "Unable to identify specific disease",
    severity: "Medium Risk",
    treatment: "Consult agricultural extension officer",
    prevention: "Maintain good plant hygiene"
  };

  if (symptoms.includes("brown") || symptoms.includes("spot")) {
    diagnosis = {
      diseaseName: "Coffee Berry Disease",
      description: "Fungal infection affecting berries and leaves",
      severity: "High Risk",
      treatment: "Apply copper-based fungicide every 2 weeks. Remove affected berries immediately.",
      prevention: "Ensure proper air circulation, avoid overhead watering, regular pruning"
    };
  } else if (symptoms.includes("yellow") || symptoms.includes("leaf")) {
    diagnosis = {
      diseaseName: "Coffee Leaf Rust",
      description: "Yellow-orange powdery spots on leaves",
      severity: "High Risk", 
      treatment: "Apply systemic fungicide. Improve nutrition with potassium and phosphorus.",
      prevention: "Plant resistant varieties, maintain proper spacing, regular fertilization"
    };
  } else if (symptoms.includes("wilt") || symptoms.includes("droop")) {
    diagnosis = {
      diseaseName: "Coffee Wilt Disease",
      description: "Fungal infection causing wilting and branch dieback",
      severity: "High Risk",
      treatment: "Remove affected plants immediately. Apply organic soil amendments.",
      prevention: "Use disease-free seedlings, improve soil drainage, crop rotation"
    };
  } else if (symptoms.includes("insect") || symptoms.includes("hole")) {
    diagnosis = {
      diseaseName: "Coffee Berry Borer",
      description: "Small beetles boring holes in coffee berries",
      severity: "Medium Risk",
      treatment: "Use pheromone traps. Apply organic insecticides like neem oil.",
      prevention: "Harvest ripe berries promptly, clean farm of fallen berries, use shade trees"
    };
  }

  return {
    ...data,
    ...diagnosis
  };
}
