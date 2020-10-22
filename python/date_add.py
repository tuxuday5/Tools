import datetime
import argparse
import sys

dateObj=datetime.date.today()
today=f'{dateObj.day}/{dateObj.month}/{dateObj.year}'

argParser = argparse.ArgumentParser(description="Caclulate date on delta days")
argParser.add_argument('-s','--start_date',type=str,required=False,default=today,help="Start Date (dd/mm/YYYY)")
argParser.add_argument('-d','--delta',type=int,required=True,help="Day(s) delta (10)")

parsedArgs = vars(argParser.parse_args())

try:
	parsedArgs['start_date'].index('/')
	[d,m,y] = parsedArgs['start_date'].split('/')
	d=int(d)
	m=int(m)
	y=int(y)
except ValueError as e:
	argParser.print_help()
	sys.exit(-1)


try:
	startDate = datetime.date(year=y,month=m,day=d)
except ValueError as e:
	print(e)
	argParser.print_help()
	sys.exit(-1)

delta = datetime.timedelta(days=parsedArgs['delta'])

endDate = startDate + delta

print(endDate)
