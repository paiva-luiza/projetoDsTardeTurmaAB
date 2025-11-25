import shutil
import os

diretorio_backup = os.path.dirname(os.path.abspath(__file__))

diretorio_backup = os.path.dirname(os.path.dirname(diretorio_backup))

zip_path = diretorio_backup+"\\backend_backup.zip"
destino = "../backend"  # depende de onde o script está

# Remove a pasta antiga
if os.path.exists(destino):
    shutil.rmtree(destino)

# Extrai o backup no mesmo local da pasta antiga
shutil.unpack_archive(zip_path, "./backend/")
