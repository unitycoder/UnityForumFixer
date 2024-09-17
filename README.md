# UnityForumFixer
Firefox [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)-plugin to improve Unity forums.<br>
Supports both Light & Dark themes!

### Forum link
- https://discussions.unity.com/t/browser-greasemonkey-script-to-fix-improve-new-forums-ui-ux/1507183

### Fixes
- Add Asset Store link at the top
- hide welcome banner
- remove search bar padding
- hide big bg image
- remove ALL rounded edges, note user icons are now boxes too - might change it later
- hide views icon
- hide replies icon
- hide cookie button from premium location
- move search dropdown, so that it doesnt block search bar bottom
- recent searches font size
- recent searches hover color to something reasonable
- display proper activity times in minutes, not meters : D ("1m" is now "1 minute ago")
- move "resolved" label to right of post title
- hide "unresolved" (since most topics are really unresolved..unless marked solved?)
- hide category icon (most of them seemed to be just unity logo.. might adjust later)
- adjust post title font & size
- add hover color and underline to post titles
- post topic rows, half the padding
- tags below post titles smaller font
- post activity smaller font
- hide "... or filter the topics via"
- navbar smaller padding
- areas, categories tags width to auto
- move new topic button right
- new topic drowdown description texts with different color and font size, easier to read compared to title & description in same color)
- searchbar to 100% width (still need to adjust later for better location)
- sidebar topic headers to slightly left (instead of same intendation with items)
- sidebar row heights smaller
- sidebar icons smaller
- show original poster name and topic creation date
- show last activity username
- post view: show username above user icon (instead of separately in the message area)
- post view: add gray bg for user icon area
- smaller new topics alert panel
- hide suggested topics at bottom
- make unity footer smaller and centered
- latest posts view: make main area less wide
- hot topics: disable orange color for view/reply counts
- Combine Views and Replies into one field
- Optional: Hide all "question" tags
- post view: Display registration date for OP and few other users *Note: requires JSON fetch, you can disable it by removing  PostViewFetchOPDetails() call inside update.
- and much more!

### TODO
- Main list here https://github.com/unitycoder/UnityForumFixer/issues/1

### Before
![image](https://github.com/user-attachments/assets/a2f0c084-303c-43cf-b876-0440c32e802d)

### After *current WIP
![image](https://github.com/user-attachments/assets/054e24b1-7245-4177-b9a0-f90326802606)


### Related repos (to improve Unity dev user experience)
- Unity Hub Improvements https://github.com/unitycoder/UnityHubModding
- Unity Launcher Pro https://github.com/unitycoder/UnityLauncherPro
