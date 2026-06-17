import { useState, useRef, useEffect } from "react";
import { config } from "@/config";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Bitcoin, 
  Building2, 
  ChevronDown, 
  Copy, 
  X,
  Heart,
  AlertTriangle,
  DollarSign,
  CircleDollarSign,
  Wallet,
  QrCode,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

// CSS for the forced visible scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    display: block !important;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(245, 158, 11, 0.5); 
    border-radius: 10px;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(245, 158, 11, 0.8);
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(245, 158, 11, 0.5) rgba(255, 255, 255, 0.05);
  }
`;

interface PaymentOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  networks?: { name: string; address: string }[];
  address?: string;
  bankDetails?: { bank: string; account: string; name: string };
}

interface QRModalState {
  address: string;
  label: string;
  subLabel?: string;
}

// ─── QR Code Modal ────────────────────────────────────────────────────────────
const QRModal = ({
  data,
  onClose,
}: {
  data: QRModalState;
  onClose: () => void;
}) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="qr-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
      >
        <motion.div
          key="qr-card"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Amber accent line at top */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-gray-700 dark:text-white/70"
            aria-label="Close QR modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8 flex flex-col items-center gap-6">
            {/* Title */}
            <div className="text-center">
              <p className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-1 font-medium">
                Scan to Pay
              </p>
              <h3 className="font-display text-xl text-gray-900 dark:text-white font-light tracking-wide">
                {data.label}
              </h3>
              {data.subLabel && (
                <p className="text-[11px] mt-1 text-amber-600 dark:text-amber-400 tracking-widest uppercase font-semibold">
                  {data.subLabel}
                </p>
              )}
            </div>

            {/* QR Code — rendered instantly, no network call */}
            <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white shadow-inner">
              <QRCodeSVG
                value={data.address}
                size={220}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                className="rounded-lg block"
              />
            </div>

            {/* Address */}
            <div className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
              <p className="font-mono text-[11px] text-gray-600 dark:text-white/60 break-all text-center leading-relaxed tracking-tight">
                {data.address}
              </p>
            </div>

            {/* Done button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-sm font-medium tracking-wide transition-all"
            >
              Done — Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Address Row (crypto) ─────────────────────────────────────────────────────
const AddressRow = ({
  label,
  address,
  accentColor = "amber",
  onCopy,
  onShowQR,
}: {
  label: string;
  address: string;
  accentColor?: "amber" | "blue";
  onCopy: (address: string, label: string) => void;
  onShowQR: (address: string, label: string) => void;
}) => {
  const copyColor = accentColor === "amber" ? "text-amber-500" : "text-blue-500";
  const qrColor =
    accentColor === "amber"
      ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15"
      : "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15";

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-black/40 overflow-hidden">
      {/* Copy row */}
      <div
        onClick={() => onCopy(address, label)}
        className="p-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 group transition-colors"
      >
        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-2">
          {label}
        </p>
        <div className="flex justify-between items-center gap-4">
          <p className="font-mono text-[13px] md:text-[14px] break-all text-gray-900 dark:text-foreground/90 leading-relaxed tracking-tight">
            {address}
          </p>
          <Copy className={`w-5 h-5 opacity-30 group-hover:opacity-100 shrink-0 ${copyColor} transition-opacity`} />
        </div>
      </div>

      {/* QR button row — separate from the copy tap area */}
      <div className="px-5 pb-4 pt-0">
        <button
          onClick={() => onShowQR(address, label)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[12px] font-medium tracking-wide transition-all ${qrColor}`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Show QR Code
        </button>
      </div>
    </div>
  );
};

// ─── Bank Detail Row ──────────────────────────────────────────────────────────
const BankDetailRow = ({
  sublabel,
  value,
  copyable = false,
  onCopy,
}: {
  sublabel: string;
  value: string;
  copyable?: boolean;
  onCopy?: (value: string, label: string) => void;
}) => {
  if (copyable && onCopy) {
    return (
      <div
        onClick={() => onCopy(value, sublabel)}
        className="p-6 bg-gray-100 dark:bg-black/40 rounded-xl border border-gray-200 dark:border-white/5 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 group transition-all shadow-inner"
      >
        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-3">{sublabel}</p>
        <div className="flex justify-between items-center">
          <p className="text-3xl font-mono tracking-widest text-gray-900 dark:text-foreground font-medium">{value}</p>
          <Copy className="w-6 h-6 opacity-30 group-hover:opacity-100 shrink-0 text-blue-500 transition-opacity" />
        </div>
      </div>
    );
  }
  return (
    <div className="p-5 bg-gray-100 dark:bg-black/40 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
      <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-2">{sublabel}</p>
      <p className="text-lg font-light text-gray-900 dark:text-foreground/90 tracking-wide">{value}</p>
    </div>
  );
};

