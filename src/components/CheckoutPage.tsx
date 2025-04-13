
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Wallet, QrCode, CheckCircle } from 'lucide-react';

enum PaymentMethod {
  BALANCE = 'balance',
  CARD = 'card',
  PIX = 'pix'
}

const CheckoutPage: React.FC = () => {
  const { user, addBalance } = useUser();
  const { cart, clearCart, getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BALANCE);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const cartTotal = getCartTotal();
  const hasEnoughBalance = (user?.balance || 0) >= cartTotal;
  
  const handlePayment = () => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para finalizar o pedido',
        variant: 'destructive',
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: 'Erro',
        description: 'Seu carrinho está vazio',
        variant: 'destructive',
      });
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      
      if (paymentMethod === PaymentMethod.BALANCE) {
        // Deduct from balance
        addBalance(-cartTotal);
      }
      
      toast({
        title: 'Pedido realizado',
        description: 'Seu pedido foi recebido e está sendo preparado',
      });
      
      // Simulate redirect after completion
      setTimeout(() => {
        clearCart();
        navigate('/confirmation', { 
          state: { 
            orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
            items: cart,
            total: cartTotal,
            paymentMethod
          } 
        });
      }, 2000);
    }, 2000);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-kid-blue mb-6">Finalizar Pedido</h1>
      
      <div className="space-y-6">
        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-4">Resumo do Pedido</h2>
          
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity} x R$ {item.item.price.toFixed(2)}</p>
                </div>
                <p className="font-medium">R$ {(item.item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <div className="flex justify-between font-bold">
              <p>Total</p>
              <p>R$ {cartTotal.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        {/* Payment Methods */}
        {!completed && (
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Forma de Pagamento</h2>
            
            <div className="space-y-3">
              {/* Balance Payment */}
              <div 
                className={`p-3 border rounded-lg cursor-pointer ${
                  paymentMethod === PaymentMethod.BALANCE ? 'border-kid-blue bg-blue-50' : ''
                }`}
                onClick={() => setPaymentMethod(PaymentMethod.BALANCE)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    paymentMethod === PaymentMethod.BALANCE ? 'bg-blue-200' : 'bg-gray-100'
                  }`}>
                    <Wallet className={`h-5 w-5 ${
                      paymentMethod === PaymentMethod.BALANCE ? 'text-kid-blue' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium">Saldo da Carteira</p>
                    <p className="text-sm text-muted-foreground">
                      Saldo disponível: <span className={hasEnoughBalance ? 'text-green-600' : 'text-red-600'}>
                        R$ {(user?.balance || 0).toFixed(2)}
                      </span>
                    </p>
                  </div>
                  {!hasEnoughBalance && (
                    <span className="text-xs text-red-600 font-medium">Saldo insuficiente</span>
                  )}
                </div>
              </div>
              
              {/* Credit Card Payment */}
              <div 
                className={`p-3 border rounded-lg cursor-pointer ${
                  paymentMethod === PaymentMethod.CARD ? 'border-kid-blue bg-blue-50' : ''
                }`}
                onClick={() => setPaymentMethod(PaymentMethod.CARD)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    paymentMethod === PaymentMethod.CARD ? 'bg-blue-200' : 'bg-gray-100'
                  }`}>
                    <CreditCard className={`h-5 w-5 ${
                      paymentMethod === PaymentMethod.CARD ? 'text-kid-blue' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Cartão de Crédito/Débito</p>
                    <p className="text-sm text-muted-foreground">Visa, MasterCard, Elo, etc.</p>
                  </div>
                </div>
              </div>
              
              {/* PIX Payment */}
              <div 
                className={`p-3 border rounded-lg cursor-pointer ${
                  paymentMethod === PaymentMethod.PIX ? 'border-kid-blue bg-blue-50' : ''
                }`}
                onClick={() => setPaymentMethod(PaymentMethod.PIX)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    paymentMethod === PaymentMethod.PIX ? 'bg-blue-200' : 'bg-gray-100'
                  }`}>
                    <QrCode className={`h-5 w-5 ${
                      paymentMethod === PaymentMethod.PIX ? 'text-kid-blue' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">PIX</p>
                    <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handlePayment} 
              className="w-full kid-button-primary mt-4"
              disabled={processing || (paymentMethod === PaymentMethod.BALANCE && !hasEnoughBalance)}
            >
              {processing ? 'Processando...' : 'Finalizar Compra'}
            </Button>
          </Card>
        )}
        
        {/* Order Completed */}
        {completed && (
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Pedido Realizado com Sucesso!</h2>
            <p className="text-muted-foreground mb-6">Seu pedido está sendo preparado</p>
            <Button onClick={() => navigate('/catalog')} className="kid-button-primary">
              Continuar Comprando
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
