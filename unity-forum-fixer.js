// ==UserScript==
// @name         UnityForumFixer
// @namespace    https://unitycoder.com/
// @version      0.71 (26.09.2024)
// @description  Fixes For Unity Forums  - https://github.com/unitycoder/UnityForumFixer
// @author       unitycoder.com
// @match        https://discussions.unity.com/latest
// @match        https://discussions.unity.com/t/*
// ==/UserScript==


(function() {
    'use strict';

    // Run the script after the DOM is fully loaded
    window.addEventListener('DOMContentLoaded', function() 
    {
      
      AppendCustomCSS();
      AddAssetStoreLink();
      NavBar();
      TopicsViewShowOriginalPosterInfo(); // TODO needs some css adjustments for name location
      FixPostActivityTime();
      PostViewShowOriginalPosterInfo();
			TopicsViewCombineViewAndReplyCounts();
      OnMouseOverPostPreview();
      
      setTimeout(OnUpdate, 1000); // run loop to update activity times (since some script changes them back to original..)
    });
  
})();

// runs every second to update things (if you scroll the page, need to update new data)
// TODO could be better to catch page change/update some other way (xhrevent, mutation..), since it doesnt update now if click some item (like open post)
function OnUpdate()
{
  FixPostActivityTime();
  TopicsViewShowOriginalPosterInfo();
  PostViewShowOriginalPosterInfo();
  PostViewFetchOPDetails();
  
  setTimeout(OnUpdate, 1000);
}



