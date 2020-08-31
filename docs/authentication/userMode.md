# User Modes

Though different user accounts can be created to access the application and save personal data, spaces are shared among all the users. To handle these spaces (avoid unexpected action on other users), we divide users into different categories/modes/stakeholders, leading to different permissions.

## Stakeholders in Graasp Desktop

### Teachers

Teachers need to manage spaces (as they can online) and their students. Assuming that
spaces are exclusively created and edited on the main online platform, Graasp Desktop
is primarily a common pedagogical course support to provide the spaces to their classes
in an offline context.
Additionally, teachers use Graasp Desktop to gather and browse their students’ data in
order to gain insight of their progression throughout the courses, as well as to
eventually correct their submissions.

### Students

Students use Graasp Desktop to learn in offline environments, either during classes or
remotely at home. They visit spaces created by their teacher, and might also visit other
interesting spaces if they have a stable internet connection. Additionally, students
eventually save resources and leave activity traces while visiting spaces. Such data
results in interesting analytics of their learning sessions, that students can display to
evaluate their learning progression. Finally, students share their resources with their
friends or teachers in order to be evaluated.

### Developers

Even though they are not directly related to the pedagogical purpose of the
application, developers are necessary in order to maintain and improve the
functionalities of the Graasp Desktop application. For instance, they need full access to
the database and to all the application’s features, as well as particular development
tools to implement new features.

### Researchers

Graasp Desktop is an educational support to collect meaningful data from learners,
and researchers can use it to conduct their studies. They require specific applications
to track the users, as well as a mechanism to manage consent from users to have legal
access to their data.
While Developers and Researchers also have their importance in the development of
Graasp Desktop and could have their own modes, as part of this thesis, we only focus
on teacher and student differences in order to develop a teacher mode.

|           Action            | Student  |             Teacher              |
| :-------------------------: | :------: | :------------------------------: |
|        Visit a Space        |   yes    |               yes                |
|       Export a Space        |   yes    |               yes                |
|        Save a Space         |    no    |               yes                |
|         Add a Space         |    no    |               yes                |
|       Delete a Space        |    no    |               yes                |
|        Sync a Space         |    no    |               yes                |
|        Load a Space         |    no    |               yes                |
|      Load Space's data      | no/yes\* |               yes                |
| Classrooms Functionalities  |    no    |               yes                |
| Displayed data in Dashboard | own data | own and other users' shared data |

<center>*Student*'s and *Teacher*'s permissions comparison</center>

## Implementation

Since Graasp Desktop 0.15.4, the _Student_ and _Teacher_ modes are available. By default, a user is a _Student_. To become a _Teacher_, the setting **Student Mode** should be disabled in the settings. _Developer_ and _Research_ are not yet available.
