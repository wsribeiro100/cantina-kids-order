
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form, FormField, FormItem, FormLabel, 
  FormControl, FormMessage 
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ArrowUpDown, Check, X } from 'lucide-react';
import { foodItems, categories } from '@/data/foodItems';
import { FoodItem } from '@/contexts/CartContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Extended FoodItem with stock and availability
interface ProductItem extends FoodItem {
  stock: number;
  available: boolean;
  availableMorning: boolean;
  availableAfternoon: boolean;
}

// Convert food items to products
const initialProducts: ProductItem[] = foodItems.map(item => ({
  ...item,
  stock: Math.floor(Math.random() * 100),
  available: true,
  availableMorning: true,
  availableAfternoon: true,
}));

const ProductManagementScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      stock: 0,
      available: true,
      availableMorning: true,
      availableAfternoon: true,
    }
  });
  
  const handleAddProduct = () => {
    setIsAddingProduct(true);
    form.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      stock: 10,
      available: true,
      availableMorning: true,
      availableAfternoon: true,
    });
  };
  
  const handleEditProduct = (product: ProductItem) => {
    setIsEditingProduct(true);
    setCurrentProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      available: product.available,
      availableMorning: product.availableMorning,
      availableAfternoon: product.availableAfternoon,
    });
  };
  
  const handleDeleteProduct = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: 'Produto excluído',
        description: 'O produto foi removido com sucesso.',
      });
    }
  };
  
  const handleSaveProduct = (data: any) => {
    if (isAddingProduct) {
      const newProduct: ProductItem = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        image: data.image,
        category: data.category,
        stock: parseInt(data.stock),
        available: data.available,
        availableMorning: data.availableMorning,
        availableAfternoon: data.availableAfternoon,
      };
      
      setProducts([...products, newProduct]);
      toast({
        title: 'Produto adicionado',
        description: 'O novo produto foi adicionado com sucesso.',
      });
    } else if (isEditingProduct && currentProduct) {
      const updatedProducts = products.map(p => 
        p.id === currentProduct.id 
          ? { 
              ...p, 
              name: data.name,
              description: data.description,
              price: parseFloat(data.price),
              image: data.image,
              category: data.category,
              stock: parseInt(data.stock),
              available: data.available,
              availableMorning: data.availableMorning,
              availableAfternoon: data.availableAfternoon,
            } 
          : p
      );
      
      setProducts(updatedProducts);
      toast({
        title: 'Produto atualizado',
        description: 'As informações do produto foram atualizadas.',
      });
    }
    
    setIsAddingProduct(false);
    setIsEditingProduct(false);
    setCurrentProduct(null);
  };
  
  const toggleAvailability = (id: number, field: 'available' | 'availableMorning' | 'availableAfternoon') => {
    const updatedProducts = products.map(p => 
      p.id === id 
        ? { ...p, [field]: !p[field] } 
        : p
    );
    
    setProducts(updatedProducts);
    toast({
      title: 'Disponibilidade alterada',
      description: 'A disponibilidade do produto foi atualizada.',
    });
  };
  
  const updateStock = (id: number, change: number) => {
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + change); // Prevent negative stock
        return { ...p, stock: newStock };
      }
      return p;
    });
    
    setProducts(updatedProducts);
  };
  
  // Filter products with low stock (less than 10 items)
  const lowStockProducts = products.filter(p => p.stock < 10);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Administração de Produtos</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Lista de Produtos</h2>
            <Button onClick={handleAddProduct} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead>Manhã</TableHead>
                  <TableHead>Tarde</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleAvailability(product.id, 'available')}
                        className={product.available ? "text-green-600" : "text-red-600"}
                      >
                        {product.available ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleAvailability(product.id, 'availableMorning')}
                        className={product.availableMorning ? "text-green-600" : "text-red-600"}
                      >
                        {product.availableMorning ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleAvailability(product.id, 'availableAfternoon')}
                        className={product.availableAfternoon ? "text-green-600" : "text-red-600"}
                      >
                        {product.availableAfternoon ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateStock(product.id, -1)}
                        >
                          -
                        </Button>
                        <span className="min-w-[2rem] text-center">
                          {product.stock}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateStock(product.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Controle de Estoque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">Total de Produtos</h3>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">Produtos com Estoque Baixo</h3>
              <p className="text-3xl font-bold text-amber-500">{lowStockProducts.length}</p>
            </div>
          </div>
          
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-amber-800 mb-4">Produtos com Estoque Baixo</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right font-bold text-amber-600">
                        {product.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateStock(product.id, 10);
                            toast({
                              title: 'Estoque reabastecido',
                              description: `10 unidades adicionadas ao estoque de ${product.name}.`,
                            });
                          }}
                        >
                          Reabastecer (+10)
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Product Form Sheet */}
      <Sheet 
        open={isAddingProduct || isEditingProduct} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingProduct(false);
            setIsEditingProduct(false);
            setCurrentProduct(null);
          }
        }}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {isAddingProduct ? 'Adicionar Produto' : 'Editar Produto'}
            </SheetTitle>
          </SheetHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveProduct)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Descrição do produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          {...field} 
                          placeholder="0.00" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.filter(c => c.id !== 'all').map(category => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field} 
                        placeholder="0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-medium">Disponibilidade</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="available">Disponível</Label>
                  <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch 
                            id="available"
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="availableMorning">Disponível no Turno da Manhã</Label>
                  <FormField
                    control={form.control}
                    name="availableMorning"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch 
                            id="availableMorning"
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="availableAfternoon">Disponível no Turno da Tarde</Label>
                  <FormField
                    control={form.control}
                    name="availableAfternoon"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch 
                            id="availableAfternoon"
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <SheetFooter className="pt-4">
                <Button type="submit">
                  {isAddingProduct ? 'Adicionar' : 'Salvar'}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductManagementScreen;
