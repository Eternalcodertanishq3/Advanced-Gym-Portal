"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { setDefaultPaymentMethod } from "@/actions/member/billing-actions";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface Props {
  initialData: {
    subscription: any;
    paymentMethods: any[];
    invoices: any[];
  };
}

export function BillingClient({ initialData }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { subscription, paymentMethods, invoices } = initialData;

  const handleSetDefault = async (pmId: string) => {
    setLoading(pmId);
    const res = await setDefaultPaymentMethod(pmId);
    if (res.success) {
      toast.success("Default payment protocol updated");
    } else {
      toast.error(res.error || "Failed to update protocol");
    }
    setLoading(null);
  };

  return (
    <div className="w-full h-full p-6 md:p-10 space-y-12 max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <h1 className="text-4xl font-display font-bold text-foreground leading-tight">
             Financial <span className="text-brand-orange">Protocols</span>
           </h1>
           <p className="text-sm text-txt-secondary font-medium mt-2 max-w-md">
             Manage your membership blueprints, payment methods, and historical invoices.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="surface-card px-6 py-3 rounded-2xl border border-border/50 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-success" />
              <div>
                <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest">Status</p>
                <p className="text-sm font-bold text-foreground">Verified Member</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Active Subscription */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] ml-1">Current Blueprint</h3>
            <div className="surface-card p-10 rounded-[3rem] border border-border/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Zap className="w-48 h-48" />
               </div>
               
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-brand-glow">
                           <Zap className="w-7 h-7 text-brand-orange" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-display font-bold text-foreground uppercase tracking-tight">
                             {subscription?.plan?.name || "Standard Protocol"}
                           </h2>
                           <p className="text-xs font-bold text-success uppercase tracking-widest mt-1">Active Membership</p>
                        </div>
                     </div>
                     <div className="flex gap-10">
                        <div>
                           <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest mb-1">Cycle Price</p>
                           <p className="text-2xl font-bold text-foreground">₹{subscription?.plan?.price || "4999"}<span className="text-xs text-txt-tertiary">/mo</span></p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest mb-1">Next Renewal</p>
                           <p className="text-2xl font-bold text-foreground">{subscription?.endDate ? formatDate(subscription.endDate) : "N/A"}</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3">
                     <Button className="h-14 px-8 rounded-2xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold shadow-xl shadow-brand-orange/20">
                        Upgrade Tier
                     </Button>
                     <Button variant="ghost" className="h-10 text-[10px] font-black text-txt-tertiary hover:text-danger uppercase tracking-widest transition-colors">
                        Deactivate Cycle
                     </Button>
                  </div>
               </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] ml-1">Payment Protocols</h3>
              <Button variant="outline" className="h-10 px-4 rounded-xl border-border/50 font-bold text-[10px] uppercase tracking-widest">
                 <Plus className="w-4 h-4 mr-2" />
                 Add Method
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {paymentMethods.map((pm) => (
                 <div 
                   key={pm.id} 
                   className={cn(
                     "surface-card p-6 rounded-3xl border transition-all flex flex-col justify-between h-48",
                     pm.isDefault ? "border-brand-orange/50 bg-gradient-to-br from-surface-card to-brand-navy/30 shadow-xl" : "border-border/50 hover:border-border"
                   )}
                 >
                    <div className="flex justify-between items-start">
                       <div className="w-12 h-12 rounded-xl bg-surface-sunken flex items-center justify-center">
                          <CreditCard className={cn("w-6 h-6", pm.isDefault ? "text-brand-orange" : "text-txt-tertiary")} />
                       </div>
                       {pm.isDefault && (
                         <span className="px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[9px] font-black uppercase tracking-widest border border-brand-orange/20">
                           Primary
                         </span>
                       )}
                    </div>
                    <div>
                       <p className="text-lg font-mono font-bold text-foreground">•••• •••• •••• {pm.last4}</p>
                       <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Exp: {pm.expMonth}/{pm.expYear}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-border/10">
                       <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest">{pm.brand}</p>
                       {!pm.isDefault && (
                         <button 
                           onClick={() => handleSetDefault(pm.id)}
                           disabled={!!loading}
                           className="text-[9px] font-black text-brand-orange uppercase tracking-widest hover:underline disabled:opacity-50"
                         >
                           {loading === pm.id ? "Syncing..." : "Set Primary"}
                         </button>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Invoice History Sidebar */}
        <section className="space-y-6">
           <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] ml-1">Archive</h3>
           <div className="surface-card p-8 rounded-[3rem] border border-border/50 flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                 {invoices.map((inv) => (
                   <div key={inv.id} className="p-5 rounded-2xl bg-surface-sunken/50 border border-border/30 flex items-center justify-between group hover:border-brand-orange/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center">
                            <FileText className="w-5 h-5 text-txt-tertiary group-hover:text-brand-orange transition-colors" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-foreground">₹{inv.amount}</p>
                            <p className="text-[10px] text-txt-tertiary font-medium">{formatDate(inv.date)}</p>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <span className="text-[8px] font-black text-success uppercase tracking-widest">{inv.status}</span>
                         <button 
                           onClick={() => setSelectedInvoice(inv)}
                           aria-label={`View invoice for ₹${inv.amount}`}
                           className="text-[10px] text-brand-orange hover:text-brand-orange-dark font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange/5 border border-brand-orange/10"
                         >
                            View
                            <ChevronRight className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                 ))}

                 {invoices.length === 0 && (
                   <div className="py-20 text-center">
                      <Clock className="w-10 h-10 text-txt-tertiary/20 mx-auto mb-4" />
                      <p className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">No Records Found</p>
                   </div>
                 )}
              </div>

              <div className="pt-8 border-t border-border/50 space-y-4">
                 <div className="p-4 rounded-2xl bg-brand-navy/50 border border-border/50 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <p className="text-[10px] text-txt-tertiary leading-relaxed font-medium">
                      All billing cycles are secured with 256-bit encryption. VAT invoices are dispatched automatically to your primary terminal.
                    </p>
                 </div>
                 <Button variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-xs uppercase tracking-widest">
                    Download Full Archive
                 </Button>
              </div>
           </div>
        </section>
      </div>

      {/* Invoice Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedInvoice && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedInvoice(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-surface-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden p-10"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <FileText className="w-7 h-7 text-brand-orange" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground">Mission <span className="text-brand-orange">Receipt</span></h2>
                      <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Ref: {selectedInvoice.id.slice(0, 12).toUpperCase()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    aria-label="Close Receipt"
                    className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-txt-tertiary hover:text-brand-orange transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6 bg-surface-sunken/50 p-8 rounded-[2rem] border border-border/50">
                  <div className="flex justify-between border-b border-border/30 pb-4">
                    <span className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">Transaction Date</span>
                    <span className="text-sm font-bold text-foreground">{formatDate(selectedInvoice.date)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 pb-4">
                    <span className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">Auth Status</span>
                    <span className="text-xs font-black text-success uppercase tracking-widest px-2 py-0.5 rounded bg-success/10 border border-success/20">{selectedInvoice.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 pb-4">
                    <span className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">Protocol Tier</span>
                    <span className="text-sm font-bold text-foreground">{subscription?.plan?.name || "Standard"}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-lg font-display font-bold text-foreground uppercase tracking-tight">Total Charged</span>
                    <span className="text-3xl font-display font-bold text-brand-orange tabular-nums">₹{selectedInvoice.amount}</span>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <Button className="flex-1 h-14 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-2xl shadow-xl shadow-brand-orange/20">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1 h-14 border-border/50 rounded-2xl font-bold">
                    Email Copy
                  </Button>
                </div>

                <p className="mt-8 text-center text-[10px] font-bold text-txt-tertiary uppercase tracking-[0.2em] opacity-40">
                  Eagle Gym — Integrated Member Finance
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
