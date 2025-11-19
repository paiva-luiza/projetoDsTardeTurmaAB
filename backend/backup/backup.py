import shutil
import os

diretorio = os.path.abspath(__file__);

print(diretorio)
# if(diretorio.__contains__("\\backup")==True):
#     diretorio = diretorio.replace("\\backup", "\\")
#     print(diretorio)
print(diretorio[:-16])
diretorio = diretorio[:-16]
shutil.make_archive(
    base_name="backend_backup",
    format='zip',
    root_dir=diretorio.replace("/", "\\")
)