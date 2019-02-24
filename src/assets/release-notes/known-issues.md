# Known Issues
    
*   **Windows** - Windows will throw a Smart Screen error on initial Application install. This is due to the app not having Code Signing Certificates. If users wish to use the App, they will need to click "More Info" then click "Run Anyway".
*   **All**  - Sorting a Task List by assignee will group similiar user names together, but will not actually sort them alphabetically.
*   **Windows** - Application won't start without an active network connection, does not have to be an internet connection, just any old connection will do. This is an upstream issue with the Electron Framework.
*   **All** - Application can be slow to log in. App will auto log in regardless of having an internet connection or not, but it does get hung up if the connection is flakey. Workaround is to just temporarily disconnect internet. App will imediately log in and the connection can be restored. This is an upstream issue with the Authentication provider.