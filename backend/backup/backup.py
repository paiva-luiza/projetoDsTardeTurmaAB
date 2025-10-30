from app.db.supabase_client import get_supabase

sb = get_supabase()

# [ ] - Pegar os dados de cada tabela e colocar num arquivo JSON
# [ ] - Pegar os arquivos do backend e colocar numa pasta separada
# [ ] - Zipar essa pasta com tudo 
data = sb.table('users').select("*").execute()
print(data.data)