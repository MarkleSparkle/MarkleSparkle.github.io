//DOM content loaded
window.addEventListener('DOMContentLoaded', (event) => {

    main();

});

//global variables (URLs)
var gallerysURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
var paintingsURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=";
var galleriesGlobal;

//main code body
function main(){

    let galleriesUL = document.querySelector("#galleriesUL");
    galleriesUL.innerHTML = '<img src="./assets/loader.gif" class="loader">';

    fetch(gallerysURL)
    .then(resp => resp.json())
    .then(galleries => {

        galleriesUL.innerHTML = ""; //clear loader

        galleriesGlobal = galleries;
        galleriesUL = document.querySelector("#galleriesUL");
        for(gallery of galleries){
            //creating a list element for each gallery in the array
            let newLI = document.createElement("li");
            newLI.textContent = gallery.GalleryName;
            newLI.classList.add("galleryItem");
            newLI.value = gallery.GalleryID;
            
            //adding it to the UL
            galleriesUL.appendChild(newLI);
        }

        //adding event delegation to the UL
        galleriesUL.addEventListener("click", function(e){
            populateGallery(e);
        });

    });

}

// populateGallery populates the Gallery Info (etc.) 
// with JSON information based on click event
function populateGallery(e){

    populateGalleryInfo(e);

    //add loader before fetch executes
    let paintingUL = document.querySelector("#paintingTable");
    paintingUL.innerHTML = '<img src="./assets/loader.gif" class="loader">';

    //fetching the paintings based on the target's value (which is the GalleryID)
    fetch(paintingsURL+e.target.value)
    .then(resp2 => resp2.json())
    .then(paintings => {

        paintingUL.innerHTML = "";//clear loader

        generateTable(paintings);

    });
}


function generateTable(paintings){

    let table = document.querySelector("#paintingTable");
    let tr;
    let artist, title, year;
    let imgTd, img;

    table.textContent = ""; //erases all HTML inside table

    //generating table head
    let headTr = document.createElement("tr");
    let paintingHead = document.createElement("td");
    let artistHead = document.createElement("td");
    let titleHead = document.createElement("td");
    let yearHead = document.createElement("td");
    
    headTr.id = "columnNames";
    paintingHead.textContent ="";
    artistHead.textContent = "Artist";
    titleHead.textContent = "Title";
    yearHead.textContent = "Year";

    headTr.appendChild(paintingHead);
    headTr.appendChild(artistHead);
    headTr.appendChild(titleHead);
    headTr.appendChild(yearHead);
    table.appendChild(headTr);

    //creating click event listeners (delegation) for the click each title
    headTr.addEventListener("click", (e) => {

        switch(e.target.textContent){
            
            case "Artist":
                // got this code from https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
                // and https://www.w3schools.com/js/js_array_sort.asp
                paintings.sort(comparePaintingsByArtist);
                generateTable(paintings);
                break;
            
            case "Title":
                paintings.sort(comparePaintingsByTitle);
                generateTable(paintings);
                break;
            
            case "Year":
                paintings.sort(comparePaintingsByYear);
                generateTable(paintings);
                break;
        }

    });

    for(painting of paintings){
        //creating a table row
        tr = document.createElement("tr");

        //creating td elements
        imgTd = document.createElement("td");
        artist = document.createElement("td");
        title = document.createElement("td");
        year = document.createElement("td");

        //getting the values from the paintings (into elements)
        artist.textContent = painting.LastName;
        title.textContent = painting.Title;
        year.textContent = painting.YearOfWork;

        img = document.createElement("img");//used for adding an img element inside td
        img.src = "https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/square/"
            +painting.ImageFileName;
        img.value = painting.PaintingID;
        imgTd.appendChild(img);

            //when the images are clicked the view is switched to the Single Painting
        img.addEventListener("click", function(e){
            toggleHidden();
            populateSingleView(e, paintings);
        });
        
        //appending table data to a table row

        tr.appendChild(imgTd);
        tr.appendChild(artist);
        tr.appendChild(title);
        tr.appendChild(year);

        //appending row to the table
        table.appendChild(tr);
    }
}
    
