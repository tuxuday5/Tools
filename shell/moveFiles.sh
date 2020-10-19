#script to move local files/folders to external/backup location.
# normally i download in my disk. as time goes on, its gets full.
# so came up with this script to move files/folders to external drive.
source=/downloads/
dest=/media/user/external_device/
#paste this command in the local downloads folder, capture its output
#and paste it here. All the files/folders listed here will be moved to
#$dest
#ls -1Q /downloads/
files=(
"File1"
"File2"
"File3"
"File4"
"File5"
"File6"
"File7"
"File8"
"File9"
"File10"
"File11"
"File12"
"File13"
)

let i=0
while [ $i -lt ${#files[@]} ]
do
    f="${files[$i]}"
    echo mv -v "$source/$f" $dest
    mv -v "$source/$f" $dest
    let i=$i+1
done
