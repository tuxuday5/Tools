#!/usr/bin/python
import csv
from datetime import date
import pprint

file='./Equity_Holding.xls'
outfile='./out.csv'
map_file= './company_code.map'

in_fields = [ "Company Name","LTP","Day's Change Value","Change Percentage","Portfolio Quantity","Available Quantity","Average Price","Current Market Value","Investment Cost","UnRealized Gain/Loss","UnRealized Gain/Loss Percentage","Day Gain/Loss" ]
out_fields = ['BSE/NSE/ISIN Code','Buy Date','Buy Quantity','Buy Price']
map_fields = ['Company Name','Code']

company_map = {}
code_field='Company Name'
total_record = 0

def ShouldIgnore(record):
    if record[code_field] in ('','Total'):
        return 1

    if float(record['Available Quantity']) == 0:
        return 1

    return 0


with open(map_file) as map_hand:
    map_hand = csv.DictReader(map_hand,map_fields, delimiter=',', quotechar='"')
    map_hand.next()
    for record in map_hand:
        company_map[record['Company Name']] = record['Code'] 

with open(file) as portfolio_old:
    portfolio_old_hand = csv.DictReader(portfolio_old,in_fields, delimiter=':', quotechar='"')
    portfolio_old.next()

    with open(outfile,'w') as portfolio_new:
        portfolio_new_hand = csv.DictWriter(portfolio_new,out_fields,delimiter=',')
        portfolio_new_hand.writeheader()

        out_record = {}
        for record in portfolio_old_hand:
            out_record.clear()

            #record['Buy Date'] = date(2010,01,01).strftime("%d-%m-%Y")
            record['Buy Date'] = date.today().strftime("%d-%m-%Y")

            if ShouldIgnore(record):
                print "Ignoring record ", pprint.pprint(record)
                continue


            if company_map.has_key(record['Company Name']):
                pass
            else:
                print "record doesn't eist in map", pprint.pprint(record)

            qty = float(record['Available Quantity'])
            record['Available Quantity']  = int(qty)

            out_record.update(zip(out_fields, [company_map[record['Company Name']], record['Buy Date'],record['Available Quantity'],record['Average Price']]))
            portfolio_new_hand.writerow(out_record)
            total_record+=1
            #print(company_map[record['Company Name']], record['Buy Date'],record['Available Quantity'],record['Average Price'])

print "total records " , total_record
