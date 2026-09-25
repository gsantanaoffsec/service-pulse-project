// Arquivo que será o ponto central das requisições

const apiUrl = import.meta.env.VITE_API_URL

export async function api(path: string, options?: RequestInit) {
  if (!apiUrl) {
    throw new Error('O endereço da API não foi configurado. Verifique o arquivo .env do web.')
  }

  let response: Response

  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...options?.headers,
      },
    })
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique a conexão e tente novamente.')
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Confira os campos informados. A API recusou os dados enviados.')
    }
    if (response.status === 404) {
      throw new Error('O chamado ou a atividade não foi encontrado. Ele pode ter sido excluído.')
    }
    if (response.status === 409) {
      throw new Error('Não foi possível concluir a operação por um conflito nos dados.')
    }

    throw new Error('O servidor não conseguiu concluir a operação. Tente novamente.')
  }

  if (response.status === 204) {
    return
  }

  try {
    return await response.json()
  } catch {
    throw new Error('A API retornou uma resposta inválida. Tente novamente.')
  }
}
