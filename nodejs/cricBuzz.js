const util = require('util');
const puppeteer = require('puppeteer');

const MySleep = (secs) => {
    return new Promise( (resolve,reject) => {
        console.log("In MySleep");
        setTimeout(resolve,secs*1000);
    });
};

var GlobalFlag = true ;
console.log(util.inspect(GlobalFlag));

(async () => {
    const launchOpt = { 
        headless : false,
        slowMo : 1000,
        executablePath : '/opt/google/chrome/chrome'
    } ;

    const liveScoresSelector=	'a[href="/cricket-match/live-scores"]';
    //const scoreSelector = '.cb-scr-wll-chvrn';
    const scoreSelector = 'div[class="cb-scr-wll-chvrn"]';
    let curScore = [];
    let curScores = [];
    var curLiveScoreElements = [];
    var scores = [];

    const browser = await puppeteer.launch( { headless : false, devtools : true} );
    const page = await browser.newPage();
    page.setViewport({ width: 1366, height: 768 });

	page.on('console', msg => {
	  for (let i = 0; i < msg.args().length; ++i)
	    console.log(`${i}: ${msg.args()[i]}`);
	});

    await page.goto('https://cricbuzz.com');

    await Promise.all([
        page.$eval(liveScoresSelector, el => el.click()),
        page.waitForNavigation(),
    ]).catch( e=> console.log(e));

    GlobalFlag = true ;
    console.log(util.inspect(scoreSelector));
    await page.$$eval(scoreSelector, (ele,u) => {
        var scores = [];
        var aScore;


        scores = (ele[0]).$eval( 'div' , d => d);
        console.log(scores);

        /*
        for( var i=0;i<ele.length;i++) {
            aScore = await page.evaluate((e) => {
                new Promise.resolve(e.$eval('div', d => d.innerText));
            }, ele[i]);

            console.log(aScore);
            scores.push(aScore);
        }
        */
        return scores;
    },'test');

    /*
    while(GlobalFlag) {
        MySleep(1);
    }
    */

    console.log('end of execution' + GlobalFlag);


    //console.log(scores);
    /*
    for ( let i=0; i<curLiveScoreElements.length; i++ )  {
        divText = await curLiveScoreElements[i].$$eval('div', divs=> divs.map(d=>d.innerText));
        console.log(divText);
    }
    */
    
    //await browser.close();
})();
