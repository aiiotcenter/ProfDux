class StatsView {

    columns
    structureColumnIDs = []

    constructor(structureObjectArray, studentsObjectArray, quizObjectArray, examObjectArray, weightObjectArray){

        this.indexingColumn = 1,
        this.userDetailsColumns = 2,
        this.structureColumns = structureObjectArray.length,
        this.totalColumn = 1

        this.structureObjectArray = structureObjectArray;
        this.studentsObjectArray = studentsObjectArray;
        this.quizObjectArray = quizObjectArray;
        this.examObjectArray = examObjectArray;
        this.weightObjectArray = weightObjectArray;

        this.columns = this.indexingColumn + this.userDetailsColumns + this.structureColumns + this.totalColumn;
        
    }
    
    renderOuterGridTableLayout(){

        const { centerContent, tableMessageGridRow, tableMessageRow, gridContainer } = renderOuterGridTableLayout();

        this.tableMessageGridRow = tableMessageGridRow;
        this.tableMessageRow = tableMessageRow;
        this.gridContainer = gridContainer;

        const gradeStatsReviewContainer = document.querySelector(".grades-stats-review-container");
        gradeStatsReviewContainer.innerHTML = "";
        gradeStatsReviewContainer.appendChild(centerContent);

    }

    renderLoadingElement(){
        this.gridContainer.append(this.tableMessageGridRow);
    }

    changeLoadingState(message){
        this.tableMessageRow.textContent = message;
    }

    removeLoadingState(){
        this.tableMessageGridRow.style.display = "none";
    }

    render(){
        this.renderOuterGridTableLayout();
        this.tweakGridCSS();
        this.renderHeader();
        this.renderLoadingElement();
        this.renderRows();
    }

    tweakGridCSS(structureWidth = 100){

        let gridTableTemplateColumns = 
        `auto auto 1fr repeat(${this.structureColumns}, auto) auto`;

        let minWidth = '100px 100px 200px' + ` ${this.structureColumns * structureWidth}px ` + '100px';

        const root = document.querySelector(":root");
        root.style.setProperty("--number-cols", this.columns);
        root.style.setProperty("--min-width", minWidth);
        root.style.setProperty("--grid-table-template-columns", gridTableTemplateColumns);
        // root.style.setProperty("--grid-table-template-columns", gridTableTemplateColumns);
    }

    renderRows(){
        if(this.quizObjectArray.length > 0){
            this.removeLoadingState();
            this.quizObjectArray.forEach( student => this.renderGradeRow(student))
        }
        else this.changeLoadingState("No students have subscribed to this course yet");
    }

    renderHeader(){

        const gridHeader = document.createElement("ul");
        gridHeader.className = "grid-header";

        const indexCell= document.createElement("li");
        indexCell.className = "fixed100";
        indexCell.textContent = "#";

        const userImageCell = document.createElement("li");
        userImageCell.className = "fixed100";
        userImageCell.innerHTML = "Image";

        const userNameCell = document.createElement("li");
        userNameCell.className = "freefraction";
        userNameCell.textContent = "Name"

        gridHeader.append(indexCell)
        gridHeader.append(userImageCell)
        gridHeader.append(userNameCell)

        this.structureObjectArray.forEach( structure => {
            const headerCell= document.createElement("li");
            headerCell.className = "fixed150";
            headerCell.textContent = structure.name;
            gridHeader.append(headerCell)
            this.structureColumnIDs.push(structure.id);
        })

        const totalMarksCell = document.createElement("li");
        totalMarksCell.className = "fixed100";
        totalMarksCell.textContent = "Total";
        gridHeader.append(totalMarksCell)

        this.gridContainer.append(gridHeader);

    }

    renderGradeRow(rowObject){

        let { content, details, totalMark } = rowObject;

        const gridRow = document.createElement("ul");
        gridRow.className = "grid-row";

        const indexCell= document.createElement("li");
        indexCell.className = "itemization-badge fixed100";

        const userImageCell = document.createElement("li");
        userImageCell.className = "fixed100";
        userImageCell.innerHTML = 
        `  <div class="grid-cell-userimage"> 
            <img src="../uploads/${details.image}"/>
        </div>
        `;

        //TODO: async loader for images.

        const userNameCell = document.createElement("li");
        userNameCell.className = "freefraction";
        userNameCell.textContent = details.name;

        gridRow.append(indexCell)
        gridRow.append(userImageCell)
        gridRow.append(userNameCell)

        content.forEach( value => {
            const rowCell = document.createElement("li");
            rowCell.className = "fixed150";
            rowCell.textContent = value;
            gridRow.append(rowCell)
        })

        const totalMarksCell = document.createElement("li");
        totalMarksCell.className = "fixed100";
        totalMarksCell.textContent = totalMark;
        gridRow.append(totalMarksCell)

        this.gridContainer.append(gridRow);

    }
    
    renderRespectiveStudentDetails(){

    }
}

function sumFrom(object){
    return Object.entries(object).reduce((a, entry) => {
        return a + entry[1]
    }, 0)
}


function renderOuterGridTableLayout(){

    const centerContent = document.createElement("div");
    centerContent.className = "center-content";

    const extendedWrapper = document.createElement("div");
    extendedWrapper.className = "extended-wrapper";

    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-table-section user-table";

    const tableMessageGridRow = document.createElement("ul");
    tableMessageGridRow.className = "grid-row";
    const tableMessageRow = document.createElement("li");
    tableMessageRow.className = "table-message-row span-all";
    tableMessageRow.textContent = "Loading ...";
    tableMessageGridRow.appendChild(tableMessageRow);

    const slideToScrollElement = document.createElement("div");
    slideToScrollElement.className = "slide-to-scroll";
    slideToScrollElement.textContent = "scroll / slide → ";

    extendedWrapper.appendChild(gridContainer);
    extendedWrapper.appendChild(slideToScrollElement);
    centerContent.appendChild(extendedWrapper);

    return { centerContent, gridContainer, tableMessageRow, tableMessageGridRow, slideToScrollElement };

}