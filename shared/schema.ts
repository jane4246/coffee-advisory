import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const diagnoses = pgTable("diagnoses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  diseaseName: text("disease_name").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // 'Low Risk', 'Medium Risk', 'High Risk'
  symptoms: text("symptoms").notNull(),
  treatment: text("treatment").notNull(),
  prevention: text("prevention").notNull(),
  imageUrl: text("image_url"),
  voiceRecordingUrl: text("voice_recording_url"),
  diagnosisMethod: text("diagnosis_method").notNull(), // 'image', 'voice', 'text'
  confidence: text("confidence"), // AI confidence score (0.0-1.0)
  analysisNotes: text("analysis_notes"), // Additional AI analysis details
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const farmingTips = pgTable("farming_tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  season: text("season").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  category: text("category").notNull(), // 'watering', 'fertilizing', 'pruning', 'pest_control'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  phoneNumber: text("phone_number").notNull(),
  contactType: text("contact_type").notNull(), // 'extension', 'cooperative', 'veterinary'
  isActive: text("is_active").notNull().default("true"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDiagnosisSchema = createInsertSchema(diagnoses).omit({
  id: true,
  createdAt: true,
});

export const insertFarmingTipSchema = createInsertSchema(farmingTips).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDiagnosis = z.infer<typeof insertDiagnosisSchema>;
export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertFarmingTip = z.infer<typeof insertFarmingTipSchema>;
export type FarmingTip = typeof farmingTips.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
