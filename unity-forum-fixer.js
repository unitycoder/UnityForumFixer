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
      FixPostActivityTime();
      setTimeout(OnUpdate, 1000); // run loop to update activity times (since some script changes them back to original..)
      NavBar();
    });
})();

function OnUpdate()
{
  FixPostActivityTime();
  setTimeout(OnUpdate, 1000);
}

function AppendCustomCSS()
{
  
	var style = document.createElement('style');
	style.textContent = 
  `
  .wrap.custom-search-banner-wrap h1 {display: none;} /* hide welcome banner */
  .wrap.custom-search-banner-wrap {padding:0px;} /* remove search bar padding */
	:root {--d-background-image: none !important;} /* hide big bg image */
  * { border-radius: 0 !important; } /* remove ALL rounded edges, note user icons are now boxes too - might change it later */
  .fa.d-icon.d-icon-far-eye.svg-icon.svg-string {display: none !important;} /* hide views icon */
  .fa.d-icon.d-icon-comments.svg-icon.svg-string {display: none !important;} /* hide replies icon */
  .btn.no-text.btn-icon.cookie-settings.btn-flat.onetrust-cookie-settings-toggle {display: none !important;} /* hide cookie button from premium location */
  .results {margin-top:1px; } /* move search dropdown, so that it doesnt block search bar bottom */
  .search-menu-recent {font-size:0.8em !important;} /* recent searches font size */
  .search-menu .search-link:hover,.search-menu .search-link:focus,.search-menu-container.search-link:hover,.search-menu-container.search-link:focus {background-color: #5693b0 !important} /* recent searches hover color to something reasonable */
  .is-solved-label.solved {font-weight: normal !important; font-size: 12px !important; padding: 1px !important; user-select: text !important; float: right !important; } /* resolved tag, initial fixes */
  .badge-category__icon {display: none !important;} /* hide badge category icon for now, since most of them seem to be unity logos */
  .is-solved-label {display: none !important;} /* hide unresolved span, since all are unresolved, unless marked solved? */
  .title.raw-link.raw-topic-link {font: bold 14px/1.231 arial,helvetica,clean,sans-serif !important;} /* post title: orig forum has 13px, might use that later */
  .title.raw-link.raw-topic-link:hover {color: rgb(82,132,189) !important;  text-decoration: underline !important;} /*post title hover */
  .topic-list .topic-list-data:first-of-type {padding-left: 8px !important;} /* post topic rows, half the padding */
  .discourse-tags {font-size: 0.8em !important;} /* tags below post title, smaller */
  .post-activity {font-size: 0.9em !important;}
  .ember-view.bread-crumbs-left-outlet.breadcrumb-label {display: none !important;} /* "… or filter the topics via" */
  .navigation-container {--nav-space: 0 !important; padding-bottom: 6px;} /* navbar adjustments */
  .category-breadcrumb.ember-view {width:auto !important;} /* areas,categories,tags not 100% width */
	.navigation-controls { display: flex; justify-content: flex-end; width: 100%; } /* move new topic button to right, still would be nice to have in same row as other nav */
  .select-kit-row .desc { font-size: 0.92em !important; margin-top:1px; color: #777777 !important; } /* new topic dropdown descriptions */
  
  .custom-search-banner-wrap > div {max-width:100% !important;} /* search bar maxwidth, need to find better location later */
  .sidebar-wrapper {width: 222px !important; font-size: 0.99em !important;} /* sidebar */
  .sidebar-section-header-wrapper.sidebar-row {padding:4px !important;} /* sidebar headers bit to the left */
  .ember-view.sidebar-section-link.sidebar-row  {height:25px !important;} /* sidebar row heights */ 
  .sidebar-section-link-prefix .svg-icon {height: 12px !important; width: 12px !important;} /* sidebar icons smaller */
  
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
	posterCells.forEach(function(cell) 
	{
		// Select the first <a> element with a data-user-card attribute inside the current <td>
		var firstUserLink = cell.querySelector('a[data-user-card]');
		if (firstUserLink) 
    {
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

function FixPostActivityTime()
{
 document.querySelectorAll('.relative-date').forEach(function(el) {
            const dataTime = parseInt(el.getAttribute('data-time'), 10);
            if (!dataTime) return;

            const date = new Date(dataTime);
            const now = new Date();
            const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

            let timeString;
            if (diffInHours > 6) {
                timeString = formatDateString(date);
            } else {
                const diffInMinutes = Math.floor((now - date) / (1000 * 60));
                timeString = `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
            }

            el.textContent = timeString;
        });
}




function formatDate(date) 
{
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleTimeString('en-GB', options); // Format as "HH:MM"
}

function formatDateString(date) 
{
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  if (date >= today.setHours(0, 0, 0, 0)) { // Today
    return `Today at ${formatDate(date)}`;
  } else if (date >= yesterday.setHours(0, 0, 0, 0)) { // Yesterday
    return `Yesterday at ${formatDate(date)}`;
  } else if (date >= oneWeekAgo) { // Within the past week
    const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
    return `${dayName} at ${formatDate(date)}`;
  } else { // Older than one week
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }  
}

function NavBar()
{
  // remove "try the" text
  document.querySelectorAll('div[title="Try the Product Areas"] .name').forEach(el => {
    if (el.textContent.trim() === "Try the Product Areas") {
      el.textContent = "Product Areas";
    }
  });
}
