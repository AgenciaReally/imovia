"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { ORULO_CONFIG } from "@/config/orulo"

export function OruloAuthButton() {
  const handleAuth = () => {
    // URL de autorização da Orulo
    const clientId = ORULO_CONFIG.CLIENT_ID
    const redirectUri = encodeURIComponent(window.location.origin + '/api/orulo/auth-callback')
    const responseType = 'code'
    const scope = 'buildings.read catalogs.read catalogs.write customers.read customers.write'
    
    // Construir URL de autorização
    const authUrl = `https://www.orulo.com.br/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`
    
    // Redirecionar para autorização na Orulo
    window.location.href = authUrl
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleAuth}
      className="gap-2"
    >
      <ExternalLink className="h-4 w-4" />
      Login na Orulo
    </Button>
  )
}
