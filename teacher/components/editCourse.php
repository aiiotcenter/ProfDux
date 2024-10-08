<script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>

<div class="inner-header">
    <div style="display:grid; grid-gap: 10px;">
        <h1 class="medium-title" id="course-title"></h1>
        <p class="small-title" id="course-code"></p>
        <div class="button" id="editLearningObjectives" style="justify-self:start;">
            <text>Edit Learning Objectives</text> 
        </div>
        <div class="button" id="deleteCourseButton" style="justify-self:start;">
            <text>Delete Course</text> 
        </div>
    </div>

    <div class="simple-grid">
        <div class="button" id="saveCourseDetails">
            <text>Save</text>
        </div>
        <div class="button" id="addNewLecture">
            <text>Add New Lecture</text>
        </div>
    </div>
</div>

<div class="grid-container" id="course-grid-container">
</div>
