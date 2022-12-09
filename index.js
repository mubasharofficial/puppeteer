// import puppeteer from "puppeteer";
// ( async ()=>{
//     const browser = await puppeteer.launch({
//         headless:false // open browser or not
//     });
//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     await page.screenshot({path:'example.png'});

//     await browser.close();
// })();


// import puppeteer from "puppeteer";
// ( async ()=>{
//     const browser =  await puppeteer.launch({
//         headless:true, // open browser or not
//         defaultViewport:false,
//         userDataDir:"./tmp",
//     });
//     const page =  await browser.newPage();
//     await page.goto('https://www.amazon.com/s?k=amazon+basics&crid=JB2CAJGK1KRF&sprefix=amazon+basics%2Caps%2C310&ref=nb_sb_ss_ts-doa-p_1_13');
//     //await page.screenshot({path:'example.png'});


//     const texts = await page.$$eval('.s-main-slot .s-result-list .s-search-results .sg-row',
//     divs => divs.map(({ innerText }) => innerText));
//     console.log(texts)

//     // const productHandles = await page.$eval('.s-main-slot .s-result-list .s-search-results .sg-row');
//     // console.log(productHandles)


//     // for (const producthandle of productHandles){
//     //     const  product_title = await page.evaluate(el => el.querySelector("h2 > a > span").textContent, producthandle)
//     //     console.log(product_title)
//     // }

//     await browser.close();
// })();


// import puppeteer from "puppeteer";

// (async () => {
//     const browser = await puppeteer.launch({
//         headless: true
//     });
//     const page = (await browser.pages())[0];
//     await page.goto('http://example.com');
//     const xp = page.$$();
//     const extractedText = await page.$eval('*', (el) => el.innerText);
//     console.log("welecomt scrapper");
//     console.log(extractedText);

//     await browser.close();  
// })();

/** =========================================================== */

/** GitHub fetching runnin project  practice which work perfect */

import puppeteer from "puppeteer";
import fs from "fs/promises"; // use to write & read data into file
import cron from 'node-cron'; // node js crown Job

async function start(){
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto("https://learnwebcode.github.io/practice-requests/")
// await page.screenshot({path:"amazing.png",fullPage:true});



/** scrapp  tag strong which basically name of animal & write into File */
const names =  await page.evaluate(()=>{
  return  Array.from(document.querySelectorAll(".info strong")).map(x=>x.textContent)
})
await fs.writeFile("names.txt",names.join("\r\n"));




/**  read  secrit data which is reveal after click on the button */

/** click on button */
await page.click("#clickme");
const clickedData = await page.$eval("#data",el=> el.textContent);
console.debug(clickedData)

/**  scrapp data from second page after insert text 'blue' into  #ourfield &  scrapp data from second page */

/** fill text field with text 'blue' */
await page.type("#ourfield","blue");
/**  click button inside 'ourform' div   second will wait untill page will be move to next page  */
await Promise.all([page.click("#ourform button"),page.waitForNavigation()])
/** fetch data from next page  */
const info = await page.$eval("#message",el=>el.textContent);
console.log(info)


/** scrapp images from selected page  */
const photos = await page.$$eval("img",imgs=>{
    return imgs.map(x=>x.src)
})
/** save image into folder image */
for(const photo of photos){
    const imagepage = await page.goto(photo)
                         /** writeFile('FileName', 'filebuffer')  */ 
    await fs.writeFile(photo.split("/").pop(),await imagepage.buffer())
}


browser.close();
}
// setInterval(start, 5000)  /* this will  automatic call after every 5000 milsecond*/
cron.schedule("*/5 * * * * *",start);

