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
8. Click on **Developer**
9. [play with database]

---

### Testing database changes

**Summary**: To test a new feature, the developer needs to change a space content. Instead of changing it online and synching it in Graasp desktop, he turns the “Developer mode” on, and changes the database in the **Developer** tab. He checks that his changes are reported to the spaces.

**Steps:**

1. Open Graasp Desktop
2. Click on **Settings**
3. Enable **Developer Mode**
4. Click on **Developer**
5. Change X in X
6. Click on **Saved Spaces**
7. Click on the X space
8. Click on phase X
9. Click on **Developer**
10. Change X in Y
11. Click on **Saved Space**
12. Click on Y space
13. Click on phase Y

---

### Testing a created space containing a new feature

**Summary**: To verify that a new feature is working correctly, the developer visits, given an url, the space he created. This space contains his newly developped feature. He visits it and eventually saves it. He then goes back to the space to check if everything is saved correctly. He saves his data and quits the space. He comes back and checks his data were correctly saved and provided. Then he exports the space twice: with its data inputs and without it. He deletes the space. He finally imports both its data and checks everything went well.

**Steps:**

1. Open Graasp Desktop
2. Click on **Visit Space**
3. Enter XX
4. [check space]
5. Click on the **Save** button
6. Click on **Saved Spaces**
7. Click on space X
8. [check space]
9. Click on **Saved Spaces**
10. [check space]
11. Click on the **Export Space** button
12. Click on the **Clear User data** button
13. Click on **Export Space**
14. Click on **Delete Space**
15. Click on the **Load Space** button
16. Choose space without user data
17. [check space]
18. Click on the **Load Space** button
19. Choose space with user data
20. [check space]

---

### Testing offline and online usage

**Summary**: The desktop can be use while online and offline, therefore the developer needs to check both cases. He first opens the app while offline. He opens the menu and notices the missing tabs. He can still visit saved spaces. He cannot sync spaces. He closes the app and opens it again while online. Every tab is displayed and he can access online spaces. He also successfully syncs a space.

**Steps:**

1. Open Graasp Desktop while offline
2. Open Menu
3. Click on **Visit Space**
4. Enter X
5. Click on **Saved Spaces**
6. Click on space X
7. Close Graasp
   <br/><br/>
8. Open Graasp Desktop while online
9. Open menu
10. Click on **Saved Spaces**
11. Click on the **Synchronize** button of space X
12. Click on **Settings**
13. Enable **geolocation**
14. Click on **Spaces Nearby**
15. [check space]
