import joplin from 'api';

interface CountItem {
    title : string
    count : number
}

function hasNodeCountHeader(noteBody : string) : boolean {
    const match = noteBody.match(/^(%count_plugin).*/);

    if (!match) return false

    return true
}

function extractCountData(noteBody : string) : CountItem[] {
    const lines = noteBody.split('\n');
    let values : CountItem[] = []

    for (const line of lines) {
        const match = line.match(/^([^:]*)[:\s]+(\d*).*/);
        if(!match) continue
        values.push({title: match[1], count: +match[2]})
    }

    return values
}

function updateNote(item : CountItem) {
    joplin.workspace.selectedNote().then((note) => {
        const lines = note.body.split('\n');

        let new_doc = []

        for (const line of lines) {
            if (line.startsWith(item.title)) {
                new_doc.push(`${item.title}: ${item.count}`)
            } else {
                new_doc.push(line)
            }
        }
        joplin.data.put(['notes', note.id], null, { body: new_doc.join("\n") }).then(console.log)
    })
}

joplin.plugins.register({
    onStart: async function() {
        const panel = await joplin.views.panels.create('node_count_panel')
        await joplin.views.panels.setHtml(panel, '<canvas id="countLayer"></canvas>')
        await joplin.views.panels.addScript(panel, './webview.js')
        await joplin.views.panels.hide(panel)

        await joplin.views.panels.onMessage(panel, (message) => {
            if (message.name === 'clickedTable') {
                updateNote(message.data)
            } else if (message.name === 'clickedTableSub') {
                updateNote(message.data)
            }
        });

        async function setupViewPane() {
            console.info("Setup view pane")
            const note = await joplin.workspace.selectedNote()

            if (hasNodeCountHeader(note.body)) {
                await joplin.views.panels.show(panel)

                let data = extractCountData(note.body)
                await joplin.views.panels.setHtml(panel, '<p id="dataContent" hidden>' + JSON.stringify(data) + '</p><canvas id="countLayer"></canvas>')
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
