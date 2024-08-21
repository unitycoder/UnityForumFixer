// ==UserScript==
// @name         UnityForumFixer
// @namespace    https://unitycoder.com/
// @version      1.0
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
      AddAssetStoreLink();
    });
})();

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
