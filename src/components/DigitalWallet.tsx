
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Wallet, RefreshCcw, History } from 'lucide-react';
import { mockTransactions, TransactionType } from '@/model/Transaction/Transaction';
import { useToast } from '@/components/ui/use-toast';

const DigitalWallet: React.FC = () => {
  const { user, addBalance } = useUser();
  const [activeTab, setActiveTab] = useState('balance');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const { toast } = useToast();

  // Filter transactions for the current user
  const userTransactions = user ? 
    mockTransactions.filter(tx => tx.userId === user.id) : [];

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um valor válido',
        variant: 'destructive',
      });
      return;
    }
    
    addBalance(amount);
    
    toast({
      title: 'Recarga realizada',
      description: `R$ ${amount.toFixed(2)} adicionado ao seu saldo`,
    });
    
    setRechargeAmount('');
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="balance" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Saldo
          </TabsTrigger>
          <TabsTrigger value="recharge" className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Recarga
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Balance Tab */}
        <TabsContent value="balance" className="pt-4">
          <div className="text-center p-6 space-y-4">
            <CreditCard className="h-12 w-12 mx-auto text-kid-purple" />
            <h2 className="text-2xl font-bold">Seu Saldo</h2>
            <p className="text-4xl font-bold text-kid-blue">
              R$ {user?.balance ? user.balance.toFixed(2) : '0.00'}
            </p>
            <Button onClick={() => setActiveTab('recharge')} className="kid-button-primary">
              Adicionar Créditos
            </Button>
          </div>
        </TabsContent>

        {/* Recharge Tab */}
        <TabsContent value="recharge" className="pt-4 space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recarregar Carteira</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor da Recarga</label>
              <Input
                type="number"
                placeholder="0.00"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pagamento</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('pix')}
                  className="justify-start"
                >
                  <span className="bg-green-100 p-1 rounded mr-2">
                    <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </span>
                  PIX
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="justify-start"
                >
                  <span className="bg-blue-100 p-1 rounded mr-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </span>
                  Cartão
                </Button>
                <Button
                  variant={paymentMethod === 'boleto' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('boleto')}
                  className="justify-start"
                >
                  <span className="bg-gray-100 p-1 rounded mr-2">
                    <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16M4 8h16M4 12h16M4 16h16M4 20h16"></path>
                    </svg>
                  </span>
                  Boleto
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleRecharge} 
              className="w-full kid-button-primary"
              disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
            >
              Recarregar
            </Button>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="pt-4">
          <h2 className="text-lg font-semibold mb-4">Histórico de Transações</h2>
          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {userTransactions.length > 0 ? (
              userTransactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {transaction.type === TransactionType.DEPOSIT ? 'Recarga' : 
                           transaction.type === TransactionType.PURCHASE ? 'Compra' : 'Reembolso'}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}
                          R$ {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Nenhuma transação encontrada
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DigitalWallet;
