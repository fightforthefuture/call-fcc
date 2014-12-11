from os import listdir
from os.path import isfile, join
import re

files = [ f for f in listdir('files') if isfile(join('files',f)) ]

employees = {}
offices = {}
emails = {}

for f in files:
    with open ("files/"+f, "r") as myfile:

        data=myfile.read()
        matches = re.findall('<pre>.*?</pre>', data)

        for match in matches:

            expr = re.compile(r'&nbsp;(\w+),\s(\w+)\s+(.*)\((\d+)\)\s(\d+-\d+)\s+([\w\s]+)')
            name = re.search(expr, match)
            if name:
                fullname = name.group(2) + " " + name.group(1)
                phone = name.group(4) + "-" + name.group(5)
                office = name.group(3).strip()

                # HA HA! You think bots can't read this XD
                email = name.group(6).replace(" dot ", ".").replace(" at ", "@")

                if employees.get(fullname) == None:
                    employees[fullname] = phone
                    offices[fullname] = office
                    emails[fullname] = email

# for employee in employees:
#     print "    - name: " + employee
#     print "      number: " + employees[employee]
#     print "      office: " + offices[employee]

# print ""
# print len(employees)

print "employees = ["

for employee in employees:
    print "    {"
    print "        \"name\": \"" + employee + "\","
    print "        \"email\": \"" + emails[employee] + "\","
    print "        \"office\": \"" + offices[employee] + "\""
    print "    },"

print "];"