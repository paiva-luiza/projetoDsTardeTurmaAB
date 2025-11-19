import shutil
import os

# Pega o caminho do arquivo executado
diretorio = os.path.abspath(__file__);

# Debbug com o caminho sem o arquivo e a pasta backup/ (backup/backup.py)
print(diretorio[:-16])
# Atribuição do no caminho
diretorio = diretorio[:-16]
# Criando arquivo .zip
shutil.make_archive(
    base_name="backend_backup",
    format='zip',
    root_dir=diretorio.replace("/", "\\")
)