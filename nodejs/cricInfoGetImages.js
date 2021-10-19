const util = require('util');
const puppeteer = require('puppeteer');
const sprintf = require('sprintf');
const fs = require('fs');
const http = require('https');

async function MySleep(secs)  {
  return new Promise( (resolve,reject) => {
    //console.log("In MySleep");
    setTimeout(resolve,secs*1000);
  });
}

async function getProperty(e,p) {
	var eh = await e.getProperty(p);
	return await eh.jsonValue();
}

async function createDir(d) {
	fs.access(d, (err) => {
		if( err ) {
			fs.mkdirSync( d, { recursive : true} ) ;
		}
	});
}

async function main() {
	var startPage;
	startPage = 'https://www.cricbuzz.com/cricket-photo-gallery';

	const defaultTimeOut = 10*1*1000; //in milli
	const startIndex = 0;
	const baseUrl = 'https://cricbuzz.com/';

  const launchOpt = { 
    headless : false,
    slowMo : 500,
    devtools : false,
    defaultViewport : {
      width : 1366,
      height : 768,
    },
		args : ['--start-fullcreen','--window-size=1366,768'],
    //executablePath : '/opt/google/chrome/chrome'
  } ;

  const browser = await puppeteer.launch( launchOpt );
  var page = await browser.newPage();

	//
  const albumSelector =	'#cb-pht-main > div[class~="cb-pht-block"] > a';
  const albumDateSelector =	'div > meta';

	const inAlbum_HeaderSelector = '#page-wrapper > div > div[class~="center-block"] > div[class="text-center"] > h1';
  const inAlbum_PhotosSelector =	'div[class~="center-block"] > ul > li[class~="pht-dtl-main"] > img';
  const inAlbum_PhotoDateSelector =	'div[class~="center-block"] > ul > li[class~="pht-dtl-main"] > meta';

	const localPath = '/downloads/Photos/cb';

	fs.access(localPath, async (err) => {
		if(err) {
			await createDir(localPath);
		}
	});

	page.setDefaultTimeout(defaultTimeOut);

	[response] = await Promise.all([
		page.goto(startPage),
		page.waitForSelector(albumSelector),
		page.keyboard.press('F11'),
	]);

  albums = await page.$$(albumSelector);
  console.log("albums count: " + albums.length );

	var albumDir;

	var albums,albumHeader,albumDate;
	var photosInAlbum;

	var inAlbum_Header;
	var photoDate,photoTitle,photo,localFile;
	var imageSrc,imageName,localFile;

  for ( let i=startIndex; i<=albums.length; i++ )  {
		albumHeader = await getProperty(albums[i],'title');
		albumDate   = await albums[i].$eval(albumDateSelector,e=>e.getAttribute('content'));

		albumDir = sprintf("%s/%s",localPath,albumDate);
		fs.access(albumDir, async (err) => {
			if(err) {
				await createDir(albumDir);
			}
		});

		console.log(sprintf("albumHeader=%s,albumDate=%s",albumHeader,albumDate));
		await albums[i].focus();

		[response] = await Promise.all([
      page.waitForNavigation({waitUntil:'load'}),
      albums[i].click(),
    ]);

		await MySleep(2);

		inAlbum_Header = await page.$eval(inAlbum_HeaderSelector,e => e.innerText);

		try {
			photosInAlbum = await page.$$(inAlbum_PhotosSelector);
		} catch (e) {
			console.log(e);
			continue; 
		}

		console.log(sprintf("In album. header=%s,photoCount=%d",inAlbum_Header,photosInAlbum.length));
		for ( let j=0; j<photosInAlbum.length; j++ )  {
			try {
				[response] = await Promise.all([
					page.waitForNavigation({waitUntil:'networkidle0',timeout:1000}),
					page.keyboard.press('PageDown'),
				]);
			} catch(e) {
				console.log(e);
			}

			photosInAlbum = await page.$$(inAlbum_PhotosSelector);

			//console.log(photosInAlbum[j]);
			imageSrc = await getProperty(photosInAlbum[j],'src');
			localFile = sprintf('%s/%s',albumDir,imageSrc.substring(imageSrc.lastIndexOf('/')+1,imageSrc.length));

			console.log(imageSrc,localFile);

			fs.access(localFile, async (err) => {
				if(err) {
					await saveImageToDisk(imageSrc,localFile);
				}
			});
			await MySleep(2);
		}

    response = await page.goBack({waitUntil:'load'});
		await MySleep(1);
		await page.waitForSelector(albumSelector);
		albums = await page.$$(albumSelector);
  }
}

async function saveImageToDisk(url, localPath) {
  var fullUrl=url;
	var fp = fs.createWriteStream(localPath);

	var request = http.get(fullUrl, function(response) {
		response.pipe(fp);
	});
}

main();
