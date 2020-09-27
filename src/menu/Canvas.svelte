<script>
    import { createSelection, updateLastSelection, shots, groups, removeLastSelection } from "../store";

    let isSelecting = false;
    let isGroup = false;

    function startSelecting(e) {
        // if (!["GROUP","SHOT"].includes(e.path[0].tagName)) {
            isSelecting = true;
            isGroup = e.button == 2 ? true : false;
            createSelection(isGroup, e.x, e.x, e.y, e.y);
        // }
    }
    function continueSelecting(e) {
        if (isSelecting) {
            updateLastSelection(isGroup, e.x, e.y);
        }
    }
    function stopSelecting(e) {
        isSelecting = false;
    function handleLocalKeybinds(e) {
        switch(e.key) {
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
<cnvs 
    on:mousedown={startSelecting}
    on:mousemove={continueSelecting}
    on:mouseup={stopSelecting}
>
    <shots>
        {#each $shots as selection}
            <shot style={
                    "width:" + ((selection[1] - selection[0] > 0) ? selection[1] - selection[0] : 0) + "px;"
                + " height:" + ((selection[3] - selection[2] > 0) ? selection[3] - selection[2] : 0) + "px;"
                + " left: "  + selection[0] + "px;"
                + " top:"    + selection[2] + "px;"
            } />
        {/each}
    </shots>
    <groups>
        {#each $groups as selection}
            <group style={
                    "width:" + ((selection[1] - selection[0] > 0) ? selection[1] - selection[0] : 0) + "px;"
                + " height:" + ((selection[3] - selection[2] > 0) ? selection[3] - selection[2] : 0) + "px;"
                + " left: "  + selection[0] + "px;"
                + " top:"    + selection[2] + "px;"
            } />
        {/each}
    </groups>
</cnvs>