import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"
import { buscarImoveisOrulo, OruloBuilding } from "@/services/imovel-service"

// Função que obtém o ID da construtora logada a partir do token JWT
async function getLoggedInConstrutoraId(req: NextRequest) {
  const sessionToken = req.cookies.get("auth-token")?.value
  console.log("[DEBUG] Cookies disponíveis:", [...req.cookies.getAll().map(c => c.name)])

  if (!sessionToken) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string)
    const { payload } = await jwtVerify(sessionToken, secret)
    console.log("[DEBUG] JWT payload:", payload)

    if (payload.role !== "CONSTRUTORA") {
      console.log("[DEBUG] Role inválida:", payload.role)
      return null
    }

    // Buscar o usuário no banco de dados
    const userId = payload.id || payload.sub
    console.log("[DEBUG] Buscando usuário com ID:", userId)
    
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: { construtora: true },
    })
    
    console.log("[DEBUG] Usuário encontrado:", !!user, "Com construtora:", !!user?.construtora)

    if (!user || !user.construtora) {
      return null
    }

    return user.construtora.id
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
    return null
  }
}

// GET: Busca imóveis da construtora logada
export async function GET(req: NextRequest) {
  try {
    // Obter o ID da construtora logada
    const construtoraId = await getLoggedInConstrutoraId(req)
    console.log("[API] ID da construtora logada:", construtoraId)

    if (!construtoraId) {
      console.log("[API] Erro: Construtora não autenticada")
      return NextResponse.json(
        { success: false, message: "Construtora não autenticada" },
        { status: 401 }
      )
    }

    // Verificar configurações de integração da construtora
    const construtora = await prisma.construtora.findUnique({
      where: { id: construtoraId },
    })

    if (!construtora) {
      return NextResponse.json(
        { success: false, message: "Construtora não encontrada" },
        { status: 404 }
      )
    }

    // 1. Buscar metadados dos imóveis da Orulo vinculados a esta construtora
    const metadados = await prisma.imovelMetadata.findMany({
      where: { construtoraId },
    })
    console.log("[API] Metadados encontrados:", metadados.length, metadados)

    const idsExternos = metadados.map((meta) => meta.imovelIdExterno)
    console.log("[API] IDs externos dos imóveis:", idsExternos)

    // 2. Buscar todos os imóveis da Orulo
    const oruloResponse = await buscarImoveisOrulo(1, "", true)

    // 3. Filtrar apenas os imóveis que estão vinculados à construtora
    console.log("[API] Total de imóveis da Orulo:", oruloResponse.results.length)
    const imoveisVinculados = oruloResponse.results
      .filter((imovel: OruloBuilding) => {
        const isIncluded = idsExternos.includes(imovel.id.toString());
        if (isIncluded) console.log("[API] Imóvel vinculado encontrado:", imovel.id, imovel.name);
        return isIncluded;
      })
      .map((imovel: OruloBuilding) => {
        // Encontrar o metadado correspondente
        const meta = metadados.find(m => m.imovelIdExterno === imovel.id.toString())
        
        return {
          id: `orulo-${imovel.id}`,
          idExterno: imovel.id.toString(),
          titulo: imovel.name,
          descricao: imovel.description,
          preco: imovel.price_from || 0,
          area: imovel.min_area || 0,
          quartos: imovel.min_bedrooms || 0,
          banheiros: imovel.min_bathrooms || 0,
          vagas: imovel.min_parking || 0,
          endereco: `${imovel.address.street}, ${imovel.address.number}`,
          bairro: imovel.address.neighborhood,
          cidade: imovel.address.city,
          estado: imovel.address.state,
          cep: imovel.address.postal_code,
          latitude: imovel.address.latitude,
          longitude: imovel.address.longitude,
          imagens: imovel.images.map(img => img.url),
          construtora: construtora.nome,
          construtoraId: construtoraId,
          status: imovel.construction_status || 'Disponível',
          dataAtualizacao: new Date(imovel.updated_at).toLocaleDateString('pt-BR'),
          caracteristicas: imovel.features,
          telefone: meta?.telefone || '',
          observacoes: meta?.observacoes || ''
        }
      })

    console.log("[API] Total de imóveis vinculados:", imoveisVinculados.length)
    return NextResponse.json({
      success: true,
      imoveis: imoveisVinculados,
    })
  } catch (error) {
    console.error("Erro ao buscar imóveis da construtora:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar imóveis" },
      { status: 500 }
    )
  }
}
