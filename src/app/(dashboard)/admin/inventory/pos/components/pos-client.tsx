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
  Loader2,
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("Item out of stock");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          if (newQty > item.stock) {
            toast.error("Not enough stock available");
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const saleData = {
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      customerName: customer.name,
      customerPhone: customer.phone,
      paymentMethod,
      subtotal,
      tax,
      discount: 0,
      total,
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
    <div className="grid h-[calc(100vh-120px)] grid-cols-1 gap-6 p-4 duration-500 animate-in fade-in md:p-8 lg:grid-cols-3">
      {/* Product Selection */}
      <div className="flex flex-col gap-6 overflow-hidden lg:col-span-2">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground">
              <ShoppingCart className="h-8 w-8 text-brand-orange" />
              Store <span className="text-brand-orange">POS</span>
            </h1>
            <p className="mt-1 text-sm text-txt-secondary">
              Select products to add to the checkout cart.
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-xl border-border/50 bg-surface-elevated pl-10"
            />
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                onClick={() => addToCart(product)}
                className={cn(
                  "surface-card group relative cursor-pointer rounded-[2rem] border border-border/50 p-5 transition-all hover:border-brand-orange/30",
                  product.stock <= 0 && "cursor-not-allowed opacity-60 grayscale",
                )}
              >
                <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border/20 bg-surface-sunken">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <Package className="h-10 w-10 text-txt-tertiary/20" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="truncate font-bold text-foreground">{product.name}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    {product.category}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-brand-orange">₹{product.price}</span>
                  <Badge
                    className={cn(
                      "text-[9px] font-bold",
                      product.stock > 10
                        ? "bg-success-soft text-success"
                        : "bg-warning-soft text-warning",
                    )}
                  >
                    {product.stock} in stock
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="surface-card flex flex-col overflow-hidden rounded-[3rem] border border-border/50 bg-surface-sunken/10 shadow-2xl">
        <div className="border-b border-border/50 bg-surface-elevated/30 p-8">
          <h3 className="flex items-center gap-3 text-xl font-bold">
            <Receipt className="h-5 w-5 text-brand-orange" />
            Cart Overview
          </h3>
        </div>

        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-10 text-center opacity-30">
              <ShoppingCart className="mb-4 h-16 w-16" />
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
                  className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-surface-base p-4"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/20 bg-surface-sunken">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="m-auto mt-3.5 h-5 w-5 text-txt-tertiary/20" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="truncate text-sm font-bold text-foreground">{item.name}</h5>
                    <p className="text-xs font-bold text-brand-orange">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-sunken transition-colors hover:bg-brand-orange hover:text-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-sunken transition-colors hover:bg-brand-orange hover:text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove from cart"
                      className="ml-2 p-2 text-danger opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="space-y-6 border-t border-border/50 bg-surface-elevated/50 p-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Customer Name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="h-11 rounded-xl border-none bg-surface-sunken text-xs"
              />
              <Input
                placeholder="Phone Number"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="h-11 rounded-xl border-none bg-surface-sunken text-xs"
              />
            </div>

            <div className="flex gap-2">
              {["CASH", "CARD", "UPI"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                    paymentMethod === m
                      ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-brand-orange/20"
                      : "border-border/50 bg-surface-sunken text-txt-tertiary hover:border-brand-orange/30",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-txt-secondary">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-txt-secondary">
              <span>Tax (GST 18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 font-display text-2xl font-bold text-foreground">
              <span>Total</span>
              <span className="text-brand-orange">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="hover:bg-brand-orange-dark w-full gap-3 rounded-2xl bg-brand-orange py-8 text-xl font-bold text-white shadow-xl shadow-brand-orange/30"
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                Process Sale
                <ArrowRight className="h-6 w-6" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
