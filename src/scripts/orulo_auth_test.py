import requests

# Credenciais fornecidas
client_id = 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA'
client_secret = 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ'
redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'  # padrão para aplicações que não têm uma URL de callback

# Passo 1: Obter o código de autorização
authorization_url = f'https://www.orulo.com.br/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code'
print(f'Acesse a seguinte URL no seu navegador: {authorization_url}')
print('Após autorizar, você receberá um código. Cole-o abaixo:')

# Esperar que o usuário escreva o código de autorização
authorization_code = input('Digite o código de autorização: ')

try:
    # Passo 2: Pegar o token de acesso
    token_url = 'https://www.orulo.com.br/oauth/token'

    print('\nSolicitando token de acesso...')
    response = requests.post(token_url, data={
        'grant_type': 'authorization_code',
        'code': authorization_code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'client_secret': client_secret,
    })

    # Verifica se houve sucesso na request
    if response.status_code != 200:
        print(f'Erro ao solicitar token: {response.status_code}')
        print(f'Detalhes: {response.text}')
        raise Exception('Erro ao tentar gerar o token')

    # Extrai o token de acesso do request
    token_data = response.json()
    access_token = token_data['access_token']
    print(f'Token obtido com sucesso: {access_token[:10]}...{access_token[-5:]}')
    print(f'Tipo do token: {token_data.get("token_type", "N/A")}')
    print(f'Expiração: {token_data.get("expires_in", "N/A")} segundos')

    # Passo 3: Usa o token de acesso para fazer pedidos de API autenticados
    print('\nTestando acesso à API com o token...')
    
    # Tenta obter lista de IDs de imóveis ativos
    api_url = 'https://www.orulo.com.br/api/v2/buildings/ids/active'
    response = requests.get(api_url, headers={
        'Authorization': f'Bearer {access_token}',
    })

    # Verifica se houve sucesso na request
    if response.status_code != 200:
        print(f'Falha ao acessar a API: {response.status_code}')
        print(f'Detalhes: {response.text}')
        
        # Tenta um endpoint alternativo em caso de falha
        print('\nTentando endpoint alternativo...')
        alt_url = 'https://api.orulo.com.br/buildings?page=1&page_size=5'
        alt_response = requests.get(alt_url, headers={
            'Authorization': f'Bearer {access_token}',
        })
        
        if alt_response.status_code != 200:
            print(f'Falha no endpoint alternativo: {alt_response.status_code}')
            print(f'Detalhes: {alt_response.text}')
        else:
            print('Acesso alternativo bem-sucedido!')
            alt_data = alt_response.json()
            print(f'Total de imóveis disponíveis: {alt_data.get("count", "N/A")}')
            print(f'Resultados obtidos: {len(alt_data.get("results", []))}')
    else:
        # Extrai a lista de imóveis da resposta
        active_buildings = response.json()
        print('Acesso bem-sucedido!')
        print(f'Total de imóveis ativos: {len(active_buildings)}')
        print('Primeiros 5 IDs:')
        for building_id in active_buildings[:5]:
            print(f' - {building_id}')

except Exception as e:
    print(f'Erro durante a execução: {str(e)}')
