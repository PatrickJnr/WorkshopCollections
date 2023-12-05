// ==UserScript==
// @name         Workshop Collections Mass Add
// @namespace    http://social.grimtech.co.uk
// @version      1.0
// @description  A quick and simple script to mass add your subscribed items into a collection
// @author       PatrickJr / kluvo2
// @match        https://steamcommunity.com/sharedfiles/managecollection*
// @icon         https://steamcommunity.com/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/PatrickJnr/WorkshopCollections/main/WorkshopCollections.user.js
// @updateURL    https://raw.githubusercontent.com/PatrickJnr/WorkshopCollections/main/WorkshopCollections.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        const collectionWindow = document.querySelector('div.collectionAddItemsSection');

        // Create a container div for buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.position = 'relative';
        buttonsContainer.style.marginTop = '10px'; // Adjust the vertical position as needed
        collectionWindow.appendChild(buttonsContainer);

        // Create "Add" button
        const btnAdd = createButton('ASCM_addall', 'Add All', '120px');
        buttonsContainer.appendChild(btnAdd);

        // Create "Remove" button
        const btnRemove = createButton('ASCM_removeall', 'Remove All', '35px');
        buttonsContainer.appendChild(btnRemove);

        // Style the buttons
        btnAdd.style.backgroundColor = '#5cb85c';
        btnAdd.style.border = 'none'; // Remove border

        btnRemove.style.backgroundColor = '#d9534f';
        btnRemove.style.border = 'none'; // Remove border

        // Bind "Add" button
        btnAdd.addEventListener('click', function () {
            const items = [];
            const collectionName = jQuery('div.manageCollectionHeader div.breadcrumbs a').eq(2).text().trim();
            const url = new URL(document.location.href);
            const collectionId = url.searchParams.get('id');

            jQuery('div#MySubscribedItems div.itemChoice:not(.inCollection)').each(function () {
                const data = {
                    id: collectionId,
                    sessionid: window.g_sessionID,
                    childid: jQuery(this).attr('id').replace('choice_MySubscribedItems_', ''),
                    activeSection: collectionName
                };
                addToCollection(data, jQuery(this));
            });
        });

        // Bind "Remove" button
        btnRemove.addEventListener('click', function () {
            jQuery('div#MySubscribedItems div.itemChoice.inCollection').each(function () {
                window.RemoveChildFromCollection(jQuery(this).attr('id').replace('choice_MySubscribedItems_', ''));
            });
        });

        // Function to create a button
        function createButton(id, text, rightPosition) {
            const button = document.createElement('button');
            button.setAttribute('id', id);
            button.innerHTML = text;
            button.style.borderRadius = '2px';
            button.style.color = '#fff';
            button.style.fontSize = 'inherit';
            button.style.background = 'linear-gradient( to bottom, rgba(47,137,188,1) 5%, rgba(23,67,92,1) 95%)';
            button.style.width = 'auto';
            button.style.height = 'auto';
            button.style.textDecoration = 'none';
            button.style.padding = '5px 10px'; // Added padding for better visibility
            button.style.marginRight = '10px'; // Added margin for spacing between buttons

            return button;
        }

        // Function to send a request to add an item to a collection
        function addToCollection(data, object) {
            jQuery.ajax({
                type: 'POST',
                url: 'https://steamcommunity.com/sharedfiles/addchild',
                data: data,
                success: function (response) {
                    if (object && response.success == 1) {
                        object.addClass('inCollection');
                    }
                }
            });
        }
    }, 0);
})();
