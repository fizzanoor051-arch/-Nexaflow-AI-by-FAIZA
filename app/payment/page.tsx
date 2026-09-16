
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PaymentMethod =
  | "card"
  | "jazzcash"
  | "easypaisa"
  | "bank"
  | "paypal";

const plans = {
  starter: {
    name: "Starter",
    price: 0,
    description: "For individuals exploring AI automation.",
  },
  growth: {
    name: "Growth",
    price: 29,
    description: "For growing teams and automated workflows.",
  },
  scale: {
    name: "Scale",
    price: 79,
    description: "For advanced operations and larger teams.",
  },
};

export default function PaymentPage() {
  const searchParams = useSearchParams();

  const requestedPlan =
    searchParams.get("plan")?.toLowerCase() || "growth";

  const initialPlan =
    requestedPlan in plans
      ? (requestedPlan as keyof typeof plans)
      : "growth";

  const [selectedPlan, setSelectedPlan] =
    useState<keyof typeof plans>(initialPlan);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const plan = plans[selectedPlan];

  const formattedCard = useMemo(() => {
    const cleaned = cardNumber.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  }, [cardNumber]);

  const handleCardNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
  };

  const handleExpiry = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value.replace(/\D/g, "").slice(0, 4);

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    setExpiry(value);
  };

  const handlePayment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setProcessing(true);
    setSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 1600));

    setProcessing(false);
    setSuccess(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#151713] text-[#F4F0E6]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#E7B84B]/8 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#E7B84B]/6 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/8 bg-[#151713]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
{/* Left: Back Home + Logo */}
<div className="flex items-center gap-3 sm:gap-5">
  <Link
    href="/"
    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-[#C8CBC1] transition hover:border-[#E7B84B]/30 hover:bg-[#E7B84B]/5 hover:text-[#F5D98B] sm:text-sm"
  >
    ← Back to Home
  </Link>

  <Link
    href="/"
    className="group flex items-center gap-3"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7B84B]/30 bg-[#20241D] shadow-[0_0_30px_rgba(231,184,75,0.08)] transition group-hover:border-[#E7B84B]/60">
      <span className="text-sm font-bold text-[#E7B84B]">
        NF
      </span>
    </div>

    <div className="hidden sm:block">
      <div className="text-sm font-semibold tracking-[0.22em] text-[#F4F0E6]">
        NEXAFLOW
      </div>

      <div className="text-[10px] uppercase tracking-[0.22em] text-[#9A9D94]">
        AI Operations
      </div>
    </div>
  </Link>
</div>

          {/* Right: Pricing + Dashboard */}
          <div className="flex items-center gap-2 sm:gap-3">
           

            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl border border-[#E7B84B]/25 bg-[#E7B84B]/8 px-4 py-2 text-xs font-medium text-[#F5D98B] transition hover:border-[#E7B84B]/50 hover:bg-[#E7B84B]/15 hover:text-[#F5D98B] hover:shadow-[0_0_25px_rgba(231,184,75,0.08)] sm:text-sm"
            >
              <span>Go to Dashboard</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
        {/* Page heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E7B84B]/20 bg-[#E7B84B]/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#F5D98B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_10px_rgba(94,214,160,0.8)]" />
            Secure checkout
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Complete your
            <span className="block text-[#E7B84B]">
              NexaFlow subscription
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#9A9D94] sm:text-base">
            Choose your plan and preferred payment method. This
            checkout interface is currently configured as a demo
            environment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          {/* Left side */}
          <div className="space-y-5">
            {/* Plan selector */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                    Select plan
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Subscription
                  </h2>
                </div>

                <div className="rounded-full border border-[#5ED6A0]/20 bg-[#5ED6A0]/8 px-3 py-1 text-[11px] text-[#5ED6A0]">
                  Monthly
                </div>
              </div>

              <div className="space-y-3">
                {(Object.keys(plans) as Array<keyof typeof plans>).map(
                  (key) => {
                    const item = plans[key];
                    const active = selectedPlan === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(key);
                          setSuccess(false);
                        }}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-[#E7B84B]/55 bg-[#E7B84B]/8 shadow-[0_0_35px_rgba(231,184,75,0.08)]"
                            : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {item.name}
                              </span>

                              {key === "growth" && (
                                <span className="rounded-full bg-[#E7B84B]/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#F5D98B]">
                                  Popular
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-[#858980]">
                              {item.description}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-semibold text-[#F5D98B]">
                              {item.price === 0
                                ? "Free"
                                : `$${item.price}`}
                            </div>

                            {item.price > 0 && (
                              <div className="text-[10px] text-[#858980]">
                                / month
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Order summary */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                Order summary
              </p>

              <div className="mt-5 flex items-center justify-between border-b border-white/8 pb-5">
                <div>
                  <p className="font-medium">
                    NexaFlow {plan.name}
                  </p>

                  <p className="mt-1 text-xs text-[#858980]">
                    AI Operations subscription
                  </p>
                </div>

                <p className="font-semibold text-[#F5D98B]">
                  {plan.price === 0
                    ? "$0"
                    : `$${plan.price}.00`}
                </p>
              </div>

              <div className="space-y-3 pt-5 text-sm">
                <div className="flex justify-between text-[#9A9D94]">
                  <span>Subtotal</span>
                  <span>
                    ${plan.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[#9A9D94]">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>

                <div className="flex justify-between border-t border-white/8 pt-4 text-base font-semibold text-[#F4F0E6]">
                  <span>Total</span>

                  <span className="text-[#E7B84B]">
                    ${plan.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3">
              {[
                ["🔒", "Secure"],
                ["⚡", "Fast"],
                ["✓", "Verified"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/8 bg-[#1B1F19]/70 p-4 text-center"
                >
                  <div className="text-lg">{icon}</div>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#858980]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-7">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                Payment method
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                How would you like to pay?
              </h2>
            </div>

            {/* Payment methods */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  id: "card" as const,
                  title: "Card",
                  subtitle: "Debit / Credit",
                  icon: "▣",
                },
                {
                  id: "jazzcash" as const,
                  title: "JazzCash",
                  subtitle: "Mobile wallet",
                  icon: "J",
                },
                {
                  id: "easypaisa" as const,
                  title: "Easypaisa",
                  subtitle: "Mobile wallet",
                  icon: "E",
                },
                {
                  id: "bank" as const,
                  title: "Bank",
                  subtitle: "Transfer",
                  icon: "⌁",
                },
                {
                  id: "paypal" as const,
                  title: "PayPal",
                  subtitle: "Online payment",
                  icon: "P",
                },
              ].map((method) => {
                const active = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setSuccess(false);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#E7B84B]/55 bg-[#E7B84B]/8"
                        : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                        active
                          ? "bg-[#E7B84B] text-[#151713]"
                          : "bg-[#252A22] text-[#E7B84B]"
                      }`}
                    >
                      {method.icon}
                    </div>

                    <p className="text-sm font-medium">
                      {method.title}
                    </p>

                    <p className="mt-1 text-[10px] text-[#858980]">
                      {method.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form
              onSubmit={handlePayment}
              className="mt-7"
            >
              {/* Card */}
              {paymentMethod === "card" && (
                <div className="space-y-5">
                  <Field
                    label="Cardholder name"
                    placeholder="Faiza Noor"
                    required
                  />

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#B9BDB4]">
                      Card number
                    </label>

                    <input
                      required
                      value={formattedCard}
                      onChange={handleCardNumber}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-[#B9BDB4]">
                        Expiry date
                      </label>

                      <input
                        required
                        value={expiry}
                        onChange={handleExpiry}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-[#B9BDB4]">
                        CVC
                      </label>

                      <input
                        required
                        value={cvc}
                        onChange={(e) =>
                          setCvc(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4)
                          )
                        }
                        placeholder="123"
                        inputMode="numeric"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* JazzCash */}
              {paymentMethod === "jazzcash" && (
                <WalletForm
                  name="JazzCash"
                  number="0300 1234567"
                  accountName={accountName}
                  accountNumber={accountNumber}
                  transactionId={transactionId}
                  setAccountName={setAccountName}
                  setAccountNumber={setAccountNumber}
                  setTransactionId={setTransactionId}
                />
              )}

              {/* Easypaisa */}
              {paymentMethod === "easypaisa" && (
                <WalletForm
                  name="Easypaisa"
                  number="0345 7654321"
                  accountName={accountName}
                  accountNumber={accountNumber}
                  transactionId={transactionId}
                  setAccountName={setAccountName}
                  setAccountNumber={setAccountNumber}
                  setTransactionId={setTransactionId}
                />
              )}

              {/* Bank */}
              {paymentMethod === "bank" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/5 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="font-medium">
                        Bank transfer details
                      </p>

                      <span className="rounded-full bg-[#5ED6A0]/10 px-2 py-1 text-[9px] uppercase tracking-wider text-[#5ED6A0]">
                        Demo
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <BankRow
                        label="Bank"
                        value="Meezan Bank"
                      />

                      <BankRow
                        label="Account title"
                        value="NexaFlow AI"
                      />

                      <BankRow
                        label="Account number"
                        value="0101 123456789"
                      />

                      <BankRow
                        label="IBAN"
                        value="PK00 MEZN 0000 0000 1234 5678"
                      />

                      <BankRow
                        label="Branch code"
                        value="0123"
                      />
                    </div>
                  </div>

                  <Field
                    label="Your name"
                    placeholder="Faiza Noor"
                    required
                  />

                  <Field
                    label="Transaction ID / Reference"
                    placeholder="Enter your transfer reference"
                    required
                  />
                </div>
              )}

              {/* PayPal */}
              {paymentMethod === "paypal" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/5 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#252A22] text-lg font-bold text-[#E7B84B]">
                        P
                      </div>

                      <div>
                        <p className="font-medium">
                          PayPal checkout
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#858980]">
                          You will be redirected to PayPal in a
                          production integration.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Field
                    label="PayPal email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              )}

              {/* Notice */}
              <div className="mt-6 flex gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="mt-0.5 text-[#E7B84B]">
                  ⓘ
                </div>

                <p className="text-[11px] leading-5 text-[#858980]">
                  This is a demo checkout. No real payment will
                  be processed from this page. Replace the
                  placeholder payment details before connecting
                  a live payment provider.
                </p>
              </div>

              {/* Success */}
              {success && (
                <div className="mt-5 rounded-2xl border border-[#5ED6A0]/20 bg-[#5ED6A0]/8 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5ED6A0]/15 text-[#5ED6A0]">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#5ED6A0]">
                        Demo payment submitted
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#8FAF9E]">
                        Your checkout flow is working. A real
                        payment provider can be connected here
                        later.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#E7B84B] px-5 py-4 text-sm font-semibold text-[#151713] shadow-[0_10px_40px_rgba(231,184,75,0.14)] transition hover:bg-[#F5D98B] hover:shadow-[0_15px_50px_rgba(231,184,75,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#151713]/30 border-t-[#151713]" />
                    Processing...
                  </>
                ) : (
                  <>
                    {plan.price === 0
                      ? "Continue with free plan"
                      : `Pay $${plan.price}.00`}

                    <span>→</span>
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[10px] text-[#686C64]">
                By continuing, you acknowledge this is a demo
                checkout environment.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#686C64]">
            © {new Date().getFullYear()} NexaFlow AI. All rights
            reserved.
          </p>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#686C64]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />
            Secure checkout
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------------------------------------------
   Reusable input
---------------------------------------------- */

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#151713] px-4 py-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#555951] focus:border-[#E7B84B]/50 focus:bg-[#1B1F19] focus:ring-2 focus:ring-[#E7B84B]/10";

/* ---------------------------------------------
   Field
---------------------------------------------- */

function Field({
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#B9BDB4]">
        {label}
      </label>

      <input
        required={required}
        type={type}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

/* ---------------------------------------------
   Wallet form
---------------------------------------------- */

function WalletForm({
  name,
  number,
  accountName,
  accountNumber,
  transactionId,
  setAccountName,
  setAccountNumber,
  setTransactionId,
}: {
  name: string;
  number: string;
  accountName: string;
  accountNumber: string;
  transactionId: string;
  setAccountName: (value: string) => void;
  setAccountNumber: (value: string) => void;
  setTransactionId: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[#9A9D94]">
              Send payment to
            </p>

            <h3 className="mt-1 text-lg font-semibold">
              {name}
            </h3>
          </div>

          <span className="rounded-full bg-[#E7B84B]/10 px-2 py-1 text-[9px] uppercase tracking-wider text-[#F5D98B]">
            Demo
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-white/8 bg-[#151713]/70 p-4">
          <p className="text-[10px] uppercase tracking-wider text-[#686C64]">
            Account / mobile number
          </p>

          <p className="mt-1 text-xl font-semibold tracking-wider text-[#F5D98B]">
            {number}
          </p>
        </div>

        <p className="mt-3 text-[10px] leading-5 text-[#777B72]">
          Replace this demo number with your verified {name}{" "}
          business/payment account before going live.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-[#B9BDB4]">
          Your account name
        </label>

        <input
          required
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Faiza Noor"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-[#B9BDB4]">
          Your mobile/account number
        </label>

        <input
          required
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="03XX XXXXXXX"
          inputMode="numeric"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-[#B9BDB4]">
          Transaction ID / Reference
        </label>

        <input
          required
          value={transactionId}
          onChange={(e) =>
            setTransactionId(e.target.value)
          }
          placeholder="Enter payment reference"
          className={inputClass}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Bank row
---------------------------------------------- */

function BankRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-[#777B72]">
        {label}
      </span>

      <span className="max-w-[65%] break-words text-right text-xs font-medium text-[#D9DCD3]">
        {value}
      </span>
    </div>
  );
}
