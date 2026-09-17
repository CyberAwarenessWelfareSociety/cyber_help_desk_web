import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Video, LogOut, CreditCard, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getSubscriptionBadge = () => {
    if (!user?.subscription || user.subscription === "none") return null;
    
    const colors = {
      basic: "bg-secondary text-secondary-foreground",
      premium: "bg-primary/20 text-primary",
      ultimate: "bg-gradient-to-r from-primary/30 to-accent/30 text-primary",
    };

    return (
      <Badge className={`${colors[user.subscription]} text-xs`}>
        {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)}
      </Badge>
    );
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold">MeetApp</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/subscription">
            <Button variant="ghost" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Pricing
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user.name}</span>
                  {getSubscriptionBadge()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/subscription")}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
