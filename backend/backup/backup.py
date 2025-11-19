import shutil
import os

diretorio = os.getcwd();
diretorio += "\\backend\\"
print(diretorio)
if(diretorio.__contains__("\\backup")==True):
    diretorio = diretorio.replace("\\backup", "\\")
    print(diretorio)
shutil.make_archive(
    base_name="backend_backup",
    format='zip',
    root_dir=diretorio.replace("/", "\\")
)