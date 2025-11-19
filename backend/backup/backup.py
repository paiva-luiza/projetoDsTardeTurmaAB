import shutil
import os

# Caminho da pasta do script
diretorio_script = os.path.dirname(os.path.abspath(__file__))

# Caminho acima (backend/)
diretorio_backend = os.path.dirname(diretorio_script)

print("Diretório backend:", diretorio_backend)

shutil.make_archive(
    base_name="backend_backup",
    format='zip',
    root_dir=diretorio_backend.replace("/", "\\")
)