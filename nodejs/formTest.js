const puppeteer = require('puppeteer');
const { Client } = require('pg');
const pgConnetDetails = require('./pg_connect.js');

const data = [
    { 'field_name' : 'fname', 'field_value' : 'fname' },
    { 'field_name' : 'lname', 'field_value' : 'lname' },
    { 'field_name' : 'email', 'field_value' : 'email@domain.com' },
    { 'field_name' : 'age'  , 'field_value' : '19' },
];

async function readCsv(csvFile) {
    var csvReaderOptions = {
        trim: true,
        allowQuotes : true,
        delimiter: ',',
        skipEmptyLines: true
    };
    
    var iStream = fs.createReadStream(csvFile,'utf8');
    var header = '';
    var csvData = [];
    
    iStream.pipe(csvReader(csvReaderOptions))
           .on('data', function (row) {
               if( header is null) {
               } else

               console.log(row);
           })
           .on('end',function (data) {
               console.log('end');
           });
}

async function checkDbData(dbData) {
    var errMsg = 'err: Data varies ';
    for( let i=0; i < data.length ; i++ ) {
        if ( dbData[data[i]['field_name']] == data[i]['field_value'] ) {
            continue;
        } else {
            return errMsg + ' ' + data[i]['field_name'] + '>' +  dbData[data[i]['field_name']] + ':' + data[i]['field_value'] ;
        }
    }

    return 'OK';
}

async function getPgData(fname,lname) {
    const pgClient =  new Client({
		host    : pgConnetDetails['host'],
		user    : pgConnetDetails['user'],
		database : pgConnetDetails['db'],
		password: pgConnetDetails['password']
	});

    var result = {};

    await pgClient.connect( (err) => {
        if(err) {
            console.log('connection error ' + err.stack);
            return result;
        } 
    });

    await pgClient.query( 'select fname,lname,email,age from registration where fname=$1 and lname=$2', [fname,lname])
        .then( res => { 
                result['fname'] = res.rows[0]['fname'];
                result['lname'] = res.rows[0]['lname'];
                result['email'] = res.rows[0]['email'];
                result['age']   = res.rows[0]['age'];
        })
        .catch( err => console.log(err));

    await pgClient.end();
    return result;
}

async function postData() {
    const browser = await puppeteer.launch( { headless : false , devtools : false, slowMo : 500} );
    const page = await browser.newPage();
    var selectorName = '';

    page.setViewport({ width: 1366, height: 768 });
    await page.goto('http://localhost/~uday/form.phtml');

    for( let i=0; i < data.length ; i++ ) {
        selectorName = 'input[name="' + data[i]['field_name'] + '"]';
        console.log(selectorName);
        await page.focus(selectorName);
        await page.keyboard.type(data[i]['field_value']);
    }

    await Promise.all([
        page.$eval('input[name="Submit"]', e=>e.click()),
        page.waitForNavigation(),
    ]).catch(e=>console.log(e));

    const result = await page.$eval('body', e => e.innerText);

    /*
     * 'Registration successfull
     * Registration failed
     */

    if( result.search(/successfull/i) >= 0 ) {
        console.log("Registration successfull");
    } else if( result.search(/failed/i) >= 0 ) {
        console.log(result);
    } else {
        console.log("Test Application error, not found success/failure");
    }

    browser.close();
}

async function run() {
    await postData();
    const dbData = await getPgData(data[0]['field_value'],data[1]['field_value']);
    
    //console.log(dbData);
    console.log( await checkDbData(dbData));
}

run();
