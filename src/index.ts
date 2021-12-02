import joplin from 'api';

function hasNodeCountHeader(noteBody : string) : boolean {
    const match = noteBody.match(/^(%count_plugin).*/);

    if (!match) return false

    return true
}

joplin.plugins.register({
    onStart: async function() {
        const panel = await joplin.views.panels.create('node_count_panel')
        await joplin.views.panels.hide(panel)
        await joplin.views.panels.setHtml(panel, "Something")

        async function setupViewPane() {
            console.info("Setup view pane")
            const note = await joplin.workspace.selectedNote()

            if (hasNodeCountHeader(note.body)) {
                await joplin.views.panels.show(panel)
            } else {
                await joplin.views.panels.hide(panel)
            }
        }

        await joplin.workspace.onNoteSelectionChange(() => {
            setupViewPane()
        });

        await joplin.workspace.onNoteChange(() => {
            setupViewPane()
        });

        setupViewPane()

        console.info('Hello world. Test plugin started!');
    },
});
