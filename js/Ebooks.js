class Ebooks {
  constructor(ebooksArray) {
    this.ebooksArray = ebooksArray;
  }

  renderEbooks() {
    const ebooksOuterContainer = document.querySelector(
      ".ebooks-outer-container"
    );

    if (this.ebooksArray.length <= 0) {
      const emptyBookSet = document.createElement("div");
      emptyBookSet.className = "empty-book-set";
      emptyBookSet.textContent =
        "You are not subscribed to any courses. Ebooks will appear here from courses you have subscribed to.";
      ebooksOuterContainer.appendChild(emptyBookSet);
    }

    this.ebooksArray.forEach((course) => {
      const courseEbookContainer = document.createElement("div");
      courseEbookContainer.className = "course-ebook-container";

      const courseTitle = document.createElement("h2");
      courseTitle.className = "course-title";
      courseTitle.textContent = `${course.courseCode} : ${course.title}`;
      courseEbookContainer.appendChild(courseTitle);

      const ebookListContainer = document.createElement("div");
      ebookListContainer.className = "ebook-list-container";

      if (course.ebooks.length <= 0) {
        const emptyBookSet = document.createElement("div");
        emptyBookSet.className = "empty-book-set";
        emptyBookSet.textContent = "There are no ebooks for this course";
        ebookListContainer.appendChild(emptyBookSet);
      }

      course.ebooks.forEach((ebook) => {
        const ebookContainer = document.createElement("div");
        ebookContainer.className = "ebook-container";

        const ebookIcon = document.createElement("div");
        ebookIcon.className = "ebook-icon";

        // const ebookImageElement = document.createElement("img");
        // ebookImageElement.src = "../assets/icons/pdf.png";
        // ebookIcon.appendChild(ebookImageElement);

        let canvasElementClass = `pdf-thumbnail-${uniqueID()}`;
        let url = `../uploads/${ebook.value}`;

        const ebookCanvasElement = document.createElement("canvas");
        ebookCanvasElement.src = "../assets/icons/pdf.png";
        ebookCanvasElement.className = `pdf-thumbnail ${canvasElementClass}`;
        ebookIcon.appendChild(ebookCanvasElement);

        pdfjsLib
          .getDocument({ url, password: "" })
          .promise.then((data) => {
            initialReportState.pdfDoc = data;
            renderPDFShot("." + canvasElementClass);
          })
          .catch((err) => {
            console.log(err.message);
          });

        const ebookName = document.createElement("div");
        ebookName.className = "ebook-name";
        ebookName.textContent = ebook.title;

        ebookContainer.addEventListener("click", () => {
          openPDFViewer(url);
        });

        ebookContainer.appendChild(ebookIcon);
        ebookContainer.appendChild(ebookName);
        ebookListContainer.appendChild(ebookContainer);
      });

      courseEbookContainer.appendChild(courseTitle);
      courseEbookContainer.appendChild(ebookListContainer);

      ebooksOuterContainer.appendChild(courseEbookContainer);
    });
  }
}