// ─── Payment options data ─────────────────────────────────────────────────────

const cryptoOptions: PaymentOption[] = [
  {
    id: "btc-onchain",
    label: "Bitcoin (On-chain)",
    icon: <Bitcoin className="w-5 h-5" />,
    networks: [{ name: "Segwit", address: config.crypto.btcOnchain }],
  },
  {
    id: "btc-lightning",
    label: "Bitcoin (Lightning)",
    icon: <Bitcoin className="w-5 h-5" />,
    address: config.crypto.btcLightning,
  },
  {
    id: "cngn",
    label: "cNGN",
    icon: <Wallet className="w-5 h-5" />,
    networks: [
      { name: "Base", address: config.crypto.evmAddress },
      { name: "BSC (BEP20)", address: config.crypto.evmAddress },
      { name: "Assetchain", address: config.crypto.evmAddress },
      { name: "Solana", address: config.crypto.solanaAddress },
    ],
  },
  {
    id: "usdt",
    label: "USDT",
    icon: <DollarSign className="w-5 h-5" />,
    networks: [
      { name: "Tron (TRC20)", address: config.crypto.tronAddress },
      { name: "Base", address: config.crypto.evmAddress },
      { name: "BSC (BEP20)", address: config.crypto.evmAddress },
      { name: "Assetchain", address: config.crypto.evmAddress },
      { name: "Solana", address: config.crypto.solanaAddress },
    ],
  },
  {
    id: "usdc",
    label: "USDC",
    icon: <CircleDollarSign className="w-5 h-5" />,
    networks: [
      { name: "Base", address: config.crypto.evmAddress },
      { name: "BSC (BEP20)", address: config.crypto.evmAddress },
      { name: "Assetchain", address: config.crypto.evmAddress },
      { name: "Solana", address: config.crypto.solanaAddress },
    ],
  },
];

const bankOptions: PaymentOption[] = config.bankAccounts.map((acct, i) => ({
  id: acct.currency.toLowerCase().slice(0, 3),
  label: acct.currency,
  icon: i === 0 ? <Building2 className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />,
  bankDetails: { bank: acct.bank, account: acct.account, name: acct.name },
}));

// ─── Main Component ───────────────────────────────────────────────────────────

