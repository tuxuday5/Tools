# Tools

### Tool to move files/folders from one folder to another. Mostly from download folder to external(mounted) device.

I normally download files in a parition of my disk. As it gets to 100%, had to move some files to external disk. As i didn't want to move all files, came up with this script to move files.

To start with do **ls -lQ** on your folder and capture its output. Then manually edit the files/folders which you want to move to external device.

```
$ bash moveFiles.sh

moveFiles.sh: -s|--s-folder source_folder \
  -d|--destinaton-folder destination_folder \
  -f|--file-list file containing_names_of_files_or_folders

	 -s|--s-folder Folder where least used files/folders are
	 -d|--d-folder Folder where least used files/folders should to be moved
	 -f|--file-list File containing list of files/folders that should be moved. O/p of 'ls -lQ'

```

### Tool to add date delta to a given date.

This was conceived, as telecom operators provide X days validity. So wanted to find when my validity expires

**python3 date_add.py -s 20/10/2020 -d 84**

```
python3 date_add.py -h
usage: date_add.py [-h] [-s START_DATE] -d DELTA

Caclulate date on delta days

optional arguments:
  -h, --help            show this help message and exit
  -s START_DATE, --start_date START_DATE
                        Start Date (dd/mm/YYYY)
  -d DELTA, --delta DELTA
                        Day(s) delta (10)

```

### Tool to split sequences on their sum.

Consider the sequence 1-5. I had a requirement to split equally on their sums.
1+2+3+4+5=15. Now algorithm had 15 iterations. If i had three processes/threads, then the splits would be

1-3,4-4,5-5.
1+2+3=6 iterations for a thread 1
4=4 iterations for thread 2
5=5 iterations for thread 3

```
$ perl splitseq.pl
NAME
    splitseq.pl - split by sequence magnaitude

SYNOPSIS
    splitseq.pl [options]

    Options:

    --splits Required splits

    --end Run sequence till this number

OPTIONS
    --end   Run sequence till this number

    --splits
            Required splits

DESCRIPTION
    This program will read split by sum of sequence.
```
