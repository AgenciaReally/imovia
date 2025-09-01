import requests

# Código de autorização que você já obteve
authorization_code = "KNdyrEIKpFpK_b0eM4W0uoQsVF6FVMxeLG6WcZjbEt0"

# Credenciais fornecidas
client_id = 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA'
client_secret = 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ'
redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'  # padrão para aplicações sem URL

try:
    # Passo 2: Pegar o token de acesso usando o código
    print("Solicitando token de acesso com o código fornecido...")
    token_url = 'https://www.orulo.com.br/oauth/token'

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
        
        # Tenta método alternativo com client_credentials
        print('\nTentando método alternativo (client_credentials)...')
        
        alt_response = requests.post('https://api.orulo.com.br/oauth/token', json={
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret,
        }, headers={'Content-Type': 'application/json'})
        
        if alt_response.status_code != 200:
            print(f'Falha no método alternativo: {alt_response.status_code}')
            print(f'Detalhes: {alt_response.text}')
            print('\nTentando com headers X-Client-ID e X-Secret...')
            
            # Tenta com headers diretos
            header_response = requests.get('https://api.orulo.com.br/buildings?page=1&page_size=5', headers={
                'X-Client-ID': client_id,
                'X-Secret': client_secret,
                'Content-Type': 'application/json',
            })
            
            if header_response.status_code != 200:
                print(f'Falha com headers: {header_response.status_code}')
                print(f'Detalhes: {header_response.text}')
                raise Exception('Todos os métodos de autenticação falharam')
            
            header_data = header_response.json()
            print('Sucesso com headers X-Client-ID e X-Secret!')
            print(f'Total de imóveis: {header_data.get("count", "N/A")}')
            
            # Mostrar os primeiros imóveis
            if header_data.get('results'):
                print('\nPrimeiros imóveis:')
                for i, imovel in enumerate(header_data['results'][:5]):
                    print(f"\n{i+1}. {imovel.get('name', 'Sem nome')}")
                    print(f"   ID: {imovel.get('id')}")
                    if 'address' in imovel:
                        print(f"   Endereço: {imovel['address'].get('street', 'N/A')}, {imovel['address'].get('neighborhood', 'N/A')}")
                        print(f"   Cidade: {imovel['address'].get('city', 'N/A')}, {imovel['address'].get('state', 'N/A')}")
            
            exit(0)
            
        alt_data = alt_response.json()
        print('Token obtido com método client_credentials!')
        access_token = alt_data['access_token']
    else:
        # Extrai o token de acesso do request
        token_data = response.json()
        access_token = token_data['access_token']
        print(f'Token obtido com sucesso: {access_token[:15]}...')

    # Passo 3: Usa o token de acesso para fazer pedidos de API autenticados
    print('\nTestando acesso à API com o token...')
    
    # Tenta obter lista de IDs de imóveis ativos
    api_url = 'https://www.orulo.com.br/api/v2/buildings/ids/active'
    api_response = requests.get(api_url, headers={
        'Authorization': f'Bearer {access_token}',
    })

    # Verifica se houve sucesso na request
    if api_response.status_code != 200:
        print(f'Falha ao acessar endpoint principal: {api_response.status_code}')
        print(f'Detalhes: {api_response.text}')
        
        # Tenta endpoint alternativo
        print('\nTentando endpoint alternativo...')
        alt_url = 'https://api.orulo.com.br/buildings?page=1&page_size=10'
        alt_response = requests.get(alt_url, headers={
            'Authorization': f'Bearer {access_token}',
        })
        
        if alt_response.status_code != 200:
            print(f'Falha no endpoint alternativo: {alt_response.status_code}')
            print(f'Detalhes: {alt_response.text}')
            raise Exception('Não foi possível acessar a API com o token')
        
        alt_data = alt_response.json()
        print('Acesso alternativo bem-sucedido!')
        print(f'Total de imóveis: {alt_data.get("count", "N/A")}')
        
        # Mostrar os primeiros imóveis
        if alt_data.get('results'):
            print('\nPrimeiros imóveis:')
            for i, imovel in enumerate(alt_data['results'][:5]):
                print(f"\n{i+1}. {imovel.get('name', 'Sem nome')}")
                print(f"   ID: {imovel.get('id')}")
                if 'address' in imovel:
                    print(f"   Endereço: {imovel['address'].get('street', 'N/A')}, {imovel['address'].get('neighborhood', 'N/A')}")
                    print(f"   Cidade: {imovel['address'].get('city', 'N/A')}, {imovel['address'].get('state', 'N/A')}")
    else:
        # Extrai a lista de imóveis da resposta
        active_buildings = api_response.json()
        print('Acesso bem-sucedido!')
        print(f'Total de imóveis ativos: {len(active_buildings)}')
        print('Primeiros 5 IDs:')
        for building_id in active_buildings[:5]:
            print(f' - {building_id}')

except Exception as e:
    print(f'Erro durante a execução: {str(e)}')