function AppendCustomCSS()
{
  
	var style = document.createElement('style');
	style.textContent = 
  `
  // latest posts view
	.show-more.has-topics { width: 35%;!important;} /* updated topics alert */
  .alert.alert-info.clickable {width: 35%; padding:3px !important;} /* updated topics alert */
            
  #main-outlet {width:auto !important;} /* smaller main forum width */
  
  /* replies/views: heatmap colors */
  html .heatmap-med,html .heatmap-med a,html .heatmap-med .d-icon,html .heatmap-med {color: inherit !important;}  
  html .heatmap-high,html .heatmap-high a,html .heatmap-high .d-icon,html .heatmap-high {color: inherit !important; font-weight:inherit !important;}
  
  /* post titles */
  .title.raw-link.raw-topic-link:link {font: bold 11pt 'Inter', sans-serif;}
  .title.raw-link.raw-topic-link:hover {color: rgb(82,132,189) !important;  text-decoration: underline !important;}
  body .main-link .title.raw-link.raw-topic-link:visited { font:normal !important; color: var(--primary) !important}
  
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
  .topic-list .topic-list-data:first-of-type {padding-left: 8px !important;} /* post topic rows, half the padding */
  .discourse-tags {font-size: 0.8em !important;} /* tags below post title, smaller */
  .discourse-tag.simple {border: 1px solid rgba(var(--primary-rgb), 0.05) !important;}
  
  /* if want to hide all question tags */
  /* a[data-tag-name="question"] { display: none !important; }*/
  
  .relative-date {font-size: 0.9em !important; color: rgb(150, 150, 150) !important;}
  .ember-view.bread-crumbs-left-outlet.breadcrumb-label {display: none !important;} /* "… or filter the topics via" */
  .navigation-container {--nav-space: 0 !important; padding-bottom: 6px;} /* navbar adjustments */
  .category-breadcrumb.ember-view {width:auto !important;} /* areas,categories,tags not 100% width */
	.navigation-controls { display: flex; justify-content: flex-end; width: 100%; } /* move new topic button to right, still would be nice to have in same row as other nav */
  .select-kit-row .desc { font-size: 0.92em !important; margin-top:1px; color: #777777 !important; } /* new topic dropdown descriptions */
  
  .custom-search-banner-wrap > div {max-width:100% !important;} /* search bar maxwidth, need to find better location later */
  .sidebar-wrapper {font-size: 0.99em !important;} /* sidebar */
  .sidebar-section-header-wrapper.sidebar-row {padding:4px !important;} /* sidebar headers bit to the left */
  .ember-view.sidebar-section-link.sidebar-row  {height:25px !important;} /* sidebar row heights */ 
  .sidebar-section-link-prefix .svg-icon {height: 12px !important; width: 12px !important;} /* sidebar icons smaller */
  
  /* post view, username */
	.user-name { margin-bottom: 5px; font-weight: bold; text-align: center; font-size: 0.9em; color: var(--primary); text-decoration: none; display: block; word-wrap: break-word; white-space: normal; width: 100%; } 
	.user-name:hover { color: rgb(82,132,189); text-decoration: underline; }
  .names.trigger-user-card {visibility: hidden !important;}
/*  .row { display: flex; } */
	.topic-avatar { flex-basis: 10%; margin:0 !important; max-width: 45px;} 
	.topic-body { flex-basis: 90%; } /* Ensure the main content adjusts accordingly */
  .topic-avatar {background-color: #d1d1d132;}
  .post-avatar { display: flex; flex-direction: column; align-items: center; } 
	/*.avatar { margin: 4px; } bug in topic view*/
  .topic-body {padding: 0 !important;}
  .topic-map.--op {display: none !important;} /* hide view count under op post, could move it somewhere else later */
  
  .user-signature {max-height:32px; overflow:hidden;padding: 8px 8px 4px 24px !important;} /* max size for signature */
  .avatar-flair {top:55px; right: -2px; bottom:unset !important;}
  
  
  .more-topics__container {display:none !important;} /* hide suggested topics at bottom */
  /* unity footer & content - could hide it.. but then unity is sad*/ 
  .unity-footer {font-size:0.7em !important; line-height: none !important; padding:0 !important; text-align:center !important;}
  .footer.unity-footer .unity-footer-content {padding-left:10px !important; line-height: 12px !important;}
  .unity-footer-content { display: flex; flex-direction: column; align-items: center; text-align: center; } 
	.unity-footer-menu.unity-footer-menu-legal.processed { list-style: none; padding: 0; margin: 0; display: flex; justify-content: center; }
	.unity-footer-menu.unity-footer-menu-legal.processed li { margin: 0 10px; }
  
    
  /* added custom fields */
  .original-poster-span {font: 13px 'Inter', sans-serif !important; color: rgb(150, 150, 150); } /* original poster below post title */
  .latest-poster-span { display: block; word-break: break-all; max-width: 100%; font: 14px 'Inter', sans-serif !important;} /* activity, latest poster */
	
  .combined-replies-container {display: flex;justify-content: space-between;width: 100%;white-space: nowrap; font-size:14px; margin-bottom:2px;}
  .combined-views-container {display: flex;justify-content: space-between;width: 100%;white-space: nowrap; font-size:13px;}
    
	.combined-replies-label {color: rgb(150, 150, 150); text-align: left;}
	.combined-replies-number {color: var(--primary); margin-left: auto;text-align: right; font-size:15px !important;}
	.combined-views-label {color: rgb(150, 150, 150); text-align: left;}
	.combined-views-number {color: rgb(150, 150, 150); margin-left: auto;text-align: right;}
  
	.custom-post-username {margin-bottom:3px;color: var(--primary);}
  .custom-user-creation-date {width:45px;margin-top:6px;font: 13px 'Inter', sans-serif !important; color: rgb(150, 150, 150);}
  .custom-post-preview { position: absolute; max-width: 450px; max-height: 200px; background-color: white; border: 1px solid black; padding: 5px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); z-index: 1000; }
  
  
  `;
	document.head.appendChild(style);
}

// HEADER

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

function NavBar()
{
  // remove "try the" text
  document.querySelectorAll('div[title="Try the Product Areas"] .name').forEach(el => {
    if (el.textContent.trim() === "Try the Product Areas") {
      el.textContent = "Product Areas";
    }
  });
}


// FORUM VIEW

