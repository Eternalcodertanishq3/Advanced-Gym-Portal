"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  User, 
  Package,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Receipt,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { processSale } from "@/actions/admin/inventory-actions";

interface Props {
  products: any[];
}

export function POSClient({ products }: Props) {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>("CASH");
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("Item out of stock");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > item.stock) {
           toast.error("Not enough stock available");
           return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const saleData = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      customerName: customer.name,
      customerPhone: customer.phone,
      paymentMethod,
      subtotal,
      tax,
      discount: 0,
      total
    };

    const res = await processSale(saleData);
    if (res.success) {
      toast.success("Sale completed successfully!");
      setCart([]);
      setCustomer({ name: "", phone: "" });
    } else {
      toast.error(res.error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-120px)] gap-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Product Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-brand-orange" />
              Store <span className="text-brand-orange">POS</span>
            </h1>
            <p className="text-sm text-txt-secondary mt-1">Select products to add to the checkout cart.</p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
            <Input 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-surface-elevated border-border/50 rounded-xl h-12"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                onClick={() => addToCart(product)}
                className={cn(
                  "surface-card p-5 rounded-[2rem] border border-border/50 hover:border-brand-orange/30 cursor-pointer transition-all group relative",
                  product.stock <= 0 && "opacity-60 grayscale cursor-not-allowed"
                )}
              >
                <div className="aspect-square rounded-2xl bg-surface-sunken mb-4 flex items-center justify-center overflow-hidden border border-border/20">
                   {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <Package className="w-10 h-10 text-txt-tertiary/20" />
                   )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground truncate">{product.name}</h4>
                  <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">{product.category}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-brand-orange">₹{product.price}</span>
                  <Badge className={cn(
                    "text-[9px] font-bold",
                    product.stock > 10 ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                  )}>
                    {product.stock} in stock
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="surface-card rounded-[3rem] border border-border/50 flex flex-col overflow-hidden bg-surface-sunken/10 shadow-2xl">
        <div className="p-8 border-b border-border/50 bg-surface-elevated/30">
          <h3 className="text-xl font-bold flex items-center gap-3">
             <Receipt className="w-5 h-5 text-brand-orange" />
             Cart Overview
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
               <ShoppingCart className="w-16 h-16 mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-surface-base p-4 rounded-2xl border border-border/50 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-sunken shrink-0 overflow-hidden border border-border/20">
                     {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 m-auto mt-3.5 text-txt-tertiary/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-foreground truncate">{item.name}</h5>
                    <p className="text-xs text-brand-orange font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-lg bg-surface-sunken flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors"
                    >
                       <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-lg bg-surface-sunken flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors"
                    >
                       <Plus className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      aria-label="Remove from cart"
                      className="ml-2 p-2 text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-8 bg-surface-elevated/50 border-t border-border/50 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder="Customer Name" 
                value={customer.name}
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
                className="bg-surface-sunken border-none rounded-xl h-11 text-xs"
              />
              <Input 
                placeholder="Phone Number" 
                value={customer.phone}
                onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                className="bg-surface-sunken border-none rounded-xl h-11 text-xs"
              />
            </div>
            
            <div className="flex gap-2">
              {["CASH", "CARD", "UPI"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                    paymentMethod === m ? "bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20" : "bg-surface-sunken text-txt-tertiary border-border/50 hover:border-brand-orange/30"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-xs text-txt-secondary font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-txt-secondary font-bold uppercase tracking-widest">
              <span>Tax (GST 18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-display font-bold text-foreground pt-2">
              <span>Total</span>
              <span className="text-brand-orange">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full py-8 rounded-2xl bg-brand-orange hover:bg-brand-orange-dark text-white text-xl font-bold shadow-xl shadow-brand-orange/30 gap-3"
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Process Sale
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

