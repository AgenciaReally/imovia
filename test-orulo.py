import requests

# Credenciais da API Orulo
client_id = 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA'
client_secret = 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ'

# Método 1: Obter token pelo client credentials diretamente
token_url = 'https://www.orulo.com.br/oauth/token'

print('===== TESTE DA API ORULO =====')
print('Obtendo token OAuth via client credentials...')

# Solicitar token através do grant_type client_credentials
response = requests.post(token_url, data={
   'grant_type': 'client_credentials',
   'client_id': client_id,
   'client_secret': client_secret,
})

# Verifica se houve sucesso na request
if response.status_code != 200:
   print(f'Erro ao obter token: {response.status_code}')
   print(response.text)
   raise Exception('Falha ao gerar o token')

# Extrai o token de acesso do request
token_data = response.json()
access_token = token_data['access_token']
expires_in = token_data.get('expires_in', 'desconhecido')

print(f'Token obtido com sucesso!')
print(f'- Token: {access_token[:10]}...')
print(f'- Expira em: {expires_in} segundos')
print()

# Método 2: Usar o token que já temos (testando diferentes URLs)
# Token conhecido obtido anteriormente
known_token = 'ebLQ_HFn3RegIXU0D6Y7WfP1IHijjmw4heG8ZF7TuNg'

# Vamos testar diferentes endpoints
test_urls = [
    'https://www.orulo.com.br/api/v2/buildings',                # Todos os imóveis
    'https://www.orulo.com.br/api/v2/buildings?per_page=32',    # 32 imóveis por página
    'https://www.orulo.com.br/api/v2/buildings/ids/active',     # IDs ativos
]

print('===== TESTANDO DIFERENTES ENDPOINTS =====')
for url in test_urls:
    print(f'\nTentando acessar: {url}')
    
    # Teste com o token obtido agora
    response = requests.get(url, headers={
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json',
    })
    
    if response.status_code == 200:
        data = response.json()
        
        # Verificar formato da resposta
        count = 0
        if isinstance(data, dict):
            if 'results' in data and isinstance(data['results'], list):
                count = len(data['results'])
                print(f'Sucesso! Formato padrão. Imóveis encontrados: {count}')
            elif 'buildings' in data and isinstance(data['buildings'], list):
                count = len(data['buildings'])
                print(f'Sucesso! Formato buildings. Imóveis encontrados: {count}')
            elif 'count' in data:
                count = data['count']
                print(f'Sucesso! Total no count: {count}')
            else:
                print(f'Sucesso! Formato desconhecido: {list(data.keys())}')
        elif isinstance(data, list):
            count = len(data)
            print(f'Sucesso! Lista direta. Itens encontrados: {count}')
        else:
            print(f'Sucesso! Formato desconhecido: {type(data)}')
            
        # Mostrar alguns detalhes se tiver imóveis
        if count > 0:
            if isinstance(data, dict):
                if 'results' in data and data['results']:
                    print(f"Primeiro imóvel: {data['results'][0].get('name', 'Sem nome')}")
                elif 'buildings' in data and data['buildings']:
                    print(f"Primeiro imóvel: {data['buildings'][0].get('name', 'Sem nome')}")
            elif isinstance(data, list) and data:
                print(f"Primeiro item: {data[0].get('name', 'Sem nome') if isinstance(data[0], dict) else data[0]}")
    else:
        print(f'Falha! Status: {response.status_code}')
        print(f'Resposta: {response.text[:200]}...' if len(response.text) > 200 else response.text)

print('\n===== TESTE DE BUSCA COM PARÂMETROS ESPECÍFICOS =====')
search_url = 'https://www.orulo.com.br/api/v2/buildings'
params = {
    'per_page': '32',
    'city': 'São Paulo',  # Testando filtro por cidade
}

print(f'Buscando imóveis com filtros: {params}')
response = requests.get(search_url, headers={
    'Authorization': f'Bearer {access_token}',
    'Accept': 'application/json',
}, params=params)

if response.status_code == 200:
    data = response.json()
    
    # Verificar formato da resposta
    count = 0
    if isinstance(data, dict):
        if 'results' in data and isinstance(data['results'], list):
            count = len(data['results'])
        elif 'buildings' in data and isinstance(data['buildings'], list):
            count = len(data['buildings'])
        elif 'count' in data:
            count = data['count']
    elif isinstance(data, list):
        count = len(data)
        
    print(f'Sucesso! Imóveis encontrados: {count}')
else:
    print(f'Falha! Status: {response.status_code}')
    print(f'Resposta: {response.text[:200]}...' if len(response.text) > 200 else response.text)

print('\n===== TESTE CONCLUÍDO =====')