function TopicsViewShowOriginalPosterInfo() 
{
    // Select all topic rows
    const topicRows = document.querySelectorAll('tr.topic-list-item');

    topicRows.forEach(row => {
        // Find the first 'a' element inside the 'posters topic-list-data' cell that does not have the 'latest' class (Original Poster)
        let firstPosterLink = row.querySelector('td.posters.topic-list-data a:not(.latest)');
        
        // If there is no such element, it might be a single poster with 'latest single' class
        if (!firstPosterLink) {
            firstPosterLink = row.querySelector('td.posters.topic-list-data a.latest.single');
        }

        if (firstPosterLink) {
            // Extract the username from the 'data-user-card' attribute for the original poster
            const originalPosterUsername = firstPosterLink.getAttribute('data-user-card');

            // Find the topic creation date from the title attribute in the activity column
            const activityCell = row.querySelector('td.activity');
            const titleText = activityCell ? activityCell.getAttribute('title') : '';
            const creationDateMatch = titleText.match(/Created: (.+?)(?:\n|$)/);

            let creationDateFormatted = 'Unknown'; // Default to "Unknown" if no date is found
            if (creationDateMatch) {
                const creationDateStr = creationDateMatch[1];
                const creationDate = new Date(creationDateStr);
                creationDateFormatted = formatDateString(creationDate);
            }

            // Find the 'link-bottom-line' element to insert the original poster's name and creation date before it
            const linkBottomLine = row.querySelector('td.main-link .link-bottom-line');
            if (linkBottomLine && !row.querySelector('.original-poster-span')) {
                // Create a new span element for the original poster's username and creation date
                const originalPosterSpan = document.createElement('span');
                originalPosterSpan.textContent = originalPosterUsername+","+creationDateFormatted;
                originalPosterSpan.className = 'original-poster-span'; // Adding a class to prevent duplication
                originalPosterSpan.style.display = 'block';  // Ensure it's placed as a block element

                // Insert the original poster span before the link-bottom-line
                linkBottomLine.parentNode.insertBefore(originalPosterSpan, linkBottomLine);
            }
        }

        // Find the most recent poster (always marked with 'latest')
        const latestPosterLink = row.querySelector('td.posters.topic-list-data a.latest');
        if (latestPosterLink) {
            // Extract the username from the 'data-user-card' attribute
            const latestPosterUsername = latestPosterLink.getAttribute('data-user-card');

            // Find the 'post-activity' element
            const postActivity = row.querySelector('td.activity .post-activity');
            if (postActivity && !row.querySelector('.latest-poster-span')) {
                // Create a new span element for the latest poster's username
                const latestPosterSpan = document.createElement('span');
                latestPosterSpan.textContent = latestPosterUsername;
                latestPosterSpan.className = 'latest-poster-span'; // Adding a class to prevent duplication
                latestPosterSpan.style.display = 'block';  // Ensure it's placed as a block element

                // Insert the latest poster span before the <a> tag, placing it outside the link
                postActivity.parentNode.insertBefore(latestPosterSpan, postActivity);
            }
        }
    });
}

function TopicsViewCombineViewAndReplyCounts()
{
    // Select all rows in the topic list
    const rows = document.querySelectorAll('tr.topic-list-item');

    // Iterate through each row
    rows.forEach(row => {
        // Get the "Replies" and "Views" cells
        const repliesCell = row.querySelector('td.posts');
        const viewsCell = row.querySelector('td.views');

        // Check if both cells are present
        if (repliesCell && viewsCell) {
            // Create a new cell to combine the information
            const combinedCell = document.createElement('td');
            combinedCell.className = 'num topic-list-data combined-views'; // Add class for styling if needed
            
            combinedCell.innerHTML = `
                <div class="combined-replies-container">
                    <span class="combined-replies-label">Replies:</span>
                    <span class="combined-replies-number">${repliesCell.innerText}</span>
                </div>
                <div class="combined-views-container">
                    <span class="combined-views-label">Views:</span>
                    <span class="combined-views-number">${viewsCell.innerText}</span>
                </div>
            `;

            // Insert the combined cell after the Replies cell
            repliesCell.parentNode.insertBefore(combinedCell, repliesCell);

            // Remove the original "Replies" and "Views" cells
            repliesCell.remove();
            viewsCell.remove();
        }
    });

    // Modify the header to have a single "Views" column
    const repliesHeader = document.querySelector('th.posts');
    const viewsHeader = document.querySelector('th.views');
    if (repliesHeader && viewsHeader) {
        repliesHeader.textContent = 'Views'; // Set the new header title
        viewsHeader.remove(); // Remove the "Views" header
    }
}

