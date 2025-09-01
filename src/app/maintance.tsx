"use client";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
});

export default function MaintenancePage() {
  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center bg-white relative ${poppins.className}`}
      style={{ background: "linear-gradient(135deg, #fff 60%, #FE4F18 100%)" }}
    >
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl shadow-xl bg-white/80 border border-black/10 max-w-lg w-full animate-fade-in">
        <div className="mb-2 animate-wiggle">
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="33" stroke="#FE4F18" strokeWidth="4" fill="#fff" />
            <rect x="22" y="32" width="26" height="6" rx="3" fill="#FE4F18" />
            <rect x="33" y="18" width="4" height="20" rx="2" fill="#111" />
            <circle cx="35" cy="50" r="3" fill="#111" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FE4F18] text-center drop-shadow-lg">
          Em Manutenção
        </h1>
        <p className="text-lg text-black font-medium text-center max-w-xs">
          Estamos trabalhando para deixar tudo ainda melhor.<br />Volte em breve!
        </p>
        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="uppercase text-xs tracking-widest text-[#FE4F18] font-semibold">
            Imovia
          </span>
          <span className="text-xs text-neutral-500">© {new Date().getFullYear()} Todos os direitos reservados.</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full flex justify-center pb-8 pointer-events-none">
        <div className="w-32 h-2 rounded-full bg-[#FE4F18] blur-sm animate-pulse-slow" />
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          60% { transform: rotate(-15deg); }
        }
        .animate-wiggle {
          animation: wiggle 2s infinite cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </main>
  );
}
