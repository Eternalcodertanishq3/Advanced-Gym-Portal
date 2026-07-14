"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  ServerCrash,
  Loader2,
  Bell,
  ShieldCheck,
  Languages,
  Users,
  Zap,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateSystemConfig } from "@/actions/super-admin/config-actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Props {
  initialConfig: Record<string, any>;
}

export function SystemConfigClient({ initialConfig }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("General Settings");
  const [paymentMethodsJson, setPaymentMethodsJson] = useState(
    initialConfig.paymentMethods ||
      JSON.stringify([
        {
          id: "UPI",
          label: "UPI / QR Code",
          icon: "Smartphone",
          description: "Google Pay, PhonePe, Paytm",
        },
        {
          id: "CARD",
          label: "Credit / Debit Card",
          icon: "CreditCard",
          description: "Visa, Mastercard, RuPay",
        },
        {
          id: "CASH",
          label: "Cash Payment",
          icon: "Banknote",
          description: "Pay at the gym reception",
        },
      ]),
  );

  useEffect(() => {
    if (initialConfig.currency) {
      localStorage.setItem("gymflow-currency", initialConfig.currency);
    }
  }, [initialConfig.currency]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};

    // Standard inputs
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Handle checkboxes/switches that might be missing from FormData when unchecked
    const form = e.currentTarget;
    const switches = ["emailNotifications", "whatsappAlerts", "smsMarketing", "enforce2fa"];
    switches.forEach((name) => {
      const input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (input) {
        data[name] = input.value === "on" ? "true" : "false";
      } else {
        // If the Radix switch is not rendering a native input correctly in this environment,
        // we fallback to checking the data-state of the button
        const button = form.querySelector(`button[name="${name}"]`);
        if (button) {
          data[name] = button.getAttribute("data-state") === "checked" ? "true" : "false";
        }
      }
    });

    const res = await updateSystemConfig(data);

    if (res.success) {
      if (data.currency) {
        localStorage.setItem("gymflow-currency", data.currency);
      }
      toast.success("System configurations saved!");
    } else {
      toast.error(res.error || "Failed to save settings");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-5xl space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-wide text-foreground">
          <ServerCrash className="h-6 w-6 text-brand-orange" />
          System Configuration
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage global gym variables and system behaviors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Col - Navigation */}
        <div className="space-y-2">
          {[
            { id: "General Settings", icon: Save },
            { id: "Payment Methods", icon: CreditCard },
            { id: "Social Links", icon: Users },
            { id: "Marketing Content", icon: Zap },
            { id: "Testimonial Fallbacks", icon: MessageSquare },
            { id: "Localization", icon: Languages },
            { id: "Notifications", icon: Bell },
            { id: "Security", icon: ShieldCheck },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "border border-brand-orange/20 bg-brand-orange/10 font-bold text-brand-orange shadow-[0_0_15px_rgba(232,93,38,0.1)]"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.id}
            </button>
          ))}
        </div>

        {/* Right Col - Forms */}
        <div className="space-y-6 md:col-span-2">
          <form onSubmit={handleSubmit} className="surface-card-static space-y-6 p-6 sm:p-8">
            {activeTab === "General Settings" && (
              <>
                <h2 className="border-b border-border pb-2 font-display text-lg text-foreground">
                  General Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="gymName"
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Gym Name
                      </label>
                      <input
                        id="gymName"
                        name="gymName"
                        type="text"
                        title="Gym Name"
                        defaultValue={initialConfig.gymName || ""}
                        placeholder="Official Gym Identity"
                        className="surface-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="gymLogo"
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Gym Logo URL
                      </label>
                      <input
                        id="gymLogo"
                        name="gymLogo"
                        type="text"
                        title="Gym Logo"
                        defaultValue={initialConfig.gymLogo || "/logo.png"}
                        placeholder="Official Logo Asset Path"
                        className="surface-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="supportEmail"
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Support Email
                      </label>
                      <input
                        id="supportEmail"
                        name="supportEmail"
                        type="email"
                        title="Support Email"
                        defaultValue={initialConfig.supportEmail || ""}
                        placeholder="Support Email Address"
                        className="surface-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contactPhone"
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Contact Phone
                      </label>
                      <input
                        id="contactPhone"
                        name="contactPhone"
                        type="text"
                        title="Contact Phone"
                        defaultValue={initialConfig.contactPhone || ""}
                        placeholder="Contact Phone Number"
                        className="surface-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="gymAddress"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Gym Address
                    </label>
                    <textarea
                      id="gymAddress"
                      name="gymAddress"
                      title="Gym Address"
                      defaultValue={initialConfig.gymAddress || ""}
                      placeholder="Enter the full physical address of the gym"
                      rows={2}
                      className="surface-input resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="gymMission"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Gym Mission / Brand Bio
                    </label>
                    <textarea
                      id="gymMission"
                      name="gymMission"
                      title="Gym Mission"
                      defaultValue={
                        initialConfig.gymMission ||
                        "Rise above your limits. Transform your life with our elite trainers, state-of-the-art equipment, and a community built on grit and ambition."
                      }
                      placeholder="Enter a brief mission statement or brand bio for the footer"
                      rows={3}
                      className="surface-input resize-none"
                    />
                  </div>
                </div>

                <h2 className="mt-8 border-b border-border pb-2 font-display text-lg text-foreground">
                  Operational Hours
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="openingTime"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Opening Time
                    </label>
                    <input
                      id="openingTime"
                      name="openingTime"
                      type="time"
                      title="Opening Time"
                      placeholder="Select opening time"
                      defaultValue={initialConfig.openingTime || ""}
                      className="surface-input [color-scheme:light]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="closingTime"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Closing Time
                    </label>
                    <input
                      id="closingTime"
                      name="closingTime"
                      type="time"
                      title="Closing Time"
                      placeholder="Select closing time"
                      defaultValue={initialConfig.closingTime || ""}
                      className="surface-input [color-scheme:light]"
                    />
                  </div>
                </div>
              </>
            )}
            {activeTab === "Payment Methods" && (
              <>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="font-display text-lg text-foreground">Payment Methods</h2>
                  <button
                    type="button"
                    title="Add new payment method"
                    onClick={() => {
                      const methods = JSON.parse(paymentMethodsJson);
                      const newMethod = {
                        id: `METHOD_${Date.now()}`,
                        label: "New Method",
                        description: "Method description",
                        icon: "CreditCard",
                      };
                      setPaymentMethodsJson(JSON.stringify([...methods, newMethod]));
                    }}
                    className="flex items-center gap-2 rounded-lg bg-brand-orange/10 px-3 py-1.5 text-xs font-bold text-brand-orange transition-all hover:bg-brand-orange/20"
                  >
                    <Zap className="h-3 w-3" />
                    Add Method
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <p className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-[11px] leading-relaxed text-muted-foreground">
                    Configure the payment options available to members during checkout. These will
                    appear on the plan selection page.
                  </p>

                  <input type="hidden" name="paymentMethods" value={paymentMethodsJson} />

                  <div className="grid grid-cols-1 gap-3">
                    {JSON.parse(paymentMethodsJson).map((method: any, idx: number) => (
                      <div
                        key={method.id}
                        className="group flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Label
                            </label>
                            <input
                              type="text"
                              title="Method Label"
                              placeholder="e.g., UPI QR"
                              value={method.label}
                              onChange={(e) => {
                                const methods = JSON.parse(paymentMethodsJson);
                                methods[idx].label = e.target.value;
                                setPaymentMethodsJson(JSON.stringify(methods));
                              }}
                              className="surface-input h-9 py-1 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Description
                            </label>
                            <input
                              type="text"
                              title="Method Description"
                              placeholder="Short explanation for members"
                              value={method.description}
                              onChange={(e) => {
                                const methods = JSON.parse(paymentMethodsJson);
                                methods[idx].description = e.target.value;
                                setPaymentMethodsJson(JSON.stringify(methods));
                              }}
                              className="surface-input h-9 py-1 text-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          title="Remove this payment method"
                          onClick={() => {
                            const methods = JSON.parse(paymentMethodsJson);
                            setPaymentMethodsJson(
                              JSON.stringify(methods.filter((_: any, i: number) => i !== idx)),
                            );
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/5 text-danger opacity-0 transition-all hover:bg-danger/10 group-hover:opacity-100"
                        >
                          <Zap className="h-4 w-4 rotate-45" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Social Links" && (
              <>
                <h2 className="border-b border-border pb-2 font-display text-lg text-foreground">
                  Social Media Presence
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="instagramUrl"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Instagram URL
                    </label>
                    <input
                      id="instagramUrl"
                      name="instagramUrl"
                      type="url"
                      title="Instagram URL"
                      defaultValue={initialConfig.instagramUrl || ""}
                      placeholder="https://instagram.com/official"
                      className="surface-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="facebookUrl"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Facebook URL
                    </label>
                    <input
                      id="facebookUrl"
                      name="facebookUrl"
                      type="url"
                      title="Facebook URL"
                      defaultValue={initialConfig.facebookUrl || ""}
                      placeholder="https://facebook.com/official"
                      className="surface-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="twitterUrl"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Twitter URL
                    </label>
                    <input
                      id="twitterUrl"
                      name="twitterUrl"
                      type="url"
                      title="Twitter URL"
                      defaultValue={initialConfig.twitterUrl || ""}
                      placeholder="https://twitter.com/official"
                      className="surface-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="youtubeUrl"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      YouTube URL
                    </label>
                    <input
                      id="youtubeUrl"
                      name="youtubeUrl"
                      type="url"
                      title="YouTube URL"
                      defaultValue={initialConfig.youtubeUrl || ""}
                      placeholder="https://youtube.com/@official"
                      className="surface-input"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Marketing Content" && (
              <>
                <h2 className="border-b border-border pb-2 font-display text-lg text-foreground">
                  Hero Section
                </h2>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="heroTitle"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Hero Title
                    </label>
                    <input
                      id="heroTitle"
                      name="heroTitle"
                      type="text"
                      title="Hero Title"
                      defaultValue={initialConfig.heroTitle || "UNLEASH YOUR ELITE SELF."}
                      placeholder="Enter Hero Headline"
                      className="surface-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="heroSubtitle"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Hero Subtitle
                    </label>
                    <input
                      id="heroSubtitle"
                      name="heroSubtitle"
                      type="text"
                      title="Hero Subtitle"
                      defaultValue={initialConfig.heroSubtitle || "Rise Above. Transform Beyond."}
                      placeholder="Enter Hero Subheadline"
                      className="surface-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="heroImage"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Hero Image
                    </label>
                    <input
                      id="heroImage"
                      name="heroImage"
                      type="text"
                      title="Hero Image"
                      defaultValue={initialConfig.heroImage || "/images/hero-bg.png"}
                      placeholder="Hero Background Asset Path"
                      className="surface-input"
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  {/* Philosophy Section */}
                  <div className="space-y-5 rounded-2xl border border-border bg-muted/30 p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-brand-orange" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        Philosophy Section
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="aboutTitle"
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                        >
                          Title
                        </label>
                        <input
                          id="aboutTitle"
                          name="aboutTitle"
                          type="text"
                          title="Philosophy Title"
                          defaultValue={initialConfig.aboutTitle || "Our Philosophy"}
                          className="surface-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="aboutSubtitle"
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                        >
                          Subtitle
                        </label>
                        <input
                          id="aboutSubtitle"
                          name="aboutSubtitle"
                          type="text"
                          title="Philosophy Subtitle"
                          defaultValue={
                            initialConfig.aboutSubtitle || "BUILT ON GRIT, DRIVEN BY RESULTS."
                          }
                          className="surface-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="aboutDescription"
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                      >
                        Philosophy Description
                      </label>
                      <textarea
                        id="aboutDescription"
                        name="aboutDescription"
                        title="Philosophy Description"
                        defaultValue={initialConfig.aboutDescription || ""}
                        placeholder="Enter a detailed philosophy description"
                        rows={3}
                        className="surface-input resize-none"
                      />
                    </div>
                  </div>
                </div>

                <h2 className="mt-8 border-b border-border pb-2 font-display text-lg text-foreground">
                  Features Section
                </h2>
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="featuresTitle"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Features Title
                    </label>
                    <input
                      id="featuresTitle"
                      name="featuresTitle"
                      type="text"
                      title="Features Title"
                      defaultValue={initialConfig.featuresTitle || "EVERYTHING YOU NEED TO"}
                      className="surface-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="featuresSubtitle"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Features Subtitle
                    </label>
                    <input
                      id="featuresSubtitle"
                      name="featuresSubtitle"
                      type="text"
                      title="Features Subtitle"
                      defaultValue={initialConfig.featuresSubtitle || "BECOME LIMITLESS."}
                      className="surface-input"
                    />
                  </div>
                </div>

                <h2 className="mt-8 border-b border-border pb-2 font-display text-lg text-foreground">
                  Mid-Page Branding
                </h2>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="midPageQuote"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Quote Text
                    </label>
                    <textarea
                      id="midPageQuote"
                      name="midPageQuote"
                      title="Mid-Page Quote"
                      defaultValue={
                        initialConfig.midPageQuote ||
                        "THE ONLY BAD WORKOUT IS THE ONE THAT DIDN'T HAPPEN."
                      }
                      placeholder="Enter an inspirational quote"
                      rows={2}
                      className="surface-input resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="midPageQuoteAuthor"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Quote Author/Label
                    </label>
                    <input
                      id="midPageQuoteAuthor"
                      name="midPageQuoteAuthor"
                      type="text"
                      title="Quote Author"
                      defaultValue={initialConfig.midPageQuoteAuthor || "Elite Community"}
                      placeholder="Official Identifier"
                      className="surface-input"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Testimonial Fallbacks" && (
              <>
                <div className="mb-6 flex items-center justify-between border-b border-border pb-2">
                  <h2 className="font-display text-lg text-foreground">Testimonial Fallbacks</h2>
                  <Link
                    href="/super-admin/testimonials"
                    className="flex items-center gap-2 rounded-lg bg-brand-orange/10 px-3 py-1.5 text-xs font-bold text-brand-orange transition-all hover:bg-brand-orange/20"
                  >
                    Manage Member Feedback
                  </Link>
                </div>

                <div className="space-y-6">
                  <p className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-[11px] leading-relaxed text-muted-foreground">
                    <span className="font-bold uppercase tracking-wider text-brand-orange">
                      How this works:
                    </span>
                    <br />
                    The landing page prioritizes approved feedback from the{" "}
                    <strong>Member Feedback</strong> section. If there isn't enough dynamic content
                    to fill the slider, the system will use these manual fallbacks as a backup.
                  </p>

                  <div className="space-y-6 rounded-2xl border border-border bg-muted/30 p-5">
                    {/* Testimonial 1 */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-brand-orange">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Fallback Testimonial #1
                        </span>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="testimonialQuote"
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                        >
                          Quote
                        </label>
                        <textarea
                          id="testimonialQuote"
                          name="testimonialQuote"
                          title="Testimonial Quote 1"
                          defaultValue={
                            initialConfig.testimonialQuote ||
                            "Eagle Gym completely changed my perspective on fitness. The environment is unmatched."
                          }
                          rows={3}
                          className="surface-input resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="testimonialAuthor"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                          >
                            Author Name
                          </label>
                          <input
                            id="testimonialAuthor"
                            name="testimonialAuthor"
                            type="text"
                            title="Testimonial Author 1"
                            defaultValue={initialConfig.testimonialAuthor || "Siddharth Varma"}
                            className="surface-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="testimonialRole"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                          >
                            Role/Designation
                          </label>
                          <input
                            id="testimonialRole"
                            name="testimonialRole"
                            type="text"
                            title="Testimonial Role 1"
                            defaultValue={initialConfig.testimonialRole || "Pro Athlete"}
                            className="surface-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="space-y-5 border-t border-border pt-6">
                      <div className="flex items-center gap-2 text-brand-orange">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Fallback Testimonial #2
                        </span>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="testimonialQuote2"
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                        >
                          Quote
                        </label>
                        <textarea
                          id="testimonialQuote2"
                          name="testimonialQuote2"
                          title="Testimonial Quote 2"
                          defaultValue={initialConfig.testimonialQuote2 || ""}
                          placeholder="Enter second testimonial (optional)"
                          rows={3}
                          className="surface-input resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="testimonialAuthor2"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                          >
                            Author Name
                          </label>
                          <input
                            id="testimonialAuthor2"
                            name="testimonialAuthor2"
                            type="text"
                            title="Testimonial Author 2"
                            defaultValue={initialConfig.testimonialAuthor2 || ""}
                            className="surface-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="testimonialRole2"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                          >
                            Role/Designation
                          </label>
                          <input
                            id="testimonialRole2"
                            name="testimonialRole2"
                            type="text"
                            title="Testimonial Role 2"
                            defaultValue={initialConfig.testimonialRole2 || ""}
                            className="surface-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Localization" && (
              <>
                <h2 className="border-b border-border pb-2 font-display text-lg text-foreground">
                  Localization
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Timezone
                    </label>
                    <Select name="timezone" defaultValue={initialConfig.timezone || "UTC"}>
                      <SelectTrigger className="surface-input flex h-11 items-center justify-between">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="z-[50] rounded-xl border-border bg-card shadow-2xl">
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        <SelectItem value="IST">IST (GMT+5:30)</SelectItem>
                        <SelectItem value="EST">EST (GMT-5)</SelectItem>
                        <SelectItem value="PST">PST (GMT-8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Currency
                      </label>
                      <Select name="currency" defaultValue={initialConfig.currency || "USD"}>
                        <SelectTrigger className="surface-input flex h-11 items-center justify-between">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="z-[50] rounded-xl border-border bg-card shadow-2xl">
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Date Format
                      </label>
                      <Select
                        name="dateFormat"
                        defaultValue={initialConfig.dateFormat || "DD/MM/YYYY"}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-foreground transition-all focus:border-brand-orange/50 focus:ring-brand-orange/20">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent className="z-[50] rounded-xl border-border bg-card shadow-2xl">
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Notifications" && (
              <>
                <h2 className="border-b border-border pb-2 font-display text-lg text-foreground">
                  System Notifications
                </h2>
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-bold text-foreground">
                        Email Notifications
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Receive system alerts and daily reports via email.
                      </p>
                    </div>
                    <Switch
                      name="emailNotifications"
                      defaultChecked={initialConfig.emailNotifications === "true"}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-bold text-foreground">WhatsApp Alerts</label>
                      <p className="text-xs text-muted-foreground">
                        Send member reminders and receipts via WhatsApp.
                      </p>
                    </div>
                    <Switch
                      name="whatsappAlerts"
                      defaultChecked={initialConfig.whatsappAlerts === "true"}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-bold text-foreground">Marketing SMS</label>
                      <p className="text-xs text-muted-foreground">
                        Enable bulk SMS for promotional campaigns.
                      </p>
                    </div>
                    <Switch
                      name="smsMarketing"
                      defaultChecked={initialConfig.smsMarketing === "true"}
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-brand-orange">
                      Automated Triggers
                    </h3>
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-orange/10 bg-brand-orange/5 p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Send Payment Reminders</p>
                        <p className="text-[10px] text-muted-foreground">
                          Scan for subscriptions expiring in 3 days and send alerts.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const { triggerPaymentReminders } =
                            await import("@/actions/super-admin/notification-actions");
                          const res = await triggerPaymentReminders();
                          if (res.success) {
                            toast.success(`Successfully sent ${res.sentCount} reminders.`);
                          } else {
                            toast.error(res.error);
                          }
                        }}
                        className="rounded-lg bg-brand-orange/20 px-4 py-2 text-xs font-bold text-brand-orange transition-all hover:bg-brand-orange/30"
                      >
                        Trigger Now
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Security" && (
              <>
                <h2 className="border-b border-border pb-2 font-display text-lg text-foreground">
                  Security Settings
                </h2>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-bold text-foreground">
                        Two-Factor Authentication
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Force admins to use 2FA for system access.
                      </p>
                    </div>
                    <Switch
                      name="enforce2fa"
                      defaultChecked={initialConfig.enforce2fa === "true"}
                    />
                  </div>

                  <div className="space-y-2 pt-4">
                    <label
                      htmlFor="sessionTimeout"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Session Timeout (Minutes)
                    </label>
                    <input
                      id="sessionTimeout"
                      name="sessionTimeout"
                      type="number"
                      title="Session Timeout in Minutes"
                      placeholder="60"
                      defaultValue={initialConfig.sessionTimeout || "60"}
                      className="surface-input"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 flex justify-end border-t border-white/5 pt-6">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-2.5 font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:shadow-brand-orange/30 disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? "Saving..." : "Save Configurations"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
