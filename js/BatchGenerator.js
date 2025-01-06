class BatchGenerator {

    constructor(metadata, callbackObject, batchSize = 4){

        const {
            type,
            languages,
            educationEnvironment,
            topics,
            amount
        } = metadata;

        this.questionType = type
        this.languages = languages
        this.educationEnvironment = educationEnvironment;
        this.topics = topics;
        this.amount = amount
        this.batchSize = batchSize
        this.callback = callbackObject.callback
        this.callbackClass = callbackObject.this
    }

    async start(){

        const BATCH = this.batchSize;
        const batchArray = this.batchMatch(BATCH, this.amount);
    
        let questionsDone = 0;
        let total = this.amount;
        let quizQuestions = [];
    
        const languages = this.languages;
        const educationEnvironment = this.educationEnvironment;
        // const levels = ["easy", "medium", "hard", "difficult", "extremely difficult"];
        const levels = ["hard", "difficult"];
    
        for await(const batch of batchArray){
            
    
            const generateQuestionObject = { 
                type: this.questionType,
                languages,
                educationEnvironment,
                topics: this.topics,
                level: getRandomElement(levels)
            };
    
            try{
                let result = await generateQuestion(generateQuestionObject, batch);
                quizQuestions = [ ...quizQuestions, ...result ];
                questionsDone += batch;
                //TODO: use questionsDone;
                this.progress(batch);

            }catch(error){
                
            }
        }
    
        return quizQuestions;
    }

    progress(questionsDone){
        
        this.callback(questionsDone, this.callbackClass);
    }

    batchMatch(batch, amount){
        let _amount = amount;
        let batchArray = [];

        while(_amount > 0){
            if((_amount / batch) >= 1) batchArray.push(batch)
            else batchArray.push(_amount % batch)
            _amount -= batch;
        }
        
        
        return batchArray;
    }
}