// function includeHTML() {
//     var z, i, elmnt, file, xhttp;
//     /*loop through a collection of all HTML elements:*/
//     z = document.getElementsByTagName("*");
//     for (i = 0; i < z.length; i++) {
//         elmnt = z[i];
//         /*search for elements with a certain atrribute:*/
//         file = elmnt.getAttribute("include-html");
//         if (file) {
//             /*make an HTTP request using the attribute value as the file name:*/
//             xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function () {
//                 if (this.readyState == 4) {
//                     if (this.status == 200) { elmnt.innerHTML = this.responseText; }
//                     // if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
//                     /*remove the attribute, and call this function once more:*/
//                     elmnt.removeAttribute("include-html");
//                     includeHTML();
//                 }
//             }
//             xhttp.open("GET", file, true);
//             xhttp.send();
//             /*exit the function:*/
//             return;
//         }
//     }
// };

function includeHTML() {
    const elements = document.querySelectorAll('[include-html]');
    elements.forEach(elmnt => {
        const file = elmnt.getAttribute("include-html");
        if (file) {
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok. Status: ' + response.status);
                    }
                    return response.text();
                })
                .then(data => {
                    elmnt.innerHTML = data;
                    elmnt.removeAttribute("include-html");
                })
                .catch(error => console.error('Error loading the include file:', file, error));
        }
    });
}

// Ensure the DOM is fully loaded before running the function
document.addEventListener('DOMContentLoaded', includeHTML);

