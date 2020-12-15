const scrapeIt = require('scrape-it');

module.exports = async (url) => {
    const options = {
        downloadLink: {
            listItem: 'div.field-items div.field-item.even ul',
            data : {
                link: {
                    selector: 'li strong a',
                    attr: 'href'
                }
            } 
        }
    }
    const result = await scrapeIt(url, options);
    return result.data.downloadLink[0].link.replace('http', 'https');
}
