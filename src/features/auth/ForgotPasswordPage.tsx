// pages/ForgotPasswordPage.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const { email, setEmail, loading, handleSubmit, success } = useForgotPassword();

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Logos flottants */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src="/logoexony.png"
            alt="Floating Logo"
            className="absolute w-20 h-20 opacity-30 animate-slide"
            style={{
              top: `${i * 15}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Formulaire ou Message de succès */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <img src="/logoexony.png" alt="Logo Exony" className="h-14 w-14" />
          <h2 className="text-2xl font-semibold text-[#F8A67E]">
            Mot de passe oublié
          </h2>
        </div>

        {success ? (
          <p className="text-green-600 font-medium">
            Vérifiez votre email afin de confirmer et changer votre mot de passe.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-600">
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </p>

            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-[#F8A67E] focus:border-[#F8A67E]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{ background: "#F8A67E" }}
              className="w-full hover:bg-[#f79469] text-white font-semibold rounded-md"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
