const puppeteer = require('puppeteer');

(async () => {
    const launchOpt = { 
        headless : true,
        slowMo : 1000,
        //executablePath : '/opt/google/chrome/chrome'
    } ;

    const liveScoresSelector=	'a[href="/cricket-match/live-scores"]';
    const scoreSelector = '.cb-scr-wll-chvrn';
    //const scoreSelector = 'div[class="cb-scr-wll-chvrn"]';
    let curScore = [];
    let curScores = [];
    var curLiveScoreElements = [];
    var scores = [];

    const browser = await puppeteer.launch( { headless : false, devtools : false} );
    const page = await browser.newPage();
    page.setViewport({ width: 1366, height: 768 });

    /*
	page.on('console', msg => {
	  for (let i = 0; i < msg.args().length; ++i)
	    console.log(`${i}: ${msg.args()[i]}`);
	});
    */

    await page.goto('https://cricbuzz.com');

    await Promise.all([
        page.$eval(liveScoresSelector, el => el.click()),
        page.waitForNavigation(),
    ]).catch( e=> console.log(e));

    curLiveScoreElements = await page.$$(scoreSelector)

    for ( let i=0; i<curLiveScoreElements.length; i++ )  {
        divText = await curLiveScoreElements[i].$$eval('div', divs=> divs.map(d=>d.innerText));
        console.log(divText);
    }
    
    await browser.close();
})();
