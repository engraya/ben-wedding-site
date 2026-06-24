import { useRef } from "react";
import { config } from "@/config";
import { motion, useInView } from "framer-motion";
import { Building2, Copy, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  bankDetails?: { bank: string; account: string; name: string };
}

// ─── Bank Detail Row ──────────────────────────────────────────────────────────
const BankDetailRow = ({
  sublabel,
  value,
}: {
  sublabel: string;
  value: string;
}) => (
  <div className="p-5 bg-gray-100 dark:bg-black/40 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-2">{sublabel}</p>
    <p className="text-lg font-light text-gray-900 dark:text-foreground/90 tracking-wide">{value}</p>
  </div>
);

// ─── Payment options data ─────────────────────────────────────────────────────

const bankOptions: PaymentOption[] = config.bankAccounts.map((acct) => ({
  id: acct.currency.toLowerCase().slice(0, 3),
  label: acct.currency,
  icon: <Building2 className="w-5 h-5" />,
  bankDetails: { bank: acct.bank, account: acct.account, name: acct.name },
}));

// ─── Main Component ───────────────────────────────────────────────────────────

export const GiftRegistry = ({ compact = false }: { compact?: boolean }) => {
  const { toast } = useToast();

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Copied!", description: `${label} copied to clipboard` });
    } catch {
      toast({ title: "Error", description: "Failed to copy", variant: "destructive" });
    }
  };

  const bankData = bankOptions[0];

  return (
    <section
      ref={sectionRef}
      id="gifts"
      className="relative w-full overflow-visible py-16 md:py-24 scroll-mt-24 md:scroll-mt-32"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[900px] h-[900px] border border-foreground/5 rounded-full opacity-10"
        />
      </div>

      <div className={`container mx-auto px-4 relative z-10 ${compact ? "max-w-6xl" : ""}`}>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.span className="inline-block text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
            ✦  With Gratitude  ✦
          </motion.span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6 epic-text tracking-tight">
            Gift Registry
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px w-32 mx-auto bg-foreground/20 mb-8"
          />
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4 font-light italic">
            For Those Who Asked, we're grateful for your love and generosity. We've made it easy by providing the details below
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">

          {/* BANK TRANSFER CARD */}
          <motion.div
            className="relative z-10 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-500 bg-blue-500/5">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-display text-2xl leading-none mb-1.5 text-foreground font-light tracking-wide">Bank Transfer</h3>
                <p className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase font-medium">Traditional Banking</p>
              </div>
            </div>

            {bankData?.bankDetails && (
              <div className="space-y-4">
                <BankDetailRow sublabel="Bank" value={bankData.bankDetails.bank} />
                <BankDetailRow sublabel="Account Name" value={bankData.bankDetails.name} />

                {/* Account number — copyable */}
                <div
                  onClick={() => handleCopy(bankData.bankDetails!.account, "Account Number")}
                  className="rounded-xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-black/40 p-6 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 group transition-all"
                >
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-3">
                    Account Number
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-3xl font-mono tracking-widest text-gray-900 dark:text-foreground font-medium">
                      {bankData.bankDetails.account}
                    </p>
                    <Copy className="w-6 h-6 opacity-30 group-hover:opacity-100 shrink-0 text-blue-500 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 opacity-40 text-[11px] tracking-[0.4em] uppercase text-foreground">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>With Love, {config.partner1} & {config.partner2}</span>
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
