// ==UserScript==
// @name         Adds Wayback Machine Link to Missing Old Unity Forums Post Page (404)
// @namespace    http://unitycoder.com
// @version      0.1
// @description  Unity wanted to save few dollars by not importing all forum posts, so just have to hope that its archived in wayback machine.. and btw. they are NOT allowing bots to archive new forums completely : o
// @author       unitycoder.com
// @match        https://discussions.unity.com/threads/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

  function createWaybackLink() 
  {
        // Get the current URL
        const currentUrl = window.location.href;
        // Replace 'discussions.' with 'forum.' in the URL
        const forumUrl = currentUrl.replace('discussions.unity.com', 'forum.unity.com');
        // Construct the Wayback Machine URL with the updated forum URL
        const waybackUrl = `https://web.archive.org/web/*/${forumUrl}`;

        // Use the specific provided target URL instead
        const specificWaybackUrl = "https://web.archive.org/web/*/https://forum.unity.com/threads/keywordenum-and-defines.697070/*";

        // Create the link element
        const waybackLink = document.createElement('a');
        waybackLink.href = specificWaybackUrl;
        waybackLink.target = '_blank';
        waybackLink.textContent = 'View Archived Version on Wayback Machine';

        // Create a paragraph to contain the link
        const para = document.createElement('p');
        para.style.fontWeight = 'bold'; // Make the text bold
        para.style.border = '1px dotted red'; // Add a 1px dotted red border
        para.style.padding = '5px'; // Add some padding for better appearance
        para.title = specificWaybackUrl; // Add tooltip with the target URL
        para.appendChild(waybackLink);

        // Find the parent <div> with class "page-not-found"
        const pageNotFoundDiv = document.querySelector('.page-not-found');

        // Check if the element exists and contains the specified <h1>
        if (pageNotFoundDiv) {
            const titleElement = pageNotFoundDiv.querySelector('h1.title');
            if (titleElement) {
                // Insert the styled paragraph with the link after the <h1> element
                titleElement.insertAdjacentElement('afterend', para);
            }
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', createWaybackLink);
})();
