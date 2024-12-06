function performSearch(query, corpusObjectArray) {

    const matches = [];
    let bestMatchCount = 0;

    corpusObjectArray.forEach( corpus => {
        corpus.forEach( (paragraph, index) => {

            const keywordCount = countKeywords(paragraph.toLowerCase(), query.toLowerCase());
            
            if(keywordCount > 0) matches.push({[`page ${index+1}`]: paragraph});
    
            if (keywordCount > bestMatchCount) {
                bestMatch = paragraph;
                bestMatchCount = keywordCount;
            }
            
        })
    });


    return matches;

    
}

function countKeywords(text, query) {
    return query.split(' ').reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0);
    }, 0);
}

function joinSearchResult(results){
    
    return results.map( result => {
        const entry = Object.entries(result)[0];


        
        

        return `page - ${entry[0]} : [${entry[1]}]`
    }
    ).join(",\n");
}

function getPagesFrom(url){

    let result = pdfjsLib.getDocument(url).promise.then( async(pdf) => {
    
        let numberOfPages = pdf.numPages;
        let content = [];
    
        for(let i = 1; i <= numberOfPages; i++){
        
            let pagePromise = await pdf.getPage(i);
            let pageContent = await pagePromise.getTextContent();
    
            content.push({ [i] : pageContent });
        }
    
        return content;
    
        })
        
    return result.then( pages => {
    
        
    
        let entries = Object.entries(pages);
        let paragraphs = [];
    
        entries.forEach( page => {
    
            let key = Number(page[0]) + 1;
            let lines = page[1][key].items;
            let paragraph = "";
    
            lines.forEach( line => {
                if(line.str != ""){
                    paragraph += line.str;
                    // paragraphs.push(paragraph);
                    // paragraph = "";
                }
            })
    
            paragraphs.push(paragraph)
        })
    
        return paragraphs;
    
    });
}