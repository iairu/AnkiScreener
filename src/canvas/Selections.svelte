<script>
    import { createSelection, updateLastSelection, removeLastSelection, shots, groups } from "../store";
    import { exportSelections } from "../controller";

    let isSelecting = false;
    let isGroup = false;

    function startSelecting(e) {
        isSelecting = true;
        isGroup = e.button == 2 ? true : false;
        createSelection(isGroup, e.x, e.x, e.y, e.y);
    }
    function continueSelecting(e) {
        if (isSelecting) {
            updateLastSelection(isGroup, e.x, e.y);
        }
    }
    function stopSelecting(e) {
        isSelecting = false;
    }

    function handleLocalKeybinds(e) {
        if (["BUTTON", "INPUT"].includes(e.target.nodeName)) return;
        switch(e.key) {
            case "Enter": exportSelections(); break;
            case "x": removeLastSelection(false); break;
            case "X": removeLastSelection(false); break;
            case "c": removeLastSelection(true); break;
            case "C": removeLastSelection(true); break;
            default: break;
        }
    }
</script>

<svelte:window 
    on:keyup={handleLocalKeybinds}
/>

<selections 
    on:mousedown={startSelecting}
    on:mousemove={continueSelecting}
    on:mouseup={stopSelecting}
>
    <shots>
        {#each $shots as s, index}
            <shot style={
                    "width:" + ((s.x2 - s.x1 > 0) ? s.x2 - s.x1 : 0) + "px;"
                + " height:" + ((s.y2 - s.y1 > 0) ? s.y2 - s.y1 : 0) + "px;"
                + " left: "  + s.x1 + "px;"
                + " top:"    + s.y1 + "px;"
            }>
                <label for="shot">{index + 1}</label>
            </shot>
        {/each}
    </shots>

    <groups>
        {#each $groups as s, index}
            <group style={
                    "width:" + ((s.x2 - s.x1 > 0) ? s.x2 - s.x1 : 0) + "px;"
                + " height:" + ((s.y2 - s.y1 > 0) ? s.y2 - s.y1 : 0) + "px;"
                + " left: "  + s.x1 + "px;"
                + " top:"    + s.y1 + "px;"
            }>
                <label for="group">{"(" + (index + 1) + ") " + s.name}</label>
            </group>
        {/each}
    </groups>

</selections>