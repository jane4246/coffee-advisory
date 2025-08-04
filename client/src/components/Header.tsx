import { Leaf, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf size={24} />
            <div>
              <h1 className="text-lg font-semibold">Coffee AI</h1>
              <p className="text-xs opacity-90">Disease Diagnosis Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-green-600 transition-colors text-white">
            <UserCircle size={24} />
          </Button>
        </div>
      </div>
    </header>
  );
}
