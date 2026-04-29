"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, ArrowLeft, Plus, Minus, Trash2, CreditCard, Banknote, User } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useInventory } from "@/hooks/use-inventory";
import { useCartStore } from "@/stores/cart-store";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function POSPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  
  // Load 50 items for the POS terminal to avoid too much pagination
  const { data, isLoading } = useInventory(1, 50, debouncedSearch);
  const products = data?.items || [];

  const cart = useCartStore();
  const [checkoutMethod, setCheckoutMethod] = useState<"CARD" | "CASH" | "UPI" | null>(null);

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("Item is out of stock!");
      return;
    }
    
    // Check if adding exceeds stock
    const existing = cart.items.find(i => i.id === product.id);
    if (existing && existing.quantity >= product.stock) {
      toast.error("Cannot add more than available stock!");
      return;
    }


    cart.addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1
    });
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    if (!checkoutMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    
    // In a real app, we would call a server action here to process the sale
    // e.g. await processSale(cart.items, checkoutMethod)
    
    toast.success(`Sale completed via ${checkoutMethod}! Total: ${formatCurrency(cart.total)}`);
    cart.clearCart();
    setCheckoutMethod(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Left Panel - Product Catalog */}
      <div className="flex-1 flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/admin/inventory" className="flex items-center text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
          <h1 className="font-display text-2xl font-bold text-obsidian-950">
            POS <span className="text-brand-orange">Terminal</span>
          </h1>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
          <Input
            placeholder="Search products, supplements, or merchandise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface-card border-surface-sunken focus-visible:ring-brand-navy shadow-sm"
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-surface-card rounded-2xl p-4 border border-surface-sunken">
                  <Skeleton className="w-full aspect-square rounded-xl mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <ShoppingCart className="w-12 h-12 text-obsidian-300 mx-auto mb-4" />
                <p className="text-obsidian-500 font-medium">No products found.</p>
              </div>
            ) : (
              products.map((product: any) => (
                <div 
                  key={product.id} 
                  className={cn(
                    "bg-surface-card rounded-2xl p-3 border shadow-sm transition-all cursor-pointer flex flex-col justify-between",
                    product.stock > 0 
                      ? "border-surface-sunken hover:border-brand-navy hover:shadow-md" 
                      : "border-red-100 opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => product.stock > 0 && handleAddToCart(product)}
                >
                  <div>
                    <div className="w-full aspect-square bg-surface-base rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                      <span className="text-4xl">📦</span>
                    </div>
                    <h3 className="font-semibold text-obsidian-950 text-sm line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-xs text-obsidian-500">{product.category || "Merch"}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-obsidian-900">{formatCurrency(product.price)}</span>
                    {product.stock > 0 && (
                      <span className="text-xs font-medium text-brand-navy bg-brand-navy/10 px-2 py-0.5 rounded-md">
                        {product.stock} left
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>


      {/* Right Panel - Cart Checkout */}
      <div className="w-full md:w-96 bg-surface-card rounded-3xl border border-surface-sunken shadow-md flex flex-col overflow-hidden h-full shrink-0">
        <div className="p-5 border-b border-surface-sunken bg-brand-navy text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Current Order
            </h2>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
              {cart.items.reduce((a, b) => a + b.quantity, 0)} Items
            </Badge>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface-base/30 custom-scrollbar">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-obsidian-400">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-50" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-surface-card rounded-xl border border-surface-sunken shadow-sm relative group">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-200 hover:text-red-700"
                  onClick={() => cart.removeItem(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                
                <div className="w-12 h-12 rounded-lg bg-surface-base flex items-center justify-center shrink-0">
                  📦
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <p className="font-medium text-sm text-obsidian-950 line-clamp-1 pr-4">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold text-brand-orange">{formatCurrency(item.price)}</span>
                    <div className="flex items-center gap-2 bg-surface-base rounded-md border border-surface-sunken p-0.5">
                      <button 
                        aria-label="Decrease quantity"
                        title="Decrease quantity"
                        className="w-6 h-6 flex items-center justify-center text-obsidian-600 hover:bg-surface-card rounded"
                        onClick={() => item.quantity > 1 ? cart.updateQuantity(item.id, item.quantity - 1) : cart.removeItem(item.id)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                        aria-label="Increase quantity"
                        title="Increase quantity"
                        className="w-6 h-6 flex items-center justify-center text-obsidian-600 hover:bg-surface-card rounded"
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        <div className="p-5 border-t border-surface-sunken bg-surface-card">
          <div className="flex justify-between items-center mb-4 text-obsidian-600">
            <span className="text-sm">Subtotal</span>
            <span className="font-medium text-obsidian-900">{formatCurrency(cart.total)}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-obsidian-600">
            <span className="text-sm">Tax (CGST/SGST 18%)</span>
            <span className="font-medium text-obsidian-900">{formatCurrency(cart.total * 0.18)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed border-surface-sunken">
            <span className="text-lg font-bold text-obsidian-950">Total</span>
            <span className="text-2xl font-bold text-brand-navy">{formatCurrency(cart.total * 1.18)}</span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="w-full py-6 text-lg font-bold shadow-lg" 
                size="lg"
                disabled={cart.items.length === 0}
              >
                Checkout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-surface-card border-surface-sunken">
              <DialogHeader>
                <DialogTitle>Complete Sale</DialogTitle>
                <DialogDescription>
                  Select a payment method to complete the transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Button 
                    variant="outline" 
                    className={cn("h-20 flex flex-col gap-2 border-2", checkoutMethod === "CASH" ? "border-brand-navy bg-brand-navy/5" : "border-surface-sunken")}
                    onClick={() => setCheckoutMethod("CASH")}
                  >
                    <Banknote className="w-6 h-6" />
                    Cash
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn("h-20 flex flex-col gap-2 border-2", checkoutMethod === "CARD" ? "border-brand-navy bg-brand-navy/5" : "border-surface-sunken")}
                    onClick={() => setCheckoutMethod("CARD")}
                  >
                    <CreditCard className="w-6 h-6" />
                    Card / POS
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn("h-20 flex flex-col gap-2 border-2", checkoutMethod === "UPI" ? "border-brand-navy bg-brand-navy/5" : "border-surface-sunken")}
                    onClick={() => setCheckoutMethod("UPI")}
                  >
                    <div className="font-bold font-mono text-lg leading-none">UPI</div>
                    Scanner
                  </Button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <label className="text-sm font-medium text-obsidian-900">Member (Optional)</label>
                  <div className="flex gap-2">
                    <Input placeholder="Search member by phone..." className="bg-surface-base" />
                    <Button variant="outline" size="icon"><User className="w-4 h-4" /></Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white h-12 text-lg"
                  onClick={handleCheckout}
                >
                  Pay {formatCurrency(cart.total * 1.18)}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
