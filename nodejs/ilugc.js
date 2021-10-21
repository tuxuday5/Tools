const puppeteer = require('puppeteer');
const util = require('util');

const MySleep = (secs) => {
    return new Promise( (resolve,reject) => {
        setTimeout(resolve,secs*1000);
    });
};

const Url = 'https://ilugc.in/';
const Browser = false ;
const Page = false ;
const PlaceHolder = '%%%%';
const Selectors = {
    'HOME_PAGE' : 'div[class~="logo"] > a[class~="logo__link"][title="ILUGC"]',
    'RECENT_POSTS' : 'div[class~="widget__content"] > ul[class~="widget__list"] > li[class~="widget__item"]',
    'POST_ANCHOR' : 'div[class~="widget__content"] > ul[class~="widget__list"] > li[class~="widget__item"] > a',
    'POST_TITLE' : 'article[class="post"] > header[class~="post__header"] > h1[class="post__title"]',
    'POST_CONTENT' : 'article[class="post"] > div[class~="post__content"]',
    'MENU' : 'header[class="header"] > div[class~="container"] ~ a[class~="menu__toggle"]', // adjacent sibling(immediate) use ~ for general sibling
    'MENU_HIDDEN' : 'header[class="header"] > nav[class~="menu"][aria-hidden="true"]', 
    'MENU_VISIBLE' : 'header[class="header"] > nav[class~="menu"][aria-hidden="false"]', 
    'MENU_ITEMS' : 'header[class="header"] > nav > ul >  li', 
};

const MenuItems = {
    'ABOUT' : 'ABOUT',
    'FAQ' : 'FAQ',
    'CONTACT' : 'CONTACT',
    'START' : 'GETTING STARTED',
};

async function CreateBrowser() {
    return await puppeteer.launch( { headless : false , devtools : false, slowMo : 50} );
}

async function CreatePage(browser) {
    return await browser.newPage();
}

async function GotoUrl(page,url) {

    //page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { 
        options: { 'timeout' : 30*1000, 'waitUntil' : 'load' }
    });

    return page;
}

async function GetDomElements(page,selector) {
    return await page.$$(selector);
}

async function GetDomElement(page,selector) {
    var urls = await GetDomElements(selector);
    return urls[0];
}

function GetHomePageLink(page) {
    const homePageElement = GetDomElement(page,Selectors['HOME_PAGE']);
    return homePageElement.getAttribute('href');
}

async function GotoHome(page) {
    //page.setViewport({ width: 1366, height: 768 });
    const homePageUrl = GetHomePageLink(page);
    await GotoUrl(homePageUrl);

    return page;
}


async function GetRecentPostsUrls(page) {
    var posts = {};
    var href,text;

    const postsElements = await GetDomElements(page,Selectors['RECENT_POSTS']);


    for( var i=0; i<postsElements.length; i++) {
        href = await postsElements[i].$eval('a',e=>e.getAttribute('href'));
        text = await postsElements[i].$eval('a',e=>e.innerText);
        console.log(util.inspect(href));
        console.log(text);
        posts[ text ] = href;
    }

    return posts;
}

async function GetPostAnchorForHref(page,href) {
    var selector = Selectors['POST_ANCHOR'] + '[href="' + href + '"]';
    return page.$(selector);
}

async function GetRecentPosts(page) {
    var postsContents = {} ;
    var postAnchor;
    var posts = await GetRecentPostsUrls(page);

    for(var postTitle in posts) {
        postAnchor = await GetPostAnchorForHref(page,posts[postTitle]);
        postsContents[postTitle] = await GetPost(page,postAnchor);
    }

    return postsContents;
}

async function GotoPost(page,postAnchorTag) {
    await page.evaluate(e=> e.click(),postAnchorTag) ;
    await page.waitForNavigation({waitUntil:'load'});
}

async function GetPost(page,postAnchor) {
    var title,content ;

    await GotoPost(page,postAnchor);

    title   = await page.$eval(Selectors['POST_TITLE'], e=>e.innerText);
    content = await page.$eval(Selectors['POST_CONTENT'], e=>e.innerText);

    await page.goBack({waitUntil:'load'});

    return { 'title': title, 'content' : content };
}

async function GetRequiredMenuItem(page,items,item) {
    var reqdItem ;
    for( var i=0;i<items.length;i++) {
        reqdItem = await items[i].$eval('a',e=>e.innerText);
        if( reqdItem == item ) 
            return await items[i].$('a');
    }

    return Error('Given Menu Item not available ' + item);
}

async function GetMenuItem(page,item) {
    var menuItems,reqdItem;

    menuItems = await page.$$(Selectors['MENU_ITEMS']);

    reqdItem = await GetRequiredMenuItem(page,menuItems,MenuItems[item]);

    return await GetPost(page,reqdItem)
}

async function GetAbout(page) {
    return await GetMenuItem(page,'ABOUT');
}

async function GetFaq(page) {
    return await GetMenuItem(page,'FAQ');
}

async function GetContact(page) {
    return await GetMenuItem(page,'CONTACT');
}

async function GetStart(page) {
    return await GetMenuItem(page,'START');
}

async function main() {
    var browser,page;
    var ret ;

    browser = await CreateBrowser();
    page = await CreatePage(browser);

    await GotoUrl(page,Url);

    ret = await GetAbout(page);
    console.log(util.inspect(ret));

    ret = await GetFaq(page);
    console.log(util.inspect(ret));

    ret = await GetContact(page);
    console.log(util.inspect(ret));

    ret = await GetStart(page);
    console.log(util.inspect(ret));

    ret = await GetRecentPosts(page);
    console.log(util.inspect(ret));
}

main();
