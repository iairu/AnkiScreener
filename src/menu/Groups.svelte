<script>
    import { groups, modifySelection, notify } from "../store";

    let lastDetailsKeyCode = 0;
    let summaryInputActive = false;

    function handleGroupName(e) {
        modifySelection(true,parseInt(e.target.getAttribute("key")),{name:e.target.value});
    }
    function handleGroupPrefix(e) {
        modifySelection(true,parseInt(e.target.getAttribute("key")),{prefix:e.target.value});
    }
    function handleGroupSuffix(e) {
        modifySelection(true,parseInt(e.target.getAttribute("key")),{suffix:e.target.value});
    }
    function preventDetailsToggle(e) {
        // bugfix for spacebar in summary's input box triggering details toggle
        if (lastDetailsKeyCode === 32 && summaryInputActive) {
            lastDetailsKeyCode = 0; // prevent infinite loop
            e.target.open = !e.target.open; // e.preventDefault() doesn't work here
        }
    }
</script>

<div id="groups">
{#each $groups as group, i}
    <details class="group" on:toggle={preventDetailsToggle} on:keydown={(e)=>{lastDetailsKeyCode = e.keyCode}}>
        <summary>
            <input type="text" key={i} placeholder={"Group " + (i + 1)} value={group.name} on:input={handleGroupName} on:blur={()=>{summaryInputActive = false}} on:focus={()=>{summaryInputActive = true}}>
        </summary>
        <div>
            <input type="text" key={i} name="prefix" id="group_n_prefix" placeholder="Prefix" value={group.prefix} on:input={handleGroupPrefix}><br>
            <input type="text" key={i} name="suffix" id="group_n_suffix" placeholder="Suffix" value={group.suffix} on:input={handleGroupSuffix}>
        </div>
    </details>
{/each}
</div>