// ==UserScript==
// @name         UnityForumFixer
// @namespace    https://unitycoder.com/
// @version      0.1 (21.08.2024)
// @description  Fixes For Unity Forums
// @author       unitycoder.com
// @match        https://discussions.unity.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Run the script after the DOM is fully loaded
    window.addEventListener('DOMContentLoaded', function() 
    {
      
      AppendCustomCSS();
      AddAssetStoreLink();
      // ShowOriginalPosterInfo(); // TODO needs some css adjustments for name location
      //setTimeout(test, 1000);
      
    });
})();



function AppendCustomCSS()
{
  
	var style = document.createElement('style');
	style.textContent = 
  `
  .wrap.custom-search-banner-wrap h1 {display: none;} /* hide welcome banner */
  .wrap.custom-search-banner-wrap {padding:0px;} /* search bar padding */
	:root {--d-background-image: none !important;} /* hide big bg image */
  * { border-radius: 0 !important; } /* remove ALL rounded edges, note user icons are now boxes too - might change it later */
  .fa.d-icon.d-icon-far-eye.svg-icon.svg-string {display: none !important;} /* hide views icon */
  .fa.d-icon.d-icon-comments.svg-icon.svg-string {display: none !important;} /* hide replies icon */
  .btn.no-text.btn-icon.cookie-settings.btn-flat.onetrust-cookie-settings-toggle {display: none !important;} /* hide cookie button from premium location */
  .results {margin-top:1px; background-color:#443e3e !important;} /* move search dropdown, so that it doesnt block search bar bottom */
  .search-menu-recent {font-size:0.8em !important;} /* recent searches font size */
  .search-menu .search-link:hover,.search-menu .search-link:focus,.search-menu-container.search-link:hover,.search-menu-container.search-link:focus {background-color: #5693b0 !important} /* recent searches hover color */
	`;
	document.head.appendChild(style);
}

function AddAssetStoreLink()
{
  // Create the new list item
  var newListItem = document.createElement('li');
  var newLink = document.createElement('a');
  newLink.href = 'https://assetstore.unity.com/';
  newLink.className = '';
  newLink.textContent = 'Asset Store';
  newLink.target = '_blank';

  // Append the link to the new list item
  newListItem.appendChild(newLink);

  // Find the correct <ol> element by its class name and append the new list item
  var navMenu = document.querySelector('ol.unity-header-main-links');
  if (navMenu) {
    navMenu.appendChild(newListItem);
  }
}

function ShowOriginalPosterInfo()
{
// Select all <td> elements with the class 'posters topic-list-data'
        var posterCells = document.querySelectorAll('td.posters.topic-list-data');

        // Loop through each <td> element
        posterCells.forEach(function(cell) {
            // Select the first <a> element with a data-user-card attribute inside the current <td>
            var firstUserLink = cell.querySelector('a[data-user-card]');

            if (firstUserLink) {
                // Get the value of the data-user-card attribute
                var userCardValue = firstUserLink.getAttribute('data-user-card');

                // Create a new <div> element to display the user card value
                var userCardDiv = document.createElement('div');
                userCardDiv.textContent = userCardValue;
                userCardDiv.style.fontSize = '12px';  // Optional: make the text smaller
                userCardDiv.style.marginTop = '4px';  // Optional: add some space above the text

                // Insert the new <div> below the first image
                firstUserLink.parentNode.insertBefore(userCardDiv, firstUserLink.nextSibling);
            }
        });
}

