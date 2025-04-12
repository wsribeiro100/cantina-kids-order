
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Header: React.FC = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useUser();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da sua conta',
    });
  };
  
  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-kid-blue">Cantina Kids</h1>
        </Link>
        
        <div className="flex items-center space-x-2">
          {user && (
            <>
              <div className="flex items-center mr-4">
                <User className="h-5 w-5 text-kid-purple mr-1" />
                <span className="text-sm font-medium hidden md:inline">{user.name}</span>
              </div>
              
              <Link to="/cart">
                <Button variant="ghost" className="relative p-2 text-kid-blue">
                  <ShoppingCart className="h-6 w-6" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-kid-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Button variant="ghost" onClick={handleLogout} className="p-2 text-kid-red">
                <LogOut className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
