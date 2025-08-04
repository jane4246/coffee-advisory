import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CloudSun, 
  Droplets, 
  Scissors, 
  Bug, 
  Leaf,
  Check,
  AlertTriangle,
  Info
} from "lucide-react";
import type { FarmingTip } from "@shared/schema";

export default function Guide() {
  const { data: farmingTips, isLoading } = useQuery<FarmingTip[]>({
    queryKey: ["/api/farming-tips"],
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Check className="text-green-500" size={16} />;
      case "medium":
        return <AlertTriangle className="text-orange-500" size={16} />;
      case "low":
        return <Info className="text-blue-500" size={16} />;
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "watering":
        return <Droplets className="text-blue-500" size={20} />;
      case "fertilizing":
        return <Leaf className="text-green-500" size={20} />;
      case "pruning":
        return <Scissors className="text-purple-500" size={20} />;
      case "pest_control":
        return <Bug className="text-red-500" size={20} />;
      default:
        return <Leaf className="text-green-500" size={20} />;
    }
  };

  const groupedTips = farmingTips?.reduce((acc, tip) => {
    if (!acc[tip.season]) {
      acc[tip.season] = [];
    }
    acc[tip.season].push(tip);
    return acc;
  }, {} as Record<string, FarmingTip[]>);

  return (
    <main className="pb-20 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Coffee Farming Guide</h1>
        
        {/* Seasonal Calendar Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="text-primary mr-2" size={24} />
              Seasonal Calendar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Flowering Period (Current)</h3>
                <p className="text-sm text-green-700">March - May</p>
                <p className="text-xs text-green-600 mt-1">Monitor pests, reduce watering, apply foliar feed</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Berry Development</h3>
                <p className="text-sm text-blue-700">June - August</p>
                <p className="text-xs text-blue-600 mt-1">Increase watering, protect from pests</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Harvest Season</h3>
                <p className="text-sm text-orange-700">September - December</p>
                <p className="text-xs text-orange-600 mt-1">Pick ripe berries, process quickly</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Rest Period</h3>
                <p className="text-sm text-purple-700">January - February</p>
                <p className="text-xs text-purple-600 mt-1">Prune, fertilize, prepare for flowering</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Advice */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CloudSun className="text-orange-500 mr-2" size={24} />
              Weather-Based Advice
            </h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Dry Season Tips</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Increase watering frequency (2-3 times per week)</li>
                  <li>• Apply mulch around plants to retain moisture</li>
                  <li>• Monitor for stress signs like wilting leaves</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Rainy Season Tips</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensure proper drainage to prevent root rot</li>
                  <li>• Watch for fungal diseases</li>
                  <li>• Reduce artificial watering</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Farming Tips */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500">Loading farming tips...</p>
            </CardContent>
          </Card>
        ) : groupedTips ? (
          Object.entries(groupedTips).map(([season, tips]) => (
            <Card key={season} className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize flex items-center">
                  <Leaf className="text-secondary mr-2" size={24} />
                  {season} Season Tips
                </h2>
                
                <div className="space-y-4">
                  {tips.map((tip) => (
                    <div key={tip.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(tip.category)}
                          <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(tip.priority)}
                          <Badge variant={
                            tip.priority === "high" ? "default" : 
                            tip.priority === "medium" ? "secondary" : "outline"
                          }>
                            {tip.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600">{tip.description}</p>
                      <p className="text-xs text-gray-500 mt-2 capitalize">Category: {tip.category.replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-center">No farming tips available at the moment.</p>
            </CardContent>
          </Card>
        )}

        {/* General Best Practices */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">General Best Practices</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-1">Soil Management</h3>
                <p className="text-sm text-gray-600">Maintain slightly acidic soil (pH 6.0-6.8) with good drainage and organic matter</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-1">Plant Nutrition</h3>
                <p className="text-sm text-gray-600">Apply balanced fertilizer (NPK 12-6-6) during growing season, supplement with organic compost</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-1">Disease Prevention</h3>
                <p className="text-sm text-gray-600">Maintain proper air circulation, avoid overhead watering, and practice crop rotation</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-1">Harvesting</h3>
                <p className="text-sm text-gray-600">Pick only ripe red berries, process within 24 hours for best quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