function FixPostActivityTime() {
    document.querySelectorAll('.relative-date').forEach(function (el) {
        const dataTime = parseInt(el.getAttribute('data-time'), 10);
        if (!dataTime) return;

        const date = new Date(dataTime);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        let timeString;
        
        if (diffInMinutes < 60) { // Less than 60 minutes
            if (diffInMinutes === 0) {
                timeString = `just now`;
            } else {
                timeString = `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
            }
        } else if (diffInHours < 24) { // Less than 24 hours
            timeString = `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) { // Within the last 7 days
            const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' }); // Get day name like 'Monday'
            const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }); // Format as "HH:MM"
            timeString = `${dayName} at ${formattedTime}`;
        } else { // Older than 7 days
            timeString = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); // Format as "20 Sep 2024"
        }

        el.textContent = timeString;
    });
}

  let prevTopicId = '';  // Global variable to store the previously fetched topicId
    let currentTooltip = null;  // Global variable to store the currently visible tooltip


    // Initialize the mouseover event handler
    function OnMouseOverPostPreview() {
        document.querySelectorAll('a.title.raw-link.raw-topic-link[data-topic-id]').forEach(function (element) {
            const topicId = element.getAttribute('data-topic-id');

            // Add mouseover event listener to the <a> elements only
            element.addEventListener('mouseover', function (event) {
                if (topicId !== prevTopicId) {  // Check if the post data was already fetched
                    fetchPostDataAndShowTooltip(event, topicId, element);
                }
            });

            // Add mouseout event listener to hide tooltip
            element.addEventListener('mouseout', function () {hideTooltip();});
        });
    }

    // Function to fetch data and display tooltip
    function fetchPostDataAndShowTooltip(event, topicId, element) 
		{
        const url = `https://discussions.unity.com/t/${topicId}.json`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Extract necessary data from JSON (limit to 250 characters)
                const rawPostContent = data['post_stream']['posts'][0]['cooked'];
          			const postContent = rawPostContent.length > 250 ? rawPostContent.substring(0, 250) + "..." : rawPostContent;
          			const plainText = stripHtmlTags(postContent);

                // Update the global variable to store the fetched topicId
                prevTopicId = topicId;

                // Create and position the tooltip based on the element's position
                showTooltip(element, plainText);
            })
            .catch(error => {
                console.error('Error fetching post data:', error);
            });
    }

    // Function to create and show the tooltip
    function showTooltip(element, content) {
        hideTooltip();  // Ensure any existing tooltip is removed first

        // Create a new tooltip element
        currentTooltip = createTooltip(content);

        // Get the bounding rectangle of the <a> element
        const rect = element.getBoundingClientRect();

        // Position the tooltip relative to the <a> element
        currentTooltip.style.top = `${window.scrollY + rect.top - currentTooltip.offsetHeight - 10}px`; // 10px above the element
        currentTooltip.style.left = `${window.scrollX + rect.left}px`;
      
      currentTooltip.addEventListener('mouseover', function () {
        hideTooltip();
	    });
    }

    // Function to hide the tooltip
    function hideTooltip() {
        if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
    }

    // Function to create a tooltip element
    function createTooltip(content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-post-preview'; // Assign the CSS class
        tooltip.textContent = content;
        document.body.appendChild(tooltip);
        return tooltip;
    }

	function stripHtmlTags(html) 
	{
    const tempDiv = document.createElement("div"); // Create a temporary <div> element
    tempDiv.innerHTML = html; // Set its inner HTML to the input HTML string
    return tempDiv.textContent || tempDiv.innerText || ""; // Return the text content without HTML tags
  }


