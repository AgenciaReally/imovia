import { NextRequest, NextResponse } from "next/server";

// Configurações do Active Campaign
const AC_API_URL = process.env.ACTIVE_CAMPAIGN_API_URL || "https://imovia.api-us1.com"; // Substitua pelo URL correto
const AC_API_KEY = process.env.ACTIVE_CAMPAIGN_API_KEY || ""; // A chave API deve estar em variável de ambiente

/**
 * API para gerenciar tags no Active Campaign
 */
export async function POST(request: NextRequest) {
  try {
    const { email, tag } = await request.json();

    if (!email || !tag) {
      return NextResponse.json(
        { success: false, message: "Email e tag são obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Primeiro, buscar o contato pelo email
    const contatoResponse = await fetch(`${AC_API_URL}/api/3/contacts?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Api-Token": AC_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!contatoResponse.ok) {
      console.error("Erro ao buscar contato:", await contatoResponse.text());
      return NextResponse.json(
        { success: false, message: "Erro ao buscar contato no Active Campaign" },
        { status: 500 }
      );
    }

    const contatoData = await contatoResponse.json();
    
    let contatoId;
    
    // Se o contato não existir, criamos um novo
    if (contatoData.contacts.length === 0) {
      const novoContatoResponse = await fetch(`${AC_API_URL}/api/3/contacts`, {
        method: "POST",
        headers: {
          "Api-Token": AC_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: {
            email: email,
          }
        }),
      });

      if (!novoContatoResponse.ok) {
        console.error("Erro ao criar contato:", await novoContatoResponse.text());
        return NextResponse.json(
          { success: false, message: "Erro ao criar contato no Active Campaign" },
          { status: 500 }
        );
      }

      const novoContatoData = await novoContatoResponse.json();
      contatoId = novoContatoData.contact.id;
    } else {
      contatoId = contatoData.contacts[0].id;
    }

    // 2. Buscar ID da tag ou criar nova tag
    let tagId;
    
    const tagResponse = await fetch(`${AC_API_URL}/api/3/tags?search=${encodeURIComponent(tag)}`, {
      headers: {
        "Api-Token": AC_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!tagResponse.ok) {
      console.error("Erro ao buscar tag:", await tagResponse.text());
      return NextResponse.json(
        { success: false, message: "Erro ao buscar tag no Active Campaign" },
        { status: 500 }
      );
    }

    const tagData = await tagResponse.json();
    
    if (tagData.tags.length === 0) {
      // Criar a tag se não existir
      const novaTageResponse = await fetch(`${AC_API_URL}/api/3/tags`, {
        method: "POST",
        headers: {
          "Api-Token": AC_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag: {
            tag: tag,
            tagType: "contact",
            description: `Tag ${tag} para formulário de proximidades`
          }
        }),
      });

      if (!novaTageResponse.ok) {
        console.error("Erro ao criar tag:", await novaTageResponse.text());
        return NextResponse.json(
          { success: false, message: "Erro ao criar tag no Active Campaign" },
          { status: 500 }
        );
      }

      const novaTagData = await novaTageResponse.json();
      tagId = novaTagData.tag.id;
    } else {
      tagId = tagData.tags[0].id;
    }

    // 3. Aplicar a tag ao contato
    const tagContatoResponse = await fetch(`${AC_API_URL}/api/3/contactTags`, {
      method: "POST",
      headers: {
        "Api-Token": AC_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactTag: {
          contact: contatoId,
          tag: tagId
        }
      }),
    });

    if (!tagContatoResponse.ok) {
      console.error("Erro ao aplicar tag:", await tagContatoResponse.text());
      return NextResponse.json(
        { success: false, message: "Erro ao aplicar tag ao contato" },
        { status: 500 }
      );
    }

    // Resposta de sucesso
    return NextResponse.json({
      success: true,
      message: `Tag "${tag}" aplicada com sucesso ao contato ${email}`,
    });

  } catch (error) {
    console.error("Erro no processamento da requisição:", error);
    return NextResponse.json(
      { success: false, message: "Erro no processamento da requisição" },
      { status: 500 }
    );
  }
}