export const GiftRegistry = ({ compact = false }: { compact?: boolean }) => {
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);

  // QR modal state — lives here so it overlays the entire section
  const [qrModal, setQRModal] = useState<QRModalState | null>(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const cryptoRef = useRef<HTMLDivElement>(null);
  const bankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cryptoRef.current && !cryptoRef.current.contains(event.target as Node)) setCryptoOpen(false);
      if (bankRef.current && !bankRef.current.contains(event.target as Node)) setBankOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Copied!", description: `${label} copied to clipboard` });
    } catch {
      toast({ title: "Error", description: "Failed to copy", variant: "destructive" });
    }
  };

  const handleShowQR = (address: string, label: string, subLabel?: string) => {
    setQRModal({ address, label, subLabel });
  };

  const selectedCryptoData = cryptoOptions.find((c) => c.id === selectedCrypto);
  const selectedBankData = bankOptions.find((b) => b.id === selectedBank);

  return (
    <section
      ref={sectionRef}
      id="gifts"
      className="relative w-full overflow-visible py-16 md:py-24 scroll-mt-24 md:scroll-mt-32"
    >
      <style>{scrollbarStyles}</style>

      {/* QR Modal — rendered at section level, floats above everything */}
      {qrModal && <QRModal data={qrModal} onClose={() => setQRModal(null)} />}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* DIGITAL ASSETS CARD */}
          <motion.div
            className={`bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md shadow-2xl transition-all duration-300 ${cryptoOpen ? "z-50 relative" : "z-20 relative"}`}
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-500 bg-amber-500/5">
                <Bitcoin className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-display text-2xl leading-none mb-1.5 text-foreground font-light tracking-wide">Digital Assets</h3>
                <p className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase font-medium">Bitcoin & Stablecoins</p>
              </div>
            </div>

            <div ref={cryptoRef} className="relative">
              <button
                onClick={() => { setCryptoOpen(!cryptoOpen); setBankOpen(false); }}
                className="w-full flex items-center justify-between bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-6 py-5 text-base md:text-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                <span className={selectedCrypto ? "text-gray-900 dark:text-foreground" : "text-muted-foreground"}>
                  {selectedCryptoData?.label || "Select asset..."}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${cryptoOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {cryptoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 dark:bg-[#0a0a0a] dark:border-white/15 rounded-xl shadow-2xl z-[100] overflow-hidden"
                  >
                    {cryptoOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setSelectedCrypto(opt.id); setCryptoOpen(false); }}
                        className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-100 dark:hover:bg-white/5 text-left border-b border-gray-200 dark:border-white/5 last:border-0 transition-colors"
                      >
                        <span className="text-amber-500 shrink-0">{opt.icon}</span>
                        <span className="text-base text-gray-900 dark:text-foreground/90 font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {selectedCryptoData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 space-y-4"
                >
                  {/* Close button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedCrypto(null)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    >
                      <X className="w-4 h-4" />
                      <span>Close</span>
                    </button>
                  </div>

                  <div className="mt-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 dark:bg-amber-500/10 flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[13px] text-amber-700 dark:text-amber-200/90 leading-relaxed">
                      <strong>Important:</strong> Check the network. Wrong network selection results in permanent loss.
                    </p>
                  </div>

                  {/* Address list */}
                  <div className="max-h-[340px] overflow-y-auto space-y-3 pr-3 custom-scrollbar pb-2">
                    {selectedCryptoData.address && (
                      <AddressRow
                        label="Address"
                        address={selectedCryptoData.address}
                        accentColor="amber"
                        onCopy={handleCopy}
                        onShowQR={(addr, lbl) =>
                          handleShowQR(addr, selectedCryptoData.label, lbl)
                        }
                      />
                    )}
                    {selectedCryptoData.networks?.map((net) => (
                      <AddressRow
                        key={net.name}
                        label={`${net.name} Network`}
                        address={net.address}
                        accentColor="amber"
                        onCopy={handleCopy}
                        onShowQR={(addr) =>
                          handleShowQR(addr, selectedCryptoData.label, `${net.name} Network`)
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* BANK TRANSFER CARD */}
          <motion.div
            className={`bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md shadow-2xl transition-all duration-300 ${bankOpen ? "z-50 relative" : "z-10 relative"}`}
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-500 bg-blue-500/5">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-display text-2xl leading-none mb-1.5 text-foreground font-light tracking-wide">Bank Transfer</h3>
                <p className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase font-medium">Traditional Banking</p>
              </div>
            </div>

            <div ref={bankRef} className="relative">
              <button
                onClick={() => { setBankOpen(!bankOpen); setCryptoOpen(false); }}
                className="w-full flex items-center justify-between bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-6 py-5 text-base md:text-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                <span className={selectedBank ? "text-gray-900 dark:text-foreground" : "text-muted-foreground"}>
                  {selectedBankData?.label || "Select currency..."}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${bankOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {bankOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 dark:bg-[#0a0a0a] dark:border-white/15 rounded-xl shadow-2xl z-[100] overflow-hidden"
                  >
                    {bankOptions.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => { setSelectedBank(o.id); setBankOpen(false); }}
                        className="w-full px-6 py-5 hover:bg-gray-100 dark:hover:bg-white/5 text-left border-b border-gray-200 dark:border-white/5 last:border-0 flex items-center gap-4 transition-colors"
                      >
                        <span className="text-blue-500 shrink-0">{o.icon}</span>
                        <span className="text-base text-gray-900 dark:text-foreground/90 font-medium">{o.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {selectedBankData?.bankDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 space-y-4"
                >
                  {/* Close button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedBank(null)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    >
                      <X className="w-4 h-4" />
                      <span>Close</span>
                    </button>
                  </div>

                  <BankDetailRow sublabel="Bank" value={selectedBankData.bankDetails.bank} />
                  <BankDetailRow sublabel="Account Name" value={selectedBankData.bankDetails.name} />

                  {/* Account number — copyable + QR */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-black/40 overflow-hidden">
                    <div
                      onClick={() => handleCopy(selectedBankData.bankDetails!.account, "Account Number")}
                      className="p-6 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 group transition-all"
                    >
                      <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-3">
                        Account Number
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-3xl font-mono tracking-widest text-gray-900 dark:text-foreground font-medium">
                          {selectedBankData.bankDetails.account}
                        </p>
                        <Copy className="w-6 h-6 opacity-30 group-hover:opacity-100 shrink-0 text-blue-500 transition-opacity" />
                      </div>
                    </div>
                    {/* QR button */}
                    <div className="px-6 pb-5 pt-0">
                      <button
                        onClick={() =>
                          handleShowQR(
                            selectedBankData.bankDetails!.account,
                            selectedBankData.label,
                            `${selectedBankData.bankDetails!.bank} · ${selectedBankData.bankDetails!.name}`
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[12px] font-medium tracking-wide transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Show QR Code
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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