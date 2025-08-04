import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Bell, 
  Globe, 
  Download, 
  HelpCircle, 
  Phone, 
  Settings2,
  User,
  Shield,
  Smartphone
} from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [language, setLanguage] = useState("english");

  return (
    <main className="pb-20 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        
        {/* Profile Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="text-primary mr-2" size={20} />
              Profile
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Farmer Name</p>
                  <p className="text-sm text-gray-600">Not set</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Farm Location</p>
                  <p className="text-sm text-gray-600">Nandi County</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Coffee Variety</p>
                  <p className="text-sm text-gray-600">Arabica</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Globe className="text-primary mr-2" size={20} />
              Language & Region
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Display Language</p>
                  <p className="text-sm text-gray-600">Choose your preferred language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                    <SelectItem value="kalenjin">Kalenjin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Region</p>
                  <p className="text-sm text-gray-600">Nandi County, Kenya</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Bell className="text-primary mr-2" size={20} />
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Disease Alerts</p>
                  <p className="text-sm text-gray-600">Get notified about disease outbreaks</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Weather Updates</p>
                  <p className="text-sm text-gray-600">Receive weather-based farming tips</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Seasonal Reminders</p>
                  <p className="text-sm text-gray-600">Farming calendar notifications</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Settings2 className="text-primary mr-2" size={20} />
              App Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Offline Mode</p>
                  <p className="text-sm text-gray-600">Use app without internet connection</p>
                </div>
                <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Auto-sync Data</p>
                  <p className="text-sm text-gray-600">Sync when internet is available</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Data Usage</p>
                  <p className="text-sm text-gray-600">Optimize for low data usage</p>
                </div>
                <Switch checked={false} onCheckedChange={() => {}} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="text-primary mr-2" size={20} />
              Data & Privacy
            </h2>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2" size={16} />
                Export My Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2" size={16} />
                Download Offline Content
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support & Help */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <HelpCircle className="text-primary mr-2" size={20} />
              Support & Help
            </h2>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="mr-2" size={16} />
                Help Center
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2" size={16} />
                Contact Support
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="mr-2" size={16} />
                App Tutorial
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">App Information</h2>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span>Today</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Used</span>
                <span>2.4 MB</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Coffee AI Assistant for Nandi Region Farmers
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