// POST VIEW

function PostViewShowOriginalPosterInfo() 
{
    // Select all elements that contain the avatar with a data-user-card attribute
    document.querySelectorAll('.trigger-user-card.main-avatar').forEach(function(avatar) {
        // Check if the user link has already been added
        if (avatar.parentNode.querySelector('.custom-post-username')) {
            return; // Skip to the next avatar if the user link already exists
        }

        // Get the user name from the data-user-card attribute
        var userName = avatar.getAttribute('data-user-card');

        // Create a new anchor element to wrap the user name and link to the profile
        var userLink = document.createElement('a');
        userLink.className = 'custom-post-username';
        userLink.href = 'https://discussions.unity.com/u/' + userName;
        userLink.textContent = userName;

        // Insert the user name link before the avatar image
        avatar.parentNode.insertBefore(userLink, avatar);
    });
 
}

let prevPageURL = '';
function PostViewFetchOPDetails() 
{
    // Get the current page URL
    const currentPageURL = window.location.href;

    // Check if the current page URL has already been processed
    if (currentPageURL === prevPageURL) {
        console.log(`Skipping fetch for already processed page URL: ${currentPageURL}`);
        return; // Skip execution if the URL has already been processed
    }

    // Update the previous page URL to the current one
    prevPageURL = currentPageURL;

    // Select all elements with the specified classes to get usernames
    const usernames = new Set(); // Using a Set to avoid duplicates

    // Find usernames from elements with class 'trigger-user-card main-avatar'
    document.querySelectorAll('.trigger-user-card.main-avatar').forEach(function(avatar) {
        const userName = avatar.getAttribute('data-user-card');
        if (userName) {
            usernames.add(userName); // Add to the Set
        }
    });

    // Convert the Set to an Array and limit to the first 3 users
    const userArray = Array.from(usernames).slice(0, 3);

    // Iterate through each of the first three unique usernames and fetch the JSON data
    userArray.forEach(function(userName) {
        const url = `https://discussions.unity.com/u/${userName}/card.json`;

        console.log(`Fetching data from: ${url}`);

        // Use fetch to make a cross-origin request
        fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': navigator.userAgent, // Mimic the default browser's User-Agent
                'Accept': 'application/json, text/javascript, */*; q=0.01' // Accept JSON
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON data
        })
        .then(data => {
            console.log(`Data for ${userName}:`, data); // Print the JSON data to console

            // Get the user creation date
            const createdAt = data.user.created_at;
            if (createdAt) {
                // Format the creation date (optional)
                const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Create a new element to display the creation date
                const creationDateElement = document.createElement('span');
                creationDateElement.className = 'custom-user-creation-date';
                creationDateElement.textContent = `Joined: ${formattedDate}`;

                // Find all post-avatar divs associated with this user
                document.querySelectorAll('.trigger-user-card.main-avatar').forEach(function(avatarElement) {
                    if (avatarElement.getAttribute('data-user-card') === userName) {
                        const postAvatarDiv = avatarElement.closest('.post-avatar');
                        if (postAvatarDiv && !postAvatarDiv.querySelector('.custom-user-creation-date')) {
                            postAvatarDiv.appendChild(creationDateElement.cloneNode(true)); // Append the new date element to all relevant divs
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error(`Failed to fetch or parse JSON for user ${userName}:`, error);
        });
    });
}

// TODO: if page uses AJAX navigation, can run this function again when the URL changes without a full reload.
/*
window.addEventListener('popstate', function() {PostViewFetchOPDetails();});
window.addEventListener('pushstate', function() {PostViewFetchOPDetails();});
window.addEventListener('replacestate', function() {PostViewFetchOPDetails();});
*/



// HELPER METHODS

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

