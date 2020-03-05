# Developer Scenarios

### General usage of Graasp Desktop and opening Dev tools

**Summary**: A new developer integrates the team and needs to understand the app and how he can use it to further develop new features. He first checks whether the Developer Tools are available in the app. He opens Graasp Desktop and visits the software menu. He finds **Toggle Dev Tools** in the menu and enables it. The Dev Tools panel is opened and allows the developer to have a better understanding of the app for debugging. He also visits the **Settings** tab and turn the **Developer Mode** on. He then visits the **Developer** tab. He discovers the JSON database, and eventually checks the mapping of the data to the spaces by going back-and-forth to the spaces and the developer tab.

**Steps:**

1. Open Graasp Desktop
2. Click on **File**
3. Click on **Edit**
4. Click on **View**
5. Click on **Toggle Developer Tools**
   <br/><br/>
6. Click on **Settings**
7. Enable **Developer Mode**
8. Click on **Visit a Space**
9. Enter **_0m7on3_** to visit the _Developer Space_
10. Click on **Developer**
11. Click on **_Root > Spaces > phases > 0 > items > 0_**
12. Click on **Saved Spaces**
13. Click on the space **Developer Space**
14. Click on the phase **Documents**

---

### Testing database changes

**Summary**: To test a new feature, the developer needs to change a space content. Instead of changing it online and synching it in Graasp desktop, he turns the “Developer mode” on, and changes the database in the **Developer** tab. He checks that his changes are reported to the spaces.

**Steps:**

1. Open Graasp Desktop
2. Click on **Visit a Space**
3. Enter **_0m7on3_** to visit the _Developer Space_
4. Click on **Settings**
5. Enable **Developer Mode**
6. Click on **Developer**
7. Click on **_Root > Spaces > 0_**
8. Change _description_ with "This is a new description"
9. Click on **Saved Spaces**
10. Click on the **Developer** space
11. Click on **_Root > Spaces > 0 > phases > 1 > items > 1_**
12. Click on **Developer**
13. Change _description_ with _This is an image description written from the dveloper mode_
14. Click on **Saved Space**
15. Click on space **Developer Space**
16. Click on phase **images**

---

### Testing a created space containing a new feature

**Summary**: To verify that the new feature _Input app_ is working correctly, the developer visits, given an url, the space he created with an _input app_. He visits it and type something in the input box, and saves the space. He then goes back to the space to check if his data are saved correctly. He changes the input box with a new content, and saves the space and quits it. He comes back once again and checks whether the input app persisted the content.

**Steps:**

1. Open Graasp Desktop
2. Click on **Visit a Space**
3. Enter **_0m7on3_** to visit the _Developer Space_
4. Click on the **Visit** button
5. Click on phase **Apps and labs**
6. Enter _new input_ in the input app
7. Click on the **Save** button
8. Click on phase **Apps and labs**
9. Check the submit text is still in the input app
10. Click on the **Export Space** button and save the space
11. Click on the **Clear User data** button
12. Click on the **Export Space** button and save the space
13. Click on the **Delete** button
14. Click on **Load**
15. Click on the **Browse** button
16. Choose the space with data
17. Click on the **Load** button
18. Click on **Saved Spaces**
19. Click on space _Developer Space_
20. Click on the **Apps and labs** phase
21. Check the input is the same as before saved
22. Click on the **Delete** button
23. Click on **Load**
24. Click on the **Browse** button
25. Choose the space without data
26. Click on the **Load** button
27. Choose space with user data
28. Click on **Saved Spaces**
29. Click on space _Developer Space_
30. Click on phase **Apps and labs**
31. Check the input app does not contain any data
32. Click on the **Delete** button

---

### Testing offline and online usage

**Summary**: The desktop can be use while online and offline, therefore the developer needs to check both cases. He first opens the app while offline. He opens the menu and notices the missing tabs. He can still use the sample data and visit saved spaces. He closes the app and opens it again while online. Every tab is displayed and he can access online spaces. He also successfully syncs a space.

**Steps:**

1. Open Graasp Desktop while offline
2. Open Menu
3. Click on **Settings**
4. Enable **Developer Mode**
5. Click on **Developer**
6. Click on the **Use Sample Data** button
7. Click on **Visit a Space**
8. Enter **_0m7on3_**
9. Click on the **Visit** button. The download should fail.
10. Click on **Saved Spaces**
11. Click on the space _Sample Space_
12. Click on phases _Sample Introduction_, then _Sandbox_
13. Close Graasp
    <br/><br/>
14. Open Graasp Desktop while online
15. Open menu
16. Click on **Visit a Space**
17. Enter **_0m7on3_**
18. Click on the **Visit** button.
19. Click on phases _images_, then _links_
20. Click on the **Save** button
21. Click on the **Synchronize** button
