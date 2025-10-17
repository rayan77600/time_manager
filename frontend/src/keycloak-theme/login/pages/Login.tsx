import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Clock } from 'lucide-react'
import type { KcContext } from '../../kc.gen'
type KcContext_Login = Extract<KcContext, { pageId: 'login.ftl' }>

export default function Login({ kcContext }: { kcContext: KcContext_Login }) {
  const { url, realm, messagesPerField, login, message } = kcContext
  const errorUsername = messagesPerField.existsError('username')
    ? messagesPerField.get('username')
    : undefined
  const errorPassword = messagesPerField.existsError('password')
    ? messagesPerField.get('password')
    : undefined

  // On n'utilise plus ton onLogin client-side ici : Keycloak gère le POST.
  // Il FAUT: action={url.loginAction} et name="username"/"password".
  const demoAccounts = useMemo(
    () => [
      { label: '👤 User: user@bank.com', value: 'user@bank.com' },
      { label: '👔 Manager: manager@bank.com', value: 'manager@bank.com' },
      { label: '🏢 Admin: admin@bank.com', value: 'admin@bank.com' },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">
              {realm.displayName ?? 'Bank Clock'}
            </h1>
            <p className="text-white/70">Employee Time Management System</p>
          </div>

          {/* Messages globaux (succès/erreur) */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm border
              ${message.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'}`}
            >
              {message.summary}
            </div>
          )}

          {/* === IMPORTANT: POST vers Keycloak === */}
          <form method="post" action={url.loginAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">
                Email
              </Label>
              <Input
                id="username"
                name="username" /* requis par Keycloak */
                type="text"
                defaultValue={login.username ?? ''}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm focus:bg-white/20"
                autoFocus
                required
              />
              {errorUsername && <div className="text-red-200 text-xs mt-1">{errorUsername}</div>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Password
              </Label>
              <Input
                id="password"
                name="password" /* requis par Keycloak */
                type="password"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm focus:bg-white/20"
                required
              />
              {errorPassword && <div className="text-red-200 text-xs mt-1">{errorPassword}</div>}
            </div>

            {realm.rememberMe && (
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input type="checkbox" name="rememberMe" defaultChecked={!!login.rememberMe} />
                Remember me
              </label>
            )}

            <Button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all"
            >
              <Clock className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          {/* Démo: tu peux remplir le champ "username" côté client.
              ATTENTION: le password n'est pas utilisé en clair, Keycloak traite le POST. */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm text-center mb-3">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-white/70">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.value}
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('username') as HTMLInputElement | null
                    if (input) input.value = acc.value
                  }}
                  className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* liens keycloak */}
          <div className="mt-4 flex justify-between text-white/70 text-sm">
            {realm.resetPasswordAllowed && (
              <a href={url.loginResetCredentialsUrl} className="hover:underline">
                Forgot password?
              </a>
            )}
            {realm.registrationAllowed && (
              <a href={url.registrationUrl} className="hover:underline">
                Create account
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
