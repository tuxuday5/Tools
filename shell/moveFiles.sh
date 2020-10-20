#script to move local files/folders to external/backup location.
# normally i download in my disk. as time goes on, its gets full.
# so came up with this script to move files/folders to external drive.
#ls -1Q /downloads/
#set -x

src_folder=''
dest_folder=''

Usage()
{
	echo ""
	echo "$0: -s|--s-folder source_folder \\"
	echo -e "  -d|--destinaton-folder destination_folder \\"
	echo -e "  -f|--file-list file containing_names_of_files_or_folders"
	echo 
	echo -e "\t -s|--s-folder Folder where least used files/folders are"
	echo -e "\t -d|--d-folder Folder where least used files/folders should to be moved"
	echo -e "\t -f|--file-list File containing list of files/folders that should be moved. O/p of 'ls -lQ'"
	exit 1
}

TEMP=$(getopt -o 's:d:f:' --long 's-folder:,d-folder:,file-list:' -- "$@")

if [ $? -ne 0 ]
then
	Usage
fi

eval set -- "$TEMP"
unset TEMP

while true
do
	case "$1" in
		'-s'|'--s-folder')
			src_folder=$2
			shift 2
			continue
			;;
		'-d'|'--d-folder')
			dest_folder=$2
			shift 2
			continue
			;;
		'-f'|'--file-list')
			file_list=$2
			shift 2
			continue
			;;
		'--')
			shift
			break
			;;
		*)
			Usage
			;;
	esac
done

if [ ! -d "$src_folder" ] || [ ! -d "$dest_folder" ] || [ ! -f "$file_list" ]
then
	Usage
fi

mapfile -t <$file_list

let i=0
while [ $i -lt ${#MAPFILE[@]} ]
do
		f="${MAPFILE[$i]#\"}"
    f="${f%\"}"
    echo mv -v "$src_folder/$f" $dest_folder
    mv -v "$src_folder/$f" $dest_folder
    let i=$i+1
done