//creating compare functions for sorting paintings 
function comparePaintingsByArtist(a, b){
    //thanks to Dylan for helping me with this code
    if (a.LastName > b.LastName) {
        return 1;
    } else if (a.LastName < b.LastName) {
        return -1;
    } else {
        return 0;
    }
}

function comparePaintingsByTitle(a, b){
    if (a.Title > b.Title) {
        return 1;
    } else if (a.Title < b.Title) {
        return -1;
    } else {
        return 0;
    }
}

function comparePaintingsByYear(a, b){
    if (a.YearOfWork > b.YearOfWork) {
        return 1;
    } else if (a.YearOfWork < b.YearOfWork) {
        return -1;
    } else {
        return 0;
    }
}

//populating Gallery Info
function populateGalleryInfo(e){
    let galleries = galleriesGlobal;
    for(gallery of galleries){
        if (gallery.GalleryID == e.target.value){
            // grab all the information of the gallery and add 
            // it to the Gallery Info section
        
            document.querySelector("#galleryName").textContent = gallery.GalleryName;
            document.querySelector("#galleryNativeName").textContent = gallery.GalleryNativeName;
            document.querySelector("#galleryCity").textContent = gallery.GalleryCity;
            document.querySelector("#galleryAddress").textContent = gallery.GalleryAddress;
            document.querySelector("#galleryCountry").textContent = gallery.GalleryCountry;
            document.querySelector("#galleryWebsite").textContent = gallery.GalleryWebSite;
        }
    }


}

function toggleHidden(){
    //toggling the Main View's visibility
    const elements = document.querySelectorAll(".mainView");
    for(element of elements){
        element.classList.toggle("hideView");
    }
    //toggling Single Painting View's visibility
    document.querySelector("#singleView").classList.toggle("hideView");
}

function populateSingleView(e, paintings){

    generateModal();

    //loops through the paintings to find the one that you clicked on
    for(painting of paintings){ 
        if(e.target.value == painting.PaintingID){
            // get html elements by ID
            // then, set the values based on the painting details

            //painting
            document.querySelector("#singleImg").src = 
            "https://res.cloudinary.com/funwebdev/image/upload/w_450/art/paintings/square/"
                +painting.ImageFileName;

            //title, artist, & desc
            document.querySelector("#singleTitle").textContent = painting.Title;
            document.querySelector("#singleArtist").textContent = "By: " + painting.FirstName + " " + painting.LastName;
            document.querySelector("#singleDescription").textContent = painting.Description;

            //misc details
            document.querySelector("#singleYear").textContent = painting.YearOfWork;
            document.querySelector("#singleMedium").textContent = painting.Medium;
            document.querySelector("#singleWidth").textContent = "450px";
            document.querySelector("#singleHeight").textContent = "450px";
            document.querySelector("#singleGalName").textContent = painting.GalleryName;
            document.querySelector("#singleGalCity").textContent = painting.GalleryCity;
            document.querySelector("#singleCopyright").innerHTML = painting.CopyrightText;
            document.querySelector("#singleMuseumLink").textContent = painting.MuseumLink;
            
            //Adding the colors
            document.querySelector("#colorsFlex").innerHTML = "";//clear all children
            let colors = painting.JsonAnnotations.dominantColors;
            for(color of colors){
                //creating the element
                let colorDiv = document.createElement("div");
                colorDiv.title = color.name;
                colorDiv.classList.add("color");
                
                //adding the background color to the element
                colorDiv.style.backgroundColor = "rgb("+color.color.red+","+color.color.green+","+color.color.blue+")";

                //appending the element
                document.querySelector("#colorsFlex").appendChild(colorDiv);

            }

        }
    }
}

/* The following JavaScript was retreived from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal_img */ 
function generateModal(){
        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var img = document.getElementById("singleImg");
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        img.onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }
    
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
    
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() { 
            modal.style.display = "none";
        }
}